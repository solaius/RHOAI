# Planning Summary - MaaS Admin UI Feature Alignment
## ✅ ALL DECISIONS MADE - READY FOR IMPLEMENTATION

## What Was Analyzed & Decided

I reviewed the Feature Refinement document for RHOAISTRAT-638 (MaaS Admin UI), compared it to the current prototype, and incorporated all your feedback to create a complete implementation plan with all decisions made.

## Key Findings

### 1. Major Conceptual Shift Required

The biggest change is moving from generic "**Policies**" (Kuadrant.io-based) to MaaS-specific "**Tiers**":

**Current Prototype:**
- Generic policies for any gateway/auth use case
- Support for 4 policy types (Auth, RateLimit, TLS, DNS)
- Complex targeting (groups + individual users + service accounts)
- Applies to all AI assets (models, MCP, agents, vector DBs)

**Feature Refinement:**
- Purpose-built "Tiers" for MaaS only
- Single tier concept (no type selection)
- Simple targeting (groups only)
- MaaS models only (no MCP in MVP)
- API keys inherit settings from user's tier

### 2. The Tier Inheritance Model

The refinement doc introduces a new relationship model:

```
Tier → Groups → Users → API Keys → MaaS Models
```

This means:
- Admins create tiers with token/rate limits
- Admins assign tiers to Kubernetes groups
- Users automatically get tier settings based on group membership
- API keys inherit limits and model access from user's tier
- No manual configuration needed when creating keys

### 3. Gap Analysis Results

I found **81 comparison points** across the prototype:

- 🔴 **42% Major Gaps** (28 items) - Require significant changes
- 🟡 **36% Minor Gaps** (24 items) - Need adjustments  
- 🟢 **14% Partial Alignment** (9 items) - Close, need tweaking
- ✅ **30% Fully Aligned** (20 items) - No changes needed

**Good News:** The prototype has a solid foundation (44% aligned or partially aligned)

**Challenge:** The 42% major gaps represent fundamental changes to the data model and user experience

### 4. Top 10 Critical Gaps

1. No "Tier" concept exists (currently called "Policies")
2. No MaaS model tagging (can't distinguish MaaS from regular models)
3. No tier-based API key inheritance (keys configured manually)
4. No tier lookup logic (can't auto-detect user's tier via groups)
5. No API key expiration inheritance from tiers
6. No empty state for users without tiers
7. No "Tier deleted" status for API keys
8. No MaaS model filtering in tier creation
9. Over-complex targeting (should be groups only)
10. No tier display in API key list/details

## ✅ All Questions Answered

I identified **15 questions** and **all have been answered**. Here are the key decisions:

### Q1: Policies vs Tiers
**✅ DECISION: Keep Both**
- Create new Settings > Tiers page
- Keep Settings > Policies with warning banner
- Lower risk, can evaluate both approaches

### Q2: MaaS Model Tagging
**✅ RESOLVED: Already Implemented**
- Making a model an AI Asset = MaaS model
- No additional work needed
- Removes a blocking issue!

### Q3: Multiple Tier Membership
**✅ DECISION: Level-Based Priority**
- Tiers have a `level` field (100, 200, 300, etc.)
- Higher number = higher priority
- Show only highest tier to users

### Q4: Service Accounts
**✅ DECISION: Groups Only**
- Tiers target Groups only
- No Service Accounts or individual Users
- Simpler model

### Q5: Tier Deletion
**✅ DECISION: Keys Become Disassociated**
- API keys are disassociated (not revoked)
- Keys continue working with warnings
- Admin sees impact before deleting

### More Key Decisions:
- **Q6:** Navigation = Settings > Tiers
- **Q7:** One-time display = Current approach is good
- **Q8:** Empty state = In API Key Details > Tiers tab
- **Q9:** Create Tier = Full page with Form/YAML toggle at top
- **Q10:** Assets = Models only (no MCP, Agents, VectorDBs)
- **Q11:** Auto-create "Default Tier" (not "Free Tier")
- **Q13:** View Endpoint popover gets tier selector + generate key
- **Q14:** Show only highest tier (users can't choose)
- **Q15:** Observability integration yes (skip user management)

## Implementation Recommendation

### Approach: Incremental Refactor (6 weeks)

I recommend a **4-phase incremental approach** rather than a complete rewrite:

**Phase 1 (2 weeks): Core Foundation**
- Rename Policies → Tiers with new data model
- Add MaaS model tagging to deployment wizard
- Update tier creation modal
- Create comprehensive mock data

**Phase 2 (2 weeks): API Key Integration**
- Implement tier inheritance for API keys
- Add tier lookup logic
- Update API key list and details pages
- Handle empty state (no tier assigned)

**Phase 3 (1 week): Enhanced Features**
- Add revoke keys functionality
- Refine UI/YAML toggle
- Improve edit/delete warnings

**Phase 4 (1 week): Polish**
- Add helper content with examples
- Create default free tier
- Add AAE integration (if time)

**Confidence Level:** High - Building on solid foundation with clear requirements

## What I Created

I generated **6 comprehensive planning documents** in `/design/3.2/maas/2025-11-12/`:

### 1. [DECISIONS.md](./DECISIONS.md) ⭐ NEW
**All stakeholder decisions in one place**
- Every question answered with final decision
- Implementation-ready
- Clear rationale for each choice
- **Read Time:** 5 minutes
- **START HERE!**

### 2. [README.md](./README.md)
Navigation guide for all documents

### 3. [executive-summary.md](./executive-summary.md)
- TL;DR for leadership/PMs
- Key findings and recommendation
- Success metrics and dependencies
- **Read Time:** 5 minutes

### 4. [stakeholder-questions.md](./stakeholder-questions.md) - UPDATED
- 15 questions with all decisions marked ✅
- Organized by priority (Critical, Important, Nice-to-Have)
- Response form template included
- Meeting notes from Nov 12 refinement
- **Read Time:** 10 minutes

### 5. [comparison-matrix.md](./comparison-matrix.md)
- Side-by-side comparison of current vs target
- Organized by feature area
- Color-coded gap assessment
- 81 comparison points analyzed
- **Read Time:** 15 minutes

### 6. [feature-analysis.md](./feature-analysis.md)
- Deep dive into all requirements
- Terminology changes explained
- Clarifying questions with context
- **Read Time:** 20 minutes

### 7. [implementation-plan.md](./implementation-plan.md) - UPDATED
- Detailed 4-phase development plan
- Specific changes for each feature
- Code examples and file paths
- Testing scenarios
- **Read Time:** 30 minutes

## ✅ Ready to Implement

### All Decisions Made!

1. **✅ All Questions Answered**
   - See DECISIONS.md for complete list
   - stakeholder-questions.md updated with decisions marked
   - implementation-plan.md updated with changes

2. **✅ Implementation Plan Ready**
   - Tier data model defined with `level` field
   - Full page create form specified
   - Groups-only, Models-only scoping confirmed
   - Warning banner for Policies page included

3. **✅ Key Changes from Original Plan**
   - Keep Policies + add Tiers (lower risk)
   - MaaS tagging already done (AI Assets)
   - Level-based priority instead of token-based
   - Full page form instead of modal
   - Tier disassociation instead of revocation

### Can Start Immediately

4. **Begin Phase 1 Development**
   - Create new Settings > Tiers page
   - Add warning banner to Policies page
   - Implement Tier data model with level field
   - Create full page form with Form/YAML toggle
   - Update mock data

5. **Confirm Dependencies** (In Parallel)
   - Backend API availability for Tier CRUD
   - Tier CRD timeline
   - Group membership lookup API

6. **User Testing Plan**
   - Test at end of each phase
   - Iterate based on feedback
   - Validate with target users

## Key Takeaways

✅ **Clear business value:** Simpler UX, faster workflows, better user experience

✅ **Solid foundation:** 44% of features already aligned or close

✅ **Manageable scope:** Refactor, not rewrite - 6 weeks estimated

✅ **Low-to-medium risk:** With clear mitigation strategies

⚠️ **Blockers:** Must answer Q1-Q5 before starting development

⚠️ **Dependencies:** Need backend API support confirmation

## What's Changed

### Based on Your Feedback:
1. **Removed MaaS tagging as blocking issue** - Already handled by AI Assets ✅
2. **Keep both Policies and Tiers** - Lower risk approach with warning banner
3. **Added level field to Tiers** - Clear priority system (100, 200, 300, etc.)
4. **Groups only** - No service accounts or individual users
5. **Tier disassociation** - Keys don't get revoked, just disassociated
6. **Settings > Tiers** - Simple navigation name
7. **Full page form** - Create/Edit Tier is a page with Form/YAML toggle at top
8. **Models only** - Removed MCP, Agents, VectorDBs from tiers
9. **Default Tier** - Auto-create "Default Tier" (not "Free Tier")
10. **View Endpoint enhancement** - Popover gets tier selector and generate key option
11. **Show highest tier only** - Users can't choose per key
12. **Rename Policies tab** - "Tiers" tab in API Key Details

### Major Simplifications:
- ✅ MaaS tagging not needed (already exists)
- ✅ Keep Policies (no migration needed)
- ✅ Clear priority with level field
- ✅ Full page gives more space
- ✅ Fewer asset types to manage

## Questions or Concerns?

I'm ready to:
- Clarify any decision rationale
- Adjust implementation details
- **Begin implementation immediately** - All decisions made! ✅

**No implementation has been done yet** - these are planning documents ready for you to approve and begin development!

