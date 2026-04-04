export type Language = 'JavaScript' | 'Python' | 'Java' | 'C';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  icon?: string;
  color?: string;
  active?: boolean;
  children?: FileNode[];
}