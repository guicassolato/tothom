import { window, Terminal } from 'vscode';

export const findTerminal = (name: string | undefined): Terminal | undefined => {
  if (name === undefined) {
    return undefined;
  }
  return window.terminals.find(term => term.name === name);
};

export const createTerminal = (name: string): Terminal => {
  return window.createTerminal({name: name});
};

export const findOrCreateTerminal = (name: string): Terminal => {
  return findTerminal(name) || createTerminal(name);
};

export const selectTerminal = async (): Promise<Terminal | undefined> => {
  const item = await window.showQuickPick(window.terminals.map(term => term.name), { placeHolder: 'Select a terminal'	});
  if (!item) {
    return undefined;
  }
  return findTerminal(item);
};

export const encodeTerminalCommand = (command: string, removeComments: boolean): string => {
  return encodeURIComponent(Buffer.from(removeComments ? removeCommentsFromCommand(command) : command).toString('base64'));
};

export const decodeTerminalCommand = (encodedCommand: string): string => {
  return Buffer.from(decodeURIComponent(encodedCommand), 'base64').toString('utf8');
};

const removeCommentsFromCommand = (command: string): string => {
  let cmd: string[] = [];
  for (const line of command.split("\n")) {
    if (!line.startsWith('#')) {
      cmd.push(line);
    }
  }
  return cmd.join("\n");
};
