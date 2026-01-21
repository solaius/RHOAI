# RHOAI UX Jira Guides

This document consolidates the key guides for labeling and estimating RHOAI UX Jira issues.

---

## Problem Statement Labels

Every Epic (or Story without a parent Epic) must have a problem statement label. This tracks UX maturity and ensures design work is grounded in user needs.

### Required Labels

| Label | When to Use | Problem Statement Format |
|-------|-------------|-------------------------|
| `problem-statement-uxd-data-driven` | Based on UX Research or Product Design Research | "[Target User] struggles with [issue]. Data from [UX research source] shows [metrics]. This impacts [goal]." |
| `problem-statement-data-driven` | Based on data from outside UX (BU, Marketing, Eng, field feedback) | "[Target User] struggles with [issue]. Data from [source] shows [metrics]. This impacts [goal]." |
| `problem-statement-assumption` | Based on assumptions, not validated research | "We assume that [target user] experiences [issue] due to [reason]. This assumption is based on [source]." |
| `problem-statement-undefined` | Problem statement not yet defined (should be temporary) | N/A - placeholder only |

### Best Practices

**For Data-Driven Statements:**
- Clearly cite the data source
- Include specific metrics or patterns
- Use for work ready for refinement or implementation
- Preferred for Epic-level work

**For Assumption-Based Statements:**
- Be transparent about what the assumption is based on
- Include intention to validate with research
- Flag for team awareness when sharing with stakeholders
- Good for early exploration or discovery phases

### Examples

**Good Data-Driven:**
> Platform admins struggle to configure MaaS subscriptions. Data from the Dec 2025 MaaS Worksheet and customer field feedback (9 French customers, Ethan Group, Phoenix) shows confusion around entity relationships and quota allocation. This impacts adoption and admin productivity.

**Good Assumption-Based:**
> We assume that AI Engineers experience confusion when navigating between project-scoped model deployments and MaaS-available models. This assumption is based on the current separate treatment of these concepts and preliminary feedback from internal users.

**Bad (too vague):**
> Users don't like the dashboard because it's confusing.

---

## Activity Type Labels

Activity types track UX phases across the product development lifecycle. Apply one label per Story.

### Activity Types

| Label | Phase | Focus | Typical Outputs |
|-------|-------|-------|-----------------|
| `activity-orient` | Orient | Identify opportunities, plan | Journey maps, research findings, documented problems, planning artifacts |
| `activity-explore` | Explore | Ideation, initial design | Wireframes, concept sketches, user flows, prioritized design stories |
| `activity-make` | Make | Final design, prototyping | Mockups, prototypes, detailed specs, evaluative research |
| `activity-monitor` | Monitor | Measure outcomes | Analytics reports, usability benchmarks, adoption metrics |

### Additional Activity Types (Less Common)

| Label | When to Use |
|-------|-------------|
| `activity-enable` | Internal UXD team work (process improvements, documentation) |
| `activity-consult` | Emergent work from external teams (quick reviews, ad-hoc support) |

### Choosing the Right Activity Type

**Orient** - Ask yourself:
- Am I trying to understand a problem space?
- Am I documenting user journeys or pain points?
- Am I planning what work needs to be done?

**Explore** - Ask yourself:
- Am I generating ideas for solutions?
- Am I creating early concepts or wireframes?
- Am I evaluating different approaches?

**Make** - Ask yourself:
- Am I creating final, detailed designs?
- Am I building a testable prototype?
- Am I preparing specs for implementation?

**Monitor** - Ask yourself:
- Am I measuring how a shipped feature performs?
- Am I analyzing user behavior post-launch?
- Am I identifying UX debt from usage data?

---

## Story Point Estimation

Story points estimate effort, complexity, and risk. They help the team plan sprints effectively.

### Story Point Scale

| Points | Definition | Effort & Complexity | Examples |
|--------|------------|---------------------|----------|
| **1** | Extremely straightforward task | Very low effort, no risk | Update spacing, fix a typo, export assets |
| **2** | Straightforward work, little risk | Low effort, clear solution | Tweak wireframes, create simple user flow |
| **3** | Can be time consuming but not complex | Moderate effort, low risk | Draft a new screen, update a pattern, prepare for review |
| **5** | Requires investigation and collaboration | High effort or moderate complexity | Create new UX flow, conduct user interviews and synthesize |
| **8** | Big task requiring investigation and discussion | Large, complex, or unclear. High risk | Full pattern definition, multi-feature research |
| **13** | Too big - split it up | Not sprint-sized | Break down before pointing |

### Guidelines

- **1-3 points**: Can be done independently with minimal collaboration
- **5 points**: Needs discussion, may involve multiple stakeholders
- **8 points**: Consider breaking down; high uncertainty
- **13 points**: Always break down into smaller stories

### PTO/Holiday Adjustments

When estimating sprint capacity:

| Missed Days | Adjustment |
|-------------|------------|
| Half day | -2 points |
| 1 day | -3 points |
| 2-3 days | -5 points |
| 4-6 days | -8 points |
| Full sprint (3 weeks) | -20 points |

### Typical Story Points by Activity Type

| Activity | Typical Range | Notes |
|----------|---------------|-------|
| Orient | 2-5 pts | Research and documentation takes time |
| Explore | 3-5 pts | Ideation can vary widely |
| Make | 3-8 pts | Detailed design work, depends on scope |
| Monitor | 2-3 pts | Usually focused analysis |

---

## Sprint Assignment

Stories should be assigned to sprints based on:

1. **Dependencies** - Stories that depend on others go in later sprints
2. **Activity progression** - Orient → Explore → Make → Monitor
3. **Team capacity** - ~20 story points per designer per sprint

### Typical Sprint Flow

**Sprint N (Early):**
- Orient stories (understand the problem)
- Begin Explore stories (start ideation)

**Sprint N+1 (Middle):**
- Complete Explore stories
- Begin Make stories (detailed design)

**Sprint N+2 (Later):**
- Complete Make stories
- Technical reviews
- Stakeholder sign-off

---

## Stakeholder Naming

When listing stakeholders in Epics, use this format:

```
h3. Stakeholders
* PM: [Full Name], [Full Name]
* Eng: [Full Name], [Full Name]
* UX: [Full Name], [Full Name]
```

Common RHOAI UX stakeholders to consider:
- Product Managers (PM)
- Engineering leads (Eng)
- Other UX designers (UX)
- Architects
- Documentation team
- Accessibility specialists

---

## Definition of Done Checklist

### For All Stories
- [ ] Final outcome shared with UXD team for review
- [ ] Final outcome shared with PM and Engineering
- [ ] Follow-up tasks created in parent Epic if needed

### For Design/Ideation Stories (add these)
- [ ] Link to final designs included in Jira comment
- [ ] Stakeholders mentioned on final designs
- [ ] Updates shared with all stakeholders

### For Design (Make) Stories (add these)
- [ ] Technical review completed
- [ ] Microcopy included in designs

### For Epics
- [ ] All child stories closed or moved to follow-up Epic
- [ ] Link to follow-up Epic added if applicable
