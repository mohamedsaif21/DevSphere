import { LanguageConfig, LanguageKey } from "../types/compiler";

export const LANG_CONFIG: Record<LanguageKey, LanguageConfig> = {
  python: {
    name: 'Python',
    file: 'main.py',
    pistonLang: 'python',
    pistonVersion: '3.10.0',
    dotClass: 'py-dot',
    color: '#3b82f6',
    starter: `# DevSphere — Python\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))`
  },
  java: {
    name: 'Java',
    file: 'Main.java',
    pistonLang: 'java',
    pistonVersion: '15.0.2',
    dotClass: 'java-dot',
    color: '#f97316',
    starter: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, DevSphere!");\n    }\n}`
  },
  c: {
    name: 'C',
    file: 'main.c',
    pistonLang: 'c',
    pistonVersion: '10.2.0',
    dotClass: 'c-dot',
    color: '#22d3ee',
    starter: `#include <stdio.h>\n\nint main() {\n    printf("Hello, DevSphere!\\n");\n    return 0;\n}`
  }
};