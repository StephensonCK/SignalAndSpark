const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.mp3':'audio/mpeg','.png':'image/png','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.ttf':'font/ttf'};
http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root,'.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.stat(file,(err,stat) => {
    if(err || !stat.isFile()) { res.writeHead(404).end('Not found'); return; }
    const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
    const range = req.headers.range;
    let start=0,end=stat.size-1,code=200;
    if(range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if(!match) { res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end(); return; }
      start=Number(match[1]); end=match[2] ? Math.min(Number(match[2]),end) : end;
      if(start>end) { res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end(); return; }
      code=206; headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length']=end-start+1;
    res.writeHead(code,headers);
    if(req.method==='HEAD') res.end(); else fs.createReadStream(file,{start,end}).pipe(res);
  });
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));

