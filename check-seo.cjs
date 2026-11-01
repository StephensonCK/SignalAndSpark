const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = __dirname;
const pages = ['index.html',...fs.readdirSync(path.join(root,'songs')).filter(f=>f.endsWith('.html')).map(f=>'songs/'+f)];
const titles = new Set();
for(const file of pages){
 const html = fs.readFileSync(path.join(root,file),'utf8');
 const title = html.match(/<title>(.*?)<\/title>/)[1];
 assert(!titles.has(title),`Duplicate title: ${file}`);titles.add(title);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,file);
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1,file);
 assert(html.includes('https://signalandsparkmusic.com'),file);
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
   const link=match[1].split('#')[0];
   if(/^(https?:|data:)/.test(link))continue;
   assert(fs.existsSync(path.resolve(root,path.dirname(file),link)),`${file}: missing ${link}`);
 }
 if(file.startsWith('songs/')){assert(html.includes('<audio controls'),file);assert(html.includes('id="lyrics"'),file);}
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.equal((home.match(/class="record"/g)||[]).length,7);
assert.equal((fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').match(/<loc>/g)||[]).length,8);
console.log('PASS: eight unique pages, canonical tags, JSON-LD, local asset/link targets, static song cards, audio/lyrics, and sitemap entries.');
