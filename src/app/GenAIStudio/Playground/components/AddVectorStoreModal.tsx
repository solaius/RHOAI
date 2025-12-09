import React, { useState } from 'react';
import {
  Button,
  Divider,
  FileUpload,
  Flex,
  FlexItem,
  FormGroup,
  FormSection,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalVariant,
  Select,
  SelectList,
  SelectOption,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  TextArea,
  TextInput,
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import { TrashIcon, UploadIcon } from '@patternfly/react-icons';

interface AddVectorStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vectorStore: any) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

export const AddVectorStoreModal: React.FunctionComponent<AddVectorStoreModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [vectorStoreType, setVectorStoreType] = useState('in-memory');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-ada-002');
  const [isEmbeddingModelOpen, setIsEmbeddingModelOpen] = useState(false);
  const [chunkSize, setChunkSize] = useState('512');
  const [chunkOverlap, setChunkOverlap] = useState('50');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // File upload state
  const [filename, setFilename] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileInputChange = (_event: React.ChangeEvent<HTMLInputElement>, file: File) => {
    setFilename(file.name);
    setIsLoading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'application/pdf'
      };
      setUploadedFiles([...uploadedFiles, newFile]);
      setFilename('');
      setIsLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    setFilename('');
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(files => files.filter(f => f.id !== fileId));
  };

  const handleCreate = () => {
    const newVectorStore = {
      id: Date.now().toString(),
      name: name || 'Untitled vector store',
      type: vectorStoreType === 'in-memory' ? 'In memory' : 'External connection',
      selected: true,
      embeddingModel,
      chunkSize,
      chunkOverlap,
      files: uploadedFiles
    };
    onSave(newVectorStore);
    handleModalClose();
  };

  const handleModalClose = () => {
    // Reset form
    setName('');
    setDescription('');
    setUploadedFiles([]);
    setFilename('');
    setVectorStoreType('in-memory');
    setEmbeddingModel('text-embedding-ada-002');
    setChunkSize('512');
    setChunkOverlap('50');
    onClose();
  };

  const sidebarPanel = (
    <SidebarPanel width={{ default: 'width_25' }} style={{ padding: '1rem', backgroundColor: 'var(--pf-v6-global--BackgroundColor--100)' }}>
      <ToggleGroup aria-label="Vector store type" isVertical>
        <ToggleGroupItem
          text="In memory"
          buttonId="in-memory"
          isSelected={vectorStoreType === 'in-memory'}
          onChange={() => setVectorStoreType('in-memory')}
        />
        <ToggleGroupItem
          text="External connection"
          buttonId="external-connection"
          isSelected={vectorStoreType === 'external-connection'}
          onChange={() => setVectorStoreType('external-connection')}
        />
      </ToggleGroup>
    </SidebarPanel>
  );

  return (
    <Modal
      variant={ModalVariant.large}
      title="Add vector store"
      description="Create a new vector store to ground your model with custom data within your playground."
      isOpen={isOpen}
      onClose={handleModalClose}
      actions={[
        <Button key="create" variant="primary" onClick={handleCreate} isDisabled={!name}>
          Create
        </Button>,
        <Button key="cancel" variant="link" onClick={handleModalClose}>
          Cancel
        </Button>,
      ]}
    >
      <Sidebar hasGutter>
        {sidebarPanel}
        <SidebarContent style={{ padding: '1rem' }}>
          {vectorStoreType === 'in-memory' ? (
            <>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                New vector store
              </Title>

              {/* File Upload Section */}
              <FormGroup label="Upload documents" fieldId="file-upload">
                <FileUpload
                  id="file-upload"
                  value={filename}
                  filename={filename}
                  filenamePlaceholder="Drag and drop files here or upload"
                  onFileInputChange={handleFileInputChange}
                  onClearClick={handleClear}
                  browseButtonText="Upload"
                  isLoading={isLoading}
                  dropzoneProps={{
                    accept: {
                      'application/pdf': ['.pdf'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                      'image/png': ['.png'],
                      'image/gif': ['.gif']
                    }
                  }}
                />
                <HelperText>
                  <HelperTextItem>Accepted file types: JPEG, PDF, PNG, GIF</HelperTextItem>
                </HelperText>
              </FormGroup>

              {/* Name Field */}
              <FormGroup label="Name" isRequired fieldId="vector-store-name">
                <TextInput
                  id="vector-store-name"
                  value={name}
                  onChange={(_event, value) => setName(value)}
                  placeholder="Name your vector store"
                />
              </FormGroup>

              {/* Description Field */}
              <FormGroup label="Description" fieldId="vector-store-description">
                <TextArea
                  id="vector-store-description"
                  value={description}
                  onChange={(_event, value) => setDescription(value)}
                  placeholder="What is the purpose of this vector store?"
                  rows={3}
                />
              </FormGroup>

              {/* Uploaded Files Table */}
              {uploadedFiles.length > 0 && (
                <FormGroup label="Uploaded documents" fieldId="uploaded-files">
                  <Table variant="compact" aria-label="Uploaded files" id="uploaded-files-table">
                    <Thead>
                      <Tr>
                        <Th>File name</Th>
                        <Th>Size</Th>
                        <Th width={10}></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {uploadedFiles.map((file) => (
                        <Tr key={file.id}>
                          <Td>{file.name}</Td>
                          <Td>{file.size}</Td>
                          <Td>
                            <Button
                              variant="plain"
                              icon={<TrashIcon />}
                              onClick={() => handleRemoveFile(file.id)}
                              aria-label={`Remove ${file.name}`}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </FormGroup>
              )}

              <Divider style={{ margin: '1.5rem 0' }} />

              {/* Advanced Settings */}
              <FormSection title="Advanced settings">
                <FormGroup label="Embedding model" fieldId="embedding-model">
                  <Select
                    id="embedding-model"
                    isOpen={isEmbeddingModelOpen}
                    selected={embeddingModel}
                    onSelect={(_event, value) => {
                      setEmbeddingModel(value as string);
                      setIsEmbeddingModelOpen(false);
                    }}
                    onOpenChange={(isOpen) => setIsEmbeddingModelOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsEmbeddingModelOpen(!isEmbeddingModelOpen)}
                        isExpanded={isEmbeddingModelOpen}
                        style={{ width: '100%' }}
                      >
                        {embeddingModel}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="text-embedding-ada-002">text-embedding-ada-002</SelectOption>
                      <SelectOption value="text-embedding-3-small">text-embedding-3-small</SelectOption>
                      <SelectOption value="text-embedding-3-large">text-embedding-3-large</SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>

                <Grid hasGutter>
                  <GridItem span={6}>
                    <FormGroup label="Chunk size" fieldId="chunk-size">
                      <TextInput
                        id="chunk-size"
                        type="number"
                        value={chunkSize}
                        onChange={(_event, value) => setChunkSize(value)}
                      />
                      <HelperText>
                        <HelperTextItem>Default: 512 tokens</HelperTextItem>
                      </HelperText>
                    </FormGroup>
                  </GridItem>
                  <GridItem span={6}>
                    <FormGroup label="Chunk overlap" fieldId="chunk-overlap">
                      <TextInput
                        id="chunk-overlap"
                        type="number"
                        value={chunkOverlap}
                        onChange={(_event, value) => setChunkOverlap(value)}
                      />
                      <HelperText>
                        <HelperTextItem>Default: 50 tokens</HelperTextItem>
                      </HelperText>
                    </FormGroup>
                  </GridItem>
                </Grid>
              </FormSection>
            </>
          ) : (
            <>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                External connection
              </Title>
              <FormGroup label="Connection" fieldId="external-connection">
                <Select
                  id="external-connection"
                  toggle={(toggleRef) => (
                    <MenuToggle ref={toggleRef} style={{ width: '100%' }}>
                      Select a connection
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="pinecone">Pinecone</SelectOption>
                    <SelectOption value="weaviate">Weaviate</SelectOption>
                    <SelectOption value="chromadb">ChromaDB</SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>
            </>
          )}
        </SidebarContent>
      </Sidebar>
    </Modal>
  );
};

