import * as vscode from 'vscode';

import { Tothom, TothomOptions } from './tothom';
import { selectTerminal } from './terminal';

const TOTHOM_MARKDOWN_PREVIEW = 'tothom.markdownPreview';
const TOTHOM_MARKDOWN_PREVIEW_EXISTING_TERMINAL = 'tothom.markdownPreviewWithExistingTerminal';
const TOTHOM_RELOAD_PREVIEW = 'tothom.reloadPreview';
const TOTHOM_SELECT_TERMINAL = 'tothom.selectTerminal';
const TOTHOM_CLEAR_TERMINAL_SELECTION = 'tothom.clearTerminalSelection';

const tothomOptions = (): TothomOptions => {
  const config = vscode.workspace.getConfiguration('tothom');

  return {
    colorScheme: config.get('colorScheme'),
    bracketedPasteMode: config.get('bracketedPasteMode'),
    engineOptions: {
      runInTerminalLabel: config.get('runInTerminalLabel')
    },
    runInBackgroundByDefault: config.get('runInBackgroundByDefault')
  };
};

export function activate(context: vscode.ExtensionContext) {
  const tothom = new Tothom(context.extensionUri, tothomOptions());

  context.subscriptions.push(vscode.commands.registerCommand(TOTHOM_MARKDOWN_PREVIEW, tothom.openPreview));
  context.subscriptions.push(vscode.commands.registerCommand(TOTHOM_MARKDOWN_PREVIEW_EXISTING_TERMINAL, (uri: vscode.Uri) => selectTerminal().then(term => tothom.openPreview(uri, { terminal: term }))));
  context.subscriptions.push(vscode.commands.registerCommand(TOTHOM_RELOAD_PREVIEW, tothom.reloadPreview));
  context.subscriptions.push(vscode.commands.registerCommand(TOTHOM_SELECT_TERMINAL, (uri: vscode.Uri) => selectTerminal().then(term => tothom.bindTerminal(uri, term))));
  context.subscriptions.push(vscode.commands.registerCommand(TOTHOM_CLEAR_TERMINAL_SELECTION, tothom.clearTerminalSelection));

  vscode.workspace.onDidChangeTextDocument(event => tothom.reloadPreview(event.document.uri, { reveal: false }));
  vscode.workspace.onDidChangeConfiguration(() => tothom.setOptions(tothomOptions()));
}

export function deactivate() {}
