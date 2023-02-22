Welcome to the pygbag packages (actually wheel format) repository list.

README.md should be in  /wiki/pkg/`<import name>`/README.md , not the pypi project name.
  
It should have at least a short example and attempt to cover those points :  
- the case when a loop must be async-ified
- files have been modified, explain why
- files added, what are they for ?
- files removed ( explain why , maybe size / irrelevant ... )
- missing/extra functionnalitites list details
- what does it bring that pygame cannot do, or cannot do in an easy way.
- ideally point to a pull request (PR) from a pygbag branch toward main branch. [example](https://github.com/pmp-p/nurses_2-wasm/pull/1/files)

The actual wheels are located here :

[https://github.com/pygame-web/archives/tree/main/repo/pkg/](https://github.com/pygame-web/archives/tree/main/repo/pkg/)

They are downloaded on code evaluation, from executing your main.py modules based on raised import errors.
so put your imports at the top, and possibly order them to limit looping over import errors.

Current packages troubleshooting until full acceptation is done here :

[AVAILABLE FOR TESTING](https://github.com/pygame-web/pkg-porting-wasm/issues?q=is%3Aissue+is%3Aopen+label%3A%22AVAIL+FOR+TESTING%22)




documented modified packages :


 - [pygame] Starting with 0.7 pygbag runtime will use [pygame-ce](https://github.com/pygame-community/pygame-ce) codebase.
 - [nurses_2](https://pygame-web.github.io/wiki/pkg/nurses_2/)
 - [harfang] from [vendored pygbag](https://github.com/harfang3d/harfang-wasm)
 - [panda3d](https://pygame-web.github.io/wiki/pkg/panda3d/) from [Panda3D wasm branch](https://github.com/panda3d/panda3d/tree/webgl-port) + [vendored pygbag](https://github.com/pmp-p/panda3d-wasm)
 

[edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pkg/README.md)
