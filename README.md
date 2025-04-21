# pygame-web.github.io
This is the CDN root used by [Pygbag](https://pypi.org/project/pygbag/) and its documentation.

The documentation is built with [sphinx-doc](https://www.sphinx-doc.org) and the [furo](https://pradyunsg.me/furo/) theme.
We also recommend using `sphinx-autobuild`.

To build the docs, install the dependencies (which include `sphinx-autobuild`):
```
pip install -r requirements.txt
```
and build the documentation:
```
sphinx-autobuild source build
```
You will be able to view the site locally at [http://127.0.0.1:8000](http://127.0.0.1:8000).