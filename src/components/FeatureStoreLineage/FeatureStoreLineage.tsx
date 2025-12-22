import * as React from 'react';
import { useState, useMemo, useCallback, useRef } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateActions,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  SearchInput,
  Switch,
  Popover,
  Button,
  List,
  ListItem,
  Flex,
  FlexItem,
  Title,
} from '@patternfly/react-core';
import { SearchIcon, TimesIcon, PlusIcon, MinusIcon, ExpandIcon, CompressIcon } from '@patternfly/react-icons';
import {
  generateLineageData,
  LineageNode as LineageNodeType,
} from '../../mockData/featureStore';

// ============================================
// Custom SVG Icons (matching Overview page)
// ============================================
const EntitiesIcon = () => (
  <svg viewBox="0 0 36 36" fill="currentColor" width="16" height="16">
    <path d="M28.125,9c0-1.99902-1.62598-3.625-3.625-3.625s-3.625,1.62598-3.625,3.625c0,1.78497,1.29919,3.26373,3,3.56177v2.43823c0,1.30957-1.06543,2.375-2.375,2.375h-6c-1.33502,0-2.53003.57721-3.375,1.48492v-8.29816c1.70081-.29803,3-1.77679,3-3.56177,0-1.99902-1.62598-3.625-3.625-3.625s-3.625,1.62598-3.625,3.625c0,1.78497,1.29919,3.26373,3,3.56177v14.87646c-1.70081.29803-3,1.77679-3,3.56177,0,1.99902,1.62598,3.625,3.625,3.625s3.625-1.62598,3.625-3.625c0-1.78497-1.29919-3.26373-3-3.56177v-3.43823c0-1.86133,1.51416-3.375,3.375-3.375h6c1.99902,0,3.625-1.62598,3.625-3.625v-2.43823c1.70081-.29803,3-1.77679,3-3.56177ZM9.125,7c0-1.30957,1.06543-2.375,2.375-2.375s2.375,1.06543,2.375,2.375-1.06543,2.375-2.375,2.375-2.375-1.06543-2.375-2.375ZM13.875,29c0,1.30957-1.06543,2.375-2.375,2.375s-2.375-1.06543-2.375-2.375,1.06543-2.375,2.375-2.375,2.375,1.06543,2.375,2.375ZM24.5,11.375c-1.30957,0-2.375-1.06543-2.375-2.375s1.06543-2.375,2.375-2.375,2.375,1.06543,2.375,2.375-1.06543,2.375-2.375,2.375Z"></path>
  </svg>
);

const DataSourcesIcon = () => (
  <svg viewBox="0 0 36 36" fill="currentColor" width="16" height="16">
    <path d="M22.8457,16.3933c.1934-.1118.3125-.3184.3125-.5415v-5.2344c0-.2231-.1191-.4297-.3125-.5415l-4.5332-2.6172c-.1934-.1113-.4316-.1113-.625,0l-4.5332,2.6172c-.1934.1118-.3125.3184-.3125.5415v5.2344c0,.2231.1191.4297.3125.5415l4.5332,2.6172c.0967.0557.2046.0835.3125.0835s.2158-.0278.3125-.0835l4.5332-2.6172ZM14.0918,15.491v-4.5127l3.9082-2.2563,3.9082,2.2563v4.5127l-3.9082,2.2563-3.9082-2.2563Z M23.7832,28.5417l4.5332-2.6172c.1934-.1118.3125-.3184.3125-.5415v-5.2349c0-.2231-.1191-.4297-.3125-.5415l-4.5332-2.6172c-.1934-.1113-.4316-.1113-.625,0l-4.5332,2.6172c-.1934.1118-.3125.3184-.3125.5415v5.2349c0,.2231.1191.4297.3125.5415l4.5332,2.6172c.0967.0557.2046.0835.3125.0835s.2158-.0278.3125-.0835ZM19.5625,25.0222v-4.5132l3.9082-2.2563,3.9082,2.2563v4.5132l-3.9082,2.2563s-3.9082-2.2563-3.9082-2.2563Z M12.8418,16.9895c-.1934-.1113-.4316-.1113-.625,0l-4.5332,2.6172c-.1934.1118-.3125.3184-.3125.5415v5.2349c0,.2231.1191.4297.3125.5415l4.5332,2.6172c.0967.0557.2046.0835.3125.0835s.2158-.0278.3125-.0835l4.5332-2.6172c.1934-.1118.3125-.3184.3125-.5415v-5.2349c0-.2231-.1191-.4297-.3125-.5415,0,0-4.5332-2.6172-4.5332-2.6172ZM16.4375,25.0222l-3.9082,2.2563-3.9082-2.2563v-4.5132l3.9082-2.2563,3.9082,2.2563v4.5132Z M12,30.3752h-6.375V5.6252h6.375c.3452,0,.625-.2798.625-.625s-.2798-.625-.625-.625h-7c-.3452,0-.625.2798-.625.625v26c0,.3452.2798.625.625.625h7c.3452,0,.625-.2798.625-.625s-.2798-.625-.625-.625Z M31,4.3752h-7c-.3452,0-.625.2798-.625.625s.2798.625.625.625h6.375v24.75h-6.375c-.3452,0-.625.2798-.625.625s.2798.625.625.625h7c.3452,0,.625-.2798.625-.625V5.0002c0-.3452-.2798-.625-.625-.625Z"></path>
  </svg>
);

const FeatureViewsIcon = () => (
  <svg viewBox="0 0 36 36" fill="currentColor" width="16" height="16">
    <path d="M25.625,22v-14c0-.34473-.27979-.625-.625-.625H5c-.34521,0-.625.28027-.625.625v14c0,.34473.27979.625.625.625h20c.34521,0,.625-.28027.625-.625ZM24.375,21.375H5.625v-12.75h18.75v12.75Z M28.625,25v-14c0-.34473-.27979-.625-.625-.625s-.625.28027-.625.625v13.375H8c-.34521,0-.625.28027-.625.625s.27979.625.625.625h20c.34521,0,.625-.28027.625-.625Z M31,13.375c-.34521,0-.625.28027-.625.625v13.375H11c-.34521,0-.625.28027-.625.625s.27979.625.625.625h20c.34521,0,.625-.28027.625-.625v-14c0-.34473-.27979-.625-.625-.625Z"></path>
  </svg>
);

const FeatureServicesIcon = () => (
  <svg viewBox="0 0 36 36" fill="currentColor" width="16" height="16">
    <path d="M16,7.375H5c-.34521,0-.625.28027-.625.625v8c0,.34473.27979.625.625.625h11c.34521,0,.625-.28027.625-.625v-8c0-.34473-.27979-.625-.625-.625ZM15.375,15.375H5.625v-6.75h9.75v6.75Z M31,7.375h-11c-.34521,0-.625.28027-.625.625v8c0,.34473.27979.625.625.625h11c.34521,0,.625-.28027.625-.625v-8c0-.34473-.27979-.625-.625-.625ZM30.375,15.375h-9.75v-6.75h9.75v6.75Z M16,19.375H5c-.34521,0-.625.28027-.625.625v8c0,.34473.27979.625.625.625h11c.34521,0,.625-.28027.625-.625v-8c0-.34473-.27979-.625-.625-.625ZM15.375,27.375H5.625v-6.75h9.75v6.75Z M31,19.375h-11c-.34521,0-.625.28027-.625.625v8c0,.34473.27979.625.625.625h11c.34521,0,.625-.28027.625-.625v-8c0-.34473-.27979-.625-.625-.625ZM30.375,27.375h-9.75v-6.75h9.75v6.75Z"></path>
  </svg>
);

// ============================================
// Node Color Themes - Icons use colored outlines only
// ============================================
const NODE_COLORS = {
  entity: {
    iconColor: '#f0ab00', // Gold/Orange for entity icons
  },
  dataSource: {
    iconColor: '#0066cc', // Blue for data source icons
  },
  featureView: {
    iconColor: '#6753ac', // Purple for feature view icons
  },
  featureService: {
    iconColor: '#3e8635', // Green for feature service icons
  },
};

// Default node styling
const DEFAULT_NODE_BORDER = '#d2d2d2';
const SELECTED_NODE_BORDER = '#0066cc';
const HIGHLIGHTED_NODE_BORDER = '#0066cc';

// ============================================
// Types for positioned nodes
// ============================================
interface PositionedNode {
  node: LineageNodeType;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PositionedEdge {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

// ============================================
// Main Lineage Component
// ============================================
interface FeatureStoreLineageProps {
  selectedFeatureStore: string;
}

export const FeatureStoreLineage: React.FC<FeatureStoreLineageProps> = ({ selectedFeatureStore }) => {
  // State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [isEntityFilterOpen, setIsEntityFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hideUnconnected, setHideUnconnected] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [popoverNode, setPopoverNode] = useState<LineageNodeType | null>(null);
  
  // Generate lineage data
  const lineageData = useMemo(() => {
    if (selectedFeatureStore === 'All feature stores') {
      return { nodes: [], edges: [] };
    }
    return generateLineageData(selectedFeatureStore);
  }, [selectedFeatureStore]);
  
  // Get entity options for filter
  const entityOptions = useMemo(() => {
    const entities = lineageData.nodes.filter(n => n.type === 'entity');
    return ['all', ...entities.map(e => e.label.replace('Entity: ', ''))];
  }, [lineageData]);
  
  // Calculate connected paths - this is the highlighted path when a node is selected
  // Inline implementation for proper path finding
  const highlightedPath = useMemo(() => {
    if (!selectedNodeId) {
      return { nodes: new Set<string>(), edges: new Set<string>() };
    }
    
    const edges = lineageData.edges;
    const connectedNodes = new Set<string>();
    const connectedEdgeIds = new Set<string>();
    
    // Build adjacency maps
    const forwardMap = new Map<string, Array<{ target: string; edgeId: string }>>();
    const backwardMap = new Map<string, Array<{ source: string; edgeId: string }>>();
    
    edges.forEach(edge => {
      // Forward: source -> targets (for downstream)
      if (!forwardMap.has(edge.source)) {
        forwardMap.set(edge.source, []);
      }
      forwardMap.get(edge.source)!.push({ target: edge.target, edgeId: edge.id });
      
      // Backward: target -> sources (for upstream)
      if (!backwardMap.has(edge.target)) {
        backwardMap.set(edge.target, []);
      }
      backwardMap.get(edge.target)!.push({ source: edge.source, edgeId: edge.id });
    });
    
    // BFS to find downstream nodes
    const downstreamQueue = [selectedNodeId];
    const downstreamVisited = new Set<string>([selectedNodeId]);
    
    while (downstreamQueue.length > 0) {
      const current = downstreamQueue.shift()!;
      const targets = forwardMap.get(current) || [];
      
      targets.forEach(({ target, edgeId }) => {
        if (!downstreamVisited.has(target)) {
          downstreamVisited.add(target);
          connectedNodes.add(target);
          connectedEdgeIds.add(edgeId);
          downstreamQueue.push(target);
        }
      });
    }
    
    // BFS to find upstream nodes
    const upstreamQueue = [selectedNodeId];
    const upstreamVisited = new Set<string>([selectedNodeId]);
    
    while (upstreamQueue.length > 0) {
      const current = upstreamQueue.shift()!;
      const sources = backwardMap.get(current) || [];
      
      sources.forEach(({ source, edgeId }) => {
        if (!upstreamVisited.has(source)) {
          upstreamVisited.add(source);
          connectedNodes.add(source);
          connectedEdgeIds.add(edgeId);
          upstreamQueue.push(source);
        }
      });
    }
    
    return { nodes: connectedNodes, edges: connectedEdgeIds };
  }, [selectedNodeId, lineageData.edges]);
  
  // Calculate node positions using a simple left-to-right layout
  const { positionedNodes, positionedEdges, canvasWidth, canvasHeight } = useMemo(() => {
    const nodes: PositionedNode[] = [];
    const edges: PositionedEdge[] = [];
    
    // Group nodes by type for column layout
    const columns: { [key: string]: LineageNodeType[] } = {
      entity: [],
      dataSource: [],
      featureView: [],
      featureService: [],
    };
    
    lineageData.nodes.forEach(node => {
      if (columns[node.type]) {
        columns[node.type].push(node);
      }
    });
    
    // Layout parameters
    const columnGap = 280;
    const rowGap = 80;
    const nodeWidth = 220;
    const nodeHeight = 40;
    const startX = 50;
    const startY = 50;
    
    // Position nodes by column
    const columnOrder = ['entity', 'dataSource', 'featureView', 'featureService'];
    const nodePositions: { [key: string]: { x: number; y: number } } = {};
    
    let maxHeight = 0;
    
    columnOrder.forEach((colType, colIndex) => {
      const colNodes = columns[colType];
      colNodes.forEach((node, rowIndex) => {
        const x = startX + colIndex * (nodeWidth + columnGap);
        const y = startY + rowIndex * (nodeHeight + rowGap);
        
        nodePositions[node.id] = { x, y };
        nodes.push({
          node,
          x,
          y,
          width: nodeWidth,
          height: nodeHeight,
        });
        
        maxHeight = Math.max(maxHeight, y + nodeHeight);
      });
    });
    
    const canvasWidth = startX + columnOrder.length * (nodeWidth + columnGap);
    const canvasHeight = maxHeight + startY;
    
    // Create edges with positions
    lineageData.edges.forEach(edge => {
      const sourcePos = nodePositions[edge.source];
      const targetPos = nodePositions[edge.target];
      
      if (sourcePos && targetPos) {
        edges.push({
          id: edge.id,
          sourceX: sourcePos.x + nodeWidth,
          sourceY: sourcePos.y + nodeHeight / 2,
          targetX: targetPos.x,
          targetY: targetPos.y + nodeHeight / 2,
        });
      }
    });
    
    return { positionedNodes: nodes, positionedEdges: edges, canvasWidth, canvasHeight };
  }, [lineageData]);
  
  // Handle mouse events for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);
  
  // Handle canvas click to deselect
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Only deselect if clicking on canvas background, not on nodes
    const target = e.target as SVGElement;
    if (target.tagName === 'svg' || target.tagName === 'rect' && target.getAttribute('data-canvas') === 'true') {
      setSelectedNodeId(null);
      setPopoverNode(null);
    }
  }, []);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z * 1.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z * 0.8, 0.25));
  const handleFitToScreen = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNodeId(null);
  };
  
  // Get icon for node type
  const getIcon = (type: string) => {
    switch (type) {
      case 'entity':
        return <EntitiesIcon />;
      case 'dataSource':
        return <DataSourcesIcon />;
      case 'featureView':
        return <FeatureViewsIcon />;
      case 'featureService':
        return <FeatureServicesIcon />;
      default:
        return <EntitiesIcon />;
    }
  };
  
  // Show empty state if "All feature stores" is selected
  if (selectedFeatureStore === 'All feature stores') {
    return (
      <EmptyState variant="lg">
        <Title headingLevel="h4" size="lg">
          <SearchIcon style={{ marginRight: '8px' }} />
          Select a Feature Store to view lineage
        </Title>
        <EmptyStateBody>
          The lineage graph shows the data flow relationships between entities, data sources, 
          feature views, and feature services within a specific feature store. 
          Please select a feature store from the dropdown above to visualize its lineage.
        </EmptyStateBody>
      </EmptyState>
    );
  }
  
  // Check if there's any data
  if (lineageData.nodes.length === 0) {
    return (
      <EmptyState variant="lg">
        <Title headingLevel="h4" size="lg">
          No lineage data available
        </Title>
        <EmptyStateBody>
          No entities, data sources, feature views, or feature services were found for the selected feature store.
        </EmptyStateBody>
      </EmptyState>
    );
  }
  
  // Render Feature View popover content
  const renderPopoverContent = (node: LineageNodeType) => (
    <div style={{ maxWidth: '320px' }}>
      {node.data.description && (
        <p style={{ fontSize: '14px', marginBottom: '12px', color: '#6a6e73' }}>
          {node.data.description}
        </p>
      )}
      {node.data.features && node.data.features.length > 0 && (
        <>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Features:</div>
          <List isPlain>
            {node.data.features.slice(0, 6).map((feature: string, idx: number) => (
              <ListItem key={idx} style={{ fontSize: '14px' }}>
                <strong>Feature:</strong> {feature}
              </ListItem>
            ))}
            {node.data.features.length > 6 && (
              <ListItem style={{ fontSize: '14px', fontStyle: 'italic' }}>
                ...and {node.data.features.length - 6} more
              </ListItem>
            )}
          </List>
        </>
      )}
      <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
        <Button variant="link" isInline>View FeatureView detail page</Button>
        <Button variant="link" isInline>View all features</Button>
      </div>
    </div>
  );
  
  return (
    <div style={{ height: 'calc(100vh - 450px)', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Filter Toolbar */}
      <Toolbar style={{ marginBottom: '16px' }}>
        <ToolbarContent>
          <ToolbarItem>
            <Select
              id="entity-filter-lineage"
              isOpen={isEntityFilterOpen}
              onOpenChange={setIsEntityFilterOpen}
              onSelect={(_e, value) => {
                setEntityFilter(value as string);
                setIsEntityFilterOpen(false);
              }}
              selected={entityFilter}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsEntityFilterOpen(!isEntityFilterOpen)}
                  isExpanded={isEntityFilterOpen}
                  style={{ minWidth: '150px' }}
                >
                  Entity {entityFilter !== 'all' ? `• ${entityFilter}` : ''}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="all">All Entities</SelectOption>
                {entityOptions.filter(e => e !== 'all').map(entity => (
                  <SelectOption key={entity} value={entity}>{entity}</SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarItem>
          <ToolbarItem>
            <SearchInput
              placeholder="Find by entity"
              value={searchValue}
              onChange={(_e, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
              style={{ width: '200px' }}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Switch
              id="hide-unconnected-switch-lineage"
              label="Hide objects without relationships"
              isChecked={hideUnconnected}
              onChange={(_e, checked) => setHideUnconnected(checked)}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      
      {/* Canvas Container */}
      <div 
        ref={containerRef}
        style={{ 
          flex: 1, 
          position: 'relative', 
          overflow: 'hidden',
          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
          borderRadius: '8px',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG Canvas */}
        <svg
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onClick={handleCanvasClick}
        >
          {/* Invisible background rect to capture clicks */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="transparent"
            data-canvas="true"
          />
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#d2d2d2" />
            </marker>
            <marker
              id="arrow-highlighted"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0066cc" />
            </marker>
          </defs>
          
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Render Edges */}
            {positionedEdges.map((edge) => {
              const isEdgeHighlighted = selectedNodeId ? highlightedPath.edges.has(edge.id) : false;
              
              // Create a curved path
              const midX = (edge.sourceX + edge.targetX) / 2;
              const path = `M ${edge.sourceX} ${edge.sourceY} C ${midX} ${edge.sourceY}, ${midX} ${edge.targetY}, ${edge.targetX} ${edge.targetY}`;
              
              return (
                <path
                  key={edge.id}
                  d={path}
                  stroke={isEdgeHighlighted ? '#0066cc' : '#d2d2d2'}
                  strokeWidth={isEdgeHighlighted ? 2 : 1}
                  fill="none"
                  markerEnd={isEdgeHighlighted ? 'url(#arrow-highlighted)' : 'url(#arrow-default)'}
                />
              );
            })}
            
            {/* Render Nodes */}
            {positionedNodes.map(({ node, x, y, width, height }) => {
              const colors = NODE_COLORS[node.type as keyof typeof NODE_COLORS] || NODE_COLORS.entity;
              const isSelected = node.id === selectedNodeId;
              const isConnected = selectedNodeId ? highlightedPath.nodes.has(node.id) : false;
              
              // Determine styling based on state:
              // - Selected: Blue filled background, white text/icons (PatternFly selected state)
              // - Connected: Blue border outline with hover-like appearance
              // - Default: Gray border, white background, colored icons
              let fillColor = 'white';
              let borderColor = DEFAULT_NODE_BORDER;
              let borderWidth = 1;
              let textColor = '#151515';
              let iconColor = colors.iconColor;
              let badgeFill = '#f0f0f0';
              let badgeTextColor = '#6a6e73';
              let showOuterGlow = false;
              
              if (isSelected) {
                // Selected state: Blue filled background with white text/icons
                fillColor = '#0066cc';
                borderColor = '#0066cc';
                borderWidth = 2;
                textColor = 'white';
                iconColor = 'white';
                badgeFill = 'rgba(255, 255, 255, 0.2)';
                badgeTextColor = 'white';
              } else if (isConnected) {
                // Connected state: Blue border outline (hover-like state)
                borderColor = '#0066cc';
                borderWidth = 2;
                showOuterGlow = true;
              }
              
              // Truncate label if too long
              const maxLabelLength = 25;
              const displayLabel = node.label.length > maxLabelLength 
                ? node.label.slice(0, maxLabelLength) + '...' 
                : node.label;
              
              const nodeContent = (
                <g
                  key={node.id}
                  transform={`translate(${x}, ${y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent canvas click handler
                    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
                    if (node.type === 'featureView') {
                      setPopoverNode(node.id === selectedNodeId ? null : node);
                    } else {
                      setPopoverNode(null);
                    }
                  }}
                >
                  {/* Outer glow for connected nodes (hover-like effect) */}
                  {showOuterGlow && (
                    <rect
                      x={-3}
                      y={-3}
                      width={width + 6}
                      height={height + 6}
                      rx={(height + 6) / 2}
                      ry={(height + 6) / 2}
                      fill="none"
                      stroke="rgba(0, 102, 204, 0.3)"
                      strokeWidth={4}
                    />
                  )}
                  {/* Pill background */}
                  <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    rx={height / 2}
                    ry={height / 2}
                    fill={fillColor}
                    stroke={borderColor}
                    strokeWidth={borderWidth}
                  />
                  
                  {/* Icon - uses iconColor based on state */}
                  <foreignObject x={8} y={height / 2 - 10} width={20} height={20}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
                      {getIcon(node.type)}
                    </div>
                  </foreignObject>
                  
                  {/* Label */}
                  <text
                    x={32}
                    y={height / 2}
                    dominantBaseline="middle"
                    style={{ fontSize: '12px', fill: textColor }}
                  >
                    {displayLabel}
                  </text>
                  
                  {/* Feature count badge for Feature View nodes */}
                  {node.data.featureCount !== undefined && (
                    <g transform={`translate(${width - 65}, ${height / 2 - 10})`}>
                      <rect
                        x={0}
                        y={0}
                        width={55}
                        height={20}
                        rx={10}
                        ry={10}
                        fill={badgeFill}
                      />
                      <text
                        x={27}
                        y={14}
                        textAnchor="middle"
                        style={{ fontSize: '10px', fill: badgeTextColor }}
                      >
                        {node.data.featureCount} features
                      </text>
                    </g>
                  )}
                </g>
              );
              
              return nodeContent;
            })}
          </g>
        </svg>
        
        {/* Zoom Controls - Horizontal layout */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          padding: '4px',
        }}>
          <Button variant="plain" onClick={handleZoomIn} title="Zoom in">
            <PlusIcon />
          </Button>
          <Button variant="plain" onClick={handleZoomOut} title="Zoom out">
            <MinusIcon />
          </Button>
          <Button variant="plain" onClick={handleFitToScreen} title="Fit to screen">
            <CompressIcon />
          </Button>
          <Button variant="plain" onClick={handleReset} title="Reset view">
            <ExpandIcon />
          </Button>
        </div>
        
        {/* Feature View Popover */}
        {popoverNode && popoverNode.type === 'featureView' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            padding: '16px',
            maxWidth: '400px',
            zIndex: 100,
          }}>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
              <FlexItem>
                <Title headingLevel="h4" size="md">{popoverNode.label}</Title>
              </FlexItem>
              <FlexItem>
                <Button variant="plain" onClick={() => setPopoverNode(null)}>
                  <TimesIcon />
                </Button>
              </FlexItem>
            </Flex>
            {renderPopoverContent(popoverNode)}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureStoreLineage;
