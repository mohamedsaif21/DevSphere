export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function parseAIText(text: string) {
  const lines = text.split('\n');
  const result: { type: 'title' | 'text' | 'code' | 'spacer'; content: string }[] = [];

  let inCode = false;
  let codeBlock = '';

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        result.push({ type: 'code', content: codeBlock.trim() });
        codeBlock = '';
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBlock += line + '\n';
      continue;
    }
    if (/^#+\s/.test(line) || /^\d+\.\s/.test(line) || /^\*\*/.test(line)) {
      const clean = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
      result.push({ type: 'title', content: clean });
    } else if (line.trim()) {
      result.push({ type: 'text', content: line });
    } else {
      result.push({ type: 'spacer', content: '' });
    }
  }

  return result;
}
