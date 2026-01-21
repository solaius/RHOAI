# MaaS Admin UI Feature Refinement Analysis
Date: November 12, 2025

## Executive Summary

This document analyzes the Feature Refinement document for the MaaS Admin UI (RHOAISTRAT-638) and compares it with the current prototype implementation to identify gaps and recommend implementation updates.

## Key Terminology Changes

The feature refinement document introduces important conceptual changes from the current prototype:

| Current Prototype | Feature Refinement Doc | Impact |
|-------------------|------------------------|--------|
| "Policies" | "Tiers" | Major rename - fundamental shift in mental model |
| Policies apply to individual users/groups/service accounts | Tiers are assigned to Groups only | Simplification of admin workflow |
| Policies target all AI Assets | Tiers target only MaaS-tagged models | Clearer scope and purpose |
| No concept of API key expiration inheritance | Tiers set default expiration for API keys | New feature requirement |
| Policies are UI-first | Tiers can be GitOps-managed | Read-only viewing requirement |

## Feature Requirements from Refinement Doc

### Admin: Tier Management (MVP)

**1. Create a Tier**
   - Define name and description (e.g., "premium-tier")
   - Select models tagged as MaaS and assign to tier
   - Define token and rate limits (e.g., 50,000 tokens per 2 hours)
   - Assign Groups associated with the tier (e.g., ds-team-1)
   - Set expiration date for API keys created from users in groups of this Tier

**2. View Tiers**
   - List all tiers on the cluster
   - View tiers created outside of Dashboard
   - Mark external tiers as "Read Only" or "Managed by GitOps"

**3. Tier Operations (Should Have)**
   - Edit existing tiers
   - Delete tiers
   - Toggle between UI and YAML view

**4. Helper Content (Nice to Have)**
   - Recommendations/samples of token/rate limits
   - Default "free" tier with all MaaS models

### Developer: API Key UI (MVP)

**1. Create API Key**
   - Key shown ONE TIME ONLY upon creation
   - Inherits settings from user's Tier (via group membership)
   - Name, Description fields

**2. View API Keys**
   - List with metadata:
     - Name
     - Description (optional)
     - Time created / Time expired
     - Status: Active/Inactive
     - Inactive Reasoning: "Tier has been deleted"

**3. Empty State**
   - Display when user has no tier assigned or no models in tier
   - Message: "You have no access to MaaS models"

**4. Revoke Keys (Should Have)**
   - Confirmation modal (same pattern as delete model deployments)
   - Limitation: Only able to revoke all keys, not individual ones

**5. Model Visibility (Should Have)**
   - Show available MaaS models associated with key due to Tier
   - Filtered by user's group membership

**6. Quick Create (Nice to Have)**
   - Micro UI/Integration with AAE
   - "Generate API Key" button from AAE page

### Non-Functional Requirements

**1. Authentication & Authorization**
   - MaaS Admin pages restricted to RHOAI Admin roles only
   - Tier page access limited to admins

**2. User Guidance**
   - Complex fields must include embedded help
   - Tooltips and helper text with clear examples
   - Especially for token/rate limits

**3. User Adoption Metrics**
   - Track clicks on "Create Tier" button
   - Event tracking for form submissions

### Out of Scope

- MCP rate limiting (not for MVP)
- API Keys: no MCP, agents, VectorDB
- Assign groups outside of Kubernetes
- Chargeback/Observability dashboard (separate RFE)

## Current Prototype Implementation

### What Currently Exists

**Settings > Policies Page** (`/settings/policies`)
- List view with table showing:
  - Name, Type (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy), Status, Targets, Rules
- Create Policy modal with:
  - Name, Description
  - Available Assets: Models, MCP Servers (multi-select)
  - Limits: Token limit, Rate limit, Time limit
  - Targets: Groups, Users, Service Accounts (multi-select for all three)
- Policy Details page with:
  - Details tab, YAML tab
  - Git source field with indicator for GitOps-managed policies
  - Edit, Enable/Disable, Delete actions
  - Quota renewal schedule
  - Over-limit behavior (Hard/Soft throttle)

**Gen AI Studio > API Keys Page** (`/gen-ai-studio/api-keys`)
- List view with table showing:
  - Name, Status, API Key (masked), Assets, Owner, Last used, Expiration date
- Create API Key modal with:
  - Name, Description
  - Owner selection (User/Group/Service Account)
  - Limits and Policies section (Token/Rate limits, Budget, Expiration)
  - AI Asset Access: Multi-select for Models, MCP Servers, Vector DBs, Agents
- API Key Details page with tabs:
  - Details, Assets, Metrics, Policies, Settings
- Actions: View details, Enable/Disable, Delete

**AI Assets** (`/gen-ai-studio/asset-endpoints`)
- Add Asset modal
- List views for Models and MCP Servers
- Project/namespace scoping

**Model Deployments**
- Deploy Model Wizard with:
  - "Make available as AI asset" checkbox
  - "Make available globally for models as a service" checkbox (removed recently per design-tasks.md)

### What's Missing or Needs Alignment

**Critical Gaps:**

1. **No "Tier" concept** - Current prototype uses "Policy" which has different semantics and broader scope
2. **No MaaS model tagging** - No way to designate which models are "MaaS models" vs regular models
3. **No tier-to-group-to-user-to-API-key relationship** - API keys don't inherit from tiers based on group membership
4. **No API key expiration inheritance from Tier** - Expiration is set per key, not inherited from tier
5. **No tier-based model filtering** - API keys can access any asset, not just MaaS models from assigned tier
6. **No "no access" empty state** - Missing empty state when user has no tier/models
7. **Over-complex targeting** - Current allows individual user and service account targeting, refinement wants Groups only
8. **Wrong location for admin UI** - Currently in Settings > Policies, refinement suggests rename to "MaaS Admin"
9. **API Keys show all assets** - Should only show MaaS models from user's tier
10. **No tier deletion cascade** - When tier deleted, affected API keys should show "Inactive - Tier has been deleted"

**Minor Gaps:**

1. No recommendations/samples for token/rate limits in helper text
2. No default "free" tier concept
3. No AAE integration for quick key creation
4. No limitation note about "revoke all keys" vs individual revocation

## Clarifying Questions

### Data Model Questions

**Q1: Relationship between Tiers and Policies**
- Are Tiers a replacement for Policies, or a subset?
- The current prototype has Kuadrant.io policy types (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy)
- Should Tiers be a specific type of RateLimitPolicy, or a completely separate concept?
- **Recommendation:** Based on the refinement doc, Tiers appear to be a simplified, purpose-built abstraction specifically for MaaS that replaces the generic Policy concept for the MaaS Admin use case.

**Q2: MaaS Model Tagging**
- Where/how are models "tagged as MaaS"?
- Is this a checkbox in the Model Deployment wizard?
- Is it a property on the model resource itself?
- Can a model be both MaaS and non-MaaS accessible simultaneously?
- **Note:** The design-tasks.md shows that "Make this deployment available globally for models as a service" was recently removed from the wizard. This needs clarification.

**Q3: Multiple Tier Membership**
- What happens if a user belongs to multiple groups with different tiers?
- The refinement doc notes: "Users that are part of multiple-tier behavior is 'implicitly defined': always use 'highest' tier"
- How is "highest" defined? By token limit? By rate limit? By a tier priority field?

**Q4: Service Accounts**
- The refinement doc doesn't mention service accounts for tiers
- Current prototype allows service account targeting in policies
- Should tiers support service accounts, or only Groups?
- How do service accounts get API keys if tiers only assign to groups?

**Q5: API Key Creation**
- The refinement says "The key is shown to the user ONE TIME ONLY upon creation"
- Current prototype already masks keys after creation
- Does this mean we need to show a full-page "Copy this key now" interstitial?
- Or is the current modal approach acceptable if it shows the key once before closing?

**Q6: Tier Deletion Impact**
- When a tier is deleted, what happens to:
  - API keys created by users in that tier's groups?
  - Existing requests using those API keys?
- The doc says API keys should show "Inactive - Tier has been deleted"
- Should the keys be automatically revoked, or just marked inactive?
- Can users create new keys after their tier is deleted?

**Q7: GitOps Integration**
- "View Tiers created from outside of the dashboard, marked as 'Read Only' or 'Managed by GitOps'"
- What is the source of truth for detecting GitOps management?
- Is it the presence of a `gitSource` field?
- Should we prevent editing/deleting of GitOps-managed tiers entirely?
- Current prototype already has this for Policies - should we keep the same approach?

**Q8: MCP and Other Assets**
- The refinement doc says API Keys out of scope: "no MCP, agents, VectorDB"
- But the Policies section mentions MCP in "Available assets"
- Should Tiers support MCP servers, or only Models?
- The meeting notes say "Remove MCP" - does this mean remove from Tiers or from the entire MaaS feature?

### UX Questions

**Q9: Page Naming and Navigation**
- Current: Settings > Policies
- Refinement: Should be "MaaS Admin" or similar
- Where should this live in the navigation?
  - Settings > MaaS Admin?
  - Settings > Tiers?
  - A new top-level nav item for MaaS?
- Should we keep both Policies (for general Kuadrant policies) and Tiers (for MaaS), or replace entirely?

**Q10: API Key Location**
- Current: Gen AI Studio > API Keys
- Is this the right location per the refinement doc?
- The doc calls it "API Key UI in Gen AI Studio, a consumption view for AI developers"
- This suggests it should stay in Gen AI Studio
- Confirm this is correct

**Q11: Empty State Behavior**
- "Empty State: if user have no tier assigned or no models in tier"
- Where does this empty state appear?
  - On the API Keys list page?
  - In the Create API Key modal?
  - On the AI Asset Endpoints page?
  - All of the above?

**Q12: YAML Toggle**
- "Create/update/view in both UI and yaml formats with a toggle"
- Should this be:
  - A tab (like current Policy Details page)?
  - A toggle switch on the same page?
  - A button that switches the entire view mode?

### Technical Questions

**Q13: API Support**
- The refinement doc lists dependencies:
  - "Open API support for all actions k8s & otherwise"
  - "Support for getting API keys by a user's logged in token"
  - "Support for getting Tier access by a user's logged in token (only for Tiers they are in?)"
  - "CRUD support for Tiers"
  - "CRUD support for API Keys"
- Are these APIs available in the backend?
- If not, should the prototype mock these behaviors?

**Q14: Tier CRD**
- Meeting notes mention: "Investigate timeline for creation of Tier CRD"
- Is there a Kubernetes CRD for Tiers?
- Or is this a planned backend component?
- For the prototype, should we assume a Tier CRD exists and mock it?

**Q15: Rate Limit Implementation**
- "Token limit: have that as a top level"
- "Add Tokens/Rate per X min"
- Should rate limits be:
  - Per-user within a tier?
  - Per-tier (shared quota across all users)?
  - Per-API-key?

## Recommended Updates

See `implementation-plan.md` for detailed recommendations.

