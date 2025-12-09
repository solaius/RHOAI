import * as React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Content,
  Button,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';

interface CreateProjectCardProps {
  allowCreate: boolean;
  onCreateProject: () => void;
}

const CreateProjectCard: React.FunctionComponent<CreateProjectCardProps> = ({
  allowCreate,
  onCreateProject,
}) => {
  if (!allowCreate) {
    return null;
  }

  return (
    <Card
      style={{
        borderLeft: '3px solid var(--pf-v5-global--BorderColor--100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
      data-testid="create-project-card"
    >
      <CardBody>
        <Flex
          direction={{ default: 'column' }}
          alignItems={{ default: 'alignItemsCenter' }}
          gap={{ default: 'gapMd' }}
        >
          <FlexItem>
            <PlusCircleIcon
              style={{ fontSize: '48px', color: 'var(--pf-v5-global--primary-color--100)' }}
            />
          </FlexItem>
          <FlexItem>
            <Content component="h3">Create project</Content>
          </FlexItem>
          <FlexItem>
            <Content component="small" style={{ textAlign: 'center' }}>
              Create a new project to organize your AI/ML workloads
            </Content>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={onCreateProject} data-testid="create-project-button">
              Create project
            </Button>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default CreateProjectCard;

