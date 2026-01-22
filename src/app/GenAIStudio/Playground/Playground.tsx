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
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  FormGroup,
  InputGroup,
  InputGroupItem,
  Label,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  Pagination,
  Popover,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Slider,
  Spinner,
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
  CheckCircleIcon,
  CheckIcon,
  CodeIcon,
  CogIcon,
  CubesIcon,
  DownloadIcon,
  EllipsisVIcon,
  FolderIcon,
  HistoryIcon,
  InfoCircleIcon,
  LightbulbIcon,
  LockIcon,
  LockOpenIcon,
  OutlinedFolderIcon,
  OutlinedQuestionCircleIcon,
  PencilAltIcon,
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
import { CreatePromptModal } from '@app/GenAIStudio/PromptLab/components/CreatePromptModal';
import { CreateVersionModal } from '@app/GenAIStudio/PromptLab/components/CreateVersionModal';
import { PromptVariableEditor } from '@app/GenAIStudio/PromptLab/components/PromptVariableEditor';
import PageIcon from '@app/assets/PageIcon.svg';
import ChatbotIcon from '@app/assets/chatbotIcon.svg';
import PlaceholderImage from '@app/assets/placeholderImage.svg';
import AIIcon from '@app/assets/AI_Icon.svg';
import SlidersIcon from '@app/assets/pf-sliders.svg';
import { PlaygroundIcon } from '@app/Home/icons';

const Playground: React.FunctionComponent = () => {
  useDocumentTitle('Playground');
  const { flags, selectedProject, setSelectedProject } = useFeatureFlags();

  // State management
  const [isProjectSelectOpen, setIsProjectSelectOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [isSystemPromptReadOnly, setIsSystemPromptReadOnly] = useState(false);
  const [isPromptEdited, setIsPromptEdited] = useState(false);
  const [isRagEnabled, setIsRagEnabled] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-oss-20b');
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [reasoningLevel, setReasoningLevel] = useState('default');
  const [isReasoningLevelOpen, setIsReasoningLevelOpen] = useState(false);

  // Models with reasoning capability
  const modelsWithReasoning = ['gpt-oss-20b', 'gpt-oss-120b', 'qwen3-14b', 'llama-3.2-11b', 'granite-4.0-h-small'];
  const hasReasoning = modelsWithReasoning.includes(selectedModel);
  const [isLoadPromptModalOpen, setIsLoadPromptModalOpen] = useState(false);
  const [isSavePromptModalOpen, setIsSavePromptModalOpen] = useState(false);
  const [isEditPromptModalOpen, setIsEditPromptModalOpen] = useState(false);
  const [loadedPrompt, setLoadedPrompt] = useState<any>(null);
  
  // Build panel toggle state (using ToggleGroup instead of Tabs)
  const [selectedBuildTab, setSelectedBuildTab] = useState('model');
  
  // Navigation drawer states
  const [isSavedConfigsOpen, setIsSavedConfigsOpen] = useState(false);
  const [isSamplePromptsOpen, setIsSamplePromptsOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  
  // Knowledge tab dropdown state
  const [isVectorStoreDropdownOpen, setIsVectorStoreDropdownOpen] = useState(false);
  const [isAddVectorStoreModalOpen, setIsAddVectorStoreModalOpen] = useState(false);
  const [editingVectorStore, setEditingVectorStore] = useState<any>(null);
  const [vectorStoreToRemove, setVectorStoreToRemove] = useState<any>(null);
  
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
    { id: '1', name: 'HR test', type: 'In memory', provider: 'Milvus', selected: false, addedToKnowledge: false },
    { id: '2', name: 'Test 2', type: 'In memory', provider: 'Milvus', selected: false, addedToKnowledge: false },
    { id: '3', name: 'HR benefits Q&A', type: 'External connection', provider: 'PGVector', selected: false, addedToKnowledge: false },
    { id: '4', name: 'Expense tracker', type: 'External connection', provider: 'Milvus', selected: false, addedToKnowledge: false },
  ]);
  const [mcpServers, setMcpServers] = useState([
    { id: '1', name: 'Github', enabled: false, toolsCount: 0, totalTools: 12, hasAuth: false, connected: false },
    { id: '2', name: 'Kubernetes', enabled: false, toolsCount: 0, totalTools: 21, hasAuth: false, connected: false },
    { id: '3', name: 'Slack', enabled: false, toolsCount: 0, totalTools: 15, hasAuth: false, connected: false },
    { id: '4', name: 'Jira', enabled: false, toolsCount: 0, totalTools: 8, hasAuth: false, connected: false },
    { id: '5', name: 'PostgreSQL', enabled: false, toolsCount: 0, totalTools: 10, hasAuth: false, connected: false },
  ]);

  // MCP connection state management
  const [connectingMcpId, setConnectingMcpId] = useState<string | null>(null);
  const [isMcpConnectionModalOpen, setIsMcpConnectionModalOpen] = useState(false);
  const [isMcpToolsModalOpen, setIsMcpToolsModalOpen] = useState(false);
  const [selectedMcpServer, setSelectedMcpServer] = useState<any>(null);
  const [mcpToolSelections, setMcpToolSelections] = useState<Record<string, boolean>>({});
  const [mcpToolsSearchValue, setMcpToolsSearchValue] = useState('');
  const [mcpToolsPage, setMcpToolsPage] = useState(1);
  const mcpToolsPerPage = 10;

  // Kubernetes MCP tools data
  const kubernetesMcpTools = [
    { name: 'configuration_view', description: 'Get the current Kubernetes configuration content as a kubeconfig YAML' },
    { name: 'events_list', description: 'List all the Kubernetes events in the current cluster from all namespaces' },
    { name: 'helm_install', description: 'Install a Helm chart in the current or provided namespace' },
    { name: 'helm_list', description: 'List all the Helm releases in the current or provided namespace (or in all namespaces if specified)' },
    { name: 'helm_uninstall', description: 'Uninstall a Helm release in the current or provided namespace' },
    { name: 'namespace_create', description: 'Create the Kubernetes namespace in the current cluster' },
    { name: 'namespace_delete', description: 'Delete the Kubernetes namespace in the current cluster' },
    { name: 'namespaces_list', description: 'List all the Kubernetes namespaces in the current cluster' },
    { name: 'pods_delete', description: 'Delete a Kubernetes Pod in the current or provided namespace with the provided name' },
    { name: 'pods_exec', description: 'Execute a command in a Kubernetes Pod in the current or provided namespace with the provided name and command' },
    { name: 'pods_list', description: 'List all the Kubernetes Pods in the current or provided namespace' },
    { name: 'pods_log', description: 'Get the logs of a Kubernetes Pod in the current or provided namespace with the provided name' },
    { name: 'pods_run', description: 'Run a new Kubernetes Pod in the current or provided namespace' },
    { name: 'resources_create_or_update', description: 'Create or update a Kubernetes resource from a YAML or JSON definition' },
    { name: 'resources_delete', description: 'Delete a Kubernetes resource by kind, name and optional namespace' },
    { name: 'resources_get', description: 'Get a Kubernetes resource by kind, name and optional namespace' },
    { name: 'resources_list', description: 'List Kubernetes resources by kind and optional namespace' },
    { name: 'services_create', description: 'Create a new Kubernetes Service in the current or provided namespace' },
    { name: 'services_delete', description: 'Delete a Kubernetes Service in the current or provided namespace' },
    { name: 'services_list', description: 'List all the Kubernetes Services in the current or provided namespace' },
    { name: 'cluster_info', description: 'Get basic information about the current Kubernetes cluster' },
  ];

  // MCP checkbox change handler
  const handleMcpCheckboxChange = (serverId: string, checked: boolean) => {
    const server = mcpServers.find(s => s.id === serverId);

    if (checked) {
      // Check if server was already authorized before
      if (server?.hasAuth) {
        // Already authorized - immediately re-enable without auth flow
        setMcpServers(servers => servers.map(s =>
          s.id === serverId ? { ...s, enabled: true, connected: true, toolsCount: s.totalTools } : s
        ));
      } else {
        // First time - start connecting animation
        setConnectingMcpId(serverId);

        // After 2 seconds, complete connection
        setTimeout(() => {
          setConnectingMcpId(null);
          setMcpServers(servers => servers.map(s =>
            s.id === serverId ? { ...s, enabled: true, connected: true, hasAuth: true, toolsCount: s.totalTools } : s
          ));
          // Set the selected server and open connection modal
          const updatedServer = { ...server, enabled: true, connected: true, hasAuth: true, toolsCount: server?.totalTools || 0 };
          setSelectedMcpServer(updatedServer);
          setIsMcpConnectionModalOpen(true);
          // Initialize all tools as selected
          if (server?.name === 'Kubernetes') {
            const initialSelections: Record<string, boolean> = {};
            kubernetesMcpTools.forEach(tool => {
              initialSelections[tool.name] = true;
            });
            setMcpToolSelections(initialSelections);
          }
        }, 2000);
      }
    } else {
      // Disable but keep hasAuth so re-enabling is instant
      setMcpServers(servers => servers.map(s =>
        s.id === serverId ? { ...s, enabled: false, connected: false, toolsCount: 0 } : s
      ));
    }
  };

  // Handle lock icon click
  const handleLockClick = (server: any) => {
    setSelectedMcpServer(server);
    setIsMcpConnectionModalOpen(true);
  };

  // Handle tools count click
  const handleToolsClick = (server: any) => {
    setSelectedMcpServer(server);
    if (server.name === 'Kubernetes' && Object.keys(mcpToolSelections).length === 0) {
      const initialSelections: Record<string, boolean> = {};
      kubernetesMcpTools.forEach(tool => {
        initialSelections[tool.name] = true;
      });
      setMcpToolSelections(initialSelections);
    }
    setMcpToolsPage(1);
    setMcpToolsSearchValue('');
    setIsMcpToolsModalOpen(true);
  };

  // Handle MCP disconnect
  const handleMcpDisconnect = (serverId: string) => {
    setMcpServers(servers => servers.map(s =>
      s.id === serverId ? { ...s, enabled: false, connected: false, hasAuth: false, toolsCount: 0 } : s
    ));
    setIsMcpConnectionModalOpen(false);
    setSelectedMcpServer(null);
  };

  // Handle save tools selection
  const handleSaveMcpTools = () => {
    const selectedCount = Object.values(mcpToolSelections).filter(Boolean).length;
    if (selectedMcpServer) {
      setMcpServers(servers => servers.map(s =>
        s.id === selectedMcpServer.id ? { ...s, toolsCount: selectedCount } : s
      ));
    }
    setIsMcpToolsModalOpen(false);
  };

  // Get filtered and paginated tools
  const getFilteredTools = () => {
    let tools = kubernetesMcpTools;
    if (mcpToolsSearchValue) {
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(mcpToolsSearchValue.toLowerCase()) ||
        tool.description.toLowerCase().includes(mcpToolsSearchValue.toLowerCase())
      );
    }
    return tools;
  };

  const getPaginatedTools = () => {
    const filtered = getFilteredTools();
    const startIndex = (mcpToolsPage - 1) * mcpToolsPerPage;
    return filtered.slice(startIndex, startIndex + mcpToolsPerPage);
  };

  // Count enabled MCP servers and total enabled tools
  const enabledMcpCount = mcpServers.filter(s => s.enabled).length;
  const totalEnabledMcpTools = mcpServers.filter(s => s.enabled).reduce((sum, s) => sum + s.toolsCount, 0);

  // Guardrails state
  const [guardrailsEnabled, setGuardrailsEnabled] = useState(false);
  const [selectedGuardrailModel, setSelectedGuardrailModel] = useState('granite-guardian');
  const [isGuardrailModelSelectOpen, setIsGuardrailModelSelectOpen] = useState(false);
  
  // Chat state
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  // Save configuration modal state
  const [isSaveConfigModalOpen, setIsSaveConfigModalOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const [configDescription, setConfigDescription] = useState('');
  
  // Edit prompt confirmation modal state
  const [promptVersion, setPromptVersion] = useState('');
  const [promptAlias, setPromptAlias] = useState('');
  
  // Save prompt modal state
  const [savePromptName, setSavePromptName] = useState('');
  const [savePromptAlias, setSavePromptAlias] = useState('');


  // Tab Bar Component - spans full width above chat and config panel
  const TabBar = (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '0.75rem 1rem',
      borderBottom: '1px solid #d2d2d2',
      display: 'flex',
      alignItems: 'center'
    }}>
      <ToggleGroup aria-label="Configuration options">
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
          text={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Knowledge
              {vectorStores.filter(s => s.selected).length > 0 && (
                <Badge isRead>{vectorStores.filter(s => s.selected).length}</Badge>
              )}
            </span>
          }
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
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Guardrails
              <Label color={guardrailsEnabled ? 'green' : 'red'} isCompact>
                {guardrailsEnabled ? 'On' : 'Off'}
              </Label>
            </span>
          }
          buttonId="guardrails"
          isSelected={selectedBuildTab === 'guardrails'}
          onChange={() => setSelectedBuildTab('guardrails')}
        />
      </ToggleGroup>
    </div>
  );

  // Build Panel using DrawerPanelContent
  const BuildPanelContent = (
    <DrawerPanelContent isResizable minSize="380px" defaultSize="380px" id="build-panel-drawer">
      <DrawerContentBody style={{ padding: '1rem', height: '100%', overflow: 'auto' }}>
          {selectedBuildTab === 'model' && (
            <>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                Model
              </Title>
              
              <FormGroup fieldId="model-select-form">
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
                      style={{ width: '100%', maxWidth: '350px' }}
                    >
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          {selectedModel === '' ? 'Choose a model' :
                           selectedModel === 'gpt-oss-20b' ? 'gpt-oss-20b' :
                           selectedModel === 'gpt-oss-120b' ? 'gpt-oss-120b' :
                           selectedModel === 'qwen3-14b' ? 'Qwen3-14B' :
                           selectedModel === 'llama-3.2-11b' ? 'llama-3.2-11b' :
                           selectedModel === 'granite-4.0-h-small' ? 'granite-4.0-h-small' :
                           selectedModel === 'ministral-3-8b' ? 'Ministral-3-8B' : 'Choose a model'}
                        </FlexItem>
                        {hasReasoning && (
                          <FlexItem><Label color="green" isCompact>Reasoning</Label></FlexItem>
                        )}
                      </Flex>
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="gpt-oss-20b">
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>gpt-oss-20b</FlexItem>
                        <FlexItem><Label color="green" isCompact>Reasoning</Label></FlexItem>
                      </Flex>
                    </SelectOption>
                    <SelectOption value="gpt-oss-120b">
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>gpt-oss-120b</FlexItem>
                        <FlexItem><Label color="green" isCompact>Reasoning</Label></FlexItem>
                      </Flex>
                    </SelectOption>
                    <SelectOption value="qwen3-14b">
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>Qwen3-14B</FlexItem>
                        <FlexItem><Label color="green" isCompact>Reasoning</Label></FlexItem>
                      </Flex>
                    </SelectOption>
                    <SelectOption value="llama-3.2-11b">
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>llama-3.2-11b</FlexItem>
                        <FlexItem><Label color="green" isCompact>Reasoning</Label></FlexItem>
                      </Flex>
                    </SelectOption>
                    <SelectOption value="granite-4.0-h-small">
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>granite-4.0-h-small</FlexItem>
                        <FlexItem><Label color="green" isCompact>Reasoning</Label></FlexItem>
                      </Flex>
                    </SelectOption>
                    <SelectOption value="ministral-3-8b">Ministral-3-8B</SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>

              {/* Reasoning Level dropdown - only shown for models with reasoning */}
              {hasReasoning && (
                <FormGroup
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Reasoning level
                      <Tooltip content="Controls inference time scaling - how long a model thinks before responding. Requires a reasoning-capable model.">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </span>
                  }
                  fieldId="reasoning-level-select"
                  style={{ marginTop: '1rem' }}
                >
                  <Select
                    id="reasoning-level-select"
                    isOpen={isReasoningLevelOpen}
                    selected={reasoningLevel}
                    onSelect={(_event, value) => {
                      setReasoningLevel(value as string);
                      setIsReasoningLevelOpen(false);
                    }}
                    onOpenChange={(isOpen) => setIsReasoningLevelOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsReasoningLevelOpen(!isReasoningLevelOpen)}
                        isExpanded={isReasoningLevelOpen}
                        id="reasoning-level-toggle"
                        style={{ width: '100%', maxWidth: '350px' }}
                      >
                        {reasoningLevel === 'default' ? 'Default' :
                         reasoningLevel === 'low' ? 'Low' :
                         reasoningLevel === 'medium' ? 'Medium' :
                         reasoningLevel === 'high' ? 'High' : 'Select level'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="default">Default</SelectOption>
                      <SelectOption value="low">Low</SelectOption>
                      <SelectOption value="medium">Medium</SelectOption>
                      <SelectOption value="high">High</SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>
              )}

              <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                <FormGroup
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Temperature: 0 - 2
                      <Tooltip content="Controls randomness in the output. Lower values make the output more focused and deterministic, while higher values increase creativity and diversity.">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </span>
                  }
                  fieldId="temperature"
                  style={{ marginTop: '1.5rem' }}
                >
                  <div className="slider-fixed-input">
                    <Slider
                      id="temperature"
                      value={temperature}
                      onChange={(_event, value) => setTemperature(value)}
                      min={0}
                      max={2}
                      step={0.1}
                      isInputVisible
                      inputValue={temperature}
                      showBoundaries={false}
                    />
                  </div>
                </FormGroup>

                <FormGroup
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Top P: 0 - 1
                      <Tooltip content="Controls diversity via nucleus sampling. The model considers the smallest set of tokens whose cumulative probability exceeds the threshold. Lower values make output more focused.">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </span>
                  }
                  fieldId="top-p"
                  style={{ marginTop: '1rem' }}
                >
                  <div className="slider-fixed-input">
                    <Slider
                      id="top-p"
                      value={topP}
                      onChange={(_event, value) => setTopP(value)}
                      min={0}
                      max={1}
                      step={0.1}
                      isInputVisible
                      inputValue={topP}
                      showBoundaries={false}
                    />
                  </div>
                </FormGroup>

                <FormGroup
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Max token: 1 - 4096
                      <Tooltip content="The maximum number of tokens to generate in the response. One token is roughly 4 characters. Higher values allow for longer responses.">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </span>
                  }
                  fieldId="max-tokens"
                  style={{ marginTop: '1rem' }}
                >
                  <div className="slider-fixed-input">
                    <Slider
                      id="max-tokens"
                      value={maxTokens}
                      onChange={(_event, value) => setMaxTokens(value)}
                      min={1}
                      max={4096}
                      step={1}
                      isInputVisible
                      inputValue={maxTokens}
                      showBoundaries={false}
                    />
                  </div>
                </FormGroup>

                <FormGroup
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Repetition: 0 - 2
                      <Tooltip content="Penalty for repeating tokens. Higher values discourage the model from repeating the same words or phrases. Values greater than 1.0 penalize repetition.">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </span>
                  }
                  fieldId="repetition"
                  style={{ marginTop: '1rem' }}
                >
                  <div className="slider-fixed-input">
                    <Slider
                      id="repetition"
                      value={repetition}
                      onChange={(_event, value) => setRepetition(value)}
                      min={0}
                      max={2}
                      step={0.1}
                      isInputVisible
                      inputValue={repetition}
                      showBoundaries={false}
                    />
                  </div>
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
                  onChange={(_event, value) => {
                    setSystemPrompt(value);
                    if (!isSystemPromptReadOnly) {
                      setIsPromptEdited(true);
                    }
                  }}
                  placeholder="This will display the default system prompt"
                  rows={15}
                  readOnlyVariant={isSystemPromptReadOnly ? 'default' : undefined}
                  resizeOrientation="vertical"
                />
              </FormGroup>
              {isSystemPromptReadOnly && systemPrompt && (
                <Flex style={{ marginTop: '1rem' }} gap={{ default: 'gapSm' }}>
                  <FlexItem>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<PencilAltIcon />}
                      onClick={() => setIsEditPromptModalOpen(true)}
                    >
                      Edit prompt
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setSystemPrompt('');
                        setOriginalPrompt('');
                        setIsSystemPromptReadOnly(false);
                        setIsPromptEdited(false);
                      }}
                    >
                      Clear
                    </Button>
                  </FlexItem>
                </Flex>
              )}
              {!isSystemPromptReadOnly && (
                <Flex style={{ marginTop: '1rem' }} gap={{ default: 'gapSm' }}>
                  <FlexItem>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<SaveIcon />}
                      onClick={() => setIsSavePromptModalOpen(true)}
                      isDisabled={!isPromptEdited}
                    >
                      Save prompt
                    </Button>
                  </FlexItem>
                  {isPromptEdited && (
                    <FlexItem>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          // Revert to original prompt
                          setSystemPrompt(originalPrompt);
                          setIsPromptEdited(false);
                          if (originalPrompt) {
                            setIsSystemPromptReadOnly(true);
                          }
                        }}
                      >
                        Revert
                      </Button>
                    </FlexItem>
                  )}
                </Flex>
              )}
            </>
          )}
          
          {selectedBuildTab === 'knowledge' && (
            <>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                Knowledge
              </Title>
              <Dropdown
                isOpen={isVectorStoreDropdownOpen}
                onSelect={() => {}}
                onOpenChange={(isOpen: boolean) => setIsVectorStoreDropdownOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsVectorStoreDropdownOpen(!isVectorStoreDropdownOpen)}
                    isExpanded={isVectorStoreDropdownOpen}
                    style={{ width: '100%', marginBottom: '1rem', maxWidth: '350px' }}
                    id="vector-store-dropdown"
                  >
                    Available vector stores
                  </MenuToggle>
                )}
                id="vector-store-dropdown-menu"
              >
                <Menu style={{ maxWidth: '350px' }}>
                  <MenuContent>
                    <MenuList>
                      {vectorStores.filter(s => s.type === 'External connection').map((store) => (
                        <MenuItem
                          key={store.id}
                          itemId={store.id}
                          onClick={() => {
                            setIsVectorStoreDropdownOpen(false);
                            setVectorStores(stores =>
                              stores.map(s =>
                                s.id === store.id ? { ...s, addedToKnowledge: true, selected: true } : s
                              )
                            );
                          }}
                        >
                          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ width: '100%' }}>
                            <FlexItem>{store.name}</FlexItem>
                            <FlexItem style={{ color: 'var(--pf-v6-global--Color--200)', fontSize: '0.875rem' }}>
                              {store.provider}
                            </FlexItem>
                          </Flex>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </MenuContent>
                </Menu>
              </Dropdown>

              {/* Table of added vector stores or Empty State */}
              {vectorStores.filter(s => s.addedToKnowledge).length > 0 ? (
                <Table variant="compact" aria-label="Added vector stores" id="selected-vector-stores-table">
                  <Thead>
                    <Tr>
                      <Th width={10}>
                        <Checkbox
                          id="select-all-vector-stores"
                          isChecked={vectorStores.filter(s => s.addedToKnowledge).length > 0 && vectorStores.filter(s => s.addedToKnowledge).every(s => s.selected)}
                          onChange={(_event, checked) => {
                            setVectorStores(stores =>
                              stores.map(s =>
                                s.addedToKnowledge ? { ...s, selected: checked } : s
                              )
                            );
                          }}
                          aria-label="Select all vector stores"
                        />
                      </Th>
                      <Th>Name</Th>
                      <Th>Provider</Th>
                      <Th width={10}></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {vectorStores.filter(s => s.addedToKnowledge).map((store) => (
                      <Tr key={store.id}>
                        <Td>
                          <Checkbox
                            id={`vs-checkbox-${store.id}`}
                            isChecked={store.selected}
                            onChange={(_event, checked) => {
                              setVectorStores(stores =>
                                stores.map(s =>
                                  s.id === store.id ? { ...s, selected: checked } : s
                                )
                              );
                            }}
                            aria-label={`Select ${store.name}`}
                          />
                        </Td>
                        <Td>{store.name}</Td>
                        <Td>{store.provider}</Td>
                        <Td style={{ verticalAlign: 'middle' }}>
                          <Button
                            variant="plain"
                            aria-label={`Remove ${store.name}`}
                            onClick={() => setVectorStoreToRemove(store)}
                            style={{ padding: 0 }}
                          >
                            <TrashIcon />
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <EmptyState 
                  headingLevel="h4" 
                  icon={CubesIcon} 
                  titleText="No vector stores added"
                >
                  <EmptyStateBody>
                    Add vector stores to provide your model with custom knowledge and context. Browse available stores or create a new one to get started.
                  </EmptyStateBody>
                </EmptyState>
              )}
            </>
          )}
          
          {selectedBuildTab === 'mcp' && (
            <div>
              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '1rem' }}>
                <FlexItem>
                  <Title headingLevel="h3" size="md">MCP Servers</Title>
                </FlexItem>
                <FlexItem>
                  <Label variant="outline" color="blue">{totalEnabledMcpTools} tools enabled</Label>
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
                        <Checkbox
                          id={`mcp-${server.id}`}
                          isChecked={server.enabled}
                          isDisabled={connectingMcpId === server.id}
                          onChange={(_event, checked) => handleMcpCheckboxChange(server.id, checked)}
                          aria-label={`Enable ${server.name}`}
                        />
                      </Td>
                      <Td>{server.name}</Td>
                      <Td>
                        <Label
                          variant="outline"
                          onClick={server.connected ? () => handleToolsClick(server) : undefined}
                          style={{ cursor: server.connected ? 'pointer' : 'default' }}
                        >
                          {server.toolsCount} active
                        </Label>
                      </Td>
                      <Td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '36px' }}>
                          {connectingMcpId === server.id ? (
                            <Spinner size="md" aria-label="Connecting..." />
                          ) : server.hasAuth ? (
                            <Button
                              variant="plain"
                              onClick={() => handleLockClick(server)}
                              aria-label="View connection"
                              style={{ padding: 0 }}
                            >
                              <LockOpenIcon style={{ color: '#3E8635' }} />
                            </Button>
                          ) : (
                            <LockIcon style={{ color: '#6A6E73' }} />
                          )}
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          )}
          
          {selectedBuildTab === 'guardrails' && (
            <>
              {/* Guardrails Header with Toggle */}
              <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginBottom: '1rem' }}>
                <FlexItem>
                  <Title headingLevel="h3" size="md">Guardrails</Title>
                </FlexItem>
                <FlexItem>
                  <Switch
                    id="guardrails-master-toggle"
                    isChecked={guardrailsEnabled}
                    onChange={(_event, checked) => setGuardrailsEnabled(checked)}
                    aria-label="Enable guardrails"
                  />
                </FlexItem>
              </Flex>

              {/* Model Dropdown */}
              <FormGroup label="Model" fieldId="guardrails-model-select" style={{ marginBottom: '1.5rem' }}>
                <Select
                  id="guardrails-model-select"
                  isOpen={isGuardrailModelSelectOpen}
                  selected={selectedGuardrailModel}
                  onSelect={(_event, value) => {
                    setSelectedGuardrailModel(value as string);
                    setIsGuardrailModelSelectOpen(false);
                  }}
                  onOpenChange={(isOpen) => setIsGuardrailModelSelectOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsGuardrailModelSelectOpen(!isGuardrailModelSelectOpen)}
                      isExpanded={isGuardrailModelSelectOpen}
                      id="guardrails-model-select-toggle"
                      style={{ width: '100%', maxWidth: '350px' }}
                    >
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          {selectedGuardrailModel === 'granite-guardian' ? 'Granite Guardian' :
                           selectedGuardrailModel === 'llama-guard' ? 'Llama Guard' :
                           selectedGuardrailModel === 'llama-3.2-11b' ? 'Llama 3.2 11B' :
                           selectedGuardrailModel === 'qwen-3.2-14b' ? 'Qwen 3.2 14B' : 'Select model'}
                        </FlexItem>
                        {(selectedGuardrailModel === 'granite-guardian' || selectedGuardrailModel === 'llama-guard') && (
                          <FlexItem><Label color="green" isCompact>GRMDL</Label></FlexItem>
                        )}
                      </Flex>
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="granite-guardian">
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>Granite Guardian</FlexItem>
                        <FlexItem><Label color="green" isCompact>GRMDL</Label></FlexItem>
                      </Flex>
                    </SelectOption>
                    <SelectOption value="llama-guard">
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>Llama Guard</FlexItem>
                        <FlexItem><Label color="green" isCompact>GRMDL</Label></FlexItem>
                      </Flex>
                    </SelectOption>
                    <SelectOption value="llama-3.2-11b">Llama 3.2 11B</SelectOption>
                    <SelectOption value="qwen-3.2-14b">Qwen 3.2 14B</SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>

              {/* User Input Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <Title headingLevel="h4" size="md" style={{ marginBottom: '0.75rem' }}>
                  User input
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>Jailbreaks and prompt attacks</FlexItem>
                    <FlexItem>
                      <Tooltip content="Protects against attempts to bypass model safety measures and malicious prompt injection attacks">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>Content moderation</FlexItem>
                    <FlexItem>
                      <Tooltip content="Filters inappropriate content in user messages">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>Personal identifiable information (PII)</FlexItem>
                    <FlexItem>
                      <Tooltip content="Detects and protects personally identifiable information in user messages">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                </div>
              </div>

              {/* Model Output Section */}
              <div>
                <Title headingLevel="h4" size="md" style={{ marginBottom: '0.75rem' }}>
                  Model output
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>Content moderation</FlexItem>
                    <FlexItem>
                      <Tooltip content="Filters inappropriate content in model responses">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>Personal identifiable information (PII)</FlexItem>
                    <FlexItem>
                      <Tooltip content="Detects and protects personally identifiable information in model responses">
                        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: 'var(--pf-v6-global--icon-Color--subtle)' }} />
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                </div>
              </div>
            </>
          )}
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  // Chat Panel Component
  const ChatPanel = (
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
                const userAvatar = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#d2d2d2"/><circle cx="18" cy="14" r="6" fill="#8a8d90"/><path d="M6 32c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#8a8d90"/></svg>')}`;
                const userMsg = {
                  id: Date.now().toString(),
                  role: 'user',
                  content: message,
                  name: 'User',
                  avatar: userAvatar,
                  timestamp: new Date().toLocaleTimeString()
                };
                const updatedHistory = [...chatHistory, userMsg];
                setChatHistory(updatedHistory);
                setInputValue('');

                // Simulate bot response after a brief delay
                setTimeout(() => {
                  const botMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'bot',
                    content: 'This is a simulated response. In a real implementation, this would be the model\'s response to your message.',
                    name: 'Bot',
                    avatar: `data:image/svg+xml,${encodeURIComponent(ChatbotIcon)}`,
                    timestamp: new Date().toLocaleTimeString()
                  };
                  setChatHistory(prev => [...prev, botMsg]);
                }, 1000);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', width: '100%' }}>
      {/* Tab Bar - spans full width above chat and config */}
      {TabBar}

      {/* Main Content - Config Panel + Chat */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Drawer isExpanded isInline position="left" style={{ height: '100%' }}>
          <DrawerContent panelContent={BuildPanelContent}>
            <DrawerContentBody style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                {ChatPanel}
              </div>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );

  return (
    <>
      <PageSection className="playground-header" style={{ borderBottom: '1px solid #d2d2d2' }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center' }}>
                  <PlaygroundIcon withBackground size={32} />
                </div>
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
        editingStore={editingVectorStore}
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
          setOriginalPrompt(prompt);
          setIsSystemPromptReadOnly(isReadOnly);
          setIsPromptEdited(false);
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

      {/* Edit Prompt Confirmation Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={isEditPromptModalOpen}
        onClose={() => {
          setIsEditPromptModalOpen(false);
          setPromptVersion('');
          setPromptAlias('');
        }}
      >
        <ModalHeader
          title="Create new version"
          labelId="edit-prompt-modal-title"
          description="Editing will create a new version of this prompt. Please provide version details."
        />
        <ModalBody>
          <FormGroup 
            label="Version number"
            isRequired
            fieldId="prompt-version"
          >
            <TextInput
              id="prompt-version"
              value={promptVersion}
              onChange={(_event, value) => setPromptVersion(value)}
              placeholder="e.g., v2.0"
              isRequired
            />
          </FormGroup>

          <FormGroup 
            label="Alias"
            fieldId="prompt-alias"
            style={{ marginTop: '1rem' }}
          >
            <TextInput
              id="prompt-alias"
              value={promptAlias}
              onChange={(_event, value) => setPromptAlias(value)}
              placeholder="e.g., latest"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              // Save current prompt as original before making editable
              setOriginalPrompt(systemPrompt);
              setIsSystemPromptReadOnly(false);
              setIsPromptEdited(false);
              setIsEditPromptModalOpen(false);
              setPromptVersion('');
              setPromptAlias('');
            }}
            isDisabled={!promptVersion.trim()}
          >
            Confirm
          </Button>
          <Button
            variant="link"
            onClick={() => {
              setIsEditPromptModalOpen(false);
              setPromptVersion('');
              setPromptAlias('');
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Save Prompt Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={isSavePromptModalOpen}
        onClose={() => {
          setIsSavePromptModalOpen(false);
          setSavePromptName('');
          setSavePromptAlias('');
        }}
      >
        <ModalHeader
          title="Save prompt"
          description="Save your prompt to the registry with a name and alias"
        />
        <ModalBody>
          <FormGroup 
            label="Name"
            isRequired
            fieldId="save-prompt-name"
          >
            <TextInput
              id="save-prompt-name"
              value={savePromptName}
              onChange={(_event, value) => setSavePromptName(value)}
              placeholder="e.g., Customer support assistant"
              isRequired
            />
          </FormGroup>

          <FormGroup 
            label="Alias"
            fieldId="save-prompt-alias"
            style={{ marginTop: '1rem' }}
          >
            <TextInput
              id="save-prompt-alias"
              value={savePromptAlias}
              onChange={(_event, value) => setSavePromptAlias(value)}
              placeholder="e.g., latest"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              // Save the prompt to registry
              console.log('Saving prompt to registry:', { 
                name: savePromptName, 
                alias: savePromptAlias,
                content: systemPrompt 
              });
              setOriginalPrompt(systemPrompt);
              setIsPromptEdited(false);
              setIsSystemPromptReadOnly(true);
              setIsSavePromptModalOpen(false);
              setSavePromptName('');
              setSavePromptAlias('');
            }}
            isDisabled={!savePromptName.trim()}
          >
            Save
          </Button>
          <Button
            variant="link"
            onClick={() => {
              setIsSavePromptModalOpen(false);
              setSavePromptName('');
              setSavePromptAlias('');
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Remove Vector Store Confirmation Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={vectorStoreToRemove !== null}
        onClose={() => setVectorStoreToRemove(null)}
        aria-labelledby="remove-vector-store-modal-title"
        aria-describedby="remove-vector-store-modal-body"
      >
        <ModalHeader
          title="Remove vector store?"
          labelId="remove-vector-store-modal-title"
        />
        <ModalBody id="remove-vector-store-modal-body">
          Are you sure you want to remove <strong>{vectorStoreToRemove?.name}</strong> from Knowledge?
        </ModalBody>
        <ModalFooter>
          <Button
            variant="danger"
            onClick={() => {
              if (vectorStoreToRemove) {
                setVectorStores(stores =>
                  stores.map(s =>
                    s.id === vectorStoreToRemove.id ? { ...s, addedToKnowledge: false, selected: false } : s
                  )
                );
              }
              setVectorStoreToRemove(null);
            }}
          >
            Remove
          </Button>
          <Button
            variant="link"
            onClick={() => setVectorStoreToRemove(null)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* MCP Connection Success Modal */}
      <Modal
        variant={ModalVariant.medium}
        isOpen={isMcpConnectionModalOpen}
        onClose={() => setIsMcpConnectionModalOpen(false)}
        aria-labelledby="mcp-connection-modal-title"
      >
        <ModalHeader>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem><CheckCircleIcon color="var(--pf-v6-global--success-color--100)" /></FlexItem>
            <FlexItem><Title headingLevel="h2" id="mcp-connection-modal-title">Connection successful</Title></FlexItem>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <p>You are now connected to <strong>{selectedMcpServer?.name}-MCP-Server</strong>. You can use it directly in the playground chat.</p>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginTop: '1rem' }}>
            <FlexItem>{selectedMcpServer?.toolsCount} out of {selectedMcpServer?.totalTools} tools are active.</FlexItem>
            <FlexItem>
              <Button
                variant="link"
                icon={<PencilAltIcon />}
                onClick={() => {
                  setIsMcpConnectionModalOpen(false);
                  handleToolsClick(selectedMcpServer);
                }}
              >
                Edit tool selection
              </Button>
            </FlexItem>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsMcpConnectionModalOpen(false)}>Save</Button>
          <Button variant="link" onClick={() => handleMcpDisconnect(selectedMcpServer?.id)}>Disconnect</Button>
        </ModalFooter>
      </Modal>

      {/* MCP Tools Selection Modal */}
      <Modal
        variant={ModalVariant.large}
        isOpen={isMcpToolsModalOpen}
        onClose={() => setIsMcpToolsModalOpen(false)}
        aria-labelledby="mcp-tools-modal-title"
      >
        <ModalHeader title={`${selectedMcpServer?.name}-MCP-Server`} labelId="mcp-tools-modal-title" />
        <ModalBody>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '1rem' }}>
            <FlexItem>
              <SearchInput
                placeholder="Find by name"
                value={mcpToolsSearchValue}
                onChange={(_event, value) => {
                  setMcpToolsSearchValue(value);
                  setMcpToolsPage(1);
                }}
                onClear={() => {
                  setMcpToolsSearchValue('');
                  setMcpToolsPage(1);
                }}
              />
            </FlexItem>
            <FlexItem>
              {Object.values(mcpToolSelections).filter(Boolean).length} out of {kubernetesMcpTools.length} selected
            </FlexItem>
            <FlexItem>
              <Pagination
                itemCount={getFilteredTools().length}
                perPage={mcpToolsPerPage}
                page={mcpToolsPage}
                onSetPage={(_event, page) => setMcpToolsPage(page)}
                isCompact
                widgetId="mcp-tools-pagination"
              />
            </FlexItem>
          </Flex>

          <Table variant="compact" aria-label="MCP Tools">
            <Thead>
              <Tr>
                <Th width={10}>
                  <Checkbox
                    id="select-all-mcp-tools"
                    isChecked={
                      getFilteredTools().length > 0 &&
                      getFilteredTools().every(tool => mcpToolSelections[tool.name])
                    }
                    onChange={(_event, checked) => {
                      const newSelections = { ...mcpToolSelections };
                      getFilteredTools().forEach(tool => {
                        newSelections[tool.name] = checked;
                      });
                      setMcpToolSelections(newSelections);
                    }}
                    aria-label="Select all tools"
                  />
                </Th>
                <Th>Tool name</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {getPaginatedTools().map(tool => (
                <Tr key={tool.name}>
                  <Td>
                    <Checkbox
                      id={`tool-${tool.name}`}
                      isChecked={mcpToolSelections[tool.name] || false}
                      onChange={(_event, checked) => {
                        setMcpToolSelections({
                          ...mcpToolSelections,
                          [tool.name]: checked
                        });
                      }}
                      aria-label={`Select ${tool.name}`}
                    />
                  </Td>
                  <Td>{tool.name}</Td>
                  <Td>{tool.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleSaveMcpTools}>Save</Button>
          <Button variant="link" onClick={() => setIsMcpToolsModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { Playground };
