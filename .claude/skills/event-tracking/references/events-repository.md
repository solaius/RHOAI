# RH AI Events and Metrics Repository

This document contains reference information from the RH AI events and metrics repository, including column descriptions and example events.

---

## Repository Structure

The repository is a Google Spreadsheet with the following sheets:

| Sheet | Purpose |
|-------|---------|
| **event sheet description** | Describes what each column means |
| **WIP events (Design)** | Work in progress events being defined by designers |
| **live events (Playground)** | Live events currently tracked in the Playground feature |
| **live events (Serving)** | Live events for Model Serving |
| **live events (Experiments & DS pipelines)** | Live events for Experiments and Data Science pipelines |
| **live events (E2E)** | End-to-end live events |
| **live events (Registry)** | Live events for Model Registry |
| **live events (Workbenches)** | Live events for Workbenches |

---

## Column Descriptions

**Designers** are responsible for maintaining content in the blue columns.
**Researchers** are responsible for maintaining content in the green columns.

| Column | Description |
|--------|-------------|
| **Business & Design Question** | Why are we tracking this? What do you want to learn? This is the most important part to fill out. Frame it as a user story, or a question you want to answer. |
| **Feature name** | Which feature area is this? |
| **Figma/UI link** | Link the design artifact or UI to this |
| **Event Name** | What action did the user take? This is the official name for the event. Use a clear, consistent format: Component-Object-Action |
| **Event Description** | What is it measuring? Describe the specific user interaction in the UI (event). Is it a button click? A page load? The amount of times a form is submitted? |
| **Properties** | Event properties: What are the important details about this specific action? User properties: What are the important details about the user doing the action? (You do not need to specify the type of property) |
| **Jira & PR links** | Link Jira RFE/STRAT being used for prioritizing the work and Engineering PR to show the implementation status. |
| **Metrics** | The specific, quantitative, and precise measurement of your event data. This is the number you will actually track, chart, and put on a dashboard to directly answer your question. |
| **Release** | Identify target release for implementation and link UX's hand off Jira. This needs to get front UI dev's sign off. |
| **Current status** | Where are we in the process? (Prioritized by PM, Implemented by Eng, Pushed to a future release) |
| **Dashboard** | How will this data be used? Helps connect the dots between event data collected and business value. |

---

## Status Values

| Status | Meaning |
|--------|---------|
| **Prioritized by PM** | Event has been reviewed and prioritized for implementation |
| **Implemented by Eng** | Engineering has implemented the event tracking |
| **Pushed to a future release** | Event will be implemented in a later release |

---

## Example Events: Playground (Live)

These events are currently tracked in the Playground feature:

### Playground Setup Initiated

| Field | Value |
|-------|-------|
| **Business/Design Question** | How many playgrounds are being set up? Is the playground page or AI assets the primary path for setting up playgrounds? |
| **KPI Metrics** | Playground setup |
| **Event Name** | Playground Setup Initiated |
| **Properties** | `source: 'Playground'` |
| **Release** | 3 |

### Playground Query Submitted

| Field | Value |
|-------|-------|
| **Business/Design Question** | How deep is user engagement with the playground? How much are users experimenting in a single session? Are users querying with RAG? Are users using streaming? Are users querying with MCP servers? |
| **KPI Metrics** | Playground chats, Playground chat with RAG, Playground chats with streaming, Playground chats with MCP |
| **Event Name** | Playground Query Submitted |
| **Properties** | `isRag: <rag toggle enablement>`, `countofMCP: <number of enabled MCP servers>`, `isStreaming: <streaming toggle enablement>` |
| **Release** | 3 |

### Playground Model Dropdown Option Selected

| Field | Value |
|-------|-------|
| **Business/Design Question** | What are the most frequently used playground controls? How often are users switching models in the playground? |
| **KPI Metrics** | Session model changes (per session distribution), (per session mean), (per session weekly) |
| **Event Name** | Playground Model Dropdown Option Selected |
| **Properties** | `selectedModel: <the selected model name>` |
| **Release** | 3 |

### Playground RAG Upload File

| Field | Value |
|-------|-------|
| **Business/Design Question** | Are users uploading documents to test RAG? Are they able to successfully upload documents? Is the RAG document ingestion flow easy to use? |
| **KPI Metrics** | Session RAG document upload, RAG upload errors, Funnel conversion rate (task success) |
| **Event Name** | Playground RAG Upload File |
| **Properties** | `onSuccess: outcome: 'submit', success: true, chunkSize: <form_value>, chunkOverlap: <form_value>, delimiter: <form_value>` / `onError: outcome: 'submit', success: false, error: <error message>` / `onCancel: outcome: 'cancel'` |
| **Release** | 3 |

### Playground MCP Select

| Field | Value |
|-------|-------|
| **Business/Design Question** | What are the most frequently used playground controls? Are users deeply engaging with MCP tools? |
| **KPI Metrics** | MCP tools selected, Top MCP Servers (top 10 by count of mcpServerName) |
| **Event Name** | Playground MCP Select |
| **Properties** | `mcpServerName: <the name of the mcp server>`, `isSelected: <whether the checkbox is checked or not>` |
| **Release** | 3 |

### Playground Setup

| Field | Value |
|-------|-------|
| **Business/Design Question** | Are users able to successfully complete the playground set up? How many models do users typically add to the playground? |
| **KPI Metrics** | Count of playground set up, Playground setup success rate |
| **Event Name** | Playground Setup |
| **Properties** | `onSuccess: outcome: 'submit', success: true, countModelsSelected: <count>, namespace: <namespace>` / `onError: outcome: 'submit', success: false, error: <error message>, namespace: <namespace>` / `onCancel: outcome: 'cancel', namespace: <namespace>` |
| **Release** | 3 |

---

## Example Events: WIP (Model Catalog)

These events are in the WIP (Work In Progress) stage for the Model Catalog feature:

### Model Catalog Deploy Model Button Clicked

| Field | Value |
|-------|-------|
| **Business/Design Question** | How many unique users performed the deployment action from the Model Catalog for the first time in the last 30 days? |
| **KPI Metrics** | Adoption |
| **Event Name** | Model Catalog Deploy Model Button Clicked |
| **Properties** | `compressionLevel` |
| **Status** | Pushed to a future release |

### Model Catalog Model Category Selected

| Field | Value |
|-------|-------|
| **Business/Design Question** | How many users engage with the 'Validated Models' and 'Red Hat AI models' category? |
| **KPI Metrics** | Engagements |
| **Event Name** | Model Catalog Model Category Selected |
| **Properties** | `modelCategoryName`, `isPerformanceEnabled (true/false)` |
| **Status** | Pushed to a future release |

### Model Catalog Filters Applied

| Field | Value |
|-------|-------|
| **Business/Design Question** | What are the most common filters that users are filtering by? |
| **KPI Metrics** | Engagements |
| **Event Name** | Model Catalog Filters Applied |
| **Properties** | `modelID`, `modelName`, `isValidatedModel(true/false)`, `filterName`, `filterOption` |
| **Status** | Pushed to a future release |

---

## Example Events: WIP (AI Asset Endpoints)

### Available_Endpoints_Page_Viewed

| Field | Value |
|-------|-------|
| **Business/Design Question** | What is the primary navigation path to this page? |
| **KPI Metrics** | Discovery |
| **Event Name** | Available_Endpoints_Page_Viewed |
| **Event Description** | Aggregate entry_source values to see most common discovery paths. |
| **Properties** | `entry_source: (e.g., 'dashboard', 'global_nav', 'direct_url')` |

### Available_Endpoints_Tab_Switched

| Field | Value |
|-------|-------|
| **Business/Design Question** | Are users primarily viewing Models or MCP Servers? |
| **KPI Metrics** | Discovery |
| **Event Name** | Available_Endpoints_Tab_Switched |
| **Event Description** | Count switches per session and views per tab type. |
| **Properties** | `from_tab: (e.g., 'models', 'mcp_servers')`, `to_tab: (e.g., 'models', 'mcp_servers')` |

### Endpoint_Copied

| Field | Value |
|-------|-------|
| **Business/Design Question** | How often are users copying API endpoints? |
| **KPI Metrics** | Selecting |
| **Event Name** | Endpoint_Copied |
| **Event Description** | Count total endpoint copy events. |
| **Properties** | `asset_type: (e.g., 'model', 'mcp_server')`, `endpoint_type: (internal, external, maas_route)`, `copy_target: (Value will be 'endpoint')` |

---

## Property Patterns Reference

Based on implemented events, here are common property patterns:

### Success/Error/Cancel Pattern

Used for form submissions and actions that can succeed, fail, or be cancelled:

```
onSuccess:
  outcome: 'submit'
  success: true
  [additional context properties]

onError:
  outcome: 'submit'
  success: false
  error: <error message>

onCancel:
  outcome: 'cancel'
```

### Selection Pattern

Used for dropdown/checkbox selections:

```
selectedItem: <the selected item name or ID>
isSelected: true/false (for checkboxes)
```

### Toggle Pattern

Used for feature toggles:

```
isFeatureEnabled: true/false
```

### Count Pattern

Used for tracking quantities:

```
countOfItems: <number>
```

### Source/Location Pattern

Used for tracking where an action originated:

```
source: '<page or component name>'
entry_source: '<navigation path>'
namespace: '<namespace identifier>'
```
