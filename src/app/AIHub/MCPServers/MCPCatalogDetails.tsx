import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ExpandableSection,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  PageSection,
  Pagination,
  Spinner,
  Title,
} from '@patternfly/react-core';
import {
  AngleLeftIcon,
  AngleRightIcon,
  CaretDownIcon,
  CaretRightIcon,
  ExternalLinkAltIcon,
  GithubIcon,
  WrenchIcon,
} from '@patternfly/react-icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { mcpServers, mcpCatalogLogos } from './mockData';
import { DeployMCPServerModal } from './DeployMCPServerModal';
import type { MCPServerTool } from './types';

// Simple markdown to HTML converter
const markdownToHtml = (markdown: string): string => {
  let html = markdown
    // Headers (order matters - do h4 before h3 before h2 before h1)
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    // Wrap consecutive list items in ul tags
    .replace(/(<li>.*<\/li>\n?)+/gim, '<ul>$&</ul>')
    // Ordered lists (numbered items)
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>');

  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs and fix structure
  html = html.replace(/<p><\/p>/gim, '');
  html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<ul>)/gim, '$1');
  html = html.replace(/(<\/ul>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<pre>)/gim, '$1');
  html = html.replace(/(<\/pre>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<ol>)/gim, '$1');
  html = html.replace(/(<\/ol>)<\/p>/gim, '$1');
  html = html.replace(/<p><br>/gim, '<p>');
  html = html.replace(/<br><\/p>/gim, '</p>');

  return html;
};

const MCPCatalogDetails: React.FunctionComponent = () => {
  const { serverSlug } = useParams<{ serverSlug: string }>();
  const navigate = useNavigate();

  // Find the server
  const server = mcpServers.find((s) => s.slug === serverSlug);

  useDocumentTitle(server?.name || 'MCP Server Details');

  // State
  const [isDeployModalOpen, setIsDeployModalOpen] = React.useState(false);
  const [currentToolPage, setCurrentToolPage] = React.useState(1);
  const [expandedTools, setExpandedTools] = React.useState<Set<string>>(new Set());
  const [readmeContent, setReadmeContent] = React.useState<string | null>(null);
  const [isLoadingReadme, setIsLoadingReadme] = React.useState(true);

  // Fetch README from GitHub
  React.useEffect(() => {
    if (!server) return;

    const fetchReadme = async () => {
      setIsLoadingReadme(true);
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${server.githubOwner}/${server.githubRepo}/main/README.md`
        );
        if (response.ok) {
          const content = await response.text();
          setReadmeContent(content);
        } else {
          setReadmeContent(server.readmeFallback);
        }
      } catch {
        setReadmeContent(server.readmeFallback);
      } finally {
        setIsLoadingReadme(false);
      }
    };

    fetchReadme();
  }, [server]);

  if (!server) {
    return (
      <PageSection>
        <Title headingLevel="h1">Server not found</Title>
        <p>The MCP server "{serverSlug}" was not found.</p>
        <Button variant="link" onClick={() => navigate('/ai-hub/mcp/catalog')}>
          Back to MCP Catalog
        </Button>
      </PageSection>
    );
  }

  const toolsPerPage = 5;
  const totalToolPages = Math.ceil(server.tools.length / toolsPerPage);
  const currentTools = server.tools.slice(
    (currentToolPage - 1) * toolsPerPage,
    currentToolPage * toolsPerPage
  );

  const toggleToolExpanded = (toolName: string) => {
    setExpandedTools((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(toolName)) {
        newSet.delete(toolName);
      } else {
        newSet.add(toolName);
      }
      return newSet;
    });
  };

  const renderToolCard = (tool: MCPServerTool) => {
    const isExpanded = expandedTools.has(tool.name);

    return (
      <div
        key={tool.name}
        style={{
          border: '1px solid #d2d2d2',
          borderRadius: '8px',
          marginBottom: '0.75rem',
          overflow: 'hidden',
        }}
      >
        {/* Tool Header */}
        <div
          onClick={() => toggleToolExpanded(tool.name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            cursor: 'pointer',
            backgroundColor: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>{tool.name}</span>
            {!tool.readOnly && (
              <span
                style={{
                  backgroundColor: '#fef3cd',
                  color: '#856404',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                read/write
              </span>
            )}
          </div>
          {isExpanded ? (
            <CaretDownIcon style={{ color: '#6a6e73' }} />
          ) : (
            <CaretRightIcon style={{ color: '#6a6e73' }} />
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid #f0f0f0' }}>
            <p style={{ color: '#6a6e73', margin: '1rem 0' }}>
              {tool.description}
            </p>
            <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>
              Input Parameters:
            </div>
            {tool.parameters.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tool.parameters.map((param) => (
                  <div
                    key={param.name}
                    style={{
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#f8f8f8',
                      padding: '1rem 1.25rem',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{param.name}</span>
                      <span
                        style={{
                          backgroundColor: '#e8e8e8',
                          color: '#4a4a4a',
                          padding: '0.125rem 0.625rem',
                          borderRadius: '4px',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {param.type}
                      </span>
                      <span
                        style={{
                          backgroundColor: param.required ? '#fce8e8' : '#e8e8e8',
                          color: param.required ? '#c9190b' : '#4a4a4a',
                          padding: '0.125rem 0.625rem',
                          borderRadius: '4px',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {param.required ? 'required' : 'optional'}
                      </span>
                    </div>
                    <div style={{ color: '#151515', fontSize: '0.9375rem' }}>
                      {param.description}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6a6e73' }}>No parameters</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <PageSection>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/ai-hub/mcp/catalog">MCP catalog</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{server.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection style={{ paddingTop: '0.5rem' }}>
        <Grid hasGutter>
          {/* Left Column - Main Content */}
          <GridItem span={8}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <img
                src={mcpCatalogLogos[server.slug]}
                alt={`${server.name} logo`}
                style={{ width: '64px', height: '64px', objectFit: 'contain' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Title headingLevel="h1" size="2xl">
                    {server.name}
                  </Title>
                  <Label color={server.deploymentMode === 'Remote' ? 'blue' : 'green'}>
                    {server.deploymentMode}
                  </Label>
                </div>
                <p style={{ color: 'var(--pf-v5-global--Color--200)' }}>
                  {server.description}
                </p>
              </div>
            </div>

            {/* Tools Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <WrenchIcon style={{ fontSize: '1.25rem' }} />
                  <Title headingLevel="h2" size="lg">
                    Tools
                  </Title>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6a6e73' }}>
                  <Button
                    variant="plain"
                    isDisabled={currentToolPage === 1}
                    onClick={() => setCurrentToolPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                    style={{ padding: '0.25rem' }}
                  >
                    <AngleLeftIcon />
                  </Button>
                  <span>
                    {currentToolPage} / {totalToolPages}
                  </span>
                  <Button
                    variant="plain"
                    isDisabled={currentToolPage === totalToolPages}
                    onClick={() => setCurrentToolPage((p) => Math.min(totalToolPages, p + 1))}
                    aria-label="Next page"
                    style={{ padding: '0.25rem' }}
                  >
                    <AngleRightIcon />
                  </Button>
                </div>
              </div>
              <div>{currentTools.map(renderToolCard)}</div>
            </div>

            {/* README Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GithubIcon />
                    <Title headingLevel="h2" size="lg">
                      README
                    </Title>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                {isLoadingReadme ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Spinner size="md" />
                    <span>Loading README...</span>
                  </div>
                ) : (
                  <div
                    className="readme-content"
                    style={{
                      maxHeight: '500px',
                      overflow: 'auto',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: markdownToHtml(readmeContent || server.readmeFallback),
                    }}
                  />
                )}
                <style>{`
                  .readme-content h1 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                    color: var(--pf-v5-global--Color--100);
                  }
                  .readme-content h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 1.5rem 0 0.75rem 0;
                    color: var(--pf-v5-global--Color--100);
                  }
                  .readme-content h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 1.25rem 0 0.5rem 0;
                    color: var(--pf-v5-global--Color--100);
                  }
                  .readme-content h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 1rem 0 0.5rem 0;
                    color: var(--pf-v5-global--Color--100);
                  }
                  .readme-content p {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                    color: var(--pf-v5-global--Color--100);
                  }
                  .readme-content ul {
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                  }
                  .readme-content li {
                    margin: 0.25rem 0;
                    line-height: 1.6;
                  }
                  .readme-content pre {
                    background-color: #f5f5f5;
                    border: 1px solid #d2d2d2;
                    border-radius: 6px;
                    padding: 1rem;
                    margin: 0.75rem 0;
                    overflow-x: auto;
                  }
                  .readme-content pre code {
                    font-family: var(--pf-v5-global--FontFamily--monospace);
                    font-size: 0.875rem;
                    background: none;
                    padding: 0;
                  }
                  .readme-content code {
                    font-family: var(--pf-v5-global--FontFamily--monospace);
                    font-size: 0.875rem;
                    background-color: #f0f0f0;
                    padding: 0.125rem 0.375rem;
                    border-radius: 3px;
                  }
                  .readme-content a {
                    color: var(--pf-v5-global--link--Color);
                    text-decoration: none;
                  }
                  .readme-content a:hover {
                    text-decoration: underline;
                  }
                `}</style>
              </CardBody>
            </Card>
          </GridItem>

          {/* Right Column - Details Sidebar */}
          <GridItem span={4}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <Button
                variant="primary"
                onClick={() => setIsDeployModalOpen(true)}
              >
                Deploy MCP Server
              </Button>
            </div>
            <Card isFullHeight>
              <CardHeader>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">
                    Details
                  </Title>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <DescriptionList>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Labels</DescriptionListTerm>
                    <DescriptionListDescription>
                      <LabelGroup>
                        {server.labels.map((label, index) => (
                          <Label key={index} color="grey" isCompact>
                            {label}
                          </Label>
                        ))}
                      </LabelGroup>
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>License</DescriptionListTerm>
                    <DescriptionListDescription>{server.license}</DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Version</DescriptionListTerm>
                    <DescriptionListDescription>{server.version}</DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Deployment mode</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label color={server.deploymentMode === 'Remote' ? 'blue' : 'green'}>
                        {server.deploymentMode}
                      </Label>
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Published</DescriptionListTerm>
                    <DescriptionListDescription>{server.publishedDate}</DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Location</DescriptionListTerm>
                    <DescriptionListDescription>{server.location}</DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Source code</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Button
                        variant="link"
                        isInline
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="end"
                        component="a"
                        href={server.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </Button>
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Provider</DescriptionListTerm>
                    <DescriptionListDescription>{server.provider}</DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Transport type</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label color="purple" isCompact>
                        {server.transportType}
                      </Label>
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Modified</DescriptionListTerm>
                    <DescriptionListDescription>{server.modifiedDate}</DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>

      <DeployMCPServerModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        serverName={server.name}
      />
    </>
  );
};

export { MCPCatalogDetails };
