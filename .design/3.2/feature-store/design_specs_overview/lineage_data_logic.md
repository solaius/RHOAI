# Feature Store Lineage - Data Model & Generation Logic

## 1. Node Data Structure
The mock data must include specific fields to support the UI badges and popovers.

```typescript
export type NodeType = 'entity' | 'dataSource' | 'featureView' | 'featureService';

export interface LineageNode {
  id: string;
  type: NodeType;
  label: string;
  data: {
    description?: string; // For Popover
    // Specific to Feature View
    features?: string[]; // List of feature names (e.g. ['age', 'income'])
    featureCount?: number; // Used for the Badge (e.g. 6)
    // Specific to Data Source
    sourceType?: 'Batch' | 'Stream' | 'Request';
  };
}

export interface LineageEdge {
  id: string;
  source: string;
  target: string;
}

export interface LineageGraphData {
  nodes: LineageNode[];
  edges: LineageEdge[];
}