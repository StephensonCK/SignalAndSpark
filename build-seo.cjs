const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const origin = 'https://signalandsparkmusic.com';
const tracks = vm.runInNewContext(fs.readFileSync(path.join(root, 'tracks.js'), 'utf8') + '\ntracks');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const artist = {'@type':'MusicGroup','@id':origin+'/#artist',name:'Signal & Spark',url:origin+'/',genre:['Synth-pop','Dance-rock'],sameAs:['https://www.youtube.com/@SignalSpark80s']};
const json = data => JSON.stringify(data).replace(/</g,'\\u003c');
function metadata(title, description, url, image, schema) {
  return `<title>${esc(title)}</title>\n<meta name="description" content="${esc(description)}">\n<link rel="canonical" href="${url}">\n<meta property="og:type" content="website"><meta property="og:site_name" content="Signal &amp; Spark"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta property="og:image:alt" content="${esc(title)} artwork"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${image}">\n<script type="application/ld+json">${json(schema)}</script>`;
}
fs.mkdirSync(path.join(root,'songs'),{recursive:true});
for (const track of tracks) {
  const url = `${origin}/songs/${track.slug}.html`;
  const title = `${track.title} — Lyrics & Listen | Signal & Spark`;
  const description = `Listen to ${track.title} by Signal & Spark and read the full lyrics. Explore the band's 1980s-inspired synth-pop and dance-rock music.`;
  const recording = {'@context':'https://schema.org','@type':'MusicRecording',name:track.title,url,byArtist:artist,image:`${origin}/assets/${track.slug}.webp`,audio:{'@type':'AudioObject',contentUrl:`${origin}/assets/${track.slug}.mp3`,encodingFormat:'audio/mpeg'}};
  const lyrics = track.lyrics.replace(/\*+/g,'').trim();
  const stanzas = lyrics.split(/\n\s*\n/).map(s=>`<p>${esc(s).replace(/\n/g,'<br>')}</p>`).join('\n');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#070b18">${metadata(title,description,url,recording.image,recording)}<link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../poster.css"><link rel="icon" type="image/svg+xml" href="../assets/favicon.svg"><link rel="stylesheet" href="../song.css"><script src="../song-player.js" defer></script></head><body class="song-page"><a class="skip" href="#lyrics">Skip to lyrics</a><nav class="song-nav" aria-label="Main navigation"><a href="../index.html#music">← Music &amp; lyrics</a><a href="../index.html#story">About the band</a></nav><main class="song-layout"><div><img class="song-cover" src="../assets/${track.slug}.webp" width="800" height="800" alt="${esc(track.title)} single cover"><p>Signal &amp; Spark</p><h1>${esc(track.title)}</h1><audio controls preload="none" src="../assets/${track.slug}.mp3" aria-label="Listen to ${esc(track.title)}"></audio><p><a href="https://www.youtube.com/@SignalSpark80s">Signal &amp; Spark on YouTube</a></p></div><section id="lyrics" tabindex="-1" aria-labelledby="lyrics-heading"><h2 id="lyrics-heading">${esc(track.title)} lyrics</h2>${stanzas}</section></main><nav class="song-related" aria-label="More songs"><h2>More from Signal &amp; Spark</h2>${tracks.filter(t=>t.slug!==track.slug).map(t=>`<a href="${t.slug}.html">${esc(t.title)}</a>`).join('')}</nav><footer><a href="../index.html">Signal &amp; Spark</a><p>© 2026 Signal &amp; Spark</p></footer></body></html>`;
  fs.writeFileSync(path.join(root,'songs',track.slug+'.html'),html);
}
let home = fs.readFileSync(path.join(root,'index.html'),'utf8');
home = home.replace(/<!-- SEO START -->[\s\S]*?<!-- SEO END -->\s*/,'').replace(/<title>[\s\S]*?<\/title>\s*/,'').replace(/<meta name="description"[^>]*>\s*/,'');
home = home.replace('</head>',`<!-- SEO START -->\n${metadata('Signal & Spark | 1980s-Inspired Synth-Pop & Dance-Rock','Explore Signal & Spark: 1980s-inspired synth-pop, dance-rock, and big choruses. Listen to original songs, read the lyrics, and meet the project.',origin+'/',origin+'/assets/night-drive-v2.png',{'@context':'https://schema.org','@graph':[artist,{'@type':'WebSite',name:'Signal & Spark',url:origin+'/',inLanguage:'en'}]})}\n<!-- SEO END -->\n</head>`);
const cards = tracks.map((t,i)=>`<article class="record" data-track="${i}"><button class="cover-button" data-play="${i}" aria-label="Play ${esc(t.title)}"><img src="assets/${t.slug}.webp" alt="${esc(t.title)} cover artwork" loading="lazy" width="800" height="800"><span class="play-disc" aria-hidden="true">▶</span></button><div class="record-meta"><span class="track-number">0${i+1}</span><div><h3><a href="songs/${t.slug}.html">${esc(t.title)}</a></h3><button class="lyrics-button" data-lyrics="${i}" aria-label="Read the lyrics for ${esc(t.title)}">Read the lyrics</button></div></div></article>`).join('\n');
home = home.replace(/<div id="records" class="records">[\s\S]*?<\/div>\s*<noscript>[\s\S]*?<\/noscript>/,`<div id="records" class="records">${cards}</div><noscript><p>Choose a song title to listen and read its lyrics.</p></noscript>`);
home = home.replace('Signal & Spark lives where human imagination meets AI-assisted possibility.','Signal &amp; Spark is a 1980s-inspired synth-pop and dance-rock project where human imagination meets AI-assisted possibility.');
if (!home.includes('class="youtube-link"')) home = home.replace('<p class="signature">','<p><a class="youtube-link" href="https://www.youtube.com/@SignalSpark80s">Listen to Signal &amp; Spark on YouTube →</a></p><p class="signature">');
fs.writeFileSync(path.join(root,'index.html'),home);
const urls = [origin+'/',...tracks.map(t=>`${origin}/songs/${t.slug}.html`)];
fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Generated ${tracks.length} song pages, homepage metadata and static cards, robots.txt and sitemap.xml.`);


