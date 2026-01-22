import * as React from 'react';
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateActions,
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
  Popover,
  SearchInput,
  TextInput,
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
  Tr,
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  CopyIcon,
  EllipsisVIcon,
  ExclamationCircleIcon,
  FilterIcon,
  OutlinedQuestionCircleIcon,
  SearchIcon,
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { mcpDeployments } from './mockData';
import type { MCPDeployment } from './types';
import MCPIconRaw from '@app/assets/mcp-servers/MCP.svg';

// Convert raw SVG to data URI
const MCPIcon = `data:image/svg+xml,${encodeURIComponent(MCPIconRaw)}`;

const MCPDeployments: React.FunctionComponent = () => {
  useDocumentTitle('MCP Deployments');
  const navigate = useNavigate();

  // State
  const [filterValue, setFilterValue] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [copiedItems, setCopiedItems] = React.useState<Set<string>>(new Set());
  const [isFeatureModalOpen, setIsFeatureModalOpen] = React.useState(false);
  const [openKebabMenus, setOpenKebabMenus] = React.useState<Set<string>>(new Set());

  // Copy handler with feedback
  const handleCopyWithFeedback = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems((prev) => new Set(Array.from(prev).concat(itemId)));
    setTimeout(() => {
      setCopiedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 2000);
  };

  // Kebab menu handlers
  const toggleKebabMenu = (deploymentId: string) => {
    setOpenKebabMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deploymentId)) {
        newSet.delete(deploymentId);
      } else {
        newSet.add(deploymentId);
      }
      return newSet;
    });
  };

  const handleEditDeployment = () => {
    setIsFeatureModalOpen(true);
    setOpenKebabMenus(new Set());
  };

  const handleDeleteDeployment = () => {
    setIsFeatureModalOpen(true);
    setOpenKebabMenus(new Set());
  };

  // Filter deployments
  const getFilteredDeployments = () => {
    if (!filterValue) {
      return mcpDeployments;
    }
    return mcpDeployments.filter((d) =>
      d.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const filteredDeployments = getFilteredDeployments();

  // Paginate
  const startIndex = (currentPage - 1) * perPage;
  const paginatedDeployments = filteredDeployments.slice(startIndex, startIndex + perPage);

  const renderStatusBadge = (status: MCPDeployment['status']) => {
    switch (status) {
      case 'Active':
        return (
          <Label color="green" icon={<CheckCircleIcon />}>
            Active
          </Label>
        );
      case 'Failed':
        return (
          <Label color="red" icon={<ExclamationCircleIcon />}>
            Failed
          </Label>
        );
      case 'Stopped':
        return <Label color="grey">Stopped</Label>;
      case 'Deploying':
        return <Label color="blue">Deploying</Label>;
      default:
        return <Label color="grey">Unknown</Label>;
    }
  };

  const renderTable = () => {
    if (filteredDeployments.length === 0) {
      return (
        <EmptyState>
          <Title headingLevel="h4" size="lg">
            <SearchIcon className="pf-v5-u-mr-sm" />
            No MCP deployments found
          </Title>
          <EmptyStateBody>
            {filterValue
              ? 'No deployments match your filter criteria.'
              : 'No MCP deployments are currently available.'}
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
        <Table aria-label="MCP deployments table" variant="compact">
          <Thead>
            <Tr>
              <Th width={25}>MCP deployment name</Th>
              <Th width={15}>Project</Th>
              <Th width={15}>Serving runtime</Th>
              <Th width={10}>Endpoints</Th>
              <Th width={10}>API protocol</Th>
              <Th width={10}>Last deployed</Th>
              <Th width={10}>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedDeployments.map((deployment) => (
              <Tr key={deployment.id}>
                <Td dataLabel="MCP deployment name">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Button
                      variant="link"
                      isInline
                      onClick={() => setIsFeatureModalOpen(true)}
                      style={{ padding: 0, fontSize: 'inherit', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      {deployment.name}
                    </Button>
                    <Popover
                      bodyContent={
                        <div style={{ padding: '0.5rem', maxWidth: '300px' }}>
                          <div style={{ marginBottom: '1rem' }}>
                            Resource names and types are used to find your resources in OpenShift.
                          </div>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                              Resource name
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <TextInput
                                value={deployment.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                                readOnly
                                aria-label="Resource name"
                                style={{ fontSize: '0.75rem', height: '28px' }}
                              />
                              <Tooltip
                                content={
                                  copiedItems.has(`resource-${deployment.id}`) ? 'Copied' : 'Copy resource name'
                                }
                              >
                                <Button
                                  variant="plain"
                                  size="sm"
                                  aria-label="Copy resource name"
                                  onClick={() =>
                                    handleCopyWithFeedback(
                                      deployment.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                                      `resource-${deployment.id}`
                                    )
                                  }
                                  style={{ padding: '4px' }}
                                >
                                  {copiedItems.has(`resource-${deployment.id}`) ? (
                                    <CheckCircleIcon style={{ fontSize: '12px' }} />
                                  ) : (
                                    <CopyIcon style={{ fontSize: '12px' }} />
                                  )}
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      }
                      position="right"
                    >
                      <Button variant="plain" aria-label="Deployment info" style={{ padding: '2px' }}>
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: '#6A6E73' }} />
                      </Button>
                    </Popover>
                  </div>
                </Td>
                <Td dataLabel="Project">
                  <div>
                    <div>{deployment.project}</div>
                    <Badge isRead>{deployment.projectType}</Badge>
                  </div>
                </Td>
                <Td dataLabel="Serving runtime">{deployment.servingRuntime}</Td>
                <Td dataLabel="Endpoints">
                  <Popover
                    bodyContent={
                      <div style={{ padding: '0.5rem', width: '350px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            Endpoint URL
                          </div>
                          {deployment.endpoints.map((endpoint, index) => (
                            <div
                              key={index}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}
                            >
                              <TextInput
                                value={endpoint}
                                readOnly
                                aria-label="Endpoint URL"
                                style={{ fontSize: '0.75rem', height: '28px', fontFamily: 'monospace' }}
                              />
                              <Tooltip
                                content={
                                  copiedItems.has(`endpoint-${deployment.id}-${index}`) ? 'Copied' : 'Copy endpoint'
                                }
                              >
                                <Button
                                  variant="plain"
                                  size="sm"
                                  aria-label="Copy endpoint"
                                  onClick={() =>
                                    handleCopyWithFeedback(endpoint, `endpoint-${deployment.id}-${index}`)
                                  }
                                  style={{ padding: '4px' }}
                                >
                                  {copiedItems.has(`endpoint-${deployment.id}-${index}`) ? (
                                    <CheckCircleIcon style={{ fontSize: '12px' }} />
                                  ) : (
                                    <CopyIcon style={{ fontSize: '12px' }} />
                                  )}
                                </Button>
                              </Tooltip>
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                    position="right"
                  >
                    <Button variant="link" isInline style={{ padding: 0, textDecoration: 'none' }}>
                      View
                    </Button>
                  </Popover>
                </Td>
                <Td dataLabel="API protocol">
                  <Label color={deployment.apiProtocol === 'SSE' ? 'purple' : 'yellow'}>
                    {deployment.apiProtocol}
                  </Label>
                </Td>
                <Td dataLabel="Last deployed">{deployment.lastDeployed}</Td>
                <Td dataLabel="Status">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {renderStatusBadge(deployment.status)}
                    {deployment.status === 'Active' && (
                      <Button variant="link" isInline onClick={() => setIsFeatureModalOpen(true)} style={{ padding: 0 }}>
                        Stop
                      </Button>
                    )}
                  </div>
                </Td>
                <Td dataLabel="Actions" style={{ textAlign: 'right', width: '60px' }}>
                  <Dropdown
                    isOpen={openKebabMenus.has(deployment.id)}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setOpenKebabMenus((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(deployment.id);
                          return newSet;
                        });
                      }
                    }}
                    popperProps={{ position: 'right' }}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => toggleKebabMenu(deployment.id)}
                        variant="plain"
                        aria-label={`Actions for ${deployment.name}`}
                        isExpanded={openKebabMenus.has(deployment.id)}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="edit" onClick={handleEditDeployment}>
                        Edit
                      </DropdownItem>
                      <DropdownItem key="delete" onClick={handleDeleteDeployment}>
                        Delete
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          itemCount={filteredDeployments.length}
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
          ]}
        />
      </>
    );
  };

  return (
    <>
      <PageSection>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              background: 'var(--ai-model-server--BackgroundColor, #E7F1FA)',
              borderRadius: '20px',
              padding: '8px',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={MCPIcon} alt="MCP icon" style={{ width: '32px', height: '32px' }} />
          </div>
          <div>
            <Title headingLevel="h1" size="2xl">
              MCP Deployments
            </Title>
            <div style={{ color: 'var(--pf-v5-global--Color--200)', marginTop: '0.25rem' }}>
              Manage and monitor your deployed MCP servers
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection style={{ paddingTop: '0.5rem' }}>
        <Toolbar id="mcp-deployments-toolbar">
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <Dropdown
                  isOpen={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      isExpanded={isFilterOpen}
                      icon={<FilterIcon />}
                    >
                      Name
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="name">Name</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <InputGroup>
                  <InputGroupItem isFill>
                    <SearchInput
                      placeholder="Filter by name"
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
                  itemCount={filteredDeployments.length}
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
                  ]}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        {renderTable()}
      </PageSection>

      {/* Feature Not Available Modal */}
      <Modal variant={ModalVariant.small} isOpen={isFeatureModalOpen} onClose={() => setIsFeatureModalOpen(false)}>
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
