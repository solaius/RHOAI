import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
} from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: {
    name: string;
    displayName: string;
    description: string;
    owner: string;
    created: Date;
  };
}

const ProjectCard: React.FunctionComponent<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <Card
      data-testid={`project-card-${project.name}`}
      style={{ borderLeft: '3px solid var(--pf-v5-global--primary-color--100)', height: '100%' }}
    >
      <CardHeader>
        <Button
          data-testid={`project-link-${project.name}`}
          variant="link"
          isInline
          onClick={() => navigate(`/projects/${project.name}`)}
          style={{ fontSize: 'var(--pf-v5-global--FontSize--md)', padding: 0 }}
        >
          {project.displayName}
        </Button>
        <Label color="blue" style={{ marginLeft: '8px' }}>
          AI
        </Label>
      </CardHeader>
      <CardBody>
        <Content component="small">{project.description || 'No description'}</Content>
      </CardBody>
      <CardFooter>
        <DescriptionList isCompact>
          <DescriptionListGroup>
            <DescriptionListTerm>Created</DescriptionListTerm>
            <DescriptionListDescription>
              {project.created.toLocaleDateString()}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Owner</DescriptionListTerm>
            <DescriptionListDescription>{project.owner}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;

