import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  Select,
  SelectList,
  SelectOption,
  TextInput,
} from '@patternfly/react-core';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';

interface WizardData {
  serverLocation: string;
  serverUri: string;
  newConnection: boolean;
  serverType: string;
  project: string;
  deploymentName: string;
  makeAvailableExternal: boolean;
  requireTokenAuth: boolean;
  serviceAccountNames: string[];
}

const defaultServerUri = 'mcp+stdio://example.com/servicenow-mcp:1.0.0';

const DeployMCPServerModal: React.FunctionComponent = () => {
  useDocumentTitle('Deploy an MCP server');
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProject } = useFeatureFlags();

  const locationState = location.state as {
    serverUri?: string;
    connectionUrl?: string;
    mcpServerName?: string;
    version?: string;
    serverSlug?: string;
  };
  const initialUri =
    locationState?.serverUri ??
    locationState?.connectionUrl ??
    defaultServerUri;
  const initialMcpServerName = locationState?.mcpServerName;
  const initialVersion = locationState?.version;
  const serverSlug = locationState?.serverSlug;

  const [wizardData, setWizardData] = React.useState<WizardData>({
    serverLocation: 'URI',
    serverUri: initialUri,
    newConnection: false,
    serverType: 'MCP SSE server',
    project: selectedProject,
    deploymentName: 'servicenow-mcp-v1',
    makeAvailableExternal: false,
    requireTokenAuth: false,
    serviceAccountNames: ['default-token'],
  });
  const [isProjectOpen, setIsProjectOpen] = React.useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = React.useState(false);

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  const handleClose = () => {
    // Go back to the details page instead of deployments
    if (serverSlug) {
      navigate(`/ai-hub/mcp/catalog/${serverSlug}`);
    } else {
      navigate(-1);
    }
  };

  const handleDeploy = () => {
    // Use server name and version from details page (passed in location.state), or fallback to parsing URI
    const mcpServerName =
      initialMcpServerName ||
      (() => {
        const uriMatch = wizardData.serverUri.match(/\/([^/]+?)(?::(\d+\.\d+\.\d+))?$/);
        return uriMatch ? (uriMatch[1] || 'MCP Server').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'MCP Server';
      })();
    const version = initialVersion || (() => {
      const uriMatch = wizardData.serverUri.match(/\/([^/]+?)(?::(\d+\.\d+\.\d+))?$/);
      return uriMatch?.[2] || '1.0.0';
    })();

    navigate('/ai-hub/mcp/deployments', {
      state: {
        newDeployment: {
          id: `new-${Date.now()}`,
          userName: wizardData.deploymentName?.trim() || `${mcpServerName} deployment`,
          mcpServerName,
          version,
          created: new Date().toISOString(),
          status: 'Running',
        },
      },
    });
  };

  // Server deployment form
  const serverDeploymentStep = (
    <Form>
      <FormGroup label="Source URI" isRequired>
        <TextInput
          id="deploy-mcp-server-uri"
          value={wizardData.serverUri}
          readOnlyVariant="default"
          placeholder="mcp+stdio://host/path:version"
          aria-label="Source URI (from catalog)"
        />
      </FormGroup>

      <FormGroup label="Project" isRequired>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>
              This is the Red Hat OpenShift AI project where the MCP server will be deployed.
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
        <Select
          id="deploy-mcp-server-project-select"
          isOpen={isProjectOpen}
          selected={wizardData.project}
          onSelect={(_event, value) => {
            updateWizardData({ project: value as string });
            setIsProjectOpen(false);
          }}
          onOpenChange={(isOpen) => setIsProjectOpen(isOpen)}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsProjectOpen(!isProjectOpen)}
              isExpanded={isProjectOpen}
              style={{ width: '100%' }}
              aria-label="Project"
            >
              {wizardData.project || 'Select target project'}
            </MenuToggle>
          )}
        >
          <SelectList>
            <SelectOption value="Project X">Project X</SelectOption>
            <SelectOption value="Project Y">Project Y</SelectOption>
          </SelectList>
        </Select>
      </FormGroup>

      <FormGroup label="Name">
        <FormHelperText>
          <HelperText>
            <HelperTextItem>
              Name this deployment for your own reference.
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
        <TextInput
          id="deploy-mcp-server-name"
          value={wizardData.deploymentName}
          onChange={(_event, value) => updateWizardData({ deploymentName: value })}
          placeholder="servicenow-mcp-deployment"
          aria-label="Name"
        />
      </FormGroup>
    </Form>
  );

return (
    <>
      <PageSection>
        <Modal
          variant={ModalVariant.large}
          isOpen
          onClose={handleClose}
          id="deploy-mcp-server-modal"
        >
          <ModalHeader title="Deploy an MCP server" />
          <ModalBody>
            <p style={{ marginBottom: '1rem', color: 'var(--pf-v5-global--Color--200)' }}>
              Configure where and how to run this MCP server.
            </p>
            {serverDeploymentStep}
            <Alert
              variant="info"
              isInline
              title="Additional configuration required"
              style={{ marginTop: '1rem' }}
              id="deploy-mcp-gateway-alert"
            >
              The MCP gateway must be configured to make this deployment accessible.{' '}
              <Button variant="link" isInline onClick={() => setIsDocsModalOpen(true)} id="deploy-mcp-gateway-docs-link">
                See documentation
              </Button>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button variant="link" onClick={handleClose} id="deploy-mcp-server-modal-cancel">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeploy} id="deploy-mcp-server-modal-deploy">
              Deploy server
            </Button>
          </ModalFooter>
        </Modal>
      </PageSection>

      <Modal
        variant={ModalVariant.small}
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        id="deploy-mcp-docs-coming-soon-modal"
      >
        <ModalHeader title="Coming soon" />
        <ModalBody>Documentation for configuring the MCP gateway will be available soon.</ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsDocsModalOpen(false)} id="deploy-mcp-docs-modal-close">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { DeployMCPServerModal };
