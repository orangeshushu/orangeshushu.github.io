# NourishDay & iTongue interactive presentation

Published at https://jiacheng.website/slides/nourishday-itongue/ (English by default); Chinese: https://jiacheng.website/slides/nourishday-itongue/#zh/1. The former `/roadshow/` URLs redirect here.

The self-contained presentation has eight pages: cover, NourishDay background and demo, then five iTongue pages. Pages 3 and 6 are large-format, five-step product theaters. NourishDay moves through the real Scan entry, a prepared meal photo, confirmation, animated analysis and the real nutrition-review screen. iTongue moves through its real home entry, a synthetic tongue photo, Confirm and Upload, animated analysis and segmentation, and the locally tested TOM_s result. Each step is directly clickable, the main visual advances the sequence, Play all runs it continuously, and the analysis state moves automatically to the result.

The result scenes keep the complete App interface visible while magnifying the information most useful to an audience: nutrient review for NourishDay and segmentation for iTongue. The NourishDay flow is a narrated simulation and does not upload the prepared photo. The iTongue fixture is synthetic; the page does not upload an image or run a classifier. TOM_s remains a local prototype that is not deployed to production, and the result is labeled as a wellness reference rather than a diagnosis.

The iTongue section also explains the four traditional examination methods, visible tongue information, cold/normal/hot and nine-constitution research labels, and technical work. Figures from `Comprehensive Exam.pptx` are attributed in the presentation. The page does not assert clinical validity.

Public controls: page navigation, English/中文 switch in the upper right, fullscreen, previous/next, and direct `#en/N` or `#zh/N` links. Keyboard: Left/Right or Space navigate; 1–8 jump to pages; Home returns to cover; L changes language; F requests fullscreen. Reduced-motion and narrow-screen layouts are included.

Desktop and landscape tablet browsers use one 1152×648 logical canvas. The page automatically scales the complete 16:9 canvas to the available visual viewport on load, resize, orientation change and fullscreen. At 900 CSS pixels and below, it changes to a vertical scrolling layout for phones. The final product theaters were checked in Chromium and Safari; responsive mobile checks used 390×844. Firefox, Edge, physical devices and the venue projector remain untested.

The HTML embeds images and code, retains the site-owned visitor tracker and uses no third-party runtime dependency. Source package and private speaker notes are in `TCM_Calendar/output/presentations/itongue-visual-deck-2026-09-29/`. Roll back by reverting the scoped website commit.
