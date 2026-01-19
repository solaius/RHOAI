---
name: create-jira-stories
description: Use this skill when the user wants to create Jira Epics and Stories for RHOAI UX work. This skill provides a structured workflow for bulk-creating Jira issues with proper templates, labels, and organization. It requires user confirmation before starting, then executes the full plan.
---

# Creating RHOAI UX Jira Epics and Stories

This skill helps you create well-structured Jira Epics and Stories for Red Hat OpenShift AI (RHOAI) UX design work. It follows UXD team standards for problem statements, activity types, and story point estimation.

## When to Use This Skill

- Creating Epics and Stories for a new feature or initiative
- Bulk-creating multiple Stories from a planning document
- Ensuring Jira issues follow RHOAI UXD standards and templates

## Core Principles

1. **Review First, Execute Fast**: Summarize the plan, get one confirmation, then execute
2. **Epic + Stories Together**: Create each Epic with its Stories before moving to the next
3. **Proper Labeling**: Apply activity type and problem statement labels automatically
4. **Template Compliance**: Use standard RHOAI UXD templates for descriptions
5. **Clear Reporting**: Provide progress updates and final summary

## Workflow

### Phase 1: Discovery & Summary

Before creating anything, gather information and present the plan:

1. **Identify the source** - Ask the user for:
   - A planning document or description of what needs to be created
   - The Jira project key (usually `RHOAIUX`)

2. **Analyze and present summary**:
   ```
   ## Creation Plan Summary
   
   | Metric | Count |
   |--------|-------|
   | Total Epics | X |
   | Total Stories | Y |
   | Total Story Points | Z |
   
   ### Epic 1: [Title]
   - Story 1.1: [Summary] (X pts, Activity)
   - Story 1.2: [Summary] (X pts, Activity)
   
   ### Epic 2: [Title]
   - Story 2.1: [Summary] (X pts, Activity)
   ...
   
   **Say "GO" to create all items, or ask for changes.**
   ```

3. **Wait for single "GO"** - One confirmation starts the entire creation process

### Phase 2: Execute Plan (Epic + Stories Together)

After user confirms, execute the full plan without further prompts:

**For each Epic:**

1. **Create the Epic** (as Task due to API limitations):
   ```
   Project: RHOAIUX
   Issue Type: Task
   Priority: Undefined
   Summary: [RHOAIUX] Epic Title
   Description: [Epic template with note to convert to Epic]
   ```

2. **Add Epic label** immediately:
   - `problem-statement-data-driven` OR
   - `problem-statement-assumption` OR
   - `problem-statement-undefined`

3. **Create all Stories for this Epic**:
   ```
   Issue Type: Story
   Priority: Undefined
   Summary: [RHOAIUX] Story Title
   Description: [Story template with parent Epic reference]
   ```

4. **Add Story labels** (can batch these):
   - `activity-orient` / `activity-explore` / `activity-make` / `activity-monitor`

5. **Report progress** briefly:
   ```
   ✅ Epic 1: RHOAIUX-1581 (MaaS Subscription Model IA & Quota UX)
      - Story 1.1: RHOAIUX-1586
      - Story 1.2: RHOAIUX-1587
      - Story 1.3: RHOAIUX-1588
   ```

6. **Move to next Epic** and repeat

### Phase 3: Final Report

After all items created, provide complete summary:

```
## ✅ Creation Complete

| Metric | Count |
|--------|-------|
| Epics Created | X |
| Stories Created | Y |
| Failed Items | 0 |

### All Created Issues

#### Epic 1: RHOAIUX-XXXX - [Title]
| Story | Key | Summary | Points | Activity |
|-------|-----|---------|--------|----------|
| 1.1 | RHOAIUX-XXXX | ... | 3 | Orient |
...

### Manual Steps Required
1. Convert Tasks to Epics (set Epic Name)
2. Link Stories to parent Epics
3. Set Story Points
4. Assign to Sprints

### JQL Queries
**All created issues:**
key in (RHOAIUX-XXXX, RHOAIUX-XXXX, ...)
```

## Error Handling

If an issue creation fails during execution:

1. **Report the error** immediately
2. **Show what was created** so far
3. **Ask user**: "Continue with remaining items, or stop?"
4. **If continuing**, skip the failed item and proceed

## API Constraints & Workarounds

See `references/api-constraints.md` for details.

**Quick reference for RHOAIUX:**

| Constraint | Workaround |
|------------|------------|
| Epic requires "Epic Name" field | Create as Task, user converts manually |
| Priority "Medium" invalid | Always use `priority: "Undefined"` |
| Cannot set parent Epic | Include Epic reference in Story description |
| Cannot set story points | Include in Story description footer |

## Templates

See `references/templates.md` for Epic and Story description templates.

## Labels Guide

See `references/guides.md` for:
- Problem statement labels
- Activity type labels  
- Story point scale

## Example Session

**User**: "Create Jira stories based on my API Key planning doc"

**Claude** (Phase 1):
```
## Creation Plan Summary

| Metric | Count |
|--------|-------|
| Epics | 1 |
| Stories | 5 |
| Total Points | 18 |

### Epic 1: API Key Management UX
Label: problem-statement-data-driven

| Story | Summary | Points | Activity |
|-------|---------|--------|----------|
| 1.1 | Design API Key list view | 3 | Make |
| 1.2 | Design API Key creation flow | 5 | Make |
| 1.3 | Design API Key detail view | 3 | Make |
| 1.4 | Design admin revocation flow | 3 | Make |
| 1.5 | Explore disable/enable patterns | 4 | Explore |

**Say "GO" to create all 6 items.**
```

**User**: "GO"

**Claude** (Phase 2 - executes without further prompts):
```
Creating Epic 1 + Stories...

✅ Epic 1: RHOAIUX-1600 (API Key Management UX)
   - Story 1.1: RHOAIUX-1601 ✓
   - Story 1.2: RHOAIUX-1602 ✓
   - Story 1.3: RHOAIUX-1603 ✓
   - Story 1.4: RHOAIUX-1604 ✓
   - Story 1.5: RHOAIUX-1605 ✓
```

**Claude** (Phase 3):
```
## ✅ Creation Complete

All 6 items created successfully.
[Full summary table and manual steps...]
```

## Tips for Efficiency

1. **Batch API calls** where possible (e.g., add multiple labels in parallel)
2. **Report progress** after each Epic + Stories group
3. **Include AI disclaimer** in descriptions when AI-drafted
4. **Provide JQL queries** for bulk editing in final report

## Execution Order

```
Epic 1
  └─ Story 1.1, 1.2, 1.3...
Epic 2
  └─ Story 2.1, 2.2, 2.3...
Epic 3
  └─ Story 3.1, 3.2...
...
Final Report
```

This keeps related items together and makes progress easy to track.
