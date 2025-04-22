# pygbag Requirements

## All Systems

### Basics

```{seealso}
[](../tutorials/simple-game-tutorial.md)
```

- Name your main game script `main.py` and put it in the root folder of your
  game.
- Make your main loop async-aware and use `asyncio.sleep(0)` every iteration to
  give control back to the main thread.
- <ins>Make sure all audio files are in OGG (best compression format targeting
  16bits 24Khz Mono). (that is especially **not in WAV/AIFF/M4A/MP3
  format**)</ins>
- Avoid raw formats like BMP for your image assets, they are too big for web
  use; use PNG/WEBP or JPG instead.
- Filenames are case sensitive (`Folder/MyFile.png` and `folder/myfile.png` are
  two different files).
- Do not use filenames like `*-pygbag.*`. That pattern is reserved for pygbag
  internal use (optimizing pass).

### 3D/WebGL

- Use `--template noctx.tmpl` with pygbag command line if using 3D/WebGL.

### Packages

- Put the import statements of complex packages in order (but numpy first) at
  the top of `main.py`.
- Avoid using CPython's standard library for web operations, GUI (like tkinter),
  or I/O as it is very synchronous/platform-specific and will probably stay that
  way. In terms of GUI alternatives,
  [pygame_gui](https://pypi.org/project/pygame_gui) works on top of
  [pygame-ce](https://pyga.me), [Panda3D](https://www.panda3d.org/) provides
  [directgui](https://docs.panda3d.org/1.10/python/programming/gui/directgui/index)
  and Harfang3D provides imgui. They are all cross-platform.

## Windows

- Use Python that was downloaded from python.org rather than the Windows Store.
  You can check installed version(s) with the `py --list` command.
- Use `/` instead of `\​` as a path separator (e.g. `img/my_image.png` instead
  of `img\my_image.png`). The path should still be valid on newer Windows
  versions.

## MacOS

- If you get a SSL error, use the file `Install Certificates.command` in
  `Applications/Python 3.XX`.

## Linux

- When using webusb ftdi serial emulation, use `sudo rmmod ftdi_sio` after
  plugging devices.
