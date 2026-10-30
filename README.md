# Signal & Spark website

Local, buildless band website. Run `node server.cjs` in this folder, then open http://127.0.0.1:4173. Or open index.html directly for a basic preview.

The six songs, lyrics, and optimized covers are local copies of the band's assets. No third-party services, analytics, or dependencies. Music starts only after a visitor presses play. The persistent player supports seeking, volume, previous/next tracks, and automatic advancement. Lyrics open in keyboard-accessible dialogs.

Edit tracks.js to update the collection, styles.css for styling, and index.html for the page copy. This is a local draft; no hosting or streaming-platform links have been configured.

## SEO build
Run `node build-seo.cjs` after editing tracks.js or the SEO generator, then `node check-seo.cjs`. The generator updates homepage metadata and static cards and creates six standalone song pages, robots.txt, and sitemap.xml. Song titles link to those pages; quick lyrics dialogs remain available. The canonical origin is https://signalandsparkmusic.com and the official artist link is https://www.youtube.com/@SignalSpark80s.

Publish the complete website folder (including songs and assets). The local server is for preview only. Restart it after server.cjs changes. Production hosting must serve real 404s for unknown URLs and redirect HTTP and the nonpreferred www host to the canonical HTTPS origin.
