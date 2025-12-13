import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Content,
  Flex,
  FlexItem,
  Modal,
  ModalVariant,
  ModalBody,
  Button,
} from '@patternfly/react-core';
import GettingStartingImage from '@app/bgimages/GettingStarting.png';
import { CapabilityCard } from './CapabilityCardVariations';
import {
  PipelinesIcon,
  ModelCatalogIcon,
  ModelRegistryIcon,
  DeploymentsIcon,
  PlaygroundIcon,
  WorkbenchesIcon,
  FeatureStoreIcon,
  EvaluationsIcon,
  ExperimentsIcon,
  KnowledgeSourcesIcon,
  AutoRAGIcon,
  PromptLabIcon,
  AIAssetEndpointsIcon,
} from '../icons';
import AiHubNavIcon from '../../../images/icons/AiHubNavIcon';
import GenAiStudioNavIcon from '../../../images/icons/GenAiStudioNavIcon';
import DevelopAndTrainNavIcon from '../../../images/icons/DevelopAndTrainNavIcon';

type CapabilityCategory = 'ai-hub' | 'gen-ai' | 'develop' | 'observe';

interface CapabilityData {
  title: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
  isNew?: boolean;
  category: CapabilityCategory;
  onClick?: () => void;
}

const categoryInfo: Record<
  CapabilityCategory,
  { label: string; icon: React.ReactNode; description: React.ReactNode }
> = {
  'ai-hub': {
    label: 'AI Hub',
    icon: <AiHubNavIcon />,
    description: (
      <>
        Discover, manage and deploy models in the <strong>AI hub</strong>
      </>
    ),
  },
  'gen-ai': {
    label: 'Gen AI studio',
    icon: <GenAiStudioNavIcon />,
    description: (
      <>
        Build and experiment with generative AI in the <strong>Gen AI studio</strong>
      </>
    ),
  },
  develop: {
    label: 'Develop & Train',
    icon: <DevelopAndTrainNavIcon />,
    description: (
      <>
        Create and train AI/ML models with <strong>Develop & Train</strong>
      </>
    ),
  },
  observe: {
    label: 'Observe & Monitor',
    icon: <DevelopAndTrainNavIcon />,
    description: (
      <>
        Monitor and evaluate model performance with <strong>Observe & Monitor</strong>
      </>
    ),
  },
};

const HomeIllustratedGettingStarted: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const navigate = useNavigate();

  const showModal = (message: string) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const capabilities: CapabilityData[] = [
    {
      title: 'Model Catalog',
      description: 'Browse and deploy pre-trained models from the AI Hub catalog',
      icon: <ModelCatalogIcon withBackground size={32} />,
      path: '/ai-hub/catalog',
      category: 'ai-hub',
    },
    {
      title: 'Model Registry',
      description: 'Register, version, and manage your trained models',
      icon: <ModelRegistryIcon withBackground size={32} />,
      path: '/ai-hub/registry',
      category: 'ai-hub',
    },
    {
      title: 'Deployments',
      description: 'Deploy and serve models for inference',
      icon: <DeploymentsIcon withBackground size={32} />,
      path: '/ai-hub/deployments',
      category: 'ai-hub',
    },
    {
      title: 'AI asset endpoints',
      description: 'Access and manage endpoints for deployed AI models and services',
      icon: <AIAssetEndpointsIcon withBackground size={32} />,
      path: '/gen-ai-studio/asset-endpoints',
      category: 'gen-ai',
    },
    {
      title: 'Playground',
      description: 'Experiment with models and prompts in an interactive environment',
      icon: <PlaygroundIcon withBackground size={32} />,
      path: '/gen-ai-studio/playground',
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'Prompt lab',
      description: 'Engineer and test prompts with advanced tooling',
      icon: <PromptLabIcon withBackground size={32} />,
      path: '/gen-ai-studio/prompt-lab',
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'AutoRAG',
      description: 'Build and optimize RAG solutions with automated workflows',
      icon: <AutoRAGIcon withBackground size={32} />,
      path: '/gen-ai-studio/autorag',
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'Knowledge Sources',
      description: 'Manage vector databases and knowledge bases for RAG',
      icon: <KnowledgeSourcesIcon withBackground size={32} />,
      onClick: () => showModal('This page does not exist yet'),
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'Workbenches',
      description: 'Create development environments with JupyterLab, VS Code, and more',
      icon: <WorkbenchesIcon withBackground size={32} />,
      onClick: () => showModal('This page does not exist yet'),
      category: 'develop',
    },
    {
      title: 'Feature store',
      description: 'Manage and share features for ML models',
      icon: <FeatureStoreIcon withBackground size={32} />,
      path: '/develop-train/feature-store/overview',
      category: 'develop',
    },
    {
      title: 'Pipelines',
      description: 'Build and orchestrate ML workflows and automation',
      icon: <PipelinesIcon withBackground size={32} />,
      path: '/develop-train/pipelines/definitions',
      category: 'develop',
    },
    {
      title: 'Experiments',
      description: 'Track and compare model training experiments',
      icon: <ExperimentsIcon withBackground size={32} />,
      path: '/develop-train/experiments',
      category: 'develop',
    },
    {
      title: 'Evaluations',
      description: 'Evaluate model quality, bias, and fairness',
      icon: <EvaluationsIcon withBackground size={32} />,
      path: '/develop-train/evaluations',
      category: 'develop',
      isNew: true,
    },
  ];

  const categoriesToShow: CapabilityCategory[] = ['ai-hub', 'gen-ai', 'develop'];

  const getInitialCategory = (): CapabilityCategory | null => {
    const stored = localStorage.getItem('illustratedGettingStartedSelectedCategory');
    if (stored === 'null' || stored === null) {
      return null;
    }
    if (stored && categoriesToShow.includes(stored as CapabilityCategory)) {
      return stored as CapabilityCategory;
    }
    return null;
  };

  const [selectedCategory, setSelectedCategory] = React.useState<CapabilityCategory | null>(
    getInitialCategory
  );

  React.useEffect(() => {
    localStorage.setItem('illustratedGettingStartedSelectedCategory', selectedCategory || 'null');
  }, [selectedCategory]);

  const handleCategoryClick = (category: CapabilityCategory) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const groupedCapabilities: Record<CapabilityCategory, CapabilityData[]> = {
    'ai-hub': capabilities.filter((c) => c.category === 'ai-hub'),
    'gen-ai': capabilities.filter((c) => c.category === 'gen-ai'),
    develop: capabilities.filter((c) => c.category === 'develop'),
    observe: capabilities.filter((c) => c.category === 'observe'),
  };

  return (
    <>
      <PageSection variant="default" hasBodyWrapper={false}>
        <Stack hasGutter>
          <StackItem>
            <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsStretch' }}>
              {/* Get Started Card - twice as wide as each selector */}
              <FlexItem flex={{ default: 'flex_3' }}>
                <Card style={{ overflow: 'hidden', height: '100%' }}>
                  <CardBody style={{ padding: 0, height: '100%' }}>
                    <Flex alignItems={{ default: 'alignItemsStretch' }} style={{ height: '100%' }}>
                      <FlexItem flex={{ default: 'flex_1' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={GettingStartingImage}
                          alt="Getting Started Illustration"
                          style={{ width: '100%', maxWidth: '180px', padding: '1rem' }}
                        />
                      </FlexItem>
                      <FlexItem flex={{ default: 'flex_1' }} style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                        <Flex
                          direction={{ default: 'column' }}
                          spaceItems={{ default: 'spaceItemsMd' }}
                          style={{ width: '100%' }}
                        >
                          <FlexItem>
                            <Content component="h2" style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                              Get started
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <Content>
                              Discover models that are available for your organization to register, deploy, and
                              customize.
                            </Content>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </FlexItem>

              {/* Category Selector Cards - half the width of Get Started */}
              {categoriesToShow.map((category) => (
                <FlexItem key={category} flex={{ default: 'flex_2' }}>
                  <Card
                    isClickable
                    isClicked={selectedCategory === category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    data-testid={`category-selector-${category}`}
                    style={{ height: '100%' }}
                  >
                    <CardHeader
                      selectableActions={{
                        onClickAction: () => handleCategoryClick(category),
                        selectableActionAriaLabelledby: `category-label-${category}`,
                      }}
                    >
                      <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                        <FlexItem>
                          <div style={{ fontSize: '24px', minWidth: '24px' }}>
                            {categoryInfo[category].icon}
                          </div>
                        </FlexItem>
                        <FlexItem flex={{ default: 'flex_1' }}>
                          <Content id={`category-label-${category}`}>
                            {categoryInfo[category].description}
                          </Content>
                        </FlexItem>
                      </Flex>
                    </CardHeader>
                  </Card>
                </FlexItem>
              ))}
            </Flex>
          </StackItem>

          {/* Capability Cards */}
          {selectedCategory && (
            <StackItem>
              <div data-testid={`capability-group-${selectedCategory}`}>
                <Grid hasGutter sm={6} md={4} lg={3}>
                  {groupedCapabilities[selectedCategory].map((capability) => (
                    <GridItem key={capability.title}>
                      <CapabilityCard capability={capability} layout="editorial" />
                    </GridItem>
                  ))}
                </Grid>
              </div>
            </StackItem>
          )}
        </Stack>
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

export default HomeIllustratedGettingStarted;

