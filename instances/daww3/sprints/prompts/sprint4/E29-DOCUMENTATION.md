# E29: Documentation & Onboarding — Agent Prompts

> **Goal:** API docs, deployment guides, user tutorials
> **Sprint:** 4
> **Owner:** Tech Writer / All
> **Priority:** 🟡 P2 MEDIUM (Enables adoption)

---

## E29-T1: API Documentation (OpenAPI/Swagger)

```
[[[[ #SETTINGS

    mode = agent - generate comprehensive API docs
    expertize = 'you are world class technical writer specializing in API documentation'
    target = complete, accurate, discoverable API docs
    test = false

    code style = [clear examples, interactive]
    write docs = true
    deep thinking = false
    performance = not critical
    tech stack = ['OpenAPI 3.0', 'Swagger UI', 'NestJS', 'TypeDoc']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Generate comprehensive API documentation with OpenAPI/Swagger.

{{{{ #CUSTOMER PROMT

API endpoints написаны, но docs нет.
Нужно:
1. OpenAPI spec (автоматически из NestJS)
2. Swagger UI at /api/docs
3. Examples для каждого endpoint
4. Authentication guide
5. Error codes reference

}}}}

<<<<<<#RECOMMENDED TASKS

DOCS-1. Install Swagger Dependencies
```bash
cd apps/api
pnpm add @nestjs/swagger swagger-ui-express
```

DOCS-2. Configure Swagger in NestJS
```typescript
// apps/api/src/main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

const config = new DocumentBuilder()
  .setTitle('DAWW3 API')
  .setDescription('Decentralized Audio Workstation Web3 API')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('auth', 'Authentication endpoints')
  .addTag('tracks', 'Track management')
  .addTag('users', 'User profiles')
  .addTag('streaming', 'P2P streaming')
  .addTag('gamification', 'XP, badges, leaderboards')
  .addTag('web3', 'Blockchain integration')
  .build()

const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('api/docs', app, document)
```

DOCS-3. Annotate Controllers
```typescript
// Example: apps/api/src/modules/tracks/tracks.controller.ts
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new track' })
  @ApiResponse({ status: 201, description: 'Track created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createTrackDto: CreateTrackDto) {
    // ...
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get track by ID' })
  @ApiResponse({ status: 200, description: 'Track found' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async findOne(@Param('id') id: string) {
    // ...
  }
}
```

DOCS-4. Document DTOs
```typescript
// apps/api/src/modules/tracks/dto/create-track.dto.ts
import { ApiProperty } from '@nestjs/swagger'

export class CreateTrackDto {
  @ApiProperty({ example: 'My Awesome Track', description: 'Track title' })
  title: string
  
  @ApiProperty({ example: 'electronic', enum: ['electronic', 'rock', 'hip-hop'] })
  genre: string
  
  @ApiProperty({ example: 120, minimum: 60, maximum: 200 })
  bpm: number
  
  @ApiProperty({ example: 0.01, description: 'Price in ETH' })
  price: number
}
```

DOCS-5. Add Examples
```typescript
@ApiOperation({
  summary: 'Record play event',
  description: `
    Record that a user played a track. This triggers:
    - XP earning for listener
    - Rating recalculation for track
    - Potential royalty accrual
  `
})
@ApiBody({
  type: PlayEventDto,
  examples: {
    complete: {
      summary: 'Complete playthrough',
      value: {
        completionRate: 0.95,
        duration: 180,
        source: 'p2p'
      }
    },
    partial: {
      summary: 'Partial playthrough',
      value: {
        completionRate: 0.3,
        duration: 60,
        source: 'seed'
      }
    }
  }
})
async recordPlay(@Body() dto: PlayEventDto) { }
```

DOCS-6. Authentication Guide
Add to Swagger description:
```markdown
## Authentication

DAWW3 API uses JWT Bearer tokens.

### 1. Register or Login
POST /api/v1/auth/register
POST /api/v1/auth/login

### 2. Use Token
Include in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 3. Token Expiry
Tokens expire after 24 hours. Refresh using:
POST /api/v1/auth/refresh
```

DOCS-7. Error Codes Reference
```typescript
@ApiResponse({
  status: 400,
  description: 'Bad Request',
  schema: {
    example: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        { field: 'title', message: 'Title is required' },
        { field: 'bpm', message: 'BPM must be between 60 and 200' }
      ]
    }
  }
})

@ApiResponse({
  status: 429,
  description: 'Too Many Requests',
  schema: {
    example: {
      statusCode: 429,
      message: 'Rate limit exceeded',
      retryAfter: 60
    }
  }
})
```

DOCS-8. Test Swagger UI
- Visit: http://localhost:4000/api/docs
- Verify: All endpoints listed
- Try: "Try it out" for each endpoint
- Check: Examples render correctly

🏁 Definition of Done
- Swagger UI live at /api/docs
- All endpoints documented
- Request/response examples included
- Authentication guide complete
- Error codes documented
- Interactive "Try it out" working

>>>>>>

]]]]
```

---

## E29-T2: Deployment Guide (K8s, Docker Compose)

```
[[[[ #SETTINGS

    mode = agent - write deployment documentation
    expertize = 'you are world class DevOps technical writer'
    target = reproducible deployment guides
    test = false

    code style = [step-by-step, copy-pasteable]
    write docs = true
    deep thinking = false
    performance = not critical
    tech stack = ['Kubernetes', 'Docker', 'Terraform', 'Markdown']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Write comprehensive deployment guides for different environments.

{{{{ #CUSTOMER PROMT

Deployment docs нужны для:
1. Local development (Docker Compose)
2. Staging (K8s + Terraform)
3. Production (K8s + Terraform + monitoring)

Audience: DevOps engineers, contributors

}}}}

<<<<<<#RECOMMENDED TASKS

DEPLOY-1. Local Development Guide
File: `docs/DEPLOYMENT-LOCAL.md`

```markdown
# Local Development Deployment

## Prerequisites
- Docker Desktop 24+
- pnpm 9+
- Node.js 20+
- Rust 1.75+ (optional, for WASM)

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourorg/daww3.git
cd daww3
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Services
```bash
# Start infrastructure (Postgres, Redis, MinIO, Hardhat)
docker compose up -d

# Wait for healthy
./scripts/wait-for-health.sh

# Run migrations
cd apps/api && pnpm prisma migrate dev

# Start all apps
pnpm dev
```

### 4. Access
- Web: http://localhost:3000
- API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs
- MinIO: http://localhost:9001
- Grafana: http://localhost:3001

### 5. Test
```bash
# Run tests
pnpm test

# E2E tests
cd e2e && pnpm playwright test
```

## Troubleshooting

**Port already in use:**
```bash
# Kill processes on ports
lsof -ti:3000,4000,5432,6379 | xargs kill -9
```

**Database migrations fail:**
```bash
# Reset database
cd apps/api
pnpm prisma migrate reset
pnpm prisma db seed
```
```

DEPLOY-2. Staging Deployment Guide
File: `docs/DEPLOYMENT-STAGING.md`

```markdown
# Staging Deployment (Kubernetes + Terraform)

## Prerequisites
- kubectl 1.28+
- terraform 1.6+
- AWS/GCP account
- Docker Hub account

## 1. Infrastructure Setup

### Terraform
```bash
cd terraform
terraform init
terraform workspace new staging
terraform apply -var-file=environments/staging.tfvars
```

Outputs:
- EKS cluster endpoint
- RDS connection string
- S3 bucket names

### Configure kubectl
```bash
aws eks update-kubeconfig --name daww3-staging --region us-east-1
kubectl get nodes
```

## 2. Deploy Applications

### Build & Push Images
```bash
# Set registry
export REGISTRY=yourdockerhub

# Build
docker build -t $REGISTRY/daww3-api:staging apps/api
docker build -t $REGISTRY/daww3-web:staging apps/web

# Push
docker push $REGISTRY/daww3-api:staging
docker push $REGISTRY/daww3-web:staging
```

### Apply Kubernetes Manifests
```bash
kubectl apply -f k8s/staging/namespace.yaml
kubectl apply -f k8s/staging/secrets.yaml
kubectl apply -f k8s/staging/configmap.yaml
kubectl apply -f k8s/staging/deployment-api.yaml
kubectl apply -f k8s/staging/deployment-web.yaml
kubectl apply -f k8s/staging/service.yaml
kubectl apply -f k8s/staging/ingress.yaml
```

### Run Migrations
```bash
kubectl exec -it deploy/api -n staging -- pnpm prisma migrate deploy
```

## 3. Verify
```bash
kubectl get pods -n staging
kubectl get svc -n staging
curl https://staging.daww3.app/health
```

## 4. Rollback (If Needed)
```bash
kubectl rollout undo deployment/api -n staging
```
```

DEPLOY-3. Production Deployment Guide
File: `docs/DEPLOYMENT-PRODUCTION.md`

```markdown
# Production Deployment

## Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Security audit complete
- [ ] Load tests passing
- [ ] Backup strategy configured
- [ ] Monitoring configured
- [ ] On-call rotation active
- [ ] Rollback plan ready

## Deployment Process

### 1. Blue-Green Deployment
```bash
# Deploy to green environment
kubectl apply -f k8s/production/deployment-green.yaml

# Wait for healthy
kubectl wait --for=condition=ready pod -l app=api,env=green -n production

# Switch traffic (Ingress update)
kubectl patch ingress daww3 -n production \
  --type='json' \
  -p='[{"op": "replace", "path": "/spec/rules/0/http/paths/0/backend/service/name", "value": "api-green"}]'

# Monitor for 10 minutes
# If issues: rollback to blue
```

### 2. Database Migration (Zero-Downtime)
```bash
# 1. Deploy code with new schema (backward compatible)
kubectl apply -f k8s/production/deployment.yaml

# 2. Run additive migration
kubectl exec deploy/api -n production -- \
  pnpm prisma migrate deploy

# 3. Deploy code using new schema
kubectl set image deployment/api api=$REGISTRY/api:v2.0.0 -n production

# 4. Clean up old schema (after 24h)
```

### 3. Post-Deployment Verification
```bash
# Smoke tests
curl https://daww3.app/health
curl https://daww3.app/api/v1/tracks?limit=1

# Check metrics
open https://grafana.daww3.app

# Check errors
kubectl logs -f deploy/api -n production | grep ERROR
```

## Rollback Procedure
```bash
# Immediate rollback
kubectl rollout undo deployment/api -n production

# Or: switch back to blue
kubectl patch ingress daww3 -n production \
  --type='json' \
  -p='[{"op": "replace", "path": "/spec/rules/0/http/paths/0/backend/service/name", "value": "api-blue"}]'
```
```

DEPLOY-4. CI/CD Pipeline Documentation
File: `docs/CI-CD.md`

```markdown
# CI/CD Pipeline

## GitHub Actions Workflows

### 1. Pull Request Checks
`.github/workflows/pr-check.yml`
- Lint
- Type check
- Unit tests
- Security scan

### 2. Staging Deployment
`.github/workflows/deploy-staging.yml`
- Triggered: Push to `develop` branch
- Build images
- Push to registry
- Deploy to K8s staging
- Run smoke tests

### 3. Production Deployment
`.github/workflows/deploy-production.yml`
- Triggered: Push to `main` branch (manual approval)
- Build images
- Push to registry
- Blue-green deployment
- Smoke tests
- Alert on failure
```

🏁 Definition of Done
- Local deployment guide complete
- Staging deployment guide complete
- Production deployment guide complete
- CI/CD documented
- Troubleshooting sections included
- All guides tested by external person

>>>>>>

]]]]
```

---

## E29-T3: User Onboarding Tutorial

```
[[[[ #SETTINGS

    mode = agent - create user tutorial
    expertize = 'you are world class UX writer and product education specialist'
    target = 5-minute interactive tutorial for new users
    test = false

    code style = [user-friendly, visual, interactive]
    write docs = true
    deep thinking = true
    performance = not critical
    tech stack = ['Vue', 'Markdown', 'Loom/Video']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Create interactive tutorial for new users to get started.

{{{{ #CUSTOMER PROMT

New users нужна помощь:
1. Wallet setup
2. First track creation
3. Publishing & NFT
4. Earning first royalty

Tutorial должен быть:
- Interactive (in-app)
- Video (5 min)
- Text guide (with screenshots)

}}}}

<<<<<<#RECOMMENDED TASKS

TUTORIAL-1. In-App Tutorial (Vue Component)
```vue
<!-- apps/web/src/components/onboarding/TutorialModal.vue -->
<template>
  <Modal v-if="showTutorial" :dismissible="false">
    <div class="tutorial-step">
      <h2>{{ currentStep.title }}</h2>
      <p>{{ currentStep.description }}</p>
      
      <!-- Visual highlight of UI element -->
      <div class="spotlight" :style="spotlightPosition"></div>
      
      <div class="actions">
        <button @click="prevStep" :disabled="stepIndex === 0">
          Back
        </button>
        <button @click="nextStep">
          {{ isLastStep ? 'Get Started' : 'Next' }}
        </button>
        <button @click="skipTutorial">Skip Tutorial</button>
      </div>
      
      <div class="progress">
        {{ stepIndex + 1 }} / {{ steps.length }}
      </div>
    </div>
  </Modal>
</template>

<script setup>
const steps = [
  {
    title: 'Welcome to DAWW3! 🎵',
    description: 'Create music, own it as NFT, earn 100x more than Spotify.',
    target: null
  },
  {
    title: 'Connect Your Wallet',
    description: 'We need a Web3 wallet to mint NFTs and receive royalties.',
    target: '[data-tour="wallet-button"]',
    action: () => showWalletModal()
  },
  {
    title: 'Open the DAW',
    description: 'Click here to start creating your first track.',
    target: '[data-tour="open-daw"]'
  },
  {
    title: 'Upload Audio',
    description: 'Drag & drop an audio file or record directly.',
    target: '[data-tour="upload-audio"]'
  },
  {
    title: 'Publish Your Track',
    description: 'When ready, publish to mint as NFT and start earning.',
    target: '[data-tour="publish-button"]'
  }
]
</script>
```

TUTORIAL-2. Video Tutorial (Script)
Record with Loom/OBS:

**Intro (0:00-0:30)**
"Hi! Welcome to DAWW3, the Web3 DAW where artists earn 100x more than Spotify. Let me show you how to create and publish your first track in 5 minutes."

**Step 1: Connect Wallet (0:30-1:30)**
- Click "Connect Wallet"
- Select MetaMask
- Approve connection
- "Your wallet is now connected. This is how you'll own your music as NFTs and receive royalties."

**Step 2: Create Track (1:30-3:00)**
- Click "Create Track"
- Upload audio file
- Add track details (title, genre, BPM)
- Preview audio
- "This is your track in the DAW. You can add effects, edit, etc."

**Step 3: Publish (3:00-4:00)**
- Click "Publish"
- Set price (0.01 ETH)
- Confirm transaction
- Wait for NFT mint
- "Congratulations! Your track is now an NFT."

**Step 4: Share & Earn (4:00-5:00)**
- Copy share link
- Track appears in Explore
- Listeners can play via P2P
- Royalties accrue automatically
- "Every play earns you money. Check your earnings dashboard."

**Outro (5:00)**
"That's it! You're now part of the Web3 music revolution. Questions? Join our Discord."

TUTORIAL-3. Text Guide with Screenshots
File: `docs/USER-GUIDE.md`

```markdown
# DAWW3 User Guide

## Getting Started

### 1. Connect Your Wallet

![Connect Wallet](./images/connect-wallet.png)

1. Click "Connect Wallet" in top right
2. Select your wallet provider (MetaMask recommended)
3. Approve connection in wallet popup
4. ✅ You're connected!

### 2. Create Your First Track

![Create Track](./images/create-track.png)

1. Click "+ Create Track"
2. Drag & drop audio file or click "Upload"
3. Fill in track details:
   - Title
   - Genre
   - BPM
   - Description
4. Preview your track
5. Click "Save Draft"

### 3. Publish as NFT

![Publish Track](./images/publish-track.png)

1. Open your track draft
2. Click "Publish"
3. Set pricing:
   - Free (for exposure)
   - Paid (0.01+ ETH)
4. Review details
5. Click "Mint NFT"
6. Confirm transaction in wallet
7. Wait for confirmation (~30 seconds)
8. 🎉 Your track is live!

### 4. Share & Earn

![Share Track](./images/share-track.png)

1. Copy your track link
2. Share on social media
3. Track plays earn you royalties
4. Check earnings in "Dashboard"

## FAQ

**Q: Do I need cryptocurrency?**
A: Yes, a small amount of ETH/MATIC for gas fees (~$1-5).

**Q: How much do I earn per stream?**
A: ~$0.30 average (vs Spotify's $0.003).

**Q: When do I get paid?**
A: Instantly! Royalties accrue in real-time.

**Q: Can I delete my track?**
A: Published NFTs are permanent, but you can update metadata.
```

TUTORIAL-4. Interactive Checklist
```vue
<!-- First-time user checklist -->
<div class="onboarding-checklist">
  <h3>Get Started Checklist</h3>
  <ul>
    <li :class="{ done: user.walletConnected }">
      Connect Wallet
    </li>
    <li :class="{ done: user.profileComplete }">
      Complete Profile
    </li>
    <li :class="{ done: user.tracksCreated > 0 }">
      Create First Track
    </li>
    <li :class="{ done: user.tracksPublished > 0 }">
      Publish Track (Mint NFT)
    </li>
    <li :class="{ done: user.totalEarnings > 0 }">
      Earn First Royalty
    </li>
  </ul>
</div>
```

🏁 Definition of Done
- In-app tutorial implemented
- 5-minute video tutorial recorded
- Text guide with screenshots complete
- FAQ section written
- Interactive checklist working
- Tested with 5 new users

>>>>>>

]]]]
```

---

## E29-T4: Contributing Guide (Open Source Prep)

```
[[[[ #SETTINGS

    mode = agent - write contributor documentation
    expertize = 'you are world class open source maintainer'
    target = welcoming, comprehensive contributing guide
    test = false

    code style = [inclusive, clear expectations]
    write docs = true
    deep thinking = false
    performance = not critical
    tech stack = ['GitHub', 'Markdown']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Write contributing guide for future open source contributors.

{{{{ #CUSTOMER PROMT

DAWW3 может стать open source после launch.
Contributing guide нужен для:
1. Code contributors
2. Designers
3. Docs writers
4. Community moderators

Include: code style, PR process, code of conduct

}}}}

<<<<<<#RECOMMENDED TASKS

CONTRIB-1. Main Contributing Guide
File: `CONTRIBUTING.md`

```markdown
# Contributing to DAWW3

Thank you for your interest in contributing! DAWW3 is on a mission to empower artists with Web3 technology.

## Ways to Contribute

### 🐛 Report Bugs
- Check existing issues first
- Use bug report template
- Include: steps to reproduce, expected vs actual behavior

### ✨ Suggest Features
- Check roadmap first
- Use feature request template
- Explain: problem, solution, alternatives

### 💻 Code Contributions
- Fork the repository
- Create a feature branch
- Follow code style guide
- Write tests
- Submit PR with description

### 📚 Improve Documentation
- Fix typos, clarify wording
- Add examples
- Update outdated info

### 🎨 Design Contributions
- UI/UX improvements
- Icon designs
- Marketing materials

## Getting Started

### 1. Fork & Clone
```bash
git fork https://github.com/yourorg/daww3.git
git clone https://github.com/YOUR_USERNAME/daww3.git
cd daww3
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Create Branch
```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Make Changes
- Follow code style (ESLint, Prettier)
- Write tests
- Update docs if needed

### 5. Commit
```bash
git commit -m "feat: add awesome feature"
```

Commit message format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

### 6. Push & PR
```bash
git push origin feat/your-feature-name
```
Create PR on GitHub with description.

## Code Style

### TypeScript
- Use TypeScript strict mode
- Avoid `any`, use proper types
- Document complex logic

### Vue
- Composition API (not Options API)
- Use `<script setup>` syntax
- Props/emits with TypeScript

### Naming
- Files: kebab-case (`user-service.ts`)
- Classes: PascalCase (`UserService`)
- Functions: camelCase (`getUserById`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)

## Testing

### Run Tests
```bash
# Unit tests
pnpm test

# E2E tests
cd e2e && pnpm playwright test

# Coverage
pnpm test:coverage
```

### Write Tests
- Unit tests for business logic
- E2E tests for user flows
- Aim for >80% coverage

## PR Guidelines

### PR Title
```
feat(api): add track search endpoint
fix(web): resolve audio playback issue
docs(readme): update installation steps
```

### PR Description Template
```markdown
## What
Brief description of changes

## Why
Why is this change needed?

## How
How did you implement it?

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if UI change)
[attach]

## Checklist
- [ ] Code follows style guide
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment.

### Our Standards
✅ **Do:**
- Be respectful and kind
- Provide constructive feedback
- Focus on what's best for the community

❌ **Don't:**
- Harass or discriminate
- Troll or insult
- Share private information

### Enforcement
Violations will result in warnings, temporary ban, or permanent ban.

Report to: conduct@daww3.app

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Discord: https://discord.gg/daww3
- Email: contribute@daww3.app
- Docs: https://docs.daww3.app
```

CONTRIB-2. Code of Conduct
File: `CODE_OF_CONDUCT.md`

```markdown
# Contributor Covenant Code of Conduct

## Our Pledge
[Standard Contributor Covenant text]

## Our Standards
[...]

## Enforcement
[...]

## Attribution
This Code of Conduct is adapted from the Contributor Covenant, version 2.1.
```

CONTRIB-3. Issue Templates
File: `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug report
about: Create a report to help us improve
---

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 14]
- Browser [e.g. Chrome 120]
- Version [e.g. 1.0.0]

**Additional context**
Any other information.
```

🏁 Definition of Done
- CONTRIBUTING.md complete
- CODE_OF_CONDUCT.md added
- Issue templates created
- PR template created
- Tested: External contributor can follow guide

>>>>>>

]]]]
```

---

*E29 Documentation & Onboarding — DAWW3 Sprint 4*
