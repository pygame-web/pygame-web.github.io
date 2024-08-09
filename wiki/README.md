Check out some [demos](#demos-on-itchio) before you start!

## Using Pygbag
- Visit [this page](/wiki/pygbag/) on how to use Pygbag to make web games with Python.
- Visit [this page](/wiki/pygbag-code/) for useful Pygbag code snippets and a Pygbag FAQ.

## Debugging / Desktop Simulator

- [How to enter debug mode](/wiki/pygbag-debug/)
- While working, you can access the simulator of the web loop by replacing `import asyncio` by `import pygbag.aio as asyncio` at top of main.py and run the program from the folder containing it.
- TODO: Android remote debugging via [chromium browsers series](https://developer.chrome.com/docs/devtools/remote-debugging/).
- TODO: Universal remote debugging via IRC Client or websocket using pygbag.net.
   
## Running

- [Pygbag-script](/wiki/pygbag-script/) (WIP)
- [REPL](https://pygame-web.github.io/showroom/python.html?-i-&-X-dev#https://gist.githubusercontent.com/pmp-p/cfd398c75608504293d21f2642e87968/raw/773022eef4a2cc676ab0475890577a2b5e79e429/hello.py)
- [CPython test suite](https://pygame-web.github.io/showroom/pythondev.html?-d#src/testsuite.py%20all) (WIP)

## Publishing

- [Github Pages](/wiki/publishing/github.io/)
- [Itch.io](/wiki/publishing/itch.io/)

## Demos

### Demos on itch.io

- [Games using Python-WASM](https://itch.io/c/2563651/pygame-wasm) (Expected to be stable)
- [Panda3D demos](https://itch.io/c/3724091/panda3d-wasm) (Experimental)

### Demos on Github Pages

These are provided for testing purposes only, and might not always work since they use development versions of Pygbag.

#### Heavy CPU load, not for low-end devices

- [Perfect Rain](https://pmp-p.github.io/pygame-perfect-rain-wasm/)
- [Alien Dimension](https://pmp-p.github.io/pygame-alien-dimension-wasm/)

#### Light CPU load

- [Breakout](https://pmp-p.github.io/pygame-breakout-wasm/index.html)
- [PyChess](https://pmp-p.github.io/pygame-pychess-wasm/index.html)
- [Penguins Can't Fly!](https://pmp-p.github.io/pygame-PenguinsCantFly-wasm/)
- [John's Adventure](https://pmp-p.github.io/pygame-JohnsAdventure-wasm/)
- [3D Tic-Tac-Toe](https://pmp-p.github.io/pygame-ttt-3d-wasm/)
- [Arachnoids](https://pmp-p.github.io/pygame-arachnoids-wasm/)
- [Sudoku Solver](https://www.pete-j-matthews.com/Sudoku-Solver/)

Source code for these games can be found [here](https://github.com/pmp-p?tab=repositories&q=pygame-.-wasm&sort=name). You can tag your Github repositories with [[pygame-wasm]](https://github.com/topics/pygame-wasm).

### Script demos

The code is read-only, so you should right-click then open in a new window.

- [i18n bidi, complex scripts](/showroom/pypad_git.html?-i#src/test_hb.py)
- [Camera](/showroom/pypad_git.html?-i#src/test_vidcap.py)
- [Panda3D](/showroom/pypad_dev.html?-i#src/test_panda3d_cube.py)
- [Audio Record/Play](/showroom/pypad_dev.html?-i#src/test_audio.py)
- [HTML output](/showroom/pypad_dev.html?-i#src/test_html.py)

## Technology

- [Initial discussion](https://github.com/pygame/pygame/issues/718) 
- [Discussion at pygame-ce repo](https://github.com/pygame-community/pygame-ce/issues/540)
- [Python-WASM explained by core dev Christian Heimes (video)](https://www.youtube.com/watch?v=oa2LllRZUlU)

### Early demos from above talk, may not work as intended :)

- [Pygame tech demo PyCon DE & PyData Berlin 2022](https://pmp-p.github.io/pygame-wasm/)
- [Galaxy Attack](https://pmp-p.github.io/pygame-galaxy-attack-wasm/)

Python WebAssembly at PyCon FR 2023 (in French): 
[Pour quoi, pour qui et comment](https://harfang3d.github.io/pyconfr2023/#1)

## Status

- [Current issues](https://github.com/pygame-web/pygbag/issues)
- [Package porting](https://github.com/pygame-web/pkg-porting-wasm/issues)
- [PyPI stats](https://pepy.tech/project/pygbag)

## Other Pythons in browser

- [Pyodide/Pyscript](https://github.com/pyodide/pyodide) ( py3.12+ not suitable for heavy games, music or 3D )
- [Micropython/Pyscript](https://www.npmjs.com/package/@micropython/micropython-webassembly-pyscript) ( py3.4, no pygame, but pysdl2/javascript libraries possible )
- PocketPy, not any Python spec compliant but sometimes close. Can make Terminal/raylib based games.

## Support

- [Pygame Community](https://pyga.me/)

## Connect

- [Pygame Community Discord Server](https://discord.gg/p7RjnVNTcM)
- [WebAssembly/Python Discord Server](https://discord.gg/MCTM4xFDMK)

Thanks for reading and supporting pygame-ce and pygbag. These tools could not have existed without your support.