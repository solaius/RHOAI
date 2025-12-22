# Feature Store Overview Page Implementation Spec

## 1. Context & Goal
We are implementing the **Feature Store Overview** page for Red Hat OpenShift AI. This page serves as the central dashboard. It must match the visual style and functional patterns of the existing "Entities" table list and details pages. 

## 2. Project Context & Technical Constraints
* **Goal:** Implement the "Feature Store Overview" dashboard page.
* **Reference:** See attached image `metrics-tab.png`.
* **Library:** **PatternFly React** (`@patternfly/react-core`, `@patternfly/react-table`, `@patternfly/react-icons`).
* **Requirement:** The implementation must be pixel-perfect, strictly adhering to PatternFly components and utility classes to match the existing application style (Entities list/detail pages), and the image reference.

---

---

## 3. Layout & Header Requirements

### A. Page Header
The header must mimic the layout of the existing "Entities" list page but with specific content changes:
* **Icon:** Display the Feature Store icon.
* **Title:** "Feature store overview"
* **Description:** * **Text:** "The feature store is a centralized catalog for managing, storing, and serving features, ensuring your models have reliable access to consistent data from prototyping to production. To consume and manage resources from feature store, you must integrate it with your workbenches. **Learn how to connect**."
    * **Interaction:** The sentence "Learn how to connect" must be a clickable link/button.
    * **Action:** Clicking this link triggers a Popover state (placeholder logic for now) to explain connection steps.

### B. Global Actions Toolbar
To maintain consistency, reuse these existing components from the "Entities" page:
1.  **Global Search Bar:** Positioned top-right (same component as Entities list).
2.  **Feature Store Dropdown:** Context switcher (default: "All feature stores").
3.  **Action Link:** "View connected workbenches" (with external link/wrench icon).
    * *Requirement:* Ensure the navigation/interaction logic for this link matches the existing implementation in the Entities list.

### C. Tabs Navigation
Below the header, implement a Tab bar with two options:
1.  **Metrics** (Default/Active).
2.  **Lineage** (Inactive/Placeholder for now).

---

## 4. "Metrics" Tab Content
The content below is specific to the "Metrics" tab view.

### A. Resource Summary Cards (Grid)
**Layout:** A responsive grid of 6 cards.
**Card Content Structure:**
1.  **Icon:** (Top-left) Use temporary placeholder icons.
2.  **Title:** (e.g., "Entities", "Data sources", "Datasets", "Features", "Feature views", "Feature services").
3.  **Description:** (Use text from the design screenshot).
4.  **Count:** Large font number (e.g., "4").
5.  **Footer Link:** "Go to [Resource Name]" (e.g., "Go to Entities").

### B. Popular Tags Section
**Header:** "Discover feature views by popular tags"
**Layout:** Row of 4 cards.
**Card Content:**
* **Tag Header:** Icon + Tag Key/Value (e.g., `domain = demographics`).
* **Label:** "Feature views:"
* **List:** 3-4 clickable links to specific feature views.
* **Footer:** "View All (X)" link.

### C. Recently Viewed Resources
**Header:** "Recently viewed resources"
**Table Component:**
* **Columns:** 1.  `Resource name` (Clickable link).
    2.  `Resource type` (e.g., Entity, Data source, Feature).
    3.  `Last viewed` (Relative time, e.g., "2 minutes ago").
* **Pagination:** Standard footer showing range (e.g., "1 - 20 of 523") with page controls.

---

## 5. Data & Logic Requirements

### A. Mock Data Strategy
Do not hardcode values in the UI components. Create a robust `mockData.ts` file that extends the existing Entities data.

1.  **Consistency:** The "Entities" count in the Summary Card **must** dynamically reflect the length of the existing Entities list data.
2.  **New Mock Arrays:** Create mock arrays for:
    * `DataSources`
    * `Datasets`
    * `Features`
    * `FeatureViews`
    * `FeatureServices`
3.  **Recently Viewed Data:** Create a `recentActivity` array that aggregates items from the above lists to populate the bottom table.

### B. Interactions
* **"Learn how to connect":** Implement a simple state toggle (`isOpen`) for the popover. Leave a comment `// TODO: Insert Popover content here` in the render block.
* **Navigation:** Ensure "Go to..." links on cards route to the correct placeholder routes or existing pages.

## 6. App Integration & Routing
* **Router:** Register the new `FeatureStoreOverview` component in the application's main router file (e.g., `routes.tsx` or `AppRoutes.tsx`).
* **Route Path:** Map it to the existing Feature Store path (likely `/feature-store` or `/feature-store/overview`).
* **Sidebar:** Ensure the "Feature Store > Overview" navigation item in the sidebar points to this route and sets the active state correctly.