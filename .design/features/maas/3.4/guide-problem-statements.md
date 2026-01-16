# Best practices

# Problem Statements in UX: Best Practices and Templates

KR2: *“By the end of Q2 2025, UX designers will clearly articulate problem statements informed by data or acknowledge assumptions for 100% of designs in Jira.”*

---

## What is a Problem Statement?

A problem statement clearly defines the issue the design aims to address. It should:

* Be concise yet comprehensive.  
* Be informed by data or explicitly state assumptions.  
* Be actionable and measurable.  
* Align with users needs and business goals.

---

## Problem Statement Framework

A complete problem statement should be structured in a way that clearly explains the issue, why it matters, and how we know it’s a problem. Here is a framework to follow when writing problem statements:

1. Title or Problem Summary  
   Keep it concise and descriptive of the issue. 

   * Example (Usability Issue \- Existing Product):  
     “Users struggle to find the search bar on the homepage.”

   * Example (New Capability \- Feature Introduction):  
     “Administrators want to easily give asset access only to the right people in their organization.”

2. Context/Background  
   Briefly describe the situation, system, or environment where the problem occurs.

   * Example (Usability Issue \- Existing Product):  
     "Our homepage aims to encourage users to explore content quickly. However, user feedback and analytics reveal that the search functionality is often overlooked.”

   * Example (New Capability \- Feature Introduction):  
     “Administrators want to easily give asset access only to the right people in their organization.”

3. Problem Description  
   Clearly articulate the problem. 

   * Example (Usability Issue \- Existing Product):  
     "Users have difficulty locating the search bar due to its placement and lack of visual prominence, leading to decreased usage of the search feature and user frustration.”

   * Example (New Capability \- Feature Introduction):  
     “Customers lack a way to allocate asset access at a granular level, leading to security concerns and inefficiencies in managing permissions.”

4. Impact  
   Highlight the negative effects of the problem.

   * Example (Usability Issue \- Existing Product):  
     “This issue results in higher bounce rates, increased time-to-task, and reduced user satisfaction.”

   * Example (New Capability \- Feature Introduction):  
     “NPS is already decreasing for customers with large, committed spend deals facing complex reporting obligations. Customers experience delays in activation, security risks, and compliance issues due to inadequate access control.”

5. Evidence  
   Provide supporting data, user feedback, or observations.

   * Example (Usability Issue \- Existing Product):  
     “Heatmaps show low interaction in the search bar area. Surveys indicate that 60% of users did not notice the search bar on their first visit.”

   * Example (New Capability \- Feature Introduction):  
     “Architects, product managers, and industry experts consider granular access control a standard feature in modern SaaS platforms. (We could link to a value proposition slide deck or industry research here.)”

6. Goal/Objective  
   State what success looks like once the problem is resolved.

   * Example (Usability Issue \- Existing Product):  
     “Increase search bar visibility and usage by 30% within the next quarter.”

   * Example (New Capability \- Feature Introduction):  
     “Increase NPS by enabling administrators to allocate access only to intended users, monitor usage and costs, and ensure compliance with organizational policies.”

### How much context should be provided?

When working on a story or feature use case, the amount of context depends on the audience:

* For stakeholders and leadership: Provide a high-level overview with business impact (metrics, revenue, compliance, security risks).  
* For designers and engineers: Include user research, workflows, and constraints.  
* For customers (documentation): Focus on how the feature benefits them and solves pain points.

By ensuring the right level of detail, we can align stakeholders and make problem statements actionable across teams.

---

## Examples of Complete vs. Incomplete Problem Statements

#### Be clear and specific

| Complete | Incomplete |
| :---- | :---- |
|  "Red Hat OpenShift users struggle to find key account settings within the dashboard. Analytics show that 65% of users abandon the settings page without making changes. This impacts user satisfaction and increases support tickets by 20%." Why it works: Data-driven: Incorporates specific metrics. Identifies the user problem and its impact. Actionable for design exploration.  |  "Users don’t like the dashboard because it is confusing and hard to use." Why it fails: Lacks specificity, making it difficult to identify actionable improvements. Lacks data or defined user impact. Doesn’t inform actionable solutions.  |

#### 

#### State assumptions when data is unavailable

| Complete | Incomplete |
| :---- | :---- |
| "Users may find the navigation menu overwhelming due to the high number of options. This assumption is based on anecdotal feedback from three customer interviews." Why it works: Acknowledges assumptions. Identifies a clear problem for validation. Provides context for further research.  |  "The navigation menu is confusing and people don’t like the design." Why it fails: Provides no context or justification. Doesn’t guide the next steps.  |

#### Connect problem statements to user research

| Complete | Incomplete |
| :---- | :---- |
| "Users report difficulty tracking order statuses on the mobile app. Usability tests revealed a 40% error rate when interacting with the order history feature, leading to increased customer complaints." Why it works: Rooted in user research and usability testing. Highlights a specific user pain point. Links to measurable outcomes..  | "The app’s order tracking feature needs improvement because users don’t like it." Why it fails: Doesn’t reference user research. Lacks specific pain points or data.  |

---

## Do’s and Don’ts Checklist

| Do | Don’t |
| :---- | :---- |
| Use specific, measurable data when available. Acknowledge assumptions if data is unavailable. Reference user research or feedback. Clearly define the user impact and business relevance. Keep statements concise and focused. | Be vague or subjective. Ignore data or research findings. Use overly technical language that alienates stakeholders. *E.g.: “UI component misalignment caused by CSS grid inconsistency.” vs. “Users find the page confusing because elements are not aligned, making it harder to scan and complete tasks.”*  Present statements without context or relevance. |

---

## Keep in mind….

* Ensure problem statements are documented consistently across tools (Figma, Miro, Jira, Google Slides, etc). Focus specifically on the design assets you create and share out and note that **Jira** is a requirement.  
* Collaborate with PMs and engineers to validate and align on problem statements.  
* Share your problem statements early and often for feedback and validation.

# Templates

## Templates for Problem Statements

Using a structured template ensures consistency and clarity in problem statements across the UX team. 

### Data-Driven Problem Statement Template

Use this template when you have measurable data from sources such as analytics, usability tests, surveys, or customer support tickets. This template is ideal when there is clear evidence that supports the existence and impact of the problem.

| "\[Target User\] struggles with \[specific issue\]. Data from \[source, e.g., analytics, research\] shows \[specific metrics\]. This impacts \[user goal/business goal\]." |
| :---- |

### Assumption-Based Problem Statement Template

Use this when data is limited or unavailable. This is useful in early-stage explorations, when making hypotheses that require validation, or when working with anecdotal feedback.

| "We assume that \[target user\] experiences \[specific issue\] due to \[reason\]. This assumption is based on \[source, e.g., limited feedback, prior knowledge\]." |
| :---- |

### Problem Statements in Jira

A problem statement should be included in all Jira issues (stories and epics). For guidance on how to include a problem statement in Jira, see the [Jira usage guidelines]() in this document. 

### Adding problem statements to design deliverables

To make it easy for consumers of your design to understand the problem statement that you are working to solve, you should always restate the problem as part of your design document. 

#### Problem statements in Figma

The [UXD Figma template](https://www.figma.com/design/mH7dnTbctF40AeWoG1IPVE/Annotations-and-Covers?node-id=589-4001&t=la8m6zLutb6xdUeJ-1) includes standard cover slides that include a problem statement. 

#### Problem statements in Google Slides

Use the [UXD Design Share starter template](https://docs.google.com/presentation/d/1M2fBZnhdk1p34KXxIXVJ-BbxRQ5020reuSbbAoiRc98/copy) to create a Google Slides presentation for sharing your designs with stakeholders. This template utilizes unique slide layouts for presenting problem statements and annotated screen mockups.

#### Problem statements in Miro

You can add a problem statement to any Miro board by using the [UXD Cover Page](https://miro.com/app/board/uXjVIQ2bF_c=/?share_link_id=940174857207) template. This template allows you to include a UXD branded cover page within your Miro board. There are two versions of the cover page, one with a data-driven problem statement and another with an assumptive statement. Simply delete the one that does not apply and fill in the information requested within the cover page frame.

---

### Standard Practices for Using Problem Statement Templates

Using the right template helps ensure that problem statements are both appropriate for the stage of work and actionable for the team. Here are some guidelines to help you choose between the Data-Driven and Assumption-Based templates and apply them consistently.

#### When to Use a Data-Driven Problem Statement

Use this template when you have validated insights from any of the following sources:

* UX research (e.g., usability testing, surveys, interviews).  
* Product analytics or telemetry.  
* Customer feedback (e.g., support tickets, NPS responses).  
* Engineering metrics or performance data.

Best practices:

* Clearly cite the data source in the problem statement.  
* Include specific metrics or patterns that highlight the problem.  
* Use this type of statement to inform work that is ready for refinement, implementation, or stakeholder alignment.  
* Preferred for Epic-level work, feature design, and prioritization discussions.

#### When to Use an Assumption-Based Problem Statement

Use this template when data is limited, unavailable, or pending validation. These are especially useful in:

* Early exploration or discovery phases.  
* Hypothesis-driven design or strategy work.  
* New areas of the product where little research has been done.  
* Fast-moving projects where a directional statement is needed to move forward.

Best practices:

* Be transparent about the assumption and what it’s based on (e.g., heuristic review, customer anecdote, team expertise).  
* Include a plan or intention to validate the assumption with research.  
* Clearly flag these for team awareness, especially when sharing with cross-functional stakeholders.

---

# Jira usage guidelines

## Incorporating Problem Statements in Jira

The following are guidelines you should follow when including problem statements in Jira.

### For teams that already have Jira Epic/Story templates

If your team already has a Jira template for Epics and/or Stories, the best approach is to integrate the problem statement directly into the template. This ensures every new Epic (or Story if there is no parent Epic) includes a clear, structured problem statement from the start.

* Where to include it: Add a dedicated “Problem Statement” section in your template, prompting the issue creator to fill it out before work begins.  
* Which template to use: Depending on the availability of data, the issue creator should use either the Data-Driven or Assumption-Based template.  
* Best practice: Require problem statements as part of the definition of ready to ensure alignment before moving forward.

### For teams without Jira Epic/Story templates

If your team doesn’t use a Jira template yet, the easiest approach is to copy and paste the problem statement templates from this doc directly into the Jira Epic or Story description. This keeps it simple and ensures problem statements are consistently included, even without a formal Jira template.

### Tracking Jira tickets with Problem Statements

To ensure all Jira Epics (or Stories if there is no parent Epic) include a well-defined problem statement, each new Jira created by the team should have a label indicating the type of problem statement applied. This allows us to track how consistently problem statements are being used and identify gaps where they are missing.

### Required labels for problem statements

When creating a Jira Epic  (or Story if there is no parent Epic), select the appropriate label based on how the problem statement was defined:

* problem-statement-uxd-data-driven \- based on UXDR/PWDR research.  
* problem-statement-data-driven \- The problem statement is based on research from outside UX (e.g., BU, Marketing, Engineering).  
* problem-statement-assumption \- The problem statement is based on assumptions rather than validated research. This can be provided by either UX or others.  
* problem-statement-undefined \- The default label for Jiras where a problem statement has not been defined. This helps track gaps and ensure problem statements are consistently incorporated.

Note on edge cases  
Some tickets may not require a problem statement, even if they are design-related. For example, if you are creating a Jira solely to track an implementation review of previously completed design work, a problem statement is not expected.  In those cases, use the problem-statement-undefined label to indicate that the absence of a problem statement is intentional and within scope. These edge cases should be an exception, not the norm.

### Track your KR2 progress

You can view KR2 problem statement coverage across projects using this dashboard:  
[KR2 2025 Problem Statement Tracking Dashboard](https://issues.redhat.com/secure/Dashboard.jspa?selectPageId=12344893)

Look for the teal-colored widgets labeled:

* KR2 2025 problem statements total (Goal 100%): This widget shows the percentage of Jiras with each of the labels, or no labels at all.  
* KR2 2025 Problem statements by project: Breaks down the progress by project or team, so you can quickly spot areas that may need follow-up.  
* All issues that KR2 applies to: This is a full list of Jira issues that fall under the scope of KR2, making it easy to spot undefined or incorrectly labeled Jiras.

We recommend checking this dashboard regularly, especially before sprint planning, to make sure your tickets are properly labeled and your problem statements are clearly defined. 

### Jira Format in Markdown 

This can either be used in a jira template or just pasted directly into a story/epic

h3. Problem Statement

{color:\#FF0000}\_Apply one of the four labels to this Jira ticket:\_{color}  
{color:\#FF0000}  
\*problem-statement-uxd-data-driven\*  
\*problem-statement-data-driven\*  
\*problem-statement-assumption\*  
\*problem-statement-undefined\*  
{color}  
{color:\#FF0000}\_Select the problem statement template below for either data driven or assumption based. See \[this guide|[https://docs.google.com/document/d/1ugT2u8UKHOiiYUwpwvHSiWcci96U5sKBxKufL82HIp4/edit?tab=t.0](?tab=t.0)\] on writing good problem statements:\_{color}

{color:\#FF0000}\_Data driven problem statement\_{color}

\[Target User\] struggles with \[specific issue\]. Data from \[source, e.g., analytics, research\] shows \[specific metrics\]. This impacts \[user goal/business goal\].

{color:\#FF0000}\_Assumption-based problem statement\_{color}

We assume that \[target user\] experiences \[specific issue\] due to \[reason\]. This assumption is based on \[source, e.g., limited feedback, prior knowledge\].

# Using AI tools safely

| Disclaimer This section provides guidance on using AI tools to assist with drafting or refining UXD problem statements. While AI can help with clarity and structure, it must be used responsibly and with careful consideration.  AI is a starting point, not a final answerTreat AI outputs as ideas, not decisions. Always validate results, apply critical thinking, and ensure alignment with user needs, business goals, and ethical standards. Watch for inaccuracies and biases. Use AI for ideation, not executionAI is best for brainstorming and strategy. Final design decisions should be based on research, user feedback, and expert judgment. By using AI responsibly, we can harness its potential while maintaining the integrity, security, and quality of UX design work. |
| :---- |

## Using AI Tools to Help Draft Problem Statements

You can use approved internal AI tools to help generate or refine problem statements, particularly when you’re unsure how to get started or want help formatting your thinking. These tools can be especially useful for shaping assumption-based statements or structuring ideas using the UXD templates in this document.

### Use only approved tools

To protect Red Hat’s sensitive information and intellectual property, it is critical that you only use tools that are approved for internal use. These include local LLMs that run within Red Hat’s infrastructure and Gemini, which is covered under Red Hat’s enterprise agreement with Google. Both options are approved for handling confidential product and research data. Approved tools include:

* Gemini for Workspace (Google Workspace-integrated AI assistant)  
  Be sure you’re using Gemini through your Red Hat account, not a personal one, to ensure Red Hat’s data stays protected and is not used to train or fine-tune Google’s models. It is easy to accidentally use a personal account if you are signed into multiple Google accounts, so double-check which account is active before using Gemini (see [Gemini Acceptable Usage Guidelines](https://source.redhat.com/groups/public/ai/google_gemini#tab-acceptable-use-guidance)).  
* Red Hat-approved local LLMs (see [UXD Guide to Using AI](https://docs.google.com/document/d/13OYVw5S22XmRXAXGBAK-03NUQYC5283oCESY1YGLB9g/edit?usp=sharing)).

Do not use public LLMs like ChatGPT, Bard, or Copilot for this purpose. They are not approved for Red Hat data or workflows.

## Using LLMs to Help Draft Problem Statements

If you’re struggling to get started or want to improve the clarity of your problem statement, you can use a large language model (LLM) to help generate or refine your draft. This can be especially useful for creating assumption-based statements or formatting your ideas into the standard [templates]().

Refer to the [Gemini for Google Workspace](https://source.redhat.com/groups/public/ai/google_gemini#tab-availability) source page to understand how to use Gemini.  
Refer to the [UXD Guide to Using AI](https://docs.google.com/document/d/13OYVw5S22XmRXAXGBAK-03NUQYC5283oCESY1YGLB9g/edit?usp=sharing) guide for setup instructions and usage tips.

### How to prompt Gemini or a local LLM

You can use a prompt like this, based on the two templates we recommend:

For a data-driven problem statement:  
*“Help me write a data-driven problem statement for a design \[Epic/Story\]. The target user is \[describe the user\]. The issue is \[describe the specific problem\]. We have data from \[source, e.g., user research, analytics, etc\] showing \[findings\]. Format the response based on the following structure: ‘\[Target user\] struggles with \[specific issue\]. Data from \[source\] shows \[metrics\]. This impacts \[user goal/business goal\].”*

For an assumption-based problem statement:  
*“Help me write an assumption-based problem statement for a design \[Epic/Story\]. The target user is \[describe the user\]. The issue is \[describe the specific problem\]. But we do not have formal data to confirm it yet. Base it on anecdotal feedback or team observations. Format the response based on the following structure: ‘We assume that \[target user\] experiences \[specific issue\] due to \[reason\]. This assumption is based on \[source, e.g., limited feedback, prior knowledge\].”*

Give the LLM context by uploading this doc  
To get better output from a local LLM or Gemini, download the latest version of this problem statement guide as a PDF and feed it into the tool (if supported). This gives the AI direct context about how UXD defines and structures other problem statements, improving the quality of the response. Be sure you are using a secure, approved tool before feeding it any Red Hat internal documentation to it.

Other helpful tips:

* Use assumption-based framing if you haven’t validated the problem yet.  
* Paste your initial draft and ask the model to rephrase or simplify it.  
* Always review and revise the output. Treat this as a starting point, not a final solution

### Handling research data safely

If you are using research to help generate a problem statement, be extra cautious when entering any user data into a LLM. Make sure to review the “Handling Research Data Locally” section in the [UXD: Getting Started with AI Internally](https://docs.google.com/document/d/13OYVw5S22XmRXAXGBAK-03NUQYC5283oCESY1YGLB9g/edit?usp=sharing) guide.

### Gemini specific guidance

Gemini is now available to Red Hat associates through Google Workspace, including Gmail, Docs, Drive, and the standalone Gemini web app at gemini.google.com. You don’t need to sign up, just be signed in with Red Hat SSO to access it.

When using Gemini:

* Review and revise all outputs before use.  
* Treat all AI generated content as drafts, not final answers.  
* Never share sensitive content with Gemini if you wouldn’t store that data in your Red Hat Google Workspace to begin with.

Refer to the full [Gemini Acceptable Usage Guidelines](https://source.redhat.com/groups/public/ai/google_gemini#tab-acceptable-use-guidance) for detailed policies, and join [\#forum-productivity-tips-and-tricks](https://redhat.enterprise.slack.com/archives/C03KQ9M1P6C) to ask questions or share tips with other Red Hatters.

# Collaborating with PM

## Standard Practices for Collaborating with PM and Eng on Problem  Statements

Effective collaboration between UX Designers, PMs, Eng is crucial for aligning on problem statements and crafting solutions that **truly address user needs**. The list of practices below provides practical strategies for standardizing the collaboration process, helping teams work more efficiently and deliver better and more impactful solutions.

##### Goals of collaboration

1. Ensure shared understanding of the problem space

2. Align user needs, business objectives, and technical feasibility

3. Get agreed ownership for PM, Eng, and Design.

##### Standard practices 

1. Ensure you have PM buy-in and involve them early, even before conducting any research.

2. Come up with a list of questions to ask a PM to gather relevant data they may have about the feature they want us to deliver. This template will guide you in creating a set of standard questions. [Click here to make a copy of the Problem Statement Questionnaire template.](https://docs.google.com/document/d/1P65Ci-BWSMB3-hvZrZGC0NiRsDu_OAHxvlIzzxV4xzM/copy)   
     
4. Review existing documentation, user feedback, and past research to identify key insights and gaps.

5. Collaborate with stakeholders, such as professional services, to gain diverse perspectives on the problem.

6. Regularly share research findings and updates with the team through meetings or shared documentation to ensure everyone stays aligned and informed throughout the process.

---

