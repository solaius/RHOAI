// Type definitions for Prompt Lab feature

export type PromptType = 'text' | 'chat';

export interface PromptVariable {
  name: string;
  value?: string;
}

export interface PromptVersion {
  id: string;
  versionNumber: string;
  registeredAt: Date;
  promptText: string;
  promptType: PromptType;
  variables: string[]; // Array of variable names extracted from promptText
  aliases: string[];
  metadata: Record<string, string>;
  commitMessage?: string;
}

export interface Prompt {
  id: string;
  name: string;
  description?: string;
  latestVersion: string;
  lastModified: Date;
  createdDate: Date;
  commitMessage?: string;
  alias?: string;
  tags: string[];
  project: string;
  versions: PromptVersion[];
}

export interface PromptFormData {
  name: string;
  promptType: PromptType;
  promptText: string;
  commitMessage?: string;
}

export interface PromptVersionFormData {
  versionNumber: string;
  promptType: PromptType;
  promptText: string;
  commitMessage?: string;
}

