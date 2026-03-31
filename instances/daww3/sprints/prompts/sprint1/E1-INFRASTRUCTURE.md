# E1: Sandbox Infrastructure — Agent Prompts

---

## E1-T1: Monorepo Setup

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class DevOps architect'
    target = initialize pnpm + turborepo monorepo for DAWW3
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    cellular dependence = false
    tree-like dependency linking = true
    performance = minimum code - fast builds
    tech stack = ['pnpm@9', 'turborepo@2', 'typescript@5.6', 'eslint@8', 'prettier@3']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Initialize monorepo for DAWW3 — Web-based Digital Audio Workstation with P2P streaming and Web3 monetization.

One command to install, one command to run all services.

{{{{ #CUSTOMER PROMT

Мне нужен monorepo где:
- pnpm i работает из корня
- pnpm dev запускает все сервисы
- Общий TypeScript config
- ESLint и Prettier настроены
- README с quick start

}}}}

<<<<<<#RECOMMENDED TASKS

MONO-1. Root package.json
- name: daww3
- private: true
- scripts: dev, build, lint, format, typecheck, clean, test
- packageManager: pnpm@9.0.0
- engines: node >=20

MONO-2. pnpm-workspace.yaml
- apps/*
- packages/*

MONO-3. turbo.json
- pipeline: build, dev, lint, test, typecheck
- parallel execution
- cache configuration

MONO-4. tsconfig.base.json
- target: ES2020
- module: ESNext
- strict: true
- paths aliases

MONO-5. ESLint Configuration
- @typescript-eslint
- Vue support
- Import ordering

MONO-6. Prettier Configuration
- semi: false
- singleQuote: true
- tabWidth: 2

MONO-7. App Scaffolding
- apps/web/ (Vue 3 placeholder)
- apps/api/ (NestJS placeholder)
- apps/seed/ (Node.js placeholder)
- apps/contracts/ (Hardhat placeholder)

MONO-8. Package Scaffolding
- packages/dsp/ (Rust WASM placeholder)
- packages/shared/ (TypeScript types)

MONO-9. README.md
- Project description
- Prerequisites
- Quick start
- Available scripts

🏁 Definition of Done
- pnpm install works from root
- pnpm dev starts placeholder for all apps
- pnpm lint runs across workspace
- pnpm build succeeds
- No TypeScript errors

>>>>>>

]]]]
```

---

## E1-T2: Docker Sandbox

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class DevOps engineer'
    target = docker-compose for full local development stack
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast container startup
    tech stack = ['docker', 'docker-compose', 'postgresql@16', 'redis@7', 'minio']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create Docker Compose configuration for DAWW3 local development.
All services must be accessible on localhost with hot reload.

{{{{ #CUSTOMER PROMT

docker-compose up должен поднять:
- Frontend (port 3000)
- Backend API (port 4000)
- P2P Seed node (port 5000)
- PostgreSQL (port 5432)
- Redis (port 6379)
- MinIO S3 (port 9000, 9001)
- Hardhat local blockchain (port 8545)

}}}}

<<<<<<#RECOMMENDED TASKS

DOCK-1. docker-compose.yml
- version 3.9
- all 7 services defined
- proper depends_on with conditions
- named network

DOCK-2. Dockerfile.web
- node:20-alpine
- pnpm setup
- hot reload via volume

DOCK-3. Dockerfile.api
- node:20-alpine
- pnpm setup
- Prisma generate

DOCK-4. Dockerfile.seed
- node:20-alpine
- native module support (wrtc)

DOCK-5. Dockerfile.hardhat
- node:20-alpine
- hardhat node

DOCK-6. Volume Configuration
- postgres_data
- redis_data
- minio_data
- seed_data (chunks)

DOCK-7. Health Checks
- postgres: pg_isready
- redis: redis-cli ping
- minio: curl health endpoint

DOCK-8. .env.example
- All environment variables
- Comments explaining each

🏁 Definition of Done
- docker-compose up starts all services
- All health checks pass
- Hot reload works for web and api
- Volumes persist data

>>>>>>

]]]]
```

---

## E1-T3: Dev Tooling

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class developer experience engineer'
    target = developer productivity tools and Makefile
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast feedback loops
    tech stack = ['make', 'vscode', 'vite HMR', 'nestjs watch']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create comprehensive developer tooling for DAWW3.
Makefile with common commands, VSCode configs, hot reload optimization.

{{{{ #CUSTOMER PROMT

Нужен удобный DX:
- Makefile с командами up/down/reset/logs
- VSCode debug configs
- Hot reload < 1s для frontend
- Hot reload < 3s для backend

}}}}

<<<<<<#RECOMMENDED TASKS

DEV-1. Makefile
Commands:
- make install
- make dev
- make up / down / reset
- make logs / logs-api / logs-web
- make build
- make test
- make dsp (WASM build)
- make db-push / db-migrate / db-studio
- make clean

DEV-2. VSCode launch.json
- Debug API (attach)
- Debug Web (Chrome)
- Debug Tests

DEV-3. VSCode tasks.json
- Start dev
- Run tests
- Build

DEV-4. VSCode extensions.json
- Vue - Volar
- ESLint
- Prettier
- Prisma
- Tailwind CSS

DEV-5. Vite HMR Optimization
- Proper deps optimization
- Fast refresh

DEV-6. NestJS Watch Mode
- SWC for fast compilation
- Incremental builds

🏁 Definition of Done
- make help shows all commands
- VSCode debugging works
- Hot reload is fast
- All common operations are one command

>>>>>>

]]]]
```
