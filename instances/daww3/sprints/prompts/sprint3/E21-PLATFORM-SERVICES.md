# E21: Platform Services — Agent Prompts

> **Goal:** Email, push notifications, OAuth, payments, search
> **Sprint:** 3
> **Owner:** Backend
> **Source:** E5, E13 "Problems/Not Implemented"

---

## E21-T1: Email Notifications

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class email systems engineer'
    target = implement transactional email notifications
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = reliable delivery, low latency
    tech stack = ['NestJS', 'SendGrid/Resend', 'BullMQ', 'MJML']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement email notification system for DAWW3.
Transactional emails for user events.

{{{{ #CUSTOMER PROMT

Email notifications require SMTP/SendGrid integration. Нужно:
- Email provider integration (SendGrid/Resend)
- Email templates (MJML)
- Queue-based sending
- Unsubscribe handling
- Delivery tracking

}}}}

<<<<<<#RECOMMENDED TASKS

EMAIL-1. Provider Integration
- SendGrid or Resend SDK
- API key configuration
- Sender domain verification
- DKIM/SPF setup
- Environment separation

EMAIL-2. Email Templates
- MJML template system
- Welcome email
- Password reset
- Collaboration invite
- Royalty notification
- Track published

EMAIL-3. Queue-based Sending
- BullMQ email job
- Retry on failure
- Rate limiting
- Batch sending
- Priority levels

EMAIL-4. Template Rendering
- Variable injection
- Localization support
- Preview mode
- Template caching
- Version management

EMAIL-5. Unsubscribe Handling
- One-click unsubscribe
- Preference center
- Category opt-out
- Legal compliance
- Sync with user prefs

EMAIL-6. Delivery Tracking
- Webhook for events
- Bounce handling
- Complaint handling
- Open/click tracking (optional)
- Delivery dashboard

🏁 Definition of Done
- Emails send reliably
- Templates look professional
- Unsubscribe works
- Delivery tracked
- No spam folder issues

>>>>>>

]]]]
```

---

## E21-T2: Push Notifications

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class push notification engineer'
    target = implement web and mobile push notifications
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = real-time delivery
    tech stack = ['FCM', 'Web Push API', 'NestJS', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement push notifications for DAWW3.
Web push and mobile notifications.

{{{{ #CUSTOMER PROMT

Push notifications require FCM/APNs credentials. Нужно:
- Web push (FCM/VAPID)
- Mobile push (FCM for Android, APNs for iOS)
- Notification preferences
- Topic subscriptions
- Rich notifications

}}}}

<<<<<<#RECOMMENDED TASKS

PUSH-1. Web Push Setup
- VAPID key generation
- Service Worker registration
- Push subscription management
- Permission request UX
- Subscription storage

PUSH-2. FCM Integration
- Firebase project setup
- Server-side SDK
- Token management
- Topic subscriptions
- Multicast sending

PUSH-3. Notification Types
- New collaborator joined
- Track comment
- Royalty earned
- Badge unlocked
- System announcements

PUSH-4. Preference Management
- Per-category preferences
- Quiet hours
- Device management
- Frequency limits
- Test notification

PUSH-5. Rich Notifications
- Images in notifications
- Action buttons
- Deep links
- Sound customization
- Badges/counters

PUSH-6. Analytics
- Delivery tracking
- Open rate
- Click-through rate
- Opt-out tracking
- A/B testing support

🏁 Definition of Done
- Web push works in browsers
- Mobile push configured
- Preferences respected
- Rich content displays
- Analytics available

>>>>>>

]]]]
```

---

## E21-T3: OAuth Providers

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class OAuth integration engineer'
    target = implement social login with Google and GitHub
    test = true

    code style = [DRY, Best practice, secure]
    write docs = true
    deep thinking = true
    performance = fast login flow
    tech stack = ['NestJS', 'Passport', 'OAuth2', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement OAuth social login for DAWW3.
Support Google and GitHub authentication.

{{{{ #CUSTOMER PROMT

OAuth providers (Google, GitHub) отсутствуют. Нужно:
- Google OAuth login
- GitHub OAuth login
- Account linking
- Profile sync
- Secure token handling

}}}}

<<<<<<#RECOMMENDED TASKS

OAUTH-1. OAuth Infrastructure
- Passport strategies
- Callback handling
- State parameter security
- PKCE support
- Session management

OAUTH-2. Google OAuth
- Google Cloud Console setup
- passport-google-oauth20
- Scope configuration
- Profile extraction
- Refresh token handling

OAUTH-3. GitHub OAuth
- GitHub OAuth App setup
- passport-github2
- Scope configuration
- Profile/email extraction
- Organization membership (optional)

OAUTH-4. Account Linking
- Link social to existing account
- Unlink social account
- Multiple providers per user
- Primary provider setting
- Migration from email

OAUTH-5. Profile Sync
- Import avatar
- Import username/name
- Handle conflicts
- Update on login
- Privacy controls

OAUTH-6. Security Measures
- CSRF protection
- Token encryption
- Secure cookie settings
- Rate limiting
- Audit logging

🏁 Definition of Done
- Google login works
- GitHub login works
- Can link accounts
- Tokens stored securely
- UX is smooth

>>>>>>

]]]]
```

---

## E21-T4: Subscription/Payments

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class payment systems architect'
    target = implement subscription and payment processing
    test = true

    code style = [DRY, Best practice, PCI compliant]
    write docs = true
    deep thinking = true
    performance = reliable payment processing
    tech stack = ['Stripe', 'NestJS', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement subscription and payment processing for DAWW3.
Support premium features and fiat payments.

{{{{ #CUSTOMER PROMT

Subscription/payment processing отсутствует. Нужно:
- Stripe integration
- Subscription plans (free/premium/pro)
- Payment checkout
- Invoice management
- Webhook handling

}}}}

<<<<<<#RECOMMENDED TASKS

PAY-1. Stripe Integration
- Stripe SDK setup
- API key configuration
- Test/live mode handling
- Webhook endpoint
- Idempotency handling

PAY-2. Subscription Plans
- Define plan tiers
- Price configuration
- Feature flags per plan
- Trial periods
- Upgrade/downgrade paths

PAY-3. Checkout Flow
- Stripe Checkout or Elements
- Plan selection
- Payment method collection
- Success/cancel handling
- Receipt generation

PAY-4. Subscription Management
- View current subscription
- Change plan
- Cancel subscription
- Pause subscription
- Reactivation

PAY-5. Webhook Processing
- payment_intent.succeeded
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed
- Retry logic

PAY-6. Billing Dashboard
- Current plan display
- Billing history
- Payment methods
- Invoice downloads
- Usage display

🏁 Definition of Done
- Users can subscribe
- Payments process successfully
- Plan changes work
- Webhooks handled reliably
- Billing history accurate

>>>>>>

]]]]
```

---

## E21-T5: Advanced Search & Filtering

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class search systems engineer'
    target = implement advanced search and filtering for tracks
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = < 100ms search latency
    tech stack = ['Elasticsearch/Meilisearch', 'NestJS', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement advanced search and filtering for DAWW3.
Full-text search with faceted filters.

{{{{ #CUSTOMER PROMT

Advanced search and filtering отсутствует. Нужно:
- Full-text search
- Filter by genre, BPM, key, duration
- Sort options
- Faceted results
- Search suggestions

}}}}

<<<<<<#RECOMMENDED TASKS

SEARCH-1. Search Engine Setup
- Meilisearch or Elasticsearch
- Index configuration
- Mapping/schema
- Analyzers for text
- Synonyms

SEARCH-2. Index Sync
- Sync tracks to search index
- Real-time updates
- Batch reindex
- Delta sync
- Error handling

SEARCH-3. Search API
- Full-text query
- Filter parameters
- Sort options
- Pagination
- Highlighting

SEARCH-4. Faceted Search
- Genre facets
- BPM ranges
- Duration ranges
- License type
- Artist facets

SEARCH-5. Search Suggestions
- Autocomplete
- Typo tolerance
- Popular searches
- Recent searches
- Did you mean

SEARCH-6. Search UI
- Search bar component
- Filter sidebar
- Active filters display
- Results grid
- Empty state

🏁 Definition of Done
- Search returns relevant results
- Filters work correctly
- < 100ms latency
- Autocomplete helps discovery
- UI is intuitive

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E13 (Backend Scale) ✅
    │
    ├─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼
E21-T1 (Email)       E21-T3 (OAuth)       E21-T5 (Search)
    │                     │
    ▼                     │
E21-T2 (Push)             │
    │                     │
    └─────────┬───────────┘
              ▼
        E21-T4 (Payments)
              │
              ▼
        [Platform Services Complete]
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Email deliverability | Medium | Proper DNS, warm-up |
| OAuth security | High | Proper token handling, audit |
| Payment failures | High | Retry logic, alerts |
| Search relevance | Medium | Tuning, user feedback |
