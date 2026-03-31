# E28: Beta Launch & Monitoring — Agent Prompts

> **Goal:** Deploy to 10-100 beta users, monitor, iterate
> **Sprint:** 4
> **Owner:** All
> **Priority:** 🟠 P1 HIGH (Validates product-market fit)

---

## E28-T1: Beta Environment Setup (Staging)

```
[[[[ #SETTINGS

    mode = agent - setup staging environment
    expertize = 'you are world class DevOps engineer'
    target = production-like staging environment
    test = false

    code style = [infrastructure as code, reproducible]
    write docs = true
    deep thinking = false
    performance = not critical
    tech stack = ['Kubernetes', 'Terraform', 'Docker', 'AWS/GCP']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Setup staging environment that mirrors production for beta testing.

{{{{ #CUSTOMER PROMT

Staging environment нужен для beta users перед production.
Должен быть максимально похож на production:
- Real database (not test data)
- Testnet blockchain (Polygon Mumbai)
- Real S3/MinIO
- SSL certificates
- Monitoring/alerting

}}}}

<<<<<<#RECOMMENDED TASKS

STAGE-1. Terraform Staging Config
```hcl
# terraform/environments/staging.tfvars
environment = "staging"
domain = "staging.daww3.app"

# Smaller resources than production
eks_node_instance_type = "t3.medium"
rds_instance_class = "db.t3.micro"
redis_node_type = "cache.t3.micro"

# Auto-scaling
min_nodes = 2
max_nodes = 5

# Costs: ~$200/month
```

STAGE-2. Deploy Infrastructure
```bash
cd terraform
terraform workspace new staging
terraform apply -var-file=environments/staging.tfvars

# Outputs:
# - K8s cluster endpoint
# - RDS connection string
# - S3 bucket names
# - Load balancer DNS
```

STAGE-3. Deploy Application
```bash
# Build images
docker build -t daww3/api:staging apps/api
docker build -t daww3/web:staging apps/web

# Push to registry
docker push daww3/api:staging
docker push daww3/web:staging

# Deploy to K8s
kubectl apply -f k8s/staging/

# Wait for rollout
kubectl rollout status deployment/api -n staging
kubectl rollout status deployment/web -n staging
```

STAGE-4. Database Migration
```bash
# Run migrations on staging database
kubectl exec -it deploy/api -n staging -- \
  pnpm prisma migrate deploy

# Seed initial data
kubectl exec -it deploy/api -n staging -- \
  pnpm prisma db seed
```

STAGE-5. DNS & SSL
```bash
# Point DNS: staging.daww3.app → Load Balancer
# Use cert-manager for auto SSL
kubectl apply -f k8s/staging/certificate.yaml

# Verify: https://staging.daww3.app/health
curl https://staging.daww3.app/health
# Expected: {"status":"ok"}
```

STAGE-6. Smoke Tests
```bash
# Run E2E tests against staging
E2E_BASE_URL=https://staging.daww3.app \
  pnpm playwright test e2e/tests/smoke/

# Verify:
# - Health check passes
# - User registration works
# - Track upload works
# - P2P streaming works
```

🏁 Definition of Done
- Staging environment live
- All services healthy
- DNS configured, SSL working
- Database migrated
- Smoke tests passing
- URL: https://staging.daww3.app

>>>>>>

]]]]
```

---

## E28-T2: 10-User Private Beta

```
[[[[ #SETTINGS

    mode = agent - manage small beta cohort
    expertize = 'you are world class product manager'
    target = successful 10-user beta test
    test = false

    code style = [user research, feedback loops]
    write docs = true
    deep thinking = true
    performance = not critical
    tech stack = ['UserTesting.com', 'Google Forms', 'Mixpanel']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Launch private beta with 10 hand-picked users, collect feedback.

{{{{ #CUSTOMER PROMT

10-user beta = первая волна real users.
Цели:
1. Validate core flows работают
2. Find critical bugs
3. Collect feedback на UX
4. Measure engagement metrics

Users: друзья, коллеги, early supporters
Duration: 1-2 недели

}}}}

<<<<<<#RECOMMENDED TASKS

BETA10-1. Select Beta Users
Criteria:
- 5 artists (music producers)
- 3 listeners (music fans)
- 2 technical users (can report detailed bugs)

Outreach:
```
Subject: You're invited to DAWW3 Private Beta

Hi [Name],

You're invited to test DAWW3 - the first Web3 DAW where artists 
earn 100x more than Spotify.

As a beta tester, you'll:
- Get early access
- Shape the product
- Earn beta tester badge (NFT)

Interested? Reply and I'll send login details.

[Your Name]
```

BETA10-2. Onboarding Checklist
For each user:
- [ ] Send invite email with credentials
- [ ] Schedule 15min onboarding call
- [ ] Assign first task: "Create and publish a track"
- [ ] Add to beta Slack/Discord channel
- [ ] Track with user ID in Mixpanel

BETA10-3. Initial Tasks (Week 1)
Day 1: Registration + wallet connection
Day 2-3: Create track in DAW
Day 4: Publish track (mint NFT)
Day 5-7: Invite friends to listen

BETA10-4. Feedback Collection
**Daily Check-in (Async):**
- "What did you try today?"
- "What didn't work as expected?"
- "Any bugs encountered?"

**End of Week Survey:**
```
1. How easy was it to create your first track? (1-5)
2. Did you successfully publish? (Y/N, if N why?)
3. What feature is missing?
4. Would you recommend DAWW3? (NPS 0-10)
5. Biggest frustration?
```

BETA10-5. Bug Tracking
Setup: GitHub Issues with label "beta-bug"

Template:
```markdown
**Reporter:** [Beta User Name]
**Date:** 2026-01-XX
**Severity:** Critical / High / Medium / Low
**Steps to Reproduce:**
1. ...
2. ...
**Expected:** ...
**Actual:** ...
**Screenshots:** [attach]
```

BETA10-6. Metrics Dashboard
Track in Mixpanel/Grafana:
- Daily active users (DAU)
- Tracks created
- Tracks published
- NFTs minted
- Plays
- Royalties earned
- Retention (D1, D3, D7)

BETA10-7. Hotfix Process
If critical bug found:
1. Triage immediately
2. Fix in <24 hours
3. Deploy to staging
4. Test fix
5. Deploy to beta
6. Notify affected users

BETA10-8. Week 1 Retrospective
After 7 days:
- Review all feedback
- Prioritize top 3 issues
- Fix before expanding to 100 users
- Document lessons learned

🏁 Definition of Done
- 10 users onboarded
- 8/10 successfully created track
- 5/10 successfully published
- Zero critical bugs unfixed
- Feedback collected and analyzed
- NPS score measured
- Decision: expand to 100 users or iterate

>>>>>>

]]]]
```

---

## E28-T3: Monitoring & Alerting Config

```
[[[[ #SETTINGS

    mode = agent - setup production monitoring
    expertize = 'you are world class SRE (Site Reliability Engineer)'
    target = comprehensive monitoring and alerting
    test = false

    code style = [observable systems, proactive monitoring]
    write docs = true
    deep thinking = true
    performance = <5 min MTTD (Mean Time To Detect)
    tech stack = ['Prometheus', 'Grafana', 'Alertmanager', 'PagerDuty']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Configure monitoring and alerting for production readiness.

{{{{ #CUSTOMER PROMT

Monitoring частично setup (E10), но нужно:
1. Production-level alerts
2. On-call rotation
3. Incident response playbooks
4. SLO tracking

}}}}

<<<<<<#RECOMMENDED TASKS

MONITOR-1. Alerting Rules (Prometheus)
```yaml
# monitoring/prometheus/alerts.yml
groups:
  - name: daww3-critical
    interval: 30s
    rules:
      - alert: APIDown
        expr: up{job="api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "API is down"
          description: "API has been down for 1 minute"
      
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate (>5%)"
      
      - alert: HighLatency
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "API p95 latency > 1s"
      
      - alert: DatabaseConnectionsHigh
        expr: pg_stat_database_numbackends > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Database connections > 80"
      
      - alert: DiskSpaceLow
        expr: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Disk space < 10%"
```

MONITOR-2. Grafana Dashboards
Create dashboards:
1. **Overview:** Health, traffic, errors, latency
2. **API:** Endpoint metrics, rate limiting
3. **Database:** Connections, slow queries, replication lag
4. **P2P:** Seed bandwidth, peer count, P2P ratio
5. **Business:** Tracks created, plays, earnings, users

MONITOR-3. Alertmanager Configuration
```yaml
# monitoring/alertmanager/config.yml
route:
  group_by: ['alertname']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
    - match:
        severity: warning
      receiver: 'slack'

receivers:
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: '<PAGERDUTY_KEY>'
  
  - name: 'slack'
    slack_configs:
      - api_url: '<SLACK_WEBHOOK>'
        channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

MONITOR-4. On-Call Rotation
Setup PagerDuty:
- Schedule: 1 week rotations
- Escalation: Primary (5 min) → Secondary (10 min) → Manager
- Team: 3+ engineers

MONITOR-5. Incident Response Playbook
```markdown
# DAWW3 Incident Response

## Severity Levels
- **SEV-1:** Total outage, data loss, security breach
- **SEV-2:** Major feature down, high error rate
- **SEV-3:** Minor issue, degraded performance

## Response Time
- SEV-1: <5 minutes
- SEV-2: <30 minutes
- SEV-3: <4 hours

## Runbooks
### API Down
1. Check: `kubectl get pods -n production`
2. Logs: `kubectl logs -f deploy/api -n production`
3. Restart: `kubectl rollout restart deploy/api -n production`
4. Escalate if not resolved in 10 min

### Database Connection Pool Exhausted
1. Check active connections: `SELECT count(*) FROM pg_stat_activity`
2. Kill long-running queries: `SELECT pg_terminate_backend(pid)`
3. Scale connection pool: Update Prisma config
4. Add read replicas if needed

### P2P Seed Node Down
1. Check seed logs: `docker logs seed-node`
2. Restart seed: `docker restart seed-node`
3. Verify: Peers can still connect
4. Alert: If multiple seed nodes down
```

MONITOR-6. SLO Tracking
Service Level Objectives:
- **Availability:** 99.5% uptime (21.6 hours downtime/month)
- **Latency:** p95 <200ms
- **Error Rate:** <1%

Track with:
```promql
# Availability
(sum(rate(http_requests_total[30d])) - sum(rate(http_requests_total{status=~"5.."}[30d]))) 
/ sum(rate(http_requests_total[30d])) * 100

# p95 Latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error Rate
sum(rate(http_requests_total{status=~"5.."}[5m])) 
/ sum(rate(http_requests_total[5m])) * 100
```

MONITOR-7. Status Page
Setup: status.daww3.app (using Statuspage.io or Cachet)

Display:
- System status (Operational / Degraded / Down)
- Recent incidents
- Uptime percentages
- Scheduled maintenance

🏁 Definition of Done
- All alerts configured and tested
- Grafana dashboards created
- PagerDuty integrated
- On-call rotation active
- Incident playbooks documented
- SLO tracking live
- Status page public

>>>>>>

]]]]
```

---

## E28-T4: Feedback Loop & Hotfix Process

```
[[[[ #SETTINGS

    mode = agent - establish feedback processes
    expertize = 'you are world class product operations specialist'
    target = rapid iteration based on beta feedback
    test = false

    code style = [agile, customer-centric]
    write docs = true
    deep thinking = true
    performance = <24h hotfix deployment
    tech stack = ['GitHub Issues', 'Slack', 'Linear', 'Mixpanel']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Establish feedback loop and hotfix process for beta iteration.

{{{{ #CUSTOMER PROMT

Beta users будут находить bugs и давать feedback.
Нужна система для:
1. Collect feedback (in-app, Slack, email)
2. Triage (critical vs nice-to-have)
3. Fix fast (hotfix process <24h)
4. Communicate changes (changelog)

}}}}

<<<<<<#RECOMMENDED TASKS

FEEDBACK-1. In-App Feedback Widget
```vue
<!-- apps/web/src/components/FeedbackWidget.vue -->
<template>
  <button @click="showModal = true" class="feedback-btn">
    📝 Feedback
  </button>
  
  <Modal v-if="showModal">
    <h3>Send Feedback</h3>
    <textarea v-model="message" placeholder="What's on your mind?"></textarea>
    <button @click="submit">Send</button>
  </Modal>
</template>

<script setup>
const submit = async () => {
  await $fetch('/api/v1/feedback', {
    method: 'POST',
    body: {
      message: message.value,
      page: window.location.pathname,
      userId: user.id
    }
  })
  
  toast.success('Thanks for your feedback!')
  showModal.value = false
}
</script>
```

FEEDBACK-2. Triage Process
Daily (10 AM):
- Review all feedback from last 24h
- Categorize:
  - 🔴 Critical bug (blocks core flow)
  - 🟠 High priority (major annoyance)
  - 🟡 Medium priority (nice-to-have)
  - 🟢 Low priority (future enhancement)
- Assign owner
- Set deadline

FEEDBACK-3. Hotfix Process
For critical bugs:
1. **Reproduce** (10 min)
2. **Fix** (2 hours)
3. **Test** (30 min)
4. **Deploy to staging** (5 min)
5. **Verify fix** (10 min)
6. **Deploy to production** (5 min)
7. **Notify users** (5 min)

Total: <3 hours for critical

FEEDBACK-4. Changelog
Publish weekly: https://daww3.app/changelog

```markdown
# Changelog

## Week of Jan 28, 2026

### 🐛 Bug Fixes
- Fixed: Audio upload timeout on slow connections
- Fixed: P2P connection fails on Firefox
- Fixed: Royalty calculation rounding error

### ✨ Improvements
- Added: Track preview before publish
- Improved: DAW loading time (-30%)

### 📣 Announcements
- Beta expanded to 100 users!
- Smart contract audit completed
```

FEEDBACK-5. User Communication
Channels:
- **Email:** Weekly update to all beta users
- **Slack/Discord:** Daily updates in #beta-updates
- **In-app:** Banner for major changes

Template:
```
🎉 We just deployed a fix!

Issue: Audio upload was timing out
Fix: Increased timeout + better error messages
Status: Live now, please refresh

Thanks @username for reporting!
```

FEEDBACK-6. Feedback Analytics
Track in Mixpanel:
- Feedback submissions (by category)
- Time to resolution
- User satisfaction after fix
- NPS change over time

🏁 Definition of Done
- Feedback widget live
- Triage process established
- Hotfix process <24h proven
- Changelog published weekly
- Users feel heard and responded to

>>>>>>

]]]]
```

---

## E28-T5: 100-User Closed Beta

```
[[[[ #SETTINGS

    mode = agent - scale beta to 100 users
    expertize = 'you are world class growth product manager'
    target = successful 100-user beta
    test = false

    code style = [scalable processes, data-driven]
    write docs = true
    deep thinking = true
    performance = handle 10x growth
    tech stack = ['Mixpanel', 'Amplitude', 'Segment']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Scale beta from 10 to 100 users after initial success.

{{{{ #CUSTOMER PROMT

After 10-user beta success, expand to 100 users.
Goals:
1. Stress test infrastructure
2. Validate product-market fit
3. Generate word-of-mouth
4. Collect testimonials

Selection: 50 artists, 50 listeners

}}}}

<<<<<<#RECOMMENDED TASKS

BETA100-1. User Recruitment
Sources:
- Personal network (20)
- Twitter/X call for beta testers (30)
- Music producer forums (20)
- Reddit r/WeAreTheMusicMakers (20)
- Existing waitlist (10)

Screening:
- Must have wallet or willing to create
- Active music creators or fans
- Can commit to 2-week test

BETA100-2. Onboarding Automation
Self-serve onboarding:
- Sign-up page: beta.daww3.app/signup
- Email verification
- Wallet setup guide (video)
- First task: "Create your profile"
- Tutorial: 5-minute interactive walkthrough

BETA100-3. Cohort Analysis
Track by signup date:
- Week 1: 30 users
- Week 2: 30 users
- Week 3: 40 users

Compare:
- Activation rate (created track)
- Retention (D1, D3, D7)
- Engagement (minutes in DAW)

BETA100-4. Community Building
Create:
- Discord server (channels: #general, #bugs, #feedback, #showcase)
- Weekly showcase: "Share your track"
- Leaderboard: Top creators, top listeners
- Beta tester badge (NFT airdrop)

BETA100-5. Success Metrics
Targets:
- Activation: >70% create track
- Retention D7: >40%
- NPS: >50 (Excellent)
- Daily active: >30% of cohort
- Tracks published: >200
- NFTs minted: >100

BETA100-6. Exit Survey
After 2 weeks:
```
1. Would you pay for DAWW3? (Y/N, if Y how much?)
2. What's the #1 feature we should add?
3. Would you recommend to a friend? (NPS)
4. Can we use your feedback as testimonial? (Y/N)
5. Join us for launch? (Get notified)
```

BETA100-7. Testimonials
Collect from happy users:
"DAWW3 paid me more in 1 week than Spotify in 6 months." - @ArtistName

Use on:
- Landing page
- Product Hunt launch
- Social media

🏁 Definition of Done
- 100 users onboarded
- Activation >70%
- NPS >50
- 5+ testimonials collected
- Infrastructure handles load
- Zero critical bugs
- Decision: Ready for public launch

>>>>>>

]]]]
```

---

## E28-T6: Beta Metrics Dashboard

```
[[[[ #SETTINGS

    mode = agent - build analytics dashboard
    expertize = 'you are world class data analyst'
    target = comprehensive beta metrics dashboard
    test = false

    code style = [data visualization, actionable insights]
    write docs = false
    deep thinking = false
    performance = real-time updates
    tech stack = ['Mixpanel', 'Grafana', 'SQL', 'Metabase']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Build dashboard to track all beta metrics in real-time.

{{{{ #CUSTOMER PROMT

Dashboard для tracking beta success.
Metrics:
- User growth
- Engagement (DAU, sessions, time)
- Feature adoption (DAW, publish, P2P)
- Business (tracks, NFTs, earnings)
- Technical (errors, latency, uptime)

}}}}

<<<<<<#RECOMMENDED TASKS

DASHBOARD-1. User Metrics
- Total signups
- Daily active users (DAU)
- Weekly active users (WAU)
- Retention cohorts (D1, D3, D7, D14)
- Churn rate

DASHBOARD-2. Engagement Metrics
- Sessions per user
- Average session duration
- Tracks created per user
- Tracks published per user
- Time in DAW (total)

DASHBOARD-3. Business Metrics
- Tracks published (total)
- NFTs minted (total)
- Plays (total)
- Royalties earned (total)
- Average payout per artist

DASHBOARD-4. Feature Adoption
- % users who created track
- % users who published track
- % users who listened to track
- % users who earned royalties
- % users with wallet connected

DASHBOARD-5. Technical Health
- API uptime %
- p95 latency
- Error rate
- Database query time
- P2P connection success rate

DASHBOARD-6. SQL Queries (Examples)
```sql
-- Daily active users
SELECT DATE(created_at) as date, COUNT(DISTINCT user_id) as dau
FROM events
WHERE event_type = 'session_start'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY date
ORDER BY date;

-- Retention cohort
SELECT 
  DATE(u.created_at) as cohort,
  COUNT(DISTINCT u.id) as cohort_size,
  COUNT(DISTINCT CASE WHEN e.created_at > u.created_at + INTERVAL '1 day' THEN u.id END) as d1,
  COUNT(DISTINCT CASE WHEN e.created_at > u.created_at + INTERVAL '7 days' THEN u.id END) as d7
FROM users u
LEFT JOIN events e ON u.id = e.user_id
WHERE u.created_at > NOW() - INTERVAL '30 days'
GROUP BY cohort;
```

🏁 Definition of Done
- Dashboard live and updating real-time
- All metrics tracked
- Accessible to team
- Weekly snapshot emailed to stakeholders

>>>>>>

]]]]
```

---

*E28 Beta Launch & Monitoring — DAWW3 Sprint 4*
