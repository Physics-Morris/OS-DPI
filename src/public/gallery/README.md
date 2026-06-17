# OS-DPI Example Gallery

This folder powers the in-app **Example Gallery**. Each board is a folder:

```
gallery/
  index.json        generated manifest (do not edit by hand)
  <slug>/
    board.osdpi     the design, exported from OS-DPI
    meta.json       { title, description, tags, author }
```

`index.json` is rebuilt from the folders by `npm run gallery:index` (and
automatically on `npm run build`).

## Contribute from inside OS-DPI

1. Build your board.
2. **File → Share to Gallery**, fill in the details, and click the button.
3. The app downloads `board.osdpi` and `meta.json`, then opens a GitHub page
   for a new folder. Drag the two files in and propose the change to open a
   pull request.
