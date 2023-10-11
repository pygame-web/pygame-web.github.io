[Panda3D is a framework for 3D rendering and game development for Python and C++ programs.](https://pypi.org/project/Panda3D/)

[original documentation](https://docs.panda3d.org/1.10/python/index)

typical import

```
import panda3d.core as p3d
```

## main loop
ShowBase.run() must be patched because it is not async 
pygbag runtime applies a monkey-patch for that automatically.
but it you use taskMgr.step() then you should do it that way:
```py
async def main():
    while True:
        taskMgr.step()
        await asyncio.sleep(0)

if __name__=="__main__":
    asyncio.run( main() )
```

## shaders
use either '#version 100' GLES1/2 or GLES3 like this:
```
#version 300 es
precision mediump float;
```

Precision is mandatory, also mobile devices are often single precicision.






Changes made to get a wheel [PR against webgl-port branch](https://github.com/pmp-p/panda3d/pull/4)


[append issues here](https://github.com/pygame-web/pkg-porting-wasm/issues/6)



[edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pkg/panda3d/README.md)
