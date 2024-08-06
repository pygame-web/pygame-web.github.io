# Pygbag code FAQ/Samples
## FAQ

### "Command `pygbag` is not found. What should I do?"
On some platforms, pygbag is not included in the PATH environment variable, so use `python3 -m pygbag` instead of just pygbag, `python -m pygbag` if you don't also have Python 2 installed or `py -m pygbag` on Windows platforms. (Make sure to use Python downloaded from python.org, not Microsoft Store)

### "My game does not start automatically."
This is the default, because most browsers will not start any music until user interacts with the game.

### "But I *really* want my game to start automatically."
Append `--ume_block=0` to your command and your game will start without user input.

### Sound problems for versions < 0.1.5
SDL2 is hard realtime, so sometimes the game asks too much from average devices and is a bit late on frame. Because of this, sound effects are distorted. To solve this, upgrade to 0.1.5 or use external Javascript sound manager.

Possible other solution: replace sdl2_audio by openal, PR welcomed...

### "My game has low frame rate in the browser."
Make sure you have removed all debug `print()` calls, as printing to the terminal or console reduces performance a lot.

### "I need to use third-party modules./Something from the standard library is missing."

Add everything you need alongside `main.py`, including hand-picked stdlib modules. Pygbag does not include Python's entire standard library in order to keep a small build size for mobile connections. You can find extra stdlib modules in `pythonx.xx.x.zip` from [python.org](https://www.python.org/downloads/source/) matching pygbag python version (3.12 is the default). You can change python stdlib version adding `--PYBUILD 3.13` .

### "I need to use numpy or binary modules."

Add everything you need alongside `main.py`, including binary modules. They must be compatiable with **the Python version loaded by Pygbag in the web page**: this may not be the python version you used to run pygbag - when they are not wasm abi3 modules. Sometimes you may have to wait for the maintainer to provide a build, build your own with [python-wasm-sdk](https://github.com/pygame-web/python-wasm-sdk), extract a wheel from or pyodide's build,  or maybe just ask/offer a link to it [here](https://github.com/pygame-web/pkg-porting-wasm/issues).

### "I want to access a micro-controller via pyserial."

It is possible to access FTDI (and clones) USB serial ports, but it is very experimental. You need to remove the driver using the serial port for that (`rmmod` or `zadig`).

## Pygbag code specifics/samples

### File uploading
#### sample : image file viewer [try it](https://pygame-web.github.io/showroom/pypad.html#src/test_upload.py)
```py
import platform

def on_upload_files(ev):
    print("on_upload_files", ev)
    if ev.mimetype.startswith('image/'):
        # we can display that
        shell.display(ev.text)

platform.EventTarget.addEventListener(None, "upload", on_upload_files )
platform.window.dlg_multifile.hidden = false
```

___

### File downloading

#### sample : async downloading of (r) utf-8 textfiles or (rb) binary files
```py
import platform
from pathlib import Path
cdn = Path("https://cdn.jsdelivr.net/pyodide/dev/full")

async def main():
    async with platform.fopen( cdn / "repodata.json", "r") as textfile:
        print( len( textfile.read() ) )
asyncio.run(main())
```


#### sample : DEPRECATED synchronous download of non binary files
```py
from pathlib import Path
cdn = Path("https://cdn.jsdelivr.net/pyodide/dev/full")

import urllib.request
outfile, _ = urllib.request.urlretrieve(cdn / "repodata.json", outfile)

# or just: 
# outfile = "/tmp/pip.json"
# shell.wget(f"-O{outfile}", cdn / "repodata.json")

import json
with open(outfile) as data:
    repo = json.loads( data.read() )

print( json.dumps(repo["packages"], sort_keys=True, indent=4) )
```

### upload a local file (async)

implemented, event based, TODO sample

### downloading files created by python
Python files can still be created normally and will appear in the browser's filesystem.
```py
# example
with open("file.txt", "w") as f:
    f.write("newly created file")
```

Downloading these files from the browser's filesystem to a user's filesystem is possible through pygbag's debug repl.
Ways to do so are available in the [debug repl's wiki page](https://pygame-web.github.io/wiki/pygbag-debug/).
```

### editing local files 

not implemented, TODO : https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle




#### sample : using async input() [[try it]](https://pygame-web.github.io/showroom/pypad.html#src/test_input.py)
```py
import asyncio

async def main():
    color = await input("what is your favorite colour ? ")
    print(f" {color=} ")

asyncio.run(main())
```


#### sample : using pygame zero [[try it]](https://pygame-web.github.io/showroom/pypad.html#src/test_pg0_0.py)
do not forget the leading #!pgzrun !
```py
#!pgzrun
WIDTH = 800
HEIGHT = 600

class ship:
    x = 370
    y = 550
    @classmethod
    def update(cls):
        screen.draw.filled_circle( (cls.x, cls.y), 10, (128,128,128))

def update():
    if keyboard.left:
        ship.x = ship.x - 5
    if keyboard.right:
        ship.x = ship.x + 5

def draw():
    screen.fill((80,0,70))
    ship.update()
```


#### sample : chroma keying the display of a progress bar over a webpage
```py
import pygame
import sys
screen = pygame.display.set_mode([1024, 600], pygame.SRCALPHA, 32)
screen.set_colorkey( (0,0,0,0), pygame.RLEACCEL )
screen.fill( (0,0,0,0) )
if (web := sys.platform in ('emscripten','wasi')):
    from platform import window

async def main():
    global ctx, web
    rng = 10 # resolution of progress bar
    slot = (1024-200)/rng
    for i in range(rng):

        marginx = 100
        marginy = 200
        pygame.draw.rect(screen,(10,10,10),( marginx-10, marginy-10, (rng*slot)+20, 110 ) )
        pygame.draw.rect(screen,(0,255,0), ( marginx, marginy, (1+i)*slot, 90) )
        pygame.display.update()
        if web:
            window.chromakey(None, *screen.get_colorkey(), 30)
        await asyncio.sleep(1)


asyncio.run(main())
```


### Handling persistent data across sessions
```py
if __import__("sys").platform == "emscripten":
    from platform import window
```
backup :
`window.localStorage.setItem("mygame", str(myvalue) )`

restore :
`myvalue = window.localStorage.getItem("mygame")`

erase :
```py
keys = []
for i in range(window.localStorage.length):
    keys.append(window.localStorage.key(i))
while keys: window.localStorage.removeItem(keys.pop())
```

### change page background color ( around pygame screen )
```py
import sys
import platform

# document may not exist on non-emscripten platforms
if sys.platform == "emscripten":    
    platform.document.body.style.background = "#404040"
```    
### mobile events handling 

TODO, drag/drop events, gestures.

### getting camera image [try it](http://pygame-web.github.io/showroom/pypad.html?-i#src/vidcap.py)

TODO, pygame interface is not finished.

### i18n: keyboard layout independant keycodes

TODO

### client socket usage ( async )

TODO



[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag-code/README.md)

