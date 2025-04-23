# Simple Game Tutorial

```{seealso}
[](../reference/pygbag-requirements.md)
```

In this tutorial, you will create a simple game, with a focus on keeping it
compatible with pygbag.

Because this website is dedicated to pygbag, we will gloss over details about
pygame development. To learn more about pygame itself, refer to a dedicated
tutorial such as from the pygame-ce [docs](https://pyga.me/docs/).

## Part 1: A Moving Player

Here's a simple pygame project that creates a player that can be moved around
the screen with the WASD keys. Save it somewhere on your computer, preferably in
its own folder.

```py
# main.py
import pygame

pygame.init()
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()
running = True

player_pos = pygame.Vector2(screen.get_width() / 2, screen.get_height() / 2)

while running:
    # pygame.QUIT event means the user clicked X to close your window
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill("white")

    pygame.draw.circle(screen, "black", player_pos, 40)

    keys = pygame.key.get_pressed()
    if keys[pygame.K_w]:
        player_pos.y -= 5
    if keys[pygame.K_s]:
        player_pos.y += 5
    if keys[pygame.K_a]:
        player_pos.x -= 5
    if keys[pygame.K_d]:
        player_pos.x += 5

    pygame.display.flip()

    clock.tick(60)

pygame.quit()
```

```{note}
To use pygbag, you will need to do a little operating of the terminal (known
as cmd or Powershell on Windows). If you are unfamiliar with basic terminal
operations such as changing directories or using executables, you may consider
finding a dedicated tutorial.
```

Open your terminal and change your working directory to point to `main.py`.

`````{hint}
````{tab} Unix/Mac
If your `main.py` is located at `~/Desktop/my-game/main.py`, use
```text
$ cd ~/Desktop/my-game
```
````

````{tab} Windows
If your `main.py` is located at `C:\Users\yourname\Desktop\my-game\main.py`, use
```text
> cd C:\Users\yourname\Desktop\my-game
```
````
`````

You'll notice that if we try to run our program right now, it might already
work!

````{tab} Unix/Mac
```text
$ pygbag main.py
...
Serving HTTP on 127.0.0.1 port 8000 (http://localhost:8000/) ...
```
````

````{tab} Windows
```batch
> pygbag main.py
...
Serving HTTP on 127.0.0.1 port 8000 (http://localhost:8000/) ...
```
````

```{hint}
To try out the web version visit the given link
([http://localhost:8000/](http://localhost:8000/), above). To close out of
pygbag, type Ctrl-c in the terminal.
```

To guarantee it does, and will not break on future pygbag updates, we will
follow the pygbag [requirements](../reference/pygbag-requirements.md).

Our game file is already named `main.py`, and is at the root of our game folder.
Let's also make sure our game is compatible with the web by making it
async-aware.

```py
# main.py
import pygame
import asyncio  # IMPORT ASYNCIO


async def main():  # CREATE AN ASYNC MAIN FUNCTION TO WRAP YOUR CODE
    pygame.init()
    screen = pygame.display.set_mode((1280, 720))
    clock = pygame.time.Clock()
    running = True

    player_pos = pygame.Vector2(screen.get_width() / 2, screen.get_height() / 2)

    while running:
        # pygame.QUIT event means the user clicked X to close your window
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        screen.fill("white")

        pygame.draw.circle(screen, "black", player_pos, 40)

        keys = pygame.key.get_pressed()
        if keys[pygame.K_w]:
            player_pos.y -= 5
        if keys[pygame.K_s]:
            player_pos.y += 5
        if keys[pygame.K_a]:
            player_pos.x -= 5
        if keys[pygame.K_d]:
            player_pos.x += 5

        pygame.display.flip()

        clock.tick(60)
        await asyncio.sleep(0)  # GIVE CONTROL BACK TO THE BROWSER

    pygame.quit()


asyncio.run(main())  # RUN THE NEW MAIN FUNCTION
```

This `main.py` has been modified to be requirements-compliant. Running pygbag
now is guaranteed to work.

````{tab} Unix/Mac
```text
$ pygbag main.py
...
Serving HTTP on 127.0.0.1 port 8000 (http://localhost:8000/) ...
```
````

````{tab} Windows
```text
> pygbag main.py
...
Serving HTTP on 127.0.0.1 port 8000 (http://localhost:8000/) ...
```
````

Doing so creates a `build` folder that holds the files generated for web.

````{tab} Unix/Mac
```text
$ ls
build main.py
```
````

````{tab} Windows
```text
> dir
...
build
main.py
...
```
````

## Part 2: Coins and Audio

Let's add the ability for our player character to grab a coin. To represent
this, every time we press the space bar, we should play a coin audio.

Download this [coin audio](pickup_coin.ogg) (generated from https://sfxr.me/)
and put it in your game directory:

````{tab} Unix/Mac
```text
$ ls
build main.py pickup_coin.ogg
```
````

````{tab} Windows
```text
> dir
...
build
main.py
pickup_coin.ogg
...
```
````

Now we can add the functionality to our game:

```py
# main.py
import pygame
import asyncio


async def main():
    pygame.init()
    screen = pygame.display.set_mode((1280, 720))
    clock = pygame.time.Clock()
    running = True

    coin_sound = pygame.mixer.Sound("pickup_coin.ogg")  # LOAD THE SOUND

    player_pos = pygame.Vector2(screen.get_width() / 2, screen.get_height() / 2)

    while running:
        # pygame.QUIT event means the user clicked X to close your window
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        screen.fill("white")

        pygame.draw.circle(screen, "black", player_pos, 40)

        keys = pygame.key.get_pressed()
        if keys[pygame.K_w]:
            player_pos.y -= 5
        if keys[pygame.K_s]:
            player_pos.y += 5
        if keys[pygame.K_a]:
            player_pos.x -= 5
        if keys[pygame.K_d]:
            player_pos.x += 5
        if keys[pygame.K_SPACE]:  # PLAY IT WHEN SPACE KEY PRESSED
            pygame.mixer.Sound.play(coin_sound)

        pygame.display.flip()

        clock.tick(60)
        await asyncio.sleep(0)

    pygame.quit()


asyncio.run(main())
```

Notice how the sound format is an `ogg`. Other formats like `mp3` or `wav` will
not work on web.

## Conclusion

Making a pygame project async-aware and using only `ogg` formats for audio will
suffice to convert most simple projects to work with pygbag. Congrats on
finishing this tutorial!
