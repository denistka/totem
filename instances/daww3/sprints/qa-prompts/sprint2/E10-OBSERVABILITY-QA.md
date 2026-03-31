# 📊 E10: Observability — QA Test Specifications

> **Epic:** E10 - Logging, Metrics & Error Tracking
> **Status:** ✅ DONE
> **Focus:** Debug overlay, Pino logging, Prometheus, Sentry

---

## Test Areas

### E10-QA-1: Debug Overlay (Frontend)
```typescript
describe('Debug Overlay', () => {
  it('toggles with keyboard shortcut', async () => {
    await page.keyboard.press('Control+Shift+D')
    await expect(page.locator('[data-testid="debug-overlay"]')).toBeVisible()
    
    await page.keyboard.press('Control+Shift+D')
    await expect(page.locator('[data-testid="debug-overlay"]')).not.toBeVisible()
  })

  it('displays audio metrics', async () => {
    await page.keyboard.press('Control+Shift+D')
    
    await expect(page.locator('[data-testid="cpu-usage"]')).toBeVisible()
    await expect(page.locator('[data-testid="latency"]')).toBeVisible()
    await expect(page.locator('[data-testid="buffer-health"]')).toBeVisible()
  })

  it('shows P2P stats', async () => {
    await page.keyboard.press('Control+Shift+D')
    
    await expect(page.locator('[data-testid="peer-count"]')).toBeVisible()
    await expect(page.locator('[data-testid="p2p-ratio"]')).toBeVisible()
  })
})
```

### E10-QA-2: Pino Logging (Backend)
```typescript
describe('Pino Logger', () => {
  let logger: LoggerService
  let logOutput: string[]

  beforeEach(() => {
    logOutput = []
    logger = new LoggerService({
      stream: { write: (msg) => logOutput.push(msg) }
    })
  })

  it('logs with correlation ID', () => {
    logger.setCorrelationId('req-123')
    logger.info('Test message')
    
    const log = JSON.parse(logOutput[0])
    expect(log.correlationId).toBe('req-123')
  })

  it('logs at correct level', () => {
    logger.warn('Warning message')
    
    const log = JSON.parse(logOutput[0])
    expect(log.level).toBe(40) // Pino warn level
  })

  it('redacts sensitive fields', () => {
    logger.info({ password: 'secret', email: 'test@test.com' })
    
    const log = JSON.parse(logOutput[0])
    expect(log.password).toBe('[REDACTED]')
  })
})
```

### E10-QA-3: Prometheus Metrics
```typescript
describe('Prometheus Metrics', () => {
  it('exposes /metrics endpoint', async () => {
    const res = await request(app).get('/metrics')
    
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/plain')
  })

  it('tracks HTTP request duration', async () => {
    await request(app).get('/api/v1/health')
    
    const res = await request(app).get('/metrics')
    expect(res.text).toContain('http_request_duration_seconds')
  })

  it('tracks custom business metrics', async () => {
    // Simulate play
    await request(app).post('/api/v1/plays').send({ trackId: 'track-1' })
    
    const res = await request(app).get('/metrics')
    expect(res.text).toContain('daww3_track_plays_total')
  })
})
```

### E10-QA-4: Sentry Error Tracking
```typescript
describe('Sentry Integration', () => {
  it('captures errors', async () => {
    const capturedEvents: any[] = []
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      beforeSend: (event) => {
        capturedEvents.push(event)
        return null // Don't send in test
      }
    })
    
    try {
      throw new Error('Test error')
    } catch (e) {
      Sentry.captureException(e)
    }
    
    expect(capturedEvents.length).toBe(1)
    expect(capturedEvents[0].exception.values[0].value).toBe('Test error')
  })

  it('includes user context', () => {
    Sentry.setUser({ id: 'user-123', email: 'test@test.com' })
    
    // ... capture error
    
    expect(capturedEvents[0].user.id).toBe('user-123')
  })
})
```

---

## Dashboard Validation

- [ ] Grafana dashboard loads without errors
- [ ] All Prometheus queries return data
- [ ] Sentry project receives events
- [ ] Log aggregation works (if configured)

---

## Regression Tests

```typescript
describe('E10 Regression', () => {
  it.todo('Grafana dashboard JSON import')
  it.todo('Alert manager configuration')
  it.todo('Log rotation/retention')
  it.todo('Performance profiling endpoint')
})
```

---

*E10 Observability QA — DAWW3 Project*
