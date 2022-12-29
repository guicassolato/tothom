import * as assert from 'assert';

import * as vscode from 'vscode';
import * as terminal from '../../terminal';
import * as utils from '../../utils';

suite('Terminal Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('create terminal', () => {
    const termName = `term-${utils.getNonce()}`;
    const termCount = vscode.window.terminals.length;
    const term = terminal.createTerminal(termName);
    assert.strictEqual(term.name, termName);
    assert.strictEqual(vscode.window.terminals.length, termCount+1);
	});

  test('find terminal', () => {
    const termName = `term-${utils.getNonce()}`;
    terminal.createTerminal(termName);
    const term = terminal.findTerminal(termName);
    assert.strictEqual(term?.name, termName);
	});

  test('find or create terminal', () => {
    const termName = `term-${utils.getNonce()}`;
    let term: vscode.Terminal | undefined = undefined;

    term = terminal.findTerminal(termName);
    assert.strictEqual(term, undefined);

    term = terminal.findOrCreateTerminal(termName);
    assert.strictEqual(term?.name, termName);
	});

  test('encode terminal command', () => {
    let encodedCommand = '';

    encodedCommand = terminal.encodeTerminalCommand("echo 'Hello World!\n# comment\n", false);
    assert.strictEqual(encodedCommand, `ZWNobyAnSGVsbG8gV29ybGQhCiMgY29tbWVudAo%3D`);

    encodedCommand = terminal.encodeTerminalCommand("echo 'Hello World!\n# comment\n", true);
    assert.strictEqual(encodedCommand, `ZWNobyAnSGVsbG8gV29ybGQhCg%3D%3D`);
  });

  test('decode terminal command', () => {
    let decodedCommand = '';

    decodedCommand = terminal.decodeTerminalCommand(`ZWNobyAnSGVsbG8gV29ybGQhCg%3D%3D`);
    assert.strictEqual(decodedCommand, "echo 'Hello World!\n");

    decodedCommand = terminal.decodeTerminalCommand(`ZWNobyAnSGVsbG8gV29ybGQhCiMgY29tbWVudAo%3D`);
    assert.strictEqual(decodedCommand, "echo 'Hello World!\n# comment\n");
  });
});
