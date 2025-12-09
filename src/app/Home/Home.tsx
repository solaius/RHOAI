import * as React from 'react';
import HomeCapabilitiesSimple from './variations/HomeCapabilitiesSimple';
import ProjectsSection from './projects/ProjectsSection';
import { useResourcesSection } from './resources/useResourcesSection';

const Home: React.FunctionComponent = () => {
  const resourcesSection = useResourcesSection();

  return (
    <div data-testid="home-page">
      <HomeCapabilitiesSimple />
      <ProjectsSection />
      {resourcesSection}
    </div>
  );
};

export { Home };
