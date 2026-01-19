# Jira Templates for RHOAI UX Work

These templates follow RHOAI UXD team standards. Use Jira wiki markup format (h3. for headings, * for bullets).

---

## Epic Template

Use this template for Epic descriptions. Customize sections based on the specific work.

```
_Note: This Epic was primarily drafted by AI (Claude) and reviewed by UXD. There may be inaccuracies that require validation._

h3. Problem statement
[Choose one of these formats based on the problem-statement label:]

*Data-driven format (problem-statement-data-driven):*
[Target User] struggles with [specific issue]. Data from [source, e.g., analytics, research] shows [specific metrics]. This impacts [user goal/business goal].

*Assumption-based format (problem-statement-assumption):*
We assume that [target user] experiences [specific issue] due to [reason]. This assumption is based on [source, e.g., limited feedback, prior knowledge].

h3. Objective
[Summarize the purpose of this work: what will be delivered and why it's valuable. This should describe the expected result of completing this work and its impact. Provide links to related resources.]

h3. Job stories
* When I am a [user role], I want to [action/capability] so that [benefit/outcome].
* When I am a [user role], I want to [action/capability] so that [benefit/outcome].

h3. Stakeholders
* PM: [Name(s)]
* Eng: [Name(s)]
* UX: [Name(s)]

h3. Definition of Done
* Final outcome of this epic has been reviewed by stakeholders
* A link to final designs is included in a comment on this epic and necessary stakeholders have been mentioned.
* Any updates made during review have been shared with all stakeholders so that stakeholders are aware of final changes.
* [For design tasks] A technical review has been completed.
* [For design tasks] Microcopy has been included in the final designs.
* All children tasks or stories in this epic have been closed or moved to a follow-up epic.
* [Add any Epic-specific criteria]
```

### Epic Template - Minimal Version

For simpler Epics or when details will be filled in later:

```
h3. Objective
[Brief description of what this Epic will deliver]

h3. Stakeholders
* PM: [Name]
* Eng: [Name]
* UX: [Name]

h3. Definition of Done
* Final outcome has been reviewed by stakeholders
* All children stories have been closed or moved to follow-up epic
```

---

## Story Template

Use this template for Story descriptions. Customize based on the activity type (Orient, Explore, Make, Monitor).

```
_Note: This Story was primarily drafted by AI (Claude) and reviewed by UXD. There may be inaccuracies that require validation._

h3. Objective
[Summarize the purpose of this work: what will be delivered and why it's valuable.]

h3. How
* [Key activity or deliverable 1]
* [Key activity or deliverable 2]
* [Key activity or deliverable 3]
* [Link to related Figma files, docs, or reference materials if applicable]

h3. Definition of Done
* Final outcome of this Jira has been shared for review by other UXD team members first, followed by PM and Engineering.
* [For design/ideation] A link to final designs is included in a comment on this Jira and necessary stakeholders have been mentioned.
* [For design/ideation] Any updates made during review have been shared with all stakeholders.
* [For design tasks] A technical review has been completed.
* [For design tasks] Microcopy has been included in the final designs.
* [Add any Story-specific criteria]

---
*Parent Epic: RHOAIUX-XXXX (Epic Title)*
*Activity Type: [Orient/Explore/Make/Monitor] | Story Points: [N] | Sprint: [N]*
*Dependencies: [Story X.Y (brief description) OR None]*
```

### Story Template by Activity Type

#### Orient Stories
Focus on understanding and planning. Typical outputs: journey maps, research findings, documented opportunities.

```
h3. Objective
[Understand/document/analyze specific aspect of user experience or problem space]

h3. How
* Review [existing materials/research/documentation]
* Meet with [stakeholders] to [understand/validate/align on X]
* Document [findings/patterns/recommendations]
* Create [artifact: journey map, analysis doc, etc.]

h3. Definition of Done
* Final outcome has been shared with UXD team, then PM and Engineering
* [Specific artifact] created and shared
* Key findings documented
* Recommendations provided for next steps
```

#### Explore Stories
Focus on ideation and initial design. Typical outputs: concepts, wireframes, explorations.

```
h3. Objective
[Explore potential solutions for specific design challenge]

h3. How
* Review [existing patterns/research/requirements]
* Create [concept sketches/wireframes/explorations]
* Document pros/cons of different approaches
* Gather feedback from [stakeholders]

h3. Definition of Done
* Exploration concepts created and documented
* Pros/cons of approaches documented
* Stakeholder feedback gathered
* Recommendation made for direction
```

#### Make Stories
Focus on final design and prototyping. Typical outputs: mockups, specs, prototypes.

```
h3. Objective
[Design specific UI/feature/flow]

h3. How
* Design [specific screens/components/flows] with:
  * [Detail 1]
  * [Detail 2]
  * [Detail 3]
* Include [validation states/error handling/edge cases]
* Create prototype in [Figma/code prototype]

h3. Definition of Done
* Final mockups created
* Technical review completed
* Microcopy included
* Designs shared with stakeholders
```

#### Monitor Stories
Focus on measuring outcomes. Typical outputs: analytics reports, usability findings, metrics.

```
h3. Objective
[Measure/evaluate specific aspect of shipped feature]

h3. How
* Define success metrics for [feature]
* Set up tracking for [metrics]
* Analyze [data source] for [time period]
* Document findings and recommendations

h3. Definition of Done
* Metrics defined and documented
* Data collected and analyzed
* Findings shared with stakeholders
* Recommendations for improvements provided
```

---

## Metadata Footer Format

Always include this footer at the end of Story descriptions:

```
---
*Parent Epic: RHOAIUX-XXXX (Epic Title)*
*Activity Type: [Orient/Explore/Make/Monitor] | Story Points: [1/2/3/5/8] | Sprint: [N]*
*Dependencies: [Story X.Y (brief description) OR None]*
```

---

## AI Disclaimer

When content is AI-drafted, include this at the top of the description:

```
_Note: This [Epic/Story] was primarily drafted by AI (Claude) and reviewed by UXD. There may be inaccuracies that require validation._
```

---

## Summary Format for Jira

Epic summaries should follow this format:
```
[Feature/Area Name]
```

Story summaries should be action-oriented:
```
[Design/Create/Explore/Review] [specific deliverable]
```

Examples:
- `API Key Management UX` (Epic)
- `Design API Key list view with enhanced columns` (Story)
- `Explore combined Models list differentiating project vs. MaaS models` (Story)
- `Review Perses-based metrics implementation` (Story)
