# Event Tracking Process - A Designer's Guide

**Document status**: Published
**Document type**: Process
**Created**: Oct 13, 2025
**Last updated**: Jan 20, 2026
**Authors**: Rachel Lombard
**Contributors**: Jenn Giardino, Yahav Manor, Yingzhao Zhou, Heiko Rupp

---

## About

This doc is to act as a guide for the RHAI UX design team for the event tracking process, outlining what event tracking is, why we are using it, and how to include this process during our design work.

This work should begin when the PM confirms that the feature's designs are important to capture analytics on.

---

## Table of Contents

- [Job Stories](#job-stories)
- [What and Why](#what-is-event-tracking-and-why-use-it)
- [How](#how-to-do-the-event-tracking-process)
- [RACI Chart](#raci-chart)
- [Step 1: Planning and Definition](#step-1-planning-and-definition)
- [Step 2: Define Events](#step-2-define-events)
- [Step 3: Review Events List](#step-3-review-events-list)
- [Step 4: Documentation](#step-4-documentation)
- [Step 5: After the Hand Off](#step-5-after-the-hand-off)
- [Step 6: Next Steps](#step-6-next-steps)
- [Jira Information](#jira-information)
- [Know-how Resources](#know-how-resources)

---

## Job Stories

- **Design for Tracking**: Ensure key interactions are tracked in new features to assess intuitiveness.

- **Collaborate with Stakeholders**: Define the problem/question and KPIs, outline key interactions (events) to be tracked, create a UI example with the UI components and interactions, review and prioritize events list with a timeline.

- **Handoff to Engineering**: Hand off documentation for development, highlighting details to be captured for each event, event name and properties.

- **Document Events**: Use the RH AI events and metrics repository as a single source of truth for clear, consistent, and accessible event details.

- **Update Repository**: After handoff, update the event status in the repository based on implementation.

- **Stay Informed about Analytics**: Connect data insights to design decisions and identify opportunities for iteration.

---

## What is Event Tracking and Why Use It

- Event tracking helps us understand what users actually do. By tracking actions like clicks and scrolls, and visualizing them in tools like Amplitude, we can make smarter, faster decisions based on real logical data, instead of just guessing (ad hoc analysis). This builds a strong foundation for creating better products that truly meet user needs.

- We track events in a tool called Amplitude which allows us to visualize the information we want to know about. This can be done through charts, funnels (sequence of steps) etc. For information on what we currently track, refer to the 'live' pages in the RH AI events and metrics repository.

### 1. Seeing the Invisible Pain Points

By tracking events, we gain visibility into critical user journeys. For instance, tracking the paths users took after clicking the "deploy" button on a form provided direct insights into user preferences. For UX designers, funnels are the perfect tool to visualize drop-off, showing exactly where users abandon a process, such as during onboarding.

### 2. Focusing on Goals First

We prioritize clear business questions to guide our event tracking, ensuring data collection drives value. High-level goals are translated into KPI metrics using frameworks like HEART, which then map to specific events, preventing "vanity metrics" and instead focusing on strategic objectives.

### 3. Building Trustworthy Data

To build trustworthy data, we need standardized processes for defining and capturing events. This ensures consistency, accuracy, and comparability across all analyses, creating a reliable dataset that directly informs product investment decisions.

---

## How to Do the Event Tracking Process

The steps below are to provide guidance on the designer's role and responsibilities during the event tracking process.

### RACI Chart

See the RACI chart which outlines who should be Responsible, Accountable, Consulted and Informed during each step described below.

---

## Step 1: Planning and Definition

### 1. Determine meeting readiness

The initial meeting should begin when the PM has identified and confirmed that the designs are important to capture analytics on, and the designer/PM knows enough about the final solution to the designs to identify details like specific UI elements and event properties.

**Note**: Before the point above, designers can initiate and propose relevant designs/features that may require analytics. This conversation should be had with the PM and research, once agreed, the initial meeting process outlined above is the first step.

### 2. Create a meeting with relevant stakeholders (Eng, PM, UX, Research)

When the designer is ready to discuss KPIs and event tracking, stakeholders who have already been working on the designs from engineering, PM, and design are important to include in the meeting. Additionally, the research team is essential in this conversation and will need to be added too.

### 3. Identify the problem/question and KPIs with stakeholders

In the first meeting, define the problem to solve and what you want to learn. Create the business/design question.

**Frame the business/design question as a user story or a question. See examples below:**

- **Design questions** help frame how the technology should be built or experienced. They are tied to user behaviour, experience, interface, or system usability.
  - Example: "Which filters do users engage with most often, and how can we use that insight to simplify or prioritize our filter design?"

- **Business questions** help frame how data, technology, or user behaviour connects to business outcomes such as revenue, growth, efficiency, or customer satisfaction.
  - Example: "Which filters are most commonly used by users, and what do those usage patterns reveal about the key business metrics we should optimize for?"

### (Nice-to-have) Define KPIs

Define KPIs (key performance indicators), e.g. percentage rates of adoption. Relating a design/business question to a HEART metric is a nice-to-have and not essential. The research team will be able to group the question into a HEART metric if desired.

Research can help to formalize and group KPIs and metrics to help standardize them so that they align with KPIs from other feature areas we're tracking, which will allow Red Hat AI to eventually speak the same metrics language across the board.

**Note**: Adoption metrics are tracked at both project level (e.g., % of projects with playground enabled) and user level (e.g., % of users with access to a playground). Confirm with research on whether this needs to be handled with your task.

---

## Step 2: Define Events

### 1. Create a list of events with the associated data

**Review existing events**: Review the set of currently tracked events to confirm if any are already tracked. Current tracked events are outlined in the Live Events tab within the RH AI metrics repository.

**Create new events list**: Create a list of new events to track and of any existing events that require updates. Link back to the problem/question and KPIs already identified in Step 1.

In a document, include:
- Business/design question
- KPI metric
- Location in the UI
- UI component to track (highlighted in an example)
- Link to the artifact

### Handoff Examples

- Handoff example 1 - Miro board
- Handoff example 2 - Google doc
- Handoff example 3 - Figma

### Define the criteria for each event

Each event should follow the Amplitude format and include the details listed below:

#### Event Trigger
Provide a quick description of what causes the event to happen to make it clear to the team what exactly the user is doing.
- Example: "User clicks submit button in chatbot to send a query"

#### Event Name
Outline the specific user actions (events) that must be tracked within the UI. Use a clear consistent **Component-Object-Action** format.
- Example: "Playground (component) Query (object) Submitted (action)"
- Use Title Case and past tense for completed actions

#### Event Description
Mention what the event is measuring.
- Example: "Counts the number of chats submitted from the playground"

#### Properties
There are user and event properties which provide context about that specific action. You do not need to specify if a property is user or event related.

- Use camelCase or snake_case (preferred)
- **User property example**: "roleType" - to find out whether the person using the platform is an admin user or a regular user
- **Event property example**: "filterAppliedPage" - used to find out which page a filter was used

**Common property patterns**:
- Boolean: `isRAG = true/false`
- Count: `countOfMCP = count`
- Outcome: `outcome = 'submit' | 'cancel'`
- Success: `success = true/false`
- Error: `error = <error message>`

**Note**: A limitation is that event tracking may not reliably capture success states if the user isn't in the app when an action completes. Long or background processes can finish without triggering a success event, so designers should consider this if using success properties.

**Note for awareness**: All tracked events automatically include customer IDs that allow segmentation by adoption, organization, and user counts in Amplitude.

---

## Step 3: Review Events List

### 1. Follow up with PM and design to review

- Review the events with PM and design
- Prioritize the events list (must have, nice to have)
- Identify the target release date for implementation
- Confirm with the PM that event tracking is captured in the STRAT

---

## Step 4: Documentation

### 1. Hand off documentation for the engineering team

Events must be reviewed and agreed by PM and research stakeholders before handing off to development for implementation.

Essential criteria for handoff includes:
- Event trigger
- Event name
- Description
- Properties
- Business/design question
- KPI metric
- Location in the UI
- Example of the UI highlighting the component to track
- Links to artifacts

### 2. Document the data in the repository

Work in progress events need to be added to the RH AI metrics repository. Put these events in the 'WIP' events page of the repository.

There is a description page which includes the details of what you must add.

This sheet enables the team to easily view what is being tracked, why it is being tracked, and its current status.

---

## Step 5: After the Hand Off

### 1. Update the repository

- Access the PR that engineering updated with the events to see which ones were implemented
- Update the Status in the 'WIP' page from 'prioritized by PM' to 'Implemented by Eng'
- Make sure a link to the parent STRAT and implementation PR are included in the repo. This enables the research team to track which release the events are available in.
- If there are events that were not implemented because they will be in a future release, use the 'Future release' status
- If the events were de-prioritized indefinitely, delete it from the repo but keep a record of it somewhere

Members from the research team will be able to create a live events page, indicating that these events are now live in the product and are currently being tracked.

---

## Step 6: Next Steps

After implementation, the research team will be able to build dashboards in Amplitude and analyze the results to share with the team for possible further action. Based on the results, more informed decisions can be made and provide opportunities for growth and improvement.

---

## Jira Information

Examples of an event tracking epic and task are outlined below. Key information such as acceptance criteria and definition of done are shown. Additionally, link your Jira to the parent STRAT. Ensure there are engineering and research Jiras for implementing this work.

**Examples of UX Jiras:**
- Epic example - Gen AI
- Task example - Playground

---

## Know-how Resources

### [1] RH AI Metrics Repository
Repository that holds your tracking information defined in Step 1 and 2. It also gives guidance on what an event, trigger, property is in the description page. This sheet enables the team to easily view what is being tracked, why it is being tracked, and its current status.

### [2] Key Performance Indicators (KPI)
The HEART framework and others may be used to help create KPIs by the research/analytics team.

**HEART Metrics Categories:**
- **Happiness**: Users find the product helpful, fun and easy to use
- **Engagement**: Users enjoy the product and keep engaging with it
- **Adoption**: New users see the value in the product or new feature
- **Retention**: Users stay loyal to the product to get their job done
- **Task success**: Users complete their goal quickly and easily

### [3] RACI Chart
A responsibility assignment matrix that clarifies who is Responsible, Accountable, Consulted, and Informed throughout each task.

### [4] Basics about Amplitude
Provides the need to know about event tracking in Amplitude, this will help guide you in creating event names, what kind of events to track or info about page views.
