# pygame-web.github.io

![pygbag logo](assets/pygbag_logo.png?raw=true "Pygbag Logo")

This is the CDN root used by [Pygbag](https://pypi.org/project/pygbag/). (pronounce pig-bag)

[The wiki](/wiki/).

[Source code](https://github.com/pygame-web/pygbag)

[Old runtimes and current](https://github.com/pygame-web/archives)


### Pygbag does not track usage at all, not even for statistical purposes. 
If you like it, please [star](https://github.com/pygame-web/pygbag/stargazers) the repository!

## (Very) important points

**<ins>Also, read the page on [making your code compatible with browser game loop](https://pygame-web.github.io/wiki/python-wasm). You will probably have to change some of your code.</ins>**

### All operating systems

- Name your main game script `main.py` and put it in the root folder of your game.
- Make your main loop async-aware and use `asyncio.sleep(0)` every iteration to give control back to the main thread.
- ~~Add `--template noctx.tmpl` to pygbag command line if using 3D/WebGL.~~
- Put the import statements of complex packages in order (but numpy first) at the top of `main.py`.
- Avoid using CPython's standard library for web operations, GUI (like tkinter), or I/O as it is very synchronous/platform-specific and will probably stay that way. In terms of GUI alternatives, [pygame_gui](https://pypi.org/project/pygame_gui) works on top of [pygame-ce](https://pyga.me), [Panda3D](https://www.panda3d.org/) provides [directgui](https://docs.panda3d.org/1.10/python/programming/gui/directgui/index) and Harfang3D provides imgui. They are all cross-platform.
- You can add a square image file named `favicon.png` in your game's root folder to make Pygbag use it as the web package's favicon.
- <ins>Make sure all audio files are in OGG (best compression format targeting 16bits 24Khz Mono). (that is especially **not in WAV/AIFF/M4A/MP3 format**)</ins>
- Avoid raw formats like BMP for your image assets, they are too big for web use; use PNG/WEBP or JPG instead.

- Filenames are case sensitive ( Folder/MyFile.png and folder/myfile.png are two different files). Do not use filenames like `*-pygbag.*`  that pattern is reserved for pygbag internal use (optimizing pass).

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



## Templates
    
There is actually nothing specific for projects except naming entry point main.py, because Python-WASM is just a web-friendly version of CPython REPL with [some added facilities](https://discuss.python.org/t/status-of-wasm-in-cpythons-main-branch/15542/12?u=pmp-p). Most desktop code will run (and continue to run) with only a few changes. 

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
where `test` is the "runtime game folder", current working directory ( os.getcwd() ) or more simply  "."

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
But there are templates to customize runtime startup for 2D and 3D, see [templates](/wiki/pygbag/#templates)


[controlling pygbag packing and options from pygbag.ini](/wiki/pygbag-configuration)


## Coding

- [General Python-WASM](/wiki/python-wasm/)
- [With Pygbag specifically](/wiki/pygbag-code/)
- [Pygbag code examples](/wiki/pygbag-code/#pygbag-code-specificssamples)

## Adding modules

- [List of available wheels](/wiki/pkg/)
- [requesting modules](https://github.com/pygame-web/pkg-porting-wasm/issues)
- [Panda3D quickstart](https://pygame-web.github.io/wiki/pkg/panda3d)


When importing **non-stdlib** packages (for example, numpy or matplotlib), you must put their import statements at top of `main.py`. You should also add a metadata header as specified by [PEP 723](https://peps.python.org/pep-0723/), for example:

```py
# /// script
# dependencies = [
#  "pygame-ce",
#  "pyscroll",
#  "pytmx",
# ]
# ///
```
more on : https://packaging.python.org/en/latest/specifications/inline-script-metadata/#inline-script-metadata

## Debugging / Desktop Simulator

- The REPL shortcut http://localhost:8000?-i, REPL will (should) run concurrently as main.py.
- [How to enter debug mode](/wiki/pygbag-debug/)
- While working, you can access the simulator of the web loop by replacing `import asyncio` by `import pygbag.aio as asyncio` at top of main.py and run the program from the folder containing it.
- TODO: Android remote debugging via [chromium browsers series](https://developer.chrome.com/docs/devtools/remote-debugging/).
- TODO: Universal remote debugging via IRC Client or websocket using pygbag.net.
- [pygbag runtime ?](/wiki/pygbag-internals)


There's number of command line options : read Pygbag's [project description](https://pypi.org/project/pygbag/) for a more detailed overview.


Visit the [wiki](/wiki/) to get started!


**Work in progress, pull requests welcomed. Feel free to propose links to games or tutorials. Please contribute!!!**

Logo thanks to https://github.com/FinFetChannel 

[Edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/README.md)
