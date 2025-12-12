import * as React from 'react';
import { PageSection, Modal, ModalVariant, ModalBody, Button } from '@patternfly/react-core';
import {
  BrainIcon,
  ChartLineIcon,
  ClipboardListIcon,
  CodeIcon,
  CogIcon,
  CubesIcon,
  DatabaseIcon,
  FlaskIcon,
  RocketIcon,
  SearchIcon,
} from '@patternfly/react-icons';
import CapabilityGroupVariation2Cards from './CapabilityGroupVariation2Cards';

const HomeCapabilitiesSimple: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');

  const showModal = (message: string) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const capabilities: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    path?: string;
    isNew?: boolean;
    category: 'ai-hub' | 'gen-ai' | 'develop' | 'observe';
    onClick?: () => void;
  }> = [
    {
      title: 'Model Catalog',
      description: 'Browse and deploy pre-trained models from the AI Hub catalog',
      icon: <CubesIcon />,
      path: '/ai-hub/catalog',
      category: 'ai-hub',
    },
    {
      title: 'Model Registry',
      description: 'Register, version, and manage your trained models',
      icon: <DatabaseIcon />,
      path: '/ai-hub/registry',
      category: 'ai-hub',
    },
    {
      title: 'Deployments',
      description: 'Deploy and serve models for inference',
      icon: <RocketIcon />,
      path: '/ai-hub/deployments',
      category: 'ai-hub',
    },
    {
      title: 'Playground',
      description: 'Experiment with models and prompts in an interactive environment',
      icon: <CodeIcon />,
      path: '/gen-ai-studio/playground',
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'AutoRAG',
      description: 'Build and optimize RAG solutions with automated workflows',
      icon: <BrainIcon />,
      path: '/gen-ai-studio/autorag',
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'Knowledge Sources',
      description: 'Manage vector databases and knowledge bases for RAG',
      icon: <DatabaseIcon />,
      onClick: () => showModal('This page does not exist yet'),
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'Workbenches',
      description: 'Create development environments with JupyterLab, VS Code, and more',
      icon: <FlaskIcon />,
      onClick: () => showModal('This page does not exist yet'),
      category: 'develop',
    },
    {
      title: 'Feature store',
      description: 'Manage and share features for ML models',
      icon: <DatabaseIcon />,
      path: '/develop-train/feature-store/overview',
      category: 'develop',
    },
    {
      title: 'Pipelines',
      description: 'Build and orchestrate ML workflows and automation',
      icon: <ClipboardListIcon />,
      path: '/develop-train/pipelines/definitions',
      category: 'develop',
    },
    {
      title: 'Experiments',
      description: 'Track and compare model training experiments',
      icon: <SearchIcon />,
      path: '/develop-train/experiments',
      category: 'develop',
    },
    {
      title: 'Evaluations',
      description: 'Evaluate model quality, bias, and fairness',
      icon: <CogIcon />,
      path: '/develop-train/evaluations',
      category: 'develop',
      isNew: true,
    },
    {
      title: 'Model Metrics',
      description: 'Monitor model performance and serving metrics',
      icon: <ChartLineIcon />,
      path: '/metrics',
      category: 'observe',
    },
  ];

  return (
    <>
      <PageSection variant="default" hasBodyWrapper={false} id="home-capabilities-simple">
        <CapabilityGroupVariation2Cards
          capabilities={capabilities}
          includeCategories={['ai-hub', 'gen-ai', 'develop']}
        />
      </PageSection>
      <Modal
        variant={ModalVariant.small}
        title="Page Not Available"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id="page-not-available-modal"
        actions={[
          <Button key="close" variant="primary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <ModalBody>{modalMessage}</ModalBody>
      </Modal>
    </>
  );
};

export default HomeCapabilitiesSimple;

