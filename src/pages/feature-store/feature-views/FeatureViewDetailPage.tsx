import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabTitleText,
  TabContentBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  LabelGroup,
  Label,
  Flex,
  FlexItem,
  Button,
  ClipboardCopy,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  SearchInput,
  TextInput,
  DatePicker,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Pagination,
  CodeBlock,
  CodeBlockCode,
  CodeBlockAction,
  ClipboardCopyButton,
  Stack,
  StackItem,
  Tooltip,
  Popover,
  Panel,
  PanelMain,
  PanelMainBody,
  Divider,
  List,
  ListItem,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ThProps,
} from '@patternfly/react-table';
import { 
  WrenchIcon, 
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import { 
  mockFeatureViews,
  mockDataSources,
  mockFeatureServices,
  mockFeatures,
  Feature,
  formatRelativeTime,
  getFeatureViewType,
  getFeatureNamesForView,
} from '../../../mockData/featureStore';
import { mockEntities, Entity } from '../../../mockData/entities';
import { FeatureStoreLineage } from '../../../components/FeatureStoreLineage/FeatureStoreLineage';

// Mock connected workbenches data
const mockConnectedWorkbenches = [
  { name: 'My application', project: 'Banking' },
  { name: 'example', project: 'demo' },
];

const mockProjectsWithoutWorkbenches = [
  { name: 'Project 3' },
  { name: 'Project 4' },
];

// Mock materialization jobs
interface MaterializationJob {
  id: string;
  interval: string;
  created: string;
  updated: string;
}

const getMaterializationJobs = (featureViewId: string): MaterializationJob[] => {
  const jobs: Record<string, MaterializationJob[]> = {
    'fv-001': [
      { id: 'mat-001', interval: '1h', created: '2024-02-01T08:00:00Z', updated: '2024-12-05T14:22:00Z' },
      { id: 'mat-002', interval: '6h', created: '2024-02-01T08:00:00Z', updated: '2024-12-05T14:22:00Z' },
    ],
    'fv-002': [
      { id: 'mat-003', interval: '24h', created: '2024-03-10T10:00:00Z', updated: '2024-12-08T09:45:00Z' },
    ],
    'fv-003': [
      { id: 'mat-004', interval: '1h', created: '2024-04-15T12:00:00Z', updated: '2024-12-07T16:15:00Z' },
    ],
  };
  return jobs[featureViewId] || [];
};

// Mock transformation code
const getTransformationCode = (featureViewId: string): string => {
  const codes: Record<string, string> = {
    'fv-001': `def transform_transactions(df):
    """Transform transaction data into aggregated features"""
    return df.groupby('customer_id').agg({
        'amount': ['sum', 'mean', 'max'],
        'transaction_date': 'count'
    }).reset_index()`,
    'fv-002': `def transform_products(df):
    """Transform product catalog into similarity scores"""
    return df.apply(calculate_similarity, axis=1)`,
    'fv-003': `def transform_customer(df):
    """Transform customer data into churn indicators"""
    return df.apply(calculate_churn_probability, axis=1)`,
  };
  return codes[featureViewId] || `def transform(df):
    """Default transformation"""
    return df`;
};

// Mock transformation inputs
const getTransformationInputs = (featureViewId: string): string[] => {
  const inputs: Record<string, string[]> = {
    'fv-001': ['transaction_table', 'customer_table'],
    'fv-002': ['product_catalog'],
    'fv-003': ['customer_warehouse'],
  };
  return inputs[featureViewId] || [];
};

// Schema table row interface
interface SchemaRow {
  column: string;
  type: 'ENTITY' | 'FEATURE';
  dataType: string;
  description: string;
}

// Get feature view schema as table data
const getFeatureViewSchemaTable = (featureViewId: string, entities: Entity[], features: Feature[]): SchemaRow[] => {
  const rows: SchemaRow[] = [];
  
  // Add entity rows
  const featureView = mockFeatureViews.find(fv => fv.id === featureViewId);
  if (featureView) {
    featureView.entityIds.forEach(entityId => {
      const entity = entities.find(e => e.id === entityId);
      if (entity) {
        rows.push({
          column: entity.name,
          type: 'ENTITY',
          dataType: entity.valueType,
          description: entity.description,
        });
      }
    });
  }
  
  // Add feature rows
  const featureNames = getFeatureNamesForView(featureViewId);
  featureNames.forEach(featureName => {
    const feature = features.find(f => f.name === featureName && f.featureViewId === featureViewId);
    if (feature) {
      rows.push({
        column: feature.name,
        type: 'FEATURE',
        dataType: feature.valueType,
        description: feature.description,
      });
    }
  });
  
  return rows;
};

// Mock search results with categories
interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: 'Data Sources' | 'Features' | 'Feature Views' | 'Entities' | 'Datasets' | 'Feature Services';
  featureStore?: string;
  tags: string[];
}

// Utility function to highlight matching text
const highlightMatch = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;
  
  const tagMatch = query.match(/^(\w+)=(.+)$/);
  const searchTerm = tagMatch ? tagMatch[2] : query;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) return text;
  
  const before = text.slice(0, index);
  const match = text.slice(index, index + searchTerm.length);
  const after = text.slice(index + searchTerm.length);
  
  return (
    <>
      {before}
      <strong style={{ fontWeight: 700 }}>{match}</strong>
      {after}
    </>
  );
};

/**
 * FeatureViewDetailPage Component
 * Displays detailed information about a specific feature view with tabs for Details, Lineage, Feature services, Materialization, and Transformation
 */
export const FeatureViewDetailPage: React.FC = () => {
  const { featureViewId } = useParams<{ featureViewId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [copied, setCopied] = useState(false);
  
  // Get feature store from URL params
  const selectedFeatureStore = searchParams.get('featureStore') || 'All feature stores';
  
  // Feature Services tab state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  // Schema tab state
  const [schemaPage, setSchemaPage] = useState(1);
  const [schemaPerPage, setSchemaPerPage] = useState(10);
  const [selectedSchemaFilterAttribute, setSelectedSchemaFilterAttribute] = useState<string>('Columns');
  const [isSchemaFilterDropdownOpen, setIsSchemaFilterDropdownOpen] = useState(false);
  const [schemaFilterInputValue, setSchemaFilterInputValue] = useState('');
  const [schemaActiveFilters, setSchemaActiveFilters] = useState<Record<string, Set<string>>>({
    'Columns': new Set(),
    'Type': new Set(),
    'Data Type': new Set(),
  });

  // Global search state
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Find the feature view by ID
  const featureView = mockFeatureViews.find(fv => fv.id === featureViewId);
  
  // Get related data
  const dataSource = featureView ? mockDataSources.find(ds => ds.id === featureView.dataSourceId) : null;
  const entities = featureView ? mockEntities.filter(e => featureView.entityIds.includes(e.id)) : [];
  const featureServices = featureView ? mockFeatureServices.filter(fs => fs.featureViewIds.includes(featureView.id)) : [];
  const materializationJobs = featureView ? getMaterializationJobs(featureView.id) : [];
  const transformationCode = featureView ? getTransformationCode(featureView.id) : '';
  const transformationInputs = featureView ? getTransformationInputs(featureView.id) : [];
  const allSchemaTable = featureView ? getFeatureViewSchemaTable(featureView.id, entities, mockFeatures) : [];
  
  // Check if any schema filters are active
  const hasActiveSchemaFilters = useMemo(() => {
    return Object.values(schemaActiveFilters).some(filters => filters.size > 0);
  }, [schemaActiveFilters]);
  
  // Filter schema table based on active filters
  const filteredSchemaTable = useMemo(() => {
    if (!hasActiveSchemaFilters) {
      return allSchemaTable;
    }
    
    return allSchemaTable.filter(row => {
      for (const [category, filterValues] of Object.entries(schemaActiveFilters)) {
        if (filterValues.size === 0) continue;
        
        const matchesAny = Array.from(filterValues).some(filterValue => {
          const searchLower = filterValue.toLowerCase();
          switch (category) {
            case 'Columns':
              return row.column.toLowerCase().includes(searchLower);
            case 'Type':
              return row.type.toLowerCase().includes(searchLower);
            case 'Data Type':
              return row.dataType.toLowerCase().includes(searchLower);
            default:
              return true;
          }
        });
        
        if (!matchesAny) return false;
      }
      
      return true;
    });
  }, [allSchemaTable, schemaActiveFilters, hasActiveSchemaFilters]);
  
  // Paginate filtered schema table
  const paginatedSchemaTable = useMemo(() => {
    const start = (schemaPage - 1) * schemaPerPage;
    const end = start + schemaPerPage;
    return filteredSchemaTable.slice(start, end);
  }, [filteredSchemaTable, schemaPage, schemaPerPage]);
  
  // Handle schema filter operations
  const addSchemaFilterValue = (value?: string) => {
    const valueToAdd = value || schemaFilterInputValue.trim();
    if (valueToAdd) {
      setSchemaActiveFilters(prev => {
        const newSet = new Set(prev[selectedSchemaFilterAttribute]);
        newSet.add(valueToAdd);
        return {
          ...prev,
          [selectedSchemaFilterAttribute]: newSet
        };
      });
      setSchemaFilterInputValue('');
      setSchemaPage(1);
    }
  };
  
  const onDeleteSchemaChip = (category: string, chip: string) => {
    setSchemaActiveFilters(prev => {
      const newSet = new Set(prev[category]);
      newSet.delete(chip);
      return {
        ...prev,
        [category]: newSet
      };
    });
    setSchemaPage(1);
  };
  
  const clearAllSchemaFilters = () => {
    setSchemaActiveFilters({
      'Columns': new Set(),
      'Type': new Set(),
      'Data Type': new Set(),
    });
    setSchemaFilterInputValue('');
    setSchemaPage(1);
  };
  
  const handleSchemaFilterKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      addSchemaFilterValue();
    }
  };

  // Format date to match design (e.g., "Jan 2020, 23:33 UTC")
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    return `${month} ${year}, ${time} UTC`;
  };

  // Handle tab selection
  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  // Handle copy code
  const handleCopyCode = () => {
    if (featureView) {
      const codeSnippet = `from feast import FeatureView, Entity, Feature

feature_view = FeatureView(
    name="${featureView.name}",
    entities=[Entity(name="${entities[0]?.name || 'entity'}")],
    features=[Feature(name="feature_name", dtype=ValueType.FLOAT)]
)`;
      navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Global search results
  const globalSearchResults = useMemo(() => {
    if (!globalSearchValue.trim()) return { results: [], total: 0 };
    
    const query = globalSearchValue.toLowerCase();
    
    // Search feature views
    const featureViewResults: SearchResult[] = mockFeatureViews
      .filter(fv => 
        (selectedFeatureStore === 'All feature stores' || fv.featureStore === selectedFeatureStore) &&
        (fv.name.toLowerCase().includes(query) ||
        fv.description.toLowerCase().includes(query) ||
        fv.tags.some(tag => tag.toLowerCase().includes(query)))
      )
      .map(fv => ({
        id: fv.id,
        name: fv.name,
        description: fv.description,
        category: 'Feature Views' as const,
        featureStore: fv.featureStore,
        tags: fv.tags,
      }));
    
    return { results: featureViewResults, total: featureViewResults.length };
  }, [globalSearchValue, selectedFeatureStore]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    globalSearchResults.results.forEach(result => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category].push(result);
    });
    return groups;
  }, [globalSearchResults]);

  // Handle search result click
  const handleSearchResultClick = (result: SearchResult) => {
    switch (result.category) {
      case 'Entities':
        navigate(`/develop-train/feature-store/entities/${result.id}`);
        break;
      case 'Feature Views':
        navigate(`/develop-train/feature-store/feature-views/${result.id}`);
        break;
      case 'Data Sources':
        navigate(`/develop-train/feature-store/data-sources/${result.id}`);
        break;
      case 'Features':
        navigate(`/develop-train/feature-store/features/${result.id}`);
        break;
      case 'Datasets':
        navigate(`/develop-train/feature-store/data-sets/${result.id}`);
        break;
      case 'Feature Services':
        navigate(`/develop-train/feature-store/feature-services/${result.id}`);
        break;
    }
    setIsSearchDropdownOpen(false);
    setGlobalSearchValue('');
  };

  // Pagination for feature services
  const paginatedFeatureServices = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return featureServices.slice(start, end);
  }, [featureServices, page, perPage]);

  if (!featureView) {
    return (
      <PageSection>
        <Title headingLevel="h1">Feature view not found</Title>
        <Content component="p">The requested feature view could not be found.</Content>
        <Button variant="primary" onClick={() => navigate('/develop-train/feature-store/feature-views')}>
          Back to Feature views
        </Button>
      </PageSection>
    );
  }

  const viewType = getFeatureViewType(featureView);

  return (
    <>
      {/* Breadcrumb with Feature Store Icon */}
      <PageSection type="breadcrumb">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Breadcrumb>
              <BreadcrumbItem>
                <span
                  onClick={() => navigate(`/develop-train/feature-store/feature-views?featureStore=${encodeURIComponent(selectedFeatureStore)}`)}
                  style={{ 
                    color: 'var(--pf-t--global--text--color--link--default)',
                    borderBottom: '1px solid var(--pf-t--global--text--color--link--default)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    paddingBottom: '1px'
                  }}
                >
                  Feature views -
                  <svg 
                    className="pf-v6-svg" 
                    viewBox="0 0 40 40" 
                    fill="currentColor" 
                    aria-hidden="true" 
                    role="img" 
                    width="1.2em" 
                    height="1.2em"
                  >
                    <path d="M28.5,25.375c-.63568,0-1.22626.19312-1.72021.52051l-4.38898-4.38898c.77032-.96265,1.23419-2.18066,1.23419-3.50653s-.46387-2.54388-1.23419-3.50653l3.25592-3.25592c.39655.24078.85651.38745,1.35327.38745,1.44727,0,2.625-1.17773,2.625-2.625s-1.17773-2.625-2.625-2.625-2.625,1.17773-2.625,2.625c0,.49677.14667.95673.38745,1.35327l-3.25592,3.25592c-.96265-.77032-2.18066-1.23419-3.50653-1.23419s-2.54388.46387-3.50653,1.23419l-4.38898-4.38898c.32745-.49402.52051-1.08459.52051-1.72021,0-1.72266-1.40186-3.125-3.125-3.125s-3.125,1.40234-3.125,3.125,1.40186,3.125,3.125,3.125c.63568,0,1.22626-.19312,1.72021-.52051l4.38898,4.38898c-.77032.96265-1.23419,2.18066-1.23419,3.50653s.46387,2.54388,1.23419,3.50653l-3.25586,3.25586c-.39655-.24078-.85657-.38739-1.35333-.38739-1.44727,0-2.625,1.17773-2.625,2.625s1.17773,2.625,2.625,2.625,2.625-1.17773,2.625-2.625c0-.49677-.14661-.95679-.38739-1.35333l3.25586-3.25586c.96265.77032,2.18066,1.23419,3.50653,1.23419s2.54388-.46387,3.50653-1.23419l4.38898,4.38898c-.32745.49402-.52051,1.08459-.52051,1.72021,0,1.72266,1.40186,3.125,3.125,3.125s3.125-1.40234,3.125-3.125-1.40186-3.125-3.125-3.125ZM27,7.625c.7583,0,1.375.61719,1.375,1.375s-.6167,1.375-1.375,1.375-1.375-.61719-1.375-1.375.6167-1.375,1.375-1.375ZM5.625,7.5c0-1.03418.84131-1.875,1.875-1.875s1.875.84082,1.875,1.875-.84131,1.875-1.875,1.875-1.875-.84082-1.875-1.875ZM9,28.375c-.7583,0-1.375-.61719-1.375-1.375s.6167-1.375,1.375-1.375,1.375.61719,1.375,1.375-.6167,1.375-1.375,1.375ZM13.625,18c0-2.41211,1.9624-4.375,4.375-4.375s4.375,1.96289,4.375,4.375-1.9624,4.375-4.375,4.375-4.375-1.96289-4.375-4.375ZM28.5,30.375c-1.03369,0-1.875-.84082-1.875-1.875s.84131-1.875,1.875-1.875,1.875.84082,1.875,1.875-.84131,1.875-1.875,1.875Z" />
                  </svg>
                  {selectedFeatureStore}
                </span>
              </BreadcrumbItem>
              <BreadcrumbItem isActive>{featureView.name}</BreadcrumbItem>
            </Breadcrumb>
          </FlexItem>
          
          {/* Global Search Bar - Top Right */}
          <FlexItem>
            <div ref={searchContainerRef} style={{ position: 'relative', width: '350px' }}>
              <Tooltip
                content="Search by name, description, or tag (e.g., team=platform)"
                position="top"
                triggerRef={searchContainerRef}
              >
                <SearchInput
                  aria-label="Global search"
                  placeholder="Search by name, description, or tag (e.g., team=platform)"
                  value={globalSearchValue}
                  onChange={(_event, value) => {
                    setGlobalSearchValue(value);
                    setIsSearchDropdownOpen(value.trim().length > 0);
                  }}
                  onFocus={() => {
                    if (globalSearchValue.trim()) {
                      setIsSearchDropdownOpen(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsSearchDropdownOpen(false), 200);
                  }}
                  onClear={() => {
                    setGlobalSearchValue('');
                    setIsSearchDropdownOpen(false);
                  }}
                />
              </Tooltip>
              
              {/* Search Dropdown */}
              {isSearchDropdownOpen && globalSearchValue.trim().length > 0 && (
                <Panel
                  variant="raised"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '420px',
                    maxHeight: '450px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    marginTop: '4px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <PanelMain>
                    <PanelMainBody style={{ padding: '16px 0' }}>
                      <div style={{ textAlign: 'center', marginBottom: '16px', padding: '0 16px' }}>
                        <span style={{ color: 'var(--pf-t--global--text--color--link--default)', textDecoration: 'none' }}>
                          {globalSearchResults.total} results from {selectedFeatureStore}
                        </span>
                      </div>
                      
                      <Divider />
                      
                      {globalSearchResults.total === 0 ? (
                        <Content component="p" style={{ padding: '16px' }}>No results found</Content>
                      ) : (
                        Object.entries(groupedResults).map(([category, results], categoryIndex) => (
                          <div key={category}>
                            {categoryIndex > 0 && <Divider />}
                            <div style={{ padding: '0 16px' }}>
                              <Content component="small" style={{ color: '#6a6e73', fontWeight: 600, marginTop: '12px', marginBottom: '8px', display: 'block' }}>
                                {category}
                              </Content>
                              {results.map((result) => (
                                <div
                                  key={result.id}
                                  style={{
                                    padding: '8px 0',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => handleSearchResultClick(result)}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                    <FlexItem>
                                      <span style={{ fontWeight: 400 }}>
                                        {highlightMatch(result.name, globalSearchValue)}
                                      </span>
                                    </FlexItem>
                                    {result.featureStore && (
                                      <FlexItem>
                                        <Label isCompact variant="outline" color="blue">{result.featureStore}</Label>
                                      </FlexItem>
                                    )}
                                  </Flex>
                                  <Content component="small" style={{ color: '#6a6e73', display: 'block', marginTop: '4px' }}>
                                    {highlightMatch(result.description, globalSearchValue)}
                                  </Content>
                                  {result.tags.length > 0 && (() => {
                                    const matchingTags = result.tags.filter(tag => 
                                      tag.toLowerCase().includes(globalSearchValue.toLowerCase())
                                    );
                                    return matchingTags.length > 0 ? (
                                      <Flex spaceItems={{ default: 'spaceItemsXs' }} style={{ marginTop: '8px' }}>
                                        {matchingTags.map((tag, idx) => (
                                          <FlexItem key={idx}>
                                            <Label color="blue" isCompact>
                                              {highlightMatch(tag, globalSearchValue)}
                                            </Label>
                                          </FlexItem>
                                        ))}
                                      </Flex>
                                    ) : null;
                                  })()}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </PanelMainBody>
                  </PanelMain>
                </Panel>
              )}
            </div>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Page Header */}
      <PageSection>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Title headingLevel="h1" size="2xl">{featureView.name}</Title>
              </FlexItem>
              <FlexItem>
                <Label isCompact variant="filled" color="blue">
                  {viewType}
                </Label>
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Content component="p">{featureView.description}</Content>
          </FlexItem>
          <FlexItem>
            {/* View Connected Workbenches Link with Icon */}
            <Popover
              position="right"
              aria-label="Connected workbenches"
              headerContent="Connected workbenches"
              showClose
              minWidth="460px"
              bodyContent={
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      Workbenches already connected to the {selectedFeatureStore === 'All feature stores' ? <strong>All feature stores</strong> : <strong>{selectedFeatureStore}</strong>} feature store:
                    </div>
                    <List style={{ marginLeft: '8px' }}>
                      {mockConnectedWorkbenches.map((wb, idx) => (
                        <ListItem key={idx} style={{ fontSize: '14px' }}>
                          <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end" style={{ fontWeight: 600 }}>{wb.name}</Button>
                          {' '}in{' '}
                          <Button variant="link" isInline style={{ fontWeight: 600 }}>{wb.project}</Button>
                          {' '}project
                        </ListItem>
                      ))}
                    </List>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      Projects that can access the {selectedFeatureStore === 'All feature stores' ? <strong>All feature stores</strong> : <strong>{selectedFeatureStore}</strong>} feature store but do not have connected workbenches:
                    </div>
                    <List style={{ marginLeft: '8px' }}>
                      {mockProjectsWithoutWorkbenches.map((project, idx) => (
                        <ListItem key={idx} style={{ fontSize: '14px' }}>
                          <Button variant="link" isInline style={{ fontWeight: 600 }}>{project.name}</Button>
                          {' '}project
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              }
            >
              <Button variant="link" icon={<WrenchIcon />}>
                View connected workbenches
              </Button>
            </Popover>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Tabs */}
      <PageSection type="tabs">
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} aria-label="Feature view detail tabs">
          <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} aria-label="Details tab">
            <TabContentBody>
              <PageSection style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)', minHeight: 'calc(100vh - 300px)' }}>
                <Stack>
                  {/* Section 1: Overview */}
                  <StackItem style={{ marginBottom: 'var(--pf-t--global--spacer--xl)' }}>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                      Overview
                    </Title>
                    <DescriptionList isHorizontal isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Created at</DescriptionListTerm>
                        <DescriptionListDescription>{formatDate(featureView.created)}</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </StackItem>

                  {/* Section 2: Data source */}
                  {dataSource && (
                    <StackItem style={{ marginBottom: 'var(--pf-t--global--spacer--xl)' }}>
                      <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                        Data source
                      </Title>
                      <DescriptionList isHorizontal isCompact>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Source type</DescriptionListTerm>
                          <DescriptionListDescription>{dataSource.sourceType}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>File URL</DescriptionListTerm>
                          <DescriptionListDescription>
                            <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied" variant="inline-compact">
                              {dataSource.connectionUrl}
                            </ClipboardCopy>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Data source</DescriptionListTerm>
                          <DescriptionListDescription>
                            <Button
                              variant="link"
                              isInline
                              onClick={() => navigate(`/develop-train/feature-store/data-sources/${dataSource.id}`)}
                            >
                              {dataSource.name}
                            </Button>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </StackItem>
                  )}

                  {/* Section 3: Entities */}
                  {entities.length > 0 && (
                    <StackItem style={{ marginBottom: 'var(--pf-t--global--spacer--xl)' }}>
                      <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                        Entities
                      </Title>
                      <List>
                        {entities.map((entity) => (
                          <ListItem key={entity.id}>
                            <Button
                              variant="link"
                              isInline
                              onClick={() => navigate(`/develop-train/feature-store/entities/${entity.id}`)}
                            >
                              {entity.name}
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    </StackItem>
                  )}

                  {/* Section 4: Tags */}
                  <StackItem style={{ marginBottom: 'var(--pf-t--global--spacer--xl)' }}>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                      Tags
                    </Title>
                    <LabelGroup numLabels={10}>
                      {featureView.tags.map((tag, index) => (
                        <Label key={index} color="blue">{tag}</Label>
                      ))}
                    </LabelGroup>
                  </StackItem>

                  {/* Section 5: Code Snippet */}
                  <StackItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                      <FlexItem>
                        <Title headingLevel="h3" size="md">
                          Code snippet
                        </Title>
                      </FlexItem>
                      <FlexItem>
                        <Popover
                          aria-label="Code snippet help"
                          headerContent="How to use this code snippet?"
                          bodyContent={
                            <Content component="p">
                              This snippet defines the current feature view. Use it as a template to create similar resources.
                              <br /><br />
                              For updates or advanced configuration options, view the documentation.
                            </Content>
                          }
                          showClose
                        >
                          <Button variant="plain" aria-label="Code snippet help">
                            <OutlinedQuestionCircleIcon />
                          </Button>
                        </Popover>
                      </FlexItem>
                    </Flex>
                    <div style={{ maxWidth: '800px', marginTop: 'var(--pf-t--global--spacer--sm)' }}>
                      <CodeBlock
                        actions={
                          <CodeBlockAction>
                            <ClipboardCopyButton
                              id="copy-code-button"
                              textId="code-content"
                              aria-label="Copy to clipboard"
                              onClick={handleCopyCode}
                              variant="plain"
                            >
                              {copied ? 'Copied!' : ''}
                            </ClipboardCopyButton>
                          </CodeBlockAction>
                        }
                      >
                        <CodeBlockCode id="code-content">
                          {`from feast import FeatureView, Entity, Feature

feature_view = FeatureView(
    name="${featureView.name}",
    entities=[Entity(name="${entities[0]?.name || 'entity'}")],
    features=[Feature(name="feature_name", dtype=ValueType.FLOAT)]
)`}
                        </CodeBlockCode>
                      </CodeBlock>
                    </div>
                  </StackItem>
                </Stack>
              </PageSection>
            </TabContentBody>
          </Tab>

          <Tab eventKey={1} title={<TabTitleText>Lineage</TabTitleText>} aria-label="Lineage tab">
            <TabContentBody>
              <PageSection style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)', minHeight: 'calc(100vh - 300px)' }}>
                <Stack>
                  {/* Lineage Section */}
                  <StackItem style={{ marginBottom: 'var(--pf-t--global--spacer--xl)' }}>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                      Lineage
                    </Title>
                    <div 
                      style={{ 
                        height: '500px', 
                        minHeight: '500px',
                        width: '100%', 
                        position: 'relative', 
                        overflow: 'hidden',
                      }}
                      className="lineage-container"
                    >
                      <style>{`
                        .lineage-container > div {
                          height: 100% !important;
                          min-height: 100% !important;
                          max-height: 100% !important;
                        }
                      `}</style>
                      <FeatureStoreLineage 
                        selectedFeatureStore={selectedFeatureStore} 
                        hideEmptyStates={true}
                        rootNodeId={featureView ? `featureview-${featureView.id}` : undefined}
                      />
                    </div>
                  </StackItem>
                  
                  {/* Schema Section */}
                  <StackItem>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                      Schema
                    </Title>
                    
                    {/* Schema Filter Toolbar */}
                    <PageSection padding={{ default: 'noPadding' }} style={{ paddingLeft: 0, paddingRight: 0, marginTop: 'var(--pf-t--global--spacer--md)', marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                      <Toolbar 
                        id="schema-toolbar" 
                        clearAllFilters={clearAllSchemaFilters}
                      >
                        <ToolbarContent>
                          <ToolbarGroup variant="filter-group">
                            <ToolbarItem>
                              <Select
                                aria-label="Select filter attribute"
                                isOpen={isSchemaFilterDropdownOpen}
                                selected={selectedSchemaFilterAttribute}
                                onSelect={(_event, value) => {
                                  setSelectedSchemaFilterAttribute(value as string);
                                  setIsSchemaFilterDropdownOpen(false);
                                }}
                                onOpenChange={(isOpen) => setIsSchemaFilterDropdownOpen(isOpen)}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsSchemaFilterDropdownOpen(!isSchemaFilterDropdownOpen)}
                                    isExpanded={isSchemaFilterDropdownOpen}
                                    style={{ width: '150px' }}
                                  >
                                    {selectedSchemaFilterAttribute}
                                  </MenuToggle>
                                )}
                                shouldFocusToggleOnSelect
                              >
                                <SelectList>
                                  <SelectOption value="Columns">Columns</SelectOption>
                                  <SelectOption value="Type">Type</SelectOption>
                                  <SelectOption value="Data Type">Data Type</SelectOption>
                                </SelectList>
                              </Select>
                            </ToolbarItem>
                            <ToolbarItem>
                              <TextInput
                                type="text"
                                aria-label={`Filter by ${selectedSchemaFilterAttribute}`}
                                placeholder={`Filter by ${selectedSchemaFilterAttribute.toLowerCase()}`}
                                value={schemaFilterInputValue}
                                onChange={(_event, value) => setSchemaFilterInputValue(value)}
                                onKeyDown={handleSchemaFilterKeyPress}
                                style={{ minWidth: '250px' }}
                              />
                            </ToolbarItem>
                          </ToolbarGroup>
                          <ToolbarItem variant="pagination" style={{ marginLeft: 'auto' }}>
                            <Pagination
                              itemCount={filteredSchemaTable.length}
                              perPage={schemaPerPage}
                              page={schemaPage}
                              onSetPage={(_event, newPage) => setSchemaPage(newPage)}
                              onPerPageSelect={(_event, newPerPage) => {
                                setSchemaPerPage(newPerPage);
                                setSchemaPage(1);
                              }}
                              variant="top"
                              isCompact
                            />
                          </ToolbarItem>
                        </ToolbarContent>
                        
                        {/* Active Filter Chips */}
                        {hasActiveSchemaFilters && (
                          <ToolbarContent>
                            <ToolbarGroup>
                              {Object.entries(schemaActiveFilters).map(([category, chipsSet]) => {
                                const chips = Array.from(chipsSet);
                                return chips.length > 0 ? (
                                  <ToolbarItem key={category}>
                                    <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                                      <FlexItem>
                                        <Content component="small" style={{ fontWeight: 'bold' }}>{category}:</Content>
                                      </FlexItem>
                                      <FlexItem>
                                        <LabelGroup categoryName={category} numLabels={10}>
                                          {chips.map((chip, index) => (
                                            <Label
                                              key={`${category}-${chip}-${index}`}
                                              color="blue"
                                              onClose={() => onDeleteSchemaChip(category, chip)}
                                            >
                                              {chip}
                                            </Label>
                                          ))}
                                        </LabelGroup>
                                      </FlexItem>
                                    </Flex>
                                  </ToolbarItem>
                                ) : null;
                              })}
                              <ToolbarItem>
                                <Button variant="link" onClick={clearAllSchemaFilters}>
                                  Clear all filters
                                </Button>
                              </ToolbarItem>
                            </ToolbarGroup>
                          </ToolbarContent>
                        )}
                      </Toolbar>
                    </PageSection>
                    
                    {/* Schema Table */}
                    <Table aria-label="Schema table" variant="compact">
                      <Thead>
                        <Tr>
                          <Th>Columns</Th>
                          <Th>Type</Th>
                          <Th>Data Type</Th>
                          <Th>Description</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {paginatedSchemaTable.length === 0 ? (
                          <Tr>
                            <Td colSpan={4} dataLabel="No schema data">
                              <Content component="p">No schema data available</Content>
                            </Td>
                          </Tr>
                        ) : (
                          paginatedSchemaTable.map((row, index) => (
                            <Tr key={index}>
                              <Td dataLabel="Columns">{row.column}</Td>
                              <Td dataLabel="Type">{row.type}</Td>
                              <Td dataLabel="Data Type">{row.dataType}</Td>
                              <Td dataLabel="Description">
                                <Content component="small" style={{ 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}>
                                  {row.description}
                                </Content>
                              </Td>
                            </Tr>
                          ))
                        )}
                      </Tbody>
                    </Table>
                    
                    {/* Bottom Pagination */}
                    <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                      <FlexItem>
                        <Pagination
                          itemCount={filteredSchemaTable.length}
                          perPage={schemaPerPage}
                          page={schemaPage}
                          onSetPage={(_event, newPage) => setSchemaPage(newPage)}
                          onPerPageSelect={(_event, newPerPage) => {
                            setSchemaPerPage(newPerPage);
                            setSchemaPage(1);
                          }}
                          variant="bottom"
                          isCompact
                        />
                      </FlexItem>
                    </Flex>
                  </StackItem>
                </Stack>
              </PageSection>
            </TabContentBody>
          </Tab>

          <Tab eventKey={2} title={<TabTitleText>Feature services</TabTitleText>} aria-label="Feature services tab">
            <TabContentBody>
              <PageSection style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)', minHeight: 'calc(100vh - 300px)' }}>
                <Table aria-label="Feature services table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th>Feature service</Th>
                      <Th>Updated</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedFeatureServices.map((fs) => (
                      <Tr key={fs.id}>
                        <Td dataLabel="Feature service">
                          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsNone' }}>
                            <FlexItem>
                              <Button
                                variant="link"
                                isInline
                                onClick={() => navigate(`/develop-train/feature-store/feature-services/${fs.id}`)}
                              >
                                {fs.name}
                              </Button>
                            </FlexItem>
                            <FlexItem>
                              <Content component="small">{fs.description}</Content>
                            </FlexItem>
                          </Flex>
                        </Td>
                        <Td dataLabel="Updated">{formatDate(fs.lastUpdated)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Bottom Pagination */}
                <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                  <FlexItem>
                    <Pagination
                      itemCount={featureServices.length}
                      perPage={perPage}
                      page={page}
                      onSetPage={(_event, newPage) => setPage(newPage)}
                      onPerPageSelect={(_event, newPerPage) => {
                        setPerPage(newPerPage);
                        setPage(1);
                      }}
                      variant="bottom"
                      isCompact
                    />
                  </FlexItem>
                </Flex>
              </PageSection>
            </TabContentBody>
          </Tab>

          <Tab eventKey={3} title={<TabTitleText>Materialization</TabTitleText>} aria-label="Materialization tab">
            <TabContentBody>
              <PageSection style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)', minHeight: 'calc(100vh - 300px)' }}>
                <Table aria-label="Materialization jobs table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th>Materialization interval</Th>
                      <Th>Created</Th>
                      <Th>Updated</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {materializationJobs.map((job) => (
                      <Tr key={job.id}>
                        <Td dataLabel="Materialization interval">{job.interval}</Td>
                        <Td dataLabel="Created">{formatDate(job.created)}</Td>
                        <Td dataLabel="Updated">{formatDate(job.updated)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </PageSection>
            </TabContentBody>
          </Tab>

          <Tab eventKey={4} title={<TabTitleText>Transformation</TabTitleText>} aria-label="Transformation tab">
            <TabContentBody>
              <PageSection style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)', minHeight: 'calc(100vh - 300px)' }}>
                <Stack>
                  {/* Top: Transformation Code */}
                  <StackItem style={{ marginBottom: 'var(--pf-t--global--spacer--xl)' }}>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                      Transformation
                    </Title>
                    <div style={{ maxWidth: '800px' }}>
                      <CodeBlock>
                        <CodeBlockCode id="transformation-code">
                          {transformationCode}
                        </CodeBlockCode>
                      </CodeBlock>
                    </div>
                  </StackItem>

                  {/* Bottom: Inputs Section */}
                  <StackItem>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                      Inputs
                    </Title>
                    <List>
                      {transformationInputs.map((input, index) => (
                        <ListItem key={index}>{input}</ListItem>
                      ))}
                    </List>
                  </StackItem>
                </Stack>
              </PageSection>
            </TabContentBody>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default FeatureViewDetailPage;
