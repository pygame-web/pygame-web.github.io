## CPython Wasm specifics, when in the browser with emscripten runtime

### detect browser platform

```py
if sys.platform == "emscripten":
```

### detect Web Assembly CPU

```py
if 'wasm' in __import__('platform').machine():
```

### main loop (async)

```py
import asyncio
import pygame


# init pygame here

def menu():
    #draw
    pass


def play():
    #draw
    pass

game_state = menu

async def main():
    global game_state
    
    # or init pygame here 

    while game_state:
        game_state()
        pygame.display.update()
        await asyncio.sleep(0)
        
    # Closing the game. not strictly required neither on desktop
    pygame.quit()
    sys.exit()
        
if __name__ == "__main__":
    asyncio.run(main())
```


### Handling persistent data across sessions

backup :
`window.localStorage.setItem("mygame", str(myvalue) )`

restore :
`myvalue = window.localStorage.getItem("mygame")`

### change page background color ( around pygame screen )
```py
if __import__("sys").platform == "emscripten":
    __import__('platform').document.body.style.background = "#000000"
```    
### mobile events handling 

TODO


### i18n: keyboard layout independant keycodes

TODO

### upload a local file (async)

TODO

### downloading files (async)

TODO

### client socket usage ( async )

TODO






[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/python-wasm/README.md)
