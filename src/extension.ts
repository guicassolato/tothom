import { Tothom } from './tothom';
import * as vscode from 'vscode';

const TOTHOM_MARKDOWN_PREVIEW = 'tothom.markdownPreview';

export function activate(context: vscode.ExtensionContext) {
  const tothom = new Tothom(context.extensionUri);

  context.subscriptions.push(vscode.commands.registerCommand(TOTHOM_MARKDOWN_PREVIEW, tothom.openPreview));

  vscode.workspace.onDidChangeTextDocument(event => tothom.updatePreview(event.document.uri));
  vscode.workspace.onDidChangeConfiguration(tothom.reloadConfig);
}

export function deactivate() {}
