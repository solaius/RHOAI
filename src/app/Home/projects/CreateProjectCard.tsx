import * as React from 'react';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { OutlinedFolderIcon } from '@patternfly/react-icons';

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
    <Card isFullHeight isFlat data-testid="create-project-card">
      <CardBody>
        <Bullseye>
          <EmptyState variant="xs" icon={OutlinedFolderIcon}>
            <EmptyStateBody>
              Create a new project to organize your AI/ML workloads
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" size="lg" onClick={onCreateProject} data-testid="create-project-button">
                  Create project
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        </Bullseye>
      </CardBody>
    </Card>
  );
};

export default CreateProjectCard;

