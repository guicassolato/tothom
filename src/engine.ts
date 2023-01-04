import hljs from 'highlight.js';

import * as terminal from './terminal';
import { slugify } from './slugify';

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

const taskLists = require('markdown-it-task-lists');

export const engine = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: renderCodeBlock
}).use(taskLists);

const originalHeadingOpen = engine.renderer.rules.heading_open;

const headingOpen = (): (tokens: any[], idx: number, options: Object, env: Object, self: any) => any => {
  var slugCount = new Map<string, number>();

  return (tokens: any[], idx: number, options: Object, env: Object, self: any) => {
    const raw = tokens[idx + 1].content;
    let slug = slugify(raw, { env });

    let lastCount = slugCount.get(slug);
    if (lastCount) {
      lastCount++;
      slugCount.set(slug, lastCount);
      slug += '-' + lastCount;
    } else {
      slugCount.set(slug, 0);
    }

    tokens[idx].attrs = [...(tokens[idx].attrs || []), ["id", slug]];

    if (originalHeadingOpen) {
      return originalHeadingOpen(tokens, idx, options, env, self);
    } else {
      return self.renderToken(tokens, idx, options);
    }
  };
};

engine.renderer.rules.heading_open = headingOpen();
