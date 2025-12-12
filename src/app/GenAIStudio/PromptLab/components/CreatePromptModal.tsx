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
import { PromptType } from '../types';

interface CreatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (promptData: {
    name: string;
    promptType: PromptType;
    promptText: string;
    commitMessage?: string;
  }) => Promise<void>;
  initialPromptText?: string;
  initialPromptType?: PromptType;
}

export const CreatePromptModal: React.FunctionComponent<CreatePromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPromptText = '',
  initialPromptType = 'text',
}) => {
  const [name, setName] = React.useState('');
  const [promptType, setPromptType] = React.useState<PromptType>(initialPromptType);
  const [promptText, setPromptText] = React.useState(initialPromptText);
  const [commitMessage, setCommitMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isOpen) {
      setName('');
      setPromptType(initialPromptType);
      setPromptText(initialPromptText);
      setCommitMessage('');
      setErrors({});
    }
  }, [isOpen, initialPromptText, initialPromptType]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
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
        name: name.trim(),
        promptType,
        promptText: promptText.trim(),
        commitMessage: commitMessage.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error creating prompt:', error);
      setErrors({ submit: 'Failed to create prompt. Please try again.' });
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
      id="create-prompt-modal"
    >
      <ModalHeader title="Create prompt" />
      <ModalBody>
        <Form>
          <FormGroup label="Name:" isRequired fieldId="prompt-name">
            <TextInput
              isRequired
              type="text"
              id="prompt-name"
              name="prompt-name"
              value={name}
              onChange={(_event, value) => {
                setName(value);
                if (errors.name) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              validated={errors.name ? 'error' : 'default'}
              placeholder="Provide an unique prompt name"
            />
            {errors.name && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant="error">{errors.name}</HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>

          <FormGroup label="Prompt type:" fieldId="prompt-type">
            <ToggleGroup aria-label="Prompt type selection" id="prompt-type-toggle">
              <ToggleGroupItem
                text="Text"
                buttonId="prompt-type-text"
                isSelected={promptType === 'text'}
                onChange={() => setPromptType('text')}
              />
              <ToggleGroupItem
                text="Chat"
                buttonId="prompt-type-chat"
                isSelected={promptType === 'chat'}
                onChange={() => setPromptType('chat')}
              />
            </ToggleGroup>
          </FormGroup>

          <FormGroup label="Prompt:" isRequired fieldId="prompt-text">
            <TextArea
              isRequired
              type="text"
              id="prompt-text"
              name="prompt-text"
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

          <FormGroup label="Commit message (optional):" fieldId="commit-message">
            <TextInput
              type="text"
              id="commit-message"
              name="commit-message"
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
          id="create-prompt-button"
        >
          Create
        </Button>
        <Button
          key="cancel"
          variant="link"
          onClick={handleClose}
          isDisabled={isSubmitting}
          id="cancel-create-prompt-button"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

