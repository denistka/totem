#!/usr/bin/env node
/**
 * Scans a directory tree and prints JSON codemap: paths, names, line count,
 * UTF-8 byte size, and Unicode code-point count per file.
 *
 * Usage: node scripts/codemap.mjs [--root <dir>] [--out <file>] [--stdout] [--pretty] [--paths-only] [--all]
 * Default: writes codemap/codemap.json (use --stdout for stdout).
 * --paths-only: JSON with only a sorted "paths" array (no tree or per-file metrics).
 * --all: writes codemap/codemap.json, codemap-src-paths.json, codemap-import-refs.json,
 *        codemap-surface.json (exports + local TS edges + mapGuide).
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'

const DEFAULT_IGNORE_NAMES = new Set([
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
  'codemap',
])

const CODEMAP_DIR = 'codemap'

async function ensureDirForFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

function parseArgs(argv) {
  const cwd = process.cwd()
  let root = cwd
  let outPath = path.resolve(cwd, CODEMAP_DIR, 'codemap.json')
  let useStdout = false
  let pretty = false
  let pathsOnly = false
  let all = false
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--root' && argv[i + 1]) {
      root = path.resolve(argv[++i])
    } else if (a === '--out' && argv[i + 1]) {
      outPath = path.resolve(argv[++i])
      useStdout = false
    } else if (a === '--stdout') {
      useStdout = true
    } else if (a === '--pretty') {
      pretty = true
    } else if (a === '--paths-only') {
      pathsOnly = true
    } else if (a === '--all') {
      all = true
    } else if (a === '--help' || a === '-h') {
      console.error(
        'Usage: node scripts/codemap.mjs [--root <dir>] [--out <file>] [--stdout] [--pretty] [--paths-only] [--all]\n  --all → codemap/*.json (tree, paths, surface, import-refs)',
      )
      process.exit(0)
    }
  }
  return { root, outPath, useStdout, pretty, pathsOnly, all }
}

function isProbablyBinary(buf) {
  const n = Math.min(buf.length, 8192)
  for (let i = 0; i < n; i++) if (buf[i] === 0) return true
  return false
}

function countCodePoints(s) {
  return [...s].length
}

function lineCount(text) {
  if (text.length === 0) return 0
  return text.split(/\r?\n/).length
}

async function readFileMetrics(absPath) {
  const buf = await fs.readFile(absPath)
  const bytes = buf.length
  if (isProbablyBinary(buf)) {
    return { lines: null, bytes, codePoints: null, binary: true }
  }
  const text = buf.toString('utf8')
  return {
    lines: lineCount(text),
    bytes,
    codePoints: countCodePoints(text),
    binary: false,
  }
}

/** Fast path list only (no metrics, no tree). */
async function walkFilePaths(absDir, relDir, ignoreNames) {
  const paths = []
  const entries = await fs.readdir(absDir, { withFileTypes: true })
  entries.sort((a, b) => a.name.localeCompare(b.name))
  for (const ent of entries) {
    if (ignoreNames.has(ent.name)) continue
    const abs = path.join(absDir, ent.name)
    const rel = relDir ? path.join(relDir, ent.name) : ent.name
    if (ent.isDirectory()) {
      paths.push(...(await walkFilePaths(abs, rel, ignoreNames)))
    } else if (ent.isFile()) {
      paths.push(rel.split(path.sep).join('/'))
    }
  }
  return paths
}

async function walkDir(absDir, relDir, ignoreNames) {
  const entries = await fs.readdir(absDir, { withFileTypes: true })
  entries.sort((a, b) => a.name.localeCompare(b.name))

  const children = []
  const flatFiles = []
  let totalLines = 0
  let totalBytes = 0
  let totalCodePoints = 0
  let fileCount = 0

  for (const ent of entries) {
    if (ignoreNames.has(ent.name)) continue
    const abs = path.join(absDir, ent.name)
    const rel = relDir ? path.join(relDir, ent.name) : ent.name

    if (ent.isDirectory()) {
      const sub = await walkDir(abs, rel, ignoreNames)
      children.push(sub.node)
      flatFiles.push(...sub.flatFiles)
      totalLines += sub.totalLines
      totalBytes += sub.totalBytes
      totalCodePoints += sub.totalCodePoints
      fileCount += sub.fileCount
      continue
    }

    if (!ent.isFile()) continue

    const m = await readFileMetrics(abs)
    const node = {
      type: 'file',
      name: ent.name,
      path: rel.split(path.sep).join('/'),
      bytes: m.bytes,
      binary: m.binary,
      ...(m.binary
        ? {}
        : { lines: m.lines, codePoints: m.codePoints }),
    }
    children.push(node)
    flatFiles.push(node)
    if (!m.binary) {
      totalLines += m.lines
      totalCodePoints += m.codePoints
    }
    totalBytes += m.bytes
    fileCount += 1
  }

  const node = {
    type: 'dir',
    name: relDir ? path.basename(relDir) : path.basename(absDir),
    path: relDir ? relDir.split(path.sep).join('/') : '.',
    children,
    aggregate: {
      files: fileCount,
      lines: totalLines,
      bytes: totalBytes,
      codePoints: totalCodePoints,
    },
  }

  return { node, flatFiles, totalLines, totalBytes, totalCodePoints, fileCount }
}

async function main() {
  const { root, outPath, useStdout, pretty, pathsOnly, all } = parseArgs(process.argv)
  const absRoot = path.resolve(root)

  if (all) {
    if (pathsOnly || useStdout) {
      console.error('codemap: --all cannot be used with --paths-only or --stdout')
      process.exit(1)
    }
    const codemapDir = path.join(absRoot, CODEMAP_DIR)
    const fullOut = path.join(codemapDir, 'codemap.json')
    const srcPathsOut = path.join(codemapDir, 'codemap-src-paths.json')
    const absSrc = path.join(absRoot, 'src')
    const generatedAt = new Date().toISOString()

    const { node: tree, flatFiles, totalLines, totalBytes, totalCodePoints, fileCount } =
      await walkDir(absRoot, '', DEFAULT_IGNORE_NAMES)
    const sorted = flatFiles.sort((a, b) => a.path.localeCompare(b.path))
    const fullPayload = {
      version: 1,
      generatedAt,
      root: absRoot,
      summary: {
        files: fileCount,
        lines: totalLines,
        bytes: totalBytes,
        codePoints: totalCodePoints,
      },
      tree,
      files: sorted,
    }
    const fullJson = pretty ? JSON.stringify(fullPayload, null, 2) : JSON.stringify(fullPayload)
    await ensureDirForFile(fullOut)
    await fs.writeFile(fullOut, fullJson, 'utf8')
    console.error(`Wrote ${fullOut}`)

    let stat
    try {
      stat = await fs.stat(absSrc)
    } catch {
      console.error(`codemap: --all: missing directory ${absSrc}`)
      process.exit(1)
    }
    if (!stat.isDirectory()) {
      console.error(`codemap: --all: not a directory: ${absSrc}`)
      process.exit(1)
    }

    const paths = (await walkFilePaths(absSrc, '', DEFAULT_IGNORE_NAMES)).sort((a, b) =>
      a.localeCompare(b),
    )
    const pathsPayload = {
      version: 1,
      generatedAt,
      root: absSrc,
      paths,
    }
    const pathsJson = pretty ? JSON.stringify(pathsPayload, null, 2) : JSON.stringify(pathsPayload)
    await ensureDirForFile(srcPathsOut)
    await fs.writeFile(srcPathsOut, pathsJson, 'utf8')
    console.error(`Wrote ${srcPathsOut}`)

    const { buildImportRefs } = await import('./codemap-import-refs.mjs')
    await buildImportRefs({
      projectRoot: absRoot,
      pretty,
      generatedAt,
      outPath: path.join(codemapDir, 'codemap-import-refs.json'),
      surfaceOutPath: path.join(codemapDir, 'codemap-surface.json'),
    })
    return
  }

  if (pathsOnly) {
    const paths = (await walkFilePaths(absRoot, '', DEFAULT_IGNORE_NAMES)).sort((a, b) =>
      a.localeCompare(b),
    )
    const payload = {
      version: 1,
      generatedAt: new Date().toISOString(),
      root: absRoot,
      paths,
    }
    const json = pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload)
    if (useStdout) {
      await pipeline(Readable.from([json, '\n']), process.stdout)
    } else {
      await ensureDirForFile(outPath)
      await fs.writeFile(outPath, json, 'utf8')
      console.error(`Wrote ${outPath}`)
    }
    return
  }

  const { node: tree, flatFiles, totalLines, totalBytes, totalCodePoints, fileCount } =
    await walkDir(absRoot, '', DEFAULT_IGNORE_NAMES)

  const sorted = flatFiles.sort((a, b) => a.path.localeCompare(b.path))

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    root: absRoot,
    summary: {
      files: fileCount,
      lines: totalLines,
      bytes: totalBytes,
      codePoints: totalCodePoints,
    },
    tree,
    files: sorted,
  }

  const json = pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload)

  if (useStdout) {
    await pipeline(Readable.from([json, '\n']), process.stdout)
  } else {
    await ensureDirForFile(outPath)
    await fs.writeFile(outPath, json, 'utf8')
    console.error(`Wrote ${outPath}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
