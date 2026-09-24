#!/usr/bin/env node
/**
 * Static import graph for src/: who imports whom, line + kind per site.
 * Optionally writes codemap-surface.json (exports + local TS import edges + mapGuide).
 * Uses TypeScript module resolution (tsconfig.app.json paths, e.g. @/*).
 */

import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const IGNORE_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.vite',
  '.vercel',
  'coverage',
  'playwright-report',
  'test-results',
  '.pnpm-store',
])

/** @param {string} absRoot */
async function walkTsImporters(absRoot) {
  /** @type {string[]} */
  const out = []
  async function walk(absDir) {
    const entries = await fs.readdir(absDir, { withFileTypes: true })
    for (const ent of entries) {
      if (IGNORE_DIR_NAMES.has(ent.name)) continue
      const abs = path.join(absDir, ent.name)
      if (ent.isDirectory()) {
        await walk(abs)
      } else if (ent.isFile() && /\.(tsx?)$/.test(ent.name) && !ent.name.endsWith('.d.ts')) {
        out.push(abs)
      }
    }
  }
  await walk(absRoot)
  return out.sort((a, b) => a.localeCompare(b))
}

/** @param {string} absSrc */
async function walkSrcTargets(absSrc) {
  /** @type {string[]} */
  const out = []
  async function walk(absDir, rel) {
    const entries = await fs.readdir(absDir, { withFileTypes: true })
    for (const ent of entries) {
      const abs = path.join(absDir, ent.name)
      const r = rel ? `${rel}/${ent.name}` : ent.name
      if (ent.isDirectory()) {
        await walk(abs, r)
      } else if (
        ent.isFile() &&
        (/\.(tsx?|json|css)$/.test(ent.name)) &&
        !ent.name.endsWith('.d.ts')
      ) {
        out.push(abs)
      }
    }
  }
  try {
    await fs.stat(absSrc)
  } catch {
    return []
  }
  await walk(absSrc, '')
  return out.sort((a, b) => a.localeCompare(b))
}

/**
 * @param {string} projectRoot
 * @param {string} absPath
 */
function relPosix(projectRoot, absPath) {
  return path.relative(projectRoot, path.normalize(absPath)).split(path.sep).join('/')
}

/**
 * @param {string} resolvedAbs
 * @param {string} projectRoot
 */
function isProjectRefTarget(resolvedAbs, projectRoot) {
  const rel = path.relative(projectRoot, resolvedAbs)
  if (rel.startsWith('..') || rel.includes(`..${path.sep}`)) return false
  if (rel.split(path.sep).includes('node_modules')) return false
  if (resolvedAbs.endsWith('.d.ts')) return false
  return /\.(tsx?|css|json)$/.test(resolvedAbs)
}

/**
 * When TS cannot resolve (e.g. .css), map @/ and relative paths to disk.
 * @param {string} specifier
 * @param {string} containingFile
 * @param {string} projectRoot
 */
function tryResolveLocalSpecifier(specifier, containingFile, projectRoot) {
  if (specifier.startsWith('@/')) {
    return path.normalize(path.join(projectRoot, 'src', specifier.slice(2)))
  }
  if (specifier.startsWith('.')) {
    return path.normalize(path.resolve(path.dirname(containingFile), specifier))
  }
  return null
}

/**
 * @param {import('typescript').SourceFile} sourceFile
 * @param {import('typescript').Node} node
 */
function lineOf(sourceFile, node) {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false))
  return line + 1
}

function hasExportModifier(node) {
  const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined
  return mods?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

function hasDefaultModifier(node) {
  const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined
  return mods?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) ?? false
}

/**
 * @param {import('typescript').Node} decl
 * @param {{ name: string, kind: string, from?: string }[]} out
 */
function pushDeclarationExports(decl, out) {
  if (ts.isFunctionDeclaration(decl)) {
    if (decl.name) {
      out.push({
        name: decl.name.text,
        kind: hasDefaultModifier(decl) ? 'default-function' : 'function',
      })
    } else if (hasDefaultModifier(decl)) {
      out.push({ name: 'default', kind: 'default-function' })
    }
    return
  }
  if (ts.isClassDeclaration(decl)) {
    if (decl.name) {
      out.push({
        name: decl.name.text,
        kind: hasDefaultModifier(decl) ? 'default-class' : 'class',
      })
    } else if (hasDefaultModifier(decl)) {
      out.push({ name: 'default', kind: 'default-class' })
    }
    return
  }
  if (ts.isInterfaceDeclaration(decl)) {
    out.push({ name: decl.name.text, kind: 'interface' })
    return
  }
  if (ts.isTypeAliasDeclaration(decl)) {
    out.push({ name: decl.name.text, kind: 'type' })
    return
  }
  if (ts.isEnumDeclaration(decl)) {
    out.push({ name: decl.name.text, kind: 'enum' })
    return
  }
  if (ts.isModuleDeclaration(decl) && decl.name && ts.isIdentifier(decl.name)) {
    out.push({ name: decl.name.text, kind: 'namespace' })
    return
  }
  if (ts.isVariableStatement(decl)) {
    const isLet = (decl.declarationList.flags & ts.NodeFlags.Let) !== 0
    const kind = isLet ? 'let' : 'const'
    for (const d of decl.declarationList.declarations) {
      if (ts.isIdentifier(d.name)) {
        out.push({ name: d.name.text, kind })
      }
    }
  }
}

/**
 * @param {import('typescript').SourceFile} sf
 */
function extractExports(sf) {
  /** @type {{ name: string, kind: string, from?: string }[]} */
  const out = []
  for (const stmt of sf.statements) {
    if (ts.isExportAssignment(stmt)) {
      out.push({
        name: 'default',
        kind: stmt.isExportEquals ? 'export=' : 'default',
      })
      continue
    }
    if (ts.isExportDeclaration(stmt)) {
      if (stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier)) {
        const from = stmt.moduleSpecifier.text
        if (!stmt.exportClause) {
          out.push({ name: '*', kind: 're-export-all', from })
        } else if (ts.isNamespaceExport(stmt.exportClause)) {
          out.push({
            name: stmt.exportClause.name.text,
            kind: 're-export-ns',
            from,
          })
        } else if (ts.isNamedExports(stmt.exportClause)) {
          for (const el of stmt.exportClause.elements) {
            const exported = el.name.text
            const kind = stmt.isTypeOnly ? 're-export-type' : 're-export'
            if (el.propertyName) {
              out.push({ name: exported, kind, from, original: el.propertyName.text })
            } else {
              out.push({ name: exported, kind, from })
            }
          }
        }
      } else if (stmt.exportClause && ts.isNamedExports(stmt.exportClause)) {
        for (const el of stmt.exportClause.elements) {
          const kind = stmt.isTypeOnly ? 'export-type' : 'export'
          out.push({
            name: el.name.text,
            kind,
            ...(el.propertyName ? { original: el.propertyName.text } : {}),
          })
        }
      }
      if (stmt.declaration) {
        pushDeclarationExports(stmt.declaration, out)
      }
      continue
    }
    if (hasExportModifier(stmt)) {
      pushDeclarationExports(stmt, out)
    }
  }
  return out
}

/**
 * @param {{
 *   projectRoot: string
 *   pretty?: boolean
 *   generatedAt?: string
 *   outPath?: string
 *   surfaceOutPath?: string
 * }} opts
 */
export async function buildImportRefs(opts) {
  const projectRoot = path.resolve(opts.projectRoot)
  const pretty = Boolean(opts.pretty)
  const generatedAt = opts.generatedAt ?? new Date().toISOString()
  const outPath = opts.outPath ?? path.join(projectRoot, 'codemap', 'codemap-import-refs.json')
  const absSrc = path.join(projectRoot, 'src')

  const configPath = path.join(projectRoot, 'tsconfig.app.json')
  const read = ts.readConfigFile(configPath, (p) => fsSync.readFileSync(p, 'utf8'))
  if (read.error) {
    throw new Error(ts.flattenDiagnosticMessageText(read.error.messageText, '\n'))
  }
  const parsed = ts.parseJsonConfigFileContent(
    read.config,
    ts.sys,
    path.dirname(configPath),
    path.basename(configPath),
  )
  const compilerOptions = parsed.options

  const targetPaths = await walkSrcTargets(absSrc)
  /** @type {Map<string, { path: string, referencedBy: object[] }>} */
  const byAbs = new Map()
  for (const abs of targetPaths) {
    byAbs.set(path.normalize(abs), {
      path: relPosix(projectRoot, abs),
      referencedBy: [],
    })
  }

  /** @type {{ from: string, line: number, specifier: string }[]} */
  const unresolved = []

  /** outgoing .ts/.tsx module deps per importer (absolute path -> set of target paths posix) */
  /** @type {Map<string, Set<string>>} */
  const outgoingTs = new Map()
  /** @type {Map<string, ReturnType<typeof extractExports>>} */
  const exportsByImporterAbs = new Map()

  const importers = await walkTsImporters(projectRoot)

  for (const containingFile of importers) {
    const fromRel = relPosix(projectRoot, containingFile)
    let text
    try {
      text = await fs.readFile(containingFile, 'utf8')
    } catch {
      continue
    }
    const kind = ts.getScriptKindFromFileName(containingFile)
    const sourceFile = ts.createSourceFile(
      containingFile,
      text,
      ts.ScriptTarget.Latest,
      true,
      kind,
    )

    /**
     * @param {string} specifier
     * @param {import('typescript').Node} node
     * @param {string} refKind
     */
    function record(specifier, node, refKind) {
      const r = ts.resolveModuleName(specifier, containingFile, compilerOptions, ts.sys)
      const m = r.resolvedModule
      /** @type {string | null} */
      let abs = null
      if (m && !m.isExternalLibraryImport) {
        abs = path.normalize(m.resolvedFileName)
      }
      if (!abs || !isProjectRefTarget(abs, projectRoot)) {
        const fallback = tryResolveLocalSpecifier(specifier, containingFile, projectRoot)
        if (fallback && fsSync.existsSync(fallback)) {
          abs = path.normalize(fallback)
        }
      }
      if (!abs || !isProjectRefTarget(abs, projectRoot)) {
        if (specifier.startsWith('.') || specifier.startsWith('@/')) {
          unresolved.push({ from: fromRel, line: lineOf(sourceFile, node), specifier })
        }
        return
      }
      const entry = byAbs.get(abs)
      if (!entry) return
      entry.referencedBy.push({
        from: fromRel,
        line: lineOf(sourceFile, node),
        kind: refKind,
        specifier,
      })
      if (/\.(tsx?)$/.test(abs)) {
        const fromNorm = path.normalize(containingFile)
        let set = outgoingTs.get(fromNorm)
        if (!set) {
          set = new Set()
          outgoingTs.set(fromNorm, set)
        }
        set.add(entry.path)
      }
    }

    function visit(node) {
      if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        record(node.moduleSpecifier.text, node, 'import')
      } else if (
        ts.isExportDeclaration(node) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        record(node.moduleSpecifier.text, node, 'export-from')
      } else if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword
      ) {
        const arg0 = node.arguments[0]
        if (arg0 && ts.isStringLiteral(arg0)) {
          record(arg0.text, node, 'dynamic-import')
        }
      } else if (ts.isCallExpression(node)) {
        const expr = node.expression
        const arg0 = node.arguments[0]
        if (ts.isIdentifier(expr) && expr.text === 'require' && arg0 && ts.isStringLiteral(arg0)) {
          record(arg0.text, node, 'require')
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(sourceFile)

    if (fromRel.startsWith('src/') && /\.(tsx?)$/.test(containingFile)) {
      exportsByImporterAbs.set(path.normalize(containingFile), extractExports(sourceFile))
    }
  }

  const targets = [...byAbs.values()]
    .map((t) => ({
      path: t.path,
      referenceCount: t.referencedBy.length,
      referencedBy: t.referencedBy.sort((a, b) => {
        const c = a.from.localeCompare(b.from)
        if (c !== 0) return c
        if (a.line !== b.line) return a.line - b.line
        return a.kind.localeCompare(b.kind)
      }),
    }))
    .sort((a, b) => a.path.localeCompare(b.path))

  unresolved.sort((a, b) => a.from.localeCompare(b.from) || a.line - b.line || a.specifier.localeCompare(b.specifier))

  const referenceSites = targets.reduce((n, t) => n + t.referenceCount, 0)

  const payload = {
    version: 1,
    generatedAt,
    root: projectRoot,
    summary: {
      srcFiles: targets.length,
      referenceSites,
      unresolved: unresolved.length,
    },
    targets,
    ...(unresolved.length ? { unresolved } : {}),
  }

  const json = pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload)
  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, json, 'utf8')
  console.error(`Wrote ${outPath}`)

  const surfaceOutPath = opts.surfaceOutPath
  if (surfaceOutPath) {
    const mapGuide = {
      intent:
        'Progressive map: use higher levels for layout and hot spots, drill into lower levels for exact lines and file size.',
      zoomLevels: [
        {
          id: 'paths',
          file: 'codemap/codemap-src-paths.json',
          contains: 'Sorted list of paths under src/',
        },
        {
          id: 'surface',
          file: 'codemap/codemap-surface.json',
          contains:
            'Per TS/TSX module: exported names/kinds, count of incoming references, unique imports of other TS/TSX files in src/',
        },
        {
          id: 'importSites',
          file: 'codemap/codemap-import-refs.json',
          contains: 'Every import/export-from/dynamic import with from-file, line, specifier',
        },
        {
          id: 'inventory',
          file: 'codemap/codemap.json',
          contains: 'Full repo tree with line/byte counts (codemap/ excluded from tree)',
        },
      ],
    }

    const srcTsImporters = importers.filter(
      (f) =>
        relPosix(projectRoot, f).startsWith('src/') && /\.(tsx?)$/.test(f),
    )
    srcTsImporters.sort((a, b) => a.localeCompare(b))

    let totalExports = 0
    let totalEdges = 0
    const modules = []

    for (const abs of srcTsImporters) {
      const norm = path.normalize(abs)
      const rel = relPosix(projectRoot, abs)
      const nodeEntry = byAbs.get(norm)
      const incomingRefs = nodeEntry?.referencedBy.length ?? 0
      const exports = exportsByImporterAbs.get(norm) ?? []
      const outgoing = [...(outgoingTs.get(norm) ?? [])].sort((a, b) => a.localeCompare(b))
      totalExports += exports.length
      totalEdges += outgoing.length
      modules.push({
        path: rel,
        exports,
        exportCount: exports.length,
        referencesFromOtherFiles: incomingRefs,
        importsFromProjectTs: outgoing,
        importsFromProjectTsCount: outgoing.length,
      })
    }

    const surfacePayload = {
      version: 1,
      generatedAt,
      root: projectRoot,
      mapGuide,
      summary: {
        modules: modules.length,
        totalExports,
        totalOutgoingEdgesTs: totalEdges,
      },
      modules,
    }

    const surfaceJson = pretty
      ? JSON.stringify(surfacePayload, null, 2)
      : JSON.stringify(surfacePayload)
    await fs.mkdir(path.dirname(surfaceOutPath), { recursive: true })
    await fs.writeFile(surfaceOutPath, surfaceJson, 'utf8')
    console.error(`Wrote ${surfaceOutPath}`)
  }
}

async function main() {
  const cwd = process.cwd()
  let pretty = false
  let surface = false
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--pretty') pretty = true
    if (process.argv[i] === '--surface') surface = true
  }
  await buildImportRefs({
    projectRoot: cwd,
    pretty,
    surfaceOutPath: surface ? path.join(cwd, 'codemap', 'codemap-surface.json') : undefined,
  })
}

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? '')
if (isMain) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
