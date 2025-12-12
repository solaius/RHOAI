import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalVariant,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Button,
  FormHelperText,
  HelperText,
  HelperTextItem,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import { Prompt, PromptType, PromptVersion } from '../types';

interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (versionData: {
    versionNumber: string;
    promptType: PromptType;
    promptText: string;
    commitMessage?: string;
  }) => Promise<void>;
  existingPrompt?: Prompt;
  currentPromptText?: string;
}

export const CreateVersionModal: React.FunctionComponent<CreateVersionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingPrompt,
  currentPromptText,
}) => {
  const [versionNumber, setVersionNumber] = React.useState('');
  const [promptType, setPromptType] = React.useState<PromptType>('text');
  const [promptText, setPromptText] = React.useState('');
  const [commitMessage, setCommitMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isOpen && existingPrompt) {
      // Calculate next version number
      const versions = existingPrompt.versions || [];
      const latestVersion = versions[versions.length - 1];
      
      if (latestVersion) {
        const parts = latestVersion.versionNumber.split('.');
        const major = parseInt(parts[0] || '1', 10);
        const minor = parseInt(parts[1] || '0', 10);
        const nextVersion = `${major}.${minor + 1}`;
        setVersionNumber(nextVersion);
        
        // Pre-populate with previous version's text
        setPromptText(currentPromptText || latestVersion.promptText);
        setPromptType(latestVersion.promptType);
      } else {
        setVersionNumber('1.0');
        setPromptText(currentPromptText || '');
        setPromptType('text');
      }
      
      setCommitMessage('');
      setErrors({});
    }
  }, [isOpen, existingPrompt, currentPromptText]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!versionNumber.trim()) {
      newErrors.versionNumber = 'Version number is required';
    }

    if (!promptText.trim()) {
      newErrors.promptText = 'Prompt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        versionNumber: versionNumber.trim(),
        promptType,
        promptText: promptText.trim(),
        commitMessage: commitMessage.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error creating version:', error);
      setErrors({ submit: 'Failed to create version. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={handleClose}
      id="create-version-modal"
    >
      <ModalHeader title="Create prompt version" />
      <ModalBody>
        <Form>
          <FormGroup label="Version number:" isRequired fieldId="version-number">
            <TextInput
              isRequired
              type="text"
              id="version-number"
              name="version-number"
              value={versionNumber}
              onChange={(_event, value) => {
                setVersionNumber(value);
                if (errors.versionNumber) {
                  setErrors({ ...errors, versionNumber: '' });
                }
              }}
              validated={errors.versionNumber ? 'error' : 'default'}
            />
            {errors.versionNumber && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant="error">{errors.versionNumber}</HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>

          <FormGroup label="Prompt type:" fieldId="version-prompt-type">
            <ToggleGroup aria-label="Prompt type selection" id="version-prompt-type-toggle">
              <ToggleGroupItem
                text="Text"
                buttonId="version-prompt-type-text"
                isSelected={promptType === 'text'}
                onChange={() => setPromptType('text')}
              />
              <ToggleGroupItem
                text="Chat"
                buttonId="version-prompt-type-chat"
                isSelected={promptType === 'chat'}
                onChange={() => setPromptType('chat')}
              />
            </ToggleGroup>
          </FormGroup>

          <FormGroup label="Prompt:" isRequired fieldId="version-prompt-text">
            <TextArea
              isRequired
              type="text"
              id="version-prompt-text"
              name="version-prompt-text"
              value={promptText}
              onChange={(_event, value) => {
                setPromptText(value);
                if (errors.promptText) {
                  setErrors({ ...errors, promptText: '' });
                }
              }}
              validated={errors.promptText ? 'error' : 'default'}
              rows={8}
              placeholder="Type prompt content here. Wrap variables with double curly brace e.g. {{ name }}."
            />
            {errors.promptText && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant="error">{errors.promptText}</HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>

          <FormGroup label="Commit message (optional):" fieldId="version-commit-message">
            <TextInput
              type="text"
              id="version-commit-message"
              name="version-commit-message"
              value={commitMessage}
              onChange={(_event, value) => setCommitMessage(value)}
            />
          </FormGroup>

          {errors.submit && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant="error">{errors.submit}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          key="create"
          variant="primary"
          onClick={handleSubmit}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          id="create-version-button"
        >
          Create
        </Button>
        <Button
          key="cancel"
          variant="link"
          onClick={handleClose}
          isDisabled={isSubmitting}
          id="cancel-create-version-button"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

