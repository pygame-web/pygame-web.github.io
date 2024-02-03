# pygame-web.github.io

This is the CDN root used by [Pygbag](https://pypi.org/project/pygbag/) ([Source code](https://github.com/pygame-web/pygbag)/[Old runtimes](https://github.com/pygame-web/archives)) and the site of its [wiki](https://pygame-web.github.io/wiki/pygbag).

Pygbag does not track usage at all, not even for statistical purposes. If you like it, please [star](https://github.com/pygame-web/pygbag/stargazers) the repository!

Check out some [demos](#demos-on-itchio) before you start!

## Important points

Read Pygbag's [project description](https://pypi.org/project/pygbag/) for a more detailed overview. A full packaging guide can be found [here](https://pygame-web.github.io/wiki/pygbag/).

**<ins>Also, read the page on [making your code compatible with browser game loop](https://pygame-web.github.io/wiki/python-wasm). You will probably have to change some of your code.</ins>**

### All operating systems

- Name your main game script `main.py` and put it in the root folder of your game.
- Make your main loop async-aware and use `asyncio.sleep(0)` every iteration to give control back to the main thread.
- Add `--template noctx.tmpl` to pygbag command line if using 3D/WebGL.
- Put the import statements of complex packages in order (but numpy first) at the top of `main.py`.
- Avoid using CPython's standard library for web operations, GUI (like tkinter), or I/O as it is very synchronous/platform-specific and will probably stay that way. In terms of GUI alternatives, [pygame_gui](https://pypi.org/project/pygame_gui) works on top of [pygame-ce](https://pyga.me), [Panda3D](https://www.panda3d.org/) provides [directgui](https://docs.panda3d.org/1.10/python/programming/gui/directgui/index) and Harfang3D provides imgui. They are all cross-platform.
- You can add a square image file named `favicon.png` in your game's root folder to make Pygbag use it as the web package's favicon.
- Make sure all audio files are in OGG format, and all image files are compressed. (that is, not in BMP)

Before packaging, adapt your code this way if you still want WAV/MP3 format on desktop:
```py
if sys.platform == "emscripten":
    snd = pygame.mixer.Sound("sound.ogg")
else:
    snd = pygame.mixer.Sound("sound.wav") # or .WAV, .mp3, .MP3, etc.
```

if you have heightmaps in your assets use `--no_opt` to prevent png recompression.

if you want to keep pixelated look whatever the device screen size is use:
```py
import sys, platform
if sys.platform == "emscripten":
    platform.window.canvas.style.imageRendering = "pixelated"
```

### Windows

- Use Python that was downloaded from python.org rather than the Windows Store. You can check installed version(s) with the `py --list` command.
- Use `/` instead of `\​` as a path separator (e.g. `img/my_image.png` instead of `img\my_image.png`). The path should still be valid on newer Windows versions.

### MacOS

- If you get a SSL error, use the file `Install Certificates.command` in `Applications/Python 3.XX`.

### Linux

- When using webusb ftdi serial emulation, use `sudo rmmod ftdi_sio` after plugging devices.

Avoid raw formats like BMP for your image assets, they are too big for web use; use PNG or JPG instead.

## Template

There is actually none, because Python-WASM is just a web-friendly version of CPython REPL with [some added facilities](https://discuss.python.org/t/status-of-wasm-in-cpythons-main-branch/15542/12?u=pmp-p). Most desktop code will run (and continue to run) with only a few changes. 

Basic structure of a game (available [here](https://github.com/pygame-web/pygbag/tree/main/test)): 
```
test
├── img
│   ├── pygc.bmp
│   ├── pygc.png
│   └── tiger.svg
├── main.py
└── sfx
    └── beep.ogg
```

Useful .gitignore additions:
```
*.wav
*.mp3
*.pyc
*.egg-info
*-pygbag.???
/build
/dist
```

## Coding

- [General Python-WASM](https://pygame-web.github.io/wiki/python-wasm/)
- [With Pygbag specifically](https://pygame-web.github.io/wiki/pygbag-code/)
- [Pygbag code examples](https://pygame-web.github.io/wiki/pygbag-code/#pygbag-code-specifics-samples-)
- [List of available wheels](https://pygame-web.github.io/wiki/pkg/)

When importing complex packages (for example, numpy or matplotlib), you must put their import statements at top of `main.py`. You should also add a metadata header as specified by [PEP 723](https://peps.python.org/pep-0723/), for example:
```
# /// script
# dependencies = [
#  "six",
#  "bs4",
#  "markdown-it-py",
#  "pygments",
#  "rich",
#  "mdurl",
#  "textual",
# ]
# requires-python = ">=3.11"
# ///
```

If using pygame-zero (mostly untested), put `#!pgzrun` near the top of main.py. (2nd line is perfect if the file already has a shebang)

## Debugging / Desktop Simulator

- [How to enter debug mode](https://pygame-web.github.io/wiki/pygbag-debug/)
- While working, you can access the simulator of the web loop by replacing `import asyncio` by `import pygbag.aio as asyncio` at top of main.py and run the program from the folder containing it.
- TODO: Android remote debugging via [chromium browsers series](https://developer.chrome.com/docs/devtools/remote-debugging/).
- TODO: Universal remote debugging via IRC Client or websocket using pygbag.net.
   
## Running

- [Pygbag-script](https://pygame-web.github.io/wiki/pygame-script/) (WIP)
- [REPL](https://pygame-web.github.io/showroom/python.html?-i-&-X-dev#https://gist.githubusercontent.com/pmp-p/cfd398c75608504293d21f2642e87968/raw/773022eef4a2cc676ab0475890577a2b5e79e429/hello.py)
- [CPython test suite](https://pygame-web.github.io/showroom/pythondev.html?-d#src/testsuite.py%20all) (WIP)

## Publishing

- [Github Pages](https://pygame-web.github.io/wiki/pygbag/github.io/)
- [Itch.io](https://pygame-web.github.io/wiki/pygbag/itch.io/)

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
- [Pyodide/Pyscript](https://github.com/pyodide/pyodide)

## Support

- [Pygame Community](https://pyga.me/)

## Connect

- [Pygame Community Discord Server](https://discord.gg/p7RjnVNTcM)
- [WebAssembly/Python Discord Server](https://discord.gg/MCTM4xFDMK)

Thanks for reading and supporting pygame-ce and pygbag. These tools could not have existed without your support.

**Work in progress, pull requests welcomed. Feel free to propose links to games or tutorials. Please contribute!!!**

[Edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/README.md)
