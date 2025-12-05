import * as React from 'react';
import {
  PageSection,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

const AutoRAG: React.FunctionComponent = () => (
  <PageSection>
    <Content component={ContentVariants.h1}>AutoRAG</Content>
    <Content component={ContentVariants.p}>
      Automatically configure and optimize your Retrieval-Augmented Generation workflows.
    </Content>
  </PageSection>
);

export { AutoRAG };

