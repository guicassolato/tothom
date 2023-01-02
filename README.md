# Tothom

Tothom is YAMP (_Yet Another Markdown Preview_) extension for Visual Sutdio Code, that gives you a nice
<key>▶️ Run in terminal</key> button for your code blocks

## Features

- Auto-generated ▶️ _Run in terminal_ actions for code blocks
- Separate preview windows/tabs for each markdown file
- GitHub styling (support for dark/light mode)
- Syntax highlight for code blocks

## Usage

![Usage](./resources/usage.gif)

1. Open a markdown file that contains code blocks annotated in any of the supported languages (bash/sh/zsh), e.g.:
   <pre>
   # Hello World!
   ```sh
   echo 'Hello World!'
   ```
   </pre>
2. Run the **_Tothom: Markdown Preview_** command (<key>⌘</key> + <key>⇧</key> + <key>P</key>)
3. Click on the <key>▶️</key> button automatically rendered with each of your code blocks, to run the code in the Visual Studio Code terminal.

## Extension Settings

| Setting                     | Description                                                  | Options                           |
|-----------------------------|--------------------------------------------------------------|-----------------------------------|
| `tothom.colorScheme`        | Color scheme of the preview panel                            | `auto` (default), `light`, `dark` |
| `tothom.bracketedPasteMode` | Apply bracketed paste sequences on commands sent to terminal | `true` (default), `false`         |

## Limitations

**One preview, one terminal**<br/>
Each preview panel gets its own dedicated terminal window. Terminal windows cannot be shared across preview panels,
neither one preview panel can have multiple associated terminal windows.

**Markdown code block syntax**<br/>
Code block execution only works with markdown code block syntax (delimited by ```).
Tothom will not render the <key>▶️</key> _Run in terminal_ button for code blocks written using HTML syntax (`<pre>`).

## Release Notes

### v0.1.0

Initial release.
