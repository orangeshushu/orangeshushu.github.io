# Presentation folders

Public directory: https://jiacheng.website/slides/

```text
slides/
  index.html                 # Generated directory page
  build-index.py             # Rebuild after adding/removing folders
  README.md
  nourishday-itongue/
    index.html               # This presentation, including embedded images
    presentation.json        # Directory title, description and languages
    README.md
```

Each presentation lives entirely inside its own folder. Other presentations can use their own assets subdirectory. The directory page requires no JavaScript; a small optional script preserves old `#en/1` and `#zh/1` links to this first deck.

## Add a presentation

1. Create `slides/<short-name>/index.html` and place its assets in that folder.
2. Optionally add `presentation.json` with `title`, `description`, `description_zh`, `detail` and `languages` (for this deck's language/hash convention). Omit languages for an ordinary HTML presentation.
3. Run `python3 slides/build-index.py` from the website repository root, commit the intended files and push. GitHub Pages publishes the result.

## Remove a presentation

Delete only its folder, then run `python3 slides/build-index.py`. Commit the folder removal and rebuilt directory page, then push. This removes both the presentation and its directory entry; other presentation folders are untouched. Git retains the history for recovery. Deleting a folder through GitHub's web UI alone does not regenerate this static index: rebuild and commit the index too.

## Rename or update

Edit or rename only the relevant folder, update its metadata if necessary, rebuild the index, and publish. Old external links to a renamed/deleted presentation will no longer work unless a redirect is intentionally retained. The legacy hash redirect is emitted only while the designated presentation folder exists.

No public delete/upload controls or account permissions are added. Management takes place in this Git repository.
