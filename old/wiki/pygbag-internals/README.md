# pygbag-internals

When running in the webpage pygbag is in fact a C runtime linked to libpython ( cpython-wasm from python.org) compiled to WebAssembly with emscripten compiler and hosted on a CDN (pygame-web.github.io). It is downloaded once per game and per version update for fast local use.

There's some javascript glue to connect the C library used by pygbag and python to some file descriptors. You cannot guess the mechanism that easily because calls originate from wasm cpu which is not exposed in javascript console.

Those file descriptors manipulated by the libc (musl provided by emsdk the portable emscripten compiler) can be in a virtual filesystem hosted by MEMFS from emscripten runtime ( eg for /tmp ) or BrowserFS a more advanced virtual filesystem ( /data and /usr ).

They can also be stdin/stdout/stderr file descriptors and this is why you can find the file on startup : the python part of html file is sent to python interpreter as if you typed it in your shell this is done by calling PyRun_InteractiveLoop on that file descriptor.

Later if a file "main.py" is found in the Virtual filesystem it is queued but you can also pass relative file url on the command line eg https://pygame-web.github.io/showroom/pypad.html#src/test_panda3d_cube.py. It also work with github gist raw links. pygbag can also embed code or git repo eg https://pygame-web.github.io/showroom/test_embed_git.html directly in html pages.

Some packages like pygame-ce, Panda3D or Harfang3D are indeed pre-compiled to WebAssembly and that's because they are mostly C or C++.

Python code is actually interpreted and type-annotated code could be compiled direcly to Wasm but that fonctionnality is not (yet) available for public use.

The format choosen for game archive is a zip file similar to android APK though unaligned and unsigned. The android runtime to make these run on real android is not (yet) available for public use either.
