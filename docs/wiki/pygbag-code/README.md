## Python code specifics, when in the browser with pygbag runtime

on some platforms pygbag is not in the PATH, so use `python -m pygbag` instead of just pygbag.


### My game does not start automatically
This is the default, because browser will not start any music until user says so
by interacting clicking/gamepad/keyboard with game tab

### but i really don't have any music on game start
then prepend `--ume_block=0` on pygbag command line and your game will auto start.

### Sound problems for versions < 0.1.5
SDL2 is hard realtime, so sometimes the game asks too much from average devices and is a bit late on frame :
As a result SFX get garbled, solution : upgrade to 0.1.5 or use external javascript sound manager.

Possible other solution: replace sdl2_audio by openal, PR welcomed ...

### I have custom modules or something looks like it is missing from stdlib

Just add everything you need alonside your main.py, including hand picked stdlib modules.
We did not put everything from stdlib in order to keep a small size for mobile connections.
you can find extra stdlib modules in pythonx.xx.x.zip from https://github.com/pygame-web/archives/tree/main/ [pygbag version]

### but I want numpy or binary modules

Just add everything you need alonside you main.py, including binary modules.
They just have to **match python version** pygbag is loading if they are not wasm abi3 modules.
Sometimes you may have to wait for maintener (like pymunk), build your own with [python-wasm-sdk](https://github.com/pygame-web/python-wasm-sdk), extract a wheel from or pyodide's build,  or maybe just ask/offer a link to it
[here](https://github.com/pygame-web/pygbag/issues/37)




### File uploading
#### sample : image file viewer
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
    async with platform.fopen( cdn / "repodata.json", "r") ) as textfile:
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


[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag-code/README.md)

