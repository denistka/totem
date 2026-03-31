# 📧 E21: Platform Services — QA Test Specifications

> **Epic:** E21 - Platform Services
> **Priority:** 🟡 MEDIUM
> **Focus:** Notifications, OAuth, Payments, Search

---

## QA Agent Prompt

```
[[[[ #SETTINGS

    mode = agent - implement platform services tests
    expertize = 'you are world class platform engineering QA specialist'
    target = validate notifications, auth, payments, search
    test = true

    code style = [Integration testing, Mock services]
    write docs = true
    deep thinking = true
    performance = reliable delivery
    tech stack = ['Vitest', 'Supertest', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for E21 Platform Services.
Validate email, push notifications, OAuth, payments, search.

{{{{ #CUSTOMER PROMT

Нужны QA тесты для platform services:
- E21-T1: Email notifications
- E21-T2: Push notifications
- E21-T3: OAuth providers
- E21-T4: Subscription/payments
- E21-T5: Advanced search & filtering

}}}}

<<<<<<#RECOMMENDED TASKS

E21-QA-1. Email Notification Tests
E21-QA-2. Push Notification Tests
E21-QA-3. OAuth Tests
E21-QA-4. Payment Tests
E21-QA-5. Search Tests

>>>>>>

]]]]
```

---

## E21-QA-1: Email Notification Tests

```typescript
describe('Email Notifications', () => {
  describe('Email Sending', () => {
    it('sends welcome email on signup', async () => {
      const mailSpy = vi.spyOn(mailService, 'send')
      
      await authService.register({
        email: 'new@user.com',
        password: 'password123'
      })
      
      expect(mailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'new@user.com',
          template: 'welcome'
        })
      )
    })

    it('sends track published notification', async () => {
      const mailSpy = vi.spyOn(mailService, 'send')
      
      await trackService.publish('track-1')
      
      expect(mailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          template: 'track-published'
        })
      )
    })

    it('sends royalty received notification', async () => {
      const mailSpy = vi.spyOn(mailService, 'send')
      
      await royaltyService.distribute('track-1', '0.1')
      
      expect(mailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          template: 'royalty-received',
          data: expect.objectContaining({ amount: '0.1' })
        })
      )
    })
  })

  describe('Email Templates', () => {
    it('renders welcome template', async () => {
      const html = await mailService.renderTemplate('welcome', {
        userName: 'Test User',
        verifyUrl: 'https://daww3.io/verify/123'
      })
      
      expect(html).toContain('Test User')
      expect(html).toContain('verify/123')
    })

    it('templates are responsive', async () => {
      const html = await mailService.renderTemplate('welcome', {})
      
      // Check for responsive meta/styles
      expect(html).toContain('viewport')
      expect(html).toContain('max-width')
    })
  })

  describe('Email Preferences', () => {
    it('respects unsubscribe preference', async () => {
      await userService.updatePreferences('user-1', {
        emailNotifications: { marketing: false }
      })
      
      const mailSpy = vi.spyOn(mailService, 'send')
      
      await notificationService.sendMarketing('user-1', 'New feature!')
      
      expect(mailSpy).not.toHaveBeenCalled()
    })

    it('unsubscribe link works', async () => {
      const token = await mailService.generateUnsubscribeToken('user-1')
      
      const res = await request(app)
        .get(`/api/v1/email/unsubscribe?token=${token}`)
      
      expect(res.status).toBe(200)
      
      const user = await userService.findById('user-1')
      expect(user.preferences.emailNotifications.all).toBe(false)
    })
  })
})
```

---

## E21-QA-2: Push Notification Tests

```typescript
describe('Push Notifications', () => {
  describe('Subscription', () => {
    it('registers push subscription', async () => {
      const subscription = {
        endpoint: 'https://fcm.googleapis.com/...',
        keys: {
          p256dh: 'key...',
          auth: 'auth...'
        }
      }
      
      const res = await request(app)
        .post('/api/v1/push/subscribe')
        .set('Authorization', `Bearer ${token}`)
        .send(subscription)
      
      expect(res.status).toBe(201)
    })

    it('removes subscription on unsubscribe', async () => {
      await request(app)
        .delete('/api/v1/push/unsubscribe')
        .set('Authorization', `Bearer ${token}`)
      
      const subs = await pushService.getSubscriptions('user-1')
      expect(subs.length).toBe(0)
    })
  })

  describe('Notification Delivery', () => {
    it('sends push notification', async () => {
      const pushSpy = vi.spyOn(pushService, 'send')
      
      await notificationService.sendPush('user-1', {
        title: 'New like!',
        body: 'Someone liked your track'
      })
      
      expect(pushSpy).toHaveBeenCalled()
    })

    it('handles expired subscriptions', async () => {
      vi.spyOn(webPush, 'sendNotification').mockRejectedValue({
        statusCode: 410 // Gone
      })
      
      await notificationService.sendPush('user-1', {
        title: 'Test',
        body: 'Test'
      })
      
      // Subscription should be removed
      const subs = await pushService.getSubscriptions('user-1')
      expect(subs.length).toBe(0)
    })
  })
})
```

---

## E21-QA-3: OAuth Tests

```typescript
describe('OAuth Providers', () => {
  describe('Google OAuth', () => {
    it('redirects to Google auth', async () => {
      const res = await request(app)
        .get('/api/v1/auth/google')
      
      expect(res.status).toBe(302)
      expect(res.headers.location).toContain('accounts.google.com')
    })

    it('handles Google callback', async () => {
      const mockGoogleUser = {
        sub: 'google-123',
        email: 'user@gmail.com',
        name: 'Test User'
      }
      
      vi.spyOn(googleOAuth, 'getUser').mockResolvedValue(mockGoogleUser)
      
      const res = await request(app)
        .get('/api/v1/auth/google/callback?code=mock-code')
      
      expect(res.status).toBe(302)
      expect(res.headers['set-cookie']).toBeDefined()
    })

    it('creates user on first Google login', async () => {
      const mockGoogleUser = {
        sub: 'google-new-user',
        email: 'newuser@gmail.com',
        name: 'New User'
      }
      
      vi.spyOn(googleOAuth, 'getUser').mockResolvedValue(mockGoogleUser)
      
      await request(app)
        .get('/api/v1/auth/google/callback?code=mock-code')
      
      const user = await userService.findByEmail('newuser@gmail.com')
      expect(user).toBeDefined()
      expect(user.oauthProvider).toBe('google')
    })
  })

  describe('Discord OAuth', () => {
    it('redirects to Discord auth', async () => {
      const res = await request(app)
        .get('/api/v1/auth/discord')
      
      expect(res.status).toBe(302)
      expect(res.headers.location).toContain('discord.com')
    })
  })

  describe('Account Linking', () => {
    it('links OAuth to existing account', async () => {
      // Create email user
      const user = await authService.register({
        email: 'existing@user.com',
        password: 'password'
      })
      
      // Link Google
      await request(app)
        .post('/api/v1/auth/link/google')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ code: 'google-code' })
      
      const updated = await userService.findById(user.id)
      expect(updated.oauthProviders).toContain('google')
    })
  })
})
```

---

## E21-QA-4: Payment Tests

```typescript
describe('Subscription/Payments', () => {
  describe('Subscription Plans', () => {
    it('lists available plans', async () => {
      const res = await request(app)
        .get('/api/v1/subscriptions/plans')
      
      expect(res.status).toBe(200)
      expect(res.body).toContainEqual(
        expect.objectContaining({ name: 'Pro', price: 9.99 })
      )
    })
  })

  describe('Stripe Integration', () => {
    it('creates checkout session', async () => {
      const stripeSpy = vi.spyOn(stripe.checkout.sessions, 'create')
        .mockResolvedValue({ id: 'cs_test_123', url: 'https://checkout...' })
      
      const res = await request(app)
        .post('/api/v1/subscriptions/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({ planId: 'pro-monthly' })
      
      expect(res.status).toBe(200)
      expect(res.body.url).toContain('checkout')
    })

    it('handles webhook for successful payment', async () => {
      const webhookPayload = {
        type: 'checkout.session.completed',
        data: {
          object: {
            customer: 'cus_123',
            subscription: 'sub_123',
            metadata: { userId: 'user-1' }
          }
        }
      }
      
      const res = await request(app)
        .post('/api/v1/webhooks/stripe')
        .set('stripe-signature', generateStripeSignature(webhookPayload))
        .send(webhookPayload)
      
      expect(res.status).toBe(200)
      
      const user = await userService.findById('user-1')
      expect(user.subscription.status).toBe('active')
    })
  })

  describe('Subscription Management', () => {
    it('cancels subscription', async () => {
      vi.spyOn(stripe.subscriptions, 'update').mockResolvedValue({
        id: 'sub_123',
        cancel_at_period_end: true
      })
      
      const res = await request(app)
        .post('/api/v1/subscriptions/cancel')
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.status).toBe(200)
      
      const user = await userService.findById('user-1')
      expect(user.subscription.cancelAt).toBeDefined()
    })
  })
})
```

---

## E21-QA-5: Search Tests

```typescript
describe('Advanced Search & Filtering', () => {
  describe('Track Search', () => {
    it('searches by title', async () => {
      const res = await request(app)
        .get('/api/v1/tracks/search')
        .query({ q: 'electronic' })
      
      expect(res.status).toBe(200)
      expect(res.body.results.every(t => 
        t.title.toLowerCase().includes('electronic')
      )).toBe(true)
    })

    it('filters by genre', async () => {
      const res = await request(app)
        .get('/api/v1/tracks/search')
        .query({ genre: 'house' })
      
      expect(res.body.results.every(t => t.genre === 'house')).toBe(true)
    })

    it('filters by BPM range', async () => {
      const res = await request(app)
        .get('/api/v1/tracks/search')
        .query({ bpmMin: 120, bpmMax: 130 })
      
      expect(res.body.results.every(t => 
        t.bpm >= 120 && t.bpm <= 130
      )).toBe(true)
    })

    it('sorts by rating', async () => {
      const res = await request(app)
        .get('/api/v1/tracks/search')
        .query({ sort: 'rating', order: 'desc' })
      
      const ratings = res.body.results.map(t => t.rating)
      expect(ratings).toEqual([...ratings].sort((a, b) => b - a))
    })

    it('paginates results', async () => {
      const page1 = await request(app)
        .get('/api/v1/tracks/search')
        .query({ page: 1, limit: 10 })
      
      const page2 = await request(app)
        .get('/api/v1/tracks/search')
        .query({ page: 2, limit: 10 })
      
      expect(page1.body.results[0].id).not.toBe(page2.body.results[0].id)
    })
  })

  describe('Full-text Search', () => {
    it('searches in description', async () => {
      const res = await request(app)
        .get('/api/v1/tracks/search')
        .query({ q: 'deep bass groove' })
      
      expect(res.body.results.some(t => 
        t.description?.toLowerCase().includes('bass')
      )).toBe(true)
    })

    it('handles typos with fuzzy search', async () => {
      const res = await request(app)
        .get('/api/v1/tracks/search')
        .query({ q: 'electonic' }) // Typo
      
      // Should still find "electronic"
      expect(res.body.results.length).toBeGreaterThan(0)
    })
  })

  describe('Artist Search', () => {
    it('searches artists by name', async () => {
      const res = await request(app)
        .get('/api/v1/artists/search')
        .query({ q: 'DJ' })
      
      expect(res.body.results.some(a => 
        a.name.includes('DJ')
      )).toBe(true)
    })
  })
})
```

---

## Manual Test Checklist

### E21-T1: Email
- [ ] Welcome email received on signup
- [ ] Track published email works
- [ ] Unsubscribe link works

### E21-T2: Push Notifications
- [ ] Browser permission prompt
- [ ] Notification appears
- [ ] Click opens correct page

### E21-T3: OAuth
- [ ] Sign in with Google
- [ ] Sign in with Discord
- [ ] Link accounts

### E21-T4: Payments
- [ ] View subscription plans
- [ ] Complete checkout
- [ ] Cancel subscription

### E21-T5: Search
- [ ] Search by title
- [ ] Filter by genre/BPM
- [ ] Sort results
- [ ] Pagination works

---

*E21 Platform Services QA — DAWW3 Sprint 3*
