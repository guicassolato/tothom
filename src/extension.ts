import * as vscode from 'vscode';

import { Tothom, TothomOptions } from './tothom';

const TOTHOM_MARKDOWN_PREVIEW = 'tothom.markdownPreview';
const TOTHOM_RELOAD_PREVIEW = 'tothom.reloadPreview';

const tothomOptions = (): TothomOptions => {
  const config = vscode.workspace.getConfiguration('tothom');

  return {
    colorScheme: config.get('colorScheme'),
    bracketedPasteMode: config.get('bracketedPasteMode'),
    engineOptions: {
      runInTerminalLabel: config.get('runInTerminalLabel')
    }
  };
};

export function activate(context: vscode.ExtensionContext) {
  const tothom = new Tothom(context.extensionUri, tothomOptions());

  context.subscriptions.push(vscode.commands.registerCommand(TOTHOM_MARKDOWN_PREVIEW, tothom.openPreview));
  context.subscriptions.push(vscode.commands.registerCommand(TOTHOM_RELOAD_PREVIEW, tothom.reloadPreview));

  vscode.workspace.onDidChangeTextDocument(event => tothom.reloadPreview(event.document.uri, { reveal: false }));
  vscode.workspace.onDidChangeConfiguration(() => tothom.setOptions(tothomOptions()));
}

export function deactivate() {}
