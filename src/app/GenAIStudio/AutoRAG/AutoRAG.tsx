import * as React from 'react';
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  Divider,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  FileUpload,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormHelperText,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  Label,
  LabelGroup,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  MultipleFileUpload,
  MultipleFileUploadMain,
  MultipleFileUploadStatus,
  MultipleFileUploadStatusItem,
  PageSection,
  Radio,
  Select,
  SelectList,
  SelectOption,
  Tab,
  Tabs,
  TabTitleText,
  TextArea,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import {
  CogIcon,
  FolderOpenIcon,
  OutlinedFolderIcon,
  PencilAltIcon,
  PlusIcon,
  DownloadIcon,
  CopyIcon,
  CheckCircleIcon,
  SyncIcon,
} from '@patternfly/react-icons';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';
import PipelineVisualization from '@app/assets/Gemini_Generated_Image_w6e0x1w6e0x1w6e0.png';
import { AutoRAGIcon } from '@app/Home/icons/AutoRAGIcon';

interface Document {
  id: string;
  name: string;
  type: string;
  uploaded: Date;
  sourceType: 'document' | 'connection';
}

interface Connection {
  id: string;
  name: string;
  type: string; // e.g., 'S3 Bucket', 'COS', etc.
  bucketName?: string;
  endpoint?: string;
  region?: string;
  createdAt: Date;
}

interface Model {
  id: string;
  name: string;
  description: string;
  tag: string;
}

interface PatternResult {
  id: string;
  rank: number;
  patternName: string;
  modelName: string;
  answerFaithfulness: number;
  chunkMethod: string;
  chunkSize: number;
  status: 'Complete' | 'In Progress';
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: 'incomplete' | 'completed' | 'Processing' | 'failed';
  createdAt: Date;
  lastSaved: Date;
  hasDocuments: boolean;
  hasConfigurations: boolean;
  isRunning: boolean;
}

const AutoRAG: React.FunctionComponent = () => {
  const { flags, selectedProject, setSelectedProject } = useFeatureFlags();
  const [isProjectSelectOpen, setIsProjectSelectOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [experimentCreated, setExperimentCreated] = React.useState(false);
  const [experimentName, setExperimentName] = React.useState('');
  const [experimentLastSaved, setExperimentLastSaved] = React.useState<Date | null>(null);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [tagInput, setTagInput] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [hasAddedDocuments, setHasAddedDocuments] = React.useState(false);
  const [isConfiguring, setIsConfiguring] = React.useState(false);
  const [vectorDatabase, setVectorDatabase] = React.useState('Milvus (in line)');
  const [selectedFoundationModels, setSelectedFoundationModels] = React.useState<Set<string>>(new Set(['1', '2', '3']));
  const [selectedEmbeddingModels, setSelectedEmbeddingModels] = React.useState<Set<string>>(new Set(['1']));
  const [selectAllFoundation, setSelectAllFoundation] = React.useState(false);
  const [selectAllEmbedding, setSelectAllEmbedding] = React.useState(false);
  const [criteria, setCriteria] = React.useState<string>('answer faithfulness');
  const [isVectorDbOpen, setIsVectorDbOpen] = React.useState(false);
  const [experimentRunning, setExperimentRunning] = React.useState(false);
  const [experimentCompleted, setExperimentCompleted] = React.useState(false);
  const [patternResults, setPatternResults] = React.useState<PatternResult[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('rank');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [activeModelTabKey, setActiveModelTabKey] = React.useState<string | number>(0);
  const [isEvaluationSettingsModalOpen, setIsEvaluationSettingsModalOpen] = React.useState(false);
  const [initialFoundationModels, setInitialFoundationModels] = React.useState<Set<string>>(new Set(['1', '2', '3']));
  const [initialEmbeddingModels, setInitialEmbeddingModels] = React.useState<Set<string>>(new Set(['1']));
  const [initialCriteria, setInitialCriteria] = React.useState<string>('answer faithfulness');
  const [evaluationSources, setEvaluationSources] = React.useState<Document[]>([]);
  const [activeSourcesTabKey, setActiveSourcesTabKey] = React.useState<string | number>(0);
  const [isEvaluationSourceModalOpen, setIsEvaluationSourceModalOpen] = React.useState(false);
  const [evaluationSourceFile, setEvaluationSourceFile] = React.useState<File | null>(null);
  const [evaluationSourceFilename, setEvaluationSourceFilename] = React.useState('');
  const [isEvaluationSourceUploading, setIsEvaluationSourceUploading] = React.useState(false);
  const [experiments, setExperiments] = React.useState<Experiment[]>([]);
  const [selectedExperimentId, setSelectedExperimentId] = React.useState<string | null>(null);
  const [connections, setConnections] = React.useState<Connection[]>([]);
  const [isAddConnectionModalOpen, setIsAddConnectionModalOpen] = React.useState(false);
  const [connectionName, setConnectionName] = React.useState('');
  const [connectionType, setConnectionType] = React.useState('');
  const [isConnectionTypeOpen, setIsConnectionTypeOpen] = React.useState(false);
  const [bucketName, setBucketName] = React.useState('');
  const [endpoint, setEndpoint] = React.useState('');
  const [region, setRegion] = React.useState('');
  const [uploadingFiles, setUploadingFiles] = React.useState<File[]>([]);

  // Mock data for models
  const foundationModels: Model[] = [
    { id: '1', name: 'gpt-oss-120b', description: 'Large language model for general purpose tasks', tag: 'LLM' },
    { id: '2', name: 'llama-4-ma', description: 'Efficient language model for text generation', tag: 'LLM' },
    { id: '3', name: 'llama-3-3-70b', description: 'Fast and efficient conversational AI model', tag: 'LLM' },
  ];

  const embeddingModels: Model[] = [
    { id: '1', name: 'text-embedding-ada-002', description: 'OpenAI embedding model', tag: 'Embedding' },
    { id: '2', name: 'sentence-transformers', description: 'Sentence transformer model', tag: 'Embedding' },
  ];

  const handleCreateExperiment = () => {
    setIsCreating(true);
    setName('');
    setDescription('');
    setTagInput('');
    setTags([]);
    setErrors({});
  };

  const handleCancel = () => {
    setIsCreating(false);
    setExperimentCreated(false);
    setIsConfiguring(false);
    setExperimentCompleted(false);
    setExperimentRunning(false);
    setSelectedExperimentId(null);
    setName('');
    setDescription('');
    setTagInput('');
    setTags([]);
    setErrors({});
    setDocuments([]);
    setHasAddedDocuments(false);
    setEvaluationSourceFile(null);
    setEvaluationSourceFilename('');
    setVectorDatabase('Milvus (in line)');
    setSelectedFoundationModels(new Set(['1']));
    setSelectedEmbeddingModels(new Set(['1']));
    setCriteria('answer faithfulness');
    setPatternResults([]);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setTagInput(value);
    // Add tag when comma is entered
    if (value.includes(',')) {
      const parts = value.split(',').map((p) => p.trim()).filter((p) => p);
      const newTags = parts.filter((tag) => !tags.includes(tag));
      if (newTags.length > 0) {
        setTags([...tags, ...newTags]);
      }
      setTagInput('');
    }
  };

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Create experiment and move directly to configuration screen
      const now = new Date();
      const experimentId = Date.now().toString();
      const newExperiment: Experiment = {
        id: experimentId,
        name: name.trim(),
        description: description.trim(),
        tags: tags,
        status: 'incomplete',
        createdAt: now,
        lastSaved: now,
        hasDocuments: false,
        hasConfigurations: false,
        isRunning: false,
      };
      
      // Save experiment to list
      setExperiments([...experiments, newExperiment]);
      setSelectedExperimentId(experimentId);
      setExperimentName(name.trim());
      setExperimentLastSaved(now);
      setExperimentCreated(true);
      setIsConfiguring(true);
      setIsCreating(false);
      // TODO: Implement actual experiment creation API call
      console.log('Creating experiment:', { name, description, tags });
    }
  };

  const formatLastSaved = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const handleFileRemove = (fileId: string) => {
    setDocuments(documents.filter(doc => doc.id !== fileId));
    // Also remove from connections if it's a connection
    setConnections(connections.filter(conn => conn.id !== fileId));
    if (documents.length === 1) {
      setHasAddedDocuments(false);
    }
  };

  const handleFileDrop = (_event: unknown, droppedFiles: File[]) => {
    // Add files to uploading state
    setUploadingFiles([...uploadingFiles, ...droppedFiles]);
    
    // Simulate upload process, then add to documents
    droppedFiles.forEach((file) => {
      setTimeout(() => {
        const newDocument: Document = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + file.name,
          name: file.name,
          type: file.type || file.name.split('.').pop()?.toUpperCase() || 'Unknown',
          uploaded: new Date(),
          sourceType: 'document' as const,
        };
        setDocuments(prevDocs => [...prevDocs, newDocument]);
        setUploadingFiles(prevFiles => prevFiles.filter(f => f !== file));
        setHasAddedDocuments(true);
      }, 500);
    });
  };

  const handleAddConnection = () => {
    setIsAddConnectionModalOpen(true);
  };

  const handleConnectionSubmit = () => {
    if (connectionName.trim() && connectionType.trim()) {
      const newConnection: Connection = {
        id: Date.now().toString(),
        name: connectionName.trim(),
        type: connectionType.trim(),
        bucketName: bucketName.trim() || undefined,
        endpoint: endpoint.trim() || undefined,
        region: region.trim() || undefined,
        createdAt: new Date(),
      };
      setConnections([...connections, newConnection]);
      
      // Also add to documents list for display
      const connectionDocument: Document = {
        id: newConnection.id,
        name: newConnection.name,
        type: newConnection.type,
        uploaded: newConnection.createdAt,
        sourceType: 'connection' as const,
      };
      setDocuments([...documents, connectionDocument]);
      setHasAddedDocuments(true);
      
      // Reset form
      setConnectionName('');
      setConnectionType('');
      setBucketName('');
      setEndpoint('');
      setRegion('');
      setIsAddConnectionModalOpen(false);
    }
  };

  const handleConnectionModalClose = () => {
    setConnectionName('');
    setConnectionType('');
    setIsConnectionTypeOpen(false);
    setBucketName('');
    setEndpoint('');
    setRegion('');
    setIsAddConnectionModalOpen(false);
  };

  const handleDeleteEvaluationSource = (sourceId: string) => {
    setEvaluationSources(evaluationSources.filter(source => source.id !== sourceId));
  };

  const handleUploadDocument = () => {
    // TODO: Implement document upload
    console.log('Upload document clicked');
  };


  const handleAddDocuments = () => {
    // Move to configuration screen
    setIsConfiguring(true);
  };

  const handleRunExperiment = () => {
    // TODO: Implement experiment run
    console.log('Run experiment clicked', {
      vectorDatabase,
      evaluationSourceFile: evaluationSourceFile?.name || null,
      foundationModels: Array.from(selectedFoundationModels),
      embeddingModels: Array.from(selectedEmbeddingModels),
      criteria: criteria,
    });
    
    // Update experiment status to Processing
    if (selectedExperimentId) {
      setExperiments(prevExperiments => prevExperiments.map(exp => {
        if (exp.id === selectedExperimentId) {
          return { ...exp, status: 'Processing', isRunning: true };
        }
        return exp;
      }));
    }
    
    // Simulate experiment running and completion
    setExperimentRunning(true);
    setIsConfiguring(false);
    
    // Mock results data
    const mockResults: PatternResult[] = [
      {
        id: '1',
        rank: 1,
        patternName: 'Pattern 1',
        modelName: 'llama-4-ma',
        answerFaithfulness: 0.95,
        chunkMethod: 'Semantic',
        chunkSize: 512,
        status: 'Complete',
      },
      {
        id: '2',
        rank: 2,
        patternName: 'Pattern 2',
        modelName: 'gpt-oss-120b',
        answerFaithfulness: 0.92,
        chunkMethod: 'Fixed',
        chunkSize: 256,
        status: 'Complete',
      },
      {
        id: '3',
        rank: 3,
        patternName: 'Pattern 3',
        modelName: 'gpt-oss-120b',
        answerFaithfulness: 0.89,
        chunkMethod: 'Semantic',
        chunkSize: 1024,
        status: 'Complete',
      },
      {
        id: '4',
        rank: 4,
        patternName: 'Pattern 4',
        modelName: 'llama-4-ma',
        answerFaithfulness: 0,
        chunkMethod: 'Fixed',
        chunkSize: 512,
        status: 'In Progress',
      },
      {
        id: '5',
        rank: 5,
        patternName: 'Pattern 5',
        modelName: 'llama-3-3-70b',
        answerFaithfulness: 0,
        chunkMethod: 'Semantic',
        chunkSize: 256,
        status: 'In Progress',
      },
      {
        id: '6',
        rank: 6,
        patternName: 'Pattern 6',
        modelName: 'llama-3-3-70b',
        answerFaithfulness: 0,
        chunkMethod: 'Fixed',
        chunkSize: 1024,
        status: 'In Progress',
      },
    ];
    
    // Simulate async experiment completion
    setTimeout(() => {
      setPatternResults(mockResults);
      setExperimentRunning(false);
      setExperimentCompleted(true);
      
      // Update experiment status to completed
      if (selectedExperimentId) {
        setExperiments(prevExperiments => prevExperiments.map(exp => {
          if (exp.id === selectedExperimentId) {
            return { ...exp, status: 'completed', isRunning: false };
          }
          return exp;
        }));
      }
    }, 1000);
  };

  const handleViewDetails = (patternId: string) => {
    // TODO: Implement view details
    console.log('View details for pattern:', patternId);
  };

  const handleTestInPlayground = (patternId: string) => {
    // TODO: Implement test in playground
    console.log('Test in playground for pattern:', patternId);
  };

  const handleViewCode = (patternId: string) => {
    // TODO: Implement view code
    console.log('View code for pattern:', patternId);
  };

  const handleSort = (columnName: string) => {
    if (sortBy === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortDirection('asc');
    }
  };

  const getSortedResults = (): PatternResult[] => {
    const sorted = [...patternResults].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'patternName':
          comparison = a.patternName.localeCompare(b.patternName);
          break;
        case 'modelName':
          comparison = a.modelName.localeCompare(b.modelName);
          break;
        case 'answerFaithfulness':
          comparison = a.answerFaithfulness - b.answerFaithfulness;
          break;
        case 'chunkMethod':
          comparison = a.chunkMethod.localeCompare(b.chunkMethod);
          break;
        case 'chunkSize':
          comparison = a.chunkSize - b.chunkSize;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  };

  const handleViewExperimentDetails = () => {
    // TODO: Implement view experiment details
    console.log('View experiment details');
  };

  const handleViewExperimentCode = () => {
    // TODO: Implement view experiment code
    console.log('View experiment code');
  };

  const handleViewAllExperiments = () => {
    console.log('View all experiments');
    // TODO: Navigate to experiments list page
  };

  const handleNewExperiment = () => {
    console.log('New experiment');
    handleCreateExperiment();
  };

  const handleBreadcrumbNavigation = (target: string) => {
    switch (target) {
      case 'project':
        // Navigate back to experiments list
        handleCancel();
        break;
      case 'experiment':
        // Navigate back to configuration from results page
        if (experimentCompleted) {
          setExperimentCompleted(false);
          setExperimentRunning(false);
          setPatternResults([]);
          setIsConfiguring(true);
        }
        break;
      default:
        break;
    }
  };

  // Update experiment status based on current state
  React.useEffect(() => {
    if (selectedExperimentId) {
      setExperiments(prevExperiments => prevExperiments.map(exp => {
        if (exp.id === selectedExperimentId) {
          let status: Experiment['status'] = 'incomplete';
          if (experimentRunning) {
            status = 'Processing';
          } else if (experimentCompleted) {
            status = 'completed';
          } else if (documents.length > 0 && evaluationSourceFile && vectorDatabase && criteria && (selectedFoundationModels.size > 0 || selectedEmbeddingModels.size > 0)) {
            status = 'incomplete'; // Still incomplete until run
          } else if (documents.length === 0 && !evaluationSourceFile) {
            status = 'incomplete';
          }
          
          return {
            ...exp,
            status,
            hasDocuments: documents.length > 0,
            hasConfigurations: documents.length > 0 && evaluationSourceFile !== null && vectorDatabase !== '',
            isRunning: experimentRunning,
            lastSaved: new Date(),
          };
        }
        return exp;
      }));
    }
  }, [documents.length, evaluationSourceFile, vectorDatabase, criteria, selectedFoundationModels.size, selectedEmbeddingModels.size, experimentRunning, experimentCompleted, selectedExperimentId]);

  // Handle clicking on experiment name to navigate
  const handleExperimentClick = (experiment: Experiment) => {
    setSelectedExperimentId(experiment.id);
    setExperimentName(experiment.name);
    setName(experiment.name);
    setDescription(experiment.description);
    setTags(experiment.tags);
    setExperimentCreated(true);
    
    // Navigate to configurations page (last completed page for incomplete experiments)
    setIsConfiguring(true);
    setIsCreating(false);
    
    // If experiment has documents/configurations, load them
    // TODO: Load experiment data from storage/API
  };


  const handleFoundationModelToggle = (modelId: string) => {
    const newSet = new Set(selectedFoundationModels);
    if (newSet.has(modelId)) {
      newSet.delete(modelId);
    } else {
      newSet.add(modelId);
    }
    setSelectedFoundationModels(newSet);
    // Update "select all" based on whether all models are selected
    const allSelected = foundationModels.every(model => newSet.has(model.id));
    setSelectAllFoundation(allSelected);
  };

  const handleEmbeddingModelToggle = (modelId: string) => {
    const newSet = new Set(selectedEmbeddingModels);
    if (newSet.has(modelId)) {
      newSet.delete(modelId);
    } else {
      newSet.add(modelId);
    }
    setSelectedEmbeddingModels(newSet);
    // Update "select all" based on whether all models are selected
    const allSelected = embeddingModels.every(model => newSet.has(model.id));
    setSelectAllEmbedding(allSelected);
  };

  const handleSelectAllFoundation = (checked: boolean) => {
    setSelectAllFoundation(checked);
    if (checked) {
      setSelectedFoundationModels(new Set(foundationModels.map(m => m.id)));
    } else {
      setSelectedFoundationModels(new Set());
    }
  };

  const handleSelectAllEmbedding = (checked: boolean) => {
    setSelectAllEmbedding(checked);
    if (checked) {
      setSelectedEmbeddingModels(new Set(embeddingModels.map(m => m.id)));
    } else {
      setSelectedEmbeddingModels(new Set());
    }
  };

  const handleCriteriaChange = (criterion: string) => {
    setCriteria(criterion);
  };

  const handleOpenEvaluationSettingsModal = () => {
    // Store initial values when modal opens
    setInitialFoundationModels(new Set(selectedFoundationModels));
    setInitialEmbeddingModels(new Set(selectedEmbeddingModels));
    setInitialCriteria(criteria);
    setIsEvaluationSettingsModalOpen(true);
  };

  const handleSaveEvaluationSettings = () => {
    // Update initial values to current values after save
    setInitialFoundationModels(new Set(selectedFoundationModels));
    setInitialEmbeddingModels(new Set(selectedEmbeddingModels));
    setInitialCriteria(criteria);
    setIsEvaluationSettingsModalOpen(false);
  };

  const handleCancelEvaluationSettings = () => {
    // Revert to initial values
    setSelectedFoundationModels(new Set(initialFoundationModels));
    setSelectedEmbeddingModels(new Set(initialEmbeddingModels));
    setCriteria(initialCriteria);
    setIsEvaluationSettingsModalOpen(false);
  };

  const hasEvaluationSettingsChanged = () => {
    // Check if foundation models changed
    if (selectedFoundationModels.size !== initialFoundationModels.size) {
      return true;
    }
    for (const model of selectedFoundationModels) {
      if (!initialFoundationModels.has(model)) {
        return true;
      }
    }
    
    // Check if embedding models changed
    if (selectedEmbeddingModels.size !== initialEmbeddingModels.size) {
      return true;
    }
    for (const model of selectedEmbeddingModels) {
      if (!initialEmbeddingModels.has(model)) {
        return true;
      }
    }
    
    // Check if criteria changed
    if (criteria !== initialCriteria) {
      return true;
    }
    
    return false;
  };


  const handleBack = () => {
    if (isConfiguring) {
      // Go back from configuration to experiments table view
      handleCancel();
    } else if (experimentCompleted) {
      // Go back from results to configuration
      setExperimentCompleted(false);
      setExperimentRunning(false);
      setPatternResults([]);
      setIsConfiguring(true);
    }
  };

  const formatUploadDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const evaluationDataTemplate = [
    {
      question: "<text>",
      correct_answer: "<text>",
      correct_answer_document_ids: [
        "<file>",
        "<file>"
      ]
    },
    {
      question: "<text>",
      correct_answer: "<text>",
      correct_answer_document_ids: [
        "<file>",
        "<file>"
      ]
    },
    {
      question: "<text>",
      correct_answer: "<text>",
      correct_answer_document_ids: [
        "<file>",
        "<file>"
      ]
    }
  ];

  const handleDownloadTemplate = () => {
    const dataStr = JSON.stringify(evaluationDataTemplate, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'evaluation-data-template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    const codeText = JSON.stringify(evaluationDataTemplate, null, 2);
    navigator.clipboard.writeText(codeText).then(() => {
      // Could add a toast notification here if needed
      console.log('Code copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy code:', err);
    });
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      {flags.showProjectWorkspaceDropdowns && experimentCreated && (
        <PageSection style={{ paddingTop: '0.5rem', paddingBottom: '0.25rem' }} id="autorag-breadcrumb">
          <Breadcrumb id="autorag-breadcrumb-nav">
            {/* State 2: Experiment created - on configuration page */}
            {!isCreating && experimentCreated && isConfiguring && !experimentCompleted && (
              <BreadcrumbItem
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleBreadcrumbNavigation('project');
                }}
                id="breadcrumb-project"
              >
                AutoRAG: {selectedProject}
              </BreadcrumbItem>
            )}
            {!isCreating && experimentCreated && isConfiguring && !experimentCompleted && (
              <BreadcrumbItem isActive id="breadcrumb-experiment-name">
                {experimentName}
              </BreadcrumbItem>
            )}

            {/* State 3: Experiment completed - on results page */}
            {!isCreating && experimentCreated && experimentCompleted && (
              <BreadcrumbItem
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleBreadcrumbNavigation('project');
                }}
                id="breadcrumb-project"
              >
                AutoRAG: {selectedProject}
              </BreadcrumbItem>
            )}
            {!isCreating && experimentCreated && experimentCompleted && (
              <BreadcrumbItem
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleBreadcrumbNavigation('experiment');
                }}
                id="breadcrumb-experiment-name"
              >
                {experimentName}
              </BreadcrumbItem>
            )}
            {!isCreating && experimentCreated && experimentCompleted && (
              <BreadcrumbItem isActive id="breadcrumb-results">
                {experimentName} experiment results
              </BreadcrumbItem>
            )}
          </Breadcrumb>
        </PageSection>
      )}

      {/* Title Section */}
      <PageSection id="autorag-header">
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <Title headingLevel="h2" size="xl" id="autorag-title">
              {isCreating
                ? 'Create AutoRAG experiment'
                : experimentCompleted 
                ? `${experimentName} experiment results`
                : experimentCreated 
                ? experimentName 
                : 'AutoRAG'}
            </Title>
          </FlexItem>
        </Flex>
        {!experimentCreated && (
          <div style={{ color: 'var(--pf-v5-global--Color--200)', marginTop: '0.5rem' }}>
            Automatically configure and optimize your Retrieval-Augmented Generation workflows.
          </div>
        )}
        {experimentCompleted && (
          <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginTop: '0.5rem' }}>
            <FlexItem>
              <Button
                variant="link"
                isInline
                onClick={handleViewExperimentDetails}
                id="header-view-details-link"
              >
                View details
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                variant="link"
                isInline
                onClick={handleViewExperimentCode}
                id="header-view-code-link"
              >
                View code
              </Button>
            </FlexItem>
          </Flex>
        )}
  </PageSection>

      {/* Project Selector - Only show on empty state page */}
      {flags.showProjectWorkspaceDropdowns && !isCreating && !experimentCreated && (
        <PageSection style={{ paddingTop: '0.5rem', paddingBottom: '0.25rem' }} id="autorag-project-selector">
          <Toolbar>
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem>
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
                            style={{ width: '200px' }}
                            id="autorag-project-select-toggle"
                          >
                            {selectedProject}
                          </MenuToggle>
                        )}
                        shouldFocusToggleOnSelect
                        id="autorag-project-select"
                      >
                        <SelectList>
                          <SelectOption value="Project X">Project X</SelectOption>
                          <SelectOption value="Project Y">Project Y</SelectOption>
                        </SelectList>
                      </Select>
                    </InputGroupItem>
                  </InputGroup>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </PageSection>
      )}

      {/* Content: Empty State, Form, Experiment View, or Results */}
      <PageSection 
        style={{ 
          paddingTop: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 200px)',
          flex: 1
        }} 
        id="autorag-content"
      >
        {experimentCompleted ? (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '400px' }}>
            {/* Pipeline Visualization */}
            <Card id="pipeline-visualization-card">
              <CardHeader>
                <CardTitle>
                  <Title headingLevel="h2" size="lg" id="pipeline-section-title">
                    Experiment Pipeline
                  </Title>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div style={{ 
                  padding: '2rem', 
                  backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)', 
                  borderRadius: '4px',
                  border: '1px solid var(--pf-v5-global--BorderColor--100)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img 
                    src={PipelineVisualization} 
                    alt="AutoRAG Pipeline Visualization showing the experiment flow from document collection through evaluation with multiple models" 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      display: 'block'
                    }}
                    id="pipeline-visualization-image"
                  />
                </div>
              </CardBody>
            </Card>

            {/* Results Table */}
            <Card id="results-table-card" style={{ marginTop: '20px' }}>
              <CardHeader>
                <CardTitle>
                  <Title headingLevel="h2" size="lg" id="autorag-results-table-title">
                    Results
                  </Title>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table aria-label="Pattern results table" variant="compact" id="autorag-results-table">
              <Thead>
                <Tr>
                  <Th
                    sort={{
                      sortBy: { index: 0, direction: sortBy === 'rank' ? sortDirection : undefined },
                      onSort: () => handleSort('rank'),
                      columnIndex: 0,
                    }}
                  >
                    Rank
                  </Th>
                  <Th
                    sort={{
                      sortBy: { index: 1, direction: sortBy === 'patternName' ? sortDirection : undefined },
                      onSort: () => handleSort('patternName'),
                      columnIndex: 1,
                    }}
                  >
                    Pattern name
                  </Th>
                  <Th
                    sort={{
                      sortBy: { index: 2, direction: sortBy === 'modelName' ? sortDirection : undefined },
                      onSort: () => handleSort('modelName'),
                      columnIndex: 2,
                    }}
                  >
                    Model name
                  </Th>
                  <Th
                    sort={{
                      sortBy: { index: 3, direction: sortBy === 'answerFaithfulness' ? sortDirection : undefined },
                      onSort: () => handleSort('answerFaithfulness'),
                      columnIndex: 3,
                    }}
                  >
                    Answer faithfulness
                  </Th>
                  <Th
                    sort={{
                      sortBy: { index: 4, direction: sortBy === 'chunkMethod' ? sortDirection : undefined },
                      onSort: () => handleSort('chunkMethod'),
                      columnIndex: 4,
                    }}
                  >
                    Chunk method
                  </Th>
                  <Th
                    sort={{
                      sortBy: { index: 5, direction: sortBy === 'chunkSize' ? sortDirection : undefined },
                      onSort: () => handleSort('chunkSize'),
                      columnIndex: 5,
                    }}
                  >
                    Chunk size
                  </Th>
                  <Th
                    sort={{
                      sortBy: { index: 6, direction: sortBy === 'status' ? sortDirection : undefined },
                      onSort: () => handleSort('status'),
                      columnIndex: 6,
                    }}
                  >
                    Status
                  </Th>
                  <Th width={30}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {getSortedResults().map((result, index) => {
                  const isRankOne = result.rank === 1;
                  const baseBackgroundColor = index % 2 === 0 
                    ? 'var(--pf-v5-global--BackgroundColor--200)' 
                    : 'transparent';
                  const rankOneBackgroundColor = '#fffaec';
                  const isLinkEnabled = index < 3; // Enable links for rows 1-3, disable for rows 4-6
                  
                  return (
                  <Tr 
                    key={result.id} 
                    id={`result-row-${result.id}`}
                    style={{
                      backgroundColor: isRankOne ? rankOneBackgroundColor : baseBackgroundColor,
                      borderLeft: isRankOne ? '4px solid #f0ab00' : '4px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isRankOne 
                        ? '#fef0cd' 
                        : 'var(--pf-v5-global--BackgroundColor--200)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isRankOne 
                        ? rankOneBackgroundColor 
                        : baseBackgroundColor;
                    }}
                  >
                    <Td dataLabel="Rank">
                      {isRankOne ? (
                        <Badge 
                          style={{ 
                            backgroundColor: '#f0ab00',
                            color: '#151515',
                            fontWeight: 'bold',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}
                        >
                          {result.rank}
                        </Badge>
                      ) : (
                        result.rank
                      )}
                    </Td>
                    <Td 
                      dataLabel="Pattern name"
                      style={isRankOne ? { fontWeight: 'bold' } : {}}
                    >
                      {result.patternName}
                    </Td>
                    <Td dataLabel="Model name">{result.modelName}</Td>
                    <Td 
                      dataLabel="Answer faithfulness"
                      style={isRankOne ? { fontWeight: 'bold', color: '#f0ab00' } : {}}
                    >
                      {result.status === 'In Progress' ? '-' : result.answerFaithfulness.toFixed(2)}
                    </Td>
                    <Td dataLabel="Chunk method">{result.chunkMethod}</Td>
                    <Td dataLabel="Chunk size">{result.chunkSize}</Td>
                    <Td dataLabel="Status">
                      {result.status === 'Complete' ? (
                        <Label color="green" icon={<CheckCircleIcon />}>
                          Complete
                        </Label>
                      ) : (
                        <Label color="blue" icon={<SyncIcon />}>
                          In Progress
                        </Label>
                      )}
                    </Td>
                    <Td dataLabel="Actions">
                      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (isLinkEnabled) handleViewDetails(result.id);
                            }}
                            id={`view-details-${result.id}`}
                            style={{
                              color: isLinkEnabled ? '#0066cc' : '#6a6e73',
                              textDecoration: 'none',
                              cursor: isLinkEnabled ? 'pointer' : 'not-allowed',
                              pointerEvents: isLinkEnabled ? 'auto' : 'none'
                            }}
                          >
                            View details
                          </a>
                        </FlexItem>
                        <FlexItem>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (isLinkEnabled) handleTestInPlayground(result.id);
                            }}
                            id={`test-playground-${result.id}`}
                            style={{
                              color: isLinkEnabled ? '#0066cc' : '#6a6e73',
                              textDecoration: 'none',
                              cursor: isLinkEnabled ? 'pointer' : 'not-allowed',
                              pointerEvents: isLinkEnabled ? 'auto' : 'none'
                            }}
                          >
                            Test in playground
                          </a>
                        </FlexItem>
                        <FlexItem>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (isLinkEnabled) handleViewCode(result.id);
                            }}
                            id={`view-code-${result.id}`}
                            style={{
                              color: isLinkEnabled ? '#0066cc' : '#6a6e73',
                              textDecoration: 'none',
                              cursor: isLinkEnabled ? 'pointer' : 'not-allowed',
                              pointerEvents: isLinkEnabled ? 'auto' : 'none'
                            }}
                          >
                            View code
                          </a>
                        </FlexItem>
                      </Flex>
                    </Td>
                  </Tr>
                  );
                })}
              </Tbody>
            </Table>
              </CardBody>
            </Card>
          </div>
        ) : experimentCreated ? (
          <>
            {/* Configuration Screen */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              flex: 1, 
              minHeight: '400px'
            }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
              <Grid hasGutter>
                {/* Column 1: Documents */}
                <GridItem span={4} style={{ display: 'flex' }}>
                <Card id="autorag-documents-card" style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h2" size="md" id="autorag-documents-title" style={{ color: 'var(--pf-v5-global--primary-color--100)' }}>
                        Documents
                      </Title>
                    </CardTitle>
                  </CardHeader>
                  <CardBody style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Body Copy */}
                    <div style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)', marginBottom: '20px' }}>
                        Drag and drop or browse existing document files from your local computer or add a connection.
                    </div>

                    {/* Multiple File Upload */}
                    <div style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                      <MultipleFileUpload
                        onFileDrop={handleFileDrop}
                        dropzoneProps={{
                          accept: {
                            'application/pdf': ['.pdf'],
                            'text/plain': ['.txt'],
                            'application/json': ['.json'],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                            'application/msword': ['.doc'],
                          }
                        }}
                        id="documents-file-upload"
                      >
                        <MultipleFileUploadMain
                          titleIcon={<FolderOpenIcon />}
                          titleText="Drag and drop files here"
                          titleTextSeparator="or"
                          infoText="Accepted file types: PDF, TXT, JSON, DOCX, DOC"
                          style={{ boxSizing: 'content-box' }}
                        />
                        {uploadingFiles.length > 0 && (
                          <MultipleFileUploadStatus>
                            {uploadingFiles.map((file, index) => (
                              <MultipleFileUploadStatusItem
                                key={index}
                                file={file}
                                onClearClick={() => {
                                  setUploadingFiles(uploadingFiles.filter(f => f !== file));
                                }}
                              />
                            ))}
                          </MultipleFileUploadStatus>
                        )}
                      </MultipleFileUpload>
                    </div>

                    {/* Add Connection Button */}
                    <Flex justifyContent={{ default: 'justifyContentFlexStart' }} style={{ boxSizing: 'content-box', paddingTop: '20px' }}>
                      <Button variant="secondary" onClick={handleAddConnection} id="add-connection-button">
                        Add connection
                      </Button>
                    </Flex>

                    {/* Documents and Connections List */}
                    {documents.length > 0 && (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                        <Title headingLevel="h3" size="md" id="documents-list-title" style={{ boxSizing: 'content-box', marginTop: '20px' }}>
                          Sources
                        </Title>
                        <div style={{ flex: 1, overflow: 'auto' }}>
                          <Table aria-label="Documents table" variant="compact" id="autorag-documents-table">
                            <Thead>
                              <Tr>
                                <Th>Name</Th>
                                <Th>Source</Th>
                                <Th modifier="fitContent">Actions</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {documents.map((doc) => (
                                <Tr key={doc.id} id={`document-row-${doc.id}`}>
                                  <Td dataLabel="Name">{doc.name}</Td>
                                  <Td dataLabel="Source">
                                    <Label color={doc.sourceType === 'connection' ? 'blue' : 'grey'}>
                                      {doc.sourceType === 'connection' ? 'Connection' : 'Document'}
                                    </Label>
                                  </Td>
                                  <Td dataLabel="Actions" modifier="fitContent">
                                    <Button
                                      variant="plain"
                                      onClick={() => handleFileRemove(doc.id)}
                                      id={`delete-document-${doc.id}`}
                                      aria-label={`Delete ${doc.name}`}
                                    >
                                      ×
                                    </Button>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </GridItem>

              {/* Column 2: Configure Details */}
              <GridItem span={8} style={{ display: 'flex' }}>
                    <Card id="autorag-configure-card" style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      flex: 1,
                      width: '100%',
                      opacity: hasAddedDocuments ? 1 : 0.6,
                      pointerEvents: hasAddedDocuments ? 'auto' : 'none'
                    }}>
                      <CardHeader>
                        <CardTitle>
                          <Title headingLevel="h2" size="md" id="autorag-configure-title" style={{ color: 'var(--pf-v5-global--primary-color--100)' }}>
                            Configure details
                          </Title>
                        </CardTitle>
                      </CardHeader>
                      <CardBody style={{ overflowY: 'auto', flex: 1, position: 'relative' }}>
                        {!hasAddedDocuments ? (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            minHeight: '300px',
                            pointerEvents: 'auto'
                          }}>
                            <EmptyState headingLevel="h3" titleText="Upload a document to configure details" id="configure-details-empty-state">
                              <EmptyStateBody>
                                In order to configure details and run an experiment, add a document or connection in the widget on the left.
                              </EmptyStateBody>
                            </EmptyState>
                          </div>
                        ) : (
                        <Form id="autorag-configure-form">
                          {/* Vector Database Location */}
                          <FormGroup
                            label="Where would you like to index your documents?"
                            fieldId="vector-database"
                          >
                            <Select
                              isOpen={isVectorDbOpen}
                              selected={vectorDatabase}
                              onSelect={(_event, value) => {
                                setVectorDatabase(value as string);
                                setIsVectorDbOpen(false);
                              }}
                              onOpenChange={(isOpen) => setIsVectorDbOpen(isOpen)}
                              toggle={(toggleRef) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setIsVectorDbOpen(!isVectorDbOpen)}
                                  isExpanded={isVectorDbOpen}
                                  id="vector-database-toggle"
                                >
                                  {vectorDatabase || 'Vector database location'}
                                </MenuToggle>
                              )}
                              id="vector-database-select"
                            >
                              <SelectList>
                                <SelectOption value="Milvus (in line)">Milvus (in line)</SelectOption>
                                <SelectOption value="Milvus (remote)">Milvus (remote)</SelectOption>
                                <SelectOption value="PG Vector (remote)">PG Vector (remote)</SelectOption>
                              </SelectList>
                            </Select>
                            <FormHelperText>
                              <HelperText>
                                <HelperTextItem>Specify the location for storing the vector index used to retrieve your documents.</HelperTextItem>
                              </HelperText>
                            </FormHelperText>
                          </FormGroup>

                          {/* Evaluation Source */}
                          <FormGroup
                            label="Add the data source you would like to use for evaluation."
                            isRequired
                            fieldId="evaluation-source"
                          >
                            <FileUpload
                              id="evaluation-source-file-upload"
                              value={evaluationSourceFilename}
                              filename={evaluationSourceFilename}
                              filenamePlaceholder="Drag and drop a file here or upload"
                              onFileInputChange={(_event, file: File) => {
                                setEvaluationSourceFilename(file.name);
                                setIsEvaluationSourceUploading(true);
                                // Simulate file upload
                                setTimeout(() => {
                                  setEvaluationSourceFile(file);
                                  setIsEvaluationSourceUploading(false);
                                }, 500);
                              }}
                              onClearClick={() => {
                                setEvaluationSourceFilename('');
                                setEvaluationSourceFile(null);
                              }}
                              browseButtonText="Upload"
                              isLoading={isEvaluationSourceUploading}
                              dropzoneProps={{
                                accept: {
                                  'application/json': ['.json'],
                                  'application/x-yaml': ['.yaml', '.yml'],
                                  'text/yaml': ['.yaml', '.yml'],
                                  'text/x-yaml': ['.yaml', '.yml'],
                                }
                              }}
                            />
                            <FormHelperText>
                              <HelperText>
                                <HelperTextItem>
                                  Supply a JSON or YAML file with test questions and answers to evaluate the quality of Q&A responses.{' '}
                                  <Button
                                    variant="link"
                                    isInline
                                    onClick={() => setIsEvaluationSourceModalOpen(true)}
                                    id="what-is-evaluation-source-link"
                                  >
                                    What is an evaluation source?
                                  </Button>
                                </HelperTextItem>
                              </HelperText>
                            </FormHelperText>
                          </FormGroup>


                          {/* Selected Settings Display */}
                          <Grid hasGutter style={{ marginTop: '2rem' }}>
                            <GridItem span={6}>
                              <div id="optimization-metric-column">
                                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                  Optimization metric <span style={{ color: '#c9190b' }}>*</span>
                                </div>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                  <FlexItem style={{ fontSize: '1.5rem' }} id="optimization-metric-link">
                                    {criteria || 'None selected'}
                                  </FlexItem>
                                  <FlexItem>
                                    <Button
                                      variant="plain"
                                      onClick={handleOpenEvaluationSettingsModal}
                                      id="optimization-metric-edit-button"
                                      aria-label="Edit optimization metric"
                                    >
                                      <PencilAltIcon />
                                    </Button>
                                  </FlexItem>
                                </Flex>
                              </div>
                            </GridItem>
                            <GridItem span={6}>
                              <div id="models-to-consider-column">
                                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                  Models to consider <span style={{ color: '#c9190b' }}>*</span>
                                </div>
                                {!hasAddedDocuments ? (
                                  <div style={{ 
                                    fontSize: 'var(--pf-v5-global--FontSize--sm)', 
                                    color: 'var(--pf-v5-global--Color--200)', 
                                    fontStyle: 'italic',
                                    paddingTop: '0.25rem'
                                  }}>
                                    Upload one or more document in the Documents column to get started.
                                  </div>
                                ) : (
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                    <FlexItem style={{ fontSize: '1.5rem' }} id="models-to-consider-link">
                                      {selectedFoundationModels.size > 0 || selectedEmbeddingModels.size > 0
                                        ? `${selectedFoundationModels.size} foundation, ${selectedEmbeddingModels.size} embedding${selectedEmbeddingModels.size !== 1 ? 's' : ''}`
                                        : 'None selected'}
                                    </FlexItem>
                                    <FlexItem>
                                      <Button
                                        variant="plain"
                                        onClick={handleOpenEvaluationSettingsModal}
                                        id="models-to-consider-edit-button"
                                        aria-label="Edit models to consider"
                                      >
                                        <PencilAltIcon />
                                      </Button>
                                    </FlexItem>
                                  </Flex>
                                )}
                              </div>
                            </GridItem>
                          </Grid>
                        </Form>
                        )}
                      </CardBody>
                    </Card>
              </GridItem>
            </Grid>
            </div>

              {/* Sticky Footer */}
              <div style={{ 
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderTop: '1px solid var(--pf-v5-global--BorderColor--100)',
                boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
                padding: '1rem 1.5rem',
                zIndex: 100
              }}>
                <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>
                    <Button 
                      variant="primary" 
                      onClick={handleRunExperiment} 
                      id="run-experiment-button"
                      isDisabled={
                        documents.length === 0 ||
                        evaluationSourceFile === null ||
                        vectorDatabase === '' ||
                        !criteria ||
                        (selectedFoundationModels.size === 0 && selectedEmbeddingModels.size === 0)
                      }
                    >
                      Run experiment
                    </Button>
                  </FlexItem>
                </Flex>
              </div>
            </div>
          </>
        ) : !isCreating ? (
          experiments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '400px' }}>
              {/* Experiments Table View */}
              <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} style={{ marginBottom: '1.5rem' }}>
                <Button variant="primary" onClick={handleCreateExperiment} id="create-new-experiment-button">
                  Create new experiment
                </Button>
              </Flex>
              <Table aria-label="Experiments table" id="autorag-experiments-table">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Tags</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {experiments.map((experiment) => (
                    <Tr key={experiment.id} id={`experiment-row-${experiment.id}`}>
                      <Td dataLabel="Name">
                        <Button
                          variant="link"
                          isInline
                          onClick={() => handleExperimentClick(experiment)}
                          id={`experiment-name-${experiment.id}`}
                          style={{ paddingLeft: 0, fontWeight: 'bold' }}
                        >
                          {experiment.name}
                        </Button>
                      </Td>
                      <Td dataLabel="Description">{experiment.description || '-'}</Td>
                      <Td dataLabel="Tags">
                        {experiment.tags.length > 0 ? (
                          <LabelGroup numLabels={3}>
                            {experiment.tags.map((tag, index) => (
                              <Label key={index} id={`experiment-tag-${experiment.id}-${index}`}>
                                {tag}
                              </Label>
                            ))}
                          </LabelGroup>
                        ) : (
                          '-'
                        )}
                      </Td>
                      <Td dataLabel="Status">
                        {experiment.status === 'completed' && (
                          <Label color="green" icon={<CheckCircleIcon />}>
                            Completed
                          </Label>
                        )}
                        {experiment.status === 'Processing' && (
                          <Label color="blue" icon={<SyncIcon />}>
                            Processing
                          </Label>
                        )}
                        {experiment.status === 'failed' && (
                          <Label color="red">
                            Failed
                          </Label>
                        )}
                        {experiment.status === 'incomplete' && (
                          <Label color="orange">
                            Incomplete
                          </Label>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1,
              minHeight: '400px'
            }}>
              <EmptyState headingLevel="h2" titleText="AutoRAG Experiment" icon={() => <AutoRAGIcon size={64} />} id="autorag-empty-state">
                <EmptyStateBody>
                  Automatically configure and optimize your Retrieval-Augmented Generation workflows.
                </EmptyStateBody>
                <EmptyStateFooter>
                  <EmptyStateActions>
                    <Button variant="primary" onClick={handleCreateExperiment} id="create-autorag-experiment-button">
                      Create AutoRAG Experiment
                    </Button>
                  </EmptyStateActions>
                </EmptyStateFooter>
              </EmptyState>
            </div>
          )
        ) : (
          <>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              flex: 1, 
              minHeight: '400px'
            }}>
              <div style={{ 
                flex: 1, 
                overflowY: 'auto',
                paddingBottom: '100px'
              }}>
                <Form id="autorag-experiment-form" isWidthLimited>
                  <Title headingLevel="h2" size="md" id="autorag-details-header" style={{ marginTop: '1.5rem', marginBottom: '0.25rem' }}>
                    Define Details
                  </Title>

                  <FormGroup label="Name" isRequired fieldId="autorag-name" style={{ marginTop: '0.25rem' }}>
                    <TextInput
                      isRequired
                      type="text"
                      id="autorag-name"
                      name="autorag-name"
                      value={name}
                      onChange={(_event, value) => {
                        setName(value);
                        if (errors.name) {
                          setErrors({ ...errors, name: '' });
                        }
                      }}
                      validated={errors.name ? 'error' : 'default'}
                    />
                    {errors.name && (
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem variant="error">{errors.name}</HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup label="Description" fieldId="autorag-description" style={{ marginTop: '1rem' }}>
                    <TextArea
                      type="text"
                      id="autorag-description"
                      name="autorag-description"
                      value={description}
                      onChange={(_event, value) => setDescription(value)}
                      rows={3}
                    />
                  </FormGroup>

                  <FormGroup label="Tags" fieldId="autorag-tags" style={{ marginTop: '1rem' }}>
                    <InputGroup>
                      <InputGroupItem isFill>
                        <TextInput
                          type="text"
                          id="autorag-tags-input"
                          name="autorag-tags-input"
                          value={tagInput}
                          onChange={handleTagInputChange}
                          onKeyDown={handleTagInputKeyDown}
                          placeholder="Enter tags separated by commas"
                        />
                      </InputGroupItem>
                      <InputGroupItem>
                        <Button
                          variant="control"
                          onClick={handleAddTag}
                          isDisabled={!tagInput.trim()}
                          id="autorag-add-tag-button"
                          aria-label="Add tag"
                        >
                          <PlusIcon />
                        </Button>
                      </InputGroupItem>
                    </InputGroup>
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem>Add tags to make assets easier to find</HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                    {tags.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <LabelGroup id="autorag-tags-group">
                          {tags.map((tag) => (
                            <Label
                              key={tag}
                              variant="outline"
                              onClose={() => handleRemoveTag(tag)}
                              id={`autorag-tag-${tag}`}
                            >
                              {tag}
                            </Label>
                          ))}
                        </LabelGroup>
                      </div>
                    )}
                  </FormGroup>
                </Form>
              </div>

              {/* Sticky Footer */}
              <div style={{ 
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderTop: '1px solid var(--pf-v5-global--BorderColor--100)',
                boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
                padding: '1rem 1.5rem',
                zIndex: 100
              }}>
                <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>
                    <Button variant="secondary" onClick={handleCancel} id="autorag-cancel-button">
                      Cancel
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button 
                      variant="primary" 
                      onClick={handleSubmit} 
                      id="autorag-create-button"
                      isDisabled={!name.trim() || !criteria || (selectedFoundationModels.size === 0 && selectedEmbeddingModels.size === 0)}
                    >
                      Create
                    </Button>
                  </FlexItem>
                </Flex>
              </div>
            </div>
          </>
        )}
  </PageSection>

      {/* Evaluation Source Settings Modal */}
      <Modal
        variant={ModalVariant.large}
        isOpen={isEvaluationSettingsModalOpen}
        onClose={handleCancelEvaluationSettings}
        id="evaluation-settings-modal"
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl" id="evaluation-settings-modal-title">
            Experiment settings
          </Title>
        </ModalHeader>
        <ModalBody>
          <Form id="evaluation-settings-form">
            {/* Models to Test - Tabbed Layout */}
            <FormGroup
              label="Models to test"
              isRequired
              fieldId="models-to-test"
              style={{ marginBottom: '1.5rem' }}
            >
              <Tabs
                activeKey={activeModelTabKey}
                onSelect={(_event, tabIndex) => setActiveModelTabKey(tabIndex)}
                aria-label="Models to test tabs"
                id="models-to-test-tabs"
              >
                <Tab
                  eventKey={0}
                  title={<TabTitleText>Foundation models</TabTitleText>}
                  aria-label="Foundation models tab"
                  id="foundation-models-tab"
                >
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Checkbox
                        id="select-all-foundation"
                        isChecked={selectAllFoundation}
                        onChange={(_event, checked) => handleSelectAllFoundation(checked)}
                        label="All available models"
                      />
                    </div>
                    <Table variant="compact" id="foundation-models-table">
                      <Thead>
                        <Tr>
                          <Th width={10}></Th>
                          <Th>Name</Th>
                          <Th>Description</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {foundationModels.map((model) => (
                          <Tr key={model.id} id={`foundation-model-row-${model.id}`}>
                            <Td>
                              <Checkbox
                                id={`foundation-model-${model.id}`}
                                isChecked={selectedFoundationModels.has(model.id)}
                                onChange={() => handleFoundationModelToggle(model.id)}
                              />
                            </Td>
                            <Td dataLabel="Name">{model.name}</Td>
                            <Td dataLabel="Description">{model.description}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                </Tab>

                <Tab
                  eventKey={1}
                  title={<TabTitleText>Embedding models</TabTitleText>}
                  aria-label="Embedding models tab"
                  id="embedding-models-tab"
                >
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Checkbox
                        id="select-all-embedding"
                        isChecked={selectAllEmbedding}
                        onChange={(_event, checked) => handleSelectAllEmbedding(checked)}
                        label="All available models"
                      />
                    </div>
                    <Table variant="compact" id="embedding-models-table">
                      <Thead>
                        <Tr>
                          <Th width={10}></Th>
                          <Th>Name</Th>
                          <Th>Description</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {embeddingModels.map((model) => (
                          <Tr key={model.id} id={`embedding-model-row-${model.id}`}>
                            <Td>
                              <Checkbox
                                id={`embedding-model-${model.id}`}
                                isChecked={selectedEmbeddingModels.has(model.id)}
                                onChange={() => handleEmbeddingModelToggle(model.id)}
                              />
                            </Td>
                            <Td dataLabel="Name">{model.name}</Td>
                            <Td dataLabel="Description">{model.description}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                </Tab>
              </Tabs>
            </FormGroup>

            {/* Criteria to Test */}
            <FormGroup
              label="Criteria to test"
              isRequired
              fieldId="criteria"
              style={{ marginBottom: '1.5rem' }}
            >
              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <Radio
                    id="criteria-faithfulness"
                    name="criteria"
                    isChecked={criteria === 'answer faithfulness'}
                    onChange={() => handleCriteriaChange('answer faithfulness')}
                    label="Answer faithfulness"
                  />
                </FlexItem>
                <FlexItem>
                  <Radio
                    id="criteria-correctness"
                    name="criteria"
                    isChecked={criteria === 'answer correctness'}
                    onChange={() => handleCriteriaChange('answer correctness')}
                    label="Answer correctness"
                  />
                </FlexItem>
                <FlexItem>
                  <Radio
                    id="criteria-context"
                    name="criteria"
                    isChecked={criteria === 'context correctness'}
                    onChange={() => handleCriteriaChange('context correctness')}
                    label="Context correctness"
                  />
                </FlexItem>
              </Flex>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="primary" 
            onClick={handleSaveEvaluationSettings} 
            id="evaluation-settings-save-button"
            isDisabled={!hasEvaluationSettingsChanged()}
          >
            Save
          </Button>
          <Button variant="link" onClick={handleCancelEvaluationSettings} id="evaluation-settings-cancel-button">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Evaluation Source Modal */}
      <Modal
        variant={ModalVariant.large}
        isOpen={isEvaluationSourceModalOpen}
        onClose={() => setIsEvaluationSourceModalOpen(false)}
        id="evaluation-source-modal"
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl" id="evaluation-source-modal-title">
            Evaluation data template
          </Title>
        </ModalHeader>
        <ModalBody>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)',
              border: '1px solid var(--pf-v5-global--BorderColor--200)',
              borderRadius: '4px',
              padding: '1rem',
              position: 'relative'
            }}>
              {/* Download button at top */}
              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="secondary"
                  icon={<DownloadIcon />}
                  onClick={handleDownloadTemplate}
                  id="download-template-button"
                  size="sm"
                >
                  Download template
                </Button>
              </div>
              
              {/* Code block with copy icon */}
              <div style={{ position: 'relative' }}>
                <Button
                  variant="plain"
                  icon={<CopyIcon />}
                  onClick={handleCopyCode}
                  aria-label="Copy code"
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    zIndex: 10
                  }}
                  id="copy-code-button"
                />
                <pre style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: 'var(--pf-v5-global--FontSize--sm)',
                  border: '1px solid var(--pf-v5-global--BorderColor--100)',
                  margin: 0,
                  paddingRight: '3rem',
                  fontFamily: 'monospace',
                  lineHeight: '1.5'
                }}>
                  {JSON.stringify(evaluationDataTemplate, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsEvaluationSourceModalOpen(false)} id="evaluation-source-modal-close-button">
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Connection Modal */}
      <Modal
        variant={ModalVariant.medium}
        isOpen={isAddConnectionModalOpen}
        onClose={handleConnectionModalClose}
        id="add-connection-modal"
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl" id="add-connection-modal-title">
            Add connection
          </Title>
        </ModalHeader>
        <ModalBody>
          <Form id="add-connection-form">
            <FormGroup label="Connection name" isRequired fieldId="connection-name">
              <TextInput
                isRequired
                type="text"
                id="connection-name"
                value={connectionName}
                onChange={(_event, value) => setConnectionName(value)}
                placeholder="Enter connection name"
              />
            </FormGroup>
            <FormGroup label="Connection type" isRequired fieldId="connection-type" style={{ marginTop: '1rem' }}>
              <Select
                id="connection-type-select"
                isOpen={isConnectionTypeOpen}
                selected={connectionType}
                onSelect={(_event, value) => {
                  setConnectionType(value as string);
                  setIsConnectionTypeOpen(false);
                }}
                onOpenChange={setIsConnectionTypeOpen}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsConnectionTypeOpen(!isConnectionTypeOpen)}
                    isExpanded={isConnectionTypeOpen}
                    id="connection-type-toggle"
                  >
                    {connectionType || 'Select connection type'}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="S3 Bucket">S3 Bucket</SelectOption>
                  <SelectOption value="COS">COS</SelectOption>
                  <SelectOption value="Azure Blob">Azure Blob</SelectOption>
                </SelectList>
              </Select>
            </FormGroup>
            <FormGroup label="Bucket name" fieldId="bucket-name" style={{ marginTop: '1rem' }}>
              <TextInput
                type="text"
                id="bucket-name"
                value={bucketName}
                onChange={(_event, value) => setBucketName(value)}
                placeholder="Enter bucket name"
              />
            </FormGroup>
            <FormGroup label="Endpoint" fieldId="endpoint" style={{ marginTop: '1rem' }}>
              <TextInput
                type="text"
                id="endpoint"
                value={endpoint}
                onChange={(_event, value) => setEndpoint(value)}
                placeholder="Enter endpoint URL"
              />
            </FormGroup>
            <FormGroup label="Region" fieldId="region" style={{ marginTop: '1rem' }}>
              <TextInput
                type="text"
                id="region"
                value={region}
                onChange={(_event, value) => setRegion(value)}
                placeholder="Enter region"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="primary" 
            onClick={handleConnectionSubmit} 
            id="add-connection-submit-button"
            isDisabled={!connectionName.trim() || !connectionType.trim()}
          >
            Add connection
          </Button>
          <Button variant="secondary" onClick={handleConnectionModalClose} id="add-connection-cancel-button">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

    </>
  );
};

export { AutoRAG };

