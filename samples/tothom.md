# Tothom

- [Code blocks](#code-blocks)
  - [Executable](#executable)
  - [Non-executable](#non-executable)
  - [Interpolation](#interpolation)
  - [Multiline](#multiline)
  - [Carrying values](#carrying-values)
  - [Loading](#loading)
  - [ANSI escape sequences](#ansi-escape-sequences)
- [Compatibility](#compatibility)
  - [Formatting](#formatting)
  - [Attributes](#attributes)
  - [Lists](#lists)
    - [Ordered lists](#ordered-lists)
    - [Bullet lists](#bullet-lists)
    - [Nested lists](#nested-lists)
    - [Task lists](#task-lists)
  - [Links](#links)
  - [Tables](#tables)
  - [Images](#images)
  - [Details](#details)
  - [Blockquote](#blockquote)
  - [Horizontal line](#horizontal-line)

## Code blocks

### Executable

```sh
echo 'Hello World!'
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

### Carrying values

```sh
export TIME="$(date)"
```

```sh
echo "Time was: $TIME\nTime now is: $(date)"
```

```sh
unset TIME
```

### Loading

```sh
sleep 3
echo 'Done.'
```

### ANSI escape sequences

```sh
echo "\
Test case #1: \033[32mOK\033[0m\n\
Test case #2: \033[32mOK\033[0m\n\
Test case #3: \033[31mFAIL\033[0m\n\
__________________\n\
Test result: \033[1;37;41mFAIL\033[0m"
```

## Compatibility

### Formatting

**Bold**, _italic_, _**both**_, ~~strikethrough~~, <sub>subscript</sub>, <sup>superscript</sup>, <kbd>kbd</kbd>.

### Attributes

This is a *keyword*{.pl-k}.

This has a title. {title="this is the title"}

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

- [External URL](https://marketplace.visualstudio.com/items?itemName=guicassolato.tothom)

- Linkified URL: https://github.com/guicassolato/tothom

- Relative local paths: [hello-world.md](hello-world.md), [../README.md](../README.md)

- [Indirect link][1]

[1]: https://github.com/guicassolato/tothom

### Tables

| Left   | Center | Right  |
| ------ | :----: | -----: |
| Cell 1 | Cell 2 | Cell 3 |

### Images

![Tothom](../resources/tothom.png)

### Details

<details>
  <summary>Show details</summary>

  Details are visible.
</details>

### Blockquote

> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Horizontal line

---

***
