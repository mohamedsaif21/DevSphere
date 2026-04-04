export type LanguageKey = 'python' | 'java' | 'c';

export interface LanguageConfig {
  name: string;
  file: string;
  pistonLang: string;
  pistonVersion: string;
  dotClass: string;
  starter: string;
  color: string;
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