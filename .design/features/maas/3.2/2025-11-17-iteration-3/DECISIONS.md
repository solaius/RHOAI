# Stakeholder Decisions - MaaS Admin UI
Date: November 12, 2025

This document summarizes all decisions made by stakeholders regarding the MaaS Admin UI implementation.

## ✅ Critical Decisions (Implementation Ready)

### Q1: Policies vs Tiers
**DECISION: Keep Both**
- Create new Settings > Tiers page for MaaS
- Keep existing Settings > Policies page
- Add warning banner to Policies: "This feature might not be included in 3.2. Use Tiers for MaaS."

**Impact:** Lower risk - No migration needed, can evaluate both approaches

---

### Q2: MaaS Model Tagging
**DECISION: Already Implemented**
- Making a model available as an AI Asset = MaaS model
- No additional tagging mechanism needed
- Tier creation shows only AI Asset models

**Impact:** Removes a major blocking issue - one less thing to implement

---

### Q3: Multiple Tier Membership
**DECISION: Level-Based Priority**
- Tiers have a `level` field (number: 100, 200, 300, etc.)
- Higher number = higher priority
- Users automatically get highest tier based on level
- Users cannot choose per key

**Impact:** Clear, predictable priority system

---

### Q4: Service Accounts
**DECISION: Groups Only**
- Tiers support only Groups, not Service Accounts or individual Users
- Simpler model, clearer security boundaries

**Impact:** Simplified tier targeting - fewer edge cases

---

### Q5: Tier Deletion
**DECISION: Keys Become Disassociated**
- When tier is deleted, API keys are disassociated (not revoked)
- Keys continue to work but show warnings
- Admin sees warning before deleting tier about affected keys

**Impact:** Less disruptive to users, clearer communication

---

## ✅ Important Decisions (Design Direction)

### Q6: Navigation and Naming
**DECISION: Settings > Tiers**
- Simple name: "Tiers"
- Location: Settings > Tiers
- Keep Policies in Settings too

---

### Q7: API Key One-Time Display
**DECISION: Current Approach (Option A)**
- Show in creation modal with strong warning
- Current implementation is acceptable
- No need for extra confirmation step

---

### Q8: Empty State Location
**DECISION: API Key Details > Tiers Tab**
- Show "No tier assigned" message in Tiers tab of API Key Details
- Rename "Policies" tab to "Tiers" tab
- Display: "You have no access to MaaS models. Contact administrator."

---

### Q9: UI/YAML Toggle
**DECISION: Full Page with Toggle Switch**
- Create/Edit Tier is a full page (not modal)
- Route: `/settings/tiers/create`
- Toggle switch at TOP of page to switch between Form and YAML views
- Both views edit the same tier data

**Impact:** More space for complex form, better YAML editing experience

---

### Q10: MCP Assets in Tiers
**DECISION: Models Only**
- Remove MCP Servers from tiers
- Remove Agents from tiers
- Remove Vector Databases from tiers
- Tiers work with AI Asset Models only

**Impact:** Simplified scope, clearer focus

---

## ✅ Enhancement Decisions (Nice-to-Have)

### Q11: Default Tier
**DECISION: Auto-Create "Default Tier"**
- NOT called "Free Tier"
- Called "Default Tier"
- Auto-created with standard limits
- Level: 100, Token: 10K/hour, Rate: 100/min, Expiration: 90 days

---

### Q12: Helper Content
**DECISION: Good Samples Provided**
- Free/Standard/Premium/Enterprise tier examples
- Both static examples and templates
- Inline helper text with specific examples

---

### Q13: AAE Integration
**DECISION: Enhanced View Endpoint Popover**
- View Endpoint popover (shown from table) gets enhanced
- Add tier selector dropdown
- Add "Generate API Key" button when no key exists
- Simplified creation flow inline

---

### Q14: Tier Priority Display
**DECISION: Show Only Highest Tier**
- Display only the highest tier (by level)
- Users cannot choose which tier to use
- Clear, simple UX

---

### Q15: Observability Integration
**DECISION: Yes to Most**
- ✅ Show tier info in Observability dashboard
- ✅ Show tier info in Model deployment details
- ❌ Skip user management pages (don't exist yet)

---

## 📋 Key Implementation Changes

### Data Model Updates

**Tier Type (New):**
```typescript
export interface Tier {
  id: string;
  name: string;
  description: string;
  level: number; // NEW: Priority field
  status: 'Active' | 'Inactive';
  gitSource?: string;
  isReadOnly: boolean;
  groups: string[]; // Only groups, no users/service accounts
  models: string[]; // Only models, no MCP/agents/vectorDBs
  limits: {
    tokenLimit?: { amount: number; period: string };
    rateLimit?: { amount: number; period: string };
    apiKeyExpirationDays?: number; // NEW: Default expiration
  };
  dateCreated: Date;
  createdBy: string;
  yaml?: string;
}
```

### Page Structure Updates

**New Pages:**
- `/settings/tiers` - Tier list
- `/settings/tiers/create` - Full page create form
- `/settings/tiers/:id` - Tier details
- `/settings/tiers/:id/edit` - Full page edit form

**Updated Pages:**
- `/settings/policies` - Add warning banner
- `/gen-ai-studio/api-keys` - Show tier column
- `/gen-ai-studio/api-keys/:id` - Rename Policies tab to Tiers tab

### Component Removals

**Remove from Tiers:**
- MCP Servers multi-select
- Agents multi-select
- Vector Databases multi-select
- Users targeting
- Service Accounts targeting
- Time Limit fields
- Quota Renewal Schedule (post-MVP)
- Over-limit Behavior (post-MVP)

**Remove from API Keys:**
- Manual limit configuration
- Manual model selection
- Owner selection
- MCP/Agents/VectorDB asset display

---

## 🎯 Implementation Priority

### Phase 1 (Must Have - MVP)
1. ✅ Create new Tiers page
2. ✅ Add warning banner to Policies
3. ✅ Implement level-based tier priority
4. ✅ Full page create/edit with Form/YAML toggle
5. ✅ Groups-only targeting
6. ✅ Models-only assets (AI Assets)

### Phase 2 (Must Have - MVP)
7. ✅ API Key tier inheritance
8. ✅ Show highest tier only
9. ✅ Rename Policies tab to Tiers tab
10. ✅ Tier disassociation handling
11. ✅ Empty state in Tiers tab

### Phase 3 (Should Have)
12. ✅ Enhanced View Endpoint popover
13. ✅ Default Tier auto-creation
14. ✅ Helper content and samples

### Phase 4 (Nice to Have)
15. Observability integration
16. Model deployment tier display

---

## 📝 Notes from Decision Process

**What Changed from Initial Recommendations:**
- **Q1:** Changed from "Replace Policies" to "Keep Both" - lower risk approach
- **Q2:** Resolved as already implemented - removes blocking issue
- **Q9:** Changed from tabs to full page with toggle - better UX for complex forms
- **Q13:** Changed from button-on-card to enhanced popover - better integration

**What Stayed the Same:**
- Level-based tier priority
- Groups-only targeting
- Models-only assets
- Tier disassociation vs revocation
- Settings > Tiers location
- Show highest tier only

---

## 🚀 Ready to Implement

All critical questions answered ✅  
Implementation plan updated ✅  
Mock data requirements defined ✅  
Phase 1 can begin immediately ✅

---

**Last Updated:** November 12, 2025  
**Status:** 🟢 Ready for Implementation

