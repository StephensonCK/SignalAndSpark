const spotifySlot = document.querySelector('#spotify-slot');
const player = document.querySelector('.player');
const status = document.querySelector('#player-status');
let current = -1;
let playbackTrigger = null;
let lyricIndex = 0;
let lyricsTrigger = null;
const dialog = document.querySelector('#lyrics-dialog');
const playerHome = player.parentNode;
const lyricsPlay = document.querySelector('#lyrics-play');
function updateButtons() {
  document.querySelectorAll('[data-play]').forEach(button => {
    const index = Number(button.dataset.play);
    button.setAttribute('aria-label', `Listen to ${tracks[index].title} on Spotify`);
    const label = button.querySelector('[data-play-label]');
    if (label) label.textContent = 'Listen on Spotify';
  });
  lyricsPlay.textContent = `Listen to ${tracks[lyricIndex].title} on Spotify`;
  document.querySelectorAll('.record').forEach(card => card.classList.toggle('is-playing', Number(card.dataset.track) === current && !player.hidden));
}
function play(index) {
  const track = tracks[index];
  if (current !== index || !spotifySlot.firstChild) {
    const frame = document.createElement('iframe');
    frame.className = 'spotify-embed';
    frame.src = track.spotifyUrl.replace('/track/', '/embed/track/') + '?utm_source=generator';
    frame.title = `Listen to ${track.title} on Spotify`;
    frame.width = '100%'; frame.height = '152';
    frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    spotifySlot.replaceChildren(frame);
  }
  current = index;
  player.hidden = false;
  document.body.classList.add('has-player');
  document.querySelector('#player-title').textContent = track.title;
  document.querySelector('#player-spotify').href = track.spotifyUrl;
  document.querySelector('#player-amazon').href = track.amazonUrl;
  status.textContent = 'PRESS PLAY IN SPOTIFY BELOW';
  updateButtons();
  updatePlayerSpace();
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-play]');
  if (button) { playbackTrigger = button; play(Number(button.dataset.play)); }
  const lyrics = event.target.closest('[data-lyrics]');
  if (lyrics) {
    lyricsTrigger = lyrics;
    lyricIndex = Number(lyrics.dataset.lyrics);
    const track = tracks[lyricIndex];
    document.querySelector('#lyrics-title').textContent = track.title;
    const lines = track.lyrics.trim().split(/\r?\n/);
    if (lines[0].trim().toLowerCase() === track.title.toLowerCase()) lines.shift();
    const content = document.querySelector('#lyrics-text');
    content.replaceChildren(...lines.join('\n').trim().split(/\n\s*\n+/).map(stanza => {
      const p = document.createElement('p'); p.textContent = stanza.trim(); return p;
    }));
    document.querySelector('#lyrics-player-slot').append(player);
    updateButtons();
    dialog.showModal();
    content.scrollTop = 0;
  }
});
document.querySelector('#previous').onclick = () => play((current - 1 + tracks.length) % tracks.length);
document.querySelector('#next').onclick = () => play((current + 1) % tracks.length);
document.querySelector('#close-player').onclick = () => { spotifySlot.replaceChildren(); player.hidden = true; updateButtons(); updatePlayerSpace(); document.body.classList.remove('has-player'); (playbackTrigger || document.querySelector(`[data-play="${current}"]`)).focus(); };
document.querySelector('#close-lyrics').onclick = () => document.querySelector('#lyrics-dialog').close();
document.querySelector('#lyrics-dialog').addEventListener('click', event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close(); } });

lyricsPlay.onclick = () => { playbackTrigger = lyricsTrigger; play(lyricIndex); };
dialog.addEventListener('close', () => {
  playerHome.insertBefore(player, dialog);
  lyricsTrigger?.focus({ preventScroll: true });
  updatePlayerSpace();
});
function updatePlayerSpace() {
  const height = player.hidden || dialog.open ? 0 : player.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--player-space', `${Math.ceil(height)}px`);
}
new ResizeObserver(updatePlayerSpace).observe(player);
document.querySelector('.skip').addEventListener('click', () => document.querySelector('#music').focus());

// Match the navigation marker to the section currently being read.
const sectionLinks = [...document.querySelectorAll('nav.sound-note a')];
const menuSections = sectionLinks.map(link => document.querySelector(link.hash));
function updateSectionNavigation() {
  const marker = document.querySelector('nav.sound-note').getBoundingClientRect().height + 100;
  let current = null;
  for (const section of menuSections) {
    if (section.getBoundingClientRect().top <= marker) current = section.id;
  }
  sectionLinks.forEach(link => {
    if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let menuFrame = false;
addEventListener('scroll', () => {
  if (menuFrame) return;
  menuFrame = true;
  requestAnimationFrame(() => { updateSectionNavigation(); menuFrame = false; });
}, { passive: true });
addEventListener('resize', updateSectionNavigation);
updateSectionNavigation();

updateButtons();
