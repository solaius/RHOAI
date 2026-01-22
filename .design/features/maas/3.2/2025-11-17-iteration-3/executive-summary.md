# MaaS Admin UI - Executive Summary
Date: November 12, 2025  
Document Type: Feature Alignment Planning

## TL;DR

The Feature Refinement document for RHOAISTRAT-638 (MaaS Admin UI) introduces significant conceptual changes from the current prototype. The most impactful change is shifting from a generic "Policies" model to a purpose-built "Tiers" model for MaaS. This requires substantial refactoring but results in a simpler, more focused user experience.

**Recommendation:** Proceed with incremental implementation over 4 sprints (6 weeks).

---

## Current State

The prototype has:
- ✅ Policies page for managing Kuadrant.io policies (Auth, RateLimit, TLS, DNS)
- ✅ API Keys page for managing keys with manual configuration
- ✅ Comprehensive UI with create, view, edit, delete capabilities
- ✅ GitOps integration support
- ✅ YAML viewing and editing

**Location:**  
- Admin: Settings > Policies  
- Developer: Gen AI Studio > API Keys

---

## Target State (per Feature Refinement)

### Key Concept Change: Policies → Tiers

**Tiers are:**
- MaaS-specific (not general Kuadrant policies)
- Simpler (no policy type selection)
- Group-based (no individual user/service account targeting)
- Model-focused (only MaaS-tagged models, no MCP in MVP)
- API key inheritance enabled (keys get settings from user's tier)

**The Tier Relationship Model:**
```
Tier → Groups → Users → API Keys → MaaS Models
```

### Admin Experience

**Tier Management:**
1. Create tiers with name, description, groups, MaaS models
2. Set token/rate limits that apply to all users in tier
3. Set default API key expiration for tier
4. View all tiers including GitOps-managed (read-only)
5. Edit/delete tiers (with warnings about user impact)
6. Toggle between UI and YAML views

**Example Tier:**
- Name: "Premium Tier"
- Groups: premium-customers, research-team
- Models: granite-3.1b, llama-7b, gpt-oss-20b (all tagged as MaaS)
- Token Limit: 500,000 per hour
- Rate Limit: 10,000 requests per minute
- API Key Expiration: 365 days

### Developer Experience

**API Key Management:**
1. Create keys with name and description only
2. Inherit limits, models, and expiration from tier automatically
3. See tier information and inherited settings
4. View only MaaS models accessible via tier
5. Empty state if no tier assigned: "You have no access to MaaS models"
6. Revoke keys with confirmation
7. View key once upon creation only

**Key Simplifications:**
- No manual limit configuration (inherited from tier)
- No manual model selection (inherited from tier)
- No owner selection (always current user)
- Create in 30 seconds vs 2+ minutes

---

## Gap Analysis

### Critical Gaps (28 total)

**Top 5 Blocking Issues:**
1. No "Tier" concept exists (need full rename/refactor from Policies)
2. No MaaS model tagging (can't distinguish MaaS from non-MaaS models)
3. No tier-based inheritance (API keys don't get settings from tiers)
4. No tier lookup logic (can't auto-detect user's tier via groups)
5. No empty state handling (should block creation if no tier)

### Alignment Score

- 🔴 Major Gaps: **42%** (28 items)
- 🟡 Minor Gaps: **36%** (24 items)  
- 🟢 Partial Alignment: **14%** (9 items)
- ✅ Fully Aligned: **30%** (20 items)

**Good News:** 44% of features are fully or partially aligned. The foundation is solid.

**Challenge:** 42% major gaps require significant conceptual rework.

---

## Critical Questions Needing Answers

Before implementation can begin, we need stakeholder input on:

1. **Policies vs Tiers:** Replace Policies entirely, or keep both?
2. **MaaS Tagging:** Where/how are models tagged as MaaS?
3. **Multiple Tiers:** How is "highest tier" defined if user has multiple?
4. **Service Accounts:** Should tiers support them, or groups only?
5. **Tier Deletion:** What happens to API keys when tier is deleted?

**See:** `stakeholder-questions.md` for complete list and response form.

---

## Implementation Recommendation

### Approach: Incremental Refactor

**Phase 1 (2 weeks): Core Foundation**
- Rename Policies → Tiers
- Add MaaS model tagging
- Update Tier creation modal
- Create new mock data

**Phase 2 (2 weeks): API Key Integration**
- Implement tier inheritance for API keys
- Add tier lookup logic
- Update API key list and details
- Add empty state handling

**Phase 3 (1 week): Enhanced Features**
- Add revoke keys functionality
- Refine UI/YAML toggle
- Improve edit/delete with warnings

**Phase 4 (1 week): Polish**
- Add helper content and samples
- Create default free tier
- Add AAE integration (if time permits)

**Total Duration:** 6 weeks  
**Confidence Level:** High (building on solid foundation)

---

## User Impact

### Admins (Platform Engineers)

**Benefits:**
- Simpler tier creation (no policy type confusion)
- Clearer mental model (tiers for MaaS only)
- Better visibility into user access
- Easier to manage group-based access

**Changes:**
- Must use new "Tiers" page instead of "Policies"
- Must tag models as MaaS explicitly
- API key settings now managed at tier level

### Developers (AI Engineers)

**Benefits:**
- Faster API key creation (30 seconds vs 2 minutes)
- No complex configuration needed
- Clear understanding of access (via tier)
- Better error messages (empty states)

**Changes:**
- API keys automatically inherit settings (no manual config)
- Must belong to a tier to create keys
- Can only access MaaS models (not all models)

---

## Risk Assessment

### Low Risk
- ✅ Building on existing prototype foundation
- ✅ Well-defined feature requirements
- ✅ Clear user benefits
- ✅ Incremental approach allows for course correction

### Medium Risk
- ⚠️ Significant conceptual shift may cause temporary confusion
- ⚠️ Need backend API support (unclear if available)
- ⚠️ Multiple open questions need stakeholder input

### Mitigation
- Document changes clearly
- Provide migration guide (if replacing existing feature)
- Extensive user testing at each phase
- Clear communication about changes

---

## Success Metrics

### Adoption
- 80%+ of admins create at least one tier within 30 days
- 70%+ of developers create at least one API key within 7 days of tier assignment

### Efficiency
- Time to create tier: < 2 minutes (target)
- Time to create API key: < 30 seconds (target)

### Satisfaction
- Admin satisfaction score: 4+/5
- Developer satisfaction score: 4.5+/5
- Support ticket reduction: 40%+ vs current state

### Usage
- Track tier creation events
- Track API key creation events
- Monitor empty state display rate (indicates users without tiers)

---

## Dependencies

### Technical
- Backend API support for:
  - Tier CRUD operations
  - API key generation and management by user token
  - Tier lookup by user/group
  - MaaS model filtering
- Tier CRD (Kubernetes Custom Resource Definition)

### Organizational
- Stakeholder approval on conceptual changes
- PM/UX alignment on final requirements
- Documentation team for user guides
- Product marketing for communication plan

---

## Next Steps

### Immediate (This Week)
1. ✅ Review planning documents with UXD team
2. ⏭️ Schedule stakeholder review meeting
3. ⏭️ Present critical questions and get decisions
4. ⏭️ Confirm backend API availability and timeline

### Near-term (Next 2 Weeks)
5. ⏭️ Update implementation plan based on decisions
6. ⏭️ Begin Phase 1 development
7. ⏭️ Create user testing plan
8. ⏭️ Draft migration/communication plan

### Mid-term (Weeks 3-6)
9. ⏭️ Complete Phases 2-4 development
10. ⏭️ Conduct user testing at each phase
11. ⏭️ Iterate based on feedback
12. ⏭️ Prepare documentation

---

## Document Index

This planning package includes:

1. **executive-summary.md** (this file) - Quick overview for leadership
2. **feature-analysis.md** - Deep dive into requirements and gaps
3. **comparison-matrix.md** - Side-by-side comparison of current vs target
4. **implementation-plan.md** - Detailed development plan with phases
5. **stakeholder-questions.md** - Critical questions needing answers

---

## Recommendation

✅ **Proceed with implementation** following the 4-phase incremental approach.

**Rationale:**
- Clear business value (simpler UX, faster workflows)
- Manageable technical complexity (refactor, not rewrite)
- Strong foundation already exists (44% aligned)
- Stakeholder alignment achievable (questions are answerable)
- Low-to-medium risk with clear mitigation strategies

**Caveat:** Must answer critical questions (Q1-Q5) before starting Phase 1.

---

## Questions or Concerns?

**Contact:**
- UXD: Andy Braren
- Product: Jenny Yi, Jonathan Zarecki
- Engineering: Andrew Ballantyne

**Meeting Notes:** See `design-history.md` for context from Nov 12 refinement meeting

**Related Jira:**
- RHOAISTRAT-638 (MaaS UI for Admin)
- RHAISTRAT-173 (API Keys)
- RHOAISTRAT-639 (Initial MaaS Offering)

