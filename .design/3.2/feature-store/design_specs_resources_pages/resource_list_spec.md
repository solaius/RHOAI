# Resource List Pages Specification

**Global Layout (Applies to ALL pages below):**
* **Template:** Clone the layout of `EntitiesListPage.tsx` exactly.
* **Shared Components:** PageSection, Title, Global Search, Feature Store Dropdown, Toolbar, filtering logics(including both the toolbar filtering and the filtering logic of the tags column),Pagination, interaction and UI details of similar table columns.
* **Routing:** All table rows link to `/feature-store/[resource-kebab-case]/:id`


## 1. Data Sources List (`DataSourcesList.tsx`)
* **Title:** "Data sources"
* **Description:** "Raw data sources from which features are extracted."
* **Data Source:** `mockDataSources`
* **Columns:**
    1. **Data source:** (Sortable, Link), description under the name, use compactable label under the description for the type(BatchData, StreamKafka, RequestSource)
    2. **Feature store:** (String: feature store value this data source belongs to)
    3. **Data source connector:** (FileSource, RequestSource, StreamKafka)
    4. **Feature views:** (Count of feature views this data sources connects with as a linking button, e.g. 2 feature views, which will trigger a tooltip to display clickable feature views names in bulletpoint format)
    5. **Last modified:** (Relative time)
    6. **Created:** (Relative time)
    7. **Owner:** (String)

## 2. Datasets List (`DatasetsList.tsx`)
* **Title:** "Datasets"
* **Description:** "description of datasets."
* **Data Source:** `mockDatasets`
* **Columns:**
    1. **Datasets:** (Sortable, Link), description under the name.
    2. **Feature store:** (String: feature store value this dataset belongs to)
    3. **Tags:** (Label group)
    4. **Source feature service:** (Count of feature views this data sources connects with as a linking button, e.g. 5 feature views, which will trigger a tooltip to display clickable feature views names in bulletpoint format)
    6. **Last modified:** (Relative time)
    7. **Created:** (Relative time)


## 3. Features List (`FeaturesList.tsx`)
* **Title:** "Features"
* **Description:** "Features are individual data signals used for training and inference."
* **Data Source:** `mockFeatures`
* **Columns:**
    1. **Feature:** (Sortable, Link), feature description listed below the feature name.
    2. **Feature store:** (String: feature store value this feature belongs to)
    3. **Tags:** (Label group)
    4. **Value type:** (String/Int/Float)
    5. **Feature view:** (Link to Feature view)
    6. **Feature service:** (Count of feature service this feauture belongs to as a linking button, e.g. 2 feature services, which will trigger a tooltip to display clickable feature serivce names in bulletpoint format)
    7. **Owner:** (String)

## 4. Feature Views List (`FeatureViewsList.tsx`)
* **Title:** "Feature views"
* **Description:** "Logical groups of time-series feature data."
* **Data Source:** `mockFeatureViews`
* **Columns:**
    1. **Feature view:** (Sortable, Link), description of the feature view below the name
    2. **Feature store:** (String: feature store value this feature view belongs to)
    3. **Tags:** (Label group)
    4. **Features:** (Count of features this feature view include. , e.g. "12 features". The count is a clickable link that triggers a tooltip to display all clikable feature names listing in a bulletpoint format )
    5. **Created:** (Relative time)
    6. **Updated:** (Relative time)
    7. **Owner:** (String)
    8. **Store type:** (Label non-status, Online/Offline with outlined, compact, default stype and with a checking icon). 
  

## 5. Feature Services List (`FeatureServicesList.tsx`)
* **Title:** "Feature services"
* **Description:** "API endpoints for serving features in production."
* **Data Source:** `mockFeatureServices`
* **Columns:**
    1. **Feature service:** (Sortable, Link), and description of the feature service under the name
    2. **Feature store:** (String: feature store value this feature service belongs to)
    3. **Tags:** (Label group)
    4. **Feature Views:** (Count of feature services this feature service includes. , e.g. "12 features". The count is a clickable link that triggers a tooltip to display all clikable feature views names listing in a bulletpoint format)
    5. **Created:** (Relative time)
    6. **Updated:** (Relative time)
    7. **Owner:** (String)