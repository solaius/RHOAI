import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
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
  ExpandableSection,
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
  Tab,
  Tabs,
  TabTitleText,
  TextArea,
  TextInput,
  Title,
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
  AngleDoubleLeftIcon,
  AngleDoubleRightIcon,
  AngleRightIcon,
  CheckCircleIcon,
  ColumnsIcon,
  CheckIcon,
  CodeIcon,
  CogIcon,
  CopyIcon,
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
  TimesIcon,
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
// Using ColumnsIcon for Chat Compare button (side-by-side comparison)
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
  
  // Build panel toggle state
  const [selectedBuildTab, setSelectedBuildTab] = useState('model');
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);

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
  const [isStreaming, setIsStreaming] = useState(true);
  
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

  // Compare mode state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isCompareConfirmModalOpen, setIsCompareConfirmModalOpen] = useState(false);
  const [activeSettingsPanel, setActiveSettingsPanel] = useState<1 | 2 | null>(null);

  // View code modal state
  const [isViewCodeModalOpen, setIsViewCodeModalOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [codeCopied2, setCodeCopied2] = useState(false);

  // Panel 1 compare mode dropdown state (separate from settings panel dropdown)
  const [isCompareModel1Open, setIsCompareModel1Open] = useState(false);

  // Panel 2 state (for compare mode)
  const [chatHistory2, setChatHistory2] = useState<any[]>([]);
  const [selectedModel2, setSelectedModel2] = useState('gpt-oss-20b');
  const [isCompareModel2Open, setIsCompareModel2Open] = useState(false);
  const [temperature2, setTemperature2] = useState(0.6);
  const [isStreaming2, setIsStreaming2] = useState(true);
  const [reasoningLevel2, setReasoningLevel2] = useState('default');
  const [systemPrompt2, setSystemPrompt2] = useState('');
  const [isModelSelectOpen2, setIsModelSelectOpen2] = useState(false);
  const [isReasoningLevelOpen2, setIsReasoningLevelOpen2] = useState(false);

  // Check if panel 2 model has reasoning capability
  const hasReasoning2 = modelsWithReasoning.includes(selectedModel2);

  // Track which message metrics are expanded (by message id)
  const [expandedMetrics, setExpandedMetrics] = useState<Record<string, boolean>>({});

  // Cumulative metrics for compare panels (time and TTFT are averaged, tokens are summed)
  const [panel1Metrics, setPanel1Metrics] = useState({ avgTime: 0, totalTokens: 0, avgTtft: 0, responseCount: 0 });
  const [panel2Metrics, setPanel2Metrics] = useState({ avgTime: 0, totalTokens: 0, avgTtft: 0, responseCount: 0 });

  // Thinking state for animated messages
  const [isPanel1Thinking, setIsPanel1Thinking] = useState(false);
  const [isPanel2Thinking, setIsPanel2Thinking] = useState(false);
  const [panel1ThinkingMessage, setPanel1ThinkingMessage] = useState('');
  const [panel2ThinkingMessage, setPanel2ThinkingMessage] = useState('');
  const [thinkingDots, setThinkingDots] = useState('');

  // Witty thinking messages
  const thinkingMessages = [
    "Consulting the digital oracle",
    "Teaching electrons to dance",
    "Rummaging through the knowledge vault",
    "Warming up the neural pathways",
    "Channeling artificial wisdom",
    "Performing computational gymnastics",
    "Asking the silicon spirits",
    "Brewing a fresh batch of tokens",
    "Polishing the response crystals",
    "Summoning the algorithm elves"
  ];

  // Animate the thinking dots
  React.useEffect(() => {
    if (isPanel1Thinking || isPanel2Thinking) {
      const interval = setInterval(() => {
        setThinkingDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 400);
      return () => clearInterval(interval);
    }
    setThinkingDots('');
    return undefined;
  }, [isPanel1Thinking, isPanel2Thinking]);

  // Llama Stack code snippet for View Code modal
  const llamaStackCodeSnippet = `# Llama Stack Quickstart Script
#
# README:
# This example shows how to configure an assistant using the Llama Stack client.
# Before using this code, make sure of the following:
#
# 1. Required Packages:
#    - Install the required dependencies using pip:
#      pip install llama-stack-client
#    - NOTE: Verify the correct llama-stack-client version for your Llama Stack server instance,
#      then install that version as needed.
#
# 2. Llama Stack Server:
#    - Your Llama Stack instance must be running and accessible
#    - Set the LLAMA_STACK_URL variable to the base URL of your Llama Stack server
#
# 3. Model Configuration:
#    - The selected model (e.g., "llama3.2:3b") must be available in your Llama Stack deployment.
#
# 4. Tools (MCP Integration):
#    - Any tools used must be properly pre-configured in your Llama Stack setup.

# Configuration adjust as needed:
LLAMA_STACK_URL = ""  # ← USER MUST SET: URL to their Llama Stack server
FILES_BASE_PATH = ""  # ← USER MUST SET: Path to uploaded files (if any)

# USER CONTEXT - Generated from playground state:
input_text = "How do I deploy a model in OpenShift AI?"  # ← USER'S PROMPT
model_name = "meta-llama/Meta-Llama-3.1-8B-Instruct"     # ← SELECTED MODEL
vector_store_name = "default_vector_store"                # ← VECTOR STORE (if RAG enabled)
temperature = 0.7                                         # ← MODEL PARAMETER
stream_enabled = True                                     # ← STREAMING SETTING
system_instructions = """You are a helpful AI assistant specialized in OpenShift AI and model deployment."""  # ← SYSTEM PROMPT

# Files uploaded by the user (if any):
files_to_upload = [
    { "file": "deployment-guide.pdf", "purpose": "assistants" },  # ← UPLOADED FILES
    { "file": "architecture.md", "purpose": "assistants" },
]

import os

from llama_stack_client import LlamaStackClient

client = LlamaStackClient(base_url=LLAMA_STACK_URL)

# Create vector store (only if RAG is enabled)
vector_store = client.vector_stores.create(
    name=vector_store_name,
    extra_body={
        "provider_id": "milvus",           # ← VECTOR DB PROVIDER
        "embedding_model": "all-minilm:l6-v2",  # ← EMBEDDING MODEL
        "embedding_dimension": 384         # ← EMBEDDING DIMENSION
    }
)

# Tools configuration (if RAG or MCP servers are enabled)
tools = [
    # RAG file_search tool (if files uploaded and RAG enabled)
    {
      "type": "file_search",
      "vector_store_ids": [
        vector_store.id
      ]
    },
    # MCP servers (if user selected any)
    {
      "type": "mcp",
      "server_label": "slack-mcp",                      # ← MCP SERVER LABEL
      "server_url": "http://127.0.0.1:13080/sse",       # ← MCP SERVER URL
      "authorization": "Bearer sk-xxxxxxxxxxxxx",        # ← AUTH TOKEN
      "allowed_tools": [                                 # ← SELECTED TOOLS (optional)
        "send_message",
        "get_channel_history"
      ]
    },
    {
      "type": "mcp",
      "server_label": "github-mcp",
      "server_url": "https://github-mcp.example.com/sse",
      "authorization": "token ghp_xxxxxxxxxxxxx"
      # No allowed_tools = all tools allowed
    },
]

# Upload files to vector store (if files were uploaded)
for file_info in files_to_upload:
    with open(os.path.join(FILES_BASE_PATH, file_info["file"]), 'rb') as file:
        uploaded_file = client.files.create(file=file, purpose=file_info["purpose"])
        client.vector_stores.files.create(
            vector_store_id=vector_store.id,
            file_id=uploaded_file.id
        )

# Final configuration sent to Llama Stack
config = {
    "input": input_text,
    "model": model_name,
    "temperature": temperature,
    "instructions": system_instructions,
    "stream": stream_enabled,
    "tools": tools
}

response = client.responses.create(**config)

print("agent>", response.output_text)`;

  // Copy code to clipboard handler
  const handleCopyCode = (code: string, panelNumber?: number) => {
    const markdownCode = '```python\n' + code + '\n```';
    navigator.clipboard.writeText(markdownCode).then(() => {
      if (panelNumber === 2) {
        setCodeCopied2(true);
        setTimeout(() => setCodeCopied2(false), 2000);
      } else {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      }
    });
  };

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

  // Handle start compare mode
  const handleStartCompare = () => {
    setChatHistory([]);
    setChatHistory2([]);
    setIsCompareConfirmModalOpen(false);
    setIsCompareMode(true);
    // Close the settings panel when entering compare mode
    setIsPanelExpanded(false);
    // Reset cumulative metrics
    setPanel1Metrics({ avgTime: 0, totalTokens: 0, avgTtft: 0, responseCount: 0 });
    setPanel2Metrics({ avgTime: 0, totalTokens: 0, avgTtft: 0, responseCount: 0 });
  };

  // Handle exit compare mode
  const handleExitCompare = () => {
    setIsCompareMode(false);
    setChatHistory2([]);
    setActiveSettingsPanel(null);
  };

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

  // Collapsed Panel Toggle Button - shown when panel is collapsed
  const CollapsedPanelToggle = (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: '16px',
        zIndex: 200
      }}
    >
      <Button
        variant="plain"
        onClick={() => setIsPanelExpanded(true)}
        aria-label="Expand settings panel"
        style={{
          padding: '12px 8px',
          borderRadius: '0 4px 4px 0',
          backgroundColor: '#ffffff',
          border: '1px solid var(--pf-v6-global--BorderColor--100)',
          borderLeft: 'none',
          boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.15)',
          color: 'var(--pf-v6-global--primary-color--100)'
        }}
      >
        <AngleDoubleRightIcon />
      </Button>
    </div>
  );

  // Build Panel using DrawerPanelContent
  const BuildPanelContent = (
    <DrawerPanelContent isResizable minSize="500px" defaultSize="550px" id="build-panel-drawer">
      {/* Header with Tabs and Chevron */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--pf-v6-global--BorderColor--100)',
          backgroundColor: 'var(--pf-v6-global--BackgroundColor--100)'
        }}
      >
        {/* Horizontal Tabs - no scroll arrows */}
        <Tabs
          activeKey={selectedBuildTab}
          onSelect={(_event, tabIndex) => setSelectedBuildTab(tabIndex as string)}
          id="build-panel-tabs"
          style={{ flex: 1, '--pf-v6-c-tabs--before--BorderBottomWidth': '0' } as React.CSSProperties}
        >
          <Tab eventKey="model" title={<TabTitleText>Model</TabTitleText>} />
          <Tab eventKey="prompt-lab" title={<TabTitleText>Prompt</TabTitleText>} />
          <Tab
            eventKey="knowledge"
            title={
              <TabTitleText>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Knowledge
                  {vectorStores.filter(s => s.selected).length > 0 && (
                    <Badge isRead>{vectorStores.filter(s => s.selected).length}</Badge>
                  )}
                </span>
              </TabTitleText>
            }
          />
          <Tab
            eventKey="mcp"
            title={
              <TabTitleText>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  MCP
                  {enabledMcpCount > 0 && (
                    <Badge isRead>{enabledMcpCount}</Badge>
                  )}
                </span>
              </TabTitleText>
            }
          />
          <Tab
            eventKey="guardrails"
            title={
              <TabTitleText>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Guardrails
                  <Label color={guardrailsEnabled ? 'green' : 'red'} isCompact>
                    {guardrailsEnabled ? 'On' : 'Off'}
                  </Label>
                </span>
              </TabTitleText>
            }
          />
        </Tabs>

        {/* Chevron toggle button - inside panel, next to slider */}
        <Button
          variant="plain"
          onClick={() => setIsPanelExpanded(false)}
          aria-label="Collapse settings panel"
          style={{
            padding: '8px',
            marginLeft: '4px',
            marginRight: '4px',
            color: 'var(--pf-v6-global--primary-color--100)'
          }}
        >
          <AngleDoubleLeftIcon />
        </Button>
      </div>

      {/* Tab Content */}
      <DrawerContentBody style={{ padding: '1rem', height: 'calc(100% - 48px)', overflow: 'auto' }}>
          {selectedBuildTab === 'model' && (
            (() => {
              // Determine which panel's state to use
              const isPanel2 = isCompareMode && activeSettingsPanel === 2;
              const currentModel = isPanel2 ? selectedModel2 : selectedModel;
              const setCurrentModel = isPanel2 ? setSelectedModel2 : setSelectedModel;
              const currentModelSelectOpen = isPanel2 ? isModelSelectOpen2 : isModelSelectOpen;
              const setCurrentModelSelectOpen = isPanel2 ? setIsModelSelectOpen2 : setIsModelSelectOpen;
              const currentHasReasoning = isPanel2 ? hasReasoning2 : hasReasoning;
              const currentReasoningLevel = isPanel2 ? reasoningLevel2 : reasoningLevel;
              const setCurrentReasoningLevel = isPanel2 ? setReasoningLevel2 : setReasoningLevel;
              const currentReasoningLevelOpen = isPanel2 ? isReasoningLevelOpen2 : isReasoningLevelOpen;
              const setCurrentReasoningLevelOpen = isPanel2 ? setIsReasoningLevelOpen2 : setIsReasoningLevelOpen;
              const currentTemperature = isPanel2 ? temperature2 : temperature;
              const setCurrentTemperature = isPanel2 ? setTemperature2 : setTemperature;
              const currentStreaming = isPanel2 ? isStreaming2 : isStreaming;
              const setCurrentStreaming = isPanel2 ? setIsStreaming2 : setIsStreaming;

              return (
            <>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                {isCompareMode ? `Model ${activeSettingsPanel || 1} Settings` : 'Model'}
              </Title>

              <FormGroup fieldId="model-select-form">
                <Select
                  id="model-select"
                  isOpen={currentModelSelectOpen}
                  selected={currentModel}
                  onSelect={(_event, value) => {
                    setCurrentModel(value as string);
                    setCurrentModelSelectOpen(false);
                  }}
                  onOpenChange={(isOpen) => setCurrentModelSelectOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setCurrentModelSelectOpen(!currentModelSelectOpen)}
                      isExpanded={currentModelSelectOpen}
                      id="model-select-toggle"
                      style={{ width: '100%', maxWidth: '350px' }}
                    >
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          {currentModel === '' ? 'Choose a model' :
                           currentModel === 'gpt-oss-20b' ? 'gpt-oss-20b' :
                           currentModel === 'gpt-oss-120b' ? 'gpt-oss-120b' :
                           currentModel === 'qwen3-14b' ? 'Qwen3-14B' :
                           currentModel === 'llama-3.2-11b' ? 'llama-3.2-11b' :
                           currentModel === 'granite-4.0-h-small' ? 'granite-4.0-h-small' :
                           currentModel === 'ministral-3-8b' ? 'Ministral-3-8B' : 'Choose a model'}
                        </FlexItem>
                        {currentHasReasoning && (
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
              {currentHasReasoning && (
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
                    isOpen={currentReasoningLevelOpen}
                    selected={currentReasoningLevel}
                    onSelect={(_event, value) => {
                      setCurrentReasoningLevel(value as string);
                      setCurrentReasoningLevelOpen(false);
                    }}
                    onOpenChange={(isOpen) => setCurrentReasoningLevelOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setCurrentReasoningLevelOpen(!currentReasoningLevelOpen)}
                        isExpanded={currentReasoningLevelOpen}
                        id="reasoning-level-toggle"
                        style={{ width: '100%', maxWidth: '350px' }}
                      >
                        {currentReasoningLevel === 'default' ? 'Default' :
                         currentReasoningLevel === 'low' ? 'Low' :
                         currentReasoningLevel === 'medium' ? 'Medium' :
                         currentReasoningLevel === 'high' ? 'High' : 'Select level'}
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
                    value={currentTemperature}
                    onChange={(_event, value) => setCurrentTemperature(value)}
                    min={0}
                    max={2}
                    step={0.1}
                    isInputVisible
                    inputValue={currentTemperature}
                    showBoundaries={false}
                  />
                </div>
              </FormGroup>

              <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginTop: '1.5rem' }}>
                <FlexItem>
                  <Switch
                    id="streaming-toggle"
                    label="Streaming"
                    isChecked={currentStreaming}
                    onChange={(_event, checked) => setCurrentStreaming(checked)}
                  />
                </FlexItem>
              </Flex>
            </>
              );
            })()
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
    <div style={{ height: '100%', backgroundColor: '#ffffff' }}>
      <Chatbot displayMode={ChatbotDisplayMode.embedded} className="pf-chatbot-white-bg">
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
            padding: '1rem',
            backgroundColor: '#ffffff'
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

  // Compare mode message handler
  const handleCompareSendMessage = (message: string | number) => {
    const userAvatar = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#d2d2d2"/><circle cx="18" cy="14" r="6" fill="#8a8d90"/><path d="M6 32c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#8a8d90"/></svg>')}`;
    const timestamp = new Date().toLocaleTimeString();
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      name: 'User',
      avatar: userAvatar,
      timestamp
    };

    // Add to both panels
    setChatHistory(prev => [...prev, userMsg]);
    setChatHistory2(prev => [...prev, userMsg]);
    setInputValue('');

    // Start thinking animation with random witty messages
    setIsPanel1Thinking(true);
    setIsPanel2Thinking(true);
    setPanel1ThinkingMessage(thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]);
    setPanel2ThinkingMessage(thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]);

    // Generate random metrics for panel 1
    const time1 = (Math.random() * 30 + 20).toFixed(2); // 20-50 seconds
    const tokens1 = Math.floor(Math.random() * 200 + 150); // 150-350 tokens
    const ttft1 = Math.floor(Math.random() * 150 + 100); // 100-250 ms

    // Simulate bot response for panel 1 (increased delay by 1 second)
    setTimeout(() => {
      const botMsg1 = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `Response from ${selectedModel}: This is a simulated response from the first model. The response demonstrates how different models handle the same prompt with varying performance characteristics.`,
        name: selectedModel,
        avatar: `data:image/svg+xml,${encodeURIComponent(ChatbotIcon)}`,
        timestamp: new Date().toLocaleTimeString(),
        metrics: { time: `${time1} s`, tokens: tokens1, ttft: `${ttft1}ms` }
      };
      setChatHistory(prev => [...prev, botMsg1]);
      setIsPanel1Thinking(false);

      // Update cumulative metrics for panel 1 (time and TTFT averaged, tokens summed)
      setPanel1Metrics(prev => {
        const newCount = prev.responseCount + 1;
        const newAvgTime = ((prev.avgTime * prev.responseCount) + parseFloat(time1)) / newCount;
        const newTotalTokens = prev.totalTokens + tokens1;
        const newAvgTtft = ((prev.avgTtft * prev.responseCount) + ttft1) / newCount;
        return {
          avgTime: newAvgTime,
          totalTokens: newTotalTokens,
          avgTtft: newAvgTtft,
          responseCount: newCount
        };
      });
    }, 2000);

    // Generate random metrics for panel 2
    const time2 = (Math.random() * 30 + 15).toFixed(2); // 15-45 seconds
    const tokens2 = Math.floor(Math.random() * 180 + 120); // 120-300 tokens
    const ttft2 = Math.floor(Math.random() * 120 + 80); // 80-200 ms

    // Simulate bot response for panel 2 (increased delay by 1 second)
    setTimeout(() => {
      const botMsg2 = {
        id: (Date.now() + 2).toString(),
        role: 'bot',
        content: `Response from ${selectedModel2}: This is a simulated response from the second model. Each model may produce different outputs and performance metrics for comparison.`,
        name: selectedModel2,
        avatar: `data:image/svg+xml,${encodeURIComponent(ChatbotIcon)}`,
        timestamp: new Date().toLocaleTimeString(),
        metrics: { time: `${time2} s`, tokens: tokens2, ttft: `${ttft2}ms` }
      };
      setChatHistory2(prev => [...prev, botMsg2]);
      setIsPanel2Thinking(false);

      // Update cumulative metrics for panel 2 (time and TTFT averaged, tokens summed)
      setPanel2Metrics(prev => {
        const newCount = prev.responseCount + 1;
        const newAvgTime = ((prev.avgTime * prev.responseCount) + parseFloat(time2)) / newCount;
        const newTotalTokens = prev.totalTokens + tokens2;
        const newAvgTtft = ((prev.avgTtft * prev.responseCount) + ttft2) / newCount;
        return {
          avgTime: newAvgTime,
          totalTokens: newTotalTokens,
          avgTtft: newAvgTtft,
          responseCount: newCount
        };
      });
    }, 2200);
  };

  // Compare Panel Component
  const ComparePanel = ({
    panelNumber,
    history,
    model,
    isModelOpen,
    setModelOpen,
    onModelChange,
    onToggleSettings,
    onClose
  }: {
    panelNumber: number;
    history: any[];
    model: string;
    isModelOpen: boolean;
    setModelOpen: (open: boolean) => void;
    onModelChange: (model: string) => void;
    onToggleSettings: () => void;
    onClose: () => void;
  }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      {/* Panel Header */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--pf-v6-global--BorderColor--100)' }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem style={{ fontWeight: 600 }}>Model {panelNumber}</FlexItem>
              <FlexItem>
                <Select
                  isOpen={isModelOpen}
                  selected={model}
                  onSelect={(_event, value) => {
                    onModelChange(value as string);
                    setModelOpen(false);
                  }}
                  onOpenChange={setModelOpen}
                  popperProps={{ appendTo: 'inline' }}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setModelOpen(!isModelOpen)}
                      isExpanded={isModelOpen}
                      isFullWidth
                      style={{ minWidth: '160px' }}
                    >
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          {model === 'gpt-oss-20b' ? 'gpt-oss-20b' :
                           model === 'gpt-oss-120b' ? 'gpt-oss-120b' :
                           model === 'qwen3-14b' ? 'Qwen3-14B' :
                           model === 'llama-3.2-11b' ? 'llama-3.2-11b' :
                           model === 'granite-4.0-h-small' ? 'granite-4.0-h-small' :
                           model === 'ministral-3-8b' ? 'Ministral-3-8B' : model}
                        </FlexItem>
                        {modelsWithReasoning.includes(model) && (
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
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button variant="plain" onClick={onToggleSettings} aria-label="Settings">
                  <CogIcon />
                </Button>
              </FlexItem>
              <FlexItem>
                <Button variant="plain" onClick={onClose} aria-label="Close panel">
                  <TimesIcon />
                </Button>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
        {/* Metrics row */}
        <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginTop: '0.5rem' }}>
          <Label isCompact variant="outline">53.24 s</Label>
          <Label isCompact variant="outline">T: 244</Label>
          <Label isCompact variant="outline">TTFT: 200ms</Label>
        </Flex>
      </div>
      {/* Chat Body */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Chatbot displayMode={ChatbotDisplayMode.embedded} className="pf-chatbot-white-bg">
          <ChatbotContent>
            <MessageBox>
              {history.length === 0 ? (
                <ChatbotWelcomePrompt
                  title="Hello!"
                  description="Send a message to compare models"
                />
              ) : (
                history.map((msg) => (
                  <Message key={msg.id} {...msg} />
                ))
              )}
            </MessageBox>
          </ChatbotContent>
        </Chatbot>
      </div>
    </div>
  );

  // Helper to render model select for compare panels
  const renderCompareModelSelect = (
    panelNumber: number,
    model: string,
    isOpen: boolean,
    setOpen: (open: boolean) => void,
    onChange: (model: string) => void
  ) => (
    <Select
      isOpen={isOpen}
      selected={model}
      onSelect={(_event, value) => {
        onChange(value as string);
        setOpen(false);
      }}
      onOpenChange={setOpen}
      popperProps={{ appendTo: 'inline' }}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setOpen(!isOpen)}
          isExpanded={isOpen}
          isFullWidth
          style={{ minWidth: '160px' }}
        >
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>{model}</FlexItem>
            {modelsWithReasoning.includes(model) && (
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
  );

  // Helper to render message with expandable metrics
  const renderMessageWithMetrics = (msg: any) => {
    if (msg.role === 'bot' && msg.metrics) {
      const isExpanded = expandedMetrics[msg.id] || false;
      return (
        <div key={msg.id}>
          <Message {...msg} />
          <div style={{ marginLeft: '3.5rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            <ExpandableSection
              toggleText={isExpanded ? 'Hide metrics' : 'Show metrics'}
              onToggle={() => setExpandedMetrics(prev => ({ ...prev, [msg.id]: !isExpanded }))}
              isExpanded={isExpanded}
              isIndented
            >
              <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginTop: '0.5rem' }}>
                <Label isCompact variant="outline">{msg.metrics.time}</Label>
                <Label isCompact variant="outline">Tokens: {msg.metrics.tokens}</Label>
                <Label isCompact variant="outline">TTFT: {msg.metrics.ttft}</Label>
              </Flex>
            </ExpandableSection>
          </div>
        </div>
      );
    }
    return <Message key={msg.id} {...msg} />;
  };

  // Handler for gear icon clicks - toggle between panels
  const handlePanel1GearClick = () => {
    if (activeSettingsPanel === 1 && isPanelExpanded) {
      // Already showing panel 1 settings, collapse
      setIsPanelExpanded(false);
    } else {
      // Show panel 1 settings
      setActiveSettingsPanel(1);
      setIsPanelExpanded(true);
    }
  };

  const handlePanel2GearClick = () => {
    if (activeSettingsPanel === 2 && isPanelExpanded) {
      // Already showing panel 2 settings, collapse
      setIsPanelExpanded(false);
    } else {
      // Show panel 2 settings
      setActiveSettingsPanel(2);
      setIsPanelExpanded(true);
    }
  };

  // Compare Layout - two side-by-side panels with shared input
  const CompareLayout = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Two chat panels side by side with vertical divider */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Panel 1 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>
          <div style={{ padding: '0.75rem 1rem 1rem 1rem', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem style={{ fontWeight: 600 }}>Model 1</FlexItem>
                  <FlexItem>
                    {renderCompareModelSelect(1, selectedModel, isCompareModel1Open, setIsCompareModel1Open, setSelectedModel)}
                  </FlexItem>
                </Flex>
              </FlexItem>
              <FlexItem>
                <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>
                    <Button variant="plain" onClick={handlePanel1GearClick} aria-label="Settings">
                      <CogIcon />
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="plain" onClick={handleExitCompare} aria-label="Close panel">
                      <TimesIcon />
                    </Button>
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
            {/* Show thinking animation or metrics */}
            {isPanel1Thinking ? (
              <div style={{ marginTop: '0.5rem', color: 'var(--pf-v6-global--Color--200)', fontStyle: 'italic' }}>
                <span style={{ marginRight: '0.25rem' }}>*</span>
                <span>{panel1ThinkingMessage}{thinkingDots}</span>
              </div>
            ) : panel1Metrics.responseCount > 0 && (
              <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginTop: '0.5rem' }}>
                <Label isCompact variant="outline">{panel1Metrics.avgTime.toFixed(2)} s</Label>
                <Label isCompact variant="outline">T: {panel1Metrics.totalTokens}</Label>
                <Label isCompact variant="outline">TTFT: {Math.round(panel1Metrics.avgTtft)}ms</Label>
              </Flex>
            )}
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <Chatbot displayMode={ChatbotDisplayMode.embedded} className="pf-chatbot-white-bg">
              <ChatbotContent>
                <MessageBox>
                  {chatHistory.length === 0 ? (
                    <ChatbotWelcomePrompt title="Hello!" description="Send a message to compare models" />
                  ) : (
                    chatHistory.map((msg) => renderMessageWithMetrics(msg))
                  )}
                </MessageBox>
              </ChatbotContent>
            </Chatbot>
          </div>
        </div>

        <Divider orientation={{ default: 'vertical' }} style={{ margin: '0 0.5rem' }} />

        {/* Panel 2 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>
          <div style={{ padding: '0.75rem 1rem 1rem 1rem', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem style={{ fontWeight: 600 }}>Model 2</FlexItem>
                  <FlexItem>
                    {renderCompareModelSelect(2, selectedModel2, isCompareModel2Open, setIsCompareModel2Open, setSelectedModel2)}
                  </FlexItem>
                </Flex>
              </FlexItem>
              <FlexItem>
                <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>
                    <Button variant="plain" onClick={handlePanel2GearClick} aria-label="Settings">
                      <CogIcon />
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="plain" onClick={handleExitCompare} aria-label="Close panel">
                      <TimesIcon />
                    </Button>
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
            {/* Show thinking animation or metrics */}
            {isPanel2Thinking ? (
              <div style={{ marginTop: '0.5rem', color: 'var(--pf-v6-global--Color--200)', fontStyle: 'italic' }}>
                <span style={{ marginRight: '0.25rem' }}>*</span>
                <span>{panel2ThinkingMessage}{thinkingDots}</span>
              </div>
            ) : panel2Metrics.responseCount > 0 && (
              <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginTop: '0.5rem' }}>
                <Label isCompact variant="outline">{panel2Metrics.avgTime.toFixed(2)} s</Label>
                <Label isCompact variant="outline">T: {panel2Metrics.totalTokens}</Label>
                <Label isCompact variant="outline">TTFT: {Math.round(panel2Metrics.avgTtft)}ms</Label>
              </Flex>
            )}
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <Chatbot displayMode={ChatbotDisplayMode.embedded} className="pf-chatbot-white-bg">
              <ChatbotContent>
                <MessageBox>
                  {chatHistory2.length === 0 ? (
                    <ChatbotWelcomePrompt title="Hello!" description="Send a message to compare models" />
                  ) : (
                    chatHistory2.map((msg) => renderMessageWithMetrics(msg))
                  )}
                </MessageBox>
              </ChatbotContent>
            </Chatbot>
          </div>
        </div>
      </div>

      {/* Shared message input - footer pinned to bottom */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid var(--pf-t--global--border--color--default)',
        paddingTop: '1rem',
        backgroundColor: '#ffffff'
      }}>
        <div className="pf-chatbot-white-bg" style={{ padding: '0 1rem' }}>
          <MessageBar
            value={inputValue}
            onSendMessage={handleCompareSendMessage}
            onChange={(_event, value) => setInputValue(String(value))}
            hasAttachButton={false}
            hasMicrophoneButton
          />
        </div>
        <div style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--pf-v6-global--Color--200)', fontSize: '0.875rem' }}>
          Bot uses AI. Check for mistakes. <InfoCircleIcon style={{ marginLeft: '0.25rem' }} />
        </div>
      </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', width: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Collapsed state toggle button - only show when not in compare mode */}
      {!isPanelExpanded && !isCompareMode && CollapsedPanelToggle}

      {/* Main Content - Config Panel (overlay) + Chat or Compare Layout */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Drawer isExpanded={isPanelExpanded} position="left" style={{ height: '100%' }}>
          <DrawerContent panelContent={BuildPanelContent}>
            <DrawerContentBody style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, minWidth: 0, minHeight: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                {isCompareMode ? CompareLayout : ChatPanel}
              </div>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );

  return (
    <div className="playground-page" style={{ height: '100%', overflow: 'hidden' }}>
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
              {!isCompareMode && (
                <Button
                  variant="link"
                  id="chat-compare-button"
                  icon={<ColumnsIcon />}
                  onClick={() => setIsCompareConfirmModalOpen(true)}
                >
                  Compare
                </Button>
              )}
              <Button variant="link" id="clear-chat-button">
                Clear chat
              </Button>
              <Button variant="primary" icon={<CodeIcon />} id="view-code-button" onClick={() => setIsViewCodeModalOpen(true)}>
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

      <PageSection padding={{ default: 'noPadding' }} isFilled style={{ overflow: 'hidden' }}>
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

      {/* Chat Compare Confirmation Modal */}
      <Modal
        variant="small"
        isOpen={isCompareConfirmModalOpen}
        onClose={() => setIsCompareConfirmModalOpen(false)}
        aria-labelledby="compare-confirm-modal-title"
        aria-describedby="compare-confirm-modal-body"
      >
        <ModalHeader title="Start Chat Compare?" labelId="compare-confirm-modal-title" />
        <ModalBody id="compare-confirm-modal-body">
          <p>The current chat session will be erased. Would you like to continue?</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleStartCompare}>Continue</Button>
          <Button variant="link" onClick={() => setIsCompareConfirmModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* View Code Modal */}
      <Modal
        variant={isCompareMode ? 'large' : 'medium'}
        isOpen={isViewCodeModalOpen}
        onClose={() => {
          setIsViewCodeModalOpen(false);
          setCodeCopied(false);
          setCodeCopied2(false);
        }}
        aria-labelledby="view-code-modal-title"
        aria-describedby="view-code-modal-body"
      >
        <ModalHeader title={isCompareMode ? 'View Code - Compare Mode' : 'View Code'} labelId="view-code-modal-title" />
        <ModalBody id="view-code-modal-body">
          {isCompareMode ? (
            // Compare mode: Two side-by-side code blocks
            <Flex gap={{ default: 'gapMd' }} style={{ height: '500px' }}>
              {/* Model 1 Code */}
              <FlexItem flex={{ default: 'flex_1' }} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '0.5rem' }}>
                  <FlexItem>
                    <Title headingLevel="h4" size="md">Model 1: {selectedModel}</Title>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      variant="plain"
                      onClick={() => handleCopyCode(llamaStackCodeSnippet, 1)}
                      aria-label="Copy Model 1 code"
                    >
                      {codeCopied ? <CheckIcon style={{ color: 'var(--pf-v6-global--success-color--100)' }} /> : <CopyIcon />}
                    </Button>
                  </FlexItem>
                </Flex>
                <div style={{
                  flex: 1,
                  overflow: 'auto',
                  backgroundColor: '#212427',
                  borderRadius: '6px',
                  padding: '1rem'
                }}>
                  <pre style={{
                    margin: 0,
                    fontFamily: 'var(--pf-v6-global--FontFamily--monospace)',
                    fontSize: '0.75rem',
                    lineHeight: '1.5',
                    color: '#f0f0f0',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    <code>{llamaStackCodeSnippet}</code>
                  </pre>
                </div>
              </FlexItem>

              {/* Model 2 Code */}
              <FlexItem flex={{ default: 'flex_1' }} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '0.5rem' }}>
                  <FlexItem>
                    <Title headingLevel="h4" size="md">Model 2: {selectedModel2}</Title>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      variant="plain"
                      onClick={() => handleCopyCode(llamaStackCodeSnippet, 2)}
                      aria-label="Copy Model 2 code"
                    >
                      {codeCopied2 ? <CheckIcon style={{ color: 'var(--pf-v6-global--success-color--100)' }} /> : <CopyIcon />}
                    </Button>
                  </FlexItem>
                </Flex>
                <div style={{
                  flex: 1,
                  overflow: 'auto',
                  backgroundColor: '#212427',
                  borderRadius: '6px',
                  padding: '1rem'
                }}>
                  <pre style={{
                    margin: 0,
                    fontFamily: 'var(--pf-v6-global--FontFamily--monospace)',
                    fontSize: '0.75rem',
                    lineHeight: '1.5',
                    color: '#f0f0f0',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    <code>{llamaStackCodeSnippet}</code>
                  </pre>
                </div>
              </FlexItem>
            </Flex>
          ) : (
            // Single chat mode: One code block
            <>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '0.5rem' }}>
                <FlexItem>
                  <Title headingLevel="h4" size="md">OpenAI Response API Configuration</Title>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant="plain"
                    onClick={() => handleCopyCode(llamaStackCodeSnippet)}
                    aria-label="Copy code"
                  >
                    {codeCopied ? <CheckIcon style={{ color: 'var(--pf-v6-global--success-color--100)' }} /> : <CopyIcon />}
                  </Button>
                </FlexItem>
              </Flex>
              <div style={{
                maxHeight: '500px',
                overflow: 'auto',
                backgroundColor: '#212427',
                borderRadius: '6px',
                padding: '1rem'
              }}>
                <pre style={{
                  margin: 0,
                  fontFamily: 'var(--pf-v6-global--FontFamily--monospace)',
                  fontSize: '0.75rem',
                  lineHeight: '1.5',
                  color: '#f0f0f0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  <code>{llamaStackCodeSnippet}</code>
                </pre>
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsViewCodeModalOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export { Playground };
