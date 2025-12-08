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
import { CubesIcon } from '@patternfly/react-icons';

interface EmptyProjectsCardProps {
  allowCreate: boolean;
  onCreateProject: () => void;
}

const EmptyProjectsCard: React.FunctionComponent<EmptyProjectsCardProps> = ({
  allowCreate,
  onCreateProject,
}) => {
  return (
    <Card style={{ borderRadius: '16px' }}>
      <CardBody>
        <EmptyState headingLevel="h2" icon={CubesIcon} titleText="No projects">
          <EmptyStateBody>
            Projects are workspaces where you can create and manage your AI/ML workloads. Get
            started by creating your first project.
          </EmptyStateBody>
          {allowCreate && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="primary" onClick={onCreateProject}>
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

