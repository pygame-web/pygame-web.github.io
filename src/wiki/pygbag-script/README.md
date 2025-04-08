## When to use pygbag script ?

 - when you don't need assets packaging because you download them at runtime.
 - if your code can still fit in one file.
 - you just want quick testing in real conditions but pygbag repl (#debug) is not handy.
 - for writing pygbag's load screens (files .tmpl in static folder from source repo).
 - for making python/pygame small examples and fit them in a iframe.
 - for making interactive tutorials.
 - when making a single app html file.
 - when hosting locally cdn files with no outside access (though pygbag supports local cdn with --cdn)
 - when pygbag can not run for you (mobile or restricted work environnement).

Create a .html file like this one :
```py
<html><head><meta charset="utf-8"></head><script src="https://pygame-web.github.io/archives/0.7/pythons.js" type=module id="site" data-os="fs,vtx,gui" async defer>#<!--

import sys
import platform
import asyncio

async def main():
    for i in range(10):
        print("hi")
        await asyncio.sleep(1)

asyncio.run(main())

# do not change/remove the following comment it is for clearly separating python code from html body
# --></script></html>
```

mobile demo : [https://pygame-web.github.io/showroom/pygame-scripts/org.pygame.touchpong.html](https://pygame-web.github.io/showroom/pygame-scripts/org.pygame.touchpong.html)


the data-os tags allows for
  - fs : you will be able to use Filesystem, camera, photo and user uploaded files.
  - vt : simple vt100 with no worker
  - vtx : full xterm.js ( with sixel graphics requires webgl+worker )
  - stdout : no vt100, only `<pre>` output in body.
  - gui : can use canvas, mandatory for pygame.

the data-python tag:
  - cpython : use cpython runtime (default cpython3.11) eg cpython3.11 cpython312
  - pkpy : use PocketPy runtime (default pkpy1.3)
  - wapy : use WaPy runtime ( default wapy2.0, currently not available )
  - python : use python runtime ( future limited ABI)

#### running the script outside browser
simple just type :
```
python3 -x index.html
```

#### formatting my pygame script ?
~~follow that issue : https://github.com/psf/black/issues/3214~~
done, now you can use `black -x -l 132` to format your code


