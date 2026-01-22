# Claude Commands for UX Designers

This folder contains custom commands that make it easier to work with Claude in this prototype. Think of these as shortcuts for common design tasks.

## 📁 What's in Here

```
.claude/
├── CLAUDE.md                     # Tells Claude how to work with designers
├── README.md                     # This file
├── workflows/                    # How Claude understands the design process
│   ├── primary-workflow.md       # Main prototyping workflow
│   ├── design-guidelines.md      # PatternFly & accessibility standards
│   ├── event-tracking-guide.md   # Event tracking planning guide
│   └── create-team-report.md     # Generate daily Slack discussion summaries
├── commands/                          # Custom commands you can use
│   ├── review-design.md               # Get comprehensive design feedback
│   └── check-patternfly-compliance.md # Verify PatternFly usage
└── skills/                            # Specialized capabilities
    ├── resolve-conflicts/             # Git merge conflict resolution
    └── create-jira-stories/           # Bulk create Jira Epics & Stories
```

## 🎯 How This Works

You're a designer. Claude is your implementation partner. You describe what you want, Claude figures out how to build it.

**You don't need to know how to code.** Just describe design changes in your own words:
- "Make this button more prominent"
- "Add a filter dropdown to this table"
- "The spacing looks too tight here"
- "Can we use a card layout instead?"

Claude will translate your design intent into working code.

## 🛠️ Workflows and Commands

### Workflows

#### Event Tracking Guide (`@workflows/event-tracking-guide.md`)
Get guided help planning event tracking for your designs. This workflow walks you through identifying what user interactions to track, defining events, and preparing handoff documentation.

**When to use**: When your PM has confirmed that analytics are important for a feature and you're ready to plan event tracking.

**Example**:
```
@workflows/event-tracking-guide.md
```

**What you'll get**: 
- Step-by-step guidance through the event tracking process
- Help identifying valuable events to track
- Properly formatted event definitions (trigger, name, description, properties)
- Documentation ready for handoff to engineering

---

#### Create Team Report (`@workflows/create-team-report.md`)
Generate weekly summary reports of team discussions from your Slack channels. This creates organized markdown files with concise summaries of conversations, decisions, and action items.

**When to use**: 
- End of week to create weekly digests
- After being away to catch up on discussions
- To create historical records of design decisions

**Example**:
```
@workflows/create-team-report.md
```

Or for a specific time period:
```
@workflows/create-team-report.md for the week of January 27-31, 2025
```

**What you'll get**: 
- Weekly summary files (format: `2025-01-31.md`) in `.design/team/reports/`
- Organized summaries by Slack channel
- Key discussions, decisions, and action items highlighted across the week
- An index file listing all generated reports

**Channels monitored**: Automatically reads channel list from `.design/team/team-context-sources.md`

---

### Skills

Skills are specialized capabilities for complex, multi-step tasks. Claude will use these automatically when relevant, or you can reference them directly.

#### Create Jira Stories (`@skills/create-jira-stories/SKILL.md`)
Bulk-create Jira Epics and Stories for RHOAI UX work with proper templates, labels, and organization.

**When to use**: When you have a planning document and need to create multiple Jira issues.

**Example**:
```
@skills/create-jira-stories/SKILL.md

Create Jira stories based on this planning document:
[paste your planning content or reference a file]
```

**What you'll get**:
- Summary of what will be created, then one "GO" to execute
- Epics and their Stories created together (Epic 1 + Stories, then Epic 2 + Stories, etc.)
- Automatic labeling (problem statements, activity types)
- Progress updates as each Epic group completes
- Final report with all Jira keys and manual steps needed

**Note**: Due to Jira API limitations, some manual steps are required after creation (converting Tasks to Epics, linking Stories to Epics, setting story points).

---

#### Resolve Conflicts (`@skills/resolve-conflicts/SKILL.md`)
Structured approach to resolving Git merge conflicts safely.

**When to use**: When you have merge conflicts and need help resolving them.

---

### Commands

When you need more than just implementing a change, use these commands to get design feedback:

#### 1. Review Design (`@review-design.md`)
Get a comprehensive design critique covering usability, visual design, accessibility, and PatternFly compliance.

**When to use**: Before sharing a prototype, or when you want a fresh perspective on your design.

**Example**:
```
@review-design.md src/app/Dashboard/Dashboard.tsx
```

**What you'll get**: Feedback on user experience, visual design, content, accessibility, and whether it follows PatternFly standards—all in one review.

---

#### 2. Check PatternFly Compliance (`@check-patternfly-compliance.md`)
Verify that a page follows the PatternFly design system correctly.

**When to use**: When you want to make sure your design is consistent with PatternFly standards.

**Example**:
```
@check-patternfly-compliance.md src/app/GenAIStudio/Playground/
```

**What you'll get**: Feedback on whether PatternFly components are used correctly, with suggestions for improvements.

---

## 💬 Working with Claude

### For Everyday Design Changes

Just describe what you want in natural language:

**Examples**:
```
"Add a new section to the dashboard showing recent activity"

"Can we make the navigation tabs more prominent?"

"Let's use a table instead of cards here"

"The heading needs to be larger and the spacing below it tighter"

"Add a button that opens a modal to create a new project"

"This page needs a filter bar at the top"
```

Claude will implement the changes directly. No need to use commands for this—just chat naturally.

### For Design Reviews and Planning

Use the commands and workflows when you want structured feedback or guided assistance:

```
@review-design.md src/app/Dashboard/Dashboard.tsx

@check-patternfly-compliance.md src/app/GenAIStudio/AgentBuilder/

@workflows/event-tracking-guide.md
```

## 📝 Design Language

When working with Claude, use design terms you're already familiar with:

✅ **Use Design Terms**:
- Component
- Layout
- Interaction
- Visual hierarchy
- Spacing
- Style
- Element

❌ **No Need for Technical Jargon**:
- React component
- DOM structure
- Event handler
- CSS
- Props
- State

Claude understands design language and will translate it into the appropriate technical implementation.

## 🎨 About This Prototype

This is a working UI prototype for Red Hat OpenShift AI, built with PatternFly (Red Hat's design system). Think of it as a high-fidelity mockup where you can:

- Quickly test design ideas
- Iterate on interactions
- Share working prototypes
- Validate concepts with users

**Key principles**:
- ✓ Use PatternFly components (they have accessibility built-in)
- ✓ Keep designs consistent with PatternFly standards
- ✗ Don't worry about the technical details—Claude handles that

## 🚀 Quick Start

1. **Make design changes**: Just describe what you want in natural language
2. **Get feedback**: Use `@review-design.md` when you want a design critique
3. **Verify consistency**: Use `@check-patternfly-compliance.md` to ensure PatternFly compliance
4. **Plan event tracking**: Use `@workflows/event-tracking-guide.md` for guided help with analytics planning
5. **Generate team summaries**: Use `@workflows/create-team-report.md` to create weekly digests of Slack discussions
6. **Create Jira stories**: Use `@skills/create-jira-stories/SKILL.md` to bulk-create Epics and Stories from a planning doc

## 💡 Tips

- **Be specific about location**: "On the dashboard page..." or "In the settings area..."
- **Describe the outcome**: "Make this more prominent" or "Add a filter here"
- **Ask questions**: "What PatternFly component should I use for this?"
- **Iterate**: Try something, see how it looks, refine it
- **Get feedback**: Use the commands to catch issues early

## 🆘 Need Help?

Just ask Claude! Some examples:

- "What's the best PatternFly component for showing a list of items?"
- "How should I make this page accessible?"
- "Can you review this page for design issues?"
- "What's the PatternFly way to do this?"

Claude is here to help you prototype designs without worrying about the technical implementation details.
