# pygbag

<!-- TODO: make work ![pygbag logo](assets/pygbag_logo.png) -->

`pygbag` is a command-line tool for developing `pygame` projects for the web.

This is the CDN root used by `pygbag`, as well as the location of its
documentation.

```{note}
Pygbag does not track usage at all, not even for statistical purposes.

If you like it, please [star](https://github.com/pygame-web/pygbag/stargazers) the repository!
```

## Minimal example

```py
# main.py
import asyncio
import pygame


async def main():
    pygame.init()
    screen = pygame.display.set_mode((320, 240))
    clock = pygame.time.Clock()

    x_pos = 0
    while True:
        screen.fill((0, 0, 0))
        pygame.draw.circle(
            surface=screen,
            color=(255, 255, 255),
            center=(x_pos, 10),
            radius=4,
        )
        pygame.display.update()

        x_pos += 1

        clock.tick(60)
        await asyncio.sleep(0)


asyncio.run(main())
```

To run this game on web:

```
$ pygbag main.py
...
Serving HTTP on 127.0.0.1 port 8000 (http://localhost:8000/) ...
```

See [](./how-to/quick-start.md) for a basic how-to guide on using `pygbag`, or
[](./tutorials/simple-game-tutorial.md) for a longer step-by-step guide.

<!-- ## (Very) important points

**<ins>Also, read the page on [making your code compatible with browser game loop](https://pygame-web.github.io/wiki/python-wasm). You will probably have to change some of your code.</ins>**


- You can add a square image file named `favicon.png` in your game's root folder
  to make Pygbag use it as the web package's favicon.

- Before packaging, adapt your code this way if you still want WAV/MP3 format on
desktop:

```py
if sys.platform == "emscripten":
    snd = pygame.mixer.Sound("sound.ogg")
else:
    snd = pygame.mixer.Sound("sound.wav") # or .WAV, .mp3, .MP3, etc.
```

- If you have heightmaps in your assets use `--no_opt` to prevent png
recompression.

- if you want to keep pixelated look whatever the device screen size is use:

```py
import sys, platform
if sys.platform == "emscripten":
    platform.window.canvas.style.imageRendering = "pixelated"
```


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


**Work in progress, pull requests welcomed. Feel free to propose links to games or tutorials. Please contribute!!!**

Logo thanks to https://github.com/FinFetChannel  -->

```{toctree}
:hidden:

tutorials/index
how-to/index
reference/index
explanations/index
```

```{toctree}
:caption: About
:hidden:

contributing
pygbag on PyPI <https://pypi.org/project/pygbag/>
pygbag on GitHub <https://github.com/pygame-web/pygbag>
pygbag old/current runtimes <https://github.com/pygame-web/archives>
```
