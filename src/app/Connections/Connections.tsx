import * as React from 'react';
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  Flex,
  FlexItem,
  InputGroup,
  InputGroupItem,
  Label,
  MenuToggle,
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
  EllipsisVIcon,
  FilterIcon,
  OutlinedFolderIcon,
  OutlinedQuestionCircleIcon,
  PlusCircleIcon,
  SearchIcon,
} from '@patternfly/react-icons';
import { ManageConnectionModal, DeleteConnectionModal } from '@app/Projects/screens/detail/connections';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';

// Custom Connections Icon Component
const ConnectionsIcon: React.FunctionComponent = () => (
  <svg
    className="pf-v6-svg"
    viewBox="0 0 36 36"
    fill="currentColor"
    aria-hidden="true"
    role="img"
    width="1em"
    height="1em"
    style={{ width: '32px', height: '32px' }}
  >
    <path d="M27,24.375c-.4968,0-.9568.1466-1.3533.3874l-4.6847-4.6847c.4148-.5894.663-1.3037.663-2.0777,0-.0441-.0114-.0851-.013-.1288l2.061-.4381c.5568,1.2875,1.8372,2.1919,3.327,2.1919,1.999,0,3.625-1.626,3.625-3.625s-1.626-3.625-3.625-3.625-3.625,1.626-3.625,3.625c0,.0733.0173.1418.0217.214l-2.0392.4334c-.3837-.9488-1.1584-1.6893-2.1227-2.0415l.848-3.9893c1.4082-.0449,2.5422-1.1977,2.5422-2.6166,0-1.4473-1.1777-2.625-2.625-2.625s-2.625,1.1777-2.625,2.625c0,1.0374.61,1.9279,1.4857,2.3539l-.8549,4.0217c-.002,0-.0038-.0006-.0059-.0006-.774,0-1.4883.2482-2.0777.663l-3.9603-3.9603c.4148-.5894.663-1.3037.663-2.0777,0-1.999-1.626-3.625-3.625-3.625s-3.625,1.626-3.625,3.625,1.626,3.625,3.625,3.625c.774,0,1.4883-.2482,2.0777-.663l3.9603,3.9603c-.4148.5894-.663,1.3037-.663,2.0777,0,.0441.0115.0851.0131.1289l-3.0765.6539c-.4406-.8327-1.3058-1.4078-2.3116-1.4078-1.4473,0-2.625,1.1777-2.625,2.625s1.1777,2.625,2.625,2.625,2.625-1.1777,2.625-2.625c0-.002-.0006-.0038-.0006-.0058l3.0181-.6415c.3526.8719,1.0331,1.5739,1.8898,1.9556l-.4413,2.076c-.0309-.0008-.0598-.0092-.091-.0092-1.999,0-3.625,1.626-3.625,3.625s1.626,3.625,3.625,3.625,3.625-1.626,3.625-3.625c0-1.5336-.9604-2.84-2.3086-3.3688l.4318-2.0317c.0847.0059.1656.0255.2518.0255.774,0,1.4883-.2482,2.0777-.663l4.6847,4.6847c-.2408.3965-.3874.8566-.3874,1.3533,0,1.4473,1.1777,2.625,2.625,2.625s2.625-1.1777,2.625-2.625-1.1777-2.625-2.625-2.625ZM27,13.625c1.3096,0,2.375,1.0654,2.375,2.375s-1.0654,2.375-2.375,2.375-2.375-1.0654-2.375-2.375,1.0654-2.375,2.375-2.375ZM18.625,8c0-.7583.6167-1.375,1.375-1.375s1.375.6167,1.375,1.375c0,.7578-.6167,1.375-1.375,1.375s-1.375-.6172-1.375-1.375ZM9,11.375c-1.3096,0-2.375-1.0654-2.375-2.375s1.0654-2.375,2.375-2.375,2.375,1.0654,2.375,2.375-1.0654,2.375-2.375,2.375ZM9,21.375c-.7583,0-1.375-.6172-1.375-1.375s.6167-1.375,1.375-1.375,1.375.6172,1.375,1.375-.6167,1.375-1.375,1.375ZM18.375,27c0,1.3096-1.0654,2.375-2.375,2.375s-2.375-1.0654-2.375-2.375,1.0654-2.375,2.375-2.375,2.375,1.0654,2.375,2.375ZM15.625,18c0-1.3096,1.0654-2.375,2.375-2.375s2.375,1.0654,2.375,2.375-1.0654,2.375-2.375,2.375-2.375-1.0654-2.375-2.375ZM27,28.375c-.7583,0-1.375-.6172-1.375-1.375s.6167-1.375,1.375-1.375,1.375.6172,1.375,1.375-.6167,1.375-1.375,1.375Z" />
  </svg>
);

// Connection data type
export interface Connection {
  id: string;
  name: string;
  description?: string;
  type: string;
  project: string;
  createdDate: string;
  compatible: string[];
}

// Mock data
const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'My S3 Storage',
    description: 'Production data storage',
    type: 'S3',
    project: 'Project X',
    createdDate: 'Dec 3, 2025',
    compatible: ['Workbench', 'Pipeline'],
  },
  {
    id: '2',
    name: 'Database Connection',
    description: 'PostgreSQL database for analytics',
    type: 'PostgreSQL',
    project: 'Project X',
    createdDate: 'Dec 1, 2025',
    compatible: ['Workbench'],
  },
  {
    id: '3',
    name: 'ML Model Storage',
    description: 'S3 bucket for trained models',
    type: 'S3',
    project: 'Project Y',
    createdDate: 'Nov 28, 2025',
    compatible: ['Pipeline', 'Model Registry'],
  },
  {
    id: '4',
    name: 'Training Data Lake',
    description: 'Primary data source for model training',
    type: 'S3',
    project: 'Project Y',
    createdDate: 'Nov 20, 2025',
    compatible: ['Workbench', 'Pipeline'],
  },
];

const Connections: React.FunctionComponent = () => {
  const { flags, selectedProject, setSelectedProject } = useFeatureFlags();
  const [connections, setConnections] = React.useState<Connection[]>(mockConnections);
  const [isManageModalOpen, setIsManageModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedConnection, setSelectedConnection] = React.useState<Connection | null>(null);
  const [filterValue, setFilterValue] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isProjectSelectOpen, setIsProjectSelectOpen] = React.useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  const [openKebabMenus, setOpenKebabMenus] = React.useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = React.useState<string>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Kebab menu handlers
  const toggleKebabMenu = (connectionId: string) => {
    setOpenKebabMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(connectionId)) {
        newSet.delete(connectionId);
      } else {
        newSet.add(connectionId);
      }
      return newSet;
    });
  };

  const handleAddConnection = () => {
    setSelectedConnection(null);
    setIsManageModalOpen(true);
  };

  const handleEditConnection = (connection: Connection) => {
    setSelectedConnection(connection);
    setIsManageModalOpen(true);
    setOpenKebabMenus(new Set());
  };

  const handleDeleteConnection = (connection: Connection) => {
    setSelectedConnection(connection);
    setIsDeleteModalOpen(true);
    setOpenKebabMenus(new Set());
  };

  const handleSaveConnection = async (
    connectionData: Omit<Connection, 'id' | 'createdDate' | 'project'>
  ) => {
    // Mock save - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (selectedConnection) {
      // Edit existing
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === selectedConnection.id
            ? {
                ...conn,
                ...connectionData,
              }
            : conn
        )
      );
    } else {
      // Add new
      const newConnection: Connection = {
        ...connectionData,
        id: Date.now().toString(),
        project: selectedProject,
        createdDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
      setConnections((prev) => [...prev, newConnection]);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedConnection) return;

    // Mock delete - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setConnections((prev) => prev.filter((conn) => conn.id !== selectedConnection.id));
  };

  // Filter connections based on search and project
  const getFilteredConnections = () => {
    let filtered = [...connections];

    // Filter by selected project
    filtered = filtered.filter((c) => c.project === selectedProject);

    // Filter by search term
    if (filterValue) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtered;
  };

  // Sort connections
  const getSortedConnections = () => {
    const filtered = getFilteredConnections();

    return filtered.sort((a, b) => {
      let compareResult = 0;

      switch (sortBy) {
        case 'name':
          compareResult = a.name.localeCompare(b.name);
          break;
        case 'type':
          compareResult = a.type.localeCompare(b.type);
          break;
        case 'createdDate':
          compareResult = 0; // For now, maintain order
          break;
        default:
          compareResult = 0;
      }

      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  };

  // Paginate connections
  const getPaginatedConnections = () => {
    const sorted = getSortedConnections();
    const startIdx = (currentPage - 1) * perPage;
    const endIdx = startIdx + perPage;
    return sorted.slice(startIdx, endIdx);
  };

  const handleSort = (columnName: string) => {
    if (sortBy === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortDirection('asc');
    }
  };

  const renderConnectionTypeLabel = (type: string) => {
    const typeColors: Record<string, 'blue' | 'green' | 'purple' | 'teal' | 'grey'> = {
      S3: 'blue',
      PostgreSQL: 'green',
      MySQL: 'teal',
      URI: 'purple',
      Generic: 'grey',
    };
    return <Label color={typeColors[type] || 'grey'}>{type}</Label>;
  };

  const renderTable = () => {
    const connectionsData = getSortedConnections();

    if (connectionsData.length === 0) {
      return (
        <EmptyState titleText="No connections found" icon={PlusCircleIcon} id="connections-empty-state">
          <EmptyStateBody>
            {filterValue
              ? 'No connections match your filter criteria.'
              : 'Connections enable you to store and retrieve information that typically should not be stored in code. For example, you can store details about data sources, S3 object storage, and more.'}
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              {filterValue ? (
                <Button variant="link" onClick={() => setFilterValue('')}>
                  Clear filters
                </Button>
              ) : (
                <Button variant="primary" onClick={handleAddConnection} id="add-connection-button">
                  Add connection
                </Button>
              )}
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      );
    }

    return (
      <>
        <Table aria-label="Connections table" variant="compact" id="connections-table">
          <Thead>
            <Tr>
              <Th
                width={30}
                sort={{
                  sortBy: { index: 0, direction: sortBy === 'name' ? sortDirection : undefined },
                  onSort: () => handleSort('name'),
                  columnIndex: 0,
                }}
              >
                Connection name
              </Th>
              <Th
                width={15}
                sort={{
                  sortBy: { index: 1, direction: sortBy === 'type' ? sortDirection : undefined },
                  onSort: () => handleSort('type'),
                  columnIndex: 1,
                }}
              >
                Type
              </Th>
              <Th width={20}>Connected to</Th>
              <Th
                width={15}
                sort={{
                  sortBy: { index: 3, direction: sortBy === 'createdDate' ? sortDirection : undefined },
                  onSort: () => handleSort('createdDate'),
                  columnIndex: 3,
                }}
              >
                Created
              </Th>
              <Th width={10}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPaginatedConnections().map((connection) => (
              <Tr key={connection.id} id={`connection-row-${connection.id}`}>
                <Td dataLabel="Connection name">
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{connection.name}</div>
                    {connection.description && (
                      <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                        {connection.description}
                      </div>
                    )}
                  </div>
                </Td>
                <Td dataLabel="Type">{renderConnectionTypeLabel(connection.type)}</Td>
                <Td dataLabel="Connected to">
                  {connection.compatible.length > 0 ? (
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {connection.compatible.map((item, index) => (
                        <Label key={`${connection.id}-compatible-${index}`} color="grey" isCompact>
                          {item}
                        </Label>
                      ))}
                    </div>
                  ) : (
                    '-'
                  )}
                </Td>
                <Td dataLabel="Created">{connection.createdDate}</Td>
                <Td dataLabel="Actions" style={{ textAlign: 'right', width: '60px' }}>
                  <Dropdown
                    isOpen={openKebabMenus.has(connection.id)}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setOpenKebabMenus((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(connection.id);
                          return newSet;
                        });
                      }
                    }}
                    popperProps={{ position: 'right' }}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => toggleKebabMenu(connection.id)}
                        variant="plain"
                        aria-label={`Actions for ${connection.name}`}
                        isExpanded={openKebabMenus.has(connection.id)}
                        id={`connection-actions-${connection.id}`}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="edit"
                        onClick={() => handleEditConnection(connection)}
                        id={`edit-connection-${connection.id}`}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        onClick={() => handleDeleteConnection(connection)}
                        id={`delete-connection-${connection.id}`}
                      >
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
          itemCount={connectionsData.length}
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
          id="connections-pagination-bottom"
        />
      </>
    );
  };

  return (
    <>
      {/* Title Section */}
      <PageSection id="connections-header">
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                padding: '4px',
                borderRadius: '20px',
                background: '#ffe8cc',
                color: 'var(--pf-v5-global--Color--dark-100)',
              }}
            >
              <ConnectionsIcon />
            </div>
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h2" size="xl" id="connections-title">
              Connections
            </Title>
          </FlexItem>
          <FlexItem>
            <Button
              variant="plain"
              aria-label="More info"
              id="connections-info-button"
              icon={<OutlinedQuestionCircleIcon />}
            />
          </FlexItem>
        </Flex>
        <div style={{ color: 'var(--pf-v5-global--Color--200)', marginTop: '0.5rem' }}>
          Manage connections to external data sources and services used across your projects.
        </div>
      </PageSection>

      {/* Project Selector */}
      {flags.showProjectWorkspaceDropdowns && (
        <PageSection style={{ paddingTop: '0.5rem', paddingBottom: '0.25rem' }} id="connections-project-selector">
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
                          setCurrentPage(1); // Reset to first page when changing projects
                        }}
                        onOpenChange={(isOpen) => setIsProjectSelectOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsProjectSelectOpen(!isProjectSelectOpen)}
                            isExpanded={isProjectSelectOpen}
                            style={{ width: '200px' }}
                            id="project-select-toggle"
                          >
                            {selectedProject}
                          </MenuToggle>
                        )}
                        shouldFocusToggleOnSelect
                        id="project-select"
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

      {/* Main Toolbar and Content */}
      <PageSection style={{ paddingTop: '0.5rem' }} id="connections-content">
        <Toolbar id="connections-toolbar">
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <Dropdown
                  isOpen={isFilterDropdownOpen}
                  onOpenChange={setIsFilterDropdownOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                      isExpanded={isFilterDropdownOpen}
                      icon={<FilterIcon />}
                      id="filter-dropdown-toggle"
                    >
                      Name
                    </MenuToggle>
                  )}
                  id="filter-dropdown"
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
                      aria-label="Filter connections"
                      id="connections-search"
                    />
                  </InputGroupItem>
                </InputGroup>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="primary" onClick={handleAddConnection} id="add-connection-toolbar-button">
                  Add connection
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup align={{ default: 'alignEnd' }}>
              <ToolbarItem variant="pagination">
                <Pagination
                  itemCount={getSortedConnections().length}
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
                  id="connections-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        {renderTable()}
      </PageSection>

      <ManageConnectionModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onSubmit={handleSaveConnection}
        connection={selectedConnection || undefined}
      />

      <DeleteConnectionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        connection={selectedConnection}
      />
    </>
  );
};

export { Connections };

