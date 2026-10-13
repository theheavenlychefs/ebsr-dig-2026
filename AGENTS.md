# EBSR Design Decisions

- The approved DIG 2026 homepage hero is locked unless the user explicitly requests a hero change.
- The Retreat section uses a pure black (`#000000`) background. The temporary black/white comparison control was removed after the user selected black.
- Reserve a pure white (`#ffffff`) background for the next page the user requests. Do not build that page until requested.
- The Retreat borrows warm gold lighting and floating glass-card treatment from the supplied Atanda Vault reference: `#d4af37`, `#f5d278`, and `#c9a14a`. The broader glow belongs behind the media, with ivory text and muted crimson accents retained. Do not copy vault-specific content, key artwork, routes, or visual identity.
- The four approved retreat cards are Scripture & Discussion, Worship, Prayer, and Fellowship. They float around the media on desktop and sit in a cohesive two-column layout beneath the media on smaller screens. Keep footage and player controls unobstructed.
- The repeated official Elohim's logo watermark must remain visibly present, without competing with the copy or replacing the source logo.
- Use genuine retreat media and the official logos. Never alter or replace the supplied source assets.
- The inline retreat film uses a slight 1.34x presentation zoom, approved by the user to preserve more footage. Some landscape shots can retain letterboxing. The expanded viewer must show the full uncropped video.
- Keep the contour-emitted ripples, audible-first autoplay with browser-policy muted fallback, accessible film controls, and reduced-motion support.
- Implement only the section or page currently requested; do not add future pages or backend features speculatively.
