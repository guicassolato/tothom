import * as assert from 'assert';

import * as vscode from 'vscode';
import * as utils from '../../utils';
import * as path from 'path';

suite('Utils Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('uri or active document', () => {
    const uri = vscode.Uri.parse('file:///home/user/file');
    assert.strictEqual(utils.uriOrActiveDocument(uri), uri);
	});

  test('resource name', () => {
    const uri = vscode.Uri.parse('file:///home/user/file');
    assert.strictEqual(utils.resourceName(uri), 'file');
	});

  test('read file content', () => {
    const samples = path.resolve(__dirname, '../../../samples');
    const uri = vscode.Uri.parse(`${samples}/hello-world.md`);
    assert.strictEqual(utils.readFileContent(uri), "# Hello World!\n\n```sh\necho 'Hello World!'\n```\n");
	});
});
