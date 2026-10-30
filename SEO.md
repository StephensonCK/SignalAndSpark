# SEO implementation and launch checklist

## Assessment
- High priority, fixed: the six-song collection was generated only in JavaScript, and lyrics had no separate URLs. Static cards now link to six complete HTML song pages with native audio and full lyrics.
- High priority, fixed: homepage metadata did not clearly identify the genre, and canonical URLs were missing. All seven pages now have unique titles, descriptions, and canonicals on https://signalandsparkmusic.com.
- Fixed: added MusicGroup and MusicRecording JSON-LD using supplied facts and the official YouTube channel, plus social sharing metadata.
- Fixed: generated robots.txt and a seven-URL sitemap. No fabricated release dates, membership, reviews, or audience claims.
- Still unverified: public hosting, HTTPS redirects, indexing, performance on the deployed host, and Search Console ownership. The public URL could not be retrieved by the research tool; this does not establish its DNS or deployment status.

## Validation
Run `node build-seo.cjs` and `node check-seo.cjs`. The checks cover unique page titles, one h1 and canonical per page, parseable JSON-LD, local links/assets, six static cards, audio/lyrics markup and seven sitemap URLs. This is local validation, not a Google rich-result certification. Music schema does not guarantee special search presentation.

## Prioritized launch actions
1. Publish the complete website to the confirmed domain; confirm HTTPS and canonical redirects and true 404 responses. Nothing has been deployed in this task.
2. Verify domain ownership in Google Search Console and Bing Webmaster Tools, then submit https://signalandsparkmusic.com/sitemap.xml. Inspect the homepage and one song URL. Requires account/domain access.
3. Add https://signalandsparkmusic.com to the official YouTube channel's website links and relevant video descriptions. No channel changes have been made.
4. Check live mobile performance, especially the large PNG hero and logo; prepare compressed delivery versions before a broad launch if load time is poor.
5. Add future songs through tracks.js and rebuild. Use the individual song links in genuine release announcements. Review indexing and queries after launch; rankings and indexing timing cannot be guaranteed.

Sources: https://developers.google.com/search/docs/crawling-indexing/links-crawlable and https://schema.org/MusicRecording
