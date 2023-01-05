import * as vscode from 'vscode';
import { basename, dirname, resolve } from 'path';
import { readFileSync } from 'fs';

export const uriOrActiveDocument = (uri: vscode.Uri): vscode.Uri => {
  let resource = uri;
  if (!(resource instanceof vscode.Uri) && vscode.window.activeTextEditor) {
    resource = vscode.window.activeTextEditor.document.uri;
  }
  return resource;
};

export const resourceName = (resource: vscode.Uri): string => {
  return basename(resource.path);
};

export const resourceDir = (resource: vscode.Uri): string => {
  return dirname(resource.path);
};

export const asWebviewUri = (localResource: string, basePath: vscode.Uri, builder: vscode.Webview): vscode.Uri => {
  if (localResource.match(/:\/\//)) {
    return vscode.Uri.parse(localResource); // absolute path
  }
  const base = vscode.Uri.file(resourceDir(basePath)).path;
  return builder.asWebviewUri(vscode.Uri.file(resolve(base + '/' + localResource)));
};

export const readFileContent = (resource: vscode.Uri): string => {
  return readFileSync(resource.fsPath, 'utf8');
};

export const getNonce = (): string => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const keyValuesToObj = (arr: any[]) => {
  return arr.reduce((obj: Object, attr: string[]) => {
    return {...obj, [attr[0]]: attr[1]};
  }, {});
};

export const objToKeyValues = (obj: any): any[] => {
  return Object.keys(obj).map(key => { return [key, obj[key]]; });
};
