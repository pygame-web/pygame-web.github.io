# pygame-web.github.io

This is the CDN root used by [Pygbag](https://pypi.org/project/pygbag/) and its
documentation.

The documentation is built with [sphinx-doc](https://www.sphinx-doc.org) and the
[furo](https://pradyunsg.me/furo/) theme. We also recommend using
`sphinx-autobuild`.

To build the docs, install the dependencies:

```
pip install -r requirements.txt
```

To build the documentation with `sphinx-autobuild`, simply run:

```
pip install sphinx-autobuild  # only needed for first time using autobuild
sphinx-autobuild source build
```

This will watch your files for changes and update your build on save. Or,
manually,

```
sphinx-build source build
cd build
python -m http.server
```

You will be able to view the site locally at
[http://127.0.0.1:8000](http://127.0.0.1:8000).
