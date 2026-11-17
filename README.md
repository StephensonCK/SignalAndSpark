# Signal & Spark website

Local, buildless band website. Run `node server.cjs` in this folder, then open http://127.0.0.1:4173. Or open index.html directly for a basic preview.

The 12 songs use official Spotify embeds for playback and direct Spotify/Amazon Music links. Covers and lyrics remain local. Select a song, then press play inside Spotify's player. Playback availability is managed by Spotify and may be a preview depending on the listener's account/browser. Previous/next selects another song; automatic advancement is not implemented. Lyrics open in keyboard-accessible dialogs.

Edit tracks.js to update the collection, styles.css for styling, and index.html for the page copy. Streaming URLs are configured per song in tracks.js. Add Apple Music URLs once available; do not guess release IDs.

## SEO build
Run `node build-seo.cjs` after editing tracks.js or the SEO generator, then `node check-seo.cjs`. The generator updates homepage metadata and static cards and creates 12 standalone song pages, robots.txt, and sitemap.xml. Song titles link to those pages; quick lyrics dialogs remain available. The canonical origin is https://signalandsparkmusic.com and the official artist link is https://www.youtube.com/@SignalSpark80s.

Publish the complete website folder (including songs and assets). The local server is for preview only. Restart it after server.cjs changes. Production hosting must serve real 404s for unknown URLs and redirect HTTP and the nonpreferred www host to the canonical HTTPS origin.
