# Quick Start

```{seealso}
[](../reference/pygbag-requirements.md)
```

This how-to guide explains how to convert different types of existing pygame
projects to be compatible with pygbag. It also explains how to run your
converted game locally in your browser.

## Convert for pygbag

pygbag is not usually affected by code split into multiple files with defined
functions, classes, and libraries throughout. So, you should first follow all
[](../reference/pygbag-requirements.md). Then, if your code already works
locally, simply follow the instructions that fit your `main.py` file.

### Simplest

Everything is flat in the same file.

```py
# main.py
import pygame

class Foo:
    pass

def bar():
    pass

# <remaining code>
```

change to

```py
# main.py
import pygame
import asyncio

class Foo:
    pass

def bar():
    pass

async def main():
    # <remaining code>

asyncio.run(main())
```

### Existing Main Function

```py
# main.py
import pygame

class Foo:
    pass

def bar():
    pass

def main():
    # <remaining code>

if __name__ == "__main__":
    main()
```

change to

```py
# main.py
import pygame
import asyncio

class Foo:
    pass

def bar():
    pass

async def main():
    # <remaining code>

if __name__ == "__main__":
    asyncio.run(main())
```

## Run in browser

Run the command

````{tab} Unix/Mac
```text
$ pygbag path/to/main.py
```
````

````{tab} Windows
```text
> pygbag path/to/main.py
```
````

This will build the web game to `path/to/build` and let you play it at the link
[http://127.0.0.1:8000](http://127.0.0.1:8000)
