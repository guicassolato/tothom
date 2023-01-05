# Tothom

Tothom is YAMP (_Yet Another Markdown Preview_) [Visual Sutdio Code extension](https://marketplace.visualstudio.com/items?itemName=guicassolato.tothom),
that gives you nice <kbd>▶️</kbd> _Run in terminal_ buttons for your code blocks

## Features

- Markdown preview (<kbd>⇧ ⌘ P</kbd></kbd> _Tothom: Markdown Preview_)
- <kbd>▶️</kbd> _Run in terminal_ actions for code blocks (auto-generated)
- GitHub styling
- Syntax highlight for code blocks
- Dark/light mode
- Anchor links
- Tasks/TODO lists (with [markdown-it-task-lists](https://www.npmjs.com/package/markdown-it-task-lists))
- HTML tag attributes (with [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs))
- Automatic reload of the preview on edit the source markdown file
- Independent preview tabs for each markdown file
- Force preview reload (<kbd>⇧ ⌘ P</kbd></kbd> _Tothom: Reload Preview_)
- Bind an existing terminal to a preview (a dedicated one is automatically created otherwise)
- Native VSCode _Find_ widget enabled in the preview

## Usage

![Usage](./resources/usage.gif)

1. Open a markdown file that contains code blocks annotated in any of the supported languages (bash/sh/zsh), e.g.:
   <pre>
   # Hello World!
   ```sh
   echo 'Hello World!'
   ```
   </pre>
2. Run the **_Tothom: Markdown Preview_** command (<kbd>⇧ ⌘ P</kbd>)
3. Click on the <kbd>▶️</kbd> button automatically rendered with each of your code blocks, to run the code in the Visual Studio Code terminal.

### Reuse a terminal

Tothom binds each preview window to a terminal. When a terminal does not exist, Tothom creates a dedicated one at the time when the first <kbd>▶️</kbd> _Run in terminal_ action is executed.

To bind a new preview window to an existing terminal, use the command <kbd>⇧ ⌘ P</kbd> _Tothom: Markdown Preview (existing terminal)_.

To re-bind a preview window to an existing terminal, activate the preview and execute the command <kbd>⇧ ⌘ P</kbd> _Tothom: Select terminal_.

These options allow to share a terminal across multiple preview windows.

## Extension Settings

| Setting                     | Description                                                  | Options/Default                   |
|-----------------------------|--------------------------------------------------------------|-----------------------------------|
| `tothom.bracketedPasteMode` | Apply bracketed paste sequences on commands sent to terminal | `true` (default), `false`         |
| `tothom.colorScheme`        | Color scheme of the preview panel                            | `auto` (default), `light`, `dark` |
| `tothom.runInTerminalLabel` | Label of the _Run in terminal_ button                        | Default: `▶️`                      |

## Limitations

**Markdown syntax for code blocks only**<br/>
Code block execution only works with markdown code block syntax (delimited by ```).
Tothom will not render the <kbd>▶️</kbd> _Run in terminal_ button for code blocks written using HTML syntax (`<pre>`).

## Release Notes

Check the the full release notes in the [Change Log](./CHANGELOG.md).
