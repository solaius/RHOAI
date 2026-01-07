import * as React from 'react';
import { useState, useMemo, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
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
  Tooltip,
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

// Node layout constants - PatternFly strict standards
const NODE_PADDING_HORIZONTAL = 8; // Edge padding (left and right)
const NODE_PADDING_VERTICAL = 4; // Vertical padding (top and bottom)
const ELEMENT_GAP = 8; // Gap between Icon, Text, and Badge
const ICON_SIZE = 24; // Icon size (standard PF icon size)
const BADGE_HEIGHT = 24; // Fixed badge height
const MAX_NODE_WIDTH = 184; // Maximum node width before truncation
const WIDTH_BUFFER = 4; // Breathing room buffer to prevent CSS truncation for short text due to sub-pixel font rendering
const ZOOM_THRESHOLD = 0.7; // Zoom threshold for condensed view (scale < 0.7)
const CONDENSED_NODE_SIZE = 32; // Fixed size for condensed (circular) nodes

// Canvas for text measurement (created once and reused)
let textMeasurementCanvas: HTMLCanvasElement | null = null;
const getTextMeasurementCanvas = (): HTMLCanvasElement => {
  if (!textMeasurementCanvas) {
    textMeasurementCanvas = document.createElement('canvas');
  }
  return textMeasurementCanvas;
};

// Helper function to measure text width using canvas
// CRITICAL: Must use PatternFly font family to match rendered UI
const measureTextWidth = (text: string, fontSize: string, fontWeight: number): number => {
  const canvas = getTextMeasurementCanvas();
  const context = canvas.getContext('2d');
  if (!context) return text.length * 7; // Fallback estimate
  
  // Use PatternFly font stack to match actual rendered text
  // PatternFly uses "Red Hat Text" and "Red Hat Display" fonts
  const fontFamily = '"Red Hat Text", "Red Hat Display", sans-serif';
  context.font = `${fontWeight} ${fontSize} ${fontFamily}`;
  return context.measureText(text).width;
};

// PatternFly typography classes
// body-small-semibold: font-size: 12px, line-height: 18px, font-weight: 600
// body-small-regular: font-size: 12px, line-height: 18px, font-weight: 400
const BODY_SMALL_REGULAR_STYLE = { fontSize: '12px', lineHeight: '18px', fontWeight: 400 };
const BODY_SMALL_SEMIBOLD_STYLE = { fontSize: '12px', lineHeight: '18px', fontWeight: 600 };

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
// Node Content Sub-Component (Unified Render Path)
// ============================================
interface NodeContentProps {
  nodeType: string;
  nodeWidth: number;
  resourceType: string;
  resourceName: string;
  iconColor: string;
  textColor: string;
  hasBadge: boolean;
  isSelected: boolean;
  featureCount?: number;
}

// Unified node content component - used in both standard and hovered/selected views
// This guarantees identical behavior for all node types including entities
const NodeContent: React.FC<NodeContentProps> = ({
  nodeType,
  nodeWidth,
  resourceType,
  resourceName,
  iconColor,
  textColor,
  hasBadge,
  isSelected,
  featureCount,
}) => {
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

  return (
    <foreignObject 
      width={nodeWidth} 
      height={29} 
      x={0} 
      y={0}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        padding: '0 8px',
        boxSizing: 'border-box',
        width: '100%',
        pointerEvents: 'auto', // Ensure pointer events work for tooltip
      }}>
        {/* Icon */}
        <div style={{ 
          flexShrink: 0, 
          width: 24, 
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          marginRight: '4px', // 4px gap between icon and text
        }}> 
          {getIcon(nodeType)} 
        </div>

        {/* Text Group - Unified render path for all node types */}
        {/* Type span: Always 600 (Semi-Bold), Name span: Always 400 (Regular) for ALL node types */}
        <div style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flexGrow: 1,
          fontSize: '12px',
          lineHeight: '29px',
          color: textColor,
          // Ensure no font-weight is applied to parent - only to individual spans
        }}>
          {resourceType && (
            <span style={{ fontWeight: 600 }}>{resourceType} </span>
          )}
          <span style={{ fontWeight: 400 }}>
            {resourceName}
          </span>
        </div>

        {/* Badge */}
        {hasBadge && (
          <div style={{
            flexShrink: 0,
            height: '16px',
            padding: '0 8px',
            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : '#d2d2d2',
            color: isSelected ? 'white' : '#151515',
            borderRadius: '8px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '16px',
            marginLeft: '8px', // 8px gap between text and badge
          }}>
            {featureCount} features
          </div>
        )}
      </div>
    </foreignObject>
  );
};

// ============================================
// Main Lineage Component
// ============================================
interface FeatureStoreLineageProps {
  selectedFeatureStore: string;
}

export const FeatureStoreLineage: React.FC<FeatureStoreLineageProps> = ({ selectedFeatureStore }) => {
  const navigate = useNavigate();
  
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
  // Popover state - only store the node ID, position calculated dynamically based on pan/zoom
  const [popoverNodeId, setPopoverNodeId] = useState<string | null>(null);
  // Popover position state - updated via useLayoutEffect for smooth positioning
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number; showBelow: boolean } | null>(null);
  
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredCondensedNodeId, setHoveredCondensedNodeId] = useState<string | null>(null);
  
  // Derived state: determine if we're in condensed view based on zoom threshold
  // Use explicit comparison to ensure all nodes switch when threshold is hit
  const isCondensedView = zoom < ZOOM_THRESHOLD;
  
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
  
  // Helper function to measure badge width
  const measureBadgeWidth = useCallback((featureCount: number): number => {
    const badgeText = `${featureCount} features`;
    // Badge text uses 10px font size
    return measureTextWidth(badgeText, '10px', 400) + 16; // Add padding (8px each side)
  }, []);
  
  // Helper function to calculate node width and truncation using strict PatternFly algorithm
  const calculateNodeLayout = useCallback((node: LineageNodeType): {
    nodeWidth: number;
    displayText: string;
    badgeWidth: number;
    isTruncated: boolean;
  } => {
      const hasBadge = node.data.featureCount !== undefined;
      
      // Measure badge width if present
      const badgePixelWidth = hasBadge ? measureBadgeWidth(node.data.featureCount!) : 0;
      
      // Measure full text width - MUST match rendering exactly
      // Type label: Always fontWeight 600 (Semi-Bold)
      // Name: Always fontWeight 400 (Regular) for ALL node types including entities
      const labelParts = node.label.split(': ');
      const resourceType = labelParts.length > 1 ? labelParts[0] + ':' : '';
      const resourceName = labelParts.length > 1 ? labelParts.slice(1).join(': ') : node.label;
      
      // CRITICAL: Measure type and name separately with correct font weights
      // The rendering shows: <span>{resourceType} </span><span>{resourceName}</span>
      // resourceType already includes the colon (e.g., "Entity:"), so we add space to match rendering
      // MUST include colon in measurement - it's part of resourceType
      const typeText = resourceType ? resourceType + ' ' : ''; // Includes colon and space: "Entity: "
      const typeWidth = typeText ? measureTextWidth(typeText, '12px', 600) : 0;
      
      // Name is ALWAYS 400 (Regular) for all node types
      const nameWidth = measureTextWidth(resourceName, '12px', 400);
      
      // Total text width = type width + name width (no extra gap, they're adjacent)
      const textPixelWidth = typeWidth + nameWidth;
      
      // Calculate content width: Padding(8) + Icon(24) + Gap(4) + text + Gap(8) + badge + Padding(8)
      // Icon-text gap is 4px, text-badge gap is 8px
      const iconTextGap = 4; // Gap between icon and text
      const textBadgeGap = ELEMENT_GAP; // Gap between text and badge (8px)
      const contentWidth = NODE_PADDING_HORIZONTAL + ICON_SIZE + iconTextGap + 
                          textPixelWidth + (hasBadge ? textBadgeGap + badgePixelWidth : 0) + 
                          NODE_PADDING_HORIZONTAL;
      
      // Case A: Short Text (contentWidth <= maxWidth - 12px buffer)
      // Use 12px safety buffer to force tooltip if text is even close to the edge
      // This prevents "dead zones" where text is cut off without a tooltip
      // Increased to 12px to account for font loading race conditions
      // (Canvas may measure with Arial fallback before "Red Hat Text" loads, causing width mismatch)
      const TRUNCATION_BUFFER = 12; // 12px buffer to ensure tooltip appears (aggressive for font loading)
      if (contentWidth <= (MAX_NODE_WIDTH - TRUNCATION_BUFFER)) {
        // Add breathing room buffer to prevent CSS truncation for short text
        // If math measures 100px but browser renders 101px (sub-pixel rendering),
        // the 4px buffer ensures the container is wide enough to avoid CSS truncation
        const idealWidth = contentWidth + WIDTH_BUFFER;
        const finalNodeWidth = Math.min(idealWidth, MAX_NODE_WIDTH);
        return {
          nodeWidth: finalNodeWidth,
          displayText: node.label,
          badgeWidth: badgePixelWidth,
          isTruncated: false,
        };
      }
      
      // Case B: Long Text (contentWidth > 184px)
      // CSS will handle truncation with ellipsis, so we just return max width
      // The full label will be used in HTML rendering, and CSS text-overflow will truncate it
      return {
        nodeWidth: MAX_NODE_WIDTH,
        displayText: node.label, // Full label - CSS handles truncation
        badgeWidth: badgePixelWidth,
        isTruncated: true,
      };
    }, [measureBadgeWidth]);
  
  // Legacy function for backward compatibility - now uses new layout calculation
  const calculateNodeWidth = useCallback((node: LineageNodeType): number => {
    return calculateNodeLayout(node).nodeWidth;
  }, [calculateNodeLayout]);
  
  // Calculate node positions using a simple left-to-right layout
  const { positionedNodes, positionedEdges, canvasWidth, canvasHeight } = useMemo(() => {
    const nodes: PositionedNode[] = [];
    const edges: PositionedEdge[] = [];
    
    // Filter nodes: if hideUnconnected is true, only show nodes that have connections
    let filteredNodes = lineageData.nodes;
    if (hideUnconnected) {
      // Build a set of node IDs that have connections (appear as source or target in edges)
      const connectedNodeIds = new Set<string>();
      lineageData.edges.forEach(edge => {
        connectedNodeIds.add(edge.source);
        connectedNodeIds.add(edge.target);
      });
      // Filter to only include nodes that have connections
      filteredNodes = lineageData.nodes.filter(node => connectedNodeIds.has(node.id));
    }
    
    // Group nodes by type for column layout
    const columns: { [key: string]: LineageNodeType[] } = {
      entity: [],
      dataSource: [],
      featureView: [],
      featureService: [],
    };
    
    filteredNodes.forEach(node => {
      if (columns[node.type]) {
        columns[node.type].push(node);
      }
    });
    
    // Layout parameters - adjust spacing for condensed view
    // When zoomed out (condensed view), use tighter spacing to fit more nodes
    const isCondensedLayout = zoom < ZOOM_THRESHOLD;
    // Column gap for horizontal spacing between nodes (slightly increased for better readability)
    const columnGap = isCondensedLayout ? 60 : 70; // Increased spacing for better edge readability
    // Row gap for vertical spacing between nodes
    const rowGap = isCondensedLayout ? 40 : 50; // Increased vertical spacing for better readability
    const nodeHeight = 29; // Fixed height (PatternFly standard)
    // Set margins to 0 - centering will handle positioning with external padding
    // This ensures the bounding box accurately reflects node positions
    const startX = 0; // No internal left margin (centering handles positioning)
    const startY = 0; // No internal top margin (centering handles positioning)
    
    // Position nodes by column
    const columnOrder = ['entity', 'dataSource', 'featureView', 'featureService'];
    const nodePositions: { [key: string]: { x: number; y: number } } = {};
    
    let maxHeight = 0;
    
    // First pass: calculate all node widths
    const nodeWidths: { [key: string]: number } = {};
    columnOrder.forEach((colType) => {
      const colNodes = columns[colType];
      colNodes.forEach((node) => {
        nodeWidths[node.id] = calculateNodeWidth(node);
      });
    });
    
    // Calculate max width per column for consistent column spacing
    const maxWidthsPerColumn: { [key: number]: number } = {};
    columnOrder.forEach((colType, colIndex) => {
      const colNodes = columns[colType];
      maxWidthsPerColumn[colIndex] = Math.max(
        ...colNodes.map(node => nodeWidths[node.id]),
        80 // Minimum column width
      );
    });
    
    // Second pass: position nodes with calculated widths
    columnOrder.forEach((colType, colIndex) => {
      const colNodes = columns[colType];
      const currentColumnWidth = maxWidthsPerColumn[colIndex];
      const previousColumnsWidth = columnOrder.slice(0, colIndex).reduce(
        (sum, _, idx) => sum + maxWidthsPerColumn[idx] + columnGap,
        0
      );
      
      colNodes.forEach((node, rowIndex) => {
        const x = startX + previousColumnsWidth;
        const y = startY + rowIndex * (nodeHeight + rowGap);
        const width = nodeWidths[node.id];
        
        nodePositions[node.id] = { x, y };
        nodes.push({
          node,
          x,
          y,
          width,
          height: nodeHeight,
        });
        
        maxHeight = Math.max(maxHeight, y + nodeHeight);
      });
    });
    
    const totalColumnsWidth = columnOrder.reduce(
      (sum, _, idx) => sum + maxWidthsPerColumn[idx] + (idx < columnOrder.length - 1 ? columnGap : 0),
      0
    );
    const canvasWidth = startX + totalColumnsWidth;
    const canvasHeight = maxHeight + startY;
    
    // Create edges with positions - only include edges between visible nodes
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    lineageData.edges.forEach(edge => {
      // Only create edge if both source and target nodes are visible
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) {
        return;
      }
      
      const sourcePos = nodePositions[edge.source];
      const targetPos = nodePositions[edge.target];
      
      if (sourcePos && targetPos) {
        const sourceNode = nodes.find(n => n.node.id === edge.source);
        const sourceWidth = sourceNode?.width || 80; // Minimum node width fallback
        edges.push({
          id: edge.id,
          sourceX: sourcePos.x + sourceWidth,
          sourceY: sourcePos.y + nodeHeight / 2,
          targetX: targetPos.x,
          targetY: targetPos.y + nodeHeight / 2,
        });
      }
    });
    
    return { positionedNodes: nodes, positionedEdges: edges, canvasWidth, canvasHeight };
  }, [lineageData, zoom, calculateNodeWidth, hideUnconnected]);
  
  // Calculate popover position using raw transform math - runs on every pan/zoom change
  useLayoutEffect(() => {
    if (!popoverNodeId || !containerRef.current) {
      setPopoverPosition(null);
      return;
    }
    
    // Find the positioned node to get canvas coordinates
    const positionedNode = positionedNodes.find(pn => pn.node.id === popoverNodeId);
    if (!positionedNode) {
      setPopoverPosition(null);
      return;
    }
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Node's center-top position in canvas coordinates
    const nodeCanvasX = positionedNode.x + positionedNode.width / 2;
    const nodeCanvasY = positionedNode.y;
    
    // Calculate absolute screen position using raw transform math
    // Formula: containerOffset + pan + (nodePosition * zoom)
    const absoluteX = containerRect.left + pan.x + (nodeCanvasX * zoom);
    const absoluteY = containerRect.top + pan.y + (nodeCanvasY * zoom);
    
    // Safety check: If popover would go off-screen at top, show below instead
    const headerHeight = 100; // Approximate header height
    const showBelow = absoluteY < headerHeight;
    
    setPopoverPosition({ x: absoluteX, y: absoluteY, showBelow });
  }, [popoverNodeId, pan, zoom, positionedNodes]);
  
  // Auto-center the graph when layout is calculated
  // This ensures the graph is centered in the viewport with padding to account for the floating toolbar
  // Similar to controller.getGraph().fit(80) - centers graph with 80px padding
  const lastLayoutHashRef = useRef<string>('');
  useEffect(() => {
    if (positionedNodes.length === 0 || !containerRef.current) {
      return;
    }
    
    // Create a hash of the layout to detect actual layout changes (not just zoom)
    const layoutHash = `${canvasWidth}-${canvasHeight}-${positionedNodes.length}`;
    if (layoutHash === lastLayoutHashRef.current) {
      return; // Layout hasn't actually changed, skip re-centering
    }
    lastLayoutHashRef.current = layoutHash;
    
    // Use requestAnimationFrame to ensure container dimensions are available
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Calculate the center of the graph content (bounding box)
      const graphCenterX = canvasWidth / 2;
      const graphCenterY = canvasHeight / 2;
      
      // Calculate the center of the viewport
      const viewportCenterX = containerWidth / 2;
      const viewportCenterY = containerHeight / 2;
      
      // Calculate pan offset needed to center the graph
      // Use 80px symmetric padding (mimics controller.getGraph().fit(80))
      // This creates a safe zone around the graph and accounts for the floating toolbar
      const padding = 80;
      const panX = viewportCenterX - graphCenterX * zoom;
      // Center vertically with symmetric padding (no extra offset needed since startY is 0)
      const panY = viewportCenterY - graphCenterY * zoom;
      
      setPan({ x: panX, y: panY });
    });
  }, [positionedNodes.length, canvasWidth, canvasHeight, zoom]); // Auto-center when layout data changes
  
  // Handle mouse events for panning - allow dragging from anywhere on canvas
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if clicking on a node (prevent dragging when clicking nodes)
    const isNodeElement = target.closest('g[data-node]') !== null;
    if (isNodeElement) {
      return; // Let node click handler take over
    }
    
    // Allow dragging if clicking on canvas background, SVG, edges, or when holding spacebar/middle mouse
    const isCanvasBackground = 
      target === e.currentTarget || 
      target.tagName === 'svg' || 
      (target.tagName === 'rect' && target.getAttribute('data-canvas') === 'true') ||
      (target.tagName === 'g' && target.getAttribute('data-edge') === 'true') ||
      (target.tagName === 'path');
    
    // Also allow dragging when holding middle mouse button
    const isMiddleButton = e.button === 1;
    
    if (isCanvasBackground || isMiddleButton) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
      e.stopPropagation();
    }
  }, [pan]);
  
  // Handle canvas click to deselect
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Only deselect if clicking on canvas background, not on nodes
    const target = e.target as SVGElement;
    if (target.tagName === 'svg' || target.tagName === 'rect' && target.getAttribute('data-canvas') === 'true') {
      setSelectedNodeId(null);
      setPopoverNodeId(null);
      setPopoverPosition(null);
    }
  }, []);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      setPan(newPan);
      
      // Update popover position immediately during drag for smooth movement
      // This hooks directly into the pan event loop to minimize lag
      if (popoverNodeId && containerRef.current) {
        const positionedNode = positionedNodes.find(pn => pn.node.id === popoverNodeId);
        if (positionedNode) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const nodeCanvasX = positionedNode.x + positionedNode.width / 2;
          const nodeCanvasY = positionedNode.y;
          const absoluteX = containerRect.left + newPan.x + (nodeCanvasX * zoom);
          const absoluteY = containerRect.top + newPan.y + (nodeCanvasY * zoom);
          const headerHeight = 100;
          const showBelow = absoluteY < headerHeight;
          setPopoverPosition({ x: absoluteX, y: absoluteY, showBelow });
        }
      }
      
      e.preventDefault();
    }
  }, [isDragging, dragStart, popoverNodeId, positionedNodes, zoom]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Helper function to center the graph in the viewport
  const centerGraph = useCallback((targetZoom: number = zoom) => {
    if (!containerRef.current || positionedNodes.length === 0) return;
    
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Calculate the center of the graph content (bounding box)
      const graphCenterX = canvasWidth / 2;
      const graphCenterY = canvasHeight / 2;
      
      // Calculate the center of the viewport
      const viewportCenterX = containerWidth / 2;
      const viewportCenterY = containerHeight / 2;
      
      // Calculate pan offset needed to center the graph
      // Use 80px symmetric padding (mimics controller.getGraph().fit(80))
      const padding = 80;
      const panX = viewportCenterX - graphCenterX * targetZoom;
      const panY = viewportCenterY - graphCenterY * targetZoom;
      
      setPan({ x: panX, y: panY });
    });
  }, [canvasWidth, canvasHeight, positionedNodes.length, zoom]);
  
  // Helper function to handle node click and show popover with screen coordinates
  const handleNodeClick = useCallback((e: React.MouseEvent, node: LineageNodeType) => {
    e.stopPropagation();
    if (isDragging) return;
    
    const isCurrentlySelected = node.id === selectedNodeId;
    setSelectedNodeId(isCurrentlySelected ? null : node.id);
    
    if (isCurrentlySelected) {
      // Close popover if clicking the same node
      setPopoverNodeId(null);
    } else {
      // Store only the node ID - position will be calculated dynamically
      setPopoverNodeId(node.id);
    }
  }, [isDragging, selectedNodeId]);
  
  // Zoom controls
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.25, 3);
    setZoom(newZoom);
    // Update popover position immediately during zoom for smooth movement
    if (popoverNodeId && containerRef.current) {
      const positionedNode = positionedNodes.find(pn => pn.node.id === popoverNodeId);
      if (positionedNode) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const nodeCanvasX = positionedNode.x + positionedNode.width / 2;
        const nodeCanvasY = positionedNode.y;
        const absoluteX = containerRect.left + pan.x + (nodeCanvasX * newZoom);
        const absoluteY = containerRect.top + pan.y + (nodeCanvasY * newZoom);
        const headerHeight = 100;
        const showBelow = absoluteY < headerHeight;
        setPopoverPosition({ x: absoluteX, y: absoluteY, showBelow });
      }
    }
  };
  
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom * 0.8, 0.25);
    setZoom(newZoom);
    // Update popover position immediately during zoom for smooth movement
    if (popoverNodeId && containerRef.current) {
      const positionedNode = positionedNodes.find(pn => pn.node.id === popoverNodeId);
      if (positionedNode) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const nodeCanvasX = positionedNode.x + positionedNode.width / 2;
        const nodeCanvasY = positionedNode.y;
        const absoluteX = containerRect.left + pan.x + (nodeCanvasX * newZoom);
        const absoluteY = containerRect.top + pan.y + (nodeCanvasY * newZoom);
        const headerHeight = 100;
        const showBelow = absoluteY < headerHeight;
        setPopoverPosition({ x: absoluteX, y: absoluteY, showBelow });
      }
    }
  };
  const handleFitToScreen = () => {
    setZoom(1);
    // Center the graph at zoom level 1
    // Use double requestAnimationFrame to ensure layout has recalculated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        centerGraph(1);
      });
    });
  };
  const handleReset = () => {
    setZoom(1);
    setSelectedNodeId(null);
    setPopoverNodeId(null);
    setPopoverPosition(null);
    // Center the graph at zoom level 1
    // Use double requestAnimationFrame to ensure layout has recalculated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        centerGraph(1);
      });
    });
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
  
  // Render popover content for all node types
  const renderPopoverContent = (node: LineageNodeType) => {
    // Extract resource name from label (e.g., "Entity: Customer" -> "Customer")
    const labelParts = node.label.split(': ');
    const resourceName = labelParts.length > 1 ? labelParts.slice(1).join(': ') : node.label;
    
    // Handle navigation to detail page - only for entity nodes
    const handleDetailPageClick = () => {
      if (node.type === 'entity') {
        // Extract entity ID from node.id (format: "entity-entity-001" -> "entity-001")
        // node.id is "entity-entity-001", so we remove the first "entity-" prefix
        const entityId = node.id.startsWith('entity-') ? node.id.substring('entity-'.length) : node.id;
        navigate(`/develop-train/feature-store/entities/${entityId}?featureStore=${encodeURIComponent(selectedFeatureStore)}`);
      }
    };
    
    // Only make the button clickable for entity nodes
    const isEntityNode = node.type === 'entity';
    
    return (
      <div style={{ maxWidth: '320px' }}>
        {node.data.description && (
          <p style={{ fontSize: '14px', marginBottom: '12px', color: '#6a6e73' }}>
            {node.data.description}
          </p>
        )}
        {node.type === 'featureView' && node.data.features && node.data.features.length > 0 && (
          <>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Features:</div>
            <List>
              {node.data.features.slice(0, 6).map((feature: string, idx: number) => (
                <ListItem key={idx} style={{ fontSize: '14px' }}>
                  {feature}
                </ListItem>
              ))}
              {node.data.features.length > 6 && (
                <ListItem style={{ fontSize: '14px', fontStyle: 'italic' }}>
                  ...and {node.data.features.length - 6} more
                </ListItem>
              )}
            </List>
            <div style={{ marginTop: '8px' }}>
              <Button variant="link" isInline isDisabled>
                View all features
              </Button>
            </div>
          </>
        )}
        <div style={{ marginTop: '12px' }}>
          <Button 
            variant="link" 
            isInline 
            onClick={isEntityNode ? handleDetailPageClick : undefined}
            isDisabled={!isEntityNode}
          >
            View {resourceName} detail page
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div style={{ 
      height: 'calc(100vh - 180px)', // Viewport-based height to prevent collapse
      minHeight: '500px', // Safety minimum to ensure visibility
      width: '100%',
      margin: 0,
      padding: 0,
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden', // Prevent window scrollbars for full bleed
    }}>
      
      {/* Canvas Container - Full Bleed Layout */}
      <div 
        ref={containerRef}
        style={{ 
          flex: 1,
          height: '100%',
          width: '100%',
          position: 'relative', 
          overflow: 'hidden',
          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
          borderRadius: 0, // Remove border radius for full bleed
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          margin: 0,
          padding: 0,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Filter Toolbar - Floating Panel */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 10,
          width: 'auto',
          backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
          boxShadow: 'var(--pf-v5-global--BoxShadow--sm)',
          borderRadius: '4px',
          padding: '8px',
          display: 'flex',
          gap: '16px',
        }}>
          <Toolbar style={{ marginBottom: 0 }}>
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
        </div>
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
            {/* Clip paths for text truncation - one per node with badge */}
            {positionedNodes
              .filter(pn => pn.node.data.featureCount !== undefined)
              .map(({ node, width, height }) => {
                // ClipPath width: total width minus left padding, icon, gap, badge width, gap, and right padding
                // Using new PatternFly constants: 8px padding, 24px icon, 8px gap
                const layout = calculateNodeLayout(node);
                const badgeWidth = layout.badgeWidth;
                const clipWidth = width - NODE_PADDING_HORIZONTAL * 2 - ICON_SIZE - ELEMENT_GAP - badgeWidth - (badgeWidth > 0 ? ELEMENT_GAP : 0);
                return (
                  <clipPath key={`node-text-clip-${node.id}`} id={`node-text-clip-${node.id}`}>
                    <rect
                      x={0}
                      y={0}
                      width={clipWidth}
                      height={height}
                    />
                  </clipPath>
                );
              })}
          </defs>
          
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Render Edges */}
            {positionedEdges.map((edge) => {
              const isEdgeHighlighted = selectedNodeId ? highlightedPath.edges.has(edge.id) : false;
              
              // Get actual edge data to find source and target node IDs
              const actualEdge = lineageData.edges.find(e => e.id === edge.id);
              if (!actualEdge) return null;
              
              // Find source and target nodes
              const sourceNode = positionedNodes.find(pn => pn.node.id === actualEdge.source);
              const targetNode = positionedNodes.find(pn => pn.node.id === actualEdge.target);
              
              // Calculate connection points - adjust for condensed nodes
              let sourceX = edge.sourceX;
              let sourceY = edge.sourceY;
              let targetX = edge.targetX;
              let targetY = edge.targetY;
              let isSourceCondensed = false;
              let isTargetCondensed = false;
              
              if (isCondensedView && sourceNode) {
                // Check if source node is condensed (not hovered and not selected)
                isSourceCondensed = hoveredCondensedNodeId !== sourceNode.node.id && 
                                   selectedNodeId !== sourceNode.node.id;
                if (isSourceCondensed) {
                  // Connect to center of condensed circular node
                  const condensedX = sourceNode.x + sourceNode.width / 2;
                  const condensedY = sourceNode.y + sourceNode.height / 2;
                  sourceX = condensedX;
                  sourceY = condensedY;
                }
              }
              
              if (isCondensedView && targetNode) {
                // Check if target node is condensed (not hovered and not selected)
                isTargetCondensed = hoveredCondensedNodeId !== targetNode.node.id && 
                                   selectedNodeId !== targetNode.node.id;
                if (isTargetCondensed) {
                  // Connect to center of condensed circular node
                  const condensedX = targetNode.x + targetNode.width / 2;
                  const condensedY = targetNode.y + targetNode.height / 2;
                  targetX = condensedX;
                  targetY = condensedY;
                }
              }
              
              // Create a curved path with adjusted control points for condensed nodes
              // When both nodes are condensed, use tighter control points to shorten the edge
              const horizontalDistance = targetX - sourceX;
              const controlPointOffset = (isSourceCondensed && isTargetCondensed) 
                ? horizontalDistance * 0.15  // Shorter control points for condensed nodes (15% of distance)
                : horizontalDistance * 0.5;   // Standard control points (50% of distance)
              
              const controlX1 = sourceX + controlPointOffset;
              const controlX2 = targetX - controlPointOffset;
              const path = `M ${sourceX} ${sourceY} C ${controlX1} ${sourceY}, ${controlX2} ${targetY}, ${targetX} ${targetY}`;
              
              return (
                <g key={edge.id} data-edge="true">
                <path
                  d={path}
                  stroke={isEdgeHighlighted ? '#0066cc' : '#d2d2d2'}
                  strokeWidth={isEdgeHighlighted ? 2 : 1}
                  fill="none"
                  markerEnd={isEdgeHighlighted ? 'url(#arrow-highlighted)' : 'url(#arrow-default)'}
                    style={{ pointerEvents: 'none' }}
                />
                </g>
              );
            })}
            
            {/* Render Nodes - Split into regular nodes and hovered/selected condensed nodes for z-index */}
            {/* First, render regular nodes (condensed or standard, but not hovered/selected in condensed view) */}
            {positionedNodes
              .filter(({ node }) => {
                // In condensed view, exclude nodes that are hovered OR selected (they should show in regular view)
                if (isCondensedView) {
                  return hoveredCondensedNodeId !== node.id && selectedNodeId !== node.id;
                }
                return true;
              })
              .map(({ node, x, y, width, height }) => {
              const colors = NODE_COLORS[node.type as keyof typeof NODE_COLORS] || NODE_COLORS.entity;
              const isSelected = node.id === selectedNodeId;
              const isConnected = selectedNodeId ? highlightedPath.nodes.has(node.id) : false;
              
              // Determine if we should render condensed view
              // In condensed view, ALL nodes that pass the filter (not hovered, not selected) should be condensed
              // Since we already filtered out hovered/selected nodes, we can simply check isCondensedView
              const shouldRenderCondensed = isCondensedView;
              
              // Render condensed view (circular, icon-only) - this applies to ALL nodes when zoom < threshold
              if (shouldRenderCondensed) {
                const condensedSize = CONDENSED_NODE_SIZE;
                const condensedX = x + width / 2 - condensedSize / 2;
                const condensedY = y + height / 2 - condensedSize / 2;
                
                // Determine styling for condensed nodes
                let fillColor = 'white';
                let borderColor = colors.iconColor;
                let borderWidth = 1;
                let iconColor = colors.iconColor;
                
                if (isSelected) {
                  fillColor = '#0066cc';
                  borderColor = '#0066cc';
                  borderWidth = 2;
                  iconColor = 'white';
                } else if (isConnected) {
                  borderColor = '#0066cc';
                  borderWidth = 2;
                }
                
                return (
                  <g
                    key={node.id}
                    data-node={node.id}
                    transform={`translate(${condensedX}, ${condensedY})`}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => handleNodeClick(e, node)}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseEnter={() => {
                      // When hovering in condensed view, expand this node
                      setHoveredCondensedNodeId(node.id);
                    }}
                    onMouseLeave={() => {
                      // Only clear hovered node if it's not selected (selected nodes stay expanded)
                      if (!isSelected) {
                        setHoveredCondensedNodeId(null);
                      }
                    }}
                  >
                    {/* Circular background with color theme border */}
                    <circle
                      cx={condensedSize / 2}
                      cy={condensedSize / 2}
                      r={condensedSize / 2}
                      fill={fillColor}
                      stroke={borderColor}
                      strokeWidth={borderWidth}
                    />
                    {/* Icon centered */}
                    <foreignObject 
                      x={condensedSize / 2 - 8} 
                      y={condensedSize / 2 - 8} 
                      width={16} 
                      height={16}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: iconColor, 
                        width: '100%', 
                        height: '100%' 
                      }}>
                        {getIcon(node.type)}
                      </div>
                    </foreignObject>
                  </g>
                );
              }
              
              // Render standard view (pill shape with icon, text, badge)
              // Use strict PatternFly layout calculation
              const layout = calculateNodeLayout(node);
              const finalNodeWidth = layout.nodeWidth;
              const hasBadge = node.data.featureCount !== undefined;
              
              // Determine styling based on state:
              // - Selected: Blue filled background, white text/icons (PatternFly selected state)
              // - Connected: Blue border outline with hover-like appearance
              // - Default: Gray border, white background, colored icons
              let fillColor = 'white';
              let borderColor = DEFAULT_NODE_BORDER;
              let borderWidth = 1;
              let textColor = '#151515';
              let iconColor = colors.iconColor;
              let showOuterGlow = false;
              
              if (isSelected) {
                // Selected state: Blue filled background with white text/icons
                fillColor = '#0066cc';
                borderColor = '#0066cc';
                borderWidth = 2;
                textColor = 'white';
                iconColor = 'white';
              } else if (isConnected) {
                // Connected state: Blue border outline (hover-like state)
                borderColor = '#0066cc';
                borderWidth = 2;
                showOuterGlow = true;
              }
              
              // Parse label to separate resource type and name (for HTML rendering)
              const labelParts = node.label.split(': ');
              const resourceType = labelParts.length > 1 ? labelParts[0] + ':' : '';
              const resourceName = labelParts.length > 1 ? labelParts.slice(1).join(': ') : node.label;
              
              // Render condensed view (circular, icon-only)
              if (shouldRenderCondensed) {
                const condensedSize = CONDENSED_NODE_SIZE;
                const condensedX = x + width / 2 - condensedSize / 2;
                const condensedY = y + height / 2 - condensedSize / 2;
                
                return (
                  <g
                    key={node.id}
                    data-node={node.id}
                    transform={`translate(${condensedX}, ${condensedY})`}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => handleNodeClick(e, node)}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseEnter={() => {
                      // When hovering in condensed view, expand this node
                      setHoveredCondensedNodeId(node.id);
                    }}
                    onMouseLeave={() => {
                      setHoveredCondensedNodeId(null);
                    }}
                  >
                    {/* Circular background with color theme border */}
                    <circle
                      cx={condensedSize / 2}
                      cy={condensedSize / 2}
                      r={condensedSize / 2}
                      fill={isSelected ? '#0066cc' : 'white'}
                      stroke={isSelected ? '#0066cc' : (isConnected ? '#0066cc' : colors.iconColor)}
                      strokeWidth={isSelected || isConnected ? 2 : 1}
                    />
                    {/* Icon centered */}
                    <foreignObject 
                      x={condensedSize / 2 - 8} 
                      y={condensedSize / 2 - 8} 
                      width={16} 
                      height={16}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: isSelected ? 'white' : colors.iconColor, 
                        width: '100%', 
                        height: '100%' 
                      }}>
                        {getIcon(node.type)}
                      </div>
                    </foreignObject>
                  </g>
                );
              }
              
              // Render standard view (pill shape with icon, text, badge)
              const nodeContent = (
                <g
                  key={node.id}
                  data-node={node.id}
                  transform={`translate(${x}, ${y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent canvas click handler
                    if (!isDragging) { // Only select if we're not dragging
                      handleNodeClick(e, node);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation(); // Prevent canvas drag when clicking node
                  }}
                  onMouseEnter={(e) => {
                    // Always check if node is truncated and show tooltip for all node types (including entities)
                    // Recalculate layout to ensure accuracy - this is critical for entity nodes
                    const nodeLayout = calculateNodeLayout(node);
                    
                    // Force tooltip to show if node is truncated (with safety buffer in calculation)
                    if (nodeLayout.isTruncated) {
                      setHoveredNodeId(node.id);
                      // Calculate tooltip position relative to container - top-aligned above node
                      if (containerRef.current) {
                        const containerRect = containerRef.current.getBoundingClientRect();
                        const svgElement = e.currentTarget.ownerSVGElement as SVGSVGElement;
                        if (svgElement) {
                          const svgRect = svgElement.getBoundingClientRect();
                          // Calculate node top center in SVG coordinates, then transform to screen coordinates
                          const nodeCenterX = (x + finalNodeWidth / 2) * zoom + pan.x;
                          const nodeTopY = y * zoom + pan.y; // Use top Y position for top alignment
                          // Convert to container-relative coordinates
                          setTooltipPosition({
                            x: nodeCenterX + (svgRect.left - containerRect.left),
                            y: nodeTopY + (svgRect.top - containerRect.top), // Top of node
                          });
                        } else {
                          // Fallback: use node position directly if SVG element not found
                          const nodeCenterX = (x + finalNodeWidth / 2) * zoom + pan.x;
                          const nodeTopY = y * zoom + pan.y;
                          setTooltipPosition({
                            x: nodeCenterX,
                            y: nodeTopY,
                          });
                        }
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredNodeId(null);
                    // If in condensed view, clear hovered condensed node when leaving
                    if (isCondensedView) {
                      setHoveredCondensedNodeId(null);
                    }
                  }}
                >
                  {/* Outer glow for connected nodes (hover-like effect) */}
                  {showOuterGlow && (
                    <rect
                      x={-3}
                      y={-3}
                      width={finalNodeWidth + 6}
                      height={29 + 6}
                      rx={(29 + 6) / 2}
                      ry={(29 + 6) / 2}
                      fill="none"
                      stroke="rgba(0, 102, 204, 0.3)"
                      strokeWidth={4}
                    />
                  )}
                  {/* Main Container Outline - 29px height */}
                  <rect
                    x={0}
                    y={0}
                    width={finalNodeWidth}
                    height={29}
                    rx={29 / 2}
                    ry={29 / 2}
                    fill={fillColor}
                    stroke={borderColor}
                    strokeWidth={borderWidth}
                  />
                  
                  {/* Content Container - Using unified NodeContent component */}
                  <NodeContent
                    nodeType={node.type}
                    nodeWidth={finalNodeWidth}
                    resourceType={resourceType}
                    resourceName={resourceName}
                    iconColor={iconColor}
                    textColor={textColor}
                    hasBadge={hasBadge}
                    isSelected={isSelected}
                    featureCount={node.data.featureCount}
                  />
                </g>
              );
              
              return nodeContent;
            })}
            
            {/* Render hovered/selected condensed nodes on top (for z-index) */}
            {/* These nodes should always show in regular view when hovered or selected */}
            {isCondensedView && positionedNodes
              .filter(({ node }) => hoveredCondensedNodeId === node.id || selectedNodeId === node.id)
              .map(({ node, x, y, width, height }) => {
              const colors = NODE_COLORS[node.type as keyof typeof NODE_COLORS] || NODE_COLORS.entity;
              const isSelected = node.id === selectedNodeId;
              const isConnected = selectedNodeId ? highlightedPath.nodes.has(node.id) : false;
              
              // Determine styling based on state
              let fillColor = 'white';
              let borderColor = DEFAULT_NODE_BORDER;
              let borderWidth = 1;
              let textColor = '#151515';
              let iconColor = colors.iconColor;
              let badgeFill = '#f0f0f0';
              let badgeTextColor = '#6a6e73';
              let showOuterGlow = false;
              
              if (isSelected) {
                fillColor = '#0066cc';
                borderColor = '#0066cc';
                borderWidth = 2;
                textColor = 'white';
                iconColor = 'white';
                badgeFill = 'rgba(255, 255, 255, 0.2)';
                badgeTextColor = 'white';
              } else if (isConnected) {
                borderColor = '#0066cc';
                borderWidth = 2;
                showOuterGlow = true;
              }
              
              // Use strict PatternFly layout calculation
              const layout = calculateNodeLayout(node);
              const finalNodeWidth = layout.nodeWidth;
              const displayText = layout.displayText;
              const badgePixelWidth = layout.badgeWidth;
              const hasBadge = node.data.featureCount !== undefined;
              
              // Parse label to separate resource type and name (for HTML rendering)
              const labelParts = node.label.split(': ');
              const resourceType = labelParts.length > 1 ? labelParts[0] + ':' : '';
              const resourceName = labelParts.length > 1 ? labelParts.slice(1).join(': ') : node.label;
              
              return (
                <g
                  key={`hovered-${node.id}`}
                  data-node={node.id}
                  transform={`translate(${x}, ${y})`}
                  style={{ cursor: 'pointer', pointerEvents: 'all' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDragging) {
                      handleNodeClick(e, node);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseLeave={() => {
                    // Only clear hovered node if it's not selected (selected nodes stay expanded)
                    if (selectedNodeId !== node.id) {
                      setHoveredCondensedNodeId(null);
                    }
                    // Always clear tooltip on mouse leave
                    setHoveredNodeId(null);
                  }}
                  onMouseEnter={(e) => {
                    // Always check if node is truncated and show tooltip for all node types (including entities)
                    // Recalculate layout to ensure accuracy - this is critical for entity nodes
                    const nodeLayout = calculateNodeLayout(node);
                    
                    // Force tooltip to show if node is truncated (with safety buffer in calculation)
                    if (nodeLayout.isTruncated) {
                      setHoveredNodeId(node.id);
                      // Calculate tooltip position relative to container - top-aligned above node
                      if (containerRef.current) {
                        const containerRect = containerRef.current.getBoundingClientRect();
                        const svgElement = e.currentTarget.ownerSVGElement as SVGSVGElement;
                        if (svgElement) {
                          const svgRect = svgElement.getBoundingClientRect();
                          // Calculate node top center in SVG coordinates, then transform to screen coordinates
                          const nodeCenterX = (x + finalNodeWidth / 2) * zoom + pan.x;
                          const nodeTopY = y * zoom + pan.y; // Use top Y position for top alignment
                          // Convert to container-relative coordinates
                          setTooltipPosition({
                            x: nodeCenterX + (svgRect.left - containerRect.left),
                            y: nodeTopY + (svgRect.top - containerRect.top), // Top of node
                          });
                        } else {
                          // Fallback: use node position directly if SVG element not found
                          const nodeCenterX = (x + finalNodeWidth / 2) * zoom + pan.x;
                          const nodeTopY = y * zoom + pan.y;
                          setTooltipPosition({
                            x: nodeCenterX,
                            y: nodeTopY,
                          });
                        }
                      }
                    }
                  }}
                >
                  {/* Outer glow for connected nodes */}
                  {showOuterGlow && (
                    <rect
                      x={-3}
                      y={-3}
                      width={finalNodeWidth + 6}
                      height={29 + 6}
                      rx={(29 + 6) / 2}
                      ry={(29 + 6) / 2}
                      fill="none"
                      stroke="rgba(0, 102, 204, 0.3)"
                      strokeWidth={4}
                    />
                  )}
                  {/* Main Container Outline - 29px height */}
                      <rect
                        x={0}
                        y={0}
                    width={finalNodeWidth}
                    height={29}
                    rx={29 / 2}
                    ry={29 / 2}
                    fill={fillColor}
                    stroke={borderColor}
                    strokeWidth={borderWidth}
                  />
                  
                  {/* Content Container - Using unified NodeContent component */}
                  <NodeContent
                    nodeType={node.type}
                    nodeWidth={finalNodeWidth}
                    resourceType={resourceType}
                    resourceName={resourceName}
                    iconColor={iconColor}
                    textColor={textColor}
                    hasBadge={hasBadge}
                    isSelected={isSelected}
                    featureCount={node.data.featureCount}
                  />
                </g>
              );
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
        
        {/* Tooltip for truncated node labels - top-aligned above node */}
        {hoveredNodeId && (() => {
          const hoveredNode = positionedNodes.find(pn => pn.node.id === hoveredNodeId);
          if (!hoveredNode) return null;
          
          // Always recalculate layout to ensure accuracy for all node types (including entities)
          const layout = calculateNodeLayout(hoveredNode.node);
          if (!layout.isTruncated) return null;
          
          // Get full label for tooltip
          const fullLabel = hoveredNode.node.label;
          
          // Calculate tooltip position: centered horizontally above the node
          // Use fallback calculation if tooltipPosition wasn't set correctly
          const tooltipGap = 8; // Gap between node top and tooltip bottom
          
          let tooltipX = tooltipPosition.x;
          let tooltipY = tooltipPosition.y;
          
          // Fallback: calculate position from node position if tooltipPosition is invalid
          if (!tooltipPosition || (tooltipPosition.x === 0 && tooltipPosition.y === 0)) {
            if (containerRef.current) {
              const containerRect = containerRef.current.getBoundingClientRect();
              const svgElement = containerRef.current.querySelector('svg');
              if (svgElement) {
                const svgRect = svgElement.getBoundingClientRect();
                const nodeCenterX = (hoveredNode.x + hoveredNode.width / 2) * zoom + pan.x;
                const nodeTopY = hoveredNode.y * zoom + pan.y;
                tooltipX = nodeCenterX + (svgRect.left - containerRect.left);
                tooltipY = nodeTopY + (svgRect.top - containerRect.top);
              }
            }
          }
          
          return (
            <div
              style={{
                position: 'absolute',
                left: `${tooltipX}px`,
                top: `${tooltipY - tooltipGap}px`,
                transform: 'translate(-50%, -100%)', // Center horizontally and position above
                backgroundColor: '#151515',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                pointerEvents: 'none',
                zIndex: 10000, // Increased z-index to ensure it's above everything
                maxWidth: '300px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              {fullLabel}
            </div>
          );
        })()}
      </div>
      
      {/* Popover rendered via Portal outside the graph container to avoid clipping */}
      {popoverNodeId && popoverPosition && (() => {
        const popoverNode = positionedNodes.find(pn => pn.node.id === popoverNodeId);
        if (!popoverNode) return null;
        
        // Use pure transform for positioning to minimize reflows (no left/top)
        // This ensures the browser can optimize the positioning without triggering layout reflows
        const arrowOffset = popoverPosition.showBelow ? 12 : -12;
        const translateY = popoverPosition.showBelow ? '0%' : '-100%';
        
        return ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              transform: `translate(${popoverPosition.x}px, ${popoverPosition.y}px) translate(-50%, ${translateY}) translateY(${arrowOffset}px)`,
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              padding: '16px',
              minWidth: '300px',
              maxWidth: '400px',
              zIndex: 9999,
              pointerEvents: 'auto',
            }}
          >
            {/* Arrow pointer - position based on showBelow */}
            {popoverPosition.showBelow ? (
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderBottom: '10px solid white',
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid white',
                }}
              />
            )}
            
            {/* Header with title and close button - Matched Height Alignment */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px',
            }}>
              <Title 
                headingLevel="h4" 
                size="md" 
                style={{ 
                  flex: 1,
                  marginRight: '16px',
                  whiteSpace: 'normal', 
                  wordBreak: 'break-word',
                  margin: 0,
                  padding: 0,
                  fontSize: '14px',
                  lineHeight: '24px', // Match button height exactly
                }}
              >
                {popoverNode.node.label}
              </Title>
              <Button 
                variant="plain" 
                onClick={() => {
                  setPopoverNodeId(null);
                  setPopoverPosition(null);
                }}
                style={{
                  flexShrink: 0,
                  height: '24px', // Match title line-height exactly
                  width: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 0,
                  padding: 0,
                  minWidth: 'auto',
                  alignSelf: 'flex-start',
                }}
              >
                <TimesIcon />
              </Button>
            </div>
            
            {/* Content */}
            {renderPopoverContent(popoverNode.node)}
          </div>,
          document.body
        );
      })()}
    </div>
  );
};

export default FeatureStoreLineage;
