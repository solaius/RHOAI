import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
  Stack,
  StackItem,
  Card,
  CardBody,
  CardTitle,
  CardFooter,
  Grid,
  GridItem,
  Button,
  Label,
  LabelGroup,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

export const useResourcesSection = (): React.ReactNode => {
  const navigate = useNavigate();
  const [resourcesOpen, setResourcesOpen] = React.useState(true);

  // Mock resources data
  const resources = [
    {
      type: 'documentation',
      title: 'Red Hat OpenShift AI',
      subtitle: 'by Red Hat',
      description:
        'OpenShift AI provides an environment to develop, train, serve, test, and monitor AI/ML models on-premises or in the cloud.',
      link: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai',
    },
    {
      type: 'quickstart',
      title: 'Chat with a model',
      description: 'Deploy a validated model and start chatting in the AI Playground',
      steps: ['Deploy a validated model using kserve-vllm', 'Chat with the model in AI Playground'],
      duration: '10 min',
      difficulty: 'beginner' as const,
      link: '#',
    },
    {
      type: 'quickstart',
      title: 'Build a RAG solution',
      description: 'Create a Retrieval-Augmented Generation application with AutoRAG',
      steps: [
        'Verify Model Serving connections',
        'Configure Vector Database',
        'Launch AutoRAG',
      ],
      duration: '25 min',
      difficulty: 'intermediate' as const,
      link: '#',
    },
    {
      type: 'quickstart',
      title: 'Finetune a model',
      description: 'Set up distributed training for model finetuning',
      steps: [
        'Install CodeFlare/Ray',
        'Validate GPU quotas and Hardware Profiles',
        'Launch finetuning job',
      ],
      duration: '45 min',
      difficulty: 'advanced' as const,
      link: '#',
    },
  ];

  if (!resourcesOpen) {
    return null;
  }

  const difficultyColors = {
    beginner: 'green',
    intermediate: 'orange',
    advanced: 'red',
  } as const;

  const renderDocumentationCard = (resource: (typeof resources)[0]) => {
    if (resource.type !== 'documentation') return null;

    return (
      <Card style={{ height: '100%' }} data-testid="resource-card-rhoai-documentation">
        <CardTitle>
          <Content>{resource.title}</Content>
        </CardTitle>
        <CardBody>
          <Stack hasGutter>
            <StackItem>
              <LabelGroup>
                <Label color="orange">Documentation</Label>
              </LabelGroup>
            </StackItem>
            <StackItem>
              <Content>{resource.description}</Content>
            </StackItem>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="end"
            component="a"
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="view-documentation"
          >
            View documentation
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderQuickStartCard = (resource: (typeof resources)[0]) => {
    if (resource.type !== 'quickstart') return null;

    return (
      <Card style={{ height: '100%' }}>
        <CardTitle>
          <Content>{resource.title}</Content>
        </CardTitle>
        <CardBody>
          <Stack hasGutter>
            <StackItem>
              <LabelGroup>
                <Label color="blue">Quick start</Label>
                <Label color={difficultyColors[resource.difficulty!]}>
                  {resource.difficulty!.charAt(0).toUpperCase() + resource.difficulty!.slice(1)}
                </Label>
                <Label>{resource.duration}</Label>
              </LabelGroup>
            </StackItem>
            <StackItem>
              <Content>{resource.description}</Content>
            </StackItem>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button variant="link" component="a" href={resource.link}>
            Start quick start
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <PageSection hasBodyWrapper={false} data-testid="landing-page-resources">
      <Stack hasGutter>
        <StackItem>
          <Content component={ContentVariants.h1}>Learning resources</Content>
        </StackItem>
        <StackItem>
          <Grid hasGutter>
            {resources.map((resource, index) => (
              <GridItem key={index} md={3} sm={6}>
                {resource.type === 'documentation'
                  ? renderDocumentationCard(resource)
                  : renderQuickStartCard(resource)}
              </GridItem>
            ))}
          </Grid>
        </StackItem>
        <StackItem>
          <Button
            data-testid="goto-learning-resources-link"
            variant="link"
            isInline
            onClick={() => navigate('/learning-resources')}
          >
            Go to <b>Learning Resources</b>
          </Button>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

