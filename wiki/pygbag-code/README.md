## Python code specifics, when in the browser with pygbag runtime

### File uploading
#### sample : image file viewer
```py
import platform

def on_upload_files(ev):
    print("on_upload_files", ev)
    if ev.mimetype.startswith('image/'):
        # we can display that
        shell.display(ev.text)

platform.EventTarget.addEventListener(None, "upload", on_upload_files )
platform.window.dlg_multifile.hidden = false
```

___

### File downloading

#### sample : async downlaod of (r) utf-8 textfiles or (rb) binary files
```py
import platform
from pathlib import Path
cdn = Path("https://cdn.jsdelivr.net/pyodide/dev/full")

async def main():
    async with platform.xopen( cdn / "repodata.json", "r") ) as textfile:
        print( len( textfile.read() ) )
asyncio.run(main())
```


#### sample : DEPRECATED synchronous download of non binary files
```py
from pathlib import Path
cdn = Path("https://cdn.jsdelivr.net/pyodide/dev/full")

import urllib.request
outfile, _ = urllib.request.urlretrieve(cdn / "repodata.json", outfile)

# or just: 
# outfile = "/tmp/pip.json"
# shell.wget(f"-O{outfile}", cdn / "repodata.json")

import json
with open(outfile) as data:
    repo = json.loads( data.read() )

print( json.dumps(repo["packages"], sort_keys=True, indent=4) )
```




[contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/pygbag-code/README.md)

