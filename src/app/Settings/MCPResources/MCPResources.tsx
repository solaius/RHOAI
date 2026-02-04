import * as React from 'react';
import {
  Button,
  Label,
  PageSection,
  Switch,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { PlusCircleIcon, CubesIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMCPCatalog } from '@app/utils/MCPCatalogContext';

interface MCPSource {
  id: string;
  name: string;
  organization: string;
  visibility: 'Unfiltered' | 'Filtered';
  sourceType: 'YAML file' | 'GitHub repository';
  enabled: boolean;
  validationStatus: string;
}

const MCPResources: React.FunctionComponent = () => {
  useDocumentTitle('MCP Catalog Settings');
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleServerVisibility, mcpServerVisibility } = useMCPCatalog();

  const [sources, setSources] = React.useState<MCPSource[]>([
    {
      id: 'servicenow-mcp-server',
      name: 'ServiceNow',
      organization: '-',
      visibility: 'Unfiltered',
      sourceType: 'YAML file',
      enabled: true,
      validationStatus: '-'
    },
    {
      id: 'splunk-mcp-server',
      name: 'Splunk',
      organization: '-',
      visibility: 'Unfiltered',
      sourceType: 'YAML file',
      enabled: true,
      validationStatus: '-'
    },
    {
      id: 'mcp-kubernetes-server',
      name: 'Kubernetes',
      organization: '-',
      visibility: 'Unfiltered',
      sourceType: 'YAML file',
      enabled: true,
      validationStatus: '-'
    },
    {
      id: 'slack-mcp-server',
      name: 'Slack',
      organization: '-',
      visibility: 'Unfiltered',
      sourceType: 'YAML file',
      enabled: true,
      validationStatus: '-'
    },
    {
      id: 'salesforce-mcp-server',
      name: 'Salesforce',
      organization: '-',
      visibility: 'Unfiltered',
      sourceType: 'YAML file',
      enabled: true,
      validationStatus: '-'
    },
    {
      id: 'dynatrace-mcp-server',
      name: 'Dynatrace',
      organization: '-',
      visibility: 'Unfiltered',
      sourceType: 'YAML file',
      enabled: true,
      validationStatus: '-'
    },
    {
      id: 'github-mcp-server',
      name: 'GitHub',
      organization: '-',
      visibility: 'Unfiltered',
      sourceType: 'YAML file',
      enabled: true,
      validationStatus: '-'
    },
    {
      id: 'postgres-mcp-server',
      name: 'PostgreSQL',
      organization: '-',
      visibility: 'Unfiltered',
      sourceType: 'YAML file',
      enabled: true,
      validationStatus: '-'
    },
    {
      id: 'zapier-mcp-server',
      name: 'Zapier',
      organization: '-',
      visibility: 'Unfiltered',
      sourceType: 'YAML file',
      enabled: true,
      validationStatus: '-'
    }
  ]);

  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Check for new source from navigation state
  React.useEffect(() => {
    const state = location.state as { newSource?: { name: string; sourceType: string; serverNames: string[]; isVisibleInCatalog: boolean } };
    if (state?.newSource) {
      const { name, sourceType, serverNames } = state.newSource;

      // Create a new source entry
      const newSource: MCPSource = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        organization: '-',
        visibility: 'Unfiltered',
        sourceType: sourceType === 'yaml' ? 'YAML file' : 'GitHub repository',
        enabled: true,
        validationStatus: '-'
      };

      // Add to sources if not already present
      setSources(prevSources => {
        const exists = prevSources.some(s => s.id === newSource.id);
        if (!exists) {
          return [...prevSources, newSource];
        }
        return prevSources;
      });

      // Clear the state to prevent re-adding on subsequent renders
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleToggle = (sourceId: string) => {
    setSources(sources.map(source =>
      source.id === sourceId ? { ...source, enabled: !source.enabled } : source
    ));
    // Also update the global context so MCP Catalog can filter
    toggleServerVisibility(sourceId);
  };

  // Sync local state with context on initial load
  React.useEffect(() => {
    setSources(prevSources =>
      prevSources.map(source => {
        const contextServer = mcpServerVisibility.find(s => s.id === source.id);
        return contextServer ? { ...source, enabled: contextServer.enabled } : source;
      })
    );
  }, []);

  // Helper function to determine if a server is remote
  const isRemoteServer = (sourceId: string): boolean => {
    return sourceId === 'github-mcp-server' || 
           sourceId === 'slack-mcp-server' || 
           sourceId === 'zapier-mcp-server' || 
           sourceId === 'splunk-mcp-server';
  };

  const getSortableRowValues = (source: MCPSource): (string | number)[] => {
    const { name, sourceType } = source;
    return [name, sourceType];
  };

  const sortedSources = React.useMemo(() => {
    if (activeSortIndex === null) {
      return sources;
    }

    return [...sources].sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return activeSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue);
      const bString = String(bValue);

      if (activeSortDirection === 'asc') {
        return aString.localeCompare(bString);
      }
      return bString.localeCompare(aString);
    });
  }, [sources, activeSortIndex, activeSortDirection]);

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex !== null ? activeSortIndex : undefined,
      direction: activeSortDirection
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  return (
    <PageSection>
      <div style={{ marginBottom: '2rem' }}>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '1rem' }}>MCP catalog settings</Title>
        <p style={{ color: 'var(--pf-v5-global--Color--200)' }}>
          Manage MCP server catalog sources for your organization.
        </p>
      </div>

      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Button
              variant="primary"
              icon={<PlusCircleIcon />}
              onClick={() => navigate('/settings/mcp-resources/add-source')}
              data-testid="add-source-button"
            >
              Add a source
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="MCP catalog sources table" variant="compact">
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)} width={30}>Name</Th>
            <Th sort={getSortParams(1)} width={25}>Source type</Th>
            <Th width={20}>
              Visible in catalog
            </Th>
            <Th width={25}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedSources.map((source) => (
            <Tr key={source.id}>
              <Td dataLabel="Name">
                <span data-testid={`source-name-${source.id}`}>{source.name}</span>
              </Td>
              <Td dataLabel="Source type">
                <span data-testid={`source-type-${source.id}`}>
                  {isRemoteServer(source.id) ? 'Remote' : source.sourceType}
                </span>
              </Td>
              <Td dataLabel="Visible in catalog">
                <Switch
                  id={`enable-toggle-${source.id}`}
                  aria-label={`Enable ${source.name}`}
                  isChecked={source.enabled}
                  onChange={() => handleToggle(source.id)}
                  data-testid={`enable-toggle-${source.id}`}
                />
              </Td>
              <Td dataLabel="Actions">
                <Button
                  variant="link"
                  onClick={() => navigate(`/settings/mcp-resources/manage/${source.id}`)}
                  data-testid={`manage-source-button-${source.id}`}
                >
                  Manage source
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </PageSection>
  );
};

export { MCPResources };
