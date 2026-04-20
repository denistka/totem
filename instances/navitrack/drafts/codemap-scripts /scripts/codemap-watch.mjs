#!/usr/bin/env node
/**
 * Regenerates codemap/*.json when project files change.
 * Ignores the codemap outputs and the same dirs as scripts/codemap.mjs.
 */

import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import chokidar from 'chokidar'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

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

function shouldIgnore(watchPath) {
  const norm = watchPath.split(path.sep).join('/')
  const top = norm.split('/')[0]
  if (top === 'codemap') return true
  return norm.split('/').some((s) => IGNORE_DIR_NAMES.has(s))
}

const DEBOUNCE_MS = 400
let debounceTimer = null
let running = false
let pending = false

function runCodemap() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['scripts/codemap.mjs', '--all', '--pretty'], {
      cwd: root,
      stdio: 'inherit',
    })
    child.on('close', (code) => {
      if (code !== 0) console.error(`codemap-watch: codemap exited with code ${code}`)
      resolve()
    })
  })
}

async function flush() {
  if (running) {
    pending = true
    return
  }
  running = true
  try {
    do {
      pending = false
      await runCodemap()
    } while (pending)
  } finally {
    running = false
  }
}

function schedule() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void flush()
  }, DEBOUNCE_MS)
}

chokidar
  .watch('.', {
    cwd: root,
    ignored: (p) => shouldIgnore(p),
    ignoreInitial: true,
  })
  .on('all', () => {
    schedule()
  })

console.error(`codemap-watch: watching ${root}`)
console.error('codemap-watch: Ctrl+C to stop')

await runCodemap()
console.error('codemap-watch: initial codemap done; waiting for changes…')
