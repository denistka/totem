# E27: Security Hardening — Agent Prompts

> **Goal:** Security audit, penetration testing, contract verification
> **Sprint:** 4
> **Owner:** Security / All
> **Priority:** 🟠 P1 HIGH (Blocks production launch)

---

## E27-T1: Smart Contract Security Audit

```
[[[[ #SETTINGS

    mode = agent - prepare for external audit
    expertize = 'you are world class smart contract security engineer'
    target = audit readiness, self-review contracts
    test = true

    code style = [security best practices, Solidity patterns]
    write docs = true
    deep thinking = true
    performance = not critical
    tech stack = ['Solidity', 'Hardhat', 'Slither', 'Mythril']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Prepare smart contracts for external security audit, run automated tools.

{{{{ #CUSTOMER PROMT

Smart contracts (TrackNFT, RoyaltySplit, LicenseManager) написаны,
но не audited. Перед отправкой external audit firm нужно:
1. Self-review с чеклистом
2. Автоматические security scanners (Slither, Mythril)
3. Тесты покрытия edge cases
4. Документация для auditors

}}}}

<<<<<<#RECOMMENDED TASKS

AUDIT-1. Security Checklist (Self-Review)

**Access Control:**
- [ ] Only owner can mint NFTs
- [ ] Only authorized can update royalty splits
- [ ] License purchases validate caller
- [ ] Admin functions protected

**Reentrancy:**
- [ ] No external calls before state updates
- [ ] Use `ReentrancyGuard` on payable functions
- [ ] Check-Effects-Interactions pattern

**Integer Overflow/Underflow:**
- [ ] Use Solidity 0.8+ (built-in checks)
- [ ] Verify all arithmetic operations
- [ ] Test boundary conditions

**Gas Limits:**
- [ ] No unbounded loops
- [ ] Batch operations have limits
- [ ] Withdrawal patterns instead of push payments

**Front-running:**
- [ ] Commit-reveal for sensitive operations
- [ ] No reliance on transaction ordering
- [ ] Time-locks where appropriate

AUDIT-2. Run Slither (Static Analyzer)
```bash
cd apps/contracts

# Install Slither
pip3 install slither-analyzer

# Run analysis
slither . --exclude-dependencies

# Review output for:
# - High/Medium severity issues
# - Reentrancy vulnerabilities
# - Unchecked return values
# - Timestamp dependencies
```

Expected: Zero high-severity issues

AUDIT-3. Run Mythril (Symbolic Execution)
```bash
# Install Mythril
pip3 install mythril

# Analyze contracts
myth analyze contracts/TrackNFT.sol
myth analyze contracts/RoyaltySplit.sol
myth analyze contracts/LicenseManager.sol

# Check for:
# - Integer overflow
# - Reentrancy
# - Unchecked send
# - Delegatecall vulnerabilities
```

AUDIT-4. Test Coverage (100% for Critical Paths)
```bash
npx hardhat coverage

# Review: coverage/index.html
# Target: >95% line coverage
# Critical paths: 100% coverage
```

AUDIT-5. Fuzzing Tests
```typescript
// test/fuzz/RoyaltySplit.fuzz.ts
import { ethers } from 'hardhat'
import { expect } from 'chai'

describe('RoyaltySplit Fuzz Tests', () => {
  it('handles random split percentages', async () => {
    const splits = []
    let total = 0
    
    // Generate random splits
    for (let i = 0; i < 10; i++) {
      const percentage = Math.floor(Math.random() * 100)
      splits.push(percentage)
      total += percentage
    }
    
    if (total > 100) {
      // Should revert
      await expect(
        royaltySplit.setSplits(splits)
      ).to.be.revertedWith('Total > 100%')
    } else {
      // Should succeed
      await expect(
        royaltySplit.setSplits(splits)
      ).to.not.be.reverted
    }
  })
  
  it('handles extreme gas prices', async () => {
    // Test with maxFeePerGas = 1000 gwei
    const tx = await trackNFT.mint({
      maxFeePerGas: ethers.utils.parseUnits('1000', 'gwei')
    })
    
    expect(tx).to.not.be.reverted
  })
})
```

AUDIT-6. Prepare Audit Package
Create: `docs/AUDIT-PACKAGE.md`
```markdown
# DAWW3 Smart Contract Audit Package

## Contracts
1. TrackNFT.sol - ERC-721 for track ownership
2. RoyaltySplit.sol - Automated royalty distribution
3. LicenseManager.sol - Dynamic licensing (PAID/FREE states)

## Architecture
[Include architecture diagram]

## Known Issues
- None currently

## Audit Focus Areas
1. Royalty split calculation accuracy
2. License state transition security
3. Reentrancy in payment flows
4. Gas optimization

## Test Coverage
- 97% line coverage
- 100% critical path coverage
- Fuzz tests included
```

AUDIT-7. External Audit Firm Selection
Research: ConsenSys Diligence, OpenZeppelin, Trail of Bits
- Request quotes
- Provide audit package
- Schedule: 2-3 weeks
- Budget: $15K-30K

🏁 Definition of Done
- Slither: Zero high-severity issues
- Mythril: Zero critical vulnerabilities
- Test coverage >95%
- Audit package prepared
- External audit scheduled
- ⚠️ No mainnet deployment until audit complete

>>>>>>

]]]]
```

---

## E27-T2: API Penetration Testing

```
[[[[ #SETTINGS

    mode = agent - security testing
    expertize = 'you are world class penetration tester (ethical hacker)'
    target = find vulnerabilities in API before production
    test = true

    code style = [OWASP Top 10, security testing]
    write docs = true
    deep thinking = true
    performance = not critical
    tech stack = ['OWASP ZAP', 'Burp Suite', 'sqlmap', 'JWT']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Perform penetration testing on DAWW3 API to find vulnerabilities.

{{{{ #CUSTOMER PROMT

API security tests нужны перед production:
1. SQL injection
2. XSS, CSRF
3. Authentication bypass
4. Authorization flaws
5. Rate limiting bypass
6. Input validation
7. API abuse

}}}}

<<<<<<#RECOMMENDED TASKS

PENTEST-1. OWASP ZAP Automated Scan
```bash
# Run OWASP ZAP in Docker
docker run -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable \
  zap-baseline.py \
  -t http://localhost:4000/api/v1 \
  -g gen.conf \
  -r zap-report.html

# Review: zap-report.html
# Fix: Any medium/high findings
```

PENTEST-2. Authentication Tests

**Test 1:** JWT Token Manipulation
```bash
# Tamper with JWT payload
curl -H "Authorization: Bearer TAMPERED_TOKEN" \
  http://localhost:4000/api/v1/profile
  
# Expected: 401 Unauthorized
```

**Test 2:** Expired Token
```bash
# Use token from 1 hour ago
# Expected: 401 Unauthorized with "Token expired"
```

**Test 3:** No Token
```bash
curl http://localhost:4000/api/v1/profile
# Expected: 401 Unauthorized
```

**Test 4:** Weak Password
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -d '{"email":"test@test.com","password":"123"}'
  
# Expected: 400 "Password too weak" (min 8 chars, mixed case, numbers)
```

PENTEST-3. Authorization Tests

**Test 1:** Horizontal Privilege Escalation
```bash
# User A tries to access User B's tracks
curl -H "Authorization: Bearer USER_A_TOKEN" \
  http://localhost:4000/api/v1/users/USER_B_ID/tracks
  
# Expected: 403 Forbidden
```

**Test 2:** Vertical Privilege Escalation
```bash
# Regular user tries admin endpoint
curl -H "Authorization: Bearer USER_TOKEN" \
  -X POST http://localhost:4000/api/v1/admin/users/delete
  
# Expected: 403 Forbidden
```

PENTEST-4. Input Validation

**Test 1:** SQL Injection
```bash
# Try SQL injection in search
curl "http://localhost:4000/api/v1/tracks?q=' OR 1=1--"

# Expected: Safely escaped, no database error
# Check logs: No raw SQL in error messages
```

**Test 2:** XSS in User Input
```bash
curl -X POST http://localhost:4000/api/v1/tracks \
  -d '{"title":"<script>alert(1)</script>"}'
  
# Expected: Sanitized or rejected
# Verify: title stored as plain text, no script execution
```

**Test 3:** File Upload Validation
```bash
# Try to upload .exe as audio
curl -X POST http://localhost:4000/api/v1/upload/audio \
  -F "file=@malware.exe"
  
# Expected: 400 "Invalid file type"
```

PENTEST-5. Rate Limiting

**Test:** Brute Force Attack Simulation
```bash
# Try 1000 login attempts
for i in {1..1000}; do
  curl -X POST http://localhost:4000/api/v1/auth/login \
    -d '{"email":"victim@test.com","password":"guess'$i'"}'
done

# Expected: 429 Too Many Requests after ~10 attempts
# IP blocked for 15 minutes
```

PENTEST-6. API Abuse

**Test 1:** Large Payload
```bash
# Send 100MB JSON
dd if=/dev/zero bs=1M count=100 | \
  curl -X POST http://localhost:4000/api/v1/tracks \
  -d @-
  
# Expected: 413 Payload Too Large (max 10MB)
```

**Test 2:** Nested JSON Bomb
```bash
# Deeply nested JSON
curl -X POST http://localhost:4000/api/v1/tracks \
  -d '{"a":{"a":{"a":{...}}}}'  # 1000 levels deep
  
# Expected: 400 "Max depth exceeded"
```

PENTEST-7. Security Headers Check
```bash
curl -I http://localhost:4000/api/v1/health

# Verify headers:
# - Strict-Transport-Security: max-age=31536000
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY
# - Content-Security-Policy: default-src 'self'
# - X-XSS-Protection: 1; mode=block
```

PENTEST-8. HTTPS/TLS Configuration
```bash
# Check TLS version
openssl s_client -connect daww3.app:443 -tls1_2

# Expected: TLS 1.2+ only
# No SSLv3, TLS 1.0, TLS 1.1

# Check cipher suites
nmap --script ssl-enum-ciphers -p 443 daww3.app

# Expected: Strong ciphers only (AES-256-GCM)
```

🏁 Definition of Done
- OWASP ZAP scan: Zero high-severity issues
- All authentication tests pass
- No privilege escalation vulnerabilities
- Input validation robust
- Rate limiting effective
- Security headers configured
- TLS 1.2+ enforced

>>>>>>

]]]]
```

---

## E27-T3: Dependency Vulnerability Scanning

```
[[[[ #SETTINGS

    mode = agent - scan and patch vulnerabilities
    expertize = 'you are world class security engineer'
    target = zero high/critical vulnerabilities in dependencies
    test = true

    code style = [dependency hygiene, security updates]
    write docs = true
    deep thinking = false
    performance = not critical
    tech stack = ['npm audit', 'Snyk', 'Dependabot']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Scan all dependencies for vulnerabilities and patch.

{{{{ #CUSTOMER PROMT

Dependency vulnerabilities могут быть скрытыми backdoors.
Нужно:
1. Scan всех deps (npm, pip, cargo)
2. Patch critical/high
3. Setup автоматические alerts
4. Enforce в CI

}}}}

<<<<<<#RECOMMENDED TASKS

VULN-1. npm Audit (Frontend + Backend)
```bash
# Check all workspaces
pnpm audit --audit-level=high

# Fix автоматически (если возможно)
pnpm audit fix

# Manually review breaking changes
```

Expected: Zero high/critical vulnerabilities

VULN-2. Snyk Scan (More Comprehensive)
```bash
# Install Snyk
npm install -g snyk

# Authenticate
snyk auth

# Test all projects
snyk test

# Monitor for future vulns
snyk monitor
```

VULN-3. GitHub Dependabot
- Enable in repository settings
- Auto-create PRs for security updates
- Configure: `.github/dependabot.yml`
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
```

VULN-4. Python Dependencies (If Any)
```bash
# Safety check
pip install safety
safety check --json
```

VULN-5. Docker Image Scanning
```bash
# Scan Docker images
docker scan daww3/api:latest
docker scan daww3/web:latest

# Use Alpine base images (smaller attack surface)
# Keep images updated
```

VULN-6. License Compliance
```bash
# Check licenses
npx license-checker --summary

# Blocklist: AGPL, GPL (if proprietary)
# Allowlist: MIT, Apache-2.0, BSD
```

VULN-7. CI Enforcement
```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm audit --audit-level=high
      - run: snyk test --severity-threshold=high
```

🏁 Definition of Done
- pnpm audit: Zero high/critical
- Snyk: Zero high/critical
- Dependabot enabled
- CI blocks on vulnerabilities
- License compliance verified

>>>>>>

]]]]
```

---

## E27-T4: Rate Limiting & DDoS Protection

```
[[[[ #SETTINGS

    mode = agent - test and harden rate limiting
    expertize = 'you are world class infrastructure security engineer'
    target = protect against DDoS and API abuse
    test = true

    code style = [defense in depth, resilience]
    write docs = true
    deep thinking = true
    performance = must not impact legitimate users
    tech stack = ['NestJS Throttler', 'Redis', 'Cloudflare', 'Nginx']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Test and enhance rate limiting to prevent DDoS attacks.

{{{{ #CUSTOMER PROMT

Rate limiting реализован в E13, но нужно проверить под нагрузкой.
Сценарии:
1. Legitimate burst traffic
2. DDoS attack simulation
3. Distributed attack (multiple IPs)
4. Slowloris attack

}}}}

<<<<<<#RECOMMENDED TASKS

DDOS-1. Test Current Rate Limits
```bash
# API rate limit: 100 req/min per IP
# Test: 200 requests in 10 seconds
for i in {1..200}; do
  curl http://localhost:4000/api/v1/health &
done
wait

# Expected: ~100 succeed, ~100 get 429
```

DDOS-2. Per-Endpoint Rate Limits
```typescript
// Stricter limits for expensive operations
@Throttle(10, 60) // 10 requests per minute
@Post('tracks/:id/play')
async recordPlay() { ... }

@Throttle(5, 60) // 5 per minute
@Post('upload/audio')
async uploadAudio() { ... }

@Throttle(100, 60) // 100 per minute (generous)
@Get('tracks')
async searchTracks() { ... }
```

DDOS-3. DDoS Simulation (k6)
```javascript
// Simulate attack
import http from 'k6/http'
export const options = {
  vus: 500,
  duration: '1m'
}

export default function () {
  // Rapid requests
  for (let i = 0; i < 100; i++) {
    http.get('http://localhost:4000/api/v1/health')
  }
}
```

Expected: Rate limiter blocks, API stays up

DDOS-4. Cloudflare DDoS Protection
- Enable "Under Attack" mode if needed
- Configure: firewall rules for bad actors
- Rate limiting at edge (before hitting API)
- Bot fight mode

DDOS-5. Slowloris Protection (Nginx)
```nginx
# nginx.conf
http {
  client_body_timeout 10s;
  client_header_timeout 10s;
  keepalive_timeout 5s 5s;
  send_timeout 10s;
  
  limit_conn_zone $binary_remote_addr zone=addr:10m;
  limit_conn addr 10; # Max 10 connections per IP
}
```

DDOS-6. IP Ban List
```typescript
// Ban repeat offenders
const bannedIPs = new Set()

if (bannedIPs.has(req.ip)) {
  throw new HttpException('Banned', 403)
}

// Auto-ban after 10 rate limit violations
if (violations[req.ip] > 10) {
  bannedIPs.add(req.ip)
  // Expire after 24 hours
  setTimeout(() => bannedIPs.delete(req.ip), 86400000)
}
```

🏁 Definition of Done
- Rate limits tested under attack
- DDoS simulation: API survives
- Cloudflare configured
- Nginx hardened
- Auto-ban mechanism working

>>>>>>

]]]]
```

---

## E27-T5: Security Headers Audit

```
[[[[ #SETTINGS

    mode = agent - verify security headers
    expertize = 'you are world class web security engineer'
    target = A+ rating on securityheaders.com
    test = true

    code style = [security best practices]
    write docs = false
    deep thinking = false
    performance = not critical
    tech stack = ['NestJS', 'Nginx', 'Helmet']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Audit and configure security headers for production.

{{{{ #CUSTOMER PROMT

Security headers частично configured in E19.
Нужно проверить и fix все:
- CSP, HSTS, X-Frame-Options, etc.
- Test: securityheaders.com
- Target: A+ rating

}}}}

<<<<<<#RECOMMENDED TASKS

HEADERS-1. Check Current Headers
```bash
curl -I https://daww3.app/api/v1/health

# Review all security headers
```

HEADERS-2. Configure Helmet (NestJS)
```typescript
// apps/api/src/main.ts
import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For inline styles
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss://daww3.app"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  xssFilter: true,
  noSniff: true
}))
```

HEADERS-3. Test on securityheaders.com
- Visit: https://securityheaders.com/?q=daww3.app
- Target: A+ rating
- Fix any missing headers

HEADERS-4. Required Headers Checklist
- [x] Strict-Transport-Security
- [x] Content-Security-Policy
- [x] X-Content-Type-Options
- [x] X-Frame-Options
- [x] X-XSS-Protection
- [x] Referrer-Policy
- [ ] Permissions-Policy (optional)

🏁 Definition of Done
- securityheaders.com: A+ rating
- All headers configured
- CSP violations: zero
- HSTS preload submitted

>>>>>>

]]]]
```

---

*E27 Security Hardening — DAWW3 Sprint 4*
