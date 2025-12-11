import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  FormGroup,
  InputGroup,
  InputGroupItem,
  Label,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  Popover,
  Select,
  SelectList,
  SelectOption,
  Slider,
  Switch,
  TextArea,
  TextInput,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import {
  AngleRightIcon,
  CodeIcon,
  CogIcon,
  DownloadIcon,
  EllipsisVIcon,
  FolderIcon,
  HistoryIcon,
  InfoCircleIcon,
  LightbulbIcon,
  LockIcon,
  OutlinedFolderIcon,
  OutlinedQuestionCircleIcon,
  PlusCircleIcon,
  PlusIcon,
  RedoIcon,
  SaveIcon,
  TrashIcon,
} from '@patternfly/react-icons';
import Chatbot, {
  ChatbotDisplayMode,
} from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';
import { AddVectorStoreModal } from './components/AddVectorStoreModal';
import { LoadPromptModal } from './components/LoadPromptModal';
import PageIcon from '@app/assets/PageIcon.svg';
import ChatbotIcon from '@app/assets/chatbotIcon.svg';
import PlaceholderImage from '@app/assets/placeholderImage.svg';
import AIIcon from '@app/assets/AI_Icon.svg';
import SlidersIcon from '@app/assets/pf-sliders.svg';

const Playground: React.FunctionComponent = () => {
  useDocumentTitle('Playground');
  const { flags, selectedProject, setSelectedProject } = useFeatureFlags();

  // State management
  const [isProjectSelectOpen, setIsProjectSelectOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSystemPromptReadOnly, setIsSystemPromptReadOnly] = useState(false);
  const [isRagEnabled, setIsRagEnabled] = useState(true);
  const [selectedModel, setSelectedModel] = useState('llama-3.1-8b-instruct');
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [isLoadPromptModalOpen, setIsLoadPromptModalOpen] = useState(false);
  
  // Build panel toggle state (using ToggleGroup instead of Tabs)
  const [selectedBuildTab, setSelectedBuildTab] = useState('model');
  
  // Navigation drawer states
  const [isSavedConfigsOpen, setIsSavedConfigsOpen] = useState(false);
  const [isSamplePromptsOpen, setIsSamplePromptsOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  
  // Knowledge tab dropdown state
  const [isVectorStoreDropdownOpen, setIsVectorStoreDropdownOpen] = useState(false);
  const [openVectorStoreActionId, setOpenVectorStoreActionId] = useState<string | null>(null);
  const [isAddVectorStoreModalOpen, setIsAddVectorStoreModalOpen] = useState(false);
  const [editingVectorStore, setEditingVectorStore] = useState<any>(null);
  
  // Header kebab menu state
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  
  // Model parameters state
  const [temperature, setTemperature] = useState(0.6);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(2700);
  const [repetition, setRepetition] = useState(1.0);
  const [isParametersPopoverOpen, setIsParametersPopoverOpen] = useState(false);
  
  // Vector stores and MCP servers state
  const [vectorStores, setVectorStores] = useState([
    { id: '1', name: 'HR benefits bot', type: 'In memory', selected: true },
    { id: '2', name: 'IT tech support documents', type: 'In memory', selected: false },
    { id: '3', name: 'Customer support agent', type: 'External connection', selected: false },
    { id: '4', name: 'Coding guidelines and docs', type: 'In memory', selected: false },
  ]);
  const [mcpServers] = useState([
    { id: '1', name: 'Github', enabled: true, toolsCount: 12, hasAuth: true },
    { id: '2', name: 'Kubernetes', enabled: true, toolsCount: 10, hasAuth: true },
    { id: '3', name: 'Slack', enabled: false, toolsCount: 0, hasAuth: false },
    { id: '4', name: 'Jira', enabled: false, toolsCount: 0, hasAuth: false },
    { id: '5', name: 'PostgreSQL', enabled: false, toolsCount: 0, hasAuth: false },
  ]);
  
  // Guardrails state - User input
  const [jailbreaksEnabled, setJailbreaksEnabled] = useState(true);
  const [contentModerationUserEnabled, setContentModerationUserEnabled] = useState(false);
  const [piiUserEnabled, setPiiUserEnabled] = useState(false);
  
  // Guardrails state - Model output
  const [contentModerationOutputEnabled, setContentModerationOutputEnabled] = useState(true);
  const [piiOutputEnabled, setPiiOutputEnabled] = useState(true);
  
  // Content moderation sub-options (for Model output)
  const [toxicityEnabled, setToxicityEnabled] = useState(true);
  const [sexualContentEnabled, setSexualContentEnabled] = useState(true);
  const [violenceEnabled, setViolenceEnabled] = useState(true);
  const [harassmentEnabled, setHarassmentEnabled] = useState(true);
  
  // Chat state
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  // Save configuration modal state
  const [isSaveConfigModalOpen, setIsSaveConfigModalOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const [configDescription, setConfigDescription] = useState('');

  // Calculate guardrails count
  const guardrailsCount = React.useMemo(() => {
    let count = 0;
    
    // User input guardrails
    if (jailbreaksEnabled) count++;
    if (contentModerationUserEnabled) count++;
    if (piiUserEnabled) count++;
    
    // Model output guardrails
    if (contentModerationOutputEnabled) {
      count++; // Count the main content moderation toggle
      // Count enabled sub-options
      if (toxicityEnabled) count++;
      if (sexualContentEnabled) count++;
      if (violenceEnabled) count++;
      if (harassmentEnabled) count++;
    }
    if (piiOutputEnabled) count++;
    
    return count;
  }, [
    jailbreaksEnabled, 
    contentModerationUserEnabled, 
    piiUserEnabled, 
    contentModerationOutputEnabled, 
    toxicityEnabled,
    sexualContentEnabled,
    violenceEnabled,
    harassmentEnabled,
    piiOutputEnabled
  ]);

  // Build Panel using DrawerPanelContent
  const BuildPanelContent = (
    <DrawerPanelContent isResizable minSize="400px" defaultSize="50%" id="build-panel-drawer">
      <DrawerContentBody style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{  
          borderBottom: '1px solid var(--pf-v6-global--BorderColor--100)',
          padding: '1rem 1rem 0 1rem'
        }}>
          <Title headingLevel="h2" size="lg">
            Build
          </Title>
        </div>

        <div style={{ padding: '1rem', borderBottom: '1px solid var(--pf-v6-global--BorderColor--100)' }}>
          <ToggleGroup aria-label="Build panel options">
            <ToggleGroupItem
              text="Model"
              buttonId="model"
              isSelected={selectedBuildTab === 'model'}
              onChange={() => setSelectedBuildTab('model')}
            />
            <ToggleGroupItem
              text="Prompt"
              buttonId="prompt-lab"
              isSelected={selectedBuildTab === 'prompt-lab'}
              onChange={() => setSelectedBuildTab('prompt-lab')}
            />
            <ToggleGroupItem
              text="Knowledge"
              buttonId="knowledge"
              isSelected={selectedBuildTab === 'knowledge'}
              onChange={() => setSelectedBuildTab('knowledge')}
            />
            <ToggleGroupItem
              text="MCP"
              buttonId="mcp"
              isSelected={selectedBuildTab === 'mcp'}
              onChange={() => setSelectedBuildTab('mcp')}
            />
            <ToggleGroupItem
              text={
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Guardrails
                  {guardrailsCount > 0 && (
                    <Badge isRead>
                      {guardrailsCount}
                    </Badge>
                  )}
                </span>
              }
              buttonId="guardrails"
              isSelected={selectedBuildTab === 'guardrails'}
              onChange={() => setSelectedBuildTab('guardrails')}
            />
          </ToggleGroup>
        </div>
        
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
          {selectedBuildTab === 'model' && (
            <>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                Model
              </Title>
              
              <FormGroup label="Select model" fieldId="model-select-form" isRequired>
                <Select
                  id="model-select"
                  isOpen={isModelSelectOpen}
                  selected={selectedModel}
                  onSelect={(_event, value) => {
                    setSelectedModel(value as string);
                    setIsModelSelectOpen(false);
                  }}
                  onOpenChange={(isOpen) => setIsModelSelectOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsModelSelectOpen(!isModelSelectOpen)}
                      isExpanded={isModelSelectOpen}
                      id="model-select-toggle"
                      style={{ width: '100%' }}
                    >
                      {selectedModel === 'llama-3.1-8b-instruct' ? 'Llama 3.1 8B-Instruct' :
                       selectedModel === 'mistral-7b-instruct' ? 'Mistral 7B-Instruct' :
                       selectedModel === 'granite-8b-code' ? 'Granite 8B Code' :
                       selectedModel === 'falcon-7b' ? 'Falcon 7B' :
                       selectedModel === 'bloom-7b1' ? 'BLOOM 7B1' : 'Select model'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="llama-3.1-8b-instruct">Llama 3.1 8B-Instruct</SelectOption>
                    <SelectOption value="mistral-7b-instruct">Mistral 7B-Instruct</SelectOption>
                    <SelectOption value="granite-8b-code">Granite 8B Code</SelectOption>
                    <SelectOption value="falcon-7b">Falcon 7B</SelectOption>
                    <SelectOption value="bloom-7b1">BLOOM 7B1</SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>

              <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                <FormGroup 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Temperature
                      <Tooltip content="Controls randomness in the output. Lower values make the output more focused and deterministic, while higher values increase creativity and diversity.">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </span>
                  }
                  fieldId="temperature"
                  style={{ marginTop: '1.5rem' }}
                >
                  <Slider
                    id="temperature"
                    value={temperature}
                    onChange={(_event, value) => setTemperature(value)}
                    min={0}
                    max={2}
                    step={0.1}
                    isInputVisible
                    inputValue={temperature}
                  />
                </FormGroup>

                <FormGroup 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Top P
                      <Tooltip content="Controls diversity via nucleus sampling. The model considers the smallest set of tokens whose cumulative probability exceeds the threshold. Lower values make output more focused.">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </span>
                  }
                  fieldId="top-p"
                  style={{ marginTop: '1rem' }}
                >
                  <Slider
                    id="top-p"
                    value={topP}
                    onChange={(_event, value) => setTopP(value)}
                    min={0}
                    max={1}
                    step={0.1}
                    isInputVisible
                    inputValue={topP}
                  />
                </FormGroup>

                <FormGroup 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Max token
                      <Tooltip content="The maximum number of tokens to generate in the response. One token is roughly 4 characters. Higher values allow for longer responses.">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </span>
                  }
                  fieldId="max-tokens"
                  style={{ marginTop: '1rem' }}
                >
                  <Slider
                    id="max-tokens"
                    value={maxTokens}
                    onChange={(_event, value) => setMaxTokens(value)}
                    min={1}
                    max={4096}
                    step={1}
                    isInputVisible
                    inputValue={maxTokens}
                  />
                </FormGroup>

                <FormGroup 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Repetition
                      <Tooltip content="Penalty for repeating tokens. Higher values discourage the model from repeating the same words or phrases. Values greater than 1.0 penalize repetition.">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </span>
                  }
                  fieldId="repetition"
                  style={{ marginTop: '1rem' }}
                >
                  <Slider
                    id="repetition"
                    value={repetition}
                    onChange={(_event, value) => setRepetition(value)}
                    min={0}
                    max={2}
                    step={0.1}
                    isInputVisible
                    inputValue={repetition}
                  />
                </FormGroup>
              </div>
            </>
          )}
          
          {selectedBuildTab === 'prompt-lab' && (
            <>
              <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginBottom: '0.5rem' }}>
                <FlexItem>
                  <Title headingLevel="h3" size="md">
                    System instructions
                  </Title>
                </FlexItem>
                <FlexItem>
                  <Button 
                    variant="link" 
                    icon={<PlusCircleIcon />} 
                    onClick={() => setIsLoadPromptModalOpen(true)}
                    id="load-prompt-button"
                  >
                    Load prompt
                  </Button>
                </FlexItem>
              </Flex>
              <FormGroup fieldId="system-instructions">
                <TextArea
                  id="system-instructions"
                  value={systemPrompt}
                  onChange={(_event, value) => setSystemPrompt(value)}
                  placeholder="This will display the default system prompt"
                  rows={15}
                  readOnly={isSystemPromptReadOnly}
                  style={{
                    backgroundColor: isSystemPromptReadOnly ? 'var(--pf-v6-global--BackgroundColor--200)' : 'white'
                  }}
                />
              </FormGroup>
              {isSystemPromptReadOnly && systemPrompt && (
                <Flex style={{ marginTop: '1rem' }} gap={{ default: 'gapSm' }}>
                  <FlexItem>
                    <Button
                      variant="link"
                      onClick={() => {
                        if (window.confirm('Editing will create a new version of this prompt. Do you want to continue?')) {
                          setIsSystemPromptReadOnly(false);
                        }
                      }}
                    >
                      Edit prompt
                    </Button>
                  </FlexItem>
                </Flex>
              )}
            </>
          )}
          
          {selectedBuildTab === 'knowledge' && (
            <div>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
                <FlexItem>
                  <Title headingLevel="h3" size="md">Knowledge</Title>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant="plain"
                    icon={<AngleRightIcon style={{ transform: isRagEnabled ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />}
                    onClick={() => setIsRagEnabled(!isRagEnabled)}
                    aria-label="Toggle knowledge section"
                  />
                  <Switch
                    id="knowledge-toggle-build"
                    isChecked={isRagEnabled}
                    onChange={(_event, checked) => setIsRagEnabled(checked)}
                    aria-label="Enable Knowledge"
                  />
                </FlexItem>
              </Flex>

              {isRagEnabled && (
                <>
                  <Dropdown
                    isOpen={isVectorStoreDropdownOpen}
                    onSelect={() => {}}
                    onOpenChange={(isOpen: boolean) => setIsVectorStoreDropdownOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsVectorStoreDropdownOpen(!isVectorStoreDropdownOpen)}
                        isExpanded={isVectorStoreDropdownOpen}
                        style={{ width: '100%', marginBottom: '1rem' }}
                        id="vector-store-dropdown"
                      >
                        Browse or add vector stores
                      </MenuToggle>
                    )}
                    id="vector-store-dropdown-menu"
                  >
                    <DropdownList>
                      <DropdownItem key="header" isDisabled>
                        <strong>Vector store</strong>
                      </DropdownItem>
                      {vectorStores.map((store) => (
                        <DropdownItem
                          key={store.id}
                        >
                          <Checkbox
                            id={`dropdown-vs-${store.id}`}
                            isChecked={store.selected}
                            label={store.name}
                            onChange={(_event, checked) => {
                              setVectorStores(stores =>
                                stores.map(s =>
                                  s.id === store.id ? { ...s, selected: checked } : s
                                )
                              );
                            }}
                          />
                        </DropdownItem>
                      ))}
                      <Divider component="li" />
                      <DropdownItem key="add-new">
                        <Button 
                          variant="link" 
                          icon={<PlusIcon />}
                          onClick={() => {
                            setIsVectorStoreDropdownOpen(false);
                            setIsAddVectorStoreModalOpen(true);
                          }}
                          style={{ padding: 0, fontWeight: 400 }}
                        >
                          Add new vector store
                        </Button>
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>

                  {/* Table of selected vector stores */}
                  {vectorStores.filter(s => s.selected).length > 0 && (
                    <Table variant="compact" aria-label="Selected vector stores" id="selected-vector-stores-table">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Type</Th>
                          <Th width={10}></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {vectorStores.filter(s => s.selected).map((store) => (
                          <Tr key={store.id}>
                            <Td>{store.name}</Td>
                            <Td>{store.type}</Td>
                            <Td>
                              <Dropdown
                                isOpen={openVectorStoreActionId === store.id}
                                onSelect={() => setOpenVectorStoreActionId(null)}
                                onOpenChange={(isOpen: boolean) => setOpenVectorStoreActionId(isOpen ? store.id : null)}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    variant="plain"
                                    onClick={() => setOpenVectorStoreActionId(openVectorStoreActionId === store.id ? null : store.id)}
                                    isExpanded={openVectorStoreActionId === store.id}
                                    id={`vs-actions-${store.id}`}
                                  >
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  <DropdownItem key="edit" onClick={() => {
                                    setEditingVectorStore(store);
                                    setIsAddVectorStoreModalOpen(true);
                                  }}>
                                    Edit vector store
                                  </DropdownItem>
                                  <DropdownItem key="remove" onClick={() => {
                                    setVectorStores(stores =>
                                      stores.map(s =>
                                        s.id === store.id ? { ...s, selected: false } : s
                                      )
                                    );
                                  }}>
                                    Remove
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </>
              )}
            </div>
          )}
          
          {selectedBuildTab === 'mcp' && (
            <div>
              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '1rem' }}>
                <FlexItem>
                  <Title headingLevel="h3" size="md">MCP Servers</Title>
                </FlexItem>
                <FlexItem>
                  <Label variant="outline" color="blue">2 enabled</Label>
                </FlexItem>
              </Flex>
              
              <Table variant="compact" aria-label="MCP Servers" id="mcp-servers-table">
                <Thead>
                  <Tr>
                    <Th width={10}></Th>
                    <Th>Name</Th>
                    <Th>Tools</Th>
                    <Th width={10}>Authorization</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mcpServers.map((server) => (
                    <Tr key={server.id}>
                      <Td>
                        <Checkbox id={`mcp-${server.id}`} isChecked={server.enabled} aria-label={`Enable ${server.name}`} />
                      </Td>
                      <Td>{server.name}</Td>
                      <Td>{server.toolsCount} enabled</Td>
                      <Td>
                        <Button variant="plain" icon={<LockIcon />} isDisabled={!server.enabled} aria-label="Authorization" />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          )}
          
          {selectedBuildTab === 'guardrails' && (
            <>
              {/* Guardrails Header */}
              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '1rem' }}>
                <FlexItem>
                  <Title headingLevel="h3" size="md">Guardrails</Title>
                </FlexItem>
                <FlexItem>
                  <Badge isRead>{guardrailsCount}</Badge>
                </FlexItem>
              </Flex>

              {/* Model Dropdown */}
              <FormGroup label="Model" fieldId="guardrails-model-select" style={{ marginBottom: '1.5rem' }}>
                <Select
                  id="guardrails-model-select"
                  isOpen={isModelSelectOpen}
                  selected={selectedModel}
                  onSelect={(_event, value) => {
                    setSelectedModel(value as string);
                    setIsModelSelectOpen(false);
                  }}
                  onOpenChange={(isOpen) => setIsModelSelectOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsModelSelectOpen(!isModelSelectOpen)}
                      isExpanded={isModelSelectOpen}
                      id="guardrails-model-select-toggle"
                      style={{ width: '100%' }}
                    >
                      {selectedModel === 'llama-3.1-8b-instruct' ? 'Llama 3.1 8B-Instruct' :
                       selectedModel === 'mistral-7b-instruct' ? 'Mistral 7B-Instruct' :
                       selectedModel === 'granite-8b-code' ? 'Granite 8B Code' :
                       selectedModel === 'falcon-7b' ? 'Falcon 7B' :
                       selectedModel === 'bloom-7b1' ? 'BLOOM 7B1' : 'Select model'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="llama-3.1-8b-instruct">Llama 3.1 8B-Instruct</SelectOption>
                    <SelectOption value="mistral-7b-instruct">Mistral 7B-Instruct</SelectOption>
                    <SelectOption value="granite-8b-code">Granite 8B Code</SelectOption>
                    <SelectOption value="falcon-7b">Falcon 7B</SelectOption>
                    <SelectOption value="bloom-7b1">BLOOM 7B1</SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>

              {/* User Input Section */}
              <div style={{ marginBottom: '2rem' }}>
                <Title headingLevel="h4" size="md" style={{ marginBottom: '1rem' }}>
                  User input
                </Title>

                {/* Jailbreaks and prompt attacks */}
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '1rem' }}>
                  <FlexItem>
                    <Switch
                      id="guardrails-jailbreaks"
                      isChecked={jailbreaksEnabled}
                      onChange={(_event, checked) => setJailbreaksEnabled(checked)}
                      aria-label="Enable jailbreaks protection"
                    />
                  </FlexItem>
                  <FlexItem style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Jailbreaks and prompt attacks
                    <Tooltip content="Protects against attempts to bypass model safety measures and malicious prompt injection attacks">
                      <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                    </Tooltip>
                  </FlexItem>
                </Flex>

                {/* Content moderation - User input */}
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '1rem' }}>
                  <FlexItem>
                    <Switch
                      id="guardrails-content-mod-user"
                      isChecked={contentModerationUserEnabled}
                      onChange={(_event, checked) => setContentModerationUserEnabled(checked)}
                      aria-label="Enable content moderation for user input"
                    />
                  </FlexItem>
                  <FlexItem style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Content moderation
                    <Tooltip content="Filters inappropriate content in user messages">
                      <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                    </Tooltip>
                  </FlexItem>
                </Flex>

                {/* PII - User input */}
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>
                    <Switch
                      id="guardrails-pii-user"
                      isChecked={piiUserEnabled}
                      onChange={(_event, checked) => setPiiUserEnabled(checked)}
                      aria-label="Enable PII detection for user input"
                    />
                  </FlexItem>
                  <FlexItem style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Personal identifiable information (PII)
                    <Tooltip content="Detects and protects personally identifiable information in user messages">
                      <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                    </Tooltip>
                  </FlexItem>
                </Flex>
              </div>

              {/* Model Output Section */}
              <div>
                <Title headingLevel="h4" size="md" style={{ marginBottom: '1rem' }}>
                  Model output
                </Title>

                {/* Content moderation - Model output */}
                <div style={{ marginBottom: '1rem' }}>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '0.5rem' }}>
                    <FlexItem>
                      <Switch
                        id="guardrails-content-mod-output"
                        isChecked={contentModerationOutputEnabled}
                        onChange={(_event, checked) => {
                          setContentModerationOutputEnabled(checked);
                          // Optionally uncheck all sub-options when main toggle is off
                          if (!checked) {
                            setToxicityEnabled(false);
                            setSexualContentEnabled(false);
                            setViolenceEnabled(false);
                            setHarassmentEnabled(false);
                          }
                        }}
                        aria-label="Enable content moderation for model output"
                      />
                    </FlexItem>
                    <FlexItem style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Content moderation
                      <Tooltip content="Filters inappropriate content in model responses">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </FlexItem>
                  </Flex>

                  {/* Content Moderation Sub-options */}
                  {contentModerationOutputEnabled && (
                    <div style={{ marginLeft: '3rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Checkbox
                        id="toxicity-checkbox"
                        label="Toxicity / Hate Speech"
                        isChecked={toxicityEnabled}
                        onChange={(_event, checked) => setToxicityEnabled(checked)}
                      />
                      <Checkbox
                        id="sexual-content-checkbox"
                        label="Sexual Content"
                        isChecked={sexualContentEnabled}
                        onChange={(_event, checked) => setSexualContentEnabled(checked)}
                      />
                      <Checkbox
                        id="violence-checkbox"
                        label="Violence / Self Harm"
                        isChecked={violenceEnabled}
                        onChange={(_event, checked) => setViolenceEnabled(checked)}
                      />
                      <Checkbox
                        id="harassment-checkbox"
                        label="Harassment"
                        isChecked={harassmentEnabled}
                        onChange={(_event, checked) => setHarassmentEnabled(checked)}
                      />
                    </div>
                  )}
                </div>

                {/* PII - Model output */}
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>
                    <Switch
                      id="guardrails-pii-output"
                      isChecked={piiOutputEnabled}
                      onChange={(_event, checked) => setPiiOutputEnabled(checked)}
                      aria-label="Enable PII detection for model output"
                    />
                  </FlexItem>
                  <FlexItem style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Personal identifiable information (PII)
                    <Tooltip content="Detects and protects personally identifiable information in model responses">
                      <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                    </Tooltip>
                  </FlexItem>
                </Flex>
              </div>
            </>
          )}
        </div>
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  // Chat Panel Component
  const ChatPanel = () => (
    <div style={{ height: '100%' }}>
      <Chatbot displayMode={ChatbotDisplayMode.embedded}>
        <ChatbotContent>
          <MessageBox>
            {chatHistory.length === 0 ? (
              <>
                <ChatbotWelcomePrompt
                  title="Hello!"
                  description="Welcome to the playground"
                />
                
                {/* Full-width image card */}
                <div style={{ margin: '1rem 0', opacity: 0.5 }}>
                  <div 
                    style={{ 
                      width: '100%',
                      maxHeight: 'calc(100% - 16px)',
                      overflow: 'hidden'
                    }}
                    dangerouslySetInnerHTML={{ __html: PlaceholderImage }}
                  />
                </div>

                {/* Initial bot message */}
                <Message
                  id="initial-bot-message"
                  role="bot"
                  name="Bot"
                  content="Before you begin chatting, you can change the model, edit the system prompt, adjust model parameters to fit your specific use case."
                  avatar={`data:image/svg+xml,${encodeURIComponent(ChatbotIcon)}`}
                  timestamp={`${selectedModel.split('-')[0].charAt(0).toUpperCase() + selectedModel.split('-')[0].slice(1)} 3.1 8B-Instruct · 1:30 PM`}
                />
              </>
            ) : (
              chatHistory.map((msg) => (
                <Message key={msg.id} {...msg} />
              ))
            )}
          </MessageBox>
        </ChatbotContent>
        <ChatbotFooter>
          <div style={{ 
            borderTop: '1px solid var(--pf-v6-global--BorderColor--100)',
            padding: '1rem'
          }}>
            <MessageBar
              value={inputValue}
              onSendMessage={(message) => {
                const newMsg = {
                  id: Date.now().toString(),
                  role: 'user',
                  content: message,
                  name: 'User',
                  avatar: 'U',
                  timestamp: new Date().toLocaleTimeString()
                };
                setChatHistory([...chatHistory, newMsg]);
                setInputValue('');
              }}
              onChange={(_event, value) => setInputValue(String(value))}
              hasAttachButton={false}
              hasMicrophoneButton
            />
          </div>
        </ChatbotFooter>
      </Chatbot>
    </div>
  );

  // Saved Configurations Drawer
  const SavedConfigurationsPanel = (
    <DrawerPanelContent style={{ width: '320px' }}>
      <DrawerHead>
        <Title headingLevel="h2" size="lg">Saved Configurations</Title>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setIsSavedConfigsOpen(false)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody>
        <div style={{ marginBottom: '1rem' }}>
          {['HR bot', 'Coding assistant POC', 'Expense report assistant'].map((name, idx) => (
            <Card key={idx} isCompact isClickable style={{ marginBottom: '0.5rem' }}>
              <CardBody>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <FlexItem>
                    <FolderIcon style={{ marginRight: '0.5rem' }} />
                    {name}
                  </FlexItem>
                  <FlexItem>
                    <Button variant="plain" icon={<EllipsisVIcon />} aria-label="Actions" />
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </div>
        <Button variant="link" icon={<RedoIcon />}>Reset to default</Button>
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  // Sample Prompts Drawer
  const SamplePromptsPanel = (
    <DrawerPanelContent style={{ width: '320px' }}>
      <DrawerHead>
        <Title headingLevel="h2" size="lg">Sample Prompts</Title>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setIsSamplePromptsOpen(false)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody>
        {[
          { name: 'Code reviewer', category: 'Code' },
          { name: 'Technical writer', category: 'Writing' },
          { name: 'Data analyst', category: 'Analysis' }
        ].map((prompt, idx) => (
          <Card key={idx} isCompact isClickable style={{ marginBottom: '0.5rem' }}>
            <CardBody>
              <LightbulbIcon style={{ marginRight: '0.5rem' }} />
              <strong>{prompt.name}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--pf-v6-global--Color--200)' }}>
                {prompt.category}
              </div>
            </CardBody>
          </Card>
        ))}
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  // Chat History Drawer
  const ChatHistoryPanel = (
    <DrawerPanelContent style={{ width: '320px' }}>
      <DrawerHead>
        <Title headingLevel="h2" size="lg">Chat History</Title>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setIsChatHistoryOpen(false)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody>
        {[
          { date: 'Today, 2:30 PM', message: 'Explain React hooks' },
          { date: 'Today, 11:15 AM', message: 'Debug Python code' }
        ].map((item, idx) => (
          <Card key={idx} isCompact isClickable style={{ marginBottom: '0.5rem' }}>
            <CardBody>
              <div style={{ fontSize: '0.75rem', color: 'var(--pf-v6-global--Color--200)' }}>
                {item.date}
              </div>
              <div>{item.message}</div>
            </CardBody>
          </Card>
        ))}
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  const MainContent = (
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)', width: '100%' }}>
      <Drawer isExpanded isInline position="left" style={{ flex: 1, minWidth: 0 }}>
        <DrawerContent panelContent={BuildPanelContent}>
          <DrawerContentBody style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
              <ChatPanel />
            </div>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </div>
  );

  return (
    <>
      <PageSection className="playground-header" style={{ borderBottom: '1px solid #d2d2d2' }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <div 
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center' }}
                  dangerouslySetInnerHTML={{ __html: PageIcon }}
                />
              </FlexItem>
              <FlexItem>
                <Title headingLevel="h1">Playground</Title>
              </FlexItem>
              {flags.showProjectWorkspaceDropdowns && (
                <FlexItem style={{ marginLeft: 'var(--pf-v6-global--spacer--xl)' }}>
                  <InputGroup>
                    <InputGroupItem>
                      <div className="pf-v6-c-input-group__text">
                        <OutlinedFolderIcon /> Project
                      </div>
                    </InputGroupItem>
                    <InputGroupItem>
                <Select
                        isOpen={isProjectSelectOpen}
                        selected={selectedProject}
                  onSelect={(_event, value) => {
                          setSelectedProject(value as string);
                          setIsProjectSelectOpen(false);
                  }}
                        onOpenChange={(isOpen) => setIsProjectSelectOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                            onClick={() => setIsProjectSelectOpen(!isProjectSelectOpen)}
                            isExpanded={isProjectSelectOpen}
                            id="project-select"
                            style={{ width: '200px' }}
                          >
                            {selectedProject || 'Test playground'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                          <SelectOption value="Test playground">Test playground</SelectOption>
                          <SelectOption value="Project X">Project X</SelectOption>
                  </SelectList>
                </Select>
                    </InputGroupItem>
                  </InputGroup>
                </FlexItem>
              )}
            </Flex>
          </FlexItem>

          <FlexItem>
            <Flex gap={{ default: 'gapSm' }}>
              <Button variant="link" icon={<SaveIcon />} id="save-button" onClick={() => setIsSaveConfigModalOpen(true)}>
                Save
              </Button>
              <Button variant="link" icon={<PlusIcon />} id="new-chat-button">
                New chat
              </Button>
              <Button variant="primary" icon={<CodeIcon />} id="view-code-button">
                View code
              </Button>
              <Dropdown
                isOpen={isKebabMenuOpen}
                onSelect={() => setIsKebabMenuOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsKebabMenuOpen(isOpen)}
                popperProps={{
                  position: 'right'
                }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setIsKebabMenuOpen(!isKebabMenuOpen)}
                    isExpanded={isKebabMenuOpen}
                    id="more-options-button"
                  >
                    <EllipsisVIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="chat-history" onClick={() => {
                    setIsChatHistoryOpen(true);
                    setIsSavedConfigsOpen(false);
                    setIsSamplePromptsOpen(false);
                  }}>
                    <HistoryIcon style={{ marginRight: '0.5rem' }} />
                    Chat history
                  </DropdownItem>
                  <DropdownItem key="download" onClick={() => console.log('Download transcript')}>
                    <DownloadIcon style={{ marginRight: '0.5rem' }} />
                    Download transcript
                  </DropdownItem>
                  <DropdownItem key="update-config" onClick={() => console.log('Update configuration')}>
                    <CogIcon style={{ marginRight: '0.5rem' }} />
                    Update configuration
                  </DropdownItem>
                  <DropdownItem key="delete" onClick={() => console.log('Delete playground')}>
                    <TrashIcon style={{ marginRight: '0.5rem' }} />
                    Delete playground
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </Flex>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection padding={{ default: 'noPadding' }} isFilled>
        <Drawer isExpanded={isSavedConfigsOpen} isInline position="left">
          <DrawerContent panelContent={SavedConfigurationsPanel}>
            <Drawer isExpanded={isSamplePromptsOpen} isInline position="left">
              <DrawerContent panelContent={SamplePromptsPanel}>
                <Drawer isExpanded={isChatHistoryOpen} isInline position="left">
                  <DrawerContent panelContent={ChatHistoryPanel}>
                    <DrawerContentBody>{MainContent}</DrawerContentBody>
                  </DrawerContent>
                </Drawer>
              </DrawerContent>
            </Drawer>
          </DrawerContent>
        </Drawer>
    </PageSection>

      {/* Add/Edit Vector Store Modal */}
      <AddVectorStoreModal
        isOpen={isAddVectorStoreModalOpen}
        onClose={() => {
          setIsAddVectorStoreModalOpen(false);
          setEditingVectorStore(null);
        }}
        onSave={(vectorStoreData) => {
          if (editingVectorStore) {
            // Update existing vector store
            setVectorStores(stores =>
              stores.map(s =>
                s.id === editingVectorStore.id ? { ...s, ...vectorStoreData } : s
              )
            );
          } else {
            // Add new vector store
            setVectorStores([...vectorStores, vectorStoreData]);
          }
          setEditingVectorStore(null);
        }}
      />

      {/* Load Prompt Modal */}
      <LoadPromptModal
        isOpen={isLoadPromptModalOpen}
        onClose={() => setIsLoadPromptModalOpen(false)}
        onLoadPrompt={(prompt, isReadOnly) => {
          setSystemPrompt(prompt);
          setIsSystemPromptReadOnly(isReadOnly);
        }}
      />

      {/* Save Configuration Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={isSaveConfigModalOpen}
        onClose={() => {
          setIsSaveConfigModalOpen(false);
          setConfigName('');
          setConfigDescription('');
        }}
      >
        <ModalHeader
          title="Save configuration"
          description={
            <span style={{ fontSize: '14px' }}>
              Save your configuration including prompt, model parameters, knowledge and tool selection
            </span>
          }
        />
        <ModalBody>
          <FormGroup 
            label="Name"
            isRequired
            fieldId="config-name"
          >
            <TextInput
              id="config-name"
              value={configName}
              onChange={(_event, value) => setConfigName(value)}
              placeholder="Name your session"
              isRequired
            />
          </FormGroup>

          <FormGroup 
            label="Description"
            fieldId="config-description"
            style={{ marginTop: '1rem' }}
          >
            <TextArea
              id="config-description"
              value={configDescription}
              onChange={(_event, value) => setConfigDescription(value)}
              placeholder="Describe your use case"
              rows={3}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              // Handle save logic here
              console.log('Saving configuration:', { name: configName, description: configDescription });
              setIsSaveConfigModalOpen(false);
              setConfigName('');
              setConfigDescription('');
            }}
            isDisabled={!configName.trim()}
          >
            Save
          </Button>
          <Button
            variant="link"
            onClick={() => {
              setIsSaveConfigModalOpen(false);
              setConfigName('');
              setConfigDescription('');
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { Playground };
