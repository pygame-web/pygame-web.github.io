# CPython WASM specifics

These code snippets are useful when running your game in a browser with Emscripten.

## Check if game is running in the browser

```py
if sys.platform == "emscripten":
    pass
```

## Detect WebAssembly CPU

```py
if 'wasm' in __import__('platform').machine():
    pass
```

## Main loop example (must be asynchronous) 

```py
import asyncio
import pygame

pygame.init()


def menu(events):
    # draw
    # check events
    # change state
    pass


def play(events):
    # draw
    # check events
    # change state
    pass

game_state = menu

async def main():
    global game_state
    
    # You can initialise pygame here as well

    while game_state:
        game_state(pygame.event.get())
        pygame.display.update()
        await asyncio.sleep(0)
        
    # Closing the game (not strictly required)
    pygame.quit()
    sys.exit()
        
if __name__ == "__main__":
    asyncio.run(main())
```

Everything else is probably specific to Pygbag. You can find more information/code [here](/wiki/pygbag-code/#pygbag-code-specificssamples).


[Contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/python-wasm/README.md)
