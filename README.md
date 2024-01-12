# pygame-web.github.io
This is the CDN root used by [Pygbag](https://pypi.org/project/pygbag/) and the site of its wiki.
([Source code](https://github.com/pygame-web/pygbag)/[Old runtimes](https://github.com/pygame-web/archives))

Pygbag does not track usage at all, not even for statistical purposes. If you like it, please do not forget to [star](https://github.com/pygame-web/pygbag/stargazers)!

Check out some [demos](https://pygame-web.github.io/#demos-on-itchio-) before you start!

**Work in progress, pull requests welcomed, feel free to propose links to games or tutorials, please contribute!!!**


## Important notes

**Do NOT forget to read the coding section for WASM. You WILL have to change a few lines to classic python/pygame code.**
### All operating systems
- Add `--template noctx.tmpl` to pygbag command line if using 3D/WebGL.
- When importing complex wheels that depend on each other, always put them in order (but numpy first) in main.py.
- Avoid using CPython's standard library for web operations, GUI (like tkinter), or I/O as it is very 
synchronous/platform-specific and will probably stay that way. In terms of GUI alternatives, pygame_gui works on top of 
pygame-ce, Panda3D provides directgui and Harfang3D provides imgui. They are all cross-platform.
- Make sure all audio files are in OGG format when packaging, otherwise pygbag would not work.

Before packaging, adapt your code this way if you still want WAV/MP3 format on desktop :
```py
if sys.platform == "emscripten":
    snd = pygame.mixer.Sound("sound.ogg")
else:
    snd = pygame.mixer.Sound("sound.wav") # or .WAV,.mp3,.MP3
```

### Windows
- Do not use python installed from the Windows Store, use an official python.org build. You can check version installed with
`py --list` command. If python/pygbag is not in your PATH, add it to PATH or substitute any `pygbag` commands with `py -m pygbag`.
- Use / instead of \ as a path separator (e.g. `open("img/my_image.png","rb")`) the change should not interfere and still work on recent Win32.

### MacOS
- If you get a SSL error, use the file "Install Certificates.command" in Applications/Python 3.XX

### Linux
- When using webusb ftdi serial emulation, use `sudo rmmod ftdi_sio` after plugging devices.

Avoid raw formats like BMP for your image assets, they are too big for web use; use PNG or JPG instead.

A full packaging guide can be found [here](https://pygame-web.github.io/wiki/pygbag/).

## Template

There is actually none, because Python-WASM is a web-friendly version of CPython with
[some added facilities](https://discuss.python.org/t/status-of-wasm-in-cpythons-main-branch/15542/12?u=pmp-p).
Most desktop code will run (and continue to run) with only a few changes. This is actually true for games  but for 
applications it can be very difficult to port, even sometimes impossible.

As alternative using pygame or pygbag supported game engines will ensure you platform independence including access to mobile ones.

[basic structure of a game should be like :](https://github.com/pygame-web/pygbag/tree/main/test)
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
then run `pygbag test/main.py` against it, and first goes to http://localhost:8000?-i (with terminal and debugging info, for older pygbag version use http://localhost:8000#debug instead) or  http://localhost:8000 (fullscreen windowed when it is running ok)

usefull additions to your .gitignore 
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
- [for WASM](https://pygame-web.github.io/wiki/python-wasm/)
- [with pygbag](https://pygame-web.github.io/wiki/pygbag-code/) FAQ
- [pygbag code examples](https://pygame-web.github.io/wiki/pygbag-code/#pygbag-code-specifics-samples-)
- [List of available wheels](https://pygame-web.github.io/wiki/pkg/)

mandatory when importing packages : put the  "import " at top of main.py ( eg import numpy, matplotlib )

if using pygame-zero : put #!pgzrun near the top of main ( 2nd line is perfect if file already has a shebang )
Note: pgzero is mostly untested 

## Debugging / Desktop Simulator
- [enter debug mode](https://pygame-web.github.io/wiki/pygbag-debug/)
- while working you can access simulator of web loop by replacing `import asyncio` by `import pygbag.aio as asyncio` at top of main.py and run program directly from main.py folder
- TODO: android remote debugging via [chromium browsers series](https://developer.chrome.com/docs/devtools/remote-debugging/)
- TODO: universal remote debugging via irc client or websocket using pygbag.net
   
## Running
- [pygbag-script](https://pygame-web.github.io/wiki/pygame-script/) (wip!)
- [REPL](https://pygame-web.github.io/showroom/python.html?-i-&-X-dev#https://gist.githubusercontent.com/pmp-p/cfd398c75608504293d21f2642e87968/raw/773022eef4a2cc676ab0475890577a2b5e79e429/hello.py)
- [CPython testsuite](https://pygame-web.github.io/showroom/pythondev.html?-d#src/testsuite.py%20all) (wip!)

## Packaging
[ how to package a game](https://pygame-web.github.io/wiki/pygbag/)

## Publishing
- [to github pages from your repo](https://pygame-web.github.io/wiki/pygbag/github.io/)
- [to itch from web.zip](https://pygame-web.github.io/wiki/pygbag/itch.io/)

## Demos

### Demos on itch.io

- [Games using Python-WASM](https://itch.io/c/2563651/pygame-wasm) (expected to be stable)
- [Panda3D demos](https://itch.io/c/3724091/panda3d-wasm) (currently experimental)

### Demos on Github Pages

(for testing, may not always work since they use daily/weekly devel version)

#### Heavy CPU load, not for low-end devices

- [Perfect Rain](https://pmp-p.github.io/pygame-perfect-rain-wasm/)
- [Alien Dimension](https://pmp-p.github.io/pygame-alien-dimension-wasm/)

#### Light CPU load

- [Breakout](https://pmp-p.github.io/pygame-breakout-wasm/index.html)
- [PyChess](https://pmp-p.github.io/pygame-pychess-wasm/index.html)
- [Penguins Can't Fly !](https://pmp-p.github.io/pygame-PenguinsCantFly-wasm/)
- [John's Adventure](https://pmp-p.github.io/pygame-JohnsAdventure-wasm/)
- [3D Tic-Tac-Toe](https://pmp-p.github.io/pygame-ttt-3d-wasm/)
- [Arachnoids](https://pmp-p.github.io/pygame-arachnoids-wasm/)
- [Sudoku Solver](https://www.pete-j-matthews.com/Sudoku-Solver/)

Source code for these games can be found [here](https://github.com/pmp-p?tab=repositories&q=pygame-.-wasm&sort=name).

Please use the tag [pygame-wasm](https://github.com/topics/pygame-wasm) for your projects hosted on Github
and also add a favicon.png icon 32x32 next to your game main.py, so it is picked up by default.

### Script demos

nb : code is read-only, prefer right-click then open in new window.

- [i18n bidi, complex scripts](/showroom/pypad_git.html?-i#src/test_hb.py)
- [Camera](/showroom/pypad_git.html?-i#src/test_vidcap.py)
- [Panda3D](/showroom/pypad_dev.html?-i#src/test_panda3d_cube.py)
- [Audio Record/Play](/showroom/pypad_dev.html?-i#src/test_audio.py)
- [HTML output](/showroom/pypad_dev.html?-i#src/test_html.py)

## Technology:

- [initial devlog](https://github.com/pygame/pygame/issues/718) 
- [pygame-ce devlog](https://github.com/pygame-community/pygame-ce/issues/540)
- [Python Wasm explained by core dev Christian Heimes (youtube video)](https://www.youtube.com/watch?v=oa2LllRZUlU)

### Early demos from above talk, may not fully work as intended :)

- [pygame tech demo PyCon DE & PyData Berlin 2022](https://pmp-p.github.io/pygame-wasm/)
- [Galaxy Attack](https://pmp-p.github.io/pygame-galaxy-attack-wasm/)

French : Python WebAssembly at PyCon FR 2023
[Pour quoi, pour qui et comment](https://harfang3d.github.io/pyconfr2023/#1)

## Useful links

- [Current issues](https://github.com/pygame-web/pygbag/issues)
- [Package porting](https://github.com/pygame-web/pkg-porting-wasm/issues)
- [PyPI stats](https://pepy.tech/project/pygbag)
- [Pyodide/Pyscript](https://github.com/pyodide/pyodide)
- [Pygame Community](https://pyga.me/)
- [Pygame Community Discord Server](https://discord.gg/p7RjnVNTcM)
- [WebAssembly/Python Discord Server](https://discord.gg/MCTM4xFDMK)

Thanks for reading and supporting pygame-ce and pygbag. These tools could not exist without your support.

[Edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/README.md)
