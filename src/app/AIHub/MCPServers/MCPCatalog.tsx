import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownList,
  Gallery,
  GalleryItem,
  InputGroup,
  InputGroupItem,
  Label,
  MenuToggle,
  PageSection,
  Pagination,
  SearchInput,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  FilterIcon,
  ListIcon,
  SecurityIcon,
  ServerIcon,
  ThIcon,
  WrenchIcon,
} from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { mcpServers, mcpCatalogLogos } from './mockData';
import MCPIconRaw from '@app/assets/mcp-servers/MCP.svg';

// Convert raw SVG to data URI
const MCPIcon = `data:image/svg+xml,${encodeURIComponent(MCPIconRaw)}`;

// Label icons mapping
const labelIcons: Record<string, React.ReactNode> = {
  'Verified source': <SecurityIcon style={{ color: '#f0ab00' }} />,
  'Red Hat partner': <CheckCircleIcon style={{ color: '#3e8635' }} />,
  'SAST': <CheckCircleIcon style={{ color: '#3e8635' }} />,
  'Local to cluster': <ServerIcon style={{ color: '#6a6e73' }} />,
  'Read only tools': <WrenchIcon style={{ color: '#6a6e73' }} />,
};

const MCPCatalog: React.FunctionComponent = () => {
  useDocumentTitle('MCP catalog');
  const navigate = useNavigate();

  // State
  const [searchValue, setSearchValue] = React.useState('');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterRemote, setFilterRemote] = React.useState(false);
  const [filterLocal, setFilterLocal] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(9);

  // Filter servers based on search and deployment mode
  const getFilteredServers = () => {
    let filtered = [...mcpServers];

    // Filter by search
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (server) =>
          server.name.toLowerCase().includes(searchLower) ||
          server.description.toLowerCase().includes(searchLower) ||
          server.provider.toLowerCase().includes(searchLower)
      );
    }

    // Filter by deployment mode
    if (filterRemote && !filterLocal) {
      filtered = filtered.filter((server) => server.deploymentMode === 'Remote');
    } else if (filterLocal && !filterRemote) {
      filtered = filtered.filter((server) => server.deploymentMode === 'Local');
    }

    return filtered;
  };

  const filteredServers = getFilteredServers();
  const totalServers = mcpServers.length;

  // Pagination
  const startIndex = (currentPage - 1) * perPage;
  const paginatedServers = filteredServers.slice(startIndex, startIndex + perPage);

  const handleServerClick = (slug: string) => {
    navigate(`/ai-hub/mcp/catalog/${slug}`);
  };

  const renderDeploymentBadge = (mode: 'Remote' | 'Local') => {
    return (
      <Label color={mode === 'Remote' ? 'blue' : 'green'} isCompact>
        {mode}
      </Label>
    );
  };

  // Render labels with icons in a 2-column grid
  const renderLabelsWithIcons = (labels: string[]) => {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem 1rem',
          marginTop: '0.75rem',
        }}
      >
        {labels.map((label, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.8125rem',
              color: '#151515',
            }}
          >
            {labelIcons[label] || <CheckCircleIcon style={{ color: '#6a6e73' }} />}
            <span>{label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCardGrid = () => (
    <Gallery hasGutter minWidths={{ default: '320px' }}>
      {paginatedServers.map((server) => (
        <GalleryItem key={server.id}>
          <Card
            isFullHeight
            isClickable
            onClick={() => handleServerClick(server.slug)}
            style={{
              cursor: 'pointer',
              border: '1px solid #d2d2d2',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardHeader
              actions={{
                actions: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Label color="grey" isCompact>v{server.version}</Label>
                    {renderDeploymentBadge(server.deploymentMode)}
                  </div>
                ),
                hasNoOffset: true,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={mcpCatalogLogos[server.slug]}
                  alt={`${server.name} logo`}
                  style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }}
                />
                <CardTitle>
                  <Title headingLevel="h3" size="lg">
                    {server.name.replace(' MCP Server', '')}
                  </Title>
                </CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <p style={{ fontSize: '0.875rem', color: '#6a6e73', marginBottom: '0' }}>
                {server.description}
              </p>
              {renderLabelsWithIcons(server.labels)}
            </CardBody>
            <CardFooter>
              <Button
                variant="secondary"
                isBlock
                onClick={(e) => {
                  e.stopPropagation();
                  handleServerClick(server.slug);
                }}
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </GalleryItem>
      ))}
    </Gallery>
  );

  const renderTableView = () => (
    <Table aria-label="MCP Servers table" variant="compact">
      <Thead>
        <Tr>
          <Th width={15}>Name</Th>
          <Th width={10}>Version</Th>
          <Th width={10}>Mode</Th>
          <Th width={45}>Description</Th>
          <Th width={20}>Labels</Th>
        </Tr>
      </Thead>
      <Tbody>
        {paginatedServers.map((server) => (
          <Tr
            key={server.id}
            onClick={() => handleServerClick(server.slug)}
            style={{ cursor: 'pointer' }}
          >
            <Td dataLabel="Name">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={mcpCatalogLogos[server.slug]}
                  alt={`${server.name} logo`}
                  style={{ width: '32px', height: '32px', objectFit: 'contain', flexShrink: 0 }}
                />
                <div
                  style={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '120px',
                  }}
                  title={server.name.replace(' MCP Server', '')}
                >
                  {server.name.replace(' MCP Server', '')}
                </div>
              </div>
            </Td>
            <Td dataLabel="Version">
              <Label color="grey" isCompact>v{server.version}</Label>
            </Td>
            <Td dataLabel="Mode">{renderDeploymentBadge(server.deploymentMode)}</Td>
            <Td dataLabel="Description">
              <span style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                {server.description}
              </span>
            </Td>
            <Td dataLabel="Labels">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {server.labels.slice(0, 2).map((label, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                    {labelIcons[label]}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

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
              MCP catalog
            </Title>
            <div style={{ color: '#6a6e73', marginTop: '0.25rem' }}>
              Browse <strong>{filteredServers.length}</strong> of <strong>{totalServers}</strong> MCP servers
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection style={{ paddingTop: '0.5rem' }}>
        <Toolbar id="mcp-catalog-toolbar">
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
                      placeholder="Filter by name..."
                      value={searchValue}
                      onChange={(_event, value) => setSearchValue(value)}
                      onClear={() => setSearchValue('')}
                      aria-label="Filter MCP servers"
                    />
                  </InputGroupItem>
                  <InputGroupItem>
                    <Button variant="control" aria-label="Search">
                      <ArrowRightIcon />
                    </Button>
                  </InputGroupItem>
                </InputGroup>
              </ToolbarItem>
              <ToolbarItem>
                <Checkbox
                  label="Remote"
                  isChecked={filterRemote}
                  onChange={(_event, checked) => setFilterRemote(checked)}
                  id="filter-remote"
                />
              </ToolbarItem>
              <ToolbarItem>
                <Checkbox
                  label="Local to cluster"
                  isChecked={filterLocal}
                  onChange={(_event, checked) => setFilterLocal(checked)}
                  id="filter-local"
                />
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup align={{ default: 'alignEnd' }}>
              <ToolbarItem>
                <ToggleGroup aria-label="View mode toggle">
                  <ToggleGroupItem
                    icon={<ThIcon />}
                    aria-label="Grid view"
                    isSelected={viewMode === 'grid'}
                    onChange={() => setViewMode('grid')}
                  />
                  <ToggleGroupItem
                    icon={<ListIcon />}
                    aria-label="List view"
                    isSelected={viewMode === 'list'}
                    onChange={() => setViewMode('list')}
                  />
                </ToggleGroup>
              </ToolbarItem>
              <ToolbarItem variant="pagination">
                <Pagination
                  itemCount={filteredServers.length}
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
                    { title: '9', value: 9 },
                    { title: '18', value: 18 },
                    { title: '27', value: 27 },
                  ]}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        {viewMode === 'grid' ? renderCardGrid() : renderTableView()}

        <Pagination
          itemCount={filteredServers.length}
          perPage={perPage}
          page={currentPage}
          onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
          onPerPageSelect={(_event, newPerPage) => {
            setPerPage(newPerPage);
            setCurrentPage(1);
          }}
          variant="bottom"
          perPageOptions={[
            { title: '9', value: 9 },
            { title: '18', value: 18 },
            { title: '27', value: 27 },
          ]}
        />
      </PageSection>
    </>
  );
};

export { MCPCatalog };
