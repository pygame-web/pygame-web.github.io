## Python code specifics, when in the browser with pygbag runtime

### Sound problems
SDL2 is hard realtime, so sometimes the game asks too much from average devices and is a bit late on frame :
As a result SFX get garbled, here's a less than ideal fix that can leverage the problem.
```py
import pygame
pygame.init()
try:
    pygame.mixer.SoundPatch()
except:
    pass
```

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
if (wasm := sys.platform in ('emscripten','wasi')):
    from platform import window

async def main():
    global ctx
    rng = 10 # resolution of progress bar
    slot = (1024-200)/rng
    for i in range(rng):

        marginx = 100
        marginy = 200
        pygame.draw.rect(screen,(10,10,10),( marginx-10, marginy-10, (rng*slot)+20, 110 ) )
        pygame.draw.rect(screen,(0,255,0), ( marginx, marginy, (1+i)*slot, 90) )
        pygame.display.update()
        if wasm:
            window.chromakey(None, *screen.get_colorkey(), 30)
        await asyncio.sleep(1)


asyncio.run(main())
```


[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag-code/README.md)

