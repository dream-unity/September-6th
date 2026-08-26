(() => {
  'use strict';

  const sourceUrl = './visual.js?v=20260826-unity-proportion-2';
  const loading = document.getElementById('loading');

  async function loadSource(cache) {
    const response = await fetch(sourceUrl, { cache });
    if (!response.ok) throw new Error(`Visual engine failed to load: ${response.status}`);
    return response.text();
  }

  function scaleUnity(source) {
    const replacements = [
      [
        'const coreR=unit*0.026*overviewZoom;',
        'const coreR=unit*0.042*overviewZoom;'
      ],
      [
        '[unit*.075,unit*.025,t*.11+overviewRoll],',
        '[unit*.105,unit*.035,t*.11+overviewRoll],'
      ],
      [
        '[unit*.105,unit*.034,-t*.075-overviewRoll*.7],',
        '[unit*.145,unit*.047,-t*.075-overviewRoll*.7],'
      ],
      [
        '[unit*.135,unit*.043,t*.048+1.05]',
        '[unit*.185,unit*.059,t*.048+1.05]'
      ],
      [
        'unityLabel.style.top=`${height*.5+unit*.045}px`;',
        'unityLabel.style.top=`${height*.5+unit*.072}px`;'
      ],
      [
        '      element.style.top=`${point.y-point.r*1.65}px`;',
        "      const labelLift=key==='reality'?1.05:1.65;\n      element.style.top=`${point.y-point.r*labelLift}px`;"
      ]
    ];

    let result = source;
    for (const [before, after] of replacements) {
      if (!result.includes(before)) throw new Error(`Unity scaling anchor not found: ${before}`);
      result = result.replace(before, after);
    }
    return result;
  }

  loadSource('force-cache')
    .catch(() => loadSource('no-store'))
    .then(source => Function(scaleUnity(source))())
    .catch(error => {
      console.error(error);
      loading?.classList.add('hide');
    });
})();
