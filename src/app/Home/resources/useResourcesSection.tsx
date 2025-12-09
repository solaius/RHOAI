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
  Grid,
  GridItem,
  Button,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

export const useResourcesSection = (): React.ReactNode => {
  const [resourcesOpen, setResourcesOpen] = React.useState(true);

  // Mock resources data
  const resources = [
    {
      title: 'Documentation',
      description: 'Learn about Red Hat OpenShift AI features and capabilities',
      link: 'https://access.redhat.com/documentation/en-us/red_hat_openshift_ai',
    },
    {
      title: 'Tutorial - Create a Jupyter notebook',
      description: 'Create and train a model using a Jupyter notebook',
      link: '#',
    },
    {
      title: 'Quick starts',
      description: 'Step-by-step instructions and tasks',
      link: '#',
    },
  ];

  if (!resourcesOpen) {
    return null;
  }

  return (
    <PageSection hasBodyWrapper={false} data-testid="landing-page-resources">
      <Stack hasGutter>
        <StackItem>
          <Content component={ContentVariants.h1}>Resources</Content>
        </StackItem>
        <StackItem>
          <Grid hasGutter>
            {resources.map((resource, index) => (
              <GridItem key={index} md={4}>
                <Card style={{ height: '100%' }}>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardBody>
                    <Stack hasGutter>
                      <StackItem>
                        <Content component="small">{resource.description}</Content>
                      </StackItem>
                      <StackItem>
                        <Button
                          variant="link"
                          isInline
                          icon={<ExternalLinkAltIcon />}
                          iconPosition="end"
                          component="a"
                          href={resource.link}
                          target="_blank"
                        >
                          View resource
                        </Button>
                      </StackItem>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

