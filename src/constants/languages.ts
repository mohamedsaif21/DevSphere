import { LanguageConfig, LanguageKey } from '../types/compiler';

export const LANG_CONFIG: Record<LanguageKey, LanguageConfig> = {
  python: {
    name: 'Python',
    file: 'main.py',
    pistonLang: 'python',
    pistonVersion: '3.10.0',
    color: '#3b82f6',
    starter: `# DevSphere — Python Compiler
# Write your code below and click Run!

def greet(name):
    return f"Hello, {name}! Welcome to DevSphere."

name = "World"
print(greet(name))

# Try some math
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum of {numbers} = {total}")
`,
  },
  java: {
    name: 'Java',
    file: 'Main.java',
    pistonLang: 'java',
    pistonVersion: '15.0.2',
    color: '#f97316',
    starter: `// DevSphere — Java Compiler
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, DevSphere!");

        // Simple loop
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}
`,
  },
  c: {
    name: 'C',
    file: 'main.c',
    pistonLang: 'c',
    pistonVersion: '10.2.0',
    color: '#22d3ee',
    starter: `// DevSphere — C Compiler
#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    printf("Hello, DevSphere!\\n");

    for (int i = 1; i <= 5; i++) {
        printf("%d! = %d\\n", i, factorial(i));
    }
    return 0;
}
`,
  },
};
