import * as assert from 'assert';

import * as vscode from 'vscode';
import { Tothom } from '../../tothom';
import * as path from 'path';

suite('Tothom Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('open preview', () => {
    const tothom = new Tothom(vscode.Uri.parse(path.resolve(__dirname, '../../..')));
    assert.ok(tothom instanceof Tothom);
  });
});
