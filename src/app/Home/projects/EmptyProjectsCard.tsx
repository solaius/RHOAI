import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  Content,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { OutlinedFolderIcon } from '@patternfly/react-icons';

interface EmptyProjectsCardProps {
  allowCreate: boolean;
  onCreateProject: () => void;
}

const EmptyProjectsCard: React.FunctionComponent<EmptyProjectsCardProps> = ({
  allowCreate,
  onCreateProject,
}) => {
  return (
    <Card isRounded>
      <CardBody>
        <EmptyState icon={OutlinedFolderIcon}>
          <EmptyStateBody>
            Projects are workspaces where you can create and manage your AI/ML workloads. Get
            started by creating your first project.
          </EmptyStateBody>
          {allowCreate && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={onCreateProject}>
                  Create project
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          )}
        </EmptyState>
      </CardBody>
    </Card>
  );
};

export default EmptyProjectsCard;

