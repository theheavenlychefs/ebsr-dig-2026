# EBSR Design Decisions

- The approved DIG 2026 homepage hero is locked unless the user explicitly requests a hero change.
- The Retreat section uses a pure black (`#000000`) background. The temporary black/white comparison control was removed after the user selected black.
- Reserve a pure white (`#ffffff`) background for the next page the user requests. Do not build that page until requested.
- The Retreat borrows warm gold colour and localized glow from the supplied Atanda Vault reference: `#d4af37`, `#f5d278`, and `#c9a14a`. Retain EBSR's ivory text and muted crimson accents; do not copy the reference's content, key artwork, cards, routes, or visual identity.
- Use genuine retreat media and the official logos. Never alter or replace the supplied source assets.
- The inline retreat film uses a slight 1.34x presentation zoom, approved by the user to preserve more footage. Some landscape shots can retain letterboxing. The expanded viewer must show the full uncropped video.
- Keep the contour-emitted ripples, audible-first autoplay with browser-policy muted fallback, accessible film controls, and reduced-motion support.
- Implement only the section or page currently requested; do not add future pages or backend features speculatively.
