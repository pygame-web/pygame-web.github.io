# Pygbag
This page covers installing Pygbag, using it to package your game, and uploading it to be played by anyone on the Internet.

If you have questions at any point, you can ask for help in [Pygame's Discord Server](https://discord.gg/s6Hhrh77aq).

## Installation
First, we need to install Pygbag itself. Pip is a tool used to install Python libraries, and it's usually installed along with Python. 

Execute the following command in the terminal:
`pip install git+https://github.com/pygame-web/pygbag --user --upgrade`.<br>
This would install/upgrade to the latest version of pygbag.

`pip install pygbag --user --upgrade` also works.

## Quick Start Guide
### Code
You won't need to change much of your project's code to make it compatible with Pygbag:

1. Name the file with your game loop `main.py`.
1. Add `import asyncio` to the script containing your game loop.
2. Encapsulate your variable declarations (other than the window, as other functions might use it too)
3. Put the game loop inside `main()`. It must be an asynchronous function (use `async def` instead of `def`).
3. Put `await asyncio.sleep(0)` anywhere in your game loop. Right after your `clock.tick()` is fine.
4. Put `asyncio.run(main())` at the end of the file. The game loop will be run here, so any additional lines will not be run.

Here's a working example for what `main.py` might look like.
```py
import asyncio
import pygame

pygame.init()
pygame.display.set_mode((320, 240))
clock = pygame.time.Clock()


async def main():
    count = 60

    while True:
        print(f"{count}: Hello from Pygame")
        pygame.display.update()
        await asyncio.sleep(0)  # You must include this statement in your main loop. Keep the argument at 0.

        if not count:
            pygame.quit()
            return
        
        count -= 1
        clock.tick(60)

asyncio.run(main())
```
<!-- ### Web Testing
When packaging, Pygbag sets up a local server which runs your game and provides debug information. This is only accessible from your own computer. If you do not need to debug your game, add `--build` to the command line options. -->



### Running your project in your own browser
On the command line, navigate to the parent directory of your project. (that is, the directory which holds it)

Run this command: `pygbag folder_name` (replace `folder_name` with the name that you gave your game folder)

If `pygbag` isn't recognised as a command, you can run `python -m pygbag folder_name` as an alternative.

After running this command, navigate to [localhost:8000](https://localhost:8000). Pygbag will take a while to load. As of writing, this phase shows a blank cyan page. This may take a long time the first load, but will speed up on later reloads.

Once Pygbag has loaded, it will load your game. Once the loading bar completes, you should be able to click the screen to start.

If you were able to complete these step, congratulations! You have successfully set up Pygbag and tested that your game runs in the browser! We will continue with some next steps you may consider.

If you were not able to, scroll down to the [documentation](#detailed-documentation) to troubleshoot.

### Debugging
If you need to debug your game going forward, you may consider reading the page on [debugging](/wiki/pygbag-debug/) with Pygbag.

### Publishing 
To let others play your game online, you must publish your game on a publicly accessible website. We provide documentation for publishing [via itch.io](/wiki/publishing/itch.io/) and [via Github Pages](/wiki/publishing/github.io/).

### Templates
You can change the page layout (and much more) using templates. They consist of HTML markup and Python/JavaScript code to contain your packaged game, plus some CSS to style it. To make your template better fit your game, you may want change it from the default one. Add `--template [TEMPLATE NAME].tmpl` to Pygbag's arguments when running it from the command line to set the template it uses.

#### Using built-in templates
This is recommended if you don't want to edit HTML. Check [/static](https://github.com/pygame-web/pygbag/tree/main/static) in Pygbag's repository for a list of available templates. Put the filename after `--template` to make Pygbag use it. <!--Not sure where the templates are hosted exactly, made my best guess. Correct me if I'm wrong.-->

#### Downloading a template and customising it
[Here](https://github.com/pygame-web/pygbag/tree/main/static) you can find various templates available online. The simplest way to customise a template is to download one and edit them.

If you want to make Pygbag use a template on your computer, pass the full path of your template file instead of just the filename. Running Pygbag in this way will package your game with your desired template without erasing the cache.

With this approach, you can customize the template as you like, and test out changes before you publish your game. 

> Before editing templates, you should have a good knowledge of HTML. The code in templates is important to running the game properly, so edit them carefully. Remember to test that your game still packages correctly after switching/editing templates.

## Detailed Documentation

### Asset location
Assets are the images, fonts and sounds your game uses. If you aren't using Pygbag, you can place the assets in any folder (although it's good practice to put them in your project folder anyways). With Pygbag, you must place all your assets in your project folder, or they will not be packaged.

Your project folder, `my-game`, might look like this:
```
my-game
├── img
│   ├── pygc.bmp
│   ├── pygc.png
│   └── tiger.svg
├── main.py
└── sfx
    └── beep.ogg
```

Make sure you're not pulling assets from outside your folder, like this!
```
.
├── my-game/
│   ├── main.py
│   └── sfx/
│       └── beep.ogg
└── img/
    ├── pygc.bmp
    ├── pygc.png
    └── tiger.svg
```


### Adding Modules
- [List of available wheels](/wiki/pkg/)
- [requesting modules](https://github.com/pygame-web/pkg-porting-wasm/issues)

#### Complex Packages
When importing complex packages (for example, numpy or matplotlib), you must put their import statements at top of `main.py`. You should also add a metadata header as specified by [PEP 723](https://peps.python.org/pep-0723/), for example:
```
# /// script
# dependencies = [
#  "six",
#  "bs4",
#  "markdown-it-py",
#  "pygments",
#  "rich",
#  "mdurl",
#  "textual",
# ]
# ///
```
If using pygame-zero (mostly untested), put `#!pgzrun` near the top of main.py. (2nd line is perfect if the file already has a shebang)

### Useful .gitignore additions
```
*.wav
*.mp3
*.pyc
*.egg-info
*-pygbag.???
/build
/dist
```
### Using 3D/WebGL?
Add `--template noctx.tmpl` to pygbag command line if using 3D/WebGL.

### Using heightmaps?
You can use `--no_opt` to prevent png recompression.

### File formats and names
- You can add a square image file named `favicon.png` in your game's root folder to make Pygbag use it as the web package's favicon.
- Make sure all audio files are in OGG format, and all files are compressed. (that is, not in WAV/AIFF)
- Avoid raw formats like BMP for your image assets, they are too big for web use; use PNG/WEBP or JPG instead.

- Do not use filenames like `*-pygbag.*`  that pattern is reserved for pygbag internal use (optimizing pass).

Before packaging, adapt your code this way if you still want WAV/MP3 format on desktop:
```py
if sys.platform == "emscripten":
    snd = pygame.mixer.Sound("sound.ogg")
else:
    snd = pygame.mixer.Sound("sound.wav") # or .WAV, .mp3, .MP3, etc.
```

### Keep pixellated style?
If you want to keep pixelated look whatever the device screen size is use:
```py
import sys, platform
if sys.platform == "emscripten":
    platform.window.canvas.style.imageRendering = "pixelated"
```

### Avoid GUI, I/O, web operations
Avoid using CPython's standard library for web operations, GUI (like tkinter), or I/O as it is very synchronous/platform-specific and will probably stay that way. In terms of GUI alternatives, [pygame_gui](https://pypi.org/project/pygame_gui) works on top of [pygame-ce](https://pyga.me), [Panda3D](https://www.panda3d.org/) provides [directgui](https://docs.panda3d.org/1.10/python/programming/gui/directgui/index) and Harfang3D provides imgui. They are all cross-platform.

### Windows
- Use Python that was downloaded from python.org rather than the Windows Store. You can check installed version(s) with the `py --list` command.
- Use `/` instead of `\​` as a path separator (e.g. `img/my_image.png` instead of `img\my_image.png`). The path should still be valid on newer Windows versions.

### MacOS
- If you get a SSL error, use the file `Install Certificates.command` in `Applications/Python 3.XX`.

### Linux
- When using webusb ftdi serial emulation, use `sudo rmmod ftdi_sio` after plugging devices.

### Pypi
Pygbag's project description on pypi exists here: [https://pypi.org/project/pygbag/](https://pypi.org/project/pygbag/)

### Boilerplate code
There is very little because Python-WASM is just a web-friendly version of CPython REPL with [some added facilities](https://discuss.python.org/t/status-of-wasm-in-cpythons-main-branch/15542/12?u=pmp-p). Most desktop code will run (and continue to run) with only a few changes. 

## Conclusion
Congratulations for finishing this tutorial! Now you can go ahead and make all your Python games playable in the browser! Thank you for reading.

[Contribute to this page.](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag/README.md)
