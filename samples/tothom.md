# Tothom

- [Code blocks](#code-blocks)
  - [Executable](#executable)
  - [Interpolation](#interpolation)
  - [Multiline](#multiline)
  - [Non-executable](#non-executable)
- [Compatibility](#compatibility)
  - [Formatting](#formatting)
  - [Lists](#lists)
    - [Ordered lists](#ordered-lists)
    - [Bullet lists](#bullet-lists)
    - [Nested lists](#nested-lists)
    - [Task lists](#task-lists)
  - [Links](#links)
  - [Tables](#tables)
  - [Images](#images)
  - [Other](#other)
    - [Blockquote](#blockquote)
    - [Horizontal line](#horizontal-line)

## Code blocks

### Executable

```sh
echo 'Hello World!'
```

### Interpolation

```sh
echo "Current directory is $PWD"
```

### Multiline

```sh
cat <<EOF
This is a
multiline
code block
EOF
```

### Non-executable

```yaml
obj:
  arr:
    - item 1
    - item 2
  str: value
  num: 1
  bool: true
```

## Compatibility

### Formatting

**Bold**, _italic_, _**both**_, ~~strikethrough~~, <sub>subscript</sub>, <sup>superscript</sup>, <key>⌘</key>.

### Lists

#### Ordered lists

1. Item 1
2. Item 2
3. Item 3

1) Item 1
2) Item 2
3) Item 3

#### Bullet lists

* Item 1
* Item 2
* Item 3

- Item 1
- Item 2
- Item 3

#### Nested lists

1. First list item
   - First nested list item
     - Second nested list item

#### Task lists

- [x] Item 1
- [x] Item 2
- [ ] Item 3

### Links

- External [link](https://marketplace.visualstudio.com/items?itemName=guicassolato.tothom).
- Linkified URL: https://github.com/guicassolato/tothom.
- Local [link](./hello-world.md).
- Indirect [link][1].

[1]: https://github.com/guicassolato/tothom

### Tables

| Left   | Center | Right  |
| ------ | :----: | -----: |
| Cell 1 | Cell 2 | Cell 3 |

### Images

![Tothom](../resources/tothom.png)

### Other

#### Blockquote

> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

#### Horizontal line

---

***
