// De vier meldcategorieen van het echte systeem, met een eigen getekend icoon
// (viewBox 0 0 24 24, lijnwerk), gedeeld door de meldflow en het dashboard.
export const CATEGORIEEN = [
  {
    id: 'vol',
    naam: 'Container vol',
    icoon: '<path d="M6 9h12l-1 11H7z"/><path d="M5 9h14"/><path d="M8 9c0-3 2-5 4-5s4 2 4 5"/><path d="M10 13h4M10 16h4"/>',
  },
  {
    id: 'bijgeplaatst',
    naam: 'Bijgeplaatst afval',
    icoon: '<path d="M4 8h9v12H4z"/><path d="M3 8h11"/><path d="M17 20c-2.2 0-3-1.2-3-3s1.3-3.5 3-4.5c1.7 1 3 2.7 3 4.5s-.8 3-3 3z"/><path d="M16 12l1-1.6 1 1.6"/>',
  },
  {
    id: 'defect',
    naam: 'Defect of kapot',
    icoon: '<path d="M7 3h10v18H7z"/><path d="M10 7h4"/><path d="M12 11l-2 3 3 1-2 3"/>',
  },
  {
    id: 'overig',
    naam: 'Stank, ongedierte of overig',
    icoon: '<path d="M7 20c-1.5-2 1.5-4 0-6s1.5-4 0-6"/><path d="M12 20c-1.5-2 1.5-4 0-6s1.5-4 0-6"/><path d="M17 20c-1.5-2 1.5-4 0-6s1.5-4 0-6"/>',
  },
];

export const icoonSvg = (icoon, klasse = 'h-5 w-5') =>
  `<svg class="${klasse}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icoon}</svg>`;
