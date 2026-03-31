# 🏗️ E1: Infrastructure — QA Test Specifications

> **Epic:** E1 - Monorepo & DevOps Infrastructure
> **Status:** ✅ DONE
> **Focus:** Turborepo, Docker, TypeScript config, ESLint, Shared packages

---

## Test Areas

### E1-QA-1: Build System
```typescript
describe('Turborepo Build', () => {
  it('builds all packages without errors', async () => {
    const result = await exec('pnpm build')
    expect(result.exitCode).toBe(0)
  })

  it('caches builds correctly', async () => {
    await exec('pnpm build')
    const start = Date.now()
    await exec('pnpm build')
    expect(Date.now() - start).toBeLessThan(5000) // Cache hit
  })

  it('detects package dependencies', () => {
    const graph = turbo.getTaskGraph('build')
    expect(graph['apps/web'].dependsOn).toContain('packages/shared-types')
  })
})
```

### E1-QA-2: Docker Environment
```typescript
describe('Docker Compose', () => {
  it('starts all services', async () => {
    const result = await exec('docker-compose up -d')
    expect(result.exitCode).toBe(0)
    
    // Verify services running
    const ps = await exec('docker-compose ps')
    expect(ps.stdout).toContain('postgres')
    expect(ps.stdout).toContain('redis')
  })

  it('healthchecks pass', async () => {
    await waitFor(async () => {
      const health = await exec('docker-compose ps --format json')
      const services = JSON.parse(health.stdout)
      return services.every(s => s.Health === 'healthy')
    }, 60000)
  })
})
```

### E1-QA-3: TypeScript Config
```typescript
describe('TypeScript Configuration', () => {
  it('strict mode enabled', () => {
    const config = require('../tsconfig.json')
    expect(config.compilerOptions.strict).toBe(true)
  })

  it('no implicit any', () => {
    const config = require('../tsconfig.json')
    expect(config.compilerOptions.noImplicitAny).toBe(true)
  })

  it('path aliases resolve', async () => {
    const result = await exec('pnpm typecheck')
    expect(result.exitCode).toBe(0)
  })
})
```

### E1-QA-4: ESLint/Prettier
```typescript
describe('Code Quality', () => {
  it('lint passes', async () => {
    const result = await exec('pnpm lint')
    expect(result.exitCode).toBe(0)
  })

  it('format check passes', async () => {
    const result = await exec('pnpm format:check')
    expect(result.exitCode).toBe(0)
  })
})
```

---

## Manual Checklist

- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts all services
- [ ] Hot reload works for web and api
- [ ] Docker volumes persist data
- [ ] Environment variables load correctly

---

*E1 Infrastructure QA — DAWW3 Project*
