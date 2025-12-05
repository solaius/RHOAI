import React, { useState } from 'react';
import {
  Button,
  ClipboardCopy,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  PageSection,
  Popover,
  Tab,
  Tabs,
  TabTitleText,
  Title
} from '@patternfly/react-core';
import {
  HelpIcon,
  InfoCircleIcon
} from '@patternfly/react-icons';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import RegistryBrainIcon from '@app/assets/registry-brain.png';
import { RegistryModelsTab } from './RegistryModelsTab';
import { RegistryPromptsTab } from './RegistryPromptsTab';

interface RegisteredModel {
  id: number;
  name: string;
  description?: string;
  labels: string[];
  lastModified: string;
  owner: string;
}

// Mock data for registered models
const mockModels: RegisteredModel[] = [
  {
    id: 106,
    name: 'granite-8b-code-base-1.4.0',
    description: 'Granite-8B-Code-Base is a decoder-only code model designed for code generative tasks (e.g., code generation, code explanation, code fixing, etc.). It is trained from scratch with a two-phase training strategy. In phase 1, our model is trained on 4 trillion tokens sourced from 116 programming languages, guaranteeing a comprehensive understanding of programming languages and syntax. In phase 2, our model is trained on 500 billion tokens with a carefully designed mixture of high-quality data from code and natural language domains to improve the models\' ability to reason and follow instructions.',
    labels: [],
    lastModified: '2025-09-29T17:00:52.169Z',
    owner: 'stmccart@redhat.com'
  },
  {
    id: 108,
    name: 'granite-7b-redhat-lab-1.4.0',
    description: 'LAB: Large-scale Alignment for chatBots is a novel synthetic data-based alignment tuning method for LLMs from IBM Research. Granite-7b-lab is a Granite-7b-base derivative model trained with the LAB methodology, using Mixtral-8x7b-Instruct as a teacher model.',
    labels: ['text-generation'],
    lastModified: '2025-09-29T13:41:49.170Z',
    owner: 'stmccart@redhat.com'
  },
  {
    id: 140,
    name: 'Mistral-7B-Instruct-v0.3-quantized.w4a16-1.5.0',
    description: 'Similarly to Mistral-7B-Instruct-v0.3, this models is intended for assistant-like chat. Quantized version of Mistral-7B-Instruct-v0.3. It achieves an average score of 65.08 on the OpenLLM benchmark (version 1), whereas the unquantized model achieves 66.42.',
    labels: ['inference', 'text-generation'],
    lastModified: '2025-09-12T14:34:33.040Z',
    owner: 'cbucur@redhat.com'
  },
  {
    id: 128,
    name: 'yolo-finetuned-drones',
    description: '',
    labels: [],
    lastModified: '2025-09-08T16:17:24.304Z',
    owner: 'mcaimi@redhat.com'
  },
  {
    id: 110,
    name: 'mmortari-demo20250903-modelSourceFromDSP-model',
    description: '',
    labels: [],
    lastModified: '2025-09-05T08:47:43.418Z',
    owner: 'pipeline-author'
  },
  {
    id: 100,
    name: 'granite-7b-starter-1.4.0',
    description: 'A custom Red Hat base model instruct tuned only for phase 00, produced by IBM Research specifically for RHEL AI.',
    labels: ['text-generation'],
    lastModified: '2025-08-25T15:34:54.785Z',
    owner: 'stmccart@redhat.com'
  },
  {
    id: 102,
    name: 'mixtral-8x7b-instruct-v0-1-1.4',
    description: '',
    labels: ['featured'],
    lastModified: '2025-08-25T15:05:32.967Z',
    owner: 'stmccart@redhat.com'
  },
  {
    id: 96,
    name: 'falcon-rw-1b-instruct',
    description: 'Falcon-RW-1B model from Hugging Face',
    labels: [],
    lastModified: '2025-07-30T13:05:57.547Z',
    owner: 'juhale@redhat.com'
  }
];

const ModelRegistry: React.FunctionComponent = () => {
  useDocumentTitle('Model Registry');

  // State management
  const [registryDropdownOpen, setRegistryDropdownOpen] = useState(false);
  const [isRegistryDetailsPopoverOpen, setIsRegistryDetailsPopoverOpen] = useState(false);
  const [isNeedRegistryPopoverOpen, setIsNeedRegistryPopoverOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  return (
    <PageSection>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <Title headingLevel="h1" size="2xl" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ background: '#ece6ff', borderRadius: '20px', padding: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={RegistryBrainIcon} 
                alt="Model registry brain icon" 
                style={{ width: '1.25em', height: '1.25em' }}
              />
            </div>
            Registry
          </Title>
          <p style={{ color: '#6A6E73', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Select a model registry to view and manage your registered models. Model registries provide a structured and organized way to store, share, version, deploy, and track models.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Tabs
            activeKey={activeTabKey}
            onSelect={(_event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => setActiveTabKey(tabIndex)}
            aria-label="Registry tabs"
            role="region"
            id="registry-tabs"
          >
            <Tab
              eventKey={0}
              title={<TabTitleText>Models</TabTitleText>}
              aria-label="Models tab"
            />
            <Tab
              eventKey={1}
              title={<TabTitleText>Prompts</TabTitleText>}
              aria-label="Prompts tab"
            />
          </Tabs>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <div className="pf-v6-l-stack pf-m-gutter">
            <div className="pf-v6-l-stack__item">
              <div className="pf-v6-l-flex pf-m-space-items-sm pf-m-align-items-center">
                <div>
                  <div className="pf-v6-l-bullseye">Model registry</div>
                </div>
                <div>
                  <Dropdown
                    isOpen={registryDropdownOpen}
                    onOpenChange={(isOpen) => setRegistryDropdownOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setRegistryDropdownOpen(!registryDropdownOpen)}
                        aria-label="Options menu"
                        isDisabled
                        isExpanded={registryDropdownOpen}
                        data-testid="model-registry-selector-dropdown"
                        id="model-registry-selector-toggle"
                        style={{ 
                          background: '#f0f0f0',
                          border: '1px solid #d2d2d2',
                          opacity: 0.5,
                          cursor: 'not-allowed'
                        }}
                      >
                        registry
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="registry">registry</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </div>
                <div style={{ display: 'contents' }}>
                  <Popover
                    isVisible={isRegistryDetailsPopoverOpen}
                    shouldClose={() => setIsRegistryDetailsPopoverOpen(false)}
                    headerContent={<div>Registry details</div>}
                    bodyContent={
                      <div style={{ width: '350px', maxWidth: '350px', padding: '0' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Description</strong>
                          <div style={{ marginTop: '0.5rem' }}>Model Registry</div>
                        </div>
                        <div>
                          <strong>Server URL</strong>
                          <div style={{ 
                            marginTop: '0.5rem', 
                            overflow: 'hidden',
                            width: '100%',
                            maxWidth: '100%'
                          }}>
                            <ClipboardCopy
                              hoverTip="Copy"
                              clickTip="Copied"
                              isReadOnly
                              style={{ 
                                width: 'calc(100% - 40px)', 
                                maxWidth: 'calc(100% - 40px)',
                                boxSizing: 'border-box'
                              }}
                            >
                              https://registry-rest.apps.prod.rhoai.rh-aiservices-bu.com:443
                            </ClipboardCopy>
                          </div>
                        </div>
                      </div>
                    }
                    position="right"
                    enableFlip
                  >
                    <Button 
                      variant="link" 
                      icon={<InfoCircleIcon />}
                      iconPosition="start"
                      data-testid="view-details-button"
                      onClick={() => setIsRegistryDetailsPopoverOpen(!isRegistryDetailsPopoverOpen)}
                    >
                      View details
                    </Button>
                  </Popover>
                </div>
                <div className="pf-m-align-right">
                  <div style={{ display: 'contents' }}>
                    <Popover
                      isVisible={isNeedRegistryPopoverOpen}
                      shouldClose={() => setIsNeedRegistryPopoverOpen(false)}
                      headerContent={<div>Need another registry?</div>}
                      bodyContent={
                        <div style={{ width: '300px', maxWidth: '300px' }}>
                          <p style={{ marginBottom: '1rem' }}>
                            To request access to a new or existing model registry, contact your administrator.
                          </p>
                          <div>
                            <strong>Your administrator might be:</strong>
                            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                              <li style={{ marginBottom: '0.5rem' }}>
                                The person who gave you your username, or who helped you to log in for the first time
                              </li>
                              <li style={{ marginBottom: '0.5rem' }}>
                                Someone in your IT department or help desk
                              </li>
                              <li>
                                A project manager or developer
                              </li>
                            </ul>
                          </div>
                        </div>
                      }
                      position="left"
                      enableFlip
                    >
                      <Button 
                        variant="link" 
                        icon={<HelpIcon />}
                        iconPosition="start"
                        data-testid="model-registry-help-button"
                        onClick={() => setIsNeedRegistryPopoverOpen(!isNeedRegistryPopoverOpen)}
                      >
                        Need another registry?
                      </Button>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTabKey === 0 && <RegistryModelsTab />}
      {activeTabKey === 1 && <RegistryPromptsTab />}
    </PageSection>
  );
};

export { ModelRegistry };
