import * as vscode from 'vscode';

import * as utils from './utils';
import * as terminal from './terminal';
import { engine } from './engine';

const CONFIGURATION_ROOT = 'tothom';
const WEBVIEW_PANEL_TYPE = 'tothom';

export class Tothom {
  private _config: vscode.WorkspaceConfiguration;
  private _views: Map<vscode.Uri, vscode.WebviewPanel>;

  constructor(private readonly _extensionUri: vscode.Uri) {
    this._config = vscode.workspace.getConfiguration(CONFIGURATION_ROOT);
    this._views = new Map<vscode.Uri, vscode.WebviewPanel>;
  }

  // commands

  openPreview = (uri: vscode.Uri): vscode.Webview | undefined => {
    const resource = utils.resourceFromUri(uri);

    let panel = this._views.get(resource);
    let webview: vscode.Webview | undefined = undefined;

    if (!panel) {
      const title = `Preview: ${utils.resourceName(resource)}`;

      var localResourceRoots = [this._extensionUri];
      if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]) {
        localResourceRoots.push(vscode.workspace.workspaceFolders[0].uri);
      }

      panel = vscode.window.createWebviewPanel(WEBVIEW_PANEL_TYPE, title, vscode.ViewColumn.Active, {
        enableScripts: true,
        enableFindWidget: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          this._extensionUri,
        ]
      });
      panel.onDidDispose(() => this._views.delete(resource));

      webview = panel.webview;
      webview.onDidReceiveMessage(this.handleEvent);

      this._views.set(resource, panel);
    }

    this.updatePreview(uri);
    panel.reveal(0);

    return webview;
  };

  updatePreview = (uri: any): vscode.Webview | undefined => {
    const resource = utils.resourceFromUri(uri);

    let webview = this._views.get(resource)?.webview;
    if (!webview) {
      return undefined;
    }

    engine.renderer.rules.image = this.renderImage(webview, resource);

    const content = utils.readFileContent(resource);
    const htmlContent = this.renderHtmlContent(webview, resource, engine.render(content));
    webview.html = htmlContent;

    return webview;
  };

  reloadConfig = () => this._config = vscode.workspace.getConfiguration(CONFIGURATION_ROOT);

  // private methods

  private mediaFilePath = (webview: vscode.Webview, filePath: string): vscode.Uri => {
    return webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', filePath));
  };

  private renderHtmlContent = (webview: vscode.Webview, uri: vscode.Uri, htmlContent: string): string => {
    const cspSrc = webview.cspSource;
    const nonce = utils.getNonce();
    const baseHref = utils.resourceDir(uri);
    const baseTag = `<base href="${baseHref}${baseHref.endsWith('/') ? '' : '/'}"/>`;

    let colorScheme: string = "";
    switch (this._config.get('colorScheme')) {
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
    const term = terminal.findOrCreateTerminal(uri.toString());
    let command = terminal.decodeTerminalCommand(encodedCommand);

    if (this._config.get('bracketedPasteMode')) {
      command = `\x1b[200~${command}\x1b[201~`;
    }

    term.sendText(command, true);

    term.show();
  };

  private renderImage = (webview: vscode.Webview, uri: vscode.Uri): (tokens: any[], idx: number, options: Object, env: Object, self: any) => any => {
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
