Welcome to the pygbag packages (actually wheel format) repository list.

README.md should be in  /wiki/pkg/`<import name>`/README.md , not the pypi project name.
  
It should have at least a short example and attempt to cover those points :  
- the case when a loop must be async-ified
- files have been modified, explain why
- files added, what are they for ?
- files removed ( explain why , maybe size / irrelevant ... )
- missing/extra functionnalitites list details
- what does it bring that pygame cannot do, or cannot do in an easy way.
- ideally point to a PR from a pygbag branch PR toward main branch. [example](https://github.com/pmp-p/nurses_2-wasm/pull/1/files)

The actual wheels are located here :

[https://github.com/pygame-web/archives/tree/main/repo/pkg/](https://github.com/pygame-web/archives/tree/main/repo/pkg/)

They are downloaded on code evaluation, from executing your main.py modules based on raised import errors.
so put your imports at the top, and possibly order them to limit looping over import errors.

Current packages troubleshooting until full acceptation is done here :

[AVAILABLE FOR TESTING](https://github.com/pygame-web/pkg-porting-wasm/issues?q=is%3Aissue+is%3Aopen+label%3A%22AVAIL+FOR+TESTING%22)



documented modified packages :
 - [nurses 2](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pkg/nurses_2/README.md)
 


[edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pkg/README.md)
