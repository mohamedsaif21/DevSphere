export type LanguageKey = 'python' | 'java' | 'c';
export type TerminalTab = 'output' | 'errors' | 'ai';

export interface LanguageConfig {
  name: string;
  file: string;
  pistonLang: string;
  pistonVersion: string;
  color: string;
  starter: string;
}

export interface PistonResponse {
  run?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

export interface OutputLine {
  text: string;
  type: 'output' | 'error' | 'info' | 'prompt';
}

export interface ErrorItem {
  message: string;
  isError: boolean;
}

export interface AIResponse {
  lines: AILine[];
}

export interface AILine {
  text: string;
  type: 'title' | 'text' | 'code' | 'spacer';
}
