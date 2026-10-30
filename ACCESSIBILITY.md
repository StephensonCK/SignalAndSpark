# Accessibility pass — October 29, 2026

## Fixed

- Primary button contrast increased from 4.30:1 to 5.19:1 (cream text against pink). Hover uses a darker pink.
- Paper-panel and skip-link focus indicators use dark ink rather than low-contrast cyan. Paper close-button hover is dark raspberry.
- Skip link moves focus to the music section, not only its scroll position.
- Lyrics button accessible names include their exact visible label and song title for voice control.
- Audio has a descriptive accessible name; polite, atomic status announces the selected song.
- Lyrics close restores the actual initiating button. Playback begun inside lyrics records the correct return target.
- Failed audio can reload when retried.
- Bottom-player spacing tracks its actual size, reducing focused-content occlusion when controls wrap or text grows.
- Wordmark and footer links have 44px minimum height.
- Small-screen title fit and button wrapping improved; short-window dialog keeps lyrics scrollable.
- Forced-colors fallback restores solid headline text and visible control boundaries.
- Small hero copy has a solid dark backing to avoid contrast depending on the photograph.

## Verified

Browser keyboard path: Tab to visible skip link; Enter moves focus to music; Enter plays cover; lyrics open with a named dialog; Tab reaches scrollable lyrics; Escape returns to the initiating lyrics button. Closing player returns to its cover trigger. Native audio controls remain available inside lyrics.

At a 320 CSS pixel viewport, collection and long-title lyrics/player layout fit without document horizontal scrolling. Fonts load. JavaScript syntax check passes. Normal and paper text contrast was calculated; dark ink on paper 8.60:1 and muted text on navy 9.44:1. Pink button 5.19:1.

## Limits

Not a WCAG conformance certification. No NVDA/VoiceOver session, physical touch-device test, browser zoom/text-only zoom, or runtime Windows high-contrast test was performed. Forced-colors and reduced-motion behavior were reviewed in source. Native audio UI is browser-owned. Decorative chrome lettering and textured/image regions need manual visual judgment beyond flat-color calculations. No automated axe scan was run.
