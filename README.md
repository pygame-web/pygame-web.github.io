# pygame-web.github.io

![pygbag logo](assets/pygbag_logo.png?raw=true "Pygbag Logo")

This is the CDN root used by [Pygbag](https://pypi.org/project/pygbag/).

## building the website
To build this mdBook website, [install mdBook](https://rust-lang.github.io/mdBook/guide/installation.html)
and run 
```
mdbook serve --open
```
where the current directory contains `book.toml`.

To use the [pagetoc](https://github.com/slowsage/mdbook-pagetoc) and
[admonishment](https://github.com/tommilligan/mdbook-admonish) preprocessors, 
you need to install some Rust tools:
```
cargo install mdbook-pagetoc
cargo install mdbook-admonish
```
Without these tools, the book may not compile. They only provide helpful but 
nonessential rendering, so you comment out their respective section in the
`book.toml`.