import * as vscode from 'vscode';
import { basename, dirname } from 'path';
import { readFileSync } from 'fs';

export const resourceFromUri = (uri: vscode.Uri): vscode.Uri => {
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

export const pathToRelativeWebviewUri = (webview: vscode.Webview, resource: vscode.Uri, path: string): string => {
  const uriBasePath = vscode.Uri.file(resourceDir(resource)).path;
  return path.startsWith('.') ? webview.asWebviewUri(vscode.Uri.file(uriBasePath + '/' + path)).toString() : path;
};

export const readFileContent = (resource: vscode.Uri): string => {
  return readFileSync(resource.fsPath, 'utf8');
};

export const parseUrl = require('url-parse');

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
