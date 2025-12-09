import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Modal,
  ModalVariant,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  Title,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';

interface LoadPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPrompt: (prompt: string, isReadOnly: boolean) => void;
}

interface PromptRegistryItem {
  id: string;
  name: string;
  description: string;
  versions: string[];
  useCase: string;
  date: string;
}

interface SamplePrompt {
  id: string;
  name: string;
  content: string;
  useCase: string;
}

export const LoadPromptModal: React.FunctionComponent<LoadPromptModalProps> = ({
  isOpen,
  onClose,
  onLoadPrompt,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<'registry' | 'samples' | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptRegistryItem | null>(null);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [isVersionSelectOpen, setIsVersionSelectOpen] = useState(false);

  const promptRegistry: PromptRegistryItem[] = [
    {
      id: '1',
      name: 'HR benefits Q&A',
      description: 'This is your description',
      versions: ['v1.0', 'v1.1', 'v2.0'],
      useCase: 'Customer Service',
      date: 'Nov 11, 2025'
    },
    {
      id: '2',
      name: 'Customer service prompt',
      description: 'This is your description',
      versions: ['v1.0', 'v1.2'],
      useCase: 'Customer Service',
      date: 'Jan 12, 2026'
    },
  ];

  const samplePrompts: SamplePrompt[] = [
    {
      id: '1',
      name: 'Helpful Assistant',
      content: 'You are a helpful AI assistant. Provide clear, accurate, and concise responses to user questions.',
      useCase: 'General'
    },
    {
      id: '2',
      name: 'Code Expert',
      content: 'You are an expert software engineer. Help users with coding questions, debug issues, and suggest best practices.',
      useCase: 'Development'
    },
    {
      id: '3',
      name: 'Customer Service Pro',
      content: 'You are a customer service representative. Be empathetic, patient, and solution-focused when helping customers.',
      useCase: 'Customer Service'
    },
  ];

  const mockPromptContent: { [key: string]: string } = {
    '1-v1.0': 'You are an HR benefits assistant. Help employees understand their benefits.',
    '1-v1.1': 'You are an HR benefits assistant. Help employees understand their benefits. Always maintain confidentiality.',
    '1-v2.0': 'You are an HR benefits assistant with expertise in health insurance and retirement plans. Help employees understand their benefits. Always maintain confidentiality and refer complex cases to HR.',
    '2-v1.0': 'You are a customer service assistant. Be helpful and professional.',
    '2-v1.2': 'You are a customer service assistant. Be helpful, empathetic, and professional. Ask clarifying questions.',
  };

  const handleSelectType = (type: 'registry' | 'samples') => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedPrompt(null);
    setSelectedVersion('');
  };

  const handleSelectPromptFromRegistry = () => {
    if (selectedPrompt && selectedVersion) {
      const promptKey = `${selectedPrompt.id}-${selectedVersion}`;
      const content = mockPromptContent[promptKey] || `Prompt: ${selectedPrompt.name} - ${selectedVersion}`;
      onLoadPrompt(content, true);
      handleClose();
    }
  };

  const handleSelectSample = (sample: SamplePrompt) => {
    onLoadPrompt(sample.content, false);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedType(null);
    setSelectedPrompt(null);
    setSelectedVersion('');
    onClose();
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={handleClose}
      aria-labelledby="load-prompt-modal-title"
    >
      {step === 1 ? (
        <div style={{ padding: '2rem' }}>
          <Title headingLevel="h2" size="xl" style={{ marginBottom: '0.5rem' }}>
            Load prompt
          </Title>
          <p style={{ 
            marginBottom: '2rem',
            color: 'var(--pf-v6-global--Color--200)',
            fontSize: '0.875rem'
          }}>
            Choose where to load your prompt from
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Card
              isClickable
              isSelectable
              isSelected={selectedType === 'registry'}
              onClick={() => handleSelectType('registry')}
              style={{ flex: 1, minHeight: '150px' }}
            >
              <CardBody>
                <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                    <Title headingLevel="h3" size="lg">
                      Prompt registry
                    </Title>
                  </FlexItem>
                  <FlexItem>
                    <p style={{ 
                      margin: 0,
                      fontSize: '0.875rem',
                      color: 'var(--pf-v6-global--Color--200)'
                    }}>
                      Load a versioned prompt from your organization's registry
                    </p>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>

            <Card
              isClickable
              isSelectable
              isSelected={selectedType === 'samples'}
              onClick={() => handleSelectType('samples')}
              style={{ flex: 1, minHeight: '150px' }}
            >
              <CardBody>
                <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                    <Title headingLevel="h3" size="lg">
                      Sample prompts
                    </Title>
                  </FlexItem>
                  <FlexItem>
                    <p style={{ 
                      margin: 0,
                      fontSize: '0.875rem',
                      color: 'var(--pf-v6-global--Color--200)'
                    }}>
                      Choose from pre-built prompt templates by use case
                    </p>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : selectedType === 'registry' ? (
        <div style={{ padding: '1.5rem' }}>
          <Title headingLevel="h2" size="xl" style={{ marginBottom: '0.5rem' }}>
            Prompt registry
          </Title>
          <p style={{ 
            marginBottom: '1.5rem',
            color: 'var(--pf-v6-global--Color--200)',
            fontSize: '0.875rem'
          }}>
            Select a prompt and version from your registry
          </p>

          <Table 
            variant="compact" 
            aria-label="Prompt registry" 
            id="prompt-registry-table"
            style={{ marginBottom: '2rem' }}
          >
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Use Case</Th>
                <Th>Last Updated</Th>
                <Th>Version</Th>
              </Tr>
            </Thead>
            <Tbody>
              {promptRegistry.map((prompt) => (
                <Tr
                  key={prompt.id}
                  isClickable
                  isRowSelected={selectedPrompt?.id === prompt.id}
                  onRowClick={() => {
                    setSelectedPrompt(prompt);
                    setSelectedVersion(prompt.versions[prompt.versions.length - 1]);
                  }}
                >
                  <Td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{prompt.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                        {prompt.description}
                      </div>
                    </div>
                  </Td>
                  <Td>{prompt.useCase}</Td>
                  <Td>{prompt.date}</Td>
                  <Td>
                    {selectedPrompt?.id === prompt.id ? (
                      <Select
                        id={`version-select-${prompt.id}`}
                        isOpen={isVersionSelectOpen}
                        selected={selectedVersion}
                        onSelect={(_event, value) => {
                          setSelectedVersion(value as string);
                          setIsVersionSelectOpen(false);
                        }}
                        onOpenChange={(isOpen) => setIsVersionSelectOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsVersionSelectOpen(!isVersionSelectOpen);
                            }}
                            isExpanded={isVersionSelectOpen}
                            style={{ minWidth: '100px' }}
                          >
                            {selectedVersion}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          {prompt.versions.map((version) => (
                            <SelectOption key={version} value={version}>
                              {version}
                            </SelectOption>
                          ))}
                        </SelectList>
                      </Select>
                    ) : (
                      <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                        {prompt.versions[prompt.versions.length - 1]}
                      </span>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} gap={{ default: 'gapSm' }}>
            <Button variant="link" onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSelectPromptFromRegistry}
              isDisabled={!selectedPrompt || !selectedVersion}
            >
              Select
            </Button>
          </Flex>
        </div>
      ) : (
        <div style={{ padding: '1.5rem' }}>
          <Title headingLevel="h2" size="xl" style={{ marginBottom: '0.5rem' }}>
            Sample prompts
          </Title>
          <p style={{ 
            marginBottom: '1.5rem',
            color: 'var(--pf-v6-global--Color--200)',
            fontSize: '0.875rem'
          }}>
            Choose a pre-built prompt template
          </p>

          {['General', 'Development', 'Customer Service'].map((category) => {
            const categoryPrompts = samplePrompts.filter((p) => p.useCase === category);
            if (categoryPrompts.length === 0) return null;
            
            return (
              <div key={category} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--pf-v6-global--Color--200)'
                }}>
                  {category}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {categoryPrompts.map((sample) => (
                    <Card
                      key={sample.id}
                      isCompact
                      isClickable
                      onClick={() => handleSelectSample(sample)}
                      style={{
                        border: '1px solid var(--pf-v6-global--BorderColor--100)'
                      }}
                    >
                      <CardBody>
                        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <strong style={{ fontSize: '0.875rem' }}>{sample.name}</strong>
                          </FlexItem>
                          <FlexItem>
                            <p style={{ 
                              fontSize: '0.875rem', 
                              margin: 0,
                              color: 'var(--pf-v6-global--Color--200)',
                              lineHeight: '1.4'
                            }}>
                              {sample.content}
                            </p>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} gap={{ default: 'gapSm' }} style={{ marginTop: '2rem' }}>
            <Button variant="link" onClick={handleBack}>
              Back
            </Button>
          </Flex>
        </div>
      )}
    </Modal>
  );
};
