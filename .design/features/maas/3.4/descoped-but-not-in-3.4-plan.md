# MaaS Features Descoped from 3.2 but NOT in 3.4 Plan

**Generated:** January 22, 2026  
**Purpose:** Identify gaps between what was descoped from 3.2/3.3 and what the 3.4 Jira creation plan addresses.

This document lists features that were removed/descoped from the MaaS prototype during 3.2/3.3 development (per `descoped-from-3.2.md`) but are **not** currently planned to be restored in the 3.4 Jira creation plan (per `3.4-jira-creation-plan.md`).

---

## Summary

| Category | Descoped Item | In 3.4 Plan? | Notes |
|----------|---------------|--------------|-------|
| API Keys | API Key Assets Tab (Agents/Vector DBs) | ❌ No | Not mentioned |
| Tiers | Model Selection in Tiers | ⚠️ Partial | Model selection moved to Subscriptions (Story 2.2) |
| Tiers | YAML Tab & GitOps Support | ❌ No | Not mentioned |
| Tiers | Tier Badges/Labels | ❌ No | Not mentioned |
| Tiers | Default Expiration Configuration | ❌ No | Not mentioned |
| AI Assets | External Model Providers | ❌ No | Not mentioned |
| AI Assets | Model ID Column | ❌ No | Not mentioned |
| Policies | MCP Servers in Policies | ❌ No | Not mentioned |
| Create Key | Limits & Policies Expansion | ❌ No | Not mentioned |
| Model Serving | VLM Support | ❌ No | Not mentioned |
| Visibility | Per-Group/User Asset Visibility | ❌ No | Not mentioned |
| External | BYOK for External Providers | ❌ No | Not mentioned |

---

## Detailed Gap Analysis

### 1. API Key Assets Tab - Agents and Vector DBs

**What was descoped:** The API Key Details page originally had an Assets tab showing Agents and Vector DBs that could be accessed via the key.

**3.4 Coverage:** Not addressed. The 3.4 plan (Epic 3) focuses on API key CRUD, observability, and admin revocation, but does not mention restoring the Assets tab or associating keys with Agents/Vector DBs.

**Relevant commits from 3.2:** `88d7693`, `eb2159a`, `cc859ca`

---

### 2. Model Selection in Tiers

**What was descoped:** The ability to select which specific models are available within a Tier via a multi-select dropdown in Create/Edit Tier forms.

**3.4 Coverage:** Partially addressed via a different approach. The 3.4 plan introduces Subscriptions with per-model quota configuration (Story 2.2), but Tiers themselves are not being enhanced with model selection. The relationship has shifted from Tier → Models to Subscription → Models.

**Decision point:** Confirm whether Tier-level model selection is still needed given the new Subscription model, or if this is intentionally superseded.

**Relevant commits from 3.2:** `4f27a9f`

---

### 3. Tier YAML Tab and GitOps Support

**What was descoped:** A YAML tab in the Tier Details page and GitOps detection functionality.

**3.4 Coverage:** Not addressed. While Story 2.3 adds a link to RHCL Policies UI with potential YAML samples, there is no mention of restoring the Tier YAML tab or GitOps detection within the MaaS UI itself.

**Relevant commits from 3.2:** `80090a2`, `a0854b8`, `e8e4216`

---

### 4. Tier Badges/Labels

**What was descoped:** Visual badges or labels on Tiers in the list view.

**3.4 Coverage:** Not addressed. Neither Epic 2 (Subscription & Tier Admin UX) nor any other epic mentions visual indicators for Tiers.

**Relevant commits from 3.2:** `fe7ce9a`

---

### 5. Default Expiration Configuration in Tiers

**What was descoped:** The ability to configure default expiration dates for API keys within a Tier. Keys currently default to 4 hours.

**3.4 Coverage:** Not addressed. Story 3.6 addresses expiration date validation against cluster config, but Tier-level default expiration is not mentioned. Subscription-level budget limits are covered (Story 2.2), but not key expiration defaults.

---

### 6. External Model Providers (Add Asset Modal)

**What was descoped:** The ability to add external AI inference providers (e.g., OpenAI, Anthropic) as AI Assets from within the platform.

**3.4 Coverage:** Not addressed. Epic 5 (AI Asset Endpoints) focuses on the deploy-to-MaaS workflow and combined models view, but does not mention external providers.

**Design history note:** Per 2025-11-26 notes, this was "descoped from 3.2/3.3 but likely to arrive in 3.4" — this expectation is not reflected in the current plan.

---

### 7. Model ID Column

**What was descoped:** A Model ID column in the AI Assets table.

**3.4 Coverage:** Not addressed. Story 5.1 explores a combined Models view with columns for differentiation, but Model ID is not mentioned.

**Relevant commits from 3.2:** `4a0aac5`

---

### 8. MCP Servers in Policies

**What was descoped:** MCP (Model Context Protocol) servers were originally associated with policies.

**3.4 Coverage:** Not addressed. Story 2.3 links to RHCL Policies, but MCP server integration is not mentioned anywhere in the plan.

**Relevant commits from 3.2:** `eb2159a`

---

### 9. Limits and Policies Expansion in Create API Key

**What was descoped:** An expandable section in the Create API Key modal that allowed users to self-impose restrictions beyond the default policy.

**3.4 Coverage:** Not addressed. Story 3.2 (Create API Key Flow) focuses on Subscription selection, key types, and expiration but does not mention user-imposed limit overrides.

**Design history note:** Per 2025-10-30 notes, "We'll revisit this in the future once we get budget controls available." Budget controls are now in scope (Epic 4), so this may warrant reconsideration.

---

### 10. VLM Support in Model Serving

**What was descoped:** VLM (Vision Language Model) backed LLM inference services.

**3.4 Coverage:** Not addressed. Epic 5 covers model serving integration but focuses on the MaaS flag workflow, not VLM-specific support.

---

### 11. Per-Group/User Asset Visibility

**What was descoped:** The ability to share AI Assets only with certain groups or users rather than making them wide open.

**3.4 Coverage:** Not addressed. The Subscription model (Epic 2) assigns groups to Subscriptions for quota/access, but the original concept of per-asset visibility (limiting who can see specific assets) is not covered.

---

### 12. BYOK (Bring Your Own Key) for External Providers

**What was descoped:** The ability for AI Engineers to bring their own API keys from external model providers to the AI Playground.

**3.4 Coverage:** Not addressed. No mention of BYOK functionality in any epic.

---

## Items Addressed in 3.4 (For Reference)

The following descoped items **are** being addressed in the 3.4 plan:

| Descoped Item | Covered By |
|---------------|------------|
| Individual API Key Management (CRUD) | Epic 3: Stories 3.1, 3.2, 3.3, 3.4, 3.5 |
| API Key Status, Last Used, Expiration | Story 3.1 (enhanced columns) |
| API Key Copy Action | Story 3.2 (token reveal pattern) |
| MaaS Tab (separate list) | Story 5.1 (combined view exploration) |
| Quota Data and Usage Reporting | Epic 4: Stories 4.1, 4.2, 4.5 |
| Cost Management / Chargeback (showback) | Story 4.2 (showback), Story 4.3 (CSV export) |
| Policies Navigation | Story 2.3 (link to RHCL Policies) |

---

## Recommendations

1. **External Model Providers**: Given design history explicitly noted this for 3.4, confirm with PM whether this should be added to the plan.

2. **Limits & Policies Expansion**: With budget controls now in scope, revisit whether self-imposed key restrictions should be included.

3. **Tier-level features**: Several Tier features (YAML tab, badges, default expiration) remain unaddressed. Clarify whether these are superseded by the Subscription model or still needed.

4. **MCP Servers**: Confirm whether MCP integration is out of scope for 3.4 or should be considered.

5. **VLM Support**: Confirm engineering readiness and whether this needs UX work in 3.4.
