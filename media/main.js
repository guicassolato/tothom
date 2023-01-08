/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This script will be run within the webview itself
(
  function () {
    //connect to the vscode api
    const vscode = acquireVsCodeApi();

    document.body.addEventListener('click', event => {
      const node = event && event.target;
      while (node) {
        if (node.href) {
          let href = node.getAttribute('href');
          let command = '';

          if (href.startsWith('tothom:')) {
            command = 'run';
          } else if (href.match(/\.md(\?.+)?$/) && !href.match(/(^file):\/\//)) {
            href = `tothom://?p=${href}`;
            command = 'preview';
          } else {
            return; // if it's neither a tothom link nor a local md file, we don't need to worry about it
          }

          vscode.postMessage({ command: command, text: href + '&uri=' + document.body.dataset.uri });
          event.preventDefault();
          return;
        }
        node = node.parentNode;
      }
    }, true);

    window.addEventListener('message', event => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case 'tothom.terminalOutput':
          const id = message.data.codeId;
          const el = document.getElementById(id);
          if (!el) {
            return;
          }
          const out = document.getElementById(`${id}-out`);
          const html = `<code>${message.data.text}</code>`;
          if (out) {
            out.innerHTML = html;
          } else {
            el.insertAdjacentHTML('afterend', `<p>Output:</p><pre class="tothom-code-output" id="${id}-out">${html}</pre>`);
          }
          break;
      }
    });
  }()
);
