import * as React from 'react';
import {
  PageSection,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Breadcrumb,
  BreadcrumbItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectConnections } from './connections';

export const ProjectDetail: React.FunctionComponent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  // Mock project data - replace with actual API call
  const projectName = projectId ? `Project ${projectId}` : 'Project';

  const handleTabSelect = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <>
      <PageSection id="project-detail-header">
        <Stack hasGutter>
          <StackItem>
            <Breadcrumb id="project-breadcrumb">
              <BreadcrumbItem
                to="/projects"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/projects');
                }}
                id="projects-breadcrumb-item"
              >
                Projects
              </BreadcrumbItem>
              <BreadcrumbItem isActive id="project-name-breadcrumb-item">
                {projectName}
              </BreadcrumbItem>
            </Breadcrumb>
          </StackItem>
          <StackItem>
            <Title headingLevel="h1" size="2xl" id="project-detail-title">
              {projectName}
            </Title>
          </StackItem>
        </Stack>
      </PageSection>

      <PageSection type="tabs" isWidthLimited id="project-detail-tabs-section">
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabSelect}
          aria-label="Project detail tabs"
          role="region"
          id="project-detail-tabs"
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Overview</TabTitleText>}
            aria-label="Project overview"
            id="overview-tab"
          >
            <PageSection isFilled id="overview-tab-content">
              <Title headingLevel="h2" id="overview-title">
                Project Overview
              </Title>
              {/* Add overview content here */}
            </PageSection>
          </Tab>

          <Tab
            eventKey={1}
            title={<TabTitleText>Connections</TabTitleText>}
            aria-label="Project connections"
            id="connections-tab"
          >
            <ProjectConnections projectId={projectId} />
          </Tab>

          <Tab
            eventKey={2}
            title={<TabTitleText>Workbenches</TabTitleText>}
            aria-label="Project workbenches"
            id="workbenches-tab"
          >
            <PageSection isFilled id="workbenches-tab-content">
              <Title headingLevel="h2" id="workbenches-title">
                Workbenches
              </Title>
              {/* Add workbenches content here */}
            </PageSection>
          </Tab>

          <Tab
            eventKey={3}
            title={<TabTitleText>Pipelines</TabTitleText>}
            aria-label="Project pipelines"
            id="pipelines-tab"
          >
            <PageSection isFilled id="pipelines-tab-content">
              <Title headingLevel="h2" id="pipelines-title">
                Pipelines
              </Title>
              {/* Add pipelines content here */}
            </PageSection>
          </Tab>

          <Tab
            eventKey={4}
            title={<TabTitleText>Data</TabTitleText>}
            aria-label="Project data"
            id="data-tab"
          >
            <PageSection isFilled id="data-tab-content">
              <Title headingLevel="h2" id="data-title">
                Data
              </Title>
              {/* Add data content here */}
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

