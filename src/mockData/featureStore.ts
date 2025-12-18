/**
 * Mock Data for Feature Store Overview
 * Feature Store - RHOAI
 */

import { mockEntities } from './entities';

// ============================================
// Data Source Types
// ============================================
export interface DataSource {
  id: string;
  name: string;
  description: string;
  sourceType: string;
  connectionUrl: string;
  created: string;
  lastUpdated: string;
  tags: string[];
  featureStore: string;
}

export const mockDataSources: DataSource[] = [
  {
    id: 'ds-001',
    name: 'customer_warehouse',
    description: 'Main customer data warehouse containing demographic and account information',
    sourceType: 'Snowflake',
    connectionUrl: 'snowflake://prod.warehouse.db/customers',
    created: '2024-01-10T08:00:00Z',
    lastUpdated: '2024-12-05T14:22:00Z',
    tags: ['domain=demographics', 'env=production'],
    featureStore: 'Fraud detection',
  },
  {
    id: 'ds-002',
    name: 'loan_table',
    description: 'Loan application and approval data for credit scoring models',
    sourceType: 'PostgreSQL',
    connectionUrl: 'postgresql://prod-db.example.com:5432/loans',
    created: '2024-02-15T10:30:00Z',
    lastUpdated: '2024-12-08T09:45:00Z',
    tags: ['term=credit', 'domain=loan'],
    featureStore: 'Fraud detection',
  },
  {
    id: 'ds-003',
    name: 'transaction_stream',
    description: 'Real-time transaction event stream for fraud detection',
    sourceType: 'Kafka',
    connectionUrl: 'kafka://prod-cluster:9092/transactions',
    created: '2024-03-01T12:00:00Z',
    lastUpdated: '2024-12-09T11:30:00Z',
    tags: ['source=credit_bureau', 'env=production'],
    featureStore: 'Fraud detection',
  },
  {
    id: 'ds-004',
    name: 'product_catalog',
    description: 'Product catalog with SKU information and pricing data',
    sourceType: 'Parquet',
    connectionUrl: 's3://feature-store-bucket/products/catalog.parquet',
    created: '2024-04-05T09:20:00Z',
    lastUpdated: '2024-12-07T16:15:00Z',
    tags: ['domain=demographics', 'team=catalog'],
    featureStore: 'Product recommendations',
  },
];

// ============================================
// Dataset Types
// ============================================
export interface Dataset {
  id: string;
  name: string;
  description: string;
  entityId: string;
  snapshotDate: string;
  rowCount: number;
  created: string;
  tags: string[];
  featureStore: string;
}

export const mockDatasets: Dataset[] = [
  {
    id: 'dataset-001',
    name: 'customer_training_2024',
    description: 'Point-in-time correct snapshot of customer features for model training',
    entityId: 'entity-001',
    snapshotDate: '2024-12-01',
    rowCount: 1500000,
    created: '2024-12-01T00:00:00Z',
    tags: ['domain=demographics', 'use_case=training'],
    featureStore: 'Customer analytics',
  },
  {
    id: 'dataset-002',
    name: 'fraud_validation_q4',
    description: 'Validation dataset for fraud detection model evaluation',
    entityId: 'entity-003',
    snapshotDate: '2024-11-15',
    rowCount: 250000,
    created: '2024-11-15T00:00:00Z',
    tags: ['term=credit', 'use_case=validation'],
    featureStore: 'Fraud detection',
  },
  {
    id: 'dataset-003',
    name: 'product_inference_batch',
    description: 'Daily batch dataset for product recommendation inference',
    entityId: 'entity-002',
    snapshotDate: '2024-12-09',
    rowCount: 500000,
    created: '2024-12-09T06:00:00Z',
    tags: ['domain=loan', 'use_case=inference'],
    featureStore: 'Product recommendations',
  },
  {
    id: 'dataset-004',
    name: 'driver_performance_snapshot',
    description: 'Weekly snapshot of driver performance metrics',
    entityId: 'entity-004',
    snapshotDate: '2024-12-08',
    rowCount: 75000,
    created: '2024-12-08T00:00:00Z',
    tags: ['source=credit_bureau', 'team=logistics'],
    featureStore: 'Fraud detection',
  },
];

// ============================================
// Feature Types
// ============================================
export interface Feature {
  id: string;
  name: string;
  description: string;
  valueType: string;
  entityId: string;
  featureViewId: string;
  created: string;
  lastUpdated: string;
  tags: string[];
  featureStore: string;
}

export const mockFeatures: Feature[] = [
  {
    id: 'feature-001',
    name: 'credit_card_due',
    description: 'Current credit card balance due amount',
    valueType: 'FLOAT64',
    entityId: 'entity-001',
    featureViewId: 'fv-001',
    created: '2024-01-20T08:00:00Z',
    lastUpdated: '2024-12-05T14:22:00Z',
    tags: ['domain=demographics', 'type=numeric'],
    featureStore: 'Fraud detection',
  },
  {
    id: 'feature-002',
    name: 'person_income',
    description: 'Annual income of the person',
    valueType: 'FLOAT64',
    entityId: 'entity-001',
    featureViewId: 'fv-001',
    created: '2024-01-20T08:00:00Z',
    lastUpdated: '2024-12-06T10:30:00Z',
    tags: ['term=credit', 'type=numeric'],
    featureStore: 'Customer analytics',
  },
  {
    id: 'feature-003',
    name: 'transaction_count_7d',
    description: 'Number of transactions in the last 7 days',
    valueType: 'INT64',
    entityId: 'entity-003',
    featureViewId: 'fv-002',
    created: '2024-03-15T12:00:00Z',
    lastUpdated: '2024-12-09T11:30:00Z',
    tags: ['domain=loan', 'type=aggregation'],
    featureStore: 'Fraud detection',
  },
  {
    id: 'feature-004',
    name: 'avg_order_value',
    description: 'Average order value over lifetime',
    valueType: 'FLOAT64',
    entityId: 'entity-005',
    featureViewId: 'fv-003',
    created: '2024-05-20T11:45:00Z',
    lastUpdated: '2024-12-09T08:00:00Z',
    tags: ['source=credit_bureau', 'type=aggregation'],
    featureStore: 'Product recommendations',
  },
];

// ============================================
// Feature View Types
// ============================================
export interface FeatureView {
  id: string;
  name: string;
  description: string;
  entityIds: string[];
  featureCount: number;
  dataSourceId: string;
  created: string;
  lastUpdated: string;
  tags: string[];
  featureStore: string;
}

export const mockFeatureViews: FeatureView[] = [
  {
    id: 'fv-001',
    name: 'user_transaction_aggregates',
    description: 'Aggregated transaction features for user behavior analysis',
    entityIds: ['entity-001', 'entity-003'],
    featureCount: 12,
    dataSourceId: 'ds-001',
    created: '2024-02-01T08:00:00Z',
    lastUpdated: '2024-12-05T14:22:00Z',
    tags: ['domain=demographics', 'use_case=fraud'],
    featureStore: 'Fraud detection',
  },
  {
    id: 'fv-002',
    name: 'product_similarity_scores',
    description: 'Pre-computed product similarity scores for recommendations',
    entityIds: ['entity-002'],
    featureCount: 8,
    dataSourceId: 'ds-004',
    created: '2024-03-10T10:00:00Z',
    lastUpdated: '2024-12-08T09:45:00Z',
    tags: ['term=credit', 'use_case=recommendations'],
    featureStore: 'Product recommendations',
  },
  {
    id: 'fv-003',
    name: 'customer_churn_indicators',
    description: 'Features indicating likelihood of customer churn',
    entityIds: ['entity-001'],
    featureCount: 15,
    dataSourceId: 'ds-001',
    created: '2024-04-15T12:00:00Z',
    lastUpdated: '2024-12-07T16:15:00Z',
    tags: ['domain=loan', 'use_case=churn'],
    featureStore: 'Customer analytics',
  },
  {
    id: 'fv-004',
    name: 'revenue_trend_features',
    description: 'Revenue trend analysis features for forecasting',
    entityIds: ['entity-005'],
    featureCount: 10,
    dataSourceId: 'ds-002',
    created: '2024-05-20T09:00:00Z',
    lastUpdated: '2024-12-09T08:00:00Z',
    tags: ['source=credit_bureau', 'use_case=forecasting'],
    featureStore: 'Product recommendations',
  },
];

// ============================================
// Feature Service Types
// ============================================
export interface FeatureService {
  id: string;
  name: string;
  description: string;
  featureViewIds: string[];
  endpoint: string;
  status: 'active' | 'inactive' | 'deploying';
  created: string;
  lastUpdated: string;
  tags: string[];
  featureStore: string;
}

export const mockFeatureServices: FeatureService[] = [
  {
    id: 'fs-001',
    name: 'fraud_detection_service',
    description: 'Real-time fraud detection feature serving endpoint',
    featureViewIds: ['fv-001', 'fv-002'],
    endpoint: 'https://api.example.com/features/fraud',
    status: 'active',
    created: '2024-03-01T08:00:00Z',
    lastUpdated: '2024-12-05T14:22:00Z',
    tags: ['domain=demographics', 'env=production'],
    featureStore: 'Fraud detection',
  },
  {
    id: 'fs-002',
    name: 'recommendation_engine',
    description: 'Product recommendation feature service',
    featureViewIds: ['fv-002', 'fv-004'],
    endpoint: 'https://api.example.com/features/recommendations',
    status: 'active',
    created: '2024-04-15T10:00:00Z',
    lastUpdated: '2024-12-08T09:45:00Z',
    tags: ['term=credit', 'env=production'],
    featureStore: 'Product recommendations',
  },
  {
    id: 'fs-003',
    name: 'churn_prediction_api',
    description: 'Customer churn prediction feature endpoint',
    featureViewIds: ['fv-003'],
    endpoint: 'https://api.example.com/features/churn',
    status: 'active',
    created: '2024-05-20T12:00:00Z',
    lastUpdated: '2024-12-07T16:15:00Z',
    tags: ['domain=loan', 'env=production'],
    featureStore: 'Customer analytics',
  },
  {
    id: 'fs-004',
    name: 'batch_inference_service',
    description: 'Batch feature serving for offline inference jobs',
    featureViewIds: ['fv-001', 'fv-003', 'fv-004'],
    endpoint: 'https://api.example.com/features/batch',
    status: 'active',
    created: '2024-06-01T09:00:00Z',
    lastUpdated: '2024-12-09T08:00:00Z',
    tags: ['source=credit_bureau', 'env=production'],
    featureStore: 'Fraud detection',
  },
];

// ============================================
// Recently Viewed Resources
// ============================================
export interface RecentlyViewedResource {
  id: string;
  name: string;
  resourceType: 'Entity' | 'Data source' | 'Dataset' | 'Feature' | 'Feature View' | 'Feature Service';
  lastViewed: string;
  featureStore: string;
}

export const mockRecentlyViewed: RecentlyViewedResource[] = [
  {
    id: 'entity-001',
    name: 'dob_ssn',
    resourceType: 'Entity',
    lastViewed: '2024-12-09T14:30:00Z', // 2 minutes ago
    featureStore: 'Fraud detection',
  },
  {
    id: 'ds-002',
    name: 'loan_table',
    resourceType: 'Data source',
    lastViewed: '2024-12-09T14:22:00Z', // 10 minutes ago
    featureStore: 'Fraud detection',
  },
  {
    id: 'feature-001',
    name: 'credit_card_due',
    resourceType: 'Feature',
    lastViewed: '2024-12-09T13:32:00Z', // 1 hour ago
    featureStore: 'Fraud detection',
  },
  {
    id: 'feature-002',
    name: 'person_income',
    resourceType: 'Feature',
    lastViewed: '2024-12-08T14:32:00Z', // 1 day ago
    featureStore: 'Customer analytics',
  },
  {
    id: 'fv-003',
    name: 'credit_history',
    resourceType: 'Feature View',
    lastViewed: '2024-11-09T14:32:00Z', // 1 month ago
    featureStore: 'Fraud detection',
  },
  {
    id: 'entity-002',
    name: 'Product',
    resourceType: 'Entity',
    lastViewed: '2024-12-09T12:00:00Z',
    featureStore: 'Product recommendations',
  },
  {
    id: 'ds-003',
    name: 'transaction_stream',
    resourceType: 'Data source',
    lastViewed: '2024-12-09T11:30:00Z',
    featureStore: 'Fraud detection',
  },
  {
    id: 'fv-001',
    name: 'user_transaction_aggregates',
    resourceType: 'Feature View',
    lastViewed: '2024-12-09T10:00:00Z',
    featureStore: 'Fraud detection',
  },
  {
    id: 'fs-001',
    name: 'fraud_detection_service',
    resourceType: 'Feature Service',
    lastViewed: '2024-12-09T09:00:00Z',
    featureStore: 'Fraud detection',
  },
  {
    id: 'dataset-001',
    name: 'customer_training_2024',
    resourceType: 'Dataset',
    lastViewed: '2024-12-08T16:00:00Z',
    featureStore: 'Customer analytics',
  },
  {
    id: 'entity-003',
    name: 'Transaction',
    resourceType: 'Entity',
    lastViewed: '2024-12-08T14:00:00Z',
    featureStore: 'Fraud detection',
  },
  {
    id: 'feature-003',
    name: 'transaction_count_7d',
    resourceType: 'Feature',
    lastViewed: '2024-12-08T12:00:00Z',
    featureStore: 'Fraud detection',
  },
  {
    id: 'fv-002',
    name: 'product_similarity_scores',
    resourceType: 'Feature View',
    lastViewed: '2024-12-08T10:00:00Z',
    featureStore: 'Product recommendations',
  },
  {
    id: 'ds-004',
    name: 'product_catalog',
    resourceType: 'Data source',
    lastViewed: '2024-12-07T16:00:00Z',
    featureStore: 'Product recommendations',
  },
  {
    id: 'fs-002',
    name: 'recommendation_engine',
    resourceType: 'Feature Service',
    lastViewed: '2024-12-07T14:00:00Z',
    featureStore: 'Product recommendations',
  },
  {
    id: 'entity-004',
    name: 'Driver',
    resourceType: 'Entity',
    lastViewed: '2024-12-07T12:00:00Z',
    featureStore: 'Fraud detection',
  },
  {
    id: 'dataset-002',
    name: 'fraud_validation_q4',
    resourceType: 'Dataset',
    lastViewed: '2024-12-07T10:00:00Z',
    featureStore: 'Fraud detection',
  },
  {
    id: 'feature-004',
    name: 'avg_order_value',
    resourceType: 'Feature',
    lastViewed: '2024-12-06T16:00:00Z',
    featureStore: 'Product recommendations',
  },
  {
    id: 'fv-004',
    name: 'revenue_trend_features',
    resourceType: 'Feature View',
    lastViewed: '2024-12-06T14:00:00Z',
    featureStore: 'Product recommendations',
  },
  {
    id: 'entity-005',
    name: 'Order',
    resourceType: 'Entity',
    lastViewed: '2024-12-06T12:00:00Z',
    featureStore: 'Product recommendations',
  },
];

// ============================================
// Popular Tags with Feature Views
// ============================================
export interface PopularTag {
  tagKey: string;
  tagValue: string;
  featureViews: string[];
  totalCount: number;
}

export const mockPopularTags: PopularTag[] = [
  {
    tagKey: 'domain',
    tagValue: 'demographics',
    featureViews: [
      'user_transaction_aggregates',
      'product_similarity_scores',
      'customer_churn_indicators',
      'revenue_trend_features',
      'product_similarity_scores',
    ],
    totalCount: 8,
  },
  {
    tagKey: 'term',
    tagValue: 'credit',
    featureViews: [
      'user_transaction_aggregates',
      'product_similarity_scores',
      'customer_churn_indicators',
      'revenue_trend_features',
      'product_similarity_scores',
    ],
    totalCount: 6,
  },
  {
    tagKey: 'domain',
    tagValue: 'loan',
    featureViews: [
      'user_transaction_aggregates',
      'customer_churn_indicators',
      'revenue_trend_features',
      'product_similarity_scores',
      'product_similarity_scores',
    ],
    totalCount: 5,
  },
  {
    tagKey: 'source',
    tagValue: 'credit_bureau',
    featureViews: [
      'user_transaction_aggregates',
      'product_similarity_scores',
      'customer_churn_indicators',
    ],
    totalCount: 3,
  },
];

// ============================================
// Resource Summary Counts (Dynamic)
// ============================================
export const getResourceCounts = () => ({
  entities: mockEntities.length,
  dataSources: mockDataSources.length,
  datasets: mockDatasets.length,
  features: mockFeatures.length,
  featureViews: mockFeatureViews.length,
  featureServices: mockFeatureServices.length,
});

// ============================================
// Helper: Format relative time
// ============================================
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
};

