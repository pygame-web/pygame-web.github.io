# Contributing

## To pygbag

Pull requests welcome at
[https://github.com/pygame-web/pygbag](https://github.com/pygame-web/pygbag).

## To these docs

These docs are built with sphinx. See the github page. They take inspiration
from the [Diátaxis](https://diataxis.fr) approach, as well as the documentation
sites for [Gatsby](https://www.gatsbyjs.com/docs/),
[pytest](https://docs.pytest.org), and [furo](https://pradyunsg.me/furo/).

### Style Guide

Markdown files are formatted with prettier (see the prettierrc) and python code
blocks are formatted with black.

All terminal commands should be expressed with tabs, even if they are the same
command on any operating system. Highlight the terminal output with `text`, lest
stray numbers or symbols be colored. An example is shown below.

`````
````{tab} Unix/Mac
```text
$ command
```
````

````{tab} Windows
```text
> command
```
````
`````
