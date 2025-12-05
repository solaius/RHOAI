import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const Connections: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>Connections</Content>
    <Content component={ContentVariants.p}>
      Manage your connections to external data sources and services.
    </Content>
  </PageSection>
);

export { Connections };

