## CPython Wasm specifics, when in the browser with emscripten runtime

### detect browser platform

```py
if sys.platform == "emscripten":
    ...
```

### detect Web Assembly CPU

```py
if 'wasm' in __import__('platform').machine():
    ...
```

### main loop (async)

```py
import asyncio
import pygame


# init pygame here

def menu(events):
    ...
    # draw
    # check events
    # change state
    ...


def play(events):
    ...
    # draw
    # check events
    # change state
    ...

game_state = menu

async def main():
    global game_state
    
    # or init pygame here 

    while game_state:
        game_state(pygame.event.get())
        pygame.display.update()
        await asyncio.sleep(0)
        
    # Closing the game. not strictly required, neither on desktop
    pygame.quit()
    sys.exit()
        
if __name__ == "__main__":
    asyncio.run(main())
```

everything else if probably pygbag specific so look here instead
[pygbag with example snippets](https://github.com/pygame-web/pygame-web.github.io/blob/main/wiki/pygbag-code/README.md#pygbag-code-specifics-samples-)


[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/python-wasm/README.md)
