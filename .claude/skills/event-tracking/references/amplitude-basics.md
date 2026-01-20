# Basics about Amplitude

## Amplitude 101

### What is Amplitude?

Think of Amplitude as a powerful microscope for your website or app. Instead of just counting visitors, it focuses on tracking every specific action a user takes, which are called "events." These events could be anything from clicking a button, playing a video, to making a purchase.

By tracking these actions, Amplitude allows you to build a detailed story of how people actually use your product. You can see the paths they take, where they get stuck in a process (like checking out), and which features they use the most.

The real value of Amplitude is that it helps us make smart, data-driven decisions instead of just guessing. By understanding user behavior, we can pinpoint exactly what's working and what's not. This allows us to improve your product, fix frustrating user experiences, and focus on building features our users actually want.

---

## Key Concepts

### Start with Your KPIs (and your business/design questions)

Before tracking anything, define what you want to learn. Make sure to track your business and design questions that you (and your stakeholders) have related to the UI and any KPI metrics that can be associated with it. Track these in the metrics repo.

### Event-Based, Not Page-Based

Amplitude's core is tracking events, which are specific actions a user takes (like Button Clicked or Video Played). Think of it as tracking verbs, not just nouns (pages). We automatically get page views.

---

## Events, Event Properties, and User Properties

### Event Name

Always follow a consistent naming convention for event names. Use **Component-Object-Action** format:

- Example: "Playground (component) Query (object) Submitted (action)"
- Use past tense for completed actions
- Use Title Case

### Event Description

What causes this event to happen? What is it measuring? Describe the specific user interaction in the UI (event):
- Is it a button click?
- A page load?
- The amount of times a form is submitted?

### Event/User Property

Context about that specific action. These can either be:

- **Event properties**: Tied to the event (e.g., the location of where the model is deployed, noted as the "modelLocation" property)
- **User properties**: Traits of the user themselves (e.g., the device the user is using, noted as the "deviceType" property)

**Format**: camelCase or snake_case is preferred. You do not need to specify the type of property.

---

## Common Properties for Button Click Events

When tracking button click events (the most relevant type of event), the most common properties are:

### Outcome Property
Whether the action was clicked/cancelled. These are 'finalized' states.
- Values: `'submit'` | `'cancel'`

### Success Property
Whether the action completed successfully after clicking.
- Values: `true` | `false`

### Error Property
Whether a user received an error when trying to complete the action. A sub-property can track what the error was.
- Values: `<error message>`

**Example - Empty State Tracking**:
If you want to track whether the user receives an empty state, use success and error properties:
- `success: true` = search result was found
- `success: false, error: 'no_results'` = no results found (empty state)

### Other Property Patterns

- **Boolean checks**: `isRAG = true/false` (check if something is enabled)
- **Count**: `countOfMCP = <number>` (check the number of something)

### Limitation Note

Event tracking may not reliably capture success states if the user isn't in the app when an action completes. Long or background processes can finish without triggering a success event, so designers should consider this when defining success metrics.

---

## What is Built into Amplitude (Automatic Tracking)

The Amplitude SDK automatically captures some useful events and properties out of the box:

### Page Views
Tracks which screens or pages a user views. You can access data about page views in the "Page Viewed" event and add a "url" filter that "contains" a specific title.
- Example: Search for a url that contains "registry" to see Page Views for anything related to the Registry.

### Sessions
Automatically tracks the start and end of a user session. A session typically ends after 30 minutes of inactivity.

### Device Info
Collects user properties like Device Type and OS.

### Customer IDs
All tracked events automatically include customer IDs that allow segmentation by adoption, organization, and user counts in Amplitude.

---

## Funnels

Funnels are a perfect use case for UX. You can set up a sequence of events you expect a user to take to see where users are dropping off in the process.

**Example Funnel**:
1. Sign Up Page Viewed
2. Form Filled
3. Account Created

This visualization shows exactly where users abandon the process. Useful for jobs-to-be-done kinds of KPIs and business/design questions.

---

## Best Practices

### Use Descriptions

Amplitude allows you to add descriptions to events and properties directly in the UI. We need to use this feature! A year from now, no one will remember what `DEPRECATED_btn_clk_v2` was supposed to mean.

**Important**: To each event that you enter into the metrics repo, make sure to add an event description to it.

### Event Totals vs. Unique Totals

This is a fundamental concept for analysis. Be clear about which you want to track:

| Metric | Definition | Example |
|--------|------------|---------|
| **Event Totals** | Total number of times an event was performed | A single user clicks a button 10 times = 10 Event Totals |
| **Unique Totals** | Number of unique users who performed an event at least once | That same user who clicked 10 times = 1 Unique |

**Note**: Designers are often more interested in Uniques to understand reach.

---

## Naming Convention Quick Reference

| Element | Format | Example |
|---------|--------|---------|
| Event Name | Component Object Action (Title Case, Past Tense) | `Playground Query Submitted` |
| Event Property | camelCase or snake_case | `selectedModel`, `is_rag_enabled` |
| User Property | camelCase or snake_case | `roleType`, `device_type` |

---

## Property Value Patterns

| Pattern | Format | Example |
|---------|--------|---------|
| Boolean | `propertyName: true/false` | `isRAG: true` |
| Count | `propertyName: <number>` | `countOfMCP: 3` |
| Outcome | `outcome: 'submit' \| 'cancel'` | `outcome: 'submit'` |
| Success | `success: true/false` | `success: true` |
| Error | `error: <message>` | `error: 'validation_failed'` |
| Selection | `selectedItem: <value>` | `selectedModel: 'llama-3'` |
