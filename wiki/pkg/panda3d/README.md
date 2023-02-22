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
