# E19: Production Deployment — Agent Prompts

> **Goal:** K8s, TURN, load testing, backup/DR, security
> **Sprint:** 3
> **Owner:** DevOps / Backend
> **Source:** E5, E13, E14 "Problems/Not Implemented"

---

## E19-T1: Kubernetes Manifests

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class Kubernetes architect'
    target = create production-ready Kubernetes manifests
    test = true

    code style = [DRY, Best practice, GitOps]
    write docs = true
    deep thinking = true
    performance = auto-scaling, high availability
    tech stack = ['Kubernetes', 'Helm', 'Kustomize']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create Kubernetes manifests for DAWW3 production deployment.
Support auto-scaling, secrets management, and health checks.

{{{{ #CUSTOMER PROMT

Kubernetes deployment manifests отсутствуют. Нужно:
- Deployments для всех сервисов
- Services и Ingress
- ConfigMaps и Secrets
- HPA (auto-scaling)
- PVC для persistent storage

}}}}

<<<<<<#RECOMMENDED TASKS

K8S-1. Base Manifests
- Namespace definition
- Resource quotas
- Network policies
- RBAC configuration
- Service accounts

K8S-2. Application Deployments
- api deployment (replicas, resources, probes)
- web deployment (static files or SSR)
- seed deployment (stateful)
- worker deployment (jobs processor)
- Pod disruption budgets

K8S-3. Services & Ingress
- ClusterIP services
- LoadBalancer for API
- Ingress with TLS
- COOP/COEP headers in Ingress
- WebSocket sticky sessions

K8S-4. Configuration Management
- ConfigMaps for app config
- Secrets for credentials
- External Secrets Operator
- Environment separation (dev/staging/prod)
- Config reloading

K8S-5. Auto-scaling
- HorizontalPodAutoscaler per service
- CPU/memory based scaling
- Custom metrics scaling
- Scale-to-zero for workers
- Cluster autoscaler config

K8S-6. Storage
- PersistentVolumeClaims for seed data
- StorageClass definitions
- Backup integration
- Volume snapshots
- Data migration strategy

🏁 Definition of Done
- All services deploy to K8s
- Auto-scaling works
- Secrets managed securely
- Ingress routes traffic correctly
- Health checks pass

>>>>>>

]]]]
```

---

## E19-T2: Terraform Infrastructure

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class cloud infrastructure engineer'
    target = create Terraform modules for cloud infrastructure
    test = true

    code style = [DRY, modular, reusable]
    write docs = true
    deep thinking = true
    performance = cost-optimized, secure
    tech stack = ['Terraform', 'AWS/GCP/Azure', 'HCL']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create Terraform modules for DAWW3 cloud infrastructure.
Support AWS, with optional GCP/Azure compatibility.

{{{{ #CUSTOMER PROMT

Terraform infrastructure отсутствует. Нужно:
- VPC и networking
- EKS cluster
- RDS PostgreSQL
- ElastiCache Redis
- S3 (MinIO compatible)
- CloudFront CDN

}}}}

<<<<<<#RECOMMENDED TASKS

TF-1. VPC Module
- VPC with public/private subnets
- NAT Gateway
- Internet Gateway
- Route tables
- Security groups

TF-2. EKS Module
- EKS cluster
- Node groups (on-demand + spot)
- OIDC provider
- aws-auth ConfigMap
- Cluster autoscaler IAM

TF-3. Database Module
- RDS PostgreSQL
- Multi-AZ option
- Automated backups
- Parameter groups
- Security group

TF-4. Cache Module
- ElastiCache Redis
- Cluster mode
- Encryption at rest/transit
- Automatic failover
- Parameter groups

TF-5. Storage Module
- S3 buckets
- Bucket policies
- CORS configuration
- Lifecycle rules
- Replication (optional)

TF-6. CDN Module
- CloudFront distribution
- Origin configuration
- Cache behaviors
- SSL certificate
- COOP/COEP headers

🏁 Definition of Done
- terraform apply creates full stack
- State stored remotely (S3 + DynamoDB)
- Environments separated (workspaces)
- Cost tags applied
- Documentation complete

>>>>>>

]]]]
```

---

## E19-T3: TURN Server Deployment

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class WebRTC infrastructure engineer'
    target = deploy production TURN server infrastructure
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = handle 10K concurrent relays
    tech stack = ['coturn', 'Docker', 'Kubernetes', 'Prometheus']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Deploy production TURN server for DAWW3 P2P connections.
High availability with geographic distribution.

{{{{ #CUSTOMER PROMT

TURN server not deployed (Docker config ready). Нужно:
- Production coturn deployment
- Multiple regions
- SSL/TLS certificates
- Credential rotation
- Monitoring

}}}}

<<<<<<#RECOMMENDED TASKS

TURN-1. Production Configuration
- coturn.conf for production
- TLS configuration
- Realm and authentication
- Bandwidth limits
- Logging configuration

TURN-2. Kubernetes Deployment
- StatefulSet for coturn
- Service (LoadBalancer per region)
- ConfigMap for configuration
- Secret for credentials
- Health checks

TURN-3. Multi-region Setup
- Deploy to multiple regions
- Region-aware client selection
- Latency-based routing
- Failover between regions
- GeoDNS or Anycast

TURN-4. Credential Management
- Time-limited credentials
- Credential generation API
- Rotation schedule
- Revocation support
- Audit logging

TURN-5. Monitoring & Metrics
- Prometheus metrics export
- Active sessions gauge
- Bandwidth counters
- Error rate tracking
- Grafana dashboard

TURN-6. Cost Optimization
- Spot instances where possible
- Auto-scaling based on sessions
- Traffic analysis
- Cost allocation tags
- Budget alerts

🏁 Definition of Done
- TURN servers running in 3+ regions
- Connection success rate > 98%
- Credentials rotate automatically
- Monitoring shows health
- Cost within budget

>>>>>>

]]]]
```

---

## E19-T4: Database Backup & DR

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class database reliability engineer'
    target = implement comprehensive backup and disaster recovery
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = RPO < 1 hour, RTO < 4 hours
    tech stack = ['PostgreSQL', 'pgBackRest', 'AWS S3', 'Terraform']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement database backup and disaster recovery for DAWW3.
Automated backups with tested restore procedures.

{{{{ #CUSTOMER PROMT

Database backup and disaster recovery procedures отсутствуют. Нужно:
- Automated daily backups
- Point-in-time recovery
- Cross-region replication
- Restore testing
- DR runbook

}}}}

<<<<<<#RECOMMENDED TASKS

BACKUP-1. Backup Strategy
- Full weekly backups
- Incremental daily backups
- Continuous WAL archiving
- Retention policy (30 days)
- Encryption at rest

BACKUP-2. Backup Implementation
- pgBackRest or AWS RDS snapshots
- S3 storage configuration
- Compression settings
- Parallel backup/restore
- Backup verification

BACKUP-3. Point-in-time Recovery
- WAL archiving to S3
- Recovery to any point
- Recovery testing
- Documentation
- Automation scripts

BACKUP-4. Cross-region Replication
- Read replica in DR region
- Automatic failover (optional)
- Lag monitoring
- Promotion procedure
- Network configuration

BACKUP-5. Restore Testing
- Monthly restore tests
- Test environment provisioning
- Data validation
- Performance verification
- Test reports

BACKUP-6. DR Runbook
- Incident detection
- Decision criteria
- Failover procedure
- Data verification
- Communication plan

🏁 Definition of Done
- Daily backups automated
- PITR works (tested)
- DR region has replica
- Restore tested monthly
- Runbook documented

>>>>>>

]]]]
```

---

## E19-T5: Load Testing (10K Connections)

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class performance testing engineer'
    target = implement load testing for 10K concurrent connections
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = identify bottlenecks, set baselines
    tech stack = ['k6', 'Artillery', 'Grafana', 'Prometheus']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement load testing for DAWW3 platform.
Test 10K concurrent WebSocket connections and API endpoints.

{{{{ #CUSTOMER PROMT

Performance load testing (10K connections benchmark) отсутствует. Нужно:
- WebSocket load test
- API endpoint load test
- P2P simulation
- Baseline establishment
- Bottleneck identification

}}}}

<<<<<<#RECOMMENDED TASKS

LOAD-1. Test Framework Setup
- k6 or Artillery installation
- Test scripts structure
- CI/CD integration
- Results storage
- Reporting dashboard

LOAD-2. WebSocket Load Tests
- Connection ramp-up
- Message throughput
- Room join/leave
- Presence updates
- Reconnection handling

LOAD-3. API Load Tests
- Authentication endpoints
- CRUD operations
- File uploads
- Search queries
- Rate limit verification

LOAD-4. P2P Simulation
- Simulated peer connections
- Chunk requests
- Swarm behavior
- Bandwidth simulation
- Failure injection

LOAD-5. Baseline Establishment
- Response time percentiles (p50, p95, p99)
- Throughput limits
- Error rates
- Resource utilization
- Cost per request

LOAD-6. Bottleneck Analysis
- CPU profiling
- Memory analysis
- Network saturation
- Database query analysis
- Recommendations

🏁 Definition of Done
- 10K concurrent connections tested
- Baselines documented
- Bottlenecks identified
- Optimization recommendations
- CI/CD integration for regression

>>>>>>

]]]]
```

---

## E19-T6: Security Audit Execution

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class application security engineer'
    target = execute security audit and penetration testing
    test = true

    code style = [secure, documented]
    write docs = true
    deep thinking = true
    performance = n/a
    tech stack = ['OWASP ZAP', 'Burp Suite', 'Slither', 'npm audit']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Execute security audit for DAWW3 platform.
Identify and remediate vulnerabilities before production.

{{{{ #CUSTOMER PROMT

Security audit and penetration testing отсутствует. Нужно:
- OWASP Top 10 testing
- Smart contract audit
- Dependency vulnerability scan
- API security testing
- Remediation tracking

}}}}

<<<<<<#RECOMMENDED TASKS

SEC-1. Dependency Scanning
- npm audit for all packages
- Snyk or Dependabot integration
- CVE tracking
- Update strategy
- CI/CD blocking on critical

SEC-2. OWASP Testing
- OWASP ZAP automated scan
- Injection testing
- Auth/session testing
- XSS testing
- CSRF testing

SEC-3. API Security
- Authentication bypass attempts
- Authorization testing
- Input validation
- Rate limiting verification
- Error message leakage

SEC-4. Smart Contract Audit
- Slither static analysis
- Manual code review
- Gas optimization review
- Access control verification
- Prepare for external audit

SEC-5. Infrastructure Security
- Network segmentation review
- Secrets management audit
- IAM policy review
- Encryption verification
- Logging and monitoring

SEC-6. Remediation & Reporting
- Vulnerability tracking
- Severity classification
- Remediation timelines
- Re-testing verification
- Security report

🏁 Definition of Done
- No critical vulnerabilities open
- High severity fixed within 1 week
- Medium fixed within 2 weeks
- Security report published
- CI/CD security gates active

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E13 (Backend Scale) + E14 (P2P Resilience) + E15 (Web3) ✅
    │
    ├─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼
E19-T1 (K8s)         E19-T3 (TURN)        E19-T6 (Security)
    │                     │
    ▼                     │
E19-T2 (Terraform)        │
    │                     │
    └─────────┬───────────┘
              ▼
        E19-T4 (Backup/DR)
              │
              ▼
        E19-T5 (Load Test)
              │
              ▼
        [Production Ready]
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| K8s complexity | High | Start with managed K8s (EKS/GKE) |
| TURN server cost | Medium | Auto-scaling, usage limits |
| DR testing gaps | High | Monthly drill schedule |
| Security findings | High | Buffer time for remediation |
