import * as React from 'react';
import {
  Card,
  CardHeader,
  Content,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import {
  BrainIcon,
  ChartLineIcon,
  CodeBranchIcon,
  CubesIcon,
} from '@patternfly/react-icons';
import { CapabilityCard } from './CapabilityCardVariations';

type CapabilityCategory = 'ai-hub' | 'gen-ai' | 'develop' | 'observe';

interface CapabilityData {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: CapabilityCategory;
  isNew?: boolean;
}

interface CapabilityGroupVariation2CardsProps {
  capabilities: CapabilityData[];
  includeCategories?: CapabilityCategory[];
}

const categoryInfo: Record<
  CapabilityCategory,
  { label: string; icon: React.ReactNode; description: React.ReactNode }
> = {
  'ai-hub': {
    label: 'AI Hub',
    icon: <CubesIcon />,
    description: (
      <>
        Discover, manage and deploy models in the <strong>AI hub</strong>
      </>
    ),
  },
  'gen-ai': {
    label: 'Generative AI Studio',
    icon: <BrainIcon />,
    description: (
      <>
        Build and experiment with generative AI in the <strong>Generative AI Studio</strong>
      </>
    ),
  },
  develop: {
    label: 'Develop & Train',
    icon: <CodeBranchIcon />,
    description: (
      <>
        Create and train AI/ML models with <strong>Develop & Train</strong>
      </>
    ),
  },
  observe: {
    label: 'Observe & Monitor',
    icon: <ChartLineIcon />,
    description: (
      <>
        Monitor and evaluate model performance with <strong>Observe & Monitor</strong>
      </>
    ),
  },
};

const CapabilityGroupVariation2Cards: React.FunctionComponent<
  CapabilityGroupVariation2CardsProps
> = ({ capabilities, includeCategories }) => {
  // Determine which categories to display
  const categoriesToShow: CapabilityCategory[] = includeCategories || [
    'ai-hub',
    'gen-ai',
    'develop',
    'observe',
  ];

  const [selectedCategory, setSelectedCategory] =
    React.useState<CapabilityCategory>(categoriesToShow[0]);

  // Group capabilities by category
  const groupedCapabilities: Record<CapabilityCategory, CapabilityData[]> = {
    'ai-hub': capabilities.filter((c) => c.category === 'ai-hub'),
    'gen-ai': capabilities.filter((c) => c.category === 'gen-ai'),
    develop: capabilities.filter((c) => c.category === 'develop'),
    observe: capabilities.filter((c) => c.category === 'observe'),
  };

  // Calculate grid column span based on number of categories
  const gridColumnSpan = categoriesToShow.length === 3 ? 4 : 3;

  return (
    <Stack hasGutter>
      <StackItem>
        <Grid hasGutter>
          {categoriesToShow.map((category) => (
            <GridItem key={category} sm={6} md={gridColumnSpan}>
              <Card
                isClickable
                isClicked={selectedCategory === category}
                isFullHeight
                variant={selectedCategory === category ? 'default' : 'secondary'}
                data-testid={`category-selector-${category}`}
              >
                <CardHeader
                  selectableActions={{
                    onClickAction: () => setSelectedCategory(category),
                    selectableActionAriaLabelledby: `category-label-${category}`,
                  }}
                >
                  <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                    <FlexItem>
                      <div
                        style={{
                          fontSize: '36px',
                          minWidth: '36px',
                        }}
                      >
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
            </GridItem>
          ))}
        </Grid>
      </StackItem>
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
    </Stack>
  );
};

export default CapabilityGroupVariation2Cards;

