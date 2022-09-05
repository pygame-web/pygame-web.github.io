## When to use pygame script ?

 - when you don't need assets packaging because you download them at runtime.
 - if your code can still fit in one file.
 - you just want quick testing in real conditions but pygbag repl (#debug) is not handy.
 - for writing pygbag's load screens.
 - for making python/pygame small examples and fit them in a iframe.
 - for making interactive tutorials.
 - when making a single app html file.
 - when hosting locally cdn files with no outside access (though pygbag supports local cdn with --cdn)
 - when pygbag can not run for you (mobile or restricted work environnement).

Create a .html file like this one :
```py
<html><head><meta charset="utf-8"></head><script src="https://pygame-web.github.io/archives/0.2.0/pythons.js" type=module id="site" data-src="fs,vtx,gui" async defer>#<!--
import sys
import platform
import asyncio

async def main():
    for i in range(10):
        print("hi")
        await asyncio.sleep(1)

asyncio.run(main())

embed.run()

# do not change/remove the following comment it is for clearly separating python code from html body
# --></script></html>
```

the data-src tags allows for 
  - fs : you will be able to use Filesystem, camera, photo and user uploaded files.
  - vt : simple vt100 with no worker
  - vtx : full xterm.js ( with sixel graphics requires webgl+worker )
  - stdout : no vt100, only `<pre>` output in body.
  - gui : can use canvas, mandatory for pygame.
  
 future tags:
  - p3d : support Panda3D import
  - hg3d : support Harfang3D import


#### running the script outside browser
simple just type :
```
python3 -x index.html
```

#### formatting my pygame script ?
follow that issue : https://github.com/psf/black/issues/3214

[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygame-script/README.md)
