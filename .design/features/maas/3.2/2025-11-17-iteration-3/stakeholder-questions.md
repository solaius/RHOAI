# Stakeholder Questions - MaaS Admin UI
Date: November 12, 2025

This document contains critical questions that need stakeholder input before proceeding with implementation. Questions are organized by priority and category.

---

## 🔴 Critical Questions (Block Implementation)

These questions must be answered before beginning development.

### Q1: Policies vs Tiers - Coexistence or Replacement?

**Context:**  
The current prototype has a "Policies" page based on Kuadrant.io policy types (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy). The feature refinement doc introduces "Tiers" which seem to be a simplified, MaaS-specific concept.

**Question:**  
Should we:
- **Option A:** Replace "Policies" entirely with "Tiers"
- **Option B:** Keep both "Policies" (for general Kuadrant use) and "Tiers" (for MaaS)
- **Option C:** Rename "Policies" to "Tiers" and simplify for MaaS-only use

**Impact:**  
- Affects navigation structure
- Affects data model design
- Affects user mental model
- May require migration path for existing users

**✅ DECISION: Option B** - Keep both. Add new Tiers page, keep Policies with notice that it might not be included in 3.2.

---

### Q2: MaaS Model Tagging - Implementation Approach

**Context:**  
The refinement doc says "tag model as MaaS" but this is already handled by making a model deployment available as an AI Asset.

**✅ RESOLVED:** Making a model available as an AI Asset automatically makes it a MaaS model. This functionality already exists in the prototype. No additional implementation needed.

---

### Q3: Multiple Tier Membership - "Highest" Tier Definition

**Context:**  
The refinement doc states: "Users that are part of multiple-tier behavior is 'implicitly defined': always use 'highest' tier"

**Question:**  
How is "highest" tier defined?
- **Option A:** Highest token limit
- **Option B:** Highest rate limit
- **Option C:** Highest API key expiration
- **Option D:** Explicit tier priority field (e.g., Gold > Silver > Bronze)
- **Option E:** Most recently assigned tier
- **Option F:** Tier with most models

**Additional Questions:**
- Should admins be able to set an explicit tier priority?
- Should users be able to choose which tier to use when creating a key?
- What if two tiers have the same limits?

**Impact:**  
- Affects tier selection logic
- Affects API key creation
- Affects user experience when multiple tiers apply

**✅ DECISION:** Tiers have a "Level" field that defines priority. Only the highest tier is shown. Users cannot choose per key.

---

### Q4: Service Accounts - Supported or Not?

**Context:**  
The current prototype supports service accounts. The refinement doc only mentions "Groups" for tier targeting, but the meeting notes don't explicitly exclude service accounts.

**Question:**  
Should tiers support service accounts?
- **Option A:** Yes, alongside groups (like current prototype)
- **Option B:** No, groups only (strict interpretation of refinement doc)
- **Option C:** Yes, but via a "service-accounts" group concept

**Additional Questions:**
- How do service accounts get API keys if only groups are supported?
- Do service accounts need different tier settings than human users?
- Are there security implications for service account tier assignment?

**Impact:**  
- Affects tier data model
- Affects API key creation workflow
- Affects production deployment scenarios

**✅ DECISION: Option B** - Groups only. No service account support in tiers for MVP.

---

### Q5: Tier Deletion - API Key Impact

**Context:**  
The refinement doc says API keys should show "Inactive - Tier has been deleted" when tier is removed.

**Question:**  
When a tier is deleted, what happens to API keys?
- **Option A:** Keys are immediately revoked (status: Revoked)
- **Option B:** Keys remain active but are marked "Tier deleted" (status: Active with warning)
- **Option C:** Keys become inactive and stop working (status: Inactive - Tier deleted)
- **Option D:** Admin chooses during deletion: Revoke or Keep active

**Additional Questions:**
- Can users create new keys after their tier is deleted?
- Should there be a grace period before revocation?
- Should admins be warned about impacted users/keys before deletion?

**Impact:**  
- Affects production stability
- Affects user experience
- Affects tier deletion workflow design

**✅ DECISION:** Keys become disassociated from the tier when deleted. Show warning to admin before deletion about impacted keys.

---

## 🟡 Important Questions (Affect Design)

These questions affect the user experience but don't block initial development.

### Q6: Navigation and Naming

**Question:**  
What should the admin UI be called in the navigation?
- "Tiers"
- "MaaS Admin"
- "MaaS Tiers"
- "Model Access Tiers"
- Something else?

**Where should it live?**
- Settings > Tiers
- Settings > MaaS
- New top-level nav: MaaS (with child items for Tiers, Observability, etc.)

**Impact:**  
- Affects findability
- Affects user mental model
- Affects information architecture

**✅ DECISION:** "Tiers" under Settings > Tiers

---

### Q7: API Key One-Time Display

**Context:**  
The refinement doc emphasizes "The key is shown to the user ONE TIME ONLY upon creation"

**Question:**  
How should we display the key one time only?
- **Option A:** Show in creation modal with strong warning (current approach)
- **Option B:** Full-page interstitial with download option
- **Option C:** Modal with required confirmation ("I have saved this key")
- **Option D:** Send via secure channel only (email, download only)

**Additional Questions:**
- Should we force the user to copy/download before closing?
- Should we show a "reveal key" option later with admin approval?
- What happens if user closes modal without copying?

**Impact:**  
- Affects security posture
- Affects user experience
- May cause user frustration if key is lost

**✅ DECISION: Option A** - Current approach is acceptable.

---

### Q8: Empty State Location

**Context:**  
The refinement doc says: "Empty State: if user have no tier assigned or no models in tier - 'You have no access to MaaS models'"

**Question:**  
Where should this empty state appear?
- **Option A:** API Keys list page only
- **Option B:** API Keys list page + Create API Key modal (disabled)
- **Option C:** API Keys list page + AI Asset Endpoints page
- **Option D:** All of the above + Dashboard notification
- **Option E:** Only when attempting to create a key (modal error state)

**Impact:**  
- Affects discoverability of the issue
- Affects user guidance
- Affects support burden

**✅ DECISION:** Display in API Keys > API Key Details > Tiers tab (rename from Policies tab).

---

### Q9: UI vs YAML Toggle

**Context:**  
The refinement doc says: "Create/update/view in both UI and yaml formats with a toggle"

**Question:**  
What's the best pattern for UI/YAML toggle?
- **Option A:** Separate tabs (Details tab + YAML tab) - current approach
- **Option B:** Toggle switch on same page (Form ↔ YAML)
- **Option C:** Button to "View as YAML" opens modal
- **Option D:** Dropdown selector: View as (Form | YAML | JSON)

**Where should toggle appear?**
- In create/edit modals
- On details pages only
- Both

**Impact:**  
- Affects user workflow
- Affects editing capabilities
- Affects implementation complexity

**✅ DECISION:** Create Tier should be a full page form (not modal) with toggle switch at top to switch between Form and YAML views.

---

### Q10: MCP Assets in Tiers

**Context:**  
The refinement doc says API Keys "out of scope: no MCP" but also mentions MCP in "Available assets" for policies. Meeting notes say "Remove MCP."

**Question:**  
Should Tiers support MCP servers?
- **Option A:** Yes, include MCP alongside models (keep current design)
- **Option B:** No, remove MCP entirely from tiers
- **Option C:** Yes for tiers, but not accessible via API keys in MVP
- **Option D:** Defer to post-MVP

**Impact:**  
- Affects tier configuration
- Affects AI Asset filtering
- Affects API key asset access

**✅ DECISION: Option B** - Remove MCP servers, Agents, and Vector Databases from tiers. Models only.

---

## 🟢 Nice-to-Have Questions (Enhancement Features)

These questions can be answered later or defaulted.

### Q11: Default Tier Behavior

**Question:**  
Should we auto-create a default "Free Tier"?
- Auto-create on first load with standard limits
- Prompt admin to create default tier
- No automatic tier, admins create manually

**If yes:**
- What should default limits be?
- What groups should it include? (All users? A "default-users" group?)
- Can it be deleted or only edited?

**✅ DECISION:** Auto-create a "Default Tier" (not "Free Tier") with standard limits.

---

### Q12: Helper Content and Samples

**Question:**  
What sample tier configurations should we provide?
- Free Tier: 10K tokens/hour, 100 req/min, 30-day keys
- Standard Tier: 50K tokens/hour, 1K req/min, 90-day keys  
- Premium Tier: 500K tokens/hour, 10K req/min, 365-day keys
- Enterprise Tier: Unlimited tokens, 100K req/min, no expiration

**Should samples be:**
- Static examples in helper text
- Pre-populated templates users can select
- Both

**Recommendation:** Both - static examples + templates for quick start.

---

### Q13: AAE Integration

**Question:**  
How should "Generate API Key" from AI Asset Endpoints work?
- Button on each model card opens quick-create modal
- Button at top of page opens standard modal with pre-selection
- No integration (users go to API Keys page)

**✅ DECISION:** View Endpoint popover (currently shown from table) should include a tier selector and generate API key option when one doesn't already exist.

---

### Q14: Tier Priority Display

**Question:**  
If a user has multiple tiers, how should we show this?
- Show all tiers with badges (e.g., "Standard (primary)", "Free (available)")
- Show only active/highest tier
- Let user choose which tier to use per key

**✅ DECISION:** Show only the highest tier. Users cannot choose per key.

---

### Q15: Observability Integration

**Question:**  
Should tier information be visible in:
- Observability dashboard (per-tier usage)
- Model deployment details (which tiers can access this model)
- User management pages (which tiers each user/group has)

**✅ DECISION:** Yes to Observability dashboard and Model deployment details. Skip user management pages (don't exist yet).

---

## Question Response Template

For stakeholders to fill out:

---

### Response Form

**Respondent Name:**  
**Date:**  
**Role:**  

| Question ID | Selected Option | Notes/Rationale |
|-------------|----------------|-----------------|
| Q1 | [ ] A / [ ] B / [ ] C | |
| Q2 | [ ] A / [ ] B / [ ] C / [ ] D | |
| Q3 | [ ] A / [ ] B / [ ] C / [ ] D / [ ] E / [ ] F | |
| Q4 | [ ] A / [ ] B / [ ] C | |
| Q5 | [ ] A / [ ] B / [ ] C / [ ] D | |
| Q6 | Navigation name: ___________ <br> Location: ___________ | |
| Q7 | [ ] A / [ ] B / [ ] C / [ ] D | |
| Q8 | [ ] A / [ ] B / [ ] C / [ ] D / [ ] E | |
| Q9 | [ ] A / [ ] B / [ ] C / [ ] D | |
| Q10 | [ ] A / [ ] B / [ ] C / [ ] D | |
| Q11 | [ ] Yes (auto-create) / [ ] Prompt / [ ] Manual | |
| Q12 | [ ] Static / [ ] Templates / [ ] Both | |
| Q13 | Integration approach: ___________ | |
| Q14 | Display approach: ___________ | |
| Q15 | [ ] Yes - all / [ ] Selective / [ ] Post-MVP | |

**Additional Comments:**

---

## Meeting Notes from Nov 12 Refinement

From the Google doc meeting notes, here's what was clarified:

### Confirmed:
- ✅ Tier/Subscriptions → Policy (they used "Policy" but meant tier-like grouping)
- ✅ Connecting kubernetes groups to tier
- ✅ Openshift groups so far
- ✅ Mapping tiers to specific groups
- ✅ Tier can map to 1 or multiple models
- ✅ Rate limit at the tier level
- ✅ User has 5000 tok per min, per model
- ✅ Token limit as a top level field
- ✅ Remove expire tier (removed from tier, kept in API keys)
- ✅ Remove MCP from MVP
- ✅ Default tier concept exists

### Open from meeting:
- ❓ Where does tier to model mapping get defined? (Answer: In tier creation)
- ❓ Metrics? User level, not through MaaS API directly (Need clarification)
- ❓ Does the key also impact what shows up in AAE? (Answer: Yes, should filter)

---

## Next Steps

1. **Schedule stakeholder review:** Present these questions in next MaaS meeting
2. **Get responses:** Use response form above
3. **Document decisions:** Update this file with final answers
4. **Update implementation plan:** Adjust based on answers
5. **Begin Phase 1 development:** Once critical questions (Q1-Q5) are answered

