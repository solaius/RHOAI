import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Content,
  ContentVariants,
  Button,
  ToolbarItem,
  Toolbar,
  ToolbarContent,
  Badge,
  Flex,
  FlexItem,
  Label,
  Popover,
  MenuToggle,
  Dropdown,
  DropdownList,
  DropdownItem,
  Divider,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { PlusIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { mockAPIKeys, getModelById } from './mockData';
import { APIKey, APIKeyStatus } from './types';
import { CreateAPIKeyModal, DeleteAPIKeyModal } from './components';

const APIKeys: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedAPIKey, setSelectedAPIKey] = React.useState<APIKey | null>(null);
  const [openKebabMenus, setOpenKebabMenus] = React.useState<Set<string>>(new Set());

  const toggleKebabMenu = (id: string) => {
    setOpenKebabMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatAPIKey = (apiKey: string): string => {
    return apiKey.substring(0, 9) + '...';
  };

  const getAssetsSummary = (apiKey: APIKey): React.ReactNode => {
    const totalAssets = apiKey.assets.modelEndpoints.length;

    if (totalAssets === 0) {
      return <span>No assets</span>;
    }

    return (
      <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
        {apiKey.assets.modelEndpoints.length > 0 && (
          <FlexItem>
            <Badge isRead>{apiKey.assets.modelEndpoints.length} Models</Badge>
          </FlexItem>
        )}
      </Flex>
    );
  };

  const getOwnerDisplay = (owner: APIKey['owner']): string => {
    return owner.name;
  };

  const getStatusLabel = (status: APIKeyStatus) => {
    const statusMap = {
      Active: { color: 'green' as const, label: 'Active' },
      Expired: { color: 'red' as const, label: 'Expired' },
      Disabled: { color: 'grey' as const, label: 'Disabled' },
      Inactive: { color: 'orange' as const, label: 'Inactive' },
    };
    const { color, label } = statusMap[status];
    
    if (status === 'Inactive') {
      return (
        <Popover
          aria-label="Inactive status information"
          headerContent="Inactive API key"
          bodyContent="This API key is inactive. The tier associated with this key may have been deleted or modified."
        >
          <Label 
            id={`status-${status.toLowerCase()}`} 
            color={color}
            style={{ cursor: 'pointer' }}
          >
            {label}
          </Label>
        </Popover>
      );
    }
    
    return <Label id={`status-${status.toLowerCase()}`} color={color}>{label}</Label>;
  };

  const formatCreationDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatExpirationDate = (date?: Date): string => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatLastUsedDate = (date?: Date): string => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleRowClick = (keyId: string) => {
    navigate(`/gen-ai-studio/api-keys/${keyId}`);
  };

  const handleDeleteAPIKey = (apiKey: APIKey) => {
    setSelectedAPIKey(apiKey);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (apiKey: APIKey) => {
    console.log('Deleting API key:', apiKey.id);
    // TODO: Implement actual delete functionality
  };

  const handleToggleAPIKeyStatus = (apiKey: APIKey) => {
    console.log('Toggling API key status:', apiKey.id);
    // TODO: Implement actual toggle functionality
  };

  const handleCreateAPIKey = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <PageSection>
      <Content component={ContentVariants.h1}>API keys</Content>
      <Content component={ContentVariants.p}>
        Manage personal API keys that can be used to access AI asset endpoints.
      </Content>
      
      <Toolbar id="api-keys-toolbar" style={{ marginTop: '1rem' }}>
        <ToolbarContent>
          <ToolbarItem>
            <Button 
              variant="primary" 
              icon={<PlusIcon />}
              onClick={handleCreateAPIKey}
            >
              Create API key
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="API Keys table" id="api-keys-table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Expires</Th>
                <Th>Last invoked</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {mockAPIKeys.map((apiKey) => (
                <Tr 
                  key={apiKey.id}
                  isClickable
                  onRowClick={() => handleRowClick(apiKey.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Td dataLabel="Name">
                    <div>
                      <Button 
                        variant="link" 
                        isInline 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(apiKey.id);
                        }}
                        id={`api-key-link-${apiKey.id}`}
                      >
                        {apiKey.name}
                      </Button>
                      {apiKey.description && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                          {apiKey.description}
                        </div>
                      )}
                    </div>
                  </Td>
                  <Td dataLabel="Status">
                    {getStatusLabel(apiKey.status)}
                  </Td>
                  <Td dataLabel="Created">
                    {formatCreationDate(apiKey.dateCreated)}
                  </Td>
                  <Td dataLabel="Expires">
                    {formatExpirationDate(apiKey.limits?.expirationDate)}
                  </Td>
                  <Td dataLabel="Last invoked">
                    {formatLastUsedDate(apiKey.dateLastUsed)}
                  </Td>
                  <Td isActionCell>
                    <Dropdown
                      isOpen={openKebabMenus.has(apiKey.id)}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setOpenKebabMenus((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(apiKey.id);
                            return newSet;
                          });
                        }
                      }}
                      popperProps={{ position: 'right' }}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleKebabMenu(apiKey.id);
                          }}
                          variant="plain"
                          aria-label={`Actions for ${apiKey.name}`}
                          isExpanded={openKebabMenus.has(apiKey.id)}
                          id={`api-key-actions-${apiKey.id}`}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem
                          key="toggle-status"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAPIKeyStatus(apiKey);
                            toggleKebabMenu(apiKey.id);
                          }}
                          id={`toggle-status-${apiKey.id}`}
                        >
                          {apiKey.status === 'Disabled' ? 'Enable' : 'Disable'}
                        </DropdownItem>
                        <DropdownItem
                          key="revoke"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAPIKeyStatus(apiKey);
                            toggleKebabMenu(apiKey.id);
                          }}
                          id={`revoke-key-${apiKey.id}`}
                        >
                          Revoke
                        </DropdownItem>
                        <Divider component="li" key="separator" />
                        <DropdownItem
                          key="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAPIKey(apiKey);
                            toggleKebabMenu(apiKey.id);
                          }}
                          id={`delete-key-${apiKey.id}`}
                          isDanger
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

      <CreateAPIKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DeleteAPIKeyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        apiKey={selectedAPIKey}
        onDelete={handleDeleteConfirm}
      />
    </PageSection>
  );
};

export { APIKeys };