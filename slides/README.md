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

Each presentation lives entirely inside its own folder. Other presentations can use their own assets subdirectory. The directory renders English by default, including without JavaScript. A top-right English / 中文 control switches all directory copy and presentation links together; only one language is visible at a time. `#en` and `#zh` preserve the selected directory language on refresh and browser back/forward. No browser-language auto-detection or saved preference overrides the English default. The existing `#en/1` and `#zh/1` legacy links still redirect to the first deck. Language switching requires JavaScript.

## Add a presentation

1. Create `slides/<short-name>/index.html` and place its assets in that folder.
2. Optionally add `presentation.json` with `title`, `title_zh`, `description`, `description_zh`, `detail`, `detail_zh` and `languages` (for this deck's language/hash convention). Keep each English field English-only and place translated text in its `_zh` counterpart. Missing translations fall back to the English field. Omit languages for an ordinary HTML presentation.
3. Run `python3 slides/build-index.py` from the website repository root, commit the intended files and push. GitHub Pages publishes the result.

## Remove a presentation

Delete only its folder, then run `python3 slides/build-index.py`. Commit the folder removal and rebuilt directory page, then push. This removes both the presentation and its directory entry; other presentation folders are untouched. Git retains the history for recovery. Deleting a folder through GitHub's web UI alone does not regenerate this static index: rebuild and commit the index too.

## Rename or update

Edit or rename only the relevant folder, update its metadata if necessary, rebuild the index, and publish. Old external links to a renamed/deleted presentation will no longer work unless a redirect is intentionally retained. The legacy hash redirect is emitted only while the designated presentation folder exists.

No public delete/upload controls or account permissions are added. Management takes place in this Git repository.
