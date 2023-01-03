import hljs from 'highlight.js';

import * as terminal from './terminal';

const renderCodeBlock = (code: string, language: string): string => {
  const codeAttrs = (language !== "") ? ` class="language-${language}"` : '';

  let link = "";
  switch (language) {
    case 'bash':
    case 'sh':
    case 'zsh':
      link = `<a href="tothom://?code=${terminal.encodeTerminalCommand(code, true)}" class="tothom-code-action" title="Run in terminal">▶️</a>`;
      break;
    default:
      break;
  }

  return `<pre class="hljs"><code${codeAttrs}>${syntaxHighlight(code, language)}</code>${link}</pre>`;
};

const syntaxHighlight = (code: string, language: string): string => {
  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(code, { language: language, ignoreIllegals: true }).value;
    } catch (err) {
      console.error(err);
    }
  }
  return engine.utils.escapeHtml(code);
};

export const engine = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: renderCodeBlock
});
