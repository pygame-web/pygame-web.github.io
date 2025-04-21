pygbag comes with an interactive Python-like REPL that can be used for debugging. 

## to open
To open the REPL, visit `http://localhost:8000/#debug` instead of just `http://localhost:8000`.

To get debugger at runtime, open the [javascript console](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools#the_javascript_console) and run `debug()` by typing in `debug()` followed by pressing enter.

## to use
The REPL is a Python REPL that has loaded the project. This means if your pygbag main file includes a `main() function`, calling `type(main)` will return `<class 'function'>` instead of a `NameError`.

It also implements a variety of shell-like commands, defined in the [shell](https://github.com/pygame-web/pygbag/blob/72b34546e23086c78f5b193c05e3e961b807f214/src/pygbag/support/cpythonrc.py#L266) class, that are reminiscent of shell languages common on Linux systems. These can be used in the REPL.
For example,
```bash
>>> cat main.py
```
will dump the binary contents of `main.py` into the REPL, if `main.py` exists in your pygbag project directory. 

Other helpful commands are available. For example,`rx` takes a list of files and downloads them from the browser's filesystem to a user's filesystem. For example,
```bash
>>> rx main.py assets/image.png assets/otherimage.png
```
will try to download the given three files.

## Python versus browser logging
`print` statements will write to this REPL instead of the browser's console.

To write to the browser's console instead, use `platform.console.log`. For example,
```py
import sys, platform
if sys.platform == "emscripten":
    platform.console.log("logged message")
```






[edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag-debug/README.md)
