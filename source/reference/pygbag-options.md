# pygbag Options

- There's number of command line options: read Pygbag's
  [PyPI](https://pypi.org/project/pygbag/) project description for a more
  detailed overview.

- You can add a square image file named `favicon.png` in your game's root folder
  to make Pygbag use it as the web package's favicon.

- Before packaging, adapt your code this way if you still want WAV/MP3 format on
  desktop:

  ```py
  if sys.platform == "emscripten":
      snd = pygame.mixer.Sound("sound.ogg")
  else:
      snd = pygame.mixer.Sound("sound.wav") # or .WAV, .mp3, .MP3, etc.
  ```

- If you have heightmaps in your assets use `--no_opt` to prevent png
  recompression.

- if you want to keep pixelated look whatever the device screen size is use:

  ```py
  import sys, platform
  if sys.platform == "emscripten":
      platform.window.canvas.style.imageRendering = "pixelated"
  ```
