# pygame-web.github.io
CDN root used by [pygbag](https://pypi.org/project/pygbag/)


[Github repo](https://github.com/pygame-web/pygbag), and [older runtimes](https://github.com/pygame-web/archives)

This software does not track usage at all, even for statistics purpose so if you like it : please do not forget to [star](https://github.com/pygame-web/pygbag/stargazers) it !

# Pygbag WIKI

#### IMPORTANT WIN32 users : do not use python installed from windows store, use an official python.org build
you can check version installed with `py --list ` command.
If python/pygbag is not installed in your PATH env, use the command  `py -m pygbag`

#### IMPORTANT MAC users : if you get SSL error, use the file "Install Certificates.command" in Applications/Python 3.XX

#### IMPORTANT: Please do not use wav/mp3 audio formats when packaging, pygbag would not work.

#### IMPORTANT: add `--template noctx.tmpl` to pygbag command line when using 3D/WebGL


Before packaging, adapt your code this way if you still want wav format on desktop :
```py
if sys.platform == "emscripten":
    snd = pygame.mixer.Sound("sound.ogg")
else:
    snd = pygame.mixer.Sound("sound.wav") # or .WAV,.mp3,.MP3
```

also avoid raw format like BMP for your assets they are too big for web use. prefer PNG or JPG
___

## template project

There is none actually, because pygbag is not a framework it is just a friendly web version of official CPython (nothing has been changed, just [some facilities added](https://discuss.python.org/t/status-of-wasm-in-cpythons-main-branch/15542/12?u=pmp-p)). Most desktop code will run (and will continue to run) with only a few lines changes. This is actually true for games  but for applications it can be very difficult to port, even sometimes impossible.

Try to avoid relying on CPython stdlib for web operations or I/O as it is very synchronous, platform specific and will probably stay that way.
As alternative using pygame or pygbag supported game engines will ensure you platform independence including access to mobile ones.

[basic structure of a game should be like :](https://github.com/pygame-web/pygbag/tree/main/test)
```
test
├── img
│   ├── pygc.bmp
│   ├── pygc.png
│   └── tiger.svg
├── main.py
└── sfx
    └── beep.ogg
```
then run `pygbag test/main.py` against it, and first goes to http://localhost:8000?-i (with terminal and debugging info) or  http://localhost:8000 (fullscreen windowed when it is running ok)

usefull additions to your .gitignore 
```
*.wav
*.mp3
*.pyc
*.egg-info
*-pygbag.???
/build
/dist
```

## [Coding]
- [for WASM](https://pygame-web.github.io/wiki/python-wasm/)
- [with pygbag](https://pygame-web.github.io/wiki/pygbag-code/) FAQ
- [pygbag code examples](https://github.com/pygame-web/pygame-web.github.io/blob/main/wiki/pygbag-code/README.md#pygbag-code-specifics-samples-)
- [List of available wheels](https://pygame-web.github.io/wiki/pkg/)
mandatory: put the  "import " at top of main.py ( eg import numpy, matplotlib )
if using pygame zero : put #!pgzrun near the top of main ( 2nd line is perfect if file has already a shebang )


## [Debugging]
- [enter debug mode](https://pygame-web.github.io/wiki/pygbag-debug/)
- TODO: android remote debugging via chromium browsers series.
- TODO: universal remote debugging via irc client or websocket.
   
## [Running]
- [pygame-script](https://pygame-web.github.io/wiki/pygame-script/) (wip!)
- [REPL](https://pygame-web.github.io/showroom/python.html?-d#https://gist.githubusercontent.com/pmp-p/cfd398c75608504293d21f2642e87968/raw/773022eef4a2cc676ab0475890577a2b5e79e429/hello.py)
- [CPython testsuite](https://pygame-web.github.io/showroom/pythondev.html?-d#src/testsuite.py%20all) (wip!)

## [packaging]
[ how to package a game](https://pygame-web.github.io/wiki/pygbag/)

## [Publishing]
- [to github pages from your repo](https://pygame-web.github.io/wiki/pygbag/github.io/)
- [to itch from web.zip](https://pygame-web.github.io/wiki/pygbag/itch.io/)

___

### Demos on github pages :

(for testing, may not always work since they use daily/weekly devel version)

##### heavy cpu load not for low-end devices:

[Perfect Rain](https://pmp-p.github.io/pygame-perfect-rain-wasm/)

[Alien Dimension](https://pmp-p.github.io/pygame-alien-dimension-wasm/)

##### Light cpu load :

[Breakout](https://pmp-p.github.io/pygame-breakout-wasm/index.html)

[PyChess](https://pmp-p.github.io/pygame-pychess-wasm/index.html)

[Penguins Can't Fly !](https://pmp-p.github.io/pygame-PenguinsCantFly-wasm/)

[John's Adventure](https://pmp-p.github.io/pygame-JohnsAdventure-wasm/)

[3D Tic-Tac-Toe](https://pmp-p.github.io/pygame-ttt-3d-wasm/)

[Arachnoids](https://pmp-p.github.io/pygame-arachnoids-wasm/)


### view code from above games and others on github

[[view the code]](https://github.com/pmp-p?tab=repositories&q=pygame-.-wasm&sort=name)

Please ! use the tag [pygame-wasm](https://github.com/topics/pygame-wasm) for your projects hosted on Github
and also add a favicon.png icon 32x32 next to your game main.py, so it is picked up by default.

### Demos on itch.io:

( expected to be stable )

[games on itch.io](https://itch.io/c/2563651/pygame-wasm)


### Early demos ( may not fully work as intended ):

[pygame tech demo PyCon DE & PyData Berlin 2022](https://pmp-p.github.io/pygame-wasm/)

[Galaxy Attack](https://pmp-p.github.io/pygame-galaxy-attack-wasm/)


___

## Technology:

[devlog](https://github.com/pygame/pygame/issues/718)

[Python Wasm explained by core dev Christian Heimes (youtube video)](https://www.youtube.com/watch?v=oa2LllRZUlU)


## current status

[explore current issues](https://github.com/pygame-web/pygbag/issues)

[PyPI stats](https://pepy.tech/project/pygbag)

[pyodide/pyscript](https://github.com/pyodide/pyodide/issues/289#issuecomment-1121021861)


### Thanks for supporting pygame and pygbag. Without support now, there won't be pygame or pygbag later.

[Hello from the pygame community.](https://www.pygame.org/contribute.html)

#### Connect with Discord

[Pygame community](https://discord.gg/p7RjnVNTcM)

[WebAssembly/Python](https://discord.gg/MCTM4xFDMK)

#### Work in Progress, PR welcomed,  propose links to games or tutorials, please contribute !!!


[edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/README.md)

