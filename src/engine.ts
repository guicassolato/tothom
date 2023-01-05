import hljs from 'highlight.js';

import * as terminal from './terminal';
import { slugify } from './slugify';

const engine = require('markdown-it');
const taskLists = require('markdown-it-task-lists');
const markdownItAttrs = require('markdown-it-attrs');

const defaultRunInTerminalLabel = '▶️';
const defaultRunInTerminalTitle = 'Run in terminal';

export type RendererRuleFunc = (tokens: any[], idx: number, options: Object, env: Object, self: any) => any;

export interface EngineOptions {
  runInTerminalLabel?: string;
  runInTerminalTitle?: string;
};

export class Engine {
  private _engine: any;
  private _originalImageFunc: RendererRuleFunc;
  private _originalHeadingOpenFunc: RendererRuleFunc;

  constructor(private options?: EngineOptions) {
    this._engine = engine({
      html: true,
      linkify: true,
      typographer: true,
      highlight: this.renderCodeBlock
    }).use(taskLists)
      .use(markdownItAttrs);

    this._originalImageFunc = this._engine.renderer.rules.image;
    this._originalHeadingOpenFunc = this._engine.renderer.rules.heading_open;
    this._engine.renderer.rules.heading_open = this.headingOpen();
  };

  setOptions = (opts: EngineOptions | undefined) => this.options = opts;

  render = (content: string, options?: { imageFunc?: RendererRuleFunc }): string => {
    if (options?.imageFunc) {
      this._engine.renderer.rules.image = options?.imageFunc;
    }
    const html = this._engine.render(content);
    this._engine.renderer.rules.image = this._originalImageFunc;
    return html;
  };

  parseInline = (text: string, env: object): any[] => {
    return this._engine.parseInline(text, env);
  };

  private runInTerminalLabel = (): string => this.options?.runInTerminalLabel || defaultRunInTerminalLabel;
  private runInTerminalTitle = (): string => this.options?.runInTerminalTitle || defaultRunInTerminalTitle;

  private renderCodeBlock = (code: string, language: string): string => {
    const codeAttrs = (language !== "") ? ` class="language-${language}"` : '';

    let link = "";
    switch (language) {
      case 'bash':
      case 'sh':
      case 'zsh':
        link = `<a href="tothom://?p=${terminal.encodeTerminalCommand(code, true)}" class="tothom-code-action" title="${this.runInTerminalTitle()}">${this.runInTerminalLabel()}</a>`;
        break;
      default:
        break;
    }

    return `<pre class="hljs"><code${codeAttrs}>${this.syntaxHighlight(code, language)}</code>${link}</pre>`;
  };

  private syntaxHighlight = (code: string, language: string): string => {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language: language, ignoreIllegals: true }).value;
      } catch (err) {
        console.error(err);
      }
    }
    return engine.utils.escapeHtml(code);
  };

  private headingOpen = (): RendererRuleFunc => {
    var slugCount = new Map<string, number>();

    return (tokens: any[], idx: number, options: Object, env: Object, self: any) => {
      const raw = tokens[idx + 1].content;
      let slug = slugify(this, raw, { env });

      let lastCount = slugCount.get(slug);
      if (lastCount) {
        lastCount++;
        slugCount.set(slug, lastCount);
        slug += '-' + lastCount;
      } else {
        slugCount.set(slug, 0);
      }

      tokens[idx].attrs = [...(tokens[idx].attrs || []), ["id", slug]];

      if (this._originalHeadingOpenFunc) {
        return this._originalHeadingOpenFunc(tokens, idx, options, env, self);
      } else {
        return self.renderToken(tokens, idx, options);
      }
    };
  };
};
