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


### Handling persistent data across sessions
```py
if __import__("sys").platform == "emscripten":
    import platform.window as window
```
backup :
`window.localStorage.setItem("mygame", str(myvalue) )`

restore :
`myvalue = window.localStorage.getItem("mygame")`

### change page background color ( around pygame screen )
```py
import sys
import platform

# document may not exist on non-emscripten platforms
if sys.platform == "emscripten":    
    platform.document.body.style.background = "#404040"
```    
### mobile events handling 

TODO, drag/drop events, gestures.

### getting camera image [try it](http://pygame-web.github.io/showroom/pypad_git.html?-i#src/vidcap.py)

TODO, pygame interface is not finished.

### i18n: keyboard layout independant keycodes

TODO

### upload a local file (async)

TODO

### downloading files (async)

TODO

### editing local files 

TODO, https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle

### client socket usage ( async )

TODO






[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/python-wasm/README.md)
