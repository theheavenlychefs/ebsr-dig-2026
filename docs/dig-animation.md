# DIG Alpha Animation

## Delivery Asset

- Original: `C:\Users\HP\Videos\DIG(4).mov` (not copied into the repository).
- Source: QuickTime Animation/qtrle, ARGB, 714 x 480, 30fps, 18.4 seconds of video, 97,369,194 bytes, approximately 42.3 Mbps; includes an unused audio track.
- Delivery: `public/assets/dig-animation.webm`, VP9 with alpha, same dimensions/frame rate/video duration, no audio, 1,202,029 bytes (approximately 1.2 MB), approximately 523 Kbps.
- Alpha was verified in decoded source and delivery PNGs, not inferred from a filename or metadata. A source sample contains both fully transparent and fully opaque pixels. Frame-aligned alpha comparison across all 552 frames gives approximately 50.5 dB PSNR. Sampled artwork and padding match visually.

Reproduce the separate delivery asset with FFmpeg:

```powershell
ffmpeg -i "C:\Users\HP\Videos\DIG(4).mov" -an -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 24 -deadline good -cpu-used 3 -row-mt 1 -auto-alt-ref 0 public/assets/dig-animation.webm
```

FFmpeg's default native VP9 decoder may report `yuv420p` despite the separate WebM alpha plane. Use `-c:v libvpx-vp9` before the input when decoding to inspect transparency.

## Browser Behaviour

`CyclicAlphaLogo` starts with the existing PNG. The animation has no `src` in server-rendered HTML and no independent loop. After a tiny alpha-decoding probe succeeds, the delivery asset preloads during the initial ten-second static interval. Each natural video completion restores the PNG for another ten seconds. Late buffering retains the PNG until ready.

The 16 x 16, six-frame `alpha-probe.webm` uses the same VP9/alpha encoder settings with fully transparent pixels. Before downloading the main asset, the component decodes this probe into a canvas and checks actual alpha. Browsers that reject WebM or decode it without transparency retain the PNG. Reduced-motion users request neither video file. Motion preference changes immediately stop animation and restore the PNG.

Safari's VP9 playback support does not imply WebM alpha support; see the [MDN video codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs). Safari/iOS therefore use the PNG fallback unless the actual alpha probe succeeds. No HEVC-alpha delivery asset is supplied in this iteration.

Timers and playback pause when the document is hidden, the artwork is offscreen, or the poster is open. The static countdown and video playback position resume, rather than starting a second loading phase. A compositor callback or decoded `timeupdate` reveals video, avoiding blank startup frames and invisible replay callbacks. Cleanup cancels timers, listeners, probes, and frame callbacks.

## Verification

```powershell
node scripts/test-logo-cycle.cjs
npm run build
```

The lifecycle harness exercises three complete cycles, late readiness, unsupported codec, absent alpha, autoplay rejection, reduced motion, preference changes, older frame APIs, suppressed compositor callbacks, hidden/offscreen/poster pauses, and unmount cleanup. Rendered Chromium checks cover desktop 1440 x 900 and mobile 390 x 844, with matching geometry and transparent playback/replay. This is not a physical Safari/iPhone playback test.
