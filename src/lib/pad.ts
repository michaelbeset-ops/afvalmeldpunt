// Interne links via de base, zodat dezelfde site werkt op afvalmeldpunt.nl (root) en als
// preview in een submap op github.io (/afvalmeldpunt/).
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const pad = (p: string) => base + p;
export const preview = import.meta.env.PUBLIC_PREVIEW === '1';
