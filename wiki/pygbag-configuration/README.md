# Pygbag Configuration (`pygbag.ini`)

The `pygbag.ini` file allows you to customize how Pygbag builds and packages your game. Its primary use is to define specific files and directories that should be excluded from your final web build (`.apk` or `.tar.gz`), keeping your game's download size as small as possible.

## File Format and Syntax

Pygbag parses this file using the `config-to-object` library. Because of this, the syntax for defining lists requires square brackets `[]` and quotes `""` around each item.

### Example `pygbag.ini`

Place this file in the root directory of your Pygbag project (right next to your `main.py`):

```ini
[DEPENDENCIES]
ignoreDirs = [".git", "venv", "docs"]
ignoreFiles = ["build_pwa.py", "README.md", ".gitignore"]
