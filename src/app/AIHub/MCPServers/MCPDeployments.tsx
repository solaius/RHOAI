import React from 'react';
import {
  Badge,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  InputGroup,
  InputGroupItem,
  Label,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  Pagination,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  OutlinedFolderIcon,
  SearchIcon,
} from '@patternfly/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';

// Pod status values (stretch goal - matches OpenShift/Kubernetes pod status)
type PodStatus = 'Pending' | 'Running' | 'Failed' | 'Succeeded' | 'Unknown';

// OpenShift pod status descriptions for tooltips
const POD_STATUS_DESCRIPTIONS: Record<PodStatus, string> = {
  Running:
    'The pod and its containers are healthy and running without issues.',
  Pending:
    'The pod has been accepted by the Kubernetes cluster but one or more of its containers have not yet been created or started. This can be due to image pulls, pending persistent volume claims, or scheduling issues.',
  Succeeded:
    'All containers in the pod have terminated successfully and will not restart. This is typical for jobs or one-off tasks.',
  Failed:
    'All containers in the pod have terminated, but at least one terminated in a failure (non-zero exit code).',
  Unknown:
    'The state of the pod could not be determined, often due to a communication error with the host node.',
};

// Mock data types for deployed MCP servers
interface MCPDeployment {
  id: string;
  userName: string;
  mcpServerName: string;
  version: string;
  created: string; // ISO timestamp
  status: PodStatus;
}

// Format ISO timestamp for display
const formatCreated = (iso: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

// Mock data for deployed MCP servers
const mockMCPDeployments: MCPDeployment[] = [
  {
    id: '1',
    userName: 'Kubernetes Test',
    mcpServerName: 'Kubernetes',
    version: '1.0.0',
    created: '2024-11-15T10:30:00Z',
    status: 'Running',
  },
  {
    id: '2',
    userName: 'PostgreSQL Dev',
    mcpServerName: 'PostgreSQL',
    version: '2.1.0',
    created: '2024-11-15T09:00:00Z',
    status: 'Running',
  },
  {
    id: '3',
    userName: 'ServiceNow Production',
    mcpServerName: 'ServiceNow',
    version: '1.2.0',
    created: '2024-11-12T14:00:00Z',
    status: 'Failed',
  },
];

const MCPDeployments: React.FunctionComponent = () => {
  useDocumentTitle('MCP Deployments');
  const location = useLocation();
  const navigate = useNavigate();

  const { flags, selectedProject, setSelectedProject } = useFeatureFlags();
  const [deployments, setDeployments] = React.useState<MCPDeployment[]>(mockMCPDeployments);
  const [sortBy, setSortBy] = React.useState<string>('created');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [filterValue, setFilterValue] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isProjectSelectOpen, setIsProjectSelectOpen] = React.useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = React.useState(false);
  const addedDeploymentIdRef = React.useRef<string | null>(null);

  // Add newly deployed server from deploy modal navigation state (once per deployment)
  React.useEffect(() => {
    const newDeployment = (location.state as { newDeployment?: MCPDeployment })?.newDeployment;
    if (!newDeployment || addedDeploymentIdRef.current === newDeployment.id) return;
    addedDeploymentIdRef.current = newDeployment.id;
    setDeployments(prev => [newDeployment, ...prev]);
    navigate('/ai-hub/mcp/deployments', { replace: true, state: {} });
  }, [location.state, navigate]);

  const getFilteredDeployments = () => {
    let filtered = [...deployments];
    if (filterValue) {
      const v = filterValue.toLowerCase();
      filtered = filtered.filter(
        d =>
          d.userName.toLowerCase().includes(v) ||
          d.mcpServerName.toLowerCase().includes(v)
      );
    }
    return filtered;
  };

  const getSortedDeployments = () => {
    const filtered = getFilteredDeployments();
    return filtered.sort((a, b) => {
      let compareResult = 0;
      switch (sortBy) {
        case 'userName':
          compareResult = a.userName.localeCompare(b.userName);
          break;
        case 'mcpServerName':
          compareResult = a.mcpServerName.localeCompare(b.mcpServerName);
          break;
        case 'created':
          compareResult = new Date(a.created).getTime() - new Date(b.created).getTime();
          break;
        case 'status':
          compareResult = a.status.localeCompare(b.status);
          break;
        default:
          compareResult = 0;
      }
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  };

  const getPaginatedDeployments = () => {
    const sorted = getSortedDeployments();
    const startIdx = (currentPage - 1) * perPage;
    return sorted.slice(startIdx, startIdx + perPage);
  };

  const handleSort = (columnName: string) => {
    if (sortBy === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortDirection('asc');
    }
  };

  const renderStatusBadge = (status: PodStatus) => {
    const isAvailable = status === 'Running' || status === 'Succeeded';
    const badge = isAvailable ? (
      <Label color="green" icon={<CheckCircleIcon />}>available</Label>
    ) : (
      <Label color="red" icon={<ExclamationCircleIcon />}>unavailable</Label>
    );
    return (
      <Tooltip content={POD_STATUS_DESCRIPTIONS[status]}>
        <span>{badge}</span>
      </Tooltip>
    );
  };

  const renderTable = () => {
    const deployments = getSortedDeployments();

    if (deployments.length === 0) {
      return (
        <EmptyState>
          <Title headingLevel="h4" size="lg">
            <SearchIcon className="pf-v5-u-mr-sm" />
            No deployments found
          </Title>
          <EmptyStateBody>
            {filterValue
              ? 'No deployments match your filter criteria.'
              : 'No MCP server deployments are currently available in this project.'}
          </EmptyStateBody>
          {filterValue && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={() => setFilterValue('')}>
                  Clear filters
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          )}
        </EmptyState>
      );
    }

    return (
      <>
        <Table aria-label="MCP server deployments table" variant="compact">
          <Thead>
            <Tr>
              <Th
                width={30}
                sort={{
                  sortBy: { index: 0, direction: sortBy === 'mcpServerName' ? sortDirection : undefined },
                  onSort: () => handleSort('mcpServerName'),
                  columnIndex: 0,
                }}
              >
                Server
              </Th>
              <Th
                width={20}
                sort={{
                  sortBy: { index: 1, direction: sortBy === 'userName' ? sortDirection : undefined },
                  onSort: () => handleSort('userName'),
                  columnIndex: 1,
                }}
              >
                Name
              </Th>
              <Th
                width={25}
                sort={{
                  sortBy: { index: 2, direction: sortBy === 'created' ? sortDirection : undefined },
                  onSort: () => handleSort('created'),
                  columnIndex: 2,
                }}
              >
                Created
              </Th>
              <Th
                width={15}
                sort={{
                  sortBy: { index: 3, direction: sortBy === 'status' ? sortDirection : undefined },
                  onSort: () => handleSort('status'),
                  columnIndex: 3,
                }}
              >
                Status
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPaginatedDeployments().map((deployment) => {
              const serverNameWithVersion = `${deployment.mcpServerName.replace(/\s+/g, '-')}-${deployment.version}`;
              return (
                <Tr key={deployment.id}>
                  <Td dataLabel="Server">
                    <span style={{ fontWeight: 'bold' }}>{serverNameWithVersion}</span>
                  </Td>
                  <Td dataLabel="Name">{deployment.userName}</Td>
                  <Td dataLabel="Created">{formatCreated(deployment.created)}</Td>
                  <Td dataLabel="Status">{renderStatusBadge(deployment.status)}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Pagination
          itemCount={deployments.length}
          perPage={perPage}
          page={currentPage}
          onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
          onPerPageSelect={(_event, newPerPage) => {
            setPerPage(newPerPage);
            setCurrentPage(1);
          }}
          variant="bottom"
          perPageOptions={[
            { title: '5', value: 5 },
            { title: '10', value: 10 },
            { title: '20', value: 20 },
            { title: '50', value: 50 },
          ]}
        />
      </>
    );
  };

  return (
    <>
      <PageSection>
        <Title headingLevel="h1" size="2xl">
          MCP server deployments
        </Title>
        <div style={{ color: 'var(--pf-v5-global--Color--200)', marginTop: '0.5rem' }}>
          Manage and view the health and performance of your deployed MCP servers.
        </div>
      </PageSection>

      {flags.showProjectWorkspaceDropdowns && (
        <PageSection style={{ paddingTop: '0.5rem', paddingBottom: '0.25rem' }}>
          <Toolbar>
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem>
                  <InputGroup>
                    <InputGroupItem>
                      <div className="pf-v6-c-input-group__text">
                        <OutlinedFolderIcon /> Project
                      </div>
                    </InputGroupItem>
                    <InputGroupItem>
                      <Select
                        isOpen={isProjectSelectOpen}
                        selected={selectedProject}
                        onSelect={(_event, value) => {
                          setSelectedProject(value as string);
                          setIsProjectSelectOpen(false);
                        }}
                        onOpenChange={(isOpen) => setIsProjectSelectOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsProjectSelectOpen(!isProjectSelectOpen)}
                            isExpanded={isProjectSelectOpen}
                            style={{ width: '200px' }}
                          >
                            {selectedProject}
                          </MenuToggle>
                        )}
                        shouldFocusToggleOnSelect
                      >
                        <SelectList>
                          <SelectOption value="Project X">Project X</SelectOption>
                          <SelectOption value="Project Y">Project Y</SelectOption>
                        </SelectList>
                      </Select>
                    </InputGroupItem>
                  </InputGroup>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </PageSection>
      )}

      <PageSection style={{ paddingTop: '0.5rem' }}>
        <Toolbar id="mcp-deployments-toolbar">
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <InputGroup>
                  <InputGroupItem isFill>
                    <SearchInput
                      placeholder="Filter by name or server name"
                      value={filterValue}
                      onChange={(_event, value) => setFilterValue(value)}
                      onClear={() => setFilterValue('')}
                      aria-label="Filter MCP deployments"
                    />
                  </InputGroupItem>
                </InputGroup>
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup align={{ default: 'alignEnd' }}>
              <ToolbarItem variant="pagination">
                <Pagination
                  itemCount={getSortedDeployments().length}
                  perPage={perPage}
                  page={currentPage}
                  onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
                  onPerPageSelect={(_event, newPerPage) => {
                    setPerPage(newPerPage);
                    setCurrentPage(1);
                  }}
                  variant="top"
                  isCompact
                  perPageOptions={[
                    { title: '5', value: 5 },
                    { title: '10', value: 10 },
                    { title: '20', value: 20 },
                    { title: '50', value: 50 },
                  ]}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        {renderTable()}
      </PageSection>

      {/* Not shown / out-of-scope modal */}
      <Modal
        id="mcp-deployments-not-shown-modal"
        variant={ModalVariant.small}
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
      >
        <ModalHeader title="Not shown" />
        <ModalBody>
          <p>This interaction is out of scope for this prototype.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsFeatureModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { MCPDeployments };
