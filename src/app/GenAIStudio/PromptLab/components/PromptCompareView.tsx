import * as React from 'react';
import {
  Button,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Title,
} from '@patternfly/react-core';
import { PromptVersion } from '../types';

interface PromptCompareViewProps {
  version1: PromptVersion;
  version2: PromptVersion;
}

interface DiffSegment {
  type: 'addition' | 'deletion' | 'unchanged';
  text: string;
}

// Simple diff algorithm for comparing two texts
const generateDiff = (text1: string, text2: string): { left: DiffSegment[]; right: DiffSegment[] } => {
  const words1 = text1.split(/(\s+)/);
  const words2 = text2.split(/(\s+)/);
  
  const leftDiff: DiffSegment[] = [];
  const rightDiff: DiffSegment[] = [];
  
  let i = 0;
  let j = 0;
  
  while (i < words1.length || j < words2.length) {
    if (i >= words1.length) {
      // Only words2 left, these are additions
      rightDiff.push({ type: 'addition', text: words2[j] });
      leftDiff.push({ type: 'unchanged', text: '' });
      j++;
    } else if (j >= words2.length) {
      // Only words1 left, these are deletions
      leftDiff.push({ type: 'deletion', text: words1[i] });
      rightDiff.push({ type: 'unchanged', text: '' });
      i++;
    } else if (words1[i] === words2[j]) {
      // Words match
      leftDiff.push({ type: 'unchanged', text: words1[i] });
      rightDiff.push({ type: 'unchanged', text: words2[j] });
      i++;
      j++;
    } else {
      // Words don't match - simple approach: mark as different
      leftDiff.push({ type: 'deletion', text: words1[i] });
      rightDiff.push({ type: 'addition', text: words2[j] });
      i++;
      j++;
    }
  }
  
  return { left: leftDiff, right: rightDiff };
};

const DiffText: React.FC<{ segments: DiffSegment[] }> = ({ segments }) => {
  return (
    <div style={{ 
      fontFamily: 'var(--pf-v5-global--FontFamily--monospace)',
      fontSize: 'var(--pf-v5-global--FontSize--sm)',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      padding: 'var(--pf-v5-global--spacer--md)',
      backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
      border: '1px solid var(--pf-v5-global--BorderColor--100)',
      borderRadius: 'var(--pf-v5-global--BorderRadius--sm)',
      minHeight: '300px',
    }}>
      {segments.map((segment, index) => {
        let backgroundColor = 'transparent';
        let color = 'inherit';
        
        if (segment.type === 'addition') {
          backgroundColor = 'var(--pf-v5-global--success-color--100)';
          color = 'var(--pf-v5-global--Color--light-100)';
        } else if (segment.type === 'deletion') {
          backgroundColor = 'var(--pf-v5-global--danger-color--100)';
          color: 'var(--pf-v5-global--Color--light-100)';
        }
        
        return (
          <span
            key={index}
            style={{
              backgroundColor,
              color,
              padding: segment.type !== 'unchanged' ? '2px 0' : '0',
            }}
          >
            {segment.text}
          </span>
        );
      })}
    </div>
  );
};

export const PromptCompareView: React.FunctionComponent<PromptCompareViewProps> = ({
  version1,
  version2,
}) => {
  const diff = React.useMemo(() => {
    return generateDiff(version1.promptText, version2.promptText);
  }, [version1.promptText, version2.promptText]);

  const formatDate = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div id="prompt-compare-view">
      <Title headingLevel="h2" size="lg" style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
        Comparing version {version1.versionNumber} with version {version2.versionNumber}
      </Title>

      <Grid hasGutter>
        <GridItem span={6}>
          <div id="compare-version-1">
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Title headingLevel="h3" size="md">
                  Version {version1.versionNumber} (baseline)
                </Title>
              </FlexItem>
              
              <FlexItem>
                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                  <strong>Registered at:</strong> {formatDate(version1.registeredAt)}
                </div>
              </FlexItem>
              
              <FlexItem>
                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                  <strong>Aliases:</strong>{' '}
                  {version1.aliases.length > 0 ? (
                    version1.aliases.join(', ')
                  ) : (
                    <>
                      —{' '}
                      <Button variant="link" isInline style={{ fontSize: 'inherit', padding: 0 }} id="add-alias-v1">
                        Add
                      </Button>
                    </>
                  )}
                </div>
              </FlexItem>
              
              <FlexItem>
                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                  <strong>Metadata:</strong>{' '}
                  {Object.keys(version1.metadata).length > 0 ? (
                    JSON.stringify(version1.metadata)
                  ) : (
                    <>
                      —{' '}
                      <Button variant="link" isInline style={{ fontSize: 'inherit', padding: 0 }} id="add-metadata-v1">
                        Add
                      </Button>
                    </>
                  )}
                </div>
              </FlexItem>
            </Flex>
          </div>
        </GridItem>

        <GridItem span={6}>
          <div id="compare-version-2">
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Title headingLevel="h3" size="md">
                  Version {version2.versionNumber}
                </Title>
              </FlexItem>
              
              <FlexItem>
                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                  <strong>Registered at:</strong> {formatDate(version2.registeredAt)}
                </div>
              </FlexItem>
              
              <FlexItem>
                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                  <strong>Aliases:</strong>{' '}
                  {version2.aliases.length > 0 ? (
                    version2.aliases.join(', ')
                  ) : (
                    <>
                      —{' '}
                      <Button variant="link" isInline style={{ fontSize: 'inherit', padding: 0 }} id="add-alias-v2">
                        Add
                      </Button>
                    </>
                  )}
                </div>
              </FlexItem>
              
              <FlexItem>
                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                  <strong>Metadata:</strong>{' '}
                  {Object.keys(version2.metadata).length > 0 ? (
                    JSON.stringify(version2.metadata)
                  ) : (
                    <>
                      —{' '}
                      <Button variant="link" isInline style={{ fontSize: 'inherit', padding: 0 }} id="add-metadata-v2">
                        Add
                      </Button>
                    </>
                  )}
                </div>
              </FlexItem>
            </Flex>
          </div>
        </GridItem>
      </Grid>

      <div style={{ marginTop: 'var(--pf-v5-global--spacer--lg)' }}>
        <Grid hasGutter>
          <GridItem span={6}>
            <DiffText segments={diff.left} />
          </GridItem>
          <GridItem span={6}>
            <DiffText segments={diff.right} />
          </GridItem>
        </Grid>
      </div>
    </div>
  );
};

