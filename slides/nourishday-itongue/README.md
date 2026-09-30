# NourishDay & iTongue interactive presentation — 2026-09-29

The generated, self-contained ten-page presentation is `NourishDay_iTongue_Interactive_10_Pages.html`. English is the default; the top-right switch changes the current page to Simplified Chinese. The presentation keeps one UI language per page.

To rebuild, run `python3 .build/build.py` from any directory. To verify state, controls, language, asset embedding, product-theater flow and boundary labels, run `node .build/check.cjs`. `.build/speaker-notes.json` is private local speaker preparation and is not embedded in the HTML.

## NourishDay background evidence panel

Page 2 now pairs the real NourishDay website meal with three public, official CDC graphics: the plate method, a hand-based portion guide and a weekly meal-plan example. The cards make the need concrete as composition, quantity and longitudinal pattern, and the active card follows the selected glucose-aware, fitness or everyday-balance goal. Each graphic links to the CDC's [Diabetes Meal Planning](https://www.cdc.gov/diabetes/healthy-eating/diabetes-meal-planning.html) guidance. The measurement caveat links directly to the National Cancer Institute's [Types of Measurement Error](https://epi.grants.cancer.gov/dietary-assessment-primer/concepts/error/error-types.html) page. These are contextual education and research visuals; they do not validate NourishDay or represent customer counts.

The embedded source files and exact SHA256 hashes are:

- `cdc_plate`: `https://www.cdc.gov/diabetes/images/managing/Diabetes-Manage-Eat-Well-Plate-Graphic_600px.jpg` — `9f236bae5622eec1e5b04f869151d50dd3652bae7ee3cf4da5d4a043eea549a5`
- `cdc_portion`: `https://www.cdc.gov/diabetes/images/managing/portion-graphic.png` — `a6743c5b5334a1b66b558a6f289994d18cca9eca9b181895f89aa21bd85f2a90`
- `cdc_meal_plan`: `https://www.cdc.gov/diabetes/images/managing/meal.png` — `c18c476159d7c3c7d7e9f464caa53b54864676817d72bca8babe099f6c1a5c75`

## Interactive product theaters

Page 5 presents NourishDay as a five-step, clickable flow: real Scan entry, prepared meal-photo selection, image confirmation, animated analysis and the real App Store nutrition-review screen. The final scene preserves the complete product screen and adds a magnified nutrient panel for a large-format presentation. The demonstration is a narrated simulation and does not perform recognition or upload personal data.

Page 8 presents iTongue as a five-step, clickable flow: real home entry, synthetic photo selection, Confirm and Upload, animated analysis and segmentation, and the locally tested TOM_s result. The result keeps the complete phone interface visible while magnifying the segmentation overlay. The demonstration does not upload an image or run a model. Its tongue photo is a synthetic fixture; the TOM_s adapter remains a local prototype and is not deployed to production.

Both pages support direct step selection, click-to-continue, replay and automatic analysis-to-result transitions. The interaction uses spatial continuity, ordered page-control cues and restrained motion feedback inspired by Apple presentation patterns; it does not copy Apple code or product assets.

## Interactive four-examination page

Page 6 presents the four examinations in the traditional order of inspection, listening/smelling, inquiry and palpation. Selecting a method changes the large real-world photograph, the method summary, a three-step process and the final context link. Inspection connects directly to tongue inspection. The former `Comprehensive Exam.pptx` cartoon, its visible source line and the bottom explanatory caption have been removed from the presentation canvas. Image source and rights details remain available in `.build/four-examinations-provenance.json` and this README without taking space on the slide.

## Visual provenance

`meal_photo` is an exact embedded copy of the balanced chicken-bowl photograph used by the NourishDay website at `nourishday/assets/meal-balanced.webp` (source SHA256 `32454979cb877d539ac1020ad04a2c09ec1f21322ef737040f591a25083014c9`). Page 2 now uses this photograph in place of the earlier abstract CSS plate, and page 5 reuses the same meal for a continuous background-to-demo story. `nourish_result_en` and `nourish_result_zh` are compressed copies of the reviewed NourishDay App Store demonstration screenshots under `AppStoreAssets/ScreenshotsReview86Polished/`.

The four-examination photographs now show contemporary, real clinical or consultation settings from public healthcare websites. They replace the earlier child examination, stethoscope image, generic Western consultation and historical pulse photograph. No AI-generated image is used in this four-photo sequence. Source owners retain their rights; an open reuse license has not been verified. Exact original URLs and original/embedded SHA256 values are recorded in `.build/four-examinations-provenance.json` (published as `four-examinations-sources.json`).

- Inspection: [Kitasato University Hospital Kampo and Acupuncture Center](https://www.kitasato-u.ac.jp/toui-ken/center/kampo.html), an adult patient having his tongue inspected.
- Listening/smelling: [Thomson Medical](https://www.thomsonmedical.com/blog/how-tongue-and-pulse-reveal-your-health), a Chinese medicine physician in face-to-face consultation. This illustrates attentive dialogue, not proof of an odor or formal auditory assessment.
- Inquiry: [Seishindo's experienced Chinese medicine advisers](https://www.seishin-do.co.jp/adviser/), a welcoming consultation between a practitioner and a patient. The caption-free page does not assign an unverified physician credential.
- Palpation: [Tongji Aerospace City Hospital](https://www.tjhtcyy.cn/clients_1059.html), a physician palpating an adult patient's wrist on a pulse cushion.

`ppt_pipeline` is the historical research workflow figure from the user-provided `Comprehensive Exam.pptx`, slide 49. Authentic iTongue iOS interface captures come from `/Users/jx993/Documents/iTongue server/iTongue-iOS/iTongue/docs/verification/` (dashboard 2026-08-23; selected photo 2026-08-30; TOM_s segmentation 2026-08-23). The animated guidance frame is illustrative and is not a live camera feed. The nine labels are a research taxonomy; the page does not perform inference or imply clinical validation.

## Responsive and motion model

Desktop and landscape tablet browsers use one logical 1152×648 (16:9) canvas. JavaScript fits the complete canvas to the available visual viewport after accounting for navigation and controls, so typography, images, cards and spacing scale together. Resize, orientation, fullscreen and Safari visual-viewport changes recalculate the fit. At 900 CSS pixels and below, the deck switches to vertical flow so phones retain readable text and ordinary scrolling.

The implementation is dependency-free and borrows interaction patterns rather than source code from Motion, React Bits, Uiverse, Anime.js and Aceternity UI. Forward/back navigation has directional continuity; titles reveal by word or Chinese character; top-level content uses a short stagger; the active navigation item and footer rail show position; interactive cards use a pointer-local spotlight and one-shot active sweep; and one principal visual per page receives restrained pointer tilt. State changes use a compact transition instead of replaying the whole page. Main transitions use transform and opacity, preserve keyboard focus and pressed states, and switch off under `prefers-reduced-motion: reduce`. The theater step rail scrolls horizontally on narrow screens while its content reflows vertically without horizontal document overflow. At 480 CSS pixels and below, the top bar keeps the requested language switch at the upper right while Back/Next remain the primary page navigation.

## Validation and publication

`node .build/check.cjs` passes 181 assertions across nine pages and two languages, including the three exact CDC asset hashes, bilingual evidence copy, goal-linked evidence states, the exact NCI measurement-error source, the website-meal asset hash, all four real-photo examination states, the two five-step product theaters, embedded assets, fixed 16:9 fit, motion hooks, mobile reset and fullscreen scaling. `node --check .build/app.js` passes. In-app Chromium visually checked the revised page 2 in English on the fixed desktop canvas and in English and Chinese at 390×844. The evidence panel fills the former empty area, all text and graphics remain inside their cards, and the mobile document remains exactly 390 CSS pixels wide with no horizontal overflow. Earlier full-deck Chromium and Safari checks remain applicable to the unchanged pages. Firefox, Edge, physical mobile/tablet, venue projector and timed rehearsal remain untested.

Deployment target: `https://jiacheng.website/slides/nourishday-itongue/`. The website repository is `orangeshushu/orangeshushu.github.io`. The public page preserves the existing visitor tracker.

The contemporary four-photo revision passed the 159-assertion source checks and a fresh Chrome audit of every English desktop method at 1366×768 plus Chinese mobile palpation at 390×844. All five screenshots were visually reviewed; method switching, embedded image decoding, hidden captions, stage bounds, and horizontal overflow checks passed with no page errors.

## Food properties — new page 3

A standalone, approximately 90-second bilingual page sits between the NourishDay background and product demo. Five clickable real-food photographs introduce Cold / Cool / Neutral / Warm / Hot; selection updates the nature-and-flavour explanation and the five-flavour highlight. Four seasonal controls explain season, climate and preparation as context. The terminology follows the Hong Kong Department of Health educational reference. Nature is explicitly distinguished from serving temperature and calories; no therapeutic or universal seasonal diet advice is given. The owner's reference supplies the hot-chilli example; the official guidance groups chilli within warm/hot foods.

Photographs are reused from the reviewed App asset catalog, with source, author and licence linked in the slide's Photo credits disclosure. Full provenance is `.build/food-properties-provenance.json`; existing licensed derivatives are embedded unchanged. Source remains `app.js`, `style.css`, `shell.html`, `content.json` and `speaker-notes.json`. The previous eight-page HTML is retained as an earlier artifact; `NourishDay_iTongue_Interactive_10_Pages.html` is now the build and publication target. Navigation, keyboard shortcuts 1–9, page totals, cover project links and analysis-to-result timers are updated for the inserted page.

Validation: Node syntax/state checks pass 181 assertions across nine pages/two languages. In-app Chromium checked the five food selections and four season controls at 1366×768, and English/Chinese content at 390×844; all food images loaded and document width remained 390px. The existing NourishDay demo follows at page 5; iTongue starts at page 6.


## Real tongue photographs on the visual-information page

The current page 7 replaces the vector tongue illustration and floating numbered dots with four clickable photographic examples. The originals are the user-provided `Comprehensive Exam.pptx`, slide 51, media `image61.tiff`, `image65.tiff`, `image66.tiff` and `image69.tiff`, visually matched to Figure 5 of [Xie et al., Digital tongue image analyses for health assessment](https://doi.org/10.1515/mr-2021-0018). These retain the original decoded RGB pixels and dimensions in lossless PNG form; no crop, recoloring, enhancement or generated imagery is applied. The original TIFFs are larger than each corresponding panel in the NCBI web preview. Photo selection is independent of the body/coating/moisture/record explanation tabs; the examples are not presented as longitudinal images or new diagnoses. The paper link is in the header, with no caption beneath the image. Source hashes and bibliographic details are in `.build/tongue-photos-provenance.json`, published separately as `tongue-photos-sources.json`.

Validation: source syntax/build and the existing 181-assertion nine-page/two-language suite pass. `.build/audit-tongue-photos.cjs` verifies all four distinct photos decode and fit the desktop stage, all four explanation controls work, the former illustration is absent, Chinese mobile width is 390 CSS pixels without horizontal overflow, reduced-motion disables animation, and no page errors occur. Desktop and mobile screenshots were visually reviewed. Original photos are limited to approximately 200–260 pixels across; no invented detail was added. Physical-device and venue-projector review were not run.


## Seasonal food culture — page 4

New bilingual four-quadrant page after food properties: spring digestion/dampness, summer cooling/fluids, autumn moistening, winter warm preparation and nourishment. Twelve food-photo placements accompany four independently toggleable serving examples. Food combinations are editorial illustrations, not treatment advice; rice is an everyday base, and warm preparation does not reclassify tofu as warm in TCM. Seasonal concepts and foods were checked against the UCN seasonal guide and Hong Kong Department of Health food-preservation guidance, linked on the slide. No recommendation to increase salt is carried over from the supplied reference.

Seven additional licensed catalog photos are embedded unchanged; the three existing rice/watermelon/ginger assets are reused. Photo-credit disclosure and `.build/seasonal-food-provenance.json` preserve attribution and source links. Snow fungus is a species photograph, not a prepared dish. Local speaker notes allow 90–120 seconds. The old nine-page artifact remains a snapshot. Current sequence: cover, background, food properties, seasonal food, NourishDay demo, four examinations, tongue information, iTongue demo, classification, technology. Keyboard 0 opens page 10; keys 1–9 retain their page mapping.

Current validation: build, JavaScript syntax and 194 state assertions across ten pages/two languages pass. In-app Chromium at 1366×768 verified all four serving-example toggles, all 12 photo placements decoding, no card clipping, and Next opening NourishDay demo page 5. English and Chinese at 390×844 show no horizontal overflow or card clipping. Other browsers, physical devices and venue rehearsal were not run for this addition.


## Interactive nine-constitution introduction — page 9

Two selectable views replace the former text-led classification panel. The common framework shows nine clickable FOODROOT.TCM pictograms supplied by the owner, with a large selected figure and two short traditional characteristics. The paper view shows nine real photographs from Comprehensive Exam slide 51 / Xie et al. Figure 5 with short visible-feature descriptions. The common framework includes Special diathesis; the paper examples include Body fluid deficiency. These label sets are kept distinct, and the earlier merged fluid/blood deficiency label is corrected. Cold / Normal / Hot controls remain a separate explanatory framework; no model inference runs here. English remains the default, with the existing upper-right single-language switch.

The complete supplied pictogram image is embedded unchanged and displayed through clipped viewports, excluding baked English text so Chinese remains localized. Credit: FOODROOT.TCM. Tongue TIFFs are converted losslessly to PNG with decoded RGB equality verified, without enhancement or cropping. Off-slide provenance and source links are recorded in `.build/constitution-provenance.json` (published as `constitution-sources.json`); there are no captions beneath individual figures. The owner's third reference contains ten tongue appearance patterns and is not relabeled as nine constitutions. Traditional descriptions are paraphrased from Hong Kong Department of Health CMRO educational material.

Validation: build and 215 source assertions pass across ten pages and two languages. Chrome audited 36 desktop selection states, four phone language/view combinations at 390×844, three temperature controls, image decoding, card/image/text separation, stage bounds, horizontal overflow, reduced motion, and zero page errors. Desktop and phone screenshots were visually reviewed. Native Safari, physical-device and venue-projector checks were not run for this revision.
