# 🚀 E19: Production Deployment — QA Test Specifications

> **Epic:** E19 - Production Deployment
> **Priority:** 🟠 HIGH
> **Focus:** Kubernetes, Terraform, TURN, Backup/DR, Load Testing

---

## QA Agent Prompt

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive deployment tests
    expertize = 'you are world class DevOps and SRE QA engineer'
    target = validate production infrastructure and scalability
    test = true

    code style = [Infrastructure as Code testing, Chaos engineering]
    write docs = true
    deep thinking = true
    performance = 10K concurrent connections
    tech stack = ['Kubernetes', 'Terraform', 'Artillery', 'k6']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for E19 Production Deployment.
Validate K8s manifests, infrastructure, TURN, backup, load testing.

{{{{ #CUSTOMER PROMT

Нужны QA тесты для production deployment:
- E19-T1: Kubernetes manifests
- E19-T2: Terraform infrastructure
- E19-T3: TURN server deployment
- E19-T4: Database backup & DR
- E19-T5: Load testing (10K connections)
- E19-T6: Security audit execution

}}}}

<<<<<<#RECOMMENDED TASKS

E19-QA-1. Kubernetes Tests
E19-QA-2. Terraform Tests
E19-QA-3. TURN Server Tests
E19-QA-4. Backup/DR Tests
E19-QA-5. Load Tests
E19-QA-6. Security Audit

>>>>>>

]]]]
```

---

## E19-QA-1: Kubernetes Tests

```yaml
# tests/k8s/deployment-test.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: k8s-test-config
data:
  test-deployment.sh: |
    #!/bin/bash
    set -e
    
    echo "Testing API deployment..."
    kubectl rollout status deployment/daww3-api -n daww3 --timeout=300s
    
    echo "Testing Web deployment..."
    kubectl rollout status deployment/daww3-web -n daww3 --timeout=300s
    
    echo "Testing Seed deployment..."
    kubectl rollout status deployment/daww3-seed -n daww3 --timeout=300s
    
    echo "Checking pod health..."
    kubectl get pods -n daww3 -o jsonpath='{.items[*].status.phase}' | grep -v Running && exit 1
    
    echo "Checking services..."
    kubectl get svc -n daww3 -o jsonpath='{.items[*].spec.clusterIP}' | grep -v None || true
    
    echo "All deployments healthy!"
```

```typescript
describe('Kubernetes Deployment', () => {
  describe('Manifest Validation', () => {
    it('API deployment manifest is valid', async () => {
      const result = await exec('kubectl apply --dry-run=client -f k8s/api-deployment.yaml')
      expect(result.exitCode).toBe(0)
    })

    it('all manifests pass kubeval', async () => {
      const result = await exec('kubeval k8s/*.yaml')
      expect(result.exitCode).toBe(0)
    })
  })

  describe('Health Checks', () => {
    it('API pod readiness probe passes', async () => {
      const pod = await k8s.getPod('daww3-api')
      expect(pod.status.conditions.find(c => c.type === 'Ready').status).toBe('True')
    })

    it('all pods running', async () => {
      const pods = await k8s.listPods('daww3')
      const notRunning = pods.filter(p => p.status.phase !== 'Running')
      expect(notRunning.length).toBe(0)
    })
  })

  describe('Resource Limits', () => {
    it('API has resource limits', async () => {
      const deployment = await k8s.getDeployment('daww3-api')
      const limits = deployment.spec.template.spec.containers[0].resources.limits
      
      expect(limits.memory).toBeDefined()
      expect(limits.cpu).toBeDefined()
    })
  })

  describe('Scaling', () => {
    it('HPA scales API on load', async () => {
      const hpa = await k8s.getHPA('daww3-api-hpa')
      
      // Simulate load
      await generateLoad('/api/v1/health', 1000)
      
      await waitFor(async () => {
        const updated = await k8s.getHPA('daww3-api-hpa')
        return updated.status.currentReplicas > hpa.status.currentReplicas
      }, 120000)
    })
  })
})
```

---

## E19-QA-2: Terraform Tests

```hcl
# tests/terraform/main_test.go
package test

import (
    "testing"
    "github.com/gruntwork-io/terratest/modules/terraform"
    "github.com/stretchr/testify/assert"
)

func TestTerraformPlan(t *testing.T) {
    terraformOptions := &terraform.Options{
        TerraformDir: "../../terraform/environments/staging",
    }

    output := terraform.InitAndPlan(t, terraformOptions)
    assert.NotEmpty(t, output)
}

func TestDatabaseCreation(t *testing.T) {
    terraformOptions := &terraform.Options{
        TerraformDir: "../../terraform/modules/database",
        Vars: map[string]interface{}{
            "instance_class": "db.t3.micro",
            "allocated_storage": 20,
        },
    }

    defer terraform.Destroy(t, terraformOptions)
    terraform.InitAndApply(t, terraformOptions)

    endpoint := terraform.Output(t, terraformOptions, "endpoint")
    assert.NotEmpty(t, endpoint)
}
```

```typescript
describe('Terraform Infrastructure', () => {
  describe('Plan Validation', () => {
    it('terraform plan succeeds', async () => {
      const result = await exec('terraform plan -detailed-exitcode', {
        cwd: 'terraform/environments/staging'
      })
      expect([0, 2]).toContain(result.exitCode) // 0=no changes, 2=changes pending
    })

    it('no destroy operations in plan', async () => {
      const result = await exec('terraform plan -json', {
        cwd: 'terraform/environments/staging'
      })
      const plan = JSON.parse(result.stdout)
      const destroys = plan.resource_changes?.filter(r => r.change.actions.includes('delete'))
      expect(destroys?.length || 0).toBe(0)
    })
  })

  describe('Module Validation', () => {
    const modules = ['database', 'redis', 's3', 'ecs']

    modules.forEach(module => {
      it(`${module} module validates`, async () => {
        const result = await exec('terraform validate', {
          cwd: `terraform/modules/${module}`
        })
        expect(result.exitCode).toBe(0)
      })
    })
  })

  describe('Security', () => {
    it('no secrets in terraform state', async () => {
      const result = await exec('terraform show -json')
      const state = JSON.parse(result.stdout)
      
      const hasSecrets = JSON.stringify(state).match(
        /password|secret|api_key|private_key/i
      )
      expect(hasSecrets).toBeNull()
    })

    it('passes tfsec security scan', async () => {
      const result = await exec('tfsec terraform/')
      expect(result.exitCode).toBe(0)
    })
  })
})
```

---

## E19-QA-3: TURN Server Tests

```typescript
describe('TURN Server', () => {
  describe('Connectivity', () => {
    it('TURN server is reachable', async () => {
      const result = await exec(`turnutils_uclient -T -u ${TURN_USER} -w ${TURN_PASS} ${TURN_HOST}`)
      expect(result.exitCode).toBe(0)
    })

    it('allocates relay address', async () => {
      const client = new TURNClient(TURN_HOST, TURN_USER, TURN_PASS)
      const allocation = await client.allocate()
      
      expect(allocation.relayAddress).toBeDefined()
      expect(allocation.relayPort).toBeGreaterThan(0)
    })
  })

  describe('Credentials', () => {
    it('generates time-limited credentials', async () => {
      const creds = await turnService.generateCredentials('user-1')
      
      expect(creds.username).toContain(':')
      expect(creds.credential).toBeDefined()
      expect(creds.ttl).toBeGreaterThan(0)
    })

    it('rejects expired credentials', async () => {
      const creds = await turnService.generateCredentials('user-1', { ttl: 1 })
      
      await waitMs(2000)
      
      const client = new TURNClient(TURN_HOST, creds.username, creds.credential)
      await expect(client.allocate()).rejects.toThrow()
    })
  })

  describe('NAT Traversal', () => {
    it('establishes peer connection via TURN', async () => {
      const peer1 = await createPeerConnection({ forceTurn: true })
      const peer2 = await createPeerConnection({ forceTurn: true })
      
      // Exchange offers
      const offer = await peer1.createOffer()
      await peer2.setRemoteDescription(offer)
      const answer = await peer2.createAnswer()
      await peer1.setRemoteDescription(answer)
      
      // Exchange candidates
      await exchangeICECandidates(peer1, peer2)
      
      // Wait for connection
      await waitFor(() => 
        peer1.connectionState === 'connected' && 
        peer2.connectionState === 'connected'
      , 30000)
    })
  })
})
```

---

## E19-QA-4: Backup/DR Tests

```typescript
describe('Database Backup & DR', () => {
  describe('Automated Backups', () => {
    it('daily backup exists', async () => {
      const backups = await rds.describeDBSnapshots({
        DBInstanceIdentifier: 'daww3-production'
      }).promise()
      
      const today = new Date().toISOString().split('T')[0]
      const todayBackup = backups.DBSnapshots?.find(s => 
        s.SnapshotCreateTime?.toISOString().startsWith(today)
      )
      
      expect(todayBackup).toBeDefined()
    })

    it('retention policy enforced', async () => {
      const instance = await rds.describeDBInstances({
        DBInstanceIdentifier: 'daww3-production'
      }).promise()
      
      expect(instance.DBInstances[0].BackupRetentionPeriod).toBeGreaterThanOrEqual(7)
    })
  })

  describe('Point-in-Time Recovery', () => {
    it('PITR is enabled', async () => {
      const instance = await rds.describeDBInstances({
        DBInstanceIdentifier: 'daww3-production'
      }).promise()
      
      expect(instance.DBInstances[0].LatestRestorableTime).toBeDefined()
    })
  })

  describe('Restore Test', () => {
    it('can restore from backup', async () => {
      const backups = await rds.describeDBSnapshots().promise()
      const latestBackup = backups.DBSnapshots?.sort((a, b) => 
        b.SnapshotCreateTime!.getTime() - a.SnapshotCreateTime!.getTime()
      )[0]
      
      // Restore to test instance
      await rds.restoreDBInstanceFromDBSnapshot({
        DBInstanceIdentifier: 'daww3-restore-test',
        DBSnapshotIdentifier: latestBackup!.DBSnapshotIdentifier!,
        DBInstanceClass: 'db.t3.micro'
      }).promise()
      
      // Wait for restore
      await waitFor(async () => {
        const status = await rds.describeDBInstances({
          DBInstanceIdentifier: 'daww3-restore-test'
        }).promise()
        return status.DBInstances[0].DBInstanceStatus === 'available'
      }, 600000)
      
      // Cleanup
      await rds.deleteDBInstance({
        DBInstanceIdentifier: 'daww3-restore-test',
        SkipFinalSnapshot: true
      }).promise()
    }, 900000) // 15 minute timeout
  })
})
```

---

## E19-QA-5: Load Tests

```yaml
# artillery/load-test.yml
config:
  target: "https://staging.daww3.io"
  phases:
    - duration: 60
      arrivalRate: 50
      name: "Warm up"
    - duration: 300
      arrivalRate: 200
      name: "Sustained load"
    - duration: 60
      arrivalRate: 500
      name: "Spike"
  socketio:
    path: "/socket.io"

scenarios:
  - name: "API Load"
    weight: 3
    flow:
      - get:
          url: "/api/v1/tracks"
      - think: 2
      - get:
          url: "/api/v1/tracks/{{ $randomString(8) }}"
      - think: 1

  - name: "WebSocket Load"
    weight: 2
    engine: socketio
    flow:
      - emit:
          channel: "join-track"
          data:
            trackId: "load-test-track"
      - think: 30
      - emit:
          channel: "leave-track"
```

```typescript
describe('Load Testing', () => {
  describe('API Load', () => {
    it('handles 1000 RPS', async () => {
      const result = await runArtillery('artillery/api-load.yml')
      
      expect(result.aggregate.codes['200']).toBeGreaterThan(0)
      expect(result.aggregate.codes['5xx'] || 0).toBe(0)
      expect(result.aggregate.latency.p99).toBeLessThan(500)
    })
  })

  describe('WebSocket Load', () => {
    it('supports 10K concurrent connections', async () => {
      const connections: Socket[] = []
      const connectionTimes: number[] = []
      
      console.log('Connecting 10K WebSockets...')
      
      for (let batch = 0; batch < 100; batch++) {
        const batchStart = performance.now()
        
        const batchPromises = Array(100).fill(null).map(() =>
          new Promise<Socket>((resolve, reject) => {
            const socket = io('wss://staging.daww3.io', {
              transports: ['websocket']
            })
            socket.on('connect', () => resolve(socket))
            socket.on('connect_error', reject)
            setTimeout(() => reject(new Error('timeout')), 30000)
          })
        )
        
        const batchSockets = await Promise.all(batchPromises)
        connections.push(...batchSockets)
        connectionTimes.push(performance.now() - batchStart)
        
        console.log(`Batch ${batch + 1}/100: ${connections.length} connected`)
      }
      
      expect(connections.length).toBe(10000)
      
      // Test message latency under load
      const latencies: number[] = []
      for (let i = 0; i < 100; i++) {
        const start = performance.now()
        await new Promise<void>(resolve => {
          connections[i].emit('ping')
          connections[i].once('pong', () => {
            latencies.push(performance.now() - start)
            resolve()
          })
        })
      }
      
      const avgLatency = latencies.reduce((a, b) => a + b) / latencies.length
      console.log(`Average latency under 10K load: ${avgLatency.toFixed(2)}ms`)
      
      expect(avgLatency).toBeLessThan(100)
      
      // Cleanup
      connections.forEach(s => s.close())
    }, 600000) // 10 minute timeout
  })

  describe('Database Load', () => {
    it('handles 500 concurrent queries', async () => {
      const queries = Array(500).fill(null).map(() =>
        prisma.track.findMany({ take: 10 })
      )
      
      const start = performance.now()
      await Promise.all(queries)
      const elapsed = performance.now() - start
      
      expect(elapsed).toBeLessThan(5000) // 5 seconds max
    })
  })
})
```

---

## E19-QA-6: Security Audit

```typescript
describe('Security Audit', () => {
  describe('Dependency Vulnerabilities', () => {
    it('npm audit passes', async () => {
      const result = await exec('pnpm audit --audit-level=high')
      expect(result.exitCode).toBe(0)
    })
  })

  describe('OWASP ZAP Scan', () => {
    it('no high severity findings', async () => {
      const result = await exec(`
        docker run -t owasp/zap2docker-stable zap-baseline.py \
          -t https://staging.daww3.io \
          -J zap-report.json
      `)
      
      const report = JSON.parse(await fs.readFile('zap-report.json', 'utf8'))
      const highSeverity = report.site[0].alerts.filter(a => a.riskcode >= 3)
      
      expect(highSeverity.length).toBe(0)
    })
  })

  describe('SSL/TLS', () => {
    it('gets A+ on SSL Labs', async () => {
      // Use SSL Labs API or sslyze
      const result = await exec('sslyze staging.daww3.io --json_out=ssl-report.json')
      const report = JSON.parse(await fs.readFile('ssl-report.json', 'utf8'))
      
      expect(report.server_scan_results[0].scan_commands_results
        .certificate_info.certificate_deployments[0].verified_chain_has_sha1).toBe(false)
    })
  })

  describe('Headers', () => {
    it('security headers present', async () => {
      const res = await fetch('https://staging.daww3.io')
      
      expect(res.headers.get('x-content-type-options')).toBe('nosniff')
      expect(res.headers.get('x-frame-options')).toBe('DENY')
      expect(res.headers.get('strict-transport-security')).toBeDefined()
      expect(res.headers.get('content-security-policy')).toBeDefined()
    })
  })
})
```

---

## Manual Test Checklist

### E19-T1: Kubernetes
- [ ] Deployments roll out successfully
- [ ] Pods pass readiness probes
- [ ] HPA scales on load
- [ ] Ingress routes correctly

### E19-T2: Terraform
- [ ] Plan shows expected changes
- [ ] Apply completes successfully
- [ ] Resources created in AWS

### E19-T3: TURN
- [ ] TURN server reachable
- [ ] Credentials generate
- [ ] P2P connection via TURN works

### E19-T4: Backup/DR
- [ ] Backups exist
- [ ] Restore to test instance works
- [ ] RTO/RPO met

### E19-T5: Load Testing
- [ ] API handles target RPS
- [ ] 10K WebSocket connections stable
- [ ] No errors under load

### E19-T6: Security
- [ ] No high vulnerabilities
- [ ] SSL A+ rating
- [ ] Headers correct

---

*E19 Deployment QA — DAWW3 Sprint 3*
