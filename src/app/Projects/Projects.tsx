import * as React from 'react';
import {
  PageSection,
  Title,
  Card,
  CardTitle,
  CardBody,
  Gallery,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
}

const Projects: React.FunctionComponent = () => {
  const navigate = useNavigate();
  
  // Mock data - replace with actual API call
  const projects: Project[] = [
    {
      id: 'demo-project',
      name: 'Demo Project',
      description: 'A sample project to demonstrate the connections UI',
    },
    {
      id: 'test-project',
      name: 'Test Project',
      description: 'Testing various features and functionality',
    },
  ];

  return (
    <PageSection isFilled id="projects-page">
      <Stack hasGutter>
        <StackItem>
          <Toolbar id="projects-toolbar">
            <ToolbarContent>
              <ToolbarItem>
                <Title headingLevel="h1" id="projects-title">
                  Projects
                </Title>
              </ToolbarItem>
              <ToolbarItem variant="separator" />
              <ToolbarItem>
                <Button variant="primary" id="create-project-button">
                  Create project
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
        </StackItem>
        <StackItem isFilled>
          <Gallery hasGutter minWidths={{ default: '300px' }} id="projects-gallery">
            {projects.map((project) => (
              <Card
                key={project.id}
                isClickable
                onClick={() => navigate(`/projects/${project.id}`)}
                id={`project-card-${project.id}`}
              >
                <CardTitle id={`project-card-title-${project.id}`}>
                  {project.name}
                </CardTitle>
                <CardBody id={`project-card-body-${project.id}`}>
                  {project.description}
                </CardBody>
              </Card>
            ))}
          </Gallery>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

export { Projects };
