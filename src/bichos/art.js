/*
 * Bichos do Leonardo (fase3/bicho-*.svg), com as cores trocadas por classes (tema no CSS) e as pernas
 * divididas em dois pares (passo alternado). Âncora (0,0 do "a") = pés, para pousar/pendurar.
 * vb = viewBox original; a = âncora em unidades da arte.
 */
export const ART = {
  capivara: {
    vb: [-50, -45, 105, 60], a: [0, 8],
    svg: '<path class="b" d="M-40 0Q-44-34-10-36Q20-40 34-28Q46-26 48-16Q48-6 36-4L30 0Z"/><rect class="olho" x="34" y="-27" width="3.4" height="3.4" rx=".8"/><circle class="b" cx="26" cy="-36" r="4"/>'
      + '<g class="bs pernas-a" stroke-width="7" stroke-linecap="round"><path d="M-28-4v12M12-4v12"/></g><g class="bs pernas-b" stroke-width="7" stroke-linecap="round"><path d="M-14-4v12M26-4v12"/></g>',
  },
  passaro: {
    vb: [-35, -20, 65, 30], a: [2, 8],
    svg: '<path class="ave asa" d="M0 0Q-14-16-30-10Q-14-6 0 0Z"/><ellipse class="ave" cx="2" cy="2" rx="14" ry="6"/><circle class="ave" cx="16" cy="-1" r="5"/><path class="olho" d="M20-1l6 1.5-6 1.5z"/><rect class="olho" x="16.5" y="-2.5" width="2" height="2"/>',
  },
  sagui: {
    vb: [-60, -60, 110, 75], a: [0, 8],
    svg: '<path class="bs cauda" d="M-18-10q-40 10-36-30q4-24 22-14" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse class="b" cy="-14" rx="20" ry="13"/><circle class="b" cx="22" cy="-30" r="11"/>'
      + '<circle class="orelha" cx="16" cy="-40" r="5"/><circle class="orelha" cx="29" cy="-40" r="5"/><rect class="olho" x="24" y="-33" width="3.4" height="3.4" rx=".8"/>'
      + '<g class="bs pernas-a" stroke-width="5" stroke-linecap="round"><path d="M-10-4l-2 12"/></g><g class="bs pernas-b" stroke-width="5" stroke-linecap="round"><path d="M12-4l2 12"/></g>',
  },
};
