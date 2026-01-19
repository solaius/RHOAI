# Jira API Constraints & Workarounds

This document captures known limitations of the Jira MCP server when creating issues for RHOAIUX, along with tested workarounds.

---

## RHOAIUX Project Specifics

### Valid Priority Values

The RHOAIUX project does **not** accept the default "Medium" priority. 

**Use:** `priority: "Undefined"`

If you don't specify a priority, the MCP tool defaults to "Medium" which will fail.

### Valid Issue Types

Available issue types for RHOAIUX:
- `Bug`
- `Initiative`
- `Spike`
- `Risk`
- `Outcome`
- `Epic`
- `Story`
- `Task`
- `Sub-task`

---

## Epic Creation Limitations

### The Problem

Creating Epics via the Jira API requires a custom field called **"Epic Name"** (`customfield_12311141`). The Jira MCP server's `create_issue` tool does not support setting custom fields.

**Error message:**
```
"errors": {"customfield_12311141": "Epic Name is required."}
```

### The Workaround

1. **Create as Task instead of Epic**
2. **User manually converts** the Task to Epic in the Jira UI
3. **During conversion**, user sets the Epic Name field

**Example:**
```
Issue Type: Task  (not Epic)
Priority: Undefined
Summary: [RHOAIUX] API Key Management UX
Description: [Epic template content]
```

Add a note at the end of the description:
```
---
*Convert this Task to Epic after creation. Epic Name: API Key Management UX*
```

---

## Story-to-Epic Linking Limitations

### The Problem

The `create_issue` tool does not have a parameter to set the parent Epic when creating Stories.

### The Workaround

1. **Include parent Epic reference in Story description**
2. **User bulk-edits** Stories after creation to set Epic Link
3. **Provide JQL query** in final report for easy bulk selection

**Description footer format:**
```
---
*Parent Epic: RHOAIUX-1581 (MaaS Subscription Model IA & Quota UX)*
*Activity Type: Orient | Story Points: 3 | Sprint: 33*
```

**JQL for bulk editing:**
```
key in (RHOAIUX-1586, RHOAIUX-1587, RHOAIUX-1588)
```

---

## Story Points Limitations

### The Problem

The `create_issue` tool does not support setting the Story Points field.

### The Workaround

1. **Include story points in Story description**
2. **User bulk-edits** after creation to set Story Points field

**Description format:**
```
*Activity Type: Make | Story Points: 5 | Sprint: 34*
```

---

## Sprint Assignment Limitations

### The Problem

The `create_issue` tool does not support assigning issues to sprints.

### The Workaround

1. **Include sprint in Story description**
2. **User assigns to sprint** via Jira backlog or board view

---

## Label Capabilities

### What Works

The `add_issue_labels` tool works correctly:

```
Tool: add_issue_labels
Parameters:
  - issue_key: "RHOAIUX-1581"
  - labels: ["problem-statement-data-driven"]
```

**Note:** Labels must be passed as a JSON array.

### Best Practice

Add labels immediately after creating each issue to ensure they're not forgotten.

---

## Assignee Limitations

### The Problem

While the `create_issue` tool has an `assignee` parameter, you need the user's Jira account ID, not their name.

### The Workaround

1. **Don't set assignee during creation**
2. **User assigns** via Jira UI
3. Or use `search_users` to find account ID first, then `assign_issue`

---

## Rate Limiting

The Jira API has rate limits. When creating many issues:

1. **Create issues sequentially**, not in parallel
2. **Add labels in parallel** (less load than issue creation)
3. **Pause if you see rate limit errors** (Retry-After header)

---

## MCP Tool Reference

### Available Tools for Issue Creation

| Tool | Use For |
|------|---------|
| `create_issue` | Create new issues (Epic, Story, Task, etc.) |
| `add_issue_labels` | Add labels to existing issues |
| `update_issue` | Update summary, description, assignee, priority |
| `get_project_issue_types` | Check valid issue types for a project |
| `search_issues` | Find existing issues, check valid field values |

### create_issue Parameters

| Parameter | Required | Notes |
|-----------|----------|-------|
| `project_key` | Yes | e.g., "RHOAIUX" |
| `summary` | Yes | Issue title |
| `description` | No | Jira wiki markup format |
| `issue_type` | No | Default: "Task". Use "Story" for stories |
| `priority` | No | Default: "Medium". Use "Undefined" for RHOAIUX |
| `assignee` | No | Jira account ID (not name) |

---

## Recommended Creation Order

1. **Create Epics first** (as Tasks)
2. **Add Epic labels** immediately after each
3. **Report Epic keys** to user
4. **Create Stories** in batches by Epic
5. **Add Story labels** in parallel after each batch
6. **Provide final report** with:
   - All Jira keys
   - Manual steps required
   - JQL queries for bulk operations

---

## Manual Steps Summary

After automated creation, user needs to:

1. **Convert Tasks to Epics** (Issue Actions → Convert to Epic)
2. **Set Epic Name** during conversion
3. **Link Stories to Epics** (bulk edit with Epic Link field)
4. **Set Story Points** (bulk edit or individual)
5. **Assign to Sprints** (drag to sprint in backlog view)
6. **Assign to designers** (if not done during creation)

---

## Error Handling

### Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `"priority": "This priority is not available"` | Invalid priority for project | Use "Undefined" |
| `"Epic Name is required"` | Creating Epic without custom field | Create as Task instead |
| `400 Bad Request` | Invalid field value | Check valid values with search_issues |
| `Rate limit exceeded` | Too many API calls | Wait and retry |

### When Errors Occur

1. **Stop immediately** - don't continue with remaining items
2. **Report the error** to user with full details
3. **Suggest workaround** from this document
4. **Wait for user confirmation** before continuing
