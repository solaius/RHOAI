# Feature Store Lineage - Design & Interaction Specifications

# Visual Specifications

> **⚠️ REMINDER:** Ignore pink color annotations in images and right side drawers. Focus on standard UI components.

## 1. Overview
We are implementing the **Lineage Tab** content within the Feature Store Overview page. This view visualizes the data flow relationships between Entities, Data Sources, Feature Views, and Feature Services using a Directed Acyclic Graph (DAG).

**Library Requirement:** Use `@patternfly/react-topology` for the graph rendering.

## 2. Global States & Empty State
* **Context:** The lineage graph relies on a specific "Feature Store" being selected in the Feature store dropdown in the page header.
* **Condition:** If the global Feature Store dropdown is set to **"All feature stores"** (default):
    * **Action:** Hide the graph.
    * **UI:** Display a PatternFly `EmptyState`.
    * **Content:** "Select a Feature Store to view lineage."

## 3. Canvas Layout (Critical)
* **Layout Engine:** Use `DagreLayout` (or equivalent hierarchy layout).
* **Rank Direction:** **Left-to-Right (`rankDir: 'LR'`)**.
    * Flow: `Entity` -> `Data Source` -> `Feature View` -> `Feature Service`.
* **Controls:**
    * **Top Bar:** Filter toolbar (Entity Dropdown, Search Input, Toggle Switch).
    * **Bottom Left:** Zoom controls (Fit to screen, Zoom in, Zoom out, Reset).

## 4. Node Visual Details (Pixel Perfect)
Refer to `lineage_default.png` for exact styling.

### A. Common Node Style
* **Shape:** Rounded Pill / Capsular shape (Standard PF Topology styling).
* **Background:** White/Light Gray (default), Blue Outline (selected).
* **Text:** Node Label aligned to the right of the icon.

### B. Specific Node Types & Icons
**Note regarding Colors:** Use PatternFly Chart colors (e.g., `--pf-t-chart-color-[color]-200`) for the icons to represent the nodes' types.The icon colors for those different types of nodes match the icon backgroudn colors in the cards of the first section within the Metrics tab. 

1.  **Entity (Start Node)**
    * **Icon:** use the same icon of the entities card within the metrics tab
    * **Color:** Gold/Orange theme.
    * **Label:** `Entity: [name]`

2.  **Data Source**
    * **Icon:** use the same icon of the data sources card within the metrics tab
    * **Color:** Blue theme.
    * **Label:** `[Type] data source: [name]`

3.  **Feature View (Central Node)**
    * **Icon:** use the same icon of the feature views card within the metrics tab.
    * **Color:** Purple theme.
    * **Label:** `[Type] FeatureView: [name]`
    * **REQUIRED COMPONENT:** A **Badge** (Gray/Neutral) positioned to the right of the label.
        * **Content:** `[X] features` (e.g., "6 features").
        * **Visual:** This must be clearly visible inside the node boundary.

4.  **Feature Service (End Node)**
    * **Icon:** use the same icon of the feature service card within the metrics tab.
    * **Color:** Green theme.
    * **Label:** `FeatureService: [name]`

## 5. Interactions

### A. Selection & Highlighting
Refer to `lineage_selected_featureview.png` for exact styling.
* **Click Interaction:** Clicking a node selects it.
* **Visuals:**
    1.  **Border:** Selected node gets a thick Blue border with a visual seleted status
    2.  **Trace:** All **upstream** (ancestors) and **downstream** (descendants) nodes and edges turn **Blue**.
    3.  **Dimming:** Unconnected nodes/edges appear faded/gray.

### B. Feature View Popover
Refer to `lineage_selected_featureview.png` for exact styling.
* **Trigger:** Clicking a **Feature View** node (which also selects it).
* **Content:**
    * **Header:** Node Name.
    * **Body:** Description text.
    * **List:** Bullet points of features (from mock data).
    * **Footer:** Links "View FeatureView details" and "View all features".


## 6. Toolbar & Filtering Specifications

The toolbar consists of a two-part filtering mechanism allowing users to isolate specific lineage paths based on resource type and name. Refer to `lineage_toolbar_filters.png` for exact styling.

### A. Attribute Selector (Dropdown)
* **Component:** PatternFly Select (Single selection).
* **Icon:** Filter icon (`<FilterIcon />`) inside the toggle.
* **Options:** The dropdown must contain the following Feature Store resource types:
    * Entity
    * Data source
    * Feature view
    * Feature service
* **Behavior:** Changing this selection updates the context for the adjacent "Value Selector" and clears any currently selected value.

### B. Value Selector (Typeahead Search)
* **Component:** PatternFly SearchInput or Select with Typeahead variant.
* **Placeholder:** Dynamic text: "Find by [Selected Attribute]" (e.g., "Find by feature service").
* **Content source:** Lists all existing resources that match the type selected in the Attribute Selector. 
* **Dropdown Layout:**
    * Each option must display two lines of text:
        1.  **Resource Name:** (Primary text)
        2.  **Description:** (Secondary/Subtle text, smaller font size)
* **Scroll Behavior:**
    * If the list of options is long, limit the maximum height of the dropdown menu.
    * Implement a vertical scrollbar (`overflow-y: auto`) to handle large lists, ensuring the UI remains compact (similar to the Notebook image selection dropdown).
* **Input Behavior:**
    * Users can type to filter the list of options.
    * Users can click the dropdown arrow to view all available options.

### C. Filtering Interaction
* **Trigger:** The lineage graph updates automatically immediately upon selecting a specific resource from the Value Selector.
* **Graph Behavior:**
    * The graph should filter to display **only** the selected node and its relevant connections (ancestors and descendants).
    * Unrelated nodes should be hidden or faded out to focus on the selected resource's lineage.