# MaaS Features Descoped from 3.2 and Addressed in 3.4 Plan

**Generated:** January 22, 2026  
**Purpose:** Track which features descoped from 3.2/3.3 are being brought back in the 3.4 Jira plan.

---

## Summary

| Descoped Feature | 3.4 Coverage | Epic/Story |
|------------------|--------------|------------|
| Individual API Key Management (CRUD) | ✅ Full | Epic 3: Stories 3.1–3.5 |
| API Key Status, Last Used, Expiration columns | ✅ Full | Story 3.1 |
| API Key Copy Action | ✅ Full | Story 3.2 |
| MaaS Tab (separate models list) | ✅ Redesigned | Story 5.1 |
| Quota Data and Usage Reporting | ✅ Full | Epic 4: Stories 4.1, 4.2, 4.5 |
| Cost Management / Chargeback | ✅ Showback focus | Stories 4.2, 4.3 |
| Policies Navigation | ✅ Link approach | Story 2.3 |

---

## Detailed Coverage

### 1. Individual API Key Management (CRUD)

**What was descoped:** Full individual API key management including listing, viewing details, copying keys, and actions per key. In 3.2, only "delete all keys" was supported.

**How 3.4 addresses it:**
- **Story 3.1** - API Key list view with all required columns and actions
- **Story 3.2** - Create API Key flow with token reveal pattern
- **Story 3.3** - API Key detail view with per-key observability
- **Story 3.4** - Admin key revocation flow
- **Story 3.5** - Disable/enable toggle for API keys

**Original commits:** `ef16f37`, `f617227`, `ae0eca2`, `df37610`, `9380187`

---

### 2. API Key Status, Last Used, and Expiration Management

**What was descoped:** Columns for status (Active/Expired/Disabled), last used timestamps, and detailed expiration management.

**How 3.4 addresses it:**
- **Story 3.1** explicitly includes these columns:
  - Status (Active/Disabled/Expired)
  - Created date
  - Expiration date
  - Date last invoked
- **Story 3.5** covers disable/enable toggle
- **Story 3.6** addresses expiration date validation

---

### 3. API Key Copy Action

**What was descoped:** Copy button for API keys was removed because keys were ephemeral.

**How 3.4 addresses it:**
- **Story 3.2** includes "token reveal pattern (one-time display, copy button)" as a core design element

---

### 4. Models as a Service (MaaS) Tab

**What was descoped:** A separate tab on the AI Asset Endpoints page dedicated to showing "Models as a Service" separately from regular models.

**How 3.4 addresses it:**
- **Story 5.1** explores a combined Models view that "clearly differentiates project-scoped non-MaaS models from MaaS-available models" with:
  - Clear visual differentiation (badges, icons)
  - Dedicated column to differentiate MaaS vs. non-MaaS
  - Filtering by type (Project / MaaS / All)

This is a redesigned approach rather than restoring the separate tab.

---

### 5. Quota Data and Usage Reporting

**What was descoped:** Per-endpoint quota data and detailed usage reporting in the dashboard.

**How 3.4 addresses it:**
- **Story 4.1** - Review Perses dashboard implementation for MaaS metrics
- **Story 4.2** - Usage metrics dashboard with:
  - Token consumption over time
  - Per-model usage breakdown
  - Per-subscription/user breakdown
  - Credit burn rate
  - Top consuming users/keys
- **Story 4.5** - Per-key usage metrics display

---

### 6. Cost Management / Chargeback

**What was descoped:** User management and cost-related functionality was out of scope for 3.2/3.3.

**How 3.4 addresses it:**
- **Epic 4** is titled "MaaS Observability & Showback UX" with showback prioritized over automated chargeback
- **Story 4.2** - Showback visibility embedded in Subscription detail view
- **Story 4.3** - CSV/API export for chargeback calculations with fields including subscription, user, model, tokens, credits, time range

Note: Full automated chargeback remains out of scope, but showback (visibility) is fully addressed.

---

### 7. Policies Navigation

**What was descoped:** The Policies navigation item was marked "at risk" during 3.2/3.3.

**How 3.4 addresses it:**
- **Story 2.3** - "Add navigation to OpenShift RHCL Policies for advanced management" with:
  - Link/button placement with appropriate help text
  - Potential YAML samples/snippets following OpenShift patterns

This takes a different approach (linking to RHCL Policies) rather than a full in-product Policies UI.

---

## Cross-Reference

For features descoped from 3.2 that are **NOT** addressed in the 3.4 plan, see:
- [descoped-but-not-in-3.4-plan.md](./descoped-but-not-in-3.4-plan.md)
