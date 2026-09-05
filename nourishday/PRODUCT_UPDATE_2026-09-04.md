# Product experience update — 2026-09-04

## Scope and delivery boundary

Updated the existing English and Chinese NourishDay landing pages. English remains the default. No app code, account data, referral logic, production backend, or App Store settings changed. Initially delivered as a local preview; the user subsequently authorized production publication of this validated source on 2026-09-04. Publish via the existing GitHub Pages main branch, and confirm completion with the matching Pages run plus public asset checks.

## Experience

- Shorter hero copy, an interactive breakfast/lunch/dinner nutrition illustration.
- Three-step meal demo: capture, adjust a sample serving, save/reset. No upload or account requests.
- Fourteen distinct example nutrition days, play/pause and direct date selection. Playback stops after one pass, on manual selection, when offscreen, or when the document is hidden.
- Six keyboard-accessible feature tabs, localized screenshots, full-image viewer with native dialog focus management.
- Responsive picture sources: actual iPhone captures on mobile and actual iPad captures on larger displays. No screenshot content was cropped or painted over.
- Mobile download dock, touch-sized controls, safe-area spacing, visible section navigation, reading progress, subtle state transitions and reduced-motion support. Native page scrolling is preserved.
- Existing WeChat inline browser-opening/copy-link route is unchanged. Ordinary iOS browsers retain a user-initiated App Store scheme link, with HTTPS in the HTML fallback. No claim that website code can bypass WeChat restrictions.

## Content and asset provenance

Apple's public US lookup for app ID 6798932418 reported version 1.8.1 and minimum iOS 16.0 on 2026-09-04. Public product features and corresponding existing app source were cross-checked; unshipped local 1.8.2 changes are not advertised as released features. Compatibility copy was corrected from iOS 17 to iOS 16.

Sources in the TCM_Calendar app repository:

- iPad: `AppStoreAssets/Release1.8Build124/ipad-review-v2/raw/{en-US,zh-Hans}/01-today.png` through `06-trends.png`.
- iPhone: `AppStoreAssets/Promo2026-09-03/v2/assets/iphone/{en-US,zh-Hans}/01-today.png` through `06-trends.png`.
- iPhone `capture-receipt.json` identifies the frozen release simulator build 1.8 (124), with isolated demonstration fixtures, captured 2026-09-03.
- Conversion only: cwebp quality 84, widths 960 (iPad) and 660 (iPhone). All 24 responsive/localized screenshots combined are approximately 1 MB; each page selects the relevant language/device source and uses lazy loading.
- Sample meal and nutrition numbers are explicitly labeled illustrative. Existing privacy copy, premium eligibility/pricing caveats, metadata, share icon, and App Store ID are retained.

## Validation

- `node nourishday/tests/verify-product.mjs`: local assets, unique IDs, ARIA references, JSON-LD parsing, bilingual picture source mapping, six panels, fourteen dates, screenshot size budget.
- `node --check nourishday/script.js`, `node --check nourishday/app-store.js`, and `git diff --check`.
- Browser viewport QA for both languages: 320×740, 390×844, 430×932, 768×1024, 844×390, 1440×1000. No document horizontal overflow or measured heading overflow after fixes.
- Desktop feature panel height is stable across all six selections (856 px at 1440 px). Mobile sample save/reset card heights differ by only 5 px.
- Breakfast updates to 440 kcal; 1.25 sample servings updates to 774 kcal / 65 g protein / 11.5 g fiber; save/reset restores focus to a visible control.
- Calendar advances from August 4, manual August 8 selection pauses and shows 109% / 55 g protein, with exactly one selected date.
- Keyboard End selects the final feature. Screenshot open/close/Escape and focus restoration passed; mobile image selection verified as the localized iPhone source.
- Local WeChat user-agent fixture: download dock points to visible instructions, zero itms-apps links, denied clipboard permission exposes a selectable HTTPS link. Local iOS fixture: primary and dock use the App Store scheme. Reduced-motion fixture: all reveal sections visible, filled rings, no CSS animations, feature selection still works. These are browser fixtures, not real-device WeChat or App Store handoff verification. Temporary fixtures removed.
- Browser error log empty in the preview. Premium hover styling retains the dark background override; no changes to its previously fixed contrast behavior.

Real iPhone/WeChat, Windows hardware, production publish, and post-publish checks remain separate verification boundaries.

## Follow-up: quieter hero, clearer calories, mobile reading

- Removed the hero's duplicate availability badge, eyebrow, and three explanatory pills in both languages. Kept one short, readable sentence below the main heading.
- Replaced the iOS WeChat instruction paragraph with a non-interactive SVG illustration: native-style three-dot menu, direction arrow, and browser icon with two short labels. The illustration has an accessible description and does not pretend to operate WeChat's native menu. Copy-link permission fallback remains intact.
- Moved the calorie total outside the rings into a 29 px mobile / 32 px desktop primary value. The ring center now shows the compact energy percentage. Breakfast/lunch/dinner updates both fields together.
- Phone reading: passive, frame-bounded direction detection hides the web header after downward movement and restores it on upward movement or keyboard focus. Reduced-motion mode retains the visible header. There is no scroll interception, forced paging, or touch gesture override.
- Mobile content reveals trigger slightly before the viewport and settle in 280 ms. Removed expensive backdrop blurs from the phone header and meal demo card, without changing their visual contrast.
- Repeated both-language viewport checks at 320, 390, 430, 768, 844 and 1440 px: no document, heading, guide-label or phone-content overflow; calorie total stays above the rings at every size. Breakfast confirmed as 440 kcal / 22%.
- Local browser scrolling verified header hide/restore. Local iOS WeChat fixture verified the SVG route, selectable link fallback, and white-on-dark bottom download guide. This is not a real-device WeChat performance measurement. Temporary fixture removed; syntax, static checks and diff checks passed.
- At the time of the follow-up review this was still local-only, without a commit, push, production publish, app build, or backend restart. The subsequent explicit publication request is recorded above.
