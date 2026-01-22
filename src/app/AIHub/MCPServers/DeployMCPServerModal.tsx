import * as React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';

interface DeployMCPServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName?: string;
}

export const DeployMCPServerModal: React.FunctionComponent<DeployMCPServerModalProps> = ({
  isOpen,
  onClose,
  serverName,
}) => {
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="deploy-mcp-modal-title"
    >
      <ModalHeader title={`Deploy MCP Server${serverName ? `: ${serverName}` : ''}`} />
      <ModalBody>
        <p>Deployment options coming soon.</p>
        <p style={{ marginTop: '1rem', color: 'var(--pf-v5-global--Color--200)' }}>
          This feature will allow you to deploy MCP servers to your OpenShift cluster with custom configurations.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
