[Panda3D is a framework for 3D rendering and game development for Python and C++ programs.](https://pypi.org/project/Panda3D/)

[original documentation](https://docs.panda3d.org/1.10/python/index)

typical import

```
import panda3d.core as p3d
```

## main loop
ShowBase.run() must be patched because it is not async, for convenience
pygbag runtime applies a monkey-patch to do that automatically.
But if you use taskMgr.step() or use the wheel in your own python runtime then you should do it that way:
```py
async def main():
    while True:
        taskMgr.step()
        await asyncio.sleep(0)

if __name__=="__main__":
    asyncio.run( main() )
```

## shaders
Use either '#version 100' GLES1/2 or GLES3 
Like this:
```
#version 300 es
precision mediump float;
```

Precision is mandatory, also mobile devices are often single precicision.

Changes made to get a wheel [PR against webgl-port branch](https://github.com/pmp-p/panda3d/pull/4)



# conversion tutorial

the basic command to produce a itch.io compatible zip is

```
python -m pygbag --archive --template noctx.tmpl --ume_block 0 main.py
```

note: only use `--ume_block 0` when you have no sound playing at game startup ( loading screen / main menu )

This zip archive can be uploaded directly on itch after selection on the HTML game type . (provided everything else works and is set up as detailed below)

## changes to the code.

The base used was [https://github.com/BMaxV/panda3d_shading 03main.py](https://github.com/BMaxV/panda3d_shading 03main.py)

note: preferably use a 1024x600 screen size.

## changes to the code for web

so my original code uses this kind of mainloop:

```
def main():
    W = Wrapper()
    while True:
        delta_t = globalClock.dt
        W.b.taskMgr.step()
        W.main(delta_t)

if __name__=="__main__":
    main()
```

Which has the advantage that it's "obvious" where the main loop takes place. `W.main` is performing the steps defined by the programmer/user and `W.b.taskMgr.step()` executes all the engine functionality, like rendering.

this is changed to

```
async def main(): # this one defines the main as async
    W = Wrapper()
    while True:
        delta_t = globalClock.dt
        W.b.taskMgr.step()
        W.main(delta_t)
        await asyncio.sleep(0) # this line is new

if __name__=="__main__":
    asyncio.run( main() ) # this is asyncronously running main.
```

with an additional import of

```
import pygbag.aio as asyncio
```

which "gives control to the browser" in between ticks.

## importing a "pure python" custom module

For example the imported custom module is https://github.com/BMaxV/panda3d_interface_glue and that one should have no dependencies except Panda3D.

NB: If module uses Numpy be sure to add "import numpy" at top of your main.py

This is a good example for importing your custom modules but you can also download the wheel from pypi, where pure python wheels usually have "py3-none" in their name.

Here I built the "interface glue" with

```
python3 setup.py bdist_wheel --universal
```

which builds the module into a wheel at `interfacegluedir/dist` The wheel then should be unpacked with some zip unpacking. The folder of interest is the `panda_interface_glue` folder, that has to exist at the same level as your main.py



## testing

If you leave `--archive` out, it starts a local webserver instead and you can visit (default) http://localhost:8000/ to test how well it works.

You can visit [http://localhost:8000/?-i](http://localhost:8000/?-i) instead to get to the debug console.

The name `main.py` is actually important, your main file has to be called `main.py`, alternative names will not work.

_________


[edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pkg/panda3d/README.md)
