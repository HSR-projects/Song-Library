/* HyprSong static library player */
const SONGS = [
// Example entries — replace these with your file names
{ title: 'Song One', artist: 'Artist A', cover: 'covers/cover1.jpg', file: 'songs/song1.mp3' },
{ title: 'Song Two', artist: 'Artist B', cover: 'covers/cover2.jpg', file: 'songs/song2.mp3' },
{ title: 'Song Three', artist: 'Artist C', cover: 'covers/cover3.jpg', file: 'songs/song3.mp3' }
];


// DOM refs
const libraryEl = document.getElementById('library');
const nowCover = document.getElementById('nowCover');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');
const countEl = document.getElementById('count');
const vol = document.getElementById('vol');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const mini = document.getElementById('mini');
const miniPlay = document.getElementById('miniPlay');
const miniPrev = document.getElementById('miniPrev');
const miniNext = document.getElementById('miniNext');


let playlist = SONGS.slice();
let currentIndex = -1;
const audio = new Audio(); audio.preload='metadata';


function escapeHTML(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }
function initials(name){ return escapeHTML(name.split('.').slice(0,1)[0].split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()); }


function renderLibrary(){
libraryEl.innerHTML = '';
playlist.forEach((t,i)=>{
const el = document.createElement('div'); el.className='song-item';
el.innerHTML = `
<div class="thumb">${initials(t.title)}</div>
<div class="meta"><div class="title">${escapeHTML(t.title)}</div><div class="sub muted">${escapeHTML(t.artist)}</div></div>
<div style="display:flex;gap:8px"><button data-i="${i}" class="btn play-small">▶</button></div>
`;
libraryEl.appendChild(el);
});
countEl.textContent = playlist.length;
}


function playIndex(i){ if(i<0||i>=playlist.length) return; const t = playlist[i]; currentIndex = i; audio.src = t.file; audio.play(); nowCover.style.backgroundImage = `url('${t.cover}')`; nowCover.textContent = ''; nowTitle.textContent = t.title; nowArtist.textContent = t.artist; mini.setAttribute('aria-hidden','false'); updatePlayUI(true); }


function updatePlayUI(isPlaying){ playBtn.textContent = isPlaying? '⏸' : '▶'; miniPlay.textContent = isPlaying? '⏸' : '▶'; }


libraryEl.addEventListener('click', e=>{ const b = e.target.closest('button'); if(!b) return; const i = Number(b.dataset.i); if(!isNaN(i)) playIndex(i); });


playBtn.addEventListener('click', ()=>{ if(!audio.src && playlist.length) playIndex(0); else if(audio.paused) audio.play(); else audio.pause(); });
miniPlay.addEventListener('click', ()=> playBtn.click());
prevBtn.addEventListener('click', ()=>{ if(playlist.length===0) return; const n = (currentIndex-1 + playlist.length)%playlist.length; playIndex(n); });
nextBtn.addEventListener('click', ()=>{ if(playlist.length===0) return; const n = (currentIndex+1)%playlist.length; playIndex(n); });


audio.addEventListener('timeupdate', ()=>{ const pct = audio.currentTime / (audio.duration||1); progressBar.style.width = (pct*100)+'%'; curTime.textContent = formatTime(audio.currentTime); durTime.textContent = formatTime(audio.duration); });


function formatTime(s){ if(!isFinite(s)) return '0:00'; const m = Math.floor(s/60); const sec = Math.floor(s%60); return `${m}:${sec.toString().padStart(2,'0')}` }


vol.addEventListener('input', ()=>{ audio.volume = Number(vol.value); });
progress.addEventListener('click', e=>{ const rect = progress.getBoundingClientRect(); const x = e.clientX - rect.left; const p = x / rect.width; audio.currentTime = (audio.duration||0) * p; });


// shuffle & repeat
let isShuffle = false, isRepeat = false;
shuffleBtn.addEventListener('click', ()=>{ isShuffle = !isShuffle; shuffleBtn.style.opacity = isShuffle?1:0.8; if(isShuffle) shufflePlaylist(); else { playlist = SONGS.slice(); renderLibrary(); }});
repeatBtn.addEventListener('click', ()=>{ isRepeat = !isRepeat; repeatBtn.style.opacity = isRepeat?1:0.8; });


function shufflePlaylist(){ playlist = SONGS.slice().sort(()=>Math.random()-0.5); renderLibrary(); }


// auto next
audio.addEventListener('ended', ()=>{ if(isRepeat) audio.currentTime = 0, audio.play(); else if(isShuffle) { const next = Math.floor(Math.random()*playlist.length); playIndex(next); } else nextBtn.click(); });


// mini controls
miniPrev.addEventListener('click', ()=> prevBtn.click()); miniNext.addEventListener('click', ()=> nextBtn.click());


// init
renderLibrary();


/*
Usage notes:
- Put your files in songs/ and covers in covers/
- Edit SONGS array in assets/script.js to match filenames
- Serve over HTTP (recommended) or open index.html in modern browser (some browsers prevent local audio file access in file://)
*/