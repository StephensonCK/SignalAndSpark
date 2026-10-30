const media = document.querySelector('.song-page audio, #audio');
if (media) {
  const panel = document.createElement('div');
  panel.className = 'song-player';
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-label', media.getAttribute('aria-label'));
  panel.innerHTML = `<button class="song-toggle" aria-label="Play song">▶</button><div class="song-progress"><label class="sr-label" for="song-seek">Playback position</label><input id="song-seek" type="range" min="0" max="100" value="0" step="0.1" disabled><div class="song-times"><span class="elapsed">0:00</span><span class="duration">—:—</span></div></div><button class="song-mute" aria-label="Mute audio">Sound on</button><label class="sr-label" for="song-volume">Volume</label><input id="song-volume" type="range" min="0" max="1" step="0.05" value="1"><p class="song-status" role="status" aria-live="polite"></p>`;
  media.after(panel);
  media.controls = false;
  media.hidden = true;
  const play = panel.querySelector('.song-toggle');
  const seek = panel.querySelector('#song-seek');
  const mute = panel.querySelector('.song-mute');
  const volume = panel.querySelector('#song-volume');
  const status = panel.querySelector('.song-status');
  const time = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}` : '—:—';
  function sync() {
    play.textContent = media.paused ? '▶' : 'Ⅱ';
    play.setAttribute('aria-label', media.paused ? 'Play song' : 'Pause song');
    const ready = Number.isFinite(media.duration) && media.duration > 0;
    seek.disabled = !ready;
    seek.max = ready ? media.duration : 100;
    seek.value = media.currentTime;
    seek.setAttribute('aria-valuetext', `${time(media.currentTime)} of ${time(media.duration)}`);
    panel.querySelector('.elapsed').textContent = time(media.currentTime);
    panel.querySelector('.duration').textContent = time(media.duration);
    mute.textContent = media.muted ? 'Muted' : 'Sound on';
    mute.setAttribute('aria-label', media.muted ? 'Unmute audio' : 'Mute audio');
  }
  play.onclick = async () => {
    if (!media.paused) { media.pause(); return; }
    status.textContent = 'Loading…';
    if (media.error) media.load();
    try { await media.play(); status.textContent = ''; }
    catch { status.textContent = 'Could not play. Press play to retry.'; }
    sync();
  };
  seek.oninput = () => { media.currentTime = Number(seek.value); sync(); };
  mute.onclick = () => { media.muted = !media.muted; sync(); };
  volume.oninput = () => { media.volume = Number(volume.value); media.muted = false; sync(); };
  ['timeupdate','loadedmetadata','durationchange','play','pause','ended','volumechange'].forEach(event => media.addEventListener(event,sync));
  media.addEventListener('waiting',()=>status.textContent='Buffering…');
  media.addEventListener('playing',()=>status.textContent='');
  media.addEventListener('error',()=>status.textContent='Could not load audio. Press play to retry.');
  sync();
}

