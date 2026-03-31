# 🏗️ E1: Sandbox Infrastructure

> **Goal:** One-command local environment  
> **Sprint:** 0  
> **Owner:** DevOps

---

## E1-T1: Monorepo Setup

**Priority:** 🔴 P0 CRITICAL  
**Points:** 3  
**Depends on:** Nothing (first task)

### Description
Initialize monorepo with pnpm workspaces and Turborepo for parallel builds.

### Acceptance Criteria
- [ ] `pnpm install` works from root
- [ ] `pnpm dev` starts all dev servers
- [ ] `pnpm build` builds all packages
- [ ] `pnpm lint` runs across all packages
- [ ] `pnpm typecheck` validates TypeScript

### Technical Requirements

```
daww3/
├── apps/
│   ├── web/           # Vue 3 frontend
│   ├── api/           # NestJS backend
│   ├── seed/          # P2P seed node
│   └── contracts/     # Hardhat
├── packages/
│   ├── dsp/           # Rust WASM
│   ├── shared/        # Shared types
│   └── plugin-spec/   # Plugin schema
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
└── README.md
```

### Subtasks
- [ ] Create root `package.json` with workspace scripts
- [ ] Create `pnpm-workspace.yaml`
- [ ] Create `turbo.json` with pipeline config
- [ ] Create shared `tsconfig.base.json`
- [ ] Setup ESLint with TypeScript rules
- [ ] Setup Prettier
- [ ] Create README with quick start guide
- [ ] Create `.nvmrc` with Node version
- [ ] Create `.npmrc` with pnpm settings

### Definition of Done
```bash
git clone <repo>
cd daww3
pnpm i && pnpm dev
# → All services start without errors
```

---

## E1-T2: Docker Sandbox

**Priority:** 🔴 P0 CRITICAL  
**Points:** 5  
**Depends on:** E1-T1

### Description
Docker Compose configuration for full local stack.

### Acceptance Criteria
- [ ] `docker-compose up` starts all services
- [ ] All services accessible on localhost
- [ ] Volumes persist data between restarts
- [ ] Health checks for all services

### Services
| Service | Image/Build | Port |
|---------|-------------|------|
| web | Build | 3000 |
| api | Build | 4000 |
| seed | Build | 5000 |
| postgres | postgres:16-alpine | 5432 |
| redis | redis:7-alpine | 6379 |
| minio | minio/minio | 9000, 9001 |
| hardhat | Build | 8545 |

### Subtasks
- [ ] Create `docker/docker-compose.yml`
- [ ] Create `docker/Dockerfile.web`
- [ ] Create `docker/Dockerfile.api`
- [ ] Create `docker/Dockerfile.seed`
- [ ] Create `docker/Dockerfile.hardhat`
- [ ] Create `.env.example` with all variables
- [ ] Setup volume mappings for hot reload
- [ ] Add health checks
- [ ] Test full stack startup

### Definition of Done
```bash
cp .env.example .env
docker-compose up
# → All 7 services running and healthy
```

---

## E1-T3: Dev Tooling

**Priority:** 🟠 P1 HIGH  
**Points:** 3  
**Depends on:** E1-T2

### Description
Developer experience improvements: hot reload, Makefile, debugging tools.

### Acceptance Criteria
- [ ] Hot reload works for frontend
- [ ] Hot reload works for backend
- [ ] Makefile with common commands
- [ ] VSCode debug configs

### Subtasks
- [ ] Configure Vite HMR for frontend
- [ ] Configure NestJS watch mode
- [ ] Create comprehensive Makefile
- [ ] Create `.vscode/launch.json`
- [ ] Create `.vscode/tasks.json`
- [ ] Create `.vscode/extensions.json`
- [ ] Test hot reload in Docker

### Makefile Commands
```makefile
make install     # Install dependencies
make dev         # Start dev (no Docker)
make up          # Docker up
make down        # Docker down
make reset       # Reset volumes
make logs        # View logs
make build       # Build all
make test        # Run tests
make dsp         # Build WASM DSP
make db-push     # Push Prisma schema
make db-studio   # Open Prisma Studio
```

### Definition of Done
- Makefile has 10+ useful commands
- Hot reload < 1s for frontend changes
- Hot reload < 3s for backend changes

---

## Dependencies Graph

```
E1-T1 (Monorepo)
    │
    ▼
E1-T2 (Docker)
    │
    ▼
E1-T3 (Dev Tooling)
    │
    ▼
[E2, E3, E5 can start in parallel]
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| pnpm workspace issues | High | Test with clean install |
| Docker networking | Medium | Use named network |
| Volume permissions | Medium | Set proper UIDs |
| Hot reload in Docker | Low | Use bind mounts correctly |

---

## Notes for Developer

1. Use `pnpm@9.0.0` exactly
2. Node.js 20 LTS required
3. All Dockerfiles should use multi-stage builds for production
4. Keep dev and prod configs separate
