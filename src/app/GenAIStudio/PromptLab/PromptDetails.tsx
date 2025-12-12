import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  MenuToggle,
  PageSection,
  Title,
  ToggleGroup,
  ToggleGroupItem,
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
  PlayIcon,
  AngleRightIcon,
} from '@patternfly/react-icons';
import { CreateVersionModal } from './components/CreateVersionModal';
import { DeletePromptModal } from './components/DeletePromptModal';
import { DeleteVersionModal } from './components/DeleteVersionModal';
import { PromptCompareView } from './components/PromptCompareView';
import { mockPrompts } from './mockData';
import { Prompt, PromptVersion } from './types';

type ViewType = 'preview' | 'list' | 'compare';

const PromptDetails: React.FunctionComponent = () => {
  const { promptId } = useParams<{ promptId: string }>();
  const navigate = useNavigate();
  
  const [prompt, setPrompt] = React.useState<Prompt | null>(null);
  const [activeView, setActiveView] = React.useState<ViewType>('preview');
  const [selectedVersion, setSelectedVersion] = React.useState<PromptVersion | null>(null);
  const [compareVersions, setCompareVersions] = React.useState<string[]>([]);
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);
  const [isCreateVersionModalOpen, setIsCreateVersionModalOpen] = React.useState(false);
  const [isDeletePromptModalOpen, setIsDeletePromptModalOpen] = React.useState(false);
  const [isDeleteVersionModalOpen, setIsDeleteVersionModalOpen] = React.useState(false);

  React.useEffect(() => {
    // Load prompt data
    const foundPrompt = mockPrompts.find((p) => p.id === promptId);
    if (foundPrompt) {
      setPrompt(foundPrompt);
      // Set latest version as selected by default
      if (foundPrompt.versions.length > 0) {
        setSelectedVersion(foundPrompt.versions[foundPrompt.versions.length - 1]);
      }
    }
  }, [promptId]);

  const handleCreateVersion = async (versionData: {
    versionNumber: string;
    promptType: 'text' | 'chat';
    promptText: string;
    commitMessage?: string;
  }) => {
    if (!prompt) return;

    // Mock create version
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newVersion: PromptVersion = {
      id: `v-${Date.now()}`,
      versionNumber: versionData.versionNumber,
      registeredAt: new Date(),
      promptText: versionData.promptText,
      promptType: versionData.promptType,
      variables: [],
      aliases: [],
      metadata: {},
      commitMessage: versionData.commitMessage,
    };

    const updatedPrompt = {
      ...prompt,
      versions: [...prompt.versions, newVersion],
      latestVersion: versionData.versionNumber,
      lastModified: new Date(),
    };

    setPrompt(updatedPrompt);
    setSelectedVersion(newVersion);
  };

  const handleDeletePrompt = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    navigate('/gen-ai-studio/prompt-lab');
  };

  const handleDeleteVersion = async () => {
    if (!prompt || !selectedVersion) return;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedVersions = prompt.versions.filter((v) => v.id !== selectedVersion.id);
    const updatedPrompt = {
      ...prompt,
      versions: updatedVersions,
    };

    setPrompt(updatedPrompt);
    if (updatedVersions.length > 0) {
      setSelectedVersion(updatedVersions[updatedVersions.length - 1]);
    } else {
      setSelectedVersion(null);
    }
  };

  const handleVersionSelect = (version: PromptVersion) => {
    if (activeView === 'compare') {
      // Toggle selection for compare
      setCompareVersions((prev) => {
        if (prev.includes(version.id)) {
          return prev.filter((id) => id !== version.id);
        } else if (prev.length < 2) {
          return [...prev, version.id];
        }
        return prev;
      });
    } else {
      setSelectedVersion(version);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const renderPreviewView = () => {
    if (!selectedVersion) return null;

    return (
      <div id="preview-view">
        <Flex
          direction={{ default: 'column' }}
          spaceItems={{ default: 'spaceItemsMd' }}
        >
          <FlexItem>
            <Title headingLevel="h2" size="lg">
              Viewing version {selectedVersion.versionNumber}
            </Title>
          </FlexItem>

          <FlexItem>
            <Flex
              direction={{ default: 'row' }}
              spaceItems={{ default: 'spaceItemsLg' }}
              justifyContent={{ default: 'justifyContentSpaceBetween' }}
            >
              <FlexItem>
                <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>
                    <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                      <strong>Registered at:</strong> {formatDate(selectedVersion.registeredAt)}
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                      <strong>Aliases:</strong>{' '}
                      {selectedVersion.aliases.length > 0 ? (
                        selectedVersion.aliases.join(', ')
                      ) : (
                        <>
                          —{' '}
                          <Button variant="link" isInline style={{ fontSize: 'inherit', padding: 0 }} id="add-alias">
                            Add
                          </Button>
                        </>
                      )}
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                      <strong>Metadata:</strong>{' '}
                      {Object.keys(selectedVersion.metadata).length > 0 ? (
                        JSON.stringify(selectedVersion.metadata)
                      ) : (
                        <>
                          —{' '}
                          <Button variant="link" isInline style={{ fontSize: 'inherit', padding: 0 }} id="add-metadata">
                            Add
                          </Button>
                        </>
                      )}
                    </div>
                  </FlexItem>
                </Flex>
              </FlexItem>

              <FlexItem>
                <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>
                    <Button variant="danger" id="delete-version-button" onClick={() => setIsDeleteVersionModalOpen(true)}>
                      Delete version
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="secondary" id="optimize-button">
                      Optimize
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="secondary" icon={<PlayIcon />} id="use-button">
                      Use
                    </Button>
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
          </FlexItem>

          <FlexItem>
            <div
              style={{
                fontFamily: 'var(--pf-v5-global--FontFamily--monospace)',
                fontSize: 'var(--pf-v5-global--FontSize--sm)',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                padding: 'var(--pf-v5-global--spacer--md)',
                backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
                border: '1px solid var(--pf-v5-global--BorderColor--100)',
                borderRadius: 'var(--pf-v5-global--BorderRadius--sm)',
                minHeight: '300px',
              }}
            >
              {selectedVersion.promptText}
            </div>
          </FlexItem>

          {selectedVersion.commitMessage && (
            <FlexItem>
              <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                <strong>Commit message:</strong> {selectedVersion.commitMessage}
              </div>
            </FlexItem>
          )}
        </Flex>
      </div>
    );
  };

  const renderListView = () => {
    if (!prompt) return null;

    return (
      <div id="list-view">
        <Table aria-label="Versions table" variant="compact" id="versions-list-table">
          <Thead>
            <Tr>
              <Th>Version</Th>
              <Th>Registered at</Th>
              <Th>Aliases</Th>
              <Th>Commit message</Th>
            </Tr>
          </Thead>
          <Tbody>
            {prompt.versions.map((version) => (
              <Tr
                key={version.id}
                id={`version-list-row-${version.id}`}
                isSelectable
                isClickable
                onRowClick={() => handleVersionSelect(version)}
                isRowSelected={selectedVersion?.id === version.id}
              >
                <Td dataLabel="Version">{version.versionNumber}</Td>
                <Td dataLabel="Registered at">{formatDate(version.registeredAt)}</Td>
                <Td dataLabel="Aliases">
                  {version.aliases.length > 0 ? version.aliases.join(', ') : '-'}
                </Td>
                <Td dataLabel="Commit message">{version.commitMessage || '-'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    );
  };

  const renderCompareView = () => {
    if (!prompt) return null;

    const selectedVersionObjects = prompt.versions.filter((v) =>
      compareVersions.includes(v.id)
    );

    if (selectedVersionObjects.length !== 2) {
      return (
        <div id="compare-view-select" style={{ padding: 'var(--pf-v5-global--spacer--lg)', textAlign: 'center' }}>
          <p>Select exactly 2 versions to compare</p>
        </div>
      );
    }

    return (
      <PromptCompareView
        version1={selectedVersionObjects[0]}
        version2={selectedVersionObjects[1]}
      />
    );
  };

  const renderRightColumn = () => {
    switch (activeView) {
      case 'preview':
        return renderPreviewView();
      case 'list':
        return renderListView();
      case 'compare':
        return renderCompareView();
      default:
        return null;
    }
  };

  if (!prompt) {
    return (
      <PageSection>
        <Title headingLevel="h1">Prompt not found</Title>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection id="prompt-details-header" style={{ paddingBottom: '0.5rem' }}>
        <Breadcrumb id="prompt-details-breadcrumb">
          <BreadcrumbItem
            to="/gen-ai-studio/prompt-lab"
            onClick={(e) => {
              e.preventDefault();
              navigate('/gen-ai-studio/prompt-lab');
            }}
          >
            Prompt Lab
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{prompt.name}</BreadcrumbItem>
        </Breadcrumb>

        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsCenter' }}
          style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}
        >
          <FlexItem>
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Title headingLevel="h1" size="xl" id="prompt-details-title">
                  {prompt.name}
                </Title>
              </FlexItem>
              <FlexItem>
                {prompt.tags.length > 0 ? (
                  <LabelGroup numLabels={5} id="prompt-tags">
                    {prompt.tags.map((tag, index) => (
                      <Label key={`tag-${index}`} color="grey" isCompact>
                        {tag}
                      </Label>
                    ))}
                  </LabelGroup>
                ) : (
                  <Button variant="link" isInline style={{ padding: 0 }} id="add-tags-button">
                    Add tags
                  </Button>
                )}
              </FlexItem>
            </Flex>
          </FlexItem>

          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button
                  variant="primary"
                  onClick={() => setIsCreateVersionModalOpen(true)}
                  id="create-version-toolbar-button"
                >
                  Create prompt version
                </Button>
              </FlexItem>
              <FlexItem>
                <Dropdown
                  isOpen={isKebabOpen}
                  onOpenChange={setIsKebabOpen}
                  popperProps={{ position: 'right' }}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsKebabOpen(!isKebabOpen)}
                      variant="plain"
                      aria-label="Prompt actions"
                      isExpanded={isKebabOpen}
                      id="prompt-details-actions"
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="copy" id="copy-to-project">
                      Copy to new project
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      id="delete-prompt"
                      onClick={() => setIsDeletePromptModalOpen(true)}
                    >
                      Delete prompt
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection id="prompt-details-content">
        <Grid hasGutter span={12}>
          <GridItem span={4}>
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
              <FlexItem>
                <ToggleGroup aria-label="View selection" id="view-toggle-group">
                  <ToggleGroupItem
                    text="Preview"
                    buttonId="view-preview"
                    isSelected={activeView === 'preview'}
                    onChange={() => {
                      setActiveView('preview');
                      setCompareVersions([]);
                    }}
                  />
                  <ToggleGroupItem
                    text="List"
                    buttonId="view-list"
                    isSelected={activeView === 'list'}
                    onChange={() => {
                      setActiveView('list');
                      setCompareVersions([]);
                    }}
                  />
                  <ToggleGroupItem
                    text="Compare"
                    buttonId="view-compare"
                    isSelected={activeView === 'compare'}
                    onChange={() => {
                      setActiveView('compare');
                      setCompareVersions([]);
                    }}
                  />
                </ToggleGroup>
              </FlexItem>

              <FlexItem>
                <div>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                    Version
                  </Title>
                  <Table aria-label="Versions table" variant="compact" id="versions-sidebar-table">
                    <Tbody>
                      {prompt.versions.slice().reverse().map((version) => (
                        <Tr
                          key={version.id}
                          id={`version-row-${version.id}`}
                          isSelectable
                          isClickable
                          onRowClick={() => handleVersionSelect(version)}
                          isRowSelected={
                            activeView === 'compare'
                              ? compareVersions.includes(version.id)
                              : selectedVersion?.id === version.id
                          }
                        >
                          <Td>
                            {activeView === 'compare' && (
                              <Checkbox
                                isChecked={compareVersions.includes(version.id)}
                                onChange={() => handleVersionSelect(version)}
                                id={`version-checkbox-${version.id}`}
                                aria-label={`Select version ${version.versionNumber}`}
                              />
                            )}
                          </Td>
                          <Td dataLabel="Version">
                            <Button
                              variant="link"
                              isInline
                              onClick={() => handleVersionSelect(version)}
                              id={`version-link-${version.id}`}
                            >
                              Version {version.versionNumber}
                            </Button>
                            <div
                              style={{
                                fontSize: 'var(--pf-v5-global--FontSize--xs)',
                                color: 'var(--pf-v5-global--Color--200)',
                              }}
                            >
                              {formatDate(version.registeredAt)}
                            </div>
                          </Td>
                          <Td>
                            <AngleRightIcon />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </FlexItem>
            </Flex>
          </GridItem>

          <GridItem span={8}>{renderRightColumn()}</GridItem>
        </Grid>
      </PageSection>

      <CreateVersionModal
        isOpen={isCreateVersionModalOpen}
        onClose={() => setIsCreateVersionModalOpen(false)}
        onSubmit={handleCreateVersion}
        existingPrompt={prompt}
      />

      <DeletePromptModal
        isOpen={isDeletePromptModalOpen}
        onClose={() => setIsDeletePromptModalOpen(false)}
        onDelete={handleDeletePrompt}
        prompt={prompt}
      />

      <DeleteVersionModal
        isOpen={isDeleteVersionModalOpen}
        onClose={() => setIsDeleteVersionModalOpen(false)}
        onDelete={handleDeleteVersion}
        version={selectedVersion}
      />
    </>
  );
};

export { PromptDetails };

