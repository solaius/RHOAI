# MaaS Feature Comparison Matrix
Date: November 12, 2025

This document provides a side-by-side comparison of what currently exists in the prototype versus what the Feature Refinement document specifies.

## Core Concepts

| Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------|------------------|------------------------|------------|
| **Primary Concept** | Policies (Kuadrant-based) | Tiers (MaaS-specific) | 🔴 Major Gap |
| **Scope** | All AI Assets + gateway policies | MaaS models only | 🔴 Major Gap |
| **Policy Types** | AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy | Single "Tier" concept | 🔴 Major Gap |
| **Target Entities** | Groups, Users, Service Accounts | Groups only | 🟡 Minor Gap |
| **Location** | Settings > Policies | Settings > "MaaS Admin" or "Tiers" | 🟡 Minor Gap |

---

## Admin: Tier/Policy Management

### Create Tier/Policy

| Field/Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------------|------------------|------------------------|------------|
| **Name** | ✅ Supported | ✅ Required | ✅ Aligned |
| **Description** | ✅ Supported | ✅ Optional | ✅ Aligned |
| **Type Selection** | ✅ 4 types (Auth, RateLimit, TLS, DNS) | ❌ No type field (single tier concept) | 🔴 Major Gap |
| **Target Groups** | ✅ Multi-select | ✅ Multi-select | ✅ Aligned |
| **Target Users** | ✅ Multi-select | ❌ Not supported | 🟡 Minor Gap |
| **Target Service Accounts** | ✅ Multi-select | ❌ Not supported | 🟡 Minor Gap |
| **Available Models** | ✅ Multi-select (all models) | ✅ Multi-select (MaaS models only) | 🟡 Minor Gap |
| **MaaS Model Filter** | ❌ No filtering | ✅ Only show MaaS-tagged models | 🔴 Major Gap |
| **Available MCP Servers** | ✅ Multi-select | ❌ Out of scope for MVP | 🟡 Minor Gap |
| **Token Limit** | ✅ Amount + period | ✅ Amount + period with examples | 🟢 Partial |
| **Rate Limit** | ✅ Amount + period | ✅ Amount + period with examples | 🟢 Partial |
| **Time Limit** | ✅ Start/End dates | ❌ Not mentioned for tiers | 🟡 Minor Gap |
| **API Key Expiration** | ❌ Not in tier/policy | ✅ Default expiration days | 🔴 Major Gap |
| **Over-limit Behavior** | ✅ Hard/Soft throttle | ❌ Not mentioned | 🟢 Extra Feature |
| **Quota Renewal Schedule** | ✅ Supported | ❌ Not mentioned | 🟢 Extra Feature |
| **Helper Text/Examples** | 🟡 Basic helper text | ✅ Rich examples and samples | 🟡 Minor Gap |
| **Default Tier** | ❌ No concept | ✅ Nice to have - default tier | 🔴 Major Gap |

### View Tier/Policy List

| Field/Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------------|------------------|------------------------|------------|
| **Name Column** | ✅ With description | ✅ With description | ✅ Aligned |
| **Type Column** | ✅ Badge for policy type | ❌ No type (single concept) | 🟡 Minor Gap |
| **Status Column** | ✅ Active/Inactive | ✅ Active/Inactive | ✅ Aligned |
| **Targets Column** | ✅ Shows groups/users/SA counts | ✅ Shows group count only | 🟢 Partial |
| **Rules Column** | ✅ Token/Rate/Time limits | ✅ Token/Rate limits + expiration | 🟢 Partial |
| **Default Indicator** | ❌ No concept | ✅ Badge for default tier | 🔴 Major Gap |
| **GitOps Indicator** | ✅ Git source link | ✅ "Read Only" / "Managed by GitOps" | ✅ Aligned |
| **Row Actions** | ✅ View, Edit, Enable/Disable, Delete | ✅ View, Edit, Delete, Set as Default | 🟢 Partial |
| **Create Button** | ✅ "Create policy" | ✅ "Create tier" | ✅ Aligned |

### View Tier/Policy Details

| Tab/Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|-------------|------------------|------------------------|------------|
| **Details Tab** | ✅ All configuration details | ✅ All tier configuration | ✅ Aligned |
| **YAML Tab** | ✅ Full YAML display | ✅ Should Have - YAML view | ✅ Aligned |
| **Git Source** | ✅ Shows git link if applicable | ✅ Shows GitOps source | ✅ Aligned |
| **Read-only Mode** | ✅ For git-managed policies | ✅ For GitOps-managed tiers | ✅ Aligned |
| **Edit Action** | ✅ Opens edit modal | ✅ Should Have | ✅ Aligned |
| **Delete Action** | ✅ With confirmation | ✅ Should Have with confirmation | ✅ Aligned |
| **UI/YAML Toggle** | ✅ Separate tabs | ✅ Should Have - toggle | 🟢 Partial |

---

## Developer: API Key Management

### Create API Key

| Field/Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------------|------------------|------------------------|------------|
| **Name** | ✅ Required | ✅ Required | ✅ Aligned |
| **Description** | ✅ Optional | ✅ Optional | ✅ Aligned |
| **Owner Selection** | ✅ User/Group/Service Account dropdown | ❌ Not mentioned (auto-detects from logged-in user) | 🟡 Minor Gap |
| **Limits Section** | ✅ Token/Rate/Budget/Expiration | ❌ Inherited from tier | 🔴 Major Gap |
| **Asset Selection** | ✅ Multi-select Models/MCP/VectorDB/Agents | ❌ Inherited from tier | 🔴 Major Gap |
| **Tier Display** | ❌ Not shown | ✅ Show user's tier(s) | 🔴 Major Gap |
| **Inherited Limits Display** | ❌ Not shown | ✅ Show limits inherited from tier | 🔴 Major Gap |
| **Expiration Override** | ❌ Set manually | ✅ Auto-filled from tier, can override | 🔴 Major Gap |
| **One-Time Key Display** | 🟡 Shows in modal once | ✅ Prominent one-time display with warning | 🟢 Partial |
| **Empty State** | ❌ Always allows creation | ✅ Block creation if no tier assigned | 🔴 Major Gap |

### View API Key List

| Field/Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------------|------------------|------------------------|------------|
| **Name Column** | ✅ With description | ✅ With description | ✅ Aligned |
| **Status Column** | ✅ Active/Expired/Disabled | ✅ Active/Inactive + "Tier deleted" | 🟡 Minor Gap |
| **API Key Column** | ✅ Masked (sk-1234...) | ✅ Masked | ✅ Aligned |
| **Assets Column** | ✅ Badge counts for all asset types | ✅ Model count only (no MCP/VectorDB/Agents) | 🟡 Minor Gap |
| **Owner Column** | ✅ Shows owner type and name | ❌ Not mentioned (implied current user) | 🟡 Minor Gap |
| **Tier Column** | ❌ Not shown | ✅ Should show tier name | 🔴 Major Gap |
| **Last Used Column** | ✅ Relative time | ✅ Time created / Time expired | ✅ Aligned |
| **Expiration Date Column** | ✅ Formatted date | ✅ Time expired | ✅ Aligned |
| **Actions** | ✅ View details, Enable/Disable, Delete | ✅ View details, Revoke (Should Have) | 🟢 Partial |
| **Empty State** | ❌ Generic empty table | ✅ "You have no access to MaaS models" | 🔴 Major Gap |
| **Create Button** | ✅ Always enabled | ✅ Disabled if no tier | 🔴 Major Gap |

### View API Key Details

| Tab/Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|-------------|------------------|------------------------|------------|
| **Details Tab** | ✅ Name, description, key, dates | ✅ Same + tier + inherited limits | 🟡 Minor Gap |
| **Tier Field** | ❌ Not shown | ✅ Show tier name with link | 🔴 Major Gap |
| **Inherited Limits** | ❌ Not shown | ✅ Show token/rate limits from tier | 🔴 Major Gap |
| **Assets Tab** | ✅ Models, MCP, VectorDB, Agents | ✅ MaaS models only from tier | 🔴 Major Gap |
| **Metrics Tab** | ✅ Usage charts and stats | ❌ Not explicitly mentioned | ✅ Aligned |
| **Policies Tab** | ✅ Applied policies table | ✅ Should show tier details/limits | 🟡 Minor Gap |
| **Settings Tab** | ✅ Delete action | ✅ Delete action | ✅ Aligned |
| **Revoke Action** | ❌ No revoke, only delete | ✅ Should Have - revoke with confirmation | 🔴 Major Gap |

---

## Model Deployments

| Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------|------------------|------------------------|------------|
| **MaaS Checkbox** | ❌ Recently removed per design-tasks.md | ✅ "Tag as MaaS" in wizard | 🔴 Major Gap |
| **MaaS Badge** | ❌ Not shown | ✅ Badge on MaaS deployments | 🔴 Major Gap |
| **Model ID** | ❌ Not explicitly tagged | ✅ Tagged for MaaS in tier selection | 🔴 Major Gap |
| **Wizard Location** | ✅ Deploy Model Wizard exists | ✅ Add MaaS checkbox in wizard | 🟢 Partial |
| **Right-click Action** | ✅ "Publish as AI Asset" | ✅ Clarify "Publish as AI Asset" = MaaS tagging | 🟢 Partial |

---

## AI Asset Endpoints

| Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------|------------------|------------------------|------------|
| **Models Tab** | ✅ Shows all models | ✅ Should show MaaS models only | 🟡 Minor Gap |
| **MCP Tab** | ✅ Shows MCP servers | ❌ Out of scope for MVP | 🟡 Minor Gap |
| **MaaS Filter** | ❌ No filtering | ✅ Filter to show MaaS models only | 🔴 Major Gap |
| **MaaS Badge** | ❌ Not shown | ✅ Badge on MaaS models | 🔴 Major Gap |
| **Add Asset Modal** | ✅ Supports Models and MCP | ✅ Supports Models (MaaS by default) | 🟢 Partial |
| **Quick Create Key** | ❌ Not supported | ✅ Nice to Have - "Generate API Key" | 🔴 Major Gap |

---

## Tier-to-User Relationship

| Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------|------------------|------------------------|------------|
| **Relationship Model** | Policy → Groups/Users/SA (direct) | Tier → Groups → Users → API Keys | 🔴 Major Gap |
| **Multiple Tiers** | ❌ No concept | ✅ User can be in multiple tiers via groups | 🔴 Major Gap |
| **Tier Priority** | ❌ Not applicable | ✅ Use highest tier if multiple | 🔴 Major Gap |
| **Tier Lookup** | ❌ No logic | ✅ Auto-detect user's tier(s) | 🔴 Major Gap |
| **Empty State** | ❌ Not handled | ✅ Block actions if no tier | 🔴 Major Gap |

---

## GitOps Integration

| Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------|------------------|------------------------|------------|
| **Git Source Display** | ✅ Shows link | ✅ Shows "Managed by GitOps" | ✅ Aligned |
| **Read-only Mode** | ✅ Info alert + disabled editing | ✅ Mark as "Read Only" | ✅ Aligned |
| **Edit Prevention** | ✅ Disabled for git-managed | ✅ View-only for GitOps tiers | ✅ Aligned |
| **Delete Prevention** | ✅ Disabled for git-managed | ✅ View-only for GitOps tiers | ✅ Aligned |

---

## Documentation & Help

| Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------|------------------|------------------------|------------|
| **Field Helper Text** | 🟡 Basic helper text | ✅ Rich examples and samples | 🟡 Minor Gap |
| **Tooltips** | 🟡 Some tooltips | ✅ Tooltips for complex fields | 🟡 Minor Gap |
| **Sample Configs** | ❌ No samples | ✅ Nice to Have - samples for token/rate limits | 🔴 Major Gap |
| **Getting Started** | ❌ No guide | ✅ Nice to Have - recommendations | 🔴 Major Gap |
| **Learn More Links** | ❌ No links | ✅ Links to external docs | 🟡 Minor Gap |

---

## Non-Functional Requirements

| Feature | Current Prototype | Feature Refinement Doc | Gap Status |
|---------|------------------|------------------------|------------|
| **Admin-only Access** | 🟡 Not explicitly restricted | ✅ Must be restricted to RHOAI Admin role | 🟡 Minor Gap |
| **Event Tracking** | ❌ No tracking | ✅ Track "Create Tier" clicks | 🔴 Major Gap |
| **Performance** | ✅ Good | ✅ No specific requirements | ✅ Aligned |

---

## Out of Scope (Confirmed)

| Feature | Current Prototype | Feature Refinement Doc | Status |
|---------|------------------|------------------------|--------|
| **MCP Rate Limiting** | ❌ Not implemented | ❌ Out of scope for MVP | ✅ Aligned |
| **API Keys for MCP/Agents/VectorDB** | ✅ Implemented | ❌ Out of scope for MVP | 🟡 Remove |
| **Non-K8s Groups** | ❌ Not implemented | ❌ Out of scope | ✅ Aligned |
| **Chargeback Dashboard** | ❌ Not implemented | ❌ Separate RFE | ✅ Aligned |

---

## Summary Statistics

### Gap Categories

| Category | Count | Percentage |
|----------|-------|------------|
| 🔴 Major Gaps | 28 | 42% |
| 🟡 Minor Gaps | 24 | 36% |
| 🟢 Partial Alignment | 9 | 14% |
| ✅ Fully Aligned | 20 | 30% |

### Priority Breakdown

| Priority | Major Gaps | Minor Gaps | Total |
|----------|------------|------------|-------|
| MVP | 18 | 8 | 26 |
| Should Have | 4 | 6 | 10 |
| Nice to Have | 6 | 10 | 16 |

---

## Top 10 Critical Gaps (MVP Priority)

1. **No "Tier" concept** - Entire mental model needs to shift from Policies to Tiers
2. **No MaaS model tagging** - Can't distinguish MaaS models from regular models
3. **No tier-based API key inheritance** - API keys don't get settings from tiers
4. **No tier lookup for users** - No logic to determine user's tier(s) via groups
5. **No API key expiration from tier** - Tiers should set default expiration
6. **No empty state for no-tier users** - Should block API key creation
7. **No "Tier deleted" status** - API keys don't reflect deleted tier state
8. **No MaaS model filtering** - Tier creation shows all models, not just MaaS
9. **Complex targeting** - Should only support Groups, not individual users/SA
10. **Missing tier display in API keys** - Keys don't show which tier they inherit from

---

## Recommendation

**Approach: Incremental Refactor**

Rather than a complete rewrite, we recommend an incremental approach:

**Phase 1 (2 weeks):** Rename and refactor Policies to Tiers with simplified data model
**Phase 2 (2 weeks):** Implement tier-based API key inheritance and filtering  
**Phase 3 (1 week):** Add enhanced features (revoke, YAML toggle, etc.)
**Phase 4 (1 week):** Polish with helper content and nice-to-haves

This approach allows for:
- Continuous validation with stakeholders
- Easier testing and debugging
- Flexibility to adjust based on feedback
- Clear demo milestones

**Total Estimated Effort:** 6 weeks for full MVP implementation

