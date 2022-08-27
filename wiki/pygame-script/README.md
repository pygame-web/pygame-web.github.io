## When to use pygame script ?

 - when you don't need assets packaging because you download them at runtime
 - if your code can still fit in one file 
 - you just want quick testing in real conditions but pygbag repl (#debug) is not handy.
 - for making python/pygame small examples and fit them in a iframe
 - for writing pygbag's load screens

Create a .html file like this one :
```html
<html><head><meta charset="utf-8"></head><script src="https://github.com/pygame-web/archives/tree/main/0.1.4/runpy.js" type=module id="site" data-src="fs,vtx,gui" async defer>#<!--
import sys
import platform
import asyncio

async def main():
    for i in range(10):
        print("hi")
        await asyncio.sleep(1)

asyncio.run(main())

embed.run()

# --></script></html>
```

the data-src tags allows for 
  - fs : you will be able to use Filesystem, camera, photo and user uploaded files.
  - vt : simple vt100 with no worker
  - vtx : full xterm.js, requires worker
  - stdout : no vt100, only `<pre>` output in body.
  - gui : can use canvas, mandatory for pygame.



[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygame-script/README.md)
