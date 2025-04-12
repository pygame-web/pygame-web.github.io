
[original documentation](https://salt-die.github.io/nurses_2/index.html)

typical import
```
import wcwidth
import termios
import tty
import numpy
import nurses_2
```


activating raw terminal must be made manually

```
try:
    import termios
    termios.set_raw_mode()
except:
    pass
```

after that behaviour should follow native version.



major differences :
  - resizing window event will not happen



changes made https://github.com/pmp-p/nurses_2-wasm/pull/1/files


accessing the async repl  while running nurses app:
 - add ?-i ( or #debug for older versions) to url to force interactive mode.




[edit this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pkg/nurses_2/README.md)
