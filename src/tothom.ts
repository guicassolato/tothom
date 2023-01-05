import * as vscode from 'vscode';

import * as utils from './utils';
import * as terminal from './terminal';
import { Engine, EngineOptions, RendererRuleFunc } from './engine';

const WEBVIEW_PANEL_TYPE = 'tothom';

const defaultColorScheme = 'auto';
const defaultBracketedPasteMode = true;

export interface TothomOptions {
  colorScheme?: string;
  bracketedPasteMode?: boolean;
  engineOptions?: EngineOptions;
};

interface TothomPreview {
  uri: vscode.Uri;
  panel: vscode.WebviewPanel;
  terminal?: vscode.Terminal;
}

export class Tothom {
  private _views: Map<string, TothomPreview>;
  private _engine: Engine;

  constructor(private extensionUri: vscode.Uri, private options?: TothomOptions) {
    this._views = new Map<string, TothomPreview>();
    this._engine = new Engine();
    this._engine.setOptions(this.options?.engineOptions);
  }

  // commands

  setOptions = (opts: TothomOptions | undefined) => {
    this.options = opts;
    if (opts?.engineOptions) {
      this._engine.setOptions(opts?.engineOptions);
    }
  };

  openPreview = (uri: vscode.Uri, options?: { terminal?: vscode.Terminal }): vscode.Webview | undefined => {
    const resource = utils.uriOrActiveDocument(uri);

    let preview = this._views.get(resource.fsPath);
    let webview: vscode.Webview | undefined = undefined;

    if (!preview) {
      const title = `Preview: ${utils.resourceName(resource)}`;

      var localResourceRoots = [this.extensionUri];
      if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]) {
        localResourceRoots.push(vscode.workspace.workspaceFolders[0].uri);
      }

      const panel = vscode.window.createWebviewPanel(WEBVIEW_PANEL_TYPE, title, vscode.ViewColumn.Active, {
        enableScripts: true,
        enableFindWidget: true,
        retainContextWhenHidden: true,
        localResourceRoots: localResourceRoots
      });
      panel.onDidDispose(() => this._views.delete(resource.fsPath));

      webview = panel.webview;
      webview.onDidReceiveMessage(this.handleEvent);

      let preview: TothomPreview = { uri: resource, panel: panel };
      if (options?.terminal) {
        preview.terminal = options.terminal;
      }
      this._views.set(resource.fsPath, preview);
    }

    this.reloadPreview(resource);

    return webview;
  };

  reloadPreview = (uri: any, options?: { reveal?: boolean | undefined }): vscode.Webview | undefined => {
    const resource = uri || this.getActivePreviewUri() || utils.uriOrActiveDocument(uri);
    const preview = this._views.get(resource.fsPath);
    const reveal = !options || options.reveal || options.reveal === undefined;

    if (!preview) {
      if (reveal) {
        vscode.window.showInformationMessage(`Tothom preview not found for resource ${utils.resourceName(resource)}`);
      }
      return undefined;
    }

    if (reveal) {
      preview.panel.reveal(0);
    }

    const webview = preview.panel.webview;
    const markdown = utils.readFileContent(resource);
    const html = this._engine.render(markdown, { imageFunc: this.renderImage(webview, resource) });
    webview.html = this.renderHtmlContent(webview, resource, html);

    return webview;
  };

  // private methods

  private colorScheme = (): string => this.options?.colorScheme || defaultColorScheme;
  private bracketedPasteMode = (): boolean => this.options?.bracketedPasteMode || defaultBracketedPasteMode;

  private getActivePreviewUri = (): vscode.Uri | undefined => {
    const uri = [...this._views.keys()].find(key => { return this._views.get(key)?.panel?.active; });
    return uri ? vscode.Uri.parse(uri) : undefined;
  };

  private mediaFilePath = (webview: vscode.Webview, filePath: string): vscode.Uri => {
    return webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', filePath));
  };

  private renderHtmlContent = (webview: vscode.Webview, uri: vscode.Uri, htmlContent: string): string => {
    const cspSrc = webview.cspSource;
    const nonce = utils.getNonce();
    const baseHref = utils.resourceDir(uri);
    const baseTag = `<base href="${baseHref}${baseHref.endsWith('/') ? '' : '/'}"/>`;

    let colorScheme: string = "";
    switch (this.colorScheme()) {
      case "light":
        colorScheme = `tothom-light`;
        break;
      case "dark":
        colorScheme = `tothom-dark`;
        break;
      default:
        colorScheme = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? `tothom-dark` : `tothom-light`;
        break;
    }

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data: https: http: blob: ${cspSrc}; media-src vscode-resource: https: data:; script-src 'nonce-${nonce}' https:; style-src 'unsafe-inline' ${cspSrc} https: data:; font-src ${cspSrc} https: data:; object-src 'none';"/>
      <title>Tothom Markdown Preview</title>
      <link rel="stylesheet" href="${this.mediaFilePath(webview, 'tothom.css')}"/>
      <link rel="stylesheet" href="${this.mediaFilePath(webview, 'github-markdown.css')}"/>
      <link rel="stylesheet" href="${this.mediaFilePath(webview, 'highlight-js.css')}"/>
      ${baseTag}
      <script defer="true" src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
    </head>
    <body class="tothom-body ${colorScheme}" data-uri="${uri}">
      <div class="tothom-content">
        ${htmlContent}
      </div>
      <script nonce="${nonce}" src="${this.mediaFilePath(webview, 'main.js')}"/>
    </body>
    </html>`;
  };

  private handleEvent = (event: any) => {
    switch (event.command) {
      case 'link':
        if (event.text) {
          const parsedUrl = utils.parseUrl(event.text, true);
		      const query = parsedUrl.query;
          const uri = vscode.Uri.parse(query.uri);
          this.runInTerminal(query.code, uri);
        }
        return;
    }
  };

  private runInTerminal = (encodedCommand: string, uri: vscode.Uri) => {
    const preview = this._views.get(uri.fsPath);
    if (!preview) {
      return undefined;
    }

    const term = terminal.findTerminal(preview.terminal?.name) || terminal.findOrCreateTerminal(uri.toString());
    let command = terminal.decodeTerminalCommand(encodedCommand);

    this._views.set(uri.fsPath, { ...preview, terminal: term });

    if (this.bracketedPasteMode()) {
      command = `\x1b[200~${command}\x1b[201~`;
    }

    term.sendText(command, true);

    term.show();
  };

  private renderImage = (webview: vscode.Webview, uri: vscode.Uri): RendererRuleFunc => {
    return (tokens: any[], idx: number, options: Object, env: Object, self: any) => {
      var token = tokens[idx];
      const attrs = utils.keyValuesToObj(token.attrs);

      attrs.src = utils.pathToRelativeWebviewUri(webview, uri, attrs.src);

      // "alt" attr MUST be set, even if empty. Because it's mandatory and
      // should be placed on proper position for tests.
      //
      // Replace content with actual value
      attrs.alt = self.renderInlineAsText(token.children, options, env);

      token.attrs = utils.objToKeyValues(attrs);

      return self.renderToken(tokens, idx, options);
    };
  };
}
