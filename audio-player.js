(() => {
  'use strict';

  const SOURCES = [
    'https://dream-unity.github.io/one/assets/audio/dream-maker-eye.mp3',
    'https://raw.githubusercontent.com/dream-unity/one/main/assets/audio/dream-maker-eye.mp3'
  ];

  const style = document.createElement('style');
  style.textContent = `
    .poster{filter:brightness(1.045) saturate(.92)}
    .du-cinematic-lift{position:fixed;z-index:3;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(218,239,249,.12) 0%,rgba(231,245,251,.15) 47%,rgba(248,252,253,.18) 100%),radial-gradient(ellipse at 50% 64%,rgba(255,250,236,.08),transparent 42%);mix-blend-mode:screen}
    .du-bottom-cluster{position:fixed;z-index:9998;left:50%;bottom:max(28px,calc(env(safe-area-inset-bottom) + 14px));transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:11px;width:max-content;max-width:94vw;pointer-events:none}
    .du-bottom-cluster .brand{position:static!important;left:auto!important;bottom:auto!important;transform:none!important;margin:0!important;pointer-events:none}
    .du-bottom-cluster .brand span{transform:translateX(.25em)!important}
    .du-music-control{position:static;z-index:9999;display:flex;align-items:center;gap:9px;padding:9px 12px 9px 10px;border:1px solid rgba(56,86,101,.17);border-radius:999px;background:rgba(247,252,254,.62);color:rgba(39,61,72,.82);font:500 10px/1 "Avenir Next","Helvetica Neue",Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;pointer-events:auto;backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px);box-shadow:0 5px 22px rgba(70,103,120,.07),inset 0 1px 0 rgba(255,255,255,.72);transition:background .2s ease,border-color .2s ease,color .2s ease,transform .16s ease}
    .du-music-control:hover{background:rgba(252,254,255,.80);border-color:rgba(49,81,97,.25);color:rgba(29,51,63,.94)}
    .du-music-control:active{transform:scale(.97)}
    .du-music-control:focus-visible{outline:2px solid rgba(64,105,125,.32);outline-offset:3px}
    .du-music-icon{position:relative;width:20px;height:20px;display:grid;place-items:center;border:1px solid rgba(51,80,94,.19);border-radius:50%;background:rgba(255,255,255,.32)}
    .du-music-icon::before{content:"";width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-left:6px solid rgba(39,61,72,.78);margin-left:2px}
    .du-music-control[data-playing="true"] .du-music-icon::before{width:6px;height:8px;border:0;border-left:2px solid rgba(39,61,72,.78);border-right:2px solid rgba(39,61,72,.78);margin-left:0}
    .du-music-dot{width:5px;height:5px;border-radius:50%;background:rgba(91,137,158,.34)}
    .du-music-control[data-playing="true"] .du-music-dot{background:#78aabd;box-shadow:0 0 0 4px rgba(120,170,189,.12)}
    @media(max-width:700px){.du-bottom-cluster{bottom:max(14px,calc(env(safe-area-inset-bottom) + 8px));gap:9px}.du-music-control{padding:8px 10px;font-size:9px;letter-spacing:.12em}}
    @media(max-height:620px){.du-bottom-cluster{bottom:max(10px,env(safe-area-inset-bottom));gap:7px}.du-music-control{padding:7px 10px}}
  `;
  document.head.appendChild(style);

  const theme = document.querySelector('meta[name="theme-color"]');
  if (theme) theme.setAttribute('content', '#cadfe9');
  document.documentElement.style.background = '#cadfe9';
  document.body.style.background = '#cadfe9';

  const lift = document.createElement('div');
  lift.className = 'du-cinematic-lift';
  lift.setAttribute('aria-hidden', 'true');
  document.body.appendChild(lift);

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

  const cluster = document.createElement('div');
  cluster.className = 'du-bottom-cluster';
  const brand = document.querySelector('.brand');
  document.body.appendChild(cluster);
  if (brand) cluster.appendChild(brand);
  cluster.appendChild(button);

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
