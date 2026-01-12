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