import * as React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import { HomeIcon } from '@patternfly/react-icons';
import ProjectsSection from './projects/ProjectsSection';
import { useResourcesSection } from './resources/useResourcesSection';
import HomeHint from './HomeHint';

const Home: React.FunctionComponent = () => {
  const resourcesSection = useResourcesSection();
  const [showWelcomeHint, setShowWelcomeHint] = React.useState(true);

  // Simple check - in a real app this would check for actual projects
  const hasContent = true; // Always show content in this simplified version

  return (
    <div data-testid="home-page">
      {showWelcomeHint && (
        <HomeHint
          title="Welcome to RHOAI 3.4"
          body={
            <div>
              <p>Get started by creating your first project or exploring the available resources.</p>
              <p>
                Projects are workspaces where you can create and manage your AI/ML workloads,
                including notebooks, models, and pipelines.
              </p>
            </div>
          }
          isDisplayed={true}
          homeHintKey="welcome"
        />
      )}

      {!hasContent ? (
        <PageSection
          hasBodyWrapper={false}
          data-testid="home-page-empty"
          variant={PageSectionVariants.default}
        >
          <Bullseye>
            <EmptyState headingLevel="h4" icon={HomeIcon} titleText="Welcome to RHOAI 3.4">
              <EmptyStateBody>
                Get started by creating your first project or exploring available resources.
              </EmptyStateBody>
            </EmptyState>
          </Bullseye>
        </PageSection>
      ) : (
        <>
          <ProjectsSection />
          {resourcesSection}
        </>
      )}
    </div>
  );
};

export { Home };
