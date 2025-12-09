import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
  Grid,
  GridItem,
  Stack,
  StackItem,
  ToggleGroup,
  ToggleGroupItem,
  Flex,
  FlexItem,
  Label,
  Divider,
} from '@patternfly/react-core';
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
import HomeHint from '../HomeHint';
import {
  CapabilityCard,
  CapabilityCardLayout,
} from './CapabilityCardVariations';
import CapabilityGroupVariation1Tabs from './CapabilityGroupVariation1Tabs';
import CapabilityGroupVariation2Cards from './CapabilityGroupVariation2Cards';

type GroupingVariation = 'none' | 'tabs' | 'cards';

const HomeCapabilities: React.FunctionComponent = () => {
  const [cardLayout, setCardLayout] = React.useState<CapabilityCardLayout>('icon-top');
  const [groupingVariation, setGroupingVariation] = React.useState<GroupingVariation>('none');

  const capabilities: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    isNew?: boolean;
    category: 'ai-hub' | 'gen-ai' | 'develop' | 'observe';
  }> = [
    {
      title: 'Model Catalog',
      description: 'Browse and deploy pre-trained models from the AI Hub catalog',
      icon: <CubesIcon />,
      path: '/catalog',
      category: 'ai-hub',
    },
    {
      title: 'Model Registry',
      description: 'Register, version, and manage your trained models',
      icon: <DatabaseIcon />,
      path: '/modelRegistry',
      category: 'ai-hub',
    },
    {
      title: 'Deployments',
      description: 'Deploy and serve models for inference',
      icon: <RocketIcon />,
      path: '/deployments',
      category: 'ai-hub',
    },
    {
      title: 'Playground',
      description: 'Experiment with models and prompts in an interactive environment',
      icon: <CodeIcon />,
      path: '/playground',
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'AutoRAG',
      description: 'Build and optimize RAG solutions with automated workflows',
      icon: <BrainIcon />,
      path: '/autorag',
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'Knowledge Sources',
      description: 'Manage vector databases and knowledge bases for RAG',
      icon: <DatabaseIcon />,
      path: '/knowledge-sources',
      category: 'gen-ai',
      isNew: true,
    },
    {
      title: 'Workbenches',
      description: 'Create development environments with JupyterLab, VS Code, and more',
      icon: <FlaskIcon />,
      path: '/workbenches',
      category: 'develop',
    },
    {
      title: 'Pipelines',
      description: 'Build and orchestrate ML workflows and automation',
      icon: <ClipboardListIcon />,
      path: '/pipelines',
      category: 'develop',
    },
    {
      title: 'Experiments',
      description: 'Track and compare model training experiments',
      icon: <SearchIcon />,
      path: '/experiments',
      category: 'develop',
    },
    {
      title: 'Model Metrics',
      description: 'Monitor model performance and serving metrics',
      icon: <ChartLineIcon />,
      path: '/metrics',
      category: 'observe',
    },
    {
      title: 'Evaluations',
      description: 'Evaluate model quality, bias, and fairness',
      icon: <CogIcon />,
      path: '/evaluations',
      category: 'observe',
      isNew: true,
    },
    {
      title: 'Projects',
      description: 'Organize and manage your AI/ML workloads',
      icon: <CubesIcon />,
      path: '/projects',
      category: 'develop',
    },
  ];

  return (
    <>
      <HomeHint
        title="Discover RHOAI Capabilities"
        body={
          <div>
            <p>
              Explore the full breadth of RHOAI and watsonx.ai capabilities. Click any card to jump
              directly into a tool and start your AI/ML workflow.
            </p>
            <p>
              <strong>New features:</strong> AutoRAG, Playground, Knowledge Sources, and Model
              Evaluations are now available.
            </p>
          </div>
        }
        isDisplayed={true}
        homeHintKey="welcome-capabilities"
      />
      <PageSection variant={groupingVariation === 'cards' ? 'default' : 'secondary'} hasBodyWrapper={false}>
        <Stack hasGutter>
          <StackItem>
            <Flex
              justifyContent={{ default: 'justifyContentSpaceBetween' }}
              alignItems={{ default: 'alignItemsFlexStart' }}
            >
              <FlexItem>
                <Content component={ContentVariants.h1}>Platform Capabilities</Content>
                <Content>
                  <small>Quick access to all RHOAI and watsonx.ai tools and services</small>
                </Content>
              </FlexItem>
              <FlexItem>
                <Stack hasGutter>
                  <StackItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>
                        <Label color="blue" isCompact>
                          Grouping:
                        </Label>
                      </FlexItem>
                      <FlexItem>
                        <ToggleGroup aria-label="Grouping variation selector">
                          <ToggleGroupItem
                            text="None"
                            buttonId="grouping-none-toggle"
                            isSelected={groupingVariation === 'none'}
                            onChange={() => setGroupingVariation('none')}
                          />
                          <ToggleGroupItem
                            text="Tabs"
                            buttonId="grouping-tabs-toggle"
                            isSelected={groupingVariation === 'tabs'}
                            onChange={() => setGroupingVariation('tabs')}
                          />
                          <ToggleGroupItem
                            text="Card Selector"
                            buttonId="grouping-cards-toggle"
                            isSelected={groupingVariation === 'cards'}
                            onChange={() => setGroupingVariation('cards')}
                          />
                        </ToggleGroup>
                      </FlexItem>
                    </Flex>
                  </StackItem>
                  {groupingVariation === 'none' && (
                    <StackItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>
                          <Label color="blue" isCompact>
                            Card Layout:
                          </Label>
                        </FlexItem>
                        <FlexItem>
                          <ToggleGroup aria-label="Card layout selector">
                            <ToggleGroupItem
                              text="Icon Top"
                              buttonId="icon-top-toggle"
                              isSelected={cardLayout === 'icon-top'}
                              onChange={() => setCardLayout('icon-top')}
                            />
                            <ToggleGroupItem
                              text="Icon Side"
                              buttonId="icon-side-toggle"
                              isSelected={cardLayout === 'icon-side'}
                              onChange={() => setCardLayout('icon-side')}
                            />
                            <ToggleGroupItem
                              text="Minimal"
                              buttonId="minimal-toggle"
                              isSelected={cardLayout === 'minimal'}
                              onChange={() => setCardLayout('minimal')}
                            />
                            <ToggleGroupItem
                              text="Editorial"
                              buttonId="editorial-toggle"
                              isSelected={cardLayout === 'editorial'}
                              onChange={() => setCardLayout('editorial')}
                            />
                          </ToggleGroup>
                        </FlexItem>
                      </Flex>
                    </StackItem>
                  )}
                </Stack>
              </FlexItem>
            </Flex>
          </StackItem>
          <StackItem>
            {groupingVariation === 'none' && (
              <Grid hasGutter>
                {capabilities.map((capability, index) => (
                  <GridItem key={index} md={4} sm={6}>
                    <CapabilityCard capability={capability} layout={cardLayout} />
                  </GridItem>
                ))}
              </Grid>
            )}
            {groupingVariation === 'tabs' && (
              <CapabilityGroupVariation1Tabs capabilities={capabilities} />
            )}
            {groupingVariation === 'cards' && (
              <CapabilityGroupVariation2Cards capabilities={capabilities} />
            )}
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

export default HomeCapabilities;

