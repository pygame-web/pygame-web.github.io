[Panda3D is a framework for 3D rendering and game development for Python and C++ programs.](https://pypi.org/project/Panda3D/)

[original documentation](https://docs.panda3d.org/1.10/python/index)

typical import

```
import panda3d.core as p3d
```

ShowBase.run() must be patched because it is not async 
pygbag runtime applies a monkey-patch automatically.



Changes made to get a wheel [PR against webgl-port branch](https://github.com/pmp-p/panda3d/pull/4)


[append issues here](https://github.com/pygame-web/pkg-porting-wasm/issues/6)


# conversion tutorial

the basic command to produce a itch.io compatible zip is

```
python -m pygbag --archive --template noctx.tmpl --ume_block 0 main.py
```

This zip can be uploaded directly. (provided everything else works and is set up as detailed below)

## testing


If you leave `--archive` out, it starts a local webserver instead and you can visit (default) http://localhost:8000/ to test how well it works.

You can visit http://localhost:8000/?-X&dev&-i instead to get to the debug console.

The name `main.py` is actually important, your main file has to be called `main.py`, alternative names will not work.

## changes to the code.

I used https://github.com/BMaxV/panda3d_shading 03main.py

## custom modules

The imported custom module is https://github.com/BMaxV/panda3d_interface_glue and that one should have no dependencies except panda3d.

but it's a good example for importing your custom modules.

I built the "interface glue" with

```
python3 setup.py bdist_wheel --universal
```

which builds the module into a wheel at `interfacegluedir/dist` The wheel then should be unpacked with some zip unpacking. The folder of interest is the `panda_interface_glue` folder, that has to exist at the same level as your main.py

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

which "gives control the browser" in between ticks.
