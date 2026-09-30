# Current presentation: 25 bilingual pages

Published at `/slides/nourishday-itongue/`. Pages 19–24 add iTongue market context, competitor comparison, proposed business model, interactive CNY revenue scenarios, contribution sensitivity and pilot milestones. The lab team closes page 25. Pages 1–18 retain their routes. Left-edge directory, language switch, keyboard navigation and fullscreen controls remain available. Latest authoring target: `NourishDay_iTongue_Interactive_25_Pages.html`; rebuild via `.build/build.py`. Private narration timing totals 1,200 seconds.

Market and competitor claims were checked against official sources on 2026-09-30. Source PPT asset provenance and all hypothetical financial inputs are in [commercial-sources.json](commercial-sources.json). These pages do not assert paid customers, observed costs, current ARR, clinical superiority or signed partnerships. The actual English app screenshot is from the supplied briefing and is labeled as an August 2026 development screen.

Validation: 1,240 VM assertions; all six added pages in EN/ZH at 1600×900 and 390×844, with no observed overflow or broken images. Price/site/cost and competitor/pilot controls verified in browser; presentation-mode fallback verified in IAB. The API did not report native fullscreen in that embedded browser. Historical notes below describe earlier deck iterations.

---

# NourishDay & iTongue interactive presentation — 2026-09-29

The generated, self-contained twelve-page presentation is `NourishDay_iTongue_Interactive_12_Pages.html`. English is the default; the top-right switch changes the current page to Simplified Chinese. The presentation keeps one UI language per page.

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

Photographs are reused from the reviewed App asset catalog, with source, author and licence linked in the slide's Photo credits disclosure. Full provenance is `.build/food-properties-provenance.json`; existing licensed derivatives are embedded unchanged. Source remains `app.js`, `style.css`, `shell.html`, `content.json` and `speaker-notes.json`. The previous eight-page HTML is retained as an earlier artifact; `NourishDay_iTongue_Interactive_12_Pages.html` is now the build and publication target. Navigation, keyboard shortcuts 1–9, page totals, cover project links and analysis-to-result timers are updated for the inserted page.

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


## Tongue-region organ interaction — page 7 (supersedes the photo gallery)

At the owner's request, the visual-information page now uses their exact 1704×1154 annotated tongue photograph instead of the four-photo picker. Click the root, center, either lateral edge, or tip to highlight the corresponding region and schematic organ group: kidneys; spleen/stomach; liver/gallbladder; heart/lungs. Four matching buttons provide large touch and keyboard targets; SVG regions also support Enter and Space. Original coating/cracks/tooth-mark annotations remain, with localized overlay badges for single-language English or Chinese display. The source image pixels are untouched, and the nine-constitution page retains its real tongue photos. Header source link and `tongue-regions-sources.json` retain provenance without an image caption. One short note identifies these as traditional correspondences, not organ-disease diagnosis.

Source: `.build/source-assets/tongue-regions/user-region-map.png`, embedded as `tongue_region_map`; `.build/tongue-regions-provenance.json`. The body and organ graphics are schematic SVG UI illustrations, not anatomical images or inference. Updated app/styles, speaker notes, state checks and `.build/audit-tongue-regions.cjs`. The previous `.build/audit-tongue-photos.cjs` applies to the superseded gallery snapshot, not the current page.

Validation: build/syntax and 218 source assertions pass for ten pages/two languages. Chrome passes eight desktop region/language states, five direct photo-region clicks (including both sides), Enter/Space activations, eight phone states at 390×844, stage bounds/no horizontal overflow, reduced motion and zero page errors. Desktop English/Chinese and phone screenshots reviewed. Physical devices, native Safari and projector rehearsal not run for this revision.


## Ingredient-to-dish theater — current page 5

The current deck has 11 pages. Added four selectable dishes: plain rice congee, braised winter melon, snow-fungus/lotus-seed/jujube soup, and tomato/tofu/egg-drop soup. Ingredient buttons explain each component; direct stage controls and Play/Pause/Replay present Ingredients → Cook → Serve. Ingredient cards move toward an illustrated pot, steam marks cooking, and the finished dish reveals. Manual controls remain available and reduced-motion CSS removes the transformations. Hidden scene controls are inert and excluded from accessibility reading. Navigation cancels the cooking interval. Four-season page ingredient photos and new dish buttons route to the relevant dish, with a return control.

Three dish images are source photographs; the autumn dessert is an existing, explicitly labeled AI-generated illustration. Original files are embedded byte-for-byte and archived in `.build/source-assets/seasonal-dishes`. Full recipe, image, hash and licence provenance is `.build/seasonal-dishes-provenance.json`; on-slide credits remain accessible. Water, tomato and sauce are original schematic SVG icons. Cooking text is a brief adaptation from archived bilingual recipe material, without claiming kitchen testing, clinical efficacy, exact nutrition or current native-App implementation. Congee is an everyday base rather than an exclusively spring food.

Current order: cover; NourishDay background; food properties; seasonal food; dishes; NourishDay demo; four examinations; tongue regions/information; iTongue demo; classification; technology. Digits 1–9, key 0 for page 10, and End for the final page. All preceding image assets and concurrent tongue-region work were preserved.

Validation for this addition: Python build, Node syntax and 250 state assertions pass. In-app Chromium verified 24 dish/stage/language combinations at 1366×768, decoded images, no card clipping or horizontal overflow; all four seasonal meal states fit after action buttons were placed side by side. Ingredient detail, seasonal-to-dish routing and automatic completion to Serve were exercised. English and Chinese 390×844 layouts show no horizontal overflow. Audit snapshot: `.build/kitchen-browser-audit.json`. Safari/Firefox/Edge, physical devices and projector rehearsal were not run for this addition.


## Food foundations — current page 3

Added a separate bilingual introduction before the detailed food-properties slide. Interactive Yin-leaning / Neutral / Yang-leaning controls and a five-category strip link cold/cool, neutral and warm/hot to the traditional yin/yang framework. An original SVG taiji changes orientation subtly, the panel changes color, and real-food examples update. Neutral uses rice only; no neutral tofu classification is introduced. This is a qualitative traditional taxonomy, not a temperature, calorie or measured efficacy scale. Keyboard focus is restored to the selected group/category.

A short comparison connects TCM dietary tradition with modern Food Is Medicine without treating their frameworks or evidence bases as equivalent. Hong Kong Department of Health supports the traditional concepts and examples; HHS/ODPHP supports the modern healthcare/community and nutritious-food-access description, with AHA supporting tailored-meal/produce-prescription examples. Clickable references are on the slide; full source scope is `.build/food-foundations-sources.json`. No new raster assets were added. Reused photo credits remain on the adjacent food-properties slide. Speaker notes allow 60–90 seconds.

Current total: 12 pages. Foundations 3, food properties 4, seasons 5, dishes 6, NourishDay demo 7, four examinations 8, tongue regions 9, iTongue demo 10, classification 11, technology 12. Numeric keys 1–9, 0 for 10 and End for final page; arrows traverse all pages. Foundation CTA enters food properties; kitchen return and existing links follow the insertion.

Validation: build/syntax and 275 assertions across 12 pages/two languages pass. In-app Chromium verified all six language/group combinations and a five-category selection: all photos decoded, no panel clipping/horizontal overflow. English and Chinese mobile widths remain 390px. New browser-specific Safari/Firefox/Edge, physical devices and projector rehearsal were not run.


## NourishDay real-screen walkthrough — 2026-09-29

Current deliverable: `NourishDay_iTongue_Interactive_17_Pages.html` plus the adjacent `assets/` folder. Keep both together for offline use. Page 7–12 replaces the former simulated NourishDay theater with six chapters: Capture (Scan, upload, recognition), Review, Calendar/trends, Today, Library (food reference, recipe ingredients, tea), and Personal (daily targets and Me). All 13 images are actual App captures; five come byte-for-byte from the supplied Funding Briefing PPTX. New external images load only when selected; original embedded assets remain unchanged.

The full screenshot, numbered feature marks, magnified original region and bilingual right-hand explanation stay synchronized. Screen selectors, chapter links, Next feature, original-image enlargement, Escape and focus restoration work without auto-advancing through fake analysis. English screenshots are explicitly retained as English UI in both language modes; the recognition fixture is Chinese. Screens come from separate sessions and versions, not one continuous transaction. Upload/recognition captures are test fixtures, and their elapsed times are not performance evidence. Me is explicitly an earlier archived layout.

No continuous App screen recording was found in the reference PPT, presentation folder or project media inventory. No video was fabricated. Dedicated photo-picker, manual-entry, ingredient-editor, reminders, membership, widgets and Watch captures remain to be supplied; their full screen coverage is not claimed. Screenshot annotations describe visible controls, not browser execution of the App. Asset hashes and exact sources: `.build/nourishday-walkthrough-provenance.json`.

Pacing for a 20-minute combined talk: cover 30 seconds; NourishDay context/concepts pages 2–6 about 5 minutes; real App chapters pages 7–12 about 7 minutes; iTongue pages 13–17 about 6 minutes; discussion transition 90 seconds. Detailed screen tabs are optional during the live talk.

Validation: 519 state assertions across 17 slides/two languages; 74 desktop screenshot-region states passed in in-app Chromium. All 12 mobile chapter/language layouts fit 390 px without horizontal overflow. Original-image modal, Escape/focus restoration, 1920×1080 presentation ratio, and relocated iTongue cover navigation verified. Safari/Firefox/Edge and native-device tests not run for this website-only change.

## iTongue native screenshot walkthrough — 2026-09-29

Page 15 now presents six steps: Home, Choose, Frame, Review, Result and History. Twelve fresh bilingual 1320×2868 captures come from actual native iTongue views. Numbered areas on the full screen and right-hand feature tabs synchronize a highlight, a magnified crop of the same screenshot, one action sentence and one purpose sentence. Review includes the actual photo preview, tips and enabled Confirm and Upload control. Manual selection pauses the optional 4.5-second tour; keyboard focus and reduced motion are supported.

Camera is explicitly a native guide rehearsal over a static, real published tongue photo. The result screen uses preset Normal / Balanced constitution values and the actual segmentation-unavailable UI; it does not demonstrate live inference. History uses sample records. Capture used a disposable DEBUG fixture clone with the paper photo replacing the previous synthetic drawing; production native app source remains unchanged. The real small-screen photo-selection process was also exercised through the system picker and captured as local supporting evidence. No camera session, server upload, model call or physical-device delivery was performed.

Full PNG originals are under `.build/source-assets/itongue-demo-20260929/`. Twelve WebP files under `assets/itongue/` are lossless (decoded pixels verified identical), loaded by selected screen. Keep the HTML with its adjacent `assets/` folder for offline use. Provenance, hashes and boundaries: `.build/itongue-demo-sources.json`. Original native view code hashes match the capture clone. Native source and capture-clone Simulator builds succeeded; the clone used its own `cn.itongue.slidecapture` bundle identifier.

Validation: 599 source assertions across the integrated 17-page/two-language deck; Chrome checked 26 desktop feature states, 12 mobile step/language combinations, image decoding, same-image zoom, layout bounds, focus restoration, Enter/Space activation, autoplay cancellation and reduced motion; zero page errors. Safari/Firefox/Edge and projector tests not run. Website publication verification is recorded in PROJECT_PROGRESS.md.


## Left-edge presentation directory — 2026-09-29

The global top navigation is replaced by a left-edge drawer listing every slide number and bilingual title, grouped into Opening, NourishDay and iTongue. Mouse entry at the leftmost 12px opens it; moving away dismisses it after 220ms. Clicking the visible directory tab or page counter, or pressing M, opens a persistent directory. Selecting a slide dismisses it. Escape closes it and restores focus. The active page is highlighted and scrolled into view. Language and fullscreen controls live in the drawer; entering fullscreen dismisses it.

Only previous / current-total / next remain in a compact bottom dock. Left/right arrow keys work as before. Mobile uses a clear 44px directory button and a scrollable drawer instead of relying on hover. Desktop canvas fitting now uses the freed vertical space while retaining 16:9. The drawer overlays the canvas without changing its size; reduced-motion removes its entrance animation. Slide content, renderers and assets are unchanged from website base `73512ad`.

Validation: 639 state assertions passed, including all 17 directory entries in both languages and navigation dismissal. In-app Chromium: 34 bilingual directory jumps, current-page markers, close-on-select, mouse edge entry/exit, M/Escape and arrow navigation passed. Mobile 390×844 drawer remains within the viewport, scrolls to slide 17, and switches language; fullscreen at 1920×1080 retains ratio 1.7777778 and closes the drawer. Safari/Firefox/Edge and projector rehearsal not run.


## iTongue result guidance and framing refresh — 2026-09-29

Page 15 adds selectable cold/normal/heat native result examples with corresponding food-photo cards, short serving explanations and stronger synchronized highlighting. Dietary guidance is visibly labeled a web-only concept, not yet implemented in the native app; linked Hong Kong Department of Health material provides traditional food-property context, not treatment validation. The camera rehearsal uses a presentation-only guide aspect ratio fitted to the static photo (actual camera default unchanged). Native History is populated with 31 fictional records spanning five months. No real user records, upload or inference is involved.

Hover locates screenshot regions; click locks the explanation. Next feature and Guided tour traverse all annotations. Eight versioned lossless WebPs refresh guide/history and add cold/heat result views; old assets retained, sixteen active screenshots. Provenance updated in `itongue-demo-sources.json`. Original native App, backend and device state unchanged. Matching source passes 682 assertions plus Chrome checks of 30 desktop features, 12 food selections, bilingual phone layout, keyboard, hover, autoplay and reduced motion. Concurrent left-edge navigation is preserved.


## Compact seasonal food recommendations — 2026-09-29

The Seasonal Eating panel on page 4 now changes two real food photos, names and one concise serving rationale with each season: spring coix/adzuki porridge, summer watermelon/winter melon, autumn lily bulb/snow fungus soup, winter ginger/tofu soup. These are illustrative seasonal meal ideas, not individualized treatment recommendations. Winter warmth describes a hot soup, not a new food-property classification for tofu. English and Simplified Chinese stay separate. Existing embedded images and source/license credits are retained; the credits disclosure also includes seasonal photographs used here.

Photo-first cards replace generic numbered copy and the redundant product footer. Click/touch, keyboard activation, focus restoration and reduced-motion support remain. Local Chrome verified 16 season/language/desktop-phone states, decoded photos, no panel or viewport overflow, unchanged food-property selection, keyboard and reduced motion; no page errors. Existing 682 source assertions pass. Only the seasonal data/renderer and scoped CSS were extracted for publication; concurrent uncompleted native walkthrough/navigation source edits were preserved locally and excluded from this commit.


## Fullscreen and real-image region review — 2026-09-30

The bottom control dock now includes a permanently visible bilingual fullscreen button (F enters/toggles; Esc exits). Standard and WebKit fullscreen APIs are called directly; state changes track native entry/exit, with presentation-view fallback when the host browser does not support fullscreen. Chrome native fullscreen, in-fullscreen navigation, Esc exit and the 16:9 stage were verified.

English Recognition now uses an unedited English screenshot captured from the already installed NourishDay Build 150 QA App using its loading fixture. Chinese mode retains the original Chinese capture. The shown elapsed time is fixture data, not a performance measurement. No native source, physical-device data, or server recognition request was changed. Other archival screens remain original English UI with bilingual explanations.

All 37 NourishDay feature regions across 13 source screens were visually reviewed and adjusted; actual source dimensions replace the shared assumed aspect ratio. The phone overlay and magnifier use identical coordinates, and explicit SVG clipping prevents pixels outside a selected region from appearing in letterboxing. The same clipping correction applies to iTongue magnification. Tea preparation text now describes only the visible ingredient cards and identifies instructions below the capture.

Validation: 737 source/state assertions; 74 bilingual NourishDay browser states with matched image/overlay/crop geometry; 30 iTongue states with loaded native assets and bounded magnification; mobile control overlap/overflow checks. Browser proof and detailed audit remain in the local presentation build folder. Safari/Firefox-specific runtime validation was not run.


## Synchronized result and retake experience — 2026-09-30

The iTongue Result stage now uses a shared HTML product-preview state for the phone and the enlarged detail. Cold/normal/heat examples display the same food photographs, labels and selected card on both sides. Selecting either side updates both; an original, unedited native result capture remains accessible separately. The result preview is explicitly labeled as planned additions; it does not claim that food recommendations are already shipped. Existing native screenshots in the other five stages remain unchanged.

A fourth scenario, Retake needed, suppresses result labels and food suggestions and shows the same recovery content on both sides. Three selectable causes cover no visible tongue, uneven lighting, and blur/incomplete framing. Each explains the issue, gives three actionable capture tips, and links back to the existing Frame demonstration. No analysis is performed, no photos are uploaded and no record is saved. This is the intended product recovery experience, not evidence of a newly deployed image-quality model. Native capture status, segmentation unavailability and input rejection are kept distinct.

The next-feature/guided sequence includes retake guidance. Keyboard focus remains on the side used for food selection; the original capture dialog supports Escape and returns focus. Bilingual desktop/mobile state tests verify paired photos, selection, text, no food outputs in rejected states and no preview overflow. Publication is limited to these Result renderers/styles and README; unrelated local changes to slide ordering are excluded.

## Complete Today walkthrough and native tab order — 2026-09-30

The walkthrough now follows Today → Calendar → Scan (including Review & save) → Library → Me, matching the native bottom bar. Today is page 7. Eight full 1320×2868 native captures cover English/Chinese Overview (day-of-year and days-left), Meals & tea, and Daily tips. The stamp toggles actual native captures (day 273 / 92 days remaining on September 30); it is not a live date counter. The native tab bar remains visible and clickable. The phone area supports wheel/vertical swipe to switch among three captured scroll positions, with equivalent visible view buttons. Region selection animates the bounding box, while the magnified image uses the exact language-specific coordinates and bounded clipping; reduced motion suppresses animation.

Capture provenance: `.build/today-walkthrough-provenance.json`. Existing DEBUG weather/sample content was captured in a dedicated iOS Simulator. A disposable source copy added initial tab/ScrollViewReader positioning; original native App source was not changed. Screens are real native UI with sample data, not a continuous recording or live weather. The eight PNG originals remain under `.build/source-assets/today-20260930/`; lossless WebP assets are published. Original App build/install, physical-device testing and App Store distribution: not changed/not run. The disposable capture build succeeded and was installed only on the dedicated simulator.

Validation: 793 source assertions pass; browser audit checks complete image dimensions, aspect ratios, bounded regions, no horizontal overflow, both languages at 1440/390 widths, native date switching, full-image modal, wheel navigation and chapter order. The shared iTongue result synchronization and fullscreen changes are preserved. Website publication status is recorded in PROJECT_PROGRESS.md; local authoring sources remain outside the verified website Git handoff.

## Research supplement — 2026-09-30
Page18 adds a bilingual, approximately60-second research foundation section citing Jiacheng Xie et al., Medical Review (doi10.1515/mr-2021-0018). Presenter-supplied figures support an enlarged view and a brief optional thermal-research view; Grad-CAM relevance is distinguished from measured temperature. No new segmentation-paper material or diagnostic performance claim. Original first17 routes preserved. Provenance: `research-provenance.json`.

## Lab team closing slide — 2026-09-30
Page19 introduces Digital Biology Lab using the official2026 group photo, four faculty portraits/titles, and a selectable list of14 Ph.D. students. Jiacheng Xie is identified as presenter. Affiliation follows the live official homepage: Health Informatics Institute, University of South Florida. Links open the lab homepage, full roster/alumni, and original group photo. Names, roles and assets verified2026-09-30; source/hash record: `team-provenance.json` (local `.build/`). This describes the lab community, not a claim of product participation or endorsement by every member. Existing1–18 routes retained. Planned closing30seconds, total1200seconds.

## Investor briefing content in the interactive background — 2026-09-30

Page 2 now offers four bilingual topics: Why a diary, Who it helps, Product strengths, Free & Premium. Selected content comes from `NourishDay_Investor_Commercial_EN_v4_Final_Reviewed.pptx` (slides3–7,10–12,21–23 and28). The background explains ingredients, actual portions and the value of revisiting records. Fitness/protein consistency is a proposed first cohort; balance is adjacent and carbohydrate awareness has separate assessment boundaries. Four product strengths use existing real native captures and bounded magnification, linking into the exact relevant demo screen/feature. No generated editorial portraits or investor-deck AI imagery are added.

Free/Premium toggles show current advertised US prices ($2.99/month, $29.99/year),3/20 daily image-analysis ceilings and7-day/full nutrition history. Return/Upgrade/Renew controls explain evidence still needed. Prices were checked against the public App Store listing; quotas against the reviewed owner deck and product site on September30,2026. Speculative revenue, market, contribution-margin and acquisition scenarios were not imported. Speed, ease, retention and paid demand are not presented as proven advantages. Existing chapter deep links and concurrent research/team slides remain intact.

Source files: `.build/nourish-background.js`, `nourish-background.css`, integrated app/style, updated speaker notes and `background-provenance.json`. Native asset files remain unchanged. Browser validation covers48 states across two languages and desktop/mobile, with keyboard, reduced motion and exact demo destinations additionally checked. Original PPT is read-only; no native App, backend, device or Store changes. Website push/deployment evidence and rollback are recorded in PROJECT_PROGRESS.md.


## TCM bibliography — 2026-09-30
Page17 replaces the old technical-progress content with a bilingual source-linked bibliography.23 distinct outputs:18 journal/conference/chapter records,3 preprints,1 degree thesis and1 university project report. Scholar profiles were read through their final pages (Jiacheng15 total entries; Dong632). TCM/tongue/herbal-food records were screened, shared items merged, and a distinct2012 journal version added from the publisher and lab bibliography. Includes8 Jiacheng-authored and22 Dong-authored outputs (overlap7). Three records per view; author/type filters, bibliography pagination and accessible full-citation dialog retain readable16:9 text. Full citations link to the original source and Scholar record. TCM-Ladder uses official NeurIPS2025 conference year rather than Scholar's2026 metadata. Provenance: `publications-provenance.json`. Research history is not represented as clinical validation of the apps.19-slide order, team page19, research figures page18 and previous demo routes preserved.


## NourishDay closing links — 2026-09-30

The final NourishDay page (12) now offers the official website for more features/details and a direct Next project · iTongue button. The website opens in a new tab, preserving the presentation; both languages use the verified canonical `/nourishday/` URL because `/nourishday/zh/` returned404. The project button opens the four-examinations introduction on page13. Existing screenshot selectors and annotations remain available. English/Chinese desktop/mobile checks cover24feature states, website destination and keyboard project navigation. No native App or service changes.


### 2026-09-30 inspection photo refresh
Page13 now uses an unretouched official Klinik am Steigerwald tongue-inspection photograph with a visible linked clinic credit. The former Kitasato image is replaced in both languages. No partnership or clinical-validation claim is made. Current asset source/hash and reuse terms are in `four-examinations-sources.json` (authoring `.build/four-examinations-provenance.json`).


### 2026-09-30: nine constitutions and tongue features
Page16 adds a synchronized tongue-features tab (colour, coating, shape/surface), original scalable SVG diagrams and bilingual typical manifestations. Published paper examples remain separate and unchanged. Traditional descriptions are educational; patterns overlap and special diathesis has no unique tongue assigned. Sources/provenance: constitution-sources.json. Checked108 bilingual desktop/mobile states without clipping or horizontal overflow.


### 2026-09-30 original figures restored
Owner preference supersedes the generated SVG figures: restored original supplied FOODROOT.TCM people, preserving enlarged detail and bilingual manifestations. Tongue-features view now shows the unmodified1276x760owner-supplied chart, nine-type explanation selectors and an accessible full-original dialog. The ten-pattern source taxonomy is explicitly kept distinct from nine constitutions.72bilingual desktop/mobile states pass; modal image decodes at original dimensions and Escape restores focus.


### 2026-09-30: financial slides removed
Removed Revenue scenarios and Unit economics at owner request, including renderers, controls and private narration. Current deck has23pages: partnership/validation22, team23. EN/ZH directory and navigation updated. Retained narration1055seconds plus145seconds for discussion within20minutes. Current authoring artifact: NourishDay_iTongue_Interactive_23_Pages.html. Older generated files are historical snapshots.
