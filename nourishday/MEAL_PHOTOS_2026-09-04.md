# Meal photo update — 2026-09-04

## Scope
Only the bilingual homepage hero meal demo. Breakfast: milk, wholegrain toast and berries. Lunch: existing chicken/rice bowl. Dinner: salmon, quinoa and vegetables. No backend, referral, download, or actual app nutrition changes.

## Assets and generation
Built-in image_gen used (not CLI generation). Both new photos are AI-generated illustrative assets, not user food photos or measured nutrition evidence.
- Breakfast: `nourishday/assets/meal-breakfast-202609.webp`
- Lunch, retained: `nourishday/assets/meal-balanced.webp`
- Dinner: `nourishday/assets/meal-dinner-202609.webp`
- New assets: 1200×900 WebP, quality 82, 380,110 bytes combined.
- Reference: existing `meal-balanced.webp`, visual style only.
- Originals remain in Codex generated_images. WebP encoding via cwebp, no creative image edits.

## Final prompt set
### Breakfast
Use case: photorealistic-natural. Create a NEW standalone meal photograph for the NourishDay website, using the referenced chicken bowl photo ONLY as a visual style reference, not an edit target. Match its warm natural oak tabletop, soft daylight, realistic appetizing food texture and high overhead slightly angled camera. Landscape 4:3 composition, full meal comfortably inside frame with a little tabletop margin; food fills most of frame and remains legible in a small mobile card. Beautiful premium editorial food photography, realistic home-sized portions, not excessive styling. No text, labels, logos, hands, utensils or phone/UI. Subject: a light breakfast of two golden wholegrain toast slices on an off-white speckled ceramic plate, a small portion of sliced strawberries and blueberries neatly alongside, and a clear glass of milk close beside the plate. Visible bread crumb texture and fresh fruit. Arrange the complete plate and milk together centrally; do not cut off the glass. Calm morning feel.

### Dinner
Use case: photorealistic-natural. Create a NEW standalone meal photograph for the NourishDay website, using the referenced chicken bowl photo ONLY as a visual style reference, not an edit target. Match its warm natural oak tabletop, soft daylight, realistic appetizing food texture and high overhead slightly angled camera. Landscape 4:3 composition, full meal comfortably inside frame with a little tabletop margin; food fills most of frame and remains legible in a small mobile card. Beautiful premium editorial food photography, realistic home-sized portions, not excessive styling. No text, labels, logos, hands, utensils or phone/UI. Subject: a dinner plate with one appetizing pan-seared salmon fillet, a modest portion of fluffy quinoa, tender green asparagus, roasted zucchini and cherry tomatoes, a small lemon wedge. Use an off-white speckled ceramic dinner plate, similar ceramics to reference; visibly distinct ingredients and layout from the chicken lunch. Keep the entire plate and all food in frame. Gently browned salmon surface, realistic flakes, soft warm evening daylight without a dark or orange color cast.

## Interaction
Images are preloaded/decoded before a selection commits; the photo, localized alt, cumulative nutrition and pressed button update together. Latest tap wins. Failed loads preserve previous selection with an inline retry message. Reduced-motion skips the 220ms fade. All three images preserve a 4:3 frame on desktop and mobile. Daily total label distinguishes cumulative demo numbers from the individual pictured meal. The existing illustrative nutrition fixture is preserved, not asserted as analysis of the generated photographs.

## Release
Production deployment authorized by the user on 2026-09-04. Publish these validated assets and bilingual pages through the existing GitHub Pages main branch. The deployment turn verifies the Pages result and public resource hashes before reporting success.

## Validation
- `node nourishday/tests/verify-meals.mjs`: EN/ZH image selection, cumulative totals, alt text, decode-before-commit, out-of-order loads, failure/retry and reduced-motion tests passed.
- `node nourishday/tests/verify-product.mjs`: existing bilingual resource, ARIA and screenshot checks passed.
- Browser: EN and ZH breakfast/lunch/dinner selections loaded the corresponding images and totals.
- 390px same-origin mobile test frame: document width and scroll width both 390px, photo 290×218px in every selection; breakfast milk/plate and dinner plate fully visible. Temporary test frame removed after inspection.
- `git diff --check` passed. No physical WeChat device test or production deployment in this update.
