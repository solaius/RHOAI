import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
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
  PlusCircleIcon,
  PlusIcon,
} from '@patternfly/react-icons';
import { useFeatureFlags } from '@app/utils/FeatureFlagsContext';

interface Document {
  id: string;
  name: string;
  type: string;
  uploaded: Date;
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
  const [vectorDatabase, setVectorDatabase] = React.useState('');
  const [evaluationSource, setEvaluationSource] = React.useState('');
  const [selectedFoundationModels, setSelectedFoundationModels] = React.useState<Set<string>>(new Set());
  const [selectedEmbeddingModels, setSelectedEmbeddingModels] = React.useState<Set<string>>(new Set());
  const [selectAllFoundation, setSelectAllFoundation] = React.useState(false);
  const [selectAllEmbedding, setSelectAllEmbedding] = React.useState(false);
  const [criteria, setCriteria] = React.useState<Set<string>>(new Set());
  const [isVectorDbOpen, setIsVectorDbOpen] = React.useState(false);
  const [isEvaluationSourceOpen, setIsEvaluationSourceOpen] = React.useState(false);
  const [experimentRunning, setExperimentRunning] = React.useState(false);
  const [experimentCompleted, setExperimentCompleted] = React.useState(false);
  const [patternResults, setPatternResults] = React.useState<PatternResult[]>([]);
  const [activeModelTabKey, setActiveModelTabKey] = React.useState<string | number>(0);
  const [isEvaluationSettingsModalOpen, setIsEvaluationSettingsModalOpen] = React.useState(false);
  const [isAddDocumentsModalOpen, setIsAddDocumentsModalOpen] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

  // Mock data for models
  const foundationModels: Model[] = [
    { id: '1', name: 'Llama 3.1 8B', description: 'Large language model for general purpose tasks', tag: 'LLM' },
    { id: '2', name: 'Mistral 7B', description: 'Efficient language model for text generation', tag: 'LLM' },
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
    setName('');
    setDescription('');
    setTagInput('');
    setTags([]);
    setErrors({});
    setDocuments([]);
    setHasAddedDocuments(false);
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

  const handleChooseDocuments = () => {
    setIsAddDocumentsModalOpen(true);
  };

  const handleFileDrop = (_event: unknown, droppedFiles: File[]) => {
    setUploadedFiles([...uploadedFiles, ...droppedFiles]);
  };

  const handleFileRemove = (file: File) => {
    setUploadedFiles(uploadedFiles.filter(f => f !== file));
  };

  const handleAddDocumentsConfirm = () => {
    // Convert uploaded files to Document format
    const newDocuments: Document[] = uploadedFiles.map(file => ({
      id: Date.now().toString() + file.name,
      name: file.name,
      type: file.type || file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      uploaded: new Date(),
    }));
    setDocuments([...documents, ...newDocuments]);
    setHasAddedDocuments(true);
    setUploadedFiles([]);
    setIsAddDocumentsModalOpen(false);
  };

  const handleAddDocumentsModalClose = () => {
    setUploadedFiles([]);
    setIsAddDocumentsModalOpen(false);
  };

  const handleUploadDocument = () => {
    // TODO: Implement document upload
    console.log('Upload document clicked');
  };

  const handleAddConnection = () => {
    // TODO: Implement add connection
    console.log('Add connection clicked');
  };

  const handleAddDocuments = () => {
    // Move to configuration screen
    setIsConfiguring(true);
  };

  const handleRunExperiment = () => {
    // TODO: Implement experiment run
    console.log('Run experiment clicked', {
      vectorDatabase,
      evaluationSource,
      foundationModels: Array.from(selectedFoundationModels),
      embeddingModels: Array.from(selectedEmbeddingModels),
      criteria: Array.from(criteria),
    });
    
    // Simulate experiment running and completion
    setExperimentRunning(true);
    setIsConfiguring(false);
    
    // Mock results data
    const mockResults: PatternResult[] = [
      {
        id: '1',
        rank: 1,
        patternName: 'Pattern 1',
        modelName: 'Foundation Model 1',
        answerFaithfulness: 0.95,
        chunkMethod: 'Semantic',
        chunkSize: 512,
      },
      {
        id: '2',
        rank: 2,
        patternName: 'Pattern 2',
        modelName: 'Foundation Model 1',
        answerFaithfulness: 0.92,
        chunkMethod: 'Fixed',
        chunkSize: 256,
      },
      {
        id: '3',
        rank: 3,
        patternName: 'Pattern 3',
        modelName: 'Foundation Model 2',
        answerFaithfulness: 0.89,
        chunkMethod: 'Semantic',
        chunkSize: 1024,
      },
    ];
    
    // Simulate async experiment completion
    setTimeout(() => {
      setPatternResults(mockResults);
      setExperimentRunning(false);
      setExperimentCompleted(true);
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

  const handleViewExperimentDetails = () => {
    // TODO: Implement view experiment details
    console.log('View experiment details');
  };

  const handleViewExperimentCode = () => {
    // TODO: Implement view experiment code
    console.log('View experiment code');
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

  const handleCriteriaToggle = (criterion: string) => {
    const newSet = new Set(criteria);
    if (newSet.has(criterion)) {
      newSet.delete(criterion);
    } else {
      newSet.add(criterion);
    }
    setCriteria(newSet);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const handleBack = () => {
    if (isConfiguring) {
      // Go back from configuration to form
      setIsConfiguring(false);
      setIsCreating(true);
      setExperimentCreated(false);
      setDocuments([]);
      setHasAddedDocuments(false);
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

  return (
    <>
      {/* Title Section */}
      <PageSection id="autorag-header">
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <Title headingLevel="h2" size="xl" id="autorag-title">
              AutoRAG
            </Title>
          </FlexItem>
        </Flex>
        <div style={{ color: 'var(--pf-v5-global--Color--200)', marginTop: '0.5rem' }}>
          {isCreating
            ? 'Automatically prepare and optimize a RAG pattern based on your document collections'
            : experimentCreated
            ? 'Automatically prepare and optimize a RAG pattern based on your document collections'
            : 'Automatically configure and optimize your Retrieval-Augmented Generation workflows.'}
        </div>
      </PageSection>

      {/* Project Selector */}
      {flags.showProjectWorkspaceDropdowns && (
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
      <PageSection style={{ paddingTop: '0.5rem' }} id="autorag-content">
        {experimentCompleted ? (
          <>
            {/* Results Screen Header */}
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '2rem' }}>
              <FlexItem>
                <Title headingLevel="h1" size="lg" id="autorag-results-title">
                  Pipeline view of my system
                </Title>
              </FlexItem>
              <FlexItem>
                <Flex spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                    <Button variant="secondary" onClick={handleViewExperimentDetails} id="view-experiment-details-button">
                      View experiment details
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="secondary" onClick={handleViewExperimentCode} id="view-experiment-code-button">
                      View experiment code
                    </Button>
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>

            {/* Pipeline Visualization */}
            <div style={{ marginBottom: '3rem', padding: '2rem', backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)', borderRadius: '4px', border: '1px solid var(--pf-v5-global--BorderColor--200)' }}>
              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }} wrap="wrap">
                {/* Step 1 */}
                <FlexItem>
                  <Label color="blue" style={{ padding: '0.75rem 1rem', fontSize: 'var(--pf-v5-global--FontSize--md)', minWidth: '100px', textAlign: 'center' }} id="pipeline-step-1">
                    Step 1
                  </Label>
                </FlexItem>
                <FlexItem>
                  <div style={{ fontSize: '1.5rem' }}>→</div>
                </FlexItem>
                
                {/* Step 2 */}
                <FlexItem>
                  <Label color="blue" style={{ padding: '0.75rem 1rem', fontSize: 'var(--pf-v5-global--FontSize--md)', minWidth: '100px', textAlign: 'center' }} id="pipeline-step-2">
                    Step 2
                  </Label>
                </FlexItem>
                <FlexItem>
                  <div style={{ fontSize: '1.5rem' }}>→</div>
                </FlexItem>
                
                {/* Step 3 */}
                <FlexItem>
                  <Label color="blue" style={{ padding: '0.75rem 1rem', fontSize: 'var(--pf-v5-global--FontSize--md)', minWidth: '100px', textAlign: 'center' }} id="pipeline-step-3">
                    Step 3
                  </Label>
                </FlexItem>
                <FlexItem>
                  <div style={{ fontSize: '1.5rem' }}>→</div>
                </FlexItem>
                
                {/* Foundation Models Branch */}
                <FlexItem>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <Label color="blue" style={{ padding: '0.75rem 1rem', fontSize: 'var(--pf-v5-global--FontSize--md)', minWidth: '120px', textAlign: 'center' }} id="pipeline-foundation-model-1">
                      Foundation Model 1
                    </Label>
                    <div style={{ fontSize: '1.5rem' }}>↓</div>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <Label color="green" style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--pf-v5-global--FontSize--sm)' }} id="pipeline-pattern-1">
                        Pattern 1
                      </Label>
                      <Label color="green" style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--pf-v5-global--FontSize--sm)' }} id="pipeline-pattern-2">
                        Pattern 2
                      </Label>
                    </Flex>
                  </Flex>
                </FlexItem>
                
                <FlexItem>
                  <div style={{ fontSize: '1.5rem' }}>→</div>
                </FlexItem>
                
                <FlexItem>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <Label color="blue" style={{ padding: '0.75rem 1rem', fontSize: 'var(--pf-v5-global--FontSize--md)', minWidth: '120px', textAlign: 'center' }} id="pipeline-foundation-model-2">
                      Foundation Model 2
                    </Label>
                    <div style={{ fontSize: '1.5rem' }}>↓</div>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <Label color="green" style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--pf-v5-global--FontSize--sm)' }} id="pipeline-pattern-3">
                        Pattern 3
                      </Label>
                      <Label color="green" style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--pf-v5-global--FontSize--sm)' }} id="pipeline-pattern-4">
                        Pattern 4
                      </Label>
                    </Flex>
                  </Flex>
                </FlexItem>
                
                <FlexItem>
                  <div style={{ fontSize: '1.5rem' }}>→</div>
                </FlexItem>
                
                <FlexItem>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <Label color="blue" style={{ padding: '0.75rem 1rem', fontSize: 'var(--pf-v5-global--FontSize--md)', minWidth: '120px', textAlign: 'center' }} id="pipeline-foundation-model-3">
                      Foundation Model 3
                    </Label>
                    <div style={{ fontSize: '1.5rem' }}>↓</div>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <Label color="green" style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--pf-v5-global--FontSize--sm)' }} id="pipeline-pattern-5">
                        Pattern 5
                      </Label>
                      <Label color="green" style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--pf-v5-global--FontSize--sm)' }} id="pipeline-pattern-6">
                        Pattern 6
                      </Label>
                    </Flex>
                  </Flex>
                </FlexItem>
              </Flex>
            </div>

            {/* Results Table */}
            <Title headingLevel="h2" size="md" id="autorag-results-table-title" style={{ marginBottom: '1rem' }}>
              Results
            </Title>
            <Table aria-label="Pattern results table" variant="compact" id="autorag-results-table">
              <Thead>
                <Tr>
                  <Th>Rank</Th>
                  <Th>Pattern name</Th>
                  <Th>Model name</Th>
                  <Th>Answer faithfulness</Th>
                  <Th>Chunk method</Th>
                  <Th>Chunk size</Th>
                  <Th width={30}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {patternResults.map((result) => (
                  <Tr key={result.id} id={`result-row-${result.id}`}>
                    <Td dataLabel="Rank">{result.rank}</Td>
                    <Td dataLabel="Pattern name">{result.patternName}</Td>
                    <Td dataLabel="Model name">{result.modelName}</Td>
                    <Td dataLabel="Answer faithfulness">{result.answerFaithfulness.toFixed(2)}</Td>
                    <Td dataLabel="Chunk method">{result.chunkMethod}</Td>
                    <Td dataLabel="Chunk size">{result.chunkSize}</Td>
                    <Td dataLabel="Actions">
                      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Button
                            variant="link"
                            onClick={() => handleViewDetails(result.id)}
                            id={`view-details-${result.id}`}
                          >
                            View details
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button
                            variant="link"
                            onClick={() => handleTestInPlayground(result.id)}
                            id={`test-playground-${result.id}`}
                          >
                            Test in playground
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button
                            variant="link"
                            onClick={() => handleViewCode(result.id)}
                            id={`view-code-${result.id}`}
                          >
                            View code
                          </Button>
                        </FlexItem>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        ) : experimentCreated ? (
          <>
            {/* Experiment Header */}
            <Flex alignItems={{ default: 'alignItemsBaseline' }} spaceItems={{ default: 'spaceItemsMd' }} style={{ marginBottom: '2rem' }}>
              <FlexItem>
                <Title headingLevel="h1" size="lg" id="autorag-experiment-name">
                  {experimentName}
                </Title>
              </FlexItem>
              <FlexItem>
                <div style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                  Last saved: {experimentLastSaved ? formatLastSaved(experimentLastSaved) : ''}
                </div>
              </FlexItem>
            </Flex>

            {/* Configuration Screen */}
            <Grid hasGutter>
              {/* Column 1: Sources */}
              <GridItem span={4}>
                <Card id="autorag-sources-card">
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h2" size="md" id="autorag-sources-title" style={{ color: 'var(--pf-v5-global--primary-color--100)' }}>
                        Sources
                      </Title>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    {/* Upload Area */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px dashed var(--pf-v5-global--BorderColor--200)', borderRadius: '4px' }}>
                      <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsMd' }}>
                        <FlexItem>
                          <div style={{ fontSize: '2rem', color: 'var(--pf-v5-global--Color--200)' }}>
                            <FolderOpenIcon />
                          </div>
                        </FlexItem>
                        <FlexItem grow={{ default: 'grow' }}>
                          <Title headingLevel="h3" size="md" id="autorag-upload-title" style={{ marginBottom: '0.5rem' }}>
                            Add document and evaluation sources
                          </Title>
                          <div style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)', marginBottom: '1rem' }}>
                            Drag and drop or browse existing collection and evaluation files from your local computer, this project or a connection.
                            <br />
                            <br />
                            <strong>Tip:</strong> To upload more than 20 document files, add the files to a COS bucket folder, then select the folder.
                          </div>
                          <Button variant="secondary" onClick={handleChooseDocuments} id="add-documents-config-button">
                            Add documents
                          </Button>
                        </FlexItem>
                      </Flex>
                    </div>

                    {/* Document Table */}
                    {documents.length > 0 && (
                      <Table aria-label="Documents table" variant="compact" id="autorag-sources-documents-table">
                        <Thead>
                          <Tr>
                            <Th>Name</Th>
                            <Th>Type</Th>
                            <Th width={10}>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {documents.map((doc) => (
                            <Tr key={doc.id} id={`source-document-row-${doc.id}`}>
                              <Td dataLabel="Name">{doc.name}</Td>
                              <Td dataLabel="Type">{doc.type}</Td>
                              <Td dataLabel="Actions">
                                <Button
                                  variant="plain"
                                  onClick={() => handleDeleteDocument(doc.id)}
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
                    )}
                  </CardBody>
                </Card>
              </GridItem>

                  {/* Column 2: Configure Details */}
                  <GridItem span={8}>
                    <Card id="autorag-configure-card" style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      maxHeight: 'calc(100vh - 300px)', 
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
                            <EmptyState headingLevel="h3" titleText="Upload some documents first to get started" id="configure-details-empty-state">
                              <EmptyStateBody>
                                Add documents in the Sources column to begin configuring your experiment.
                              </EmptyStateBody>
                            </EmptyState>
                          </div>
                        ) : (
                        <Form id="autorag-configure-form">
                          {/* Vector Database Location */}
                          <FormGroup
                            label="Where would you like to index your documents?"
                            fieldId="vector-database"
                            style={{ marginBottom: '1.5rem' }}
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
                            label="Which data source would you like to use for evaluation?"
                            fieldId="evaluation-source"
                            style={{ marginBottom: '1.5rem' }}
                          >
                            <Select
                              isOpen={isEvaluationSourceOpen}
                              selected={evaluationSource}
                              onSelect={(_event, value) => {
                                setEvaluationSource(value as string);
                                setIsEvaluationSourceOpen(false);
                              }}
                              onOpenChange={(isOpen) => setIsEvaluationSourceOpen(isOpen)}
                              toggle={(toggleRef) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setIsEvaluationSourceOpen(!isEvaluationSourceOpen)}
                                  isExpanded={isEvaluationSourceOpen}
                                  id="evaluation-source-toggle"
                                >
                                  {evaluationSource || 'Evaluation source'}
                                </MenuToggle>
                              )}
                              id="evaluation-source-select"
                            >
                              <SelectList>
                                <SelectOption value="evaluation source a">evaluation source a</SelectOption>
                                <SelectOption value="evaluation source b">evaluation source b</SelectOption>
                                <SelectOption value="evaluation source c">evaluation source c</SelectOption>
                              </SelectList>
                            </Select>
                            <FormHelperText>
                              <HelperText>
                                <HelperTextItem>Optionally supply a JSON file with test questions and answers to evaluate the quality of Q&A responses. If none are selected, evaluation data will be automatically generated with an LLM.</HelperTextItem>
                              </HelperText>
                            </FormHelperText>
                          </FormGroup>

                          {/* Evaluation Source Settings Button */}
                          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                            <Button
                              variant="secondary"
                              icon={<CogIcon />}
                              onClick={() => setIsEvaluationSettingsModalOpen(true)}
                              id="evaluation-source-settings-button"
                            >
                              Evaluation source settings
                            </Button>
                          </div>

                          {/* Selected Settings Display */}
                          <Grid hasGutter style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                            <GridItem span={6}>
                              <div id="optimization-metric-column">
                                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)', marginBottom: '0.5rem' }}>
                                  Optimization metric
                                </div>
                                <Button
                                  variant="link"
                                  isInline
                                  onClick={() => setIsEvaluationSettingsModalOpen(true)}
                                  style={{ fontSize: '1.5rem', padding: 0, fontWeight: 'var(--pf-v5-global--FontWeight--normal)' }}
                                  id="optimization-metric-link"
                                >
                                  {criteria.size > 0 ? Array.from(criteria).join(', ') : 'None selected'}
                                </Button>
                              </div>
                            </GridItem>
                            <GridItem span={6}>
                              <div id="models-to-consider-column">
                                <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)', marginBottom: '0.5rem' }}>
                                  Models to consider
                                </div>
                                {!hasAddedDocuments ? (
                                  <div style={{ 
                                    fontSize: 'var(--pf-v5-global--FontSize--sm)', 
                                    color: 'var(--pf-v5-global--Color--200)', 
                                    fontStyle: 'italic',
                                    paddingTop: '0.25rem'
                                  }}>
                                    Upload one or more document in the column to the left to get started.
                                  </div>
                                ) : (
                                  <Button
                                    variant="link"
                                    isInline
                                    onClick={() => setIsEvaluationSettingsModalOpen(true)}
                                    style={{ fontSize: '1.5rem', padding: 0, fontWeight: 'var(--pf-v5-global--FontWeight--normal)' }}
                                    id="models-to-consider-link"
                                  >
                                    {selectedFoundationModels.size > 0 || selectedEmbeddingModels.size > 0
                                      ? `${selectedFoundationModels.size} foundation${selectedFoundationModels.size !== 1 ? 's' : ''}, ${selectedEmbeddingModels.size} embedding${selectedEmbeddingModels.size !== 1 ? 's' : ''}`
                                      : 'None selected'}
                                  </Button>
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

                {/* Bottom Action Bar */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem 1.5rem', 
                  backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)', 
                  borderTop: '1px solid var(--pf-v5-global--BorderColor--200)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem'
                }}>
                  <Button variant="secondary" onClick={handleBack} id="config-back-button">
                    Back
                  </Button>
                  <Button variant="primary" onClick={handleRunExperiment} id="run-experiment-button">
                    Run experiment
                  </Button>
                </div>
              </>
            ) : !isCreating ? (
          <EmptyState headingLevel="h2" titleText="AutoRAG Experiment" icon={PlusCircleIcon} id="autorag-empty-state">
            <EmptyStateBody>
              Automatically prepare and optimize RAG patterns based on your document collection.
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="primary" onClick={handleCreateExperiment} id="create-autorag-experiment-button">
                  Create AutoRAG Experiment
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        ) : (
          <>
            

            <Form id="autorag-experiment-form" isWidthLimited>
              <Title headingLevel="h2" size="md" id="autorag-details-header" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                Define Details
              </Title>

              <FormGroup label="Name" isRequired fieldId="autorag-name" style={{ marginTop: '1rem' }}>
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

              <Flex style={{ marginTop: '2rem', gap: '1rem' }}>
                <FlexItem>
                  <Button variant="primary" onClick={handleSubmit} id="autorag-create-button">
                    Create
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button variant="secondary" onClick={handleCancel} id="autorag-cancel-button">
                    Cancel
                  </Button>
                </FlexItem>
              </Flex>
            </Form>
          </>
        )}
  </PageSection>

      {/* Evaluation Source Settings Modal */}
      <Modal
        variant={ModalVariant.large}
        isOpen={isEvaluationSettingsModalOpen}
        onClose={() => setIsEvaluationSettingsModalOpen(false)}
        id="evaluation-settings-modal"
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl" id="evaluation-settings-modal-title">
            Evaluation source settings
          </Title>
        </ModalHeader>
        <ModalBody>
          <Form id="evaluation-settings-form">
            {/* Models to Test - Tabbed Layout */}
            <FormGroup
              label="Models to test"
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
                          <Th>Tag</Th>
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
                            <Td dataLabel="Tag">
                              <Label>{model.tag}</Label>
                            </Td>
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
                          <Th>Tag</Th>
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
                            <Td dataLabel="Tag">
                              <Label>{model.tag}</Label>
                            </Td>
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
              fieldId="criteria"
              style={{ marginBottom: '1.5rem' }}
            >
              <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                <FlexItem>
                  <Checkbox
                    id="criteria-faithfulness"
                    isChecked={criteria.has('answer faithfulness')}
                    onChange={() => handleCriteriaToggle('answer faithfulness')}
                    label="answer faithfulness"
                  />
                </FlexItem>
                <FlexItem>
                  <Checkbox
                    id="criteria-correctness"
                    isChecked={criteria.has('answer correctness')}
                    onChange={() => handleCriteriaToggle('answer correctness')}
                    label="answer correctness"
                  />
                </FlexItem>
                <FlexItem>
                  <Checkbox
                    id="criteria-context"
                    isChecked={criteria.has('context correctness')}
                    onChange={() => handleCriteriaToggle('context correctness')}
                    label="context correctness"
                  />
                </FlexItem>
              </Flex>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsEvaluationSettingsModalOpen(false)} id="evaluation-settings-close-button">
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Documents Modal */}
      <Modal
        variant={ModalVariant.large}
        isOpen={isAddDocumentsModalOpen}
        onClose={handleAddDocumentsModalClose}
        id="add-documents-modal"
      >
        <ModalHeader>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h2" size="xl" id="add-documents-modal-title">
                Add documents
              </Title>
            </FlexItem>
            <FlexItem>
              <Button variant="secondary" onClick={handleAddConnection} id="add-connection-modal-button">
                Add connection
              </Button>
            </FlexItem>
          </Flex>
        </ModalHeader>
        <ModalBody>
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
            id="add-documents-file-upload"
          >
            <MultipleFileUploadMain
              titleIcon={<FolderOpenIcon />}
              titleText="Drag and drop files here"
              titleTextSeparator="or"
              infoText="Accepted file types: PDF, TXT, JSON, DOCX, DOC"
            />
            {uploadedFiles.length > 0 && (
              <MultipleFileUploadStatus>
                {uploadedFiles.map((file, index) => (
                  <MultipleFileUploadStatusItem
                    key={index}
                    file={file}
                    onClearClick={() => handleFileRemove(file)}
                  />
                ))}
              </MultipleFileUploadStatus>
            )}
          </MultipleFileUpload>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="primary" 
            onClick={handleAddDocumentsConfirm} 
            id="add-documents-confirm-button"
            isDisabled={uploadedFiles.length === 0}
          >
            Add documents
          </Button>
          <Button variant="secondary" onClick={handleAddDocumentsModalClose} id="add-documents-cancel-button">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { AutoRAG };

