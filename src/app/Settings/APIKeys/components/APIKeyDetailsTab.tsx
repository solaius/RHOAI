import * as React from 'react';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  PageSection,
  Content,
  ContentVariants,
  Divider,
  CodeBlock,
  CodeBlockCode,
  Label,
} from '@patternfly/react-core';
import { APIKey, APIKeyStatus } from '../types';

interface APIKeyDetailsTabProps {
  apiKey: APIKey;
}

const APIKeyDetailsTab: React.FunctionComponent<APIKeyDetailsTabProps> = ({ apiKey }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLastUsedDate = (date?: Date): string => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    
    return formatDate(date);
  };

  const getStatusLabel = (status: APIKeyStatus) => {
    const statusMap = {
      Active: { color: 'green' as const, label: 'Active' },
      Expired: { color: 'red' as const, label: 'Expired' },
      Disabled: { color: 'grey' as const, label: 'Disabled' },
      Inactive: { color: 'orange' as const, label: 'Inactive' },
    };
    const { color, label } = statusMap[status];
    return <Label id={`status-${status.toLowerCase()}`} color={color}>{label}</Label>;
  };

  return (
    <PageSection>
      <Content component={ContentVariants.h2} id="api-key-details-heading" style={{ marginTop: '1rem' }}>
        Details
      </Content>
      <DescriptionList columnModifier={{ default: '2Col' }}>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{apiKey.name}</DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDescription>
            {getStatusLabel(apiKey.status)}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Owner</DescriptionListTerm>
          <DescriptionListDescription>
            {apiKey.owner.name}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Date created</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(apiKey.dateCreated)}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Expiration date</DescriptionListTerm>
          <DescriptionListDescription>
            {apiKey.limits?.expirationDate ? formatDate(apiKey.limits.expirationDate) : 'Never'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Last invoked</DescriptionListTerm>
          <DescriptionListDescription>
            {formatLastUsedDate(apiKey.dateLastUsed)}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>

      <Divider style={{ marginTop: '2rem', marginBottom: '2rem' }} />

      <Content component={ContentVariants.h2} id="usage-example-heading">
        Usage example
      </Content>
      <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '1rem' }}>
        Use this API key to authenticate requests to the chat completions endpoint:
      </div>
      <CodeBlock id="usage-example-code">
        <CodeBlockCode>
{`curl -X POST https://api.example.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <key-value-here>" \\
  -d '{
    "model": "gpt-oss-20b",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 150
  }'`}
        </CodeBlockCode>
      </CodeBlock>
    </PageSection>
  );
};

export { APIKeyDetailsTab };
