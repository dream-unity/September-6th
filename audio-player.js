(() => {
  'use strict';

  const SOURCES = [
    'https://dream-unity.github.io/one/assets/audio/dream-maker-eye.mp3',
    'https://raw.githubusercontent.com/dream-unity/one/main/assets/audio/dream-maker-eye.mp3'
  ];

  const style = document.createElement('style');
  style.textContent = `
    .du-music-control{position:fixed;z-index:9999;top:max(18px,env(safe-area-inset-top));right:max(18px,env(safe-area-inset-right));display:flex;align-items:center;gap:9px;padding:9px 12px 9px 10px;border:1px solid rgba(43,70,84,.2);border-radius:999px;background:rgba(244,250,252,.58);color:rgba(31,49,59,.84);font:500 10px/1 "Avenir Next","Helvetica Neue",Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 5px 22px rgba(64,92,108,.09),inset 0 1px 0 rgba(255,255,255,.6);transition:.2s ease}
    .du-music-control:hover{background:rgba(250,253,254,.75);border-color:rgba(43,70,84,.3);color:rgba(24,42,52,.96)}
    .du-music-control:active{transform:scale(.97)}
    .du-music-control:focus-visible{outline:2px solid rgba(53,89,108,.38);outline-offset:3px}
    .du-music-icon{position:relative;width:20px;height:20px;display:grid;place-items:center;border:1px solid rgba(42,68,81,.22);border-radius:50%;background:rgba(255,255,255,.28)}
    .du-music-icon::before{content:"";width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-left:6px solid rgba(31,49,59,.8);margin-left:2px}
    .du-music-control[data-playing="true"] .du-music-icon::before{width:6px;height:8px;border:0;border-left:2px solid rgba(31,49,59,.8);border-right:2px solid rgba(31,49,59,.8);margin-left:0}
    .du-music-dot{width:5px;height:5px;border-radius:50%;background:rgba(74,112,132,.38)}
    .du-music-control[data-playing="true"] .du-music-dot{background:#6c98ad;box-shadow:0 0 0 4px rgba(108,152,173,.12)}
    @media(max-width:700px){.du-music-control{top:max(11px,env(safe-area-inset-top));right:max(11px,env(safe-area-inset-right));padding:8px 10px;font-size:9px;letter-spacing:.12em}}
  `;
  document.head.appendChild(style);

  const audio = document.createElement('audio');
  audio.id = 'dreamUnitySoundtrack';
  audio.autoplay = true;
  audio.loop = true;
  audio.preload = 'auto';
  audio.playsInline = true;
  audio.volume = 0.92;
  audio.src = SOURCES[0];
  document.body.appendChild(audio);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'du-music-control';
  button.dataset.playing = 'false';
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', 'Play Dream Unity music');
  button.innerHTML = '<span class="du-music-icon" aria-hidden="true"></span><span class="du-music-label">Play Music</span><span class="du-music-dot" aria-hidden="true"></span>';
  document.body.appendChild(button);

  const label = button.querySelector('.du-music-label');
  let sourceIndex = 0;
  let manualPause = false;
  let switchingSource = false;

  function render() {
    const playing = !audio.paused && !audio.ended && audio.readyState > 1;
    button.dataset.playing = String(playing);
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Pause Dream Unity music' : 'Play Dream Unity music');
    label.textContent = playing ? 'Pause Music' : 'Play Music';
  }

  async function tryPlay() {
    if (manualPause) return false;
    try {
      audio.muted = false;
      await audio.play();
      render();
      return true;
    } catch (_) {
      render();
      return false;
    }
  }

  function useNextSource() {
    if (switchingSource || sourceIndex >= SOURCES.length - 1) return;
    switchingSource = true;
    sourceIndex += 1;
    audio.src = SOURCES[sourceIndex];
    audio.load();
    switchingSource = false;
    tryPlay();
  }

  button.addEventListener('click', async () => {
    if (audio.paused) {
      manualPause = false;
      await tryPlay();
    } else {
      manualPause = true;
      audio.pause();
      render();
    }
  });

  audio.addEventListener('error', useNextSource);
  ['playing','play','pause','ended','loadeddata','canplay','waiting','stalled'].forEach(event => audio.addEventListener(event, render));

  audio.load();
  tryPlay();
  window.addEventListener('load', tryPlay, { once: true });
  window.addEventListener('pageshow', tryPlay);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !manualPause) tryPlay();
  });

  const unlock = () => {
    if (!manualPause) tryPlay();
  };
  ['pointerdown','touchstart','keydown'].forEach(type => window.addEventListener(type, unlock, { once: true, capture: true }));

  render();
})();
