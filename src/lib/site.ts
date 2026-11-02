// src/lib/site.ts  (sitefront-seo)
// EÉN bron voor bedrijfsgegevens (NAP). Footer, contactpagina, JSON-LD, robots.txt en
// llms.txt lezen allemaal hieruit, zodat naam/adres/telefoon nooit uit elkaar lopen.
// De gegevens zelf staan in seo.config.json in de root van het project.
// Lege velden in de config betekenen "onbekend": op de site toont show() dan een
// [[AANLEVEREN]]-markering, schema en llms.txt laten het veld weg.
import config from '../../seo.config.json';

type Hours = { days: string[]; opens: string; closes: string };
type Special = { date: string; opens?: string; closes?: string; closed?: boolean };

export const seo = config as typeof config & { base?: string; mode?: string };
export const business = seo.business as typeof seo.business & {
  openingHours: Hours[];
  specialHours?: Special[];
  areaServed: string[];
  sameAs: string[];
  extra?: Record<string, unknown>;
};

/** Demomodus (voorstel-site): noindex, geen canonical, geen JSON-LD. */
export const isDemo =
  import.meta.env.PUBLIC_VOORSTEL === '1' || seo.mode === 'demo' ||
  // afvalmeldpunt: de preview op github.io (PUBLIC_PREVIEW=1) mag ook niet in Google
  import.meta.env.PUBLIC_PREVIEW === '1';

/** Site-URL zonder slash aan het eind, bijv. https://www.klant.nl */
export const siteUrl = seo.site.replace(/\/$/, '');

/** base-pad zonder slash aan het eind ('' als er geen base is) */
export const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Pad naar absolute URL, met base en een trailing slash voor pagina's.
 *  Query (?..) en anker (#..) blijven intact; bestanden (.jpg, .webmanifest, ...) krijgen geen slash. */
export function absUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  const m = path.match(/^([^?#]*)(.*)$/) as RegExpMatchArray;
  let p = m[1] || '/';
  if (!p.startsWith('/')) p = `/${p}`;
  if (basePath && !p.startsWith(basePath + '/') && p !== basePath) p = basePath + p;
  if (!/\.[a-z0-9]+$/i.test(p) && !p.endsWith('/')) p += '/';
  return siteUrl + p + m[2];
}

/** Pad zonder base, bijv. /tuinaanleg/ (voor vergelijken met ignorePaths) */
export function pathWithoutBase(pathname: string): string {
  const p = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  return p || '/';
}

/** Staat dit pad in ignorePaths (= noindex en niet in de sitemap)? Eén bron voor beide. */
export function isIgnored(pathname: string): boolean {
  const p = pathWithoutBase(pathname);
  return ((seo as { ignorePaths?: string[] }).ignorePaths ?? []).some((i) => i.replace(/\/?$/, '/') === p);
}

/** Pad voor een interne link (met base en slash), bijv. <a href={href('/contact')}> */
export function href(path = '/'): string {
  const u = new URL(absUrl(path));
  return u.pathname + u.search + u.hash;
}

/** Waarde tonen op de site, of een duidelijke markering als die nog ontbreekt. */
export function show(value: string | undefined | null, wat: string): string {
  return value && String(value).trim() ? String(value) : `[[AANLEVEREN: ${wat}]]`;
}

const tel = (business.phone || '').replace(/[^\d+]/g, '');
/** tel:-link in internationaal formaat: tel:+31781234567 (leeg als er geen nummer is) */
export const telHref = tel ? `tel:${tel}` : '';

/** Leesbaar telefoonnummer, bijv. 078 123 45 67 */
export const phoneDisplay = show(business.phoneDisplay || business.phone, 'telefoonnummer');

/** WhatsApp-link (alleen als er een nummer is) */
export const whatsappHref = business.whatsapp
  ? `https://wa.me/${business.whatsapp.replace(/\D/g, '').replace(/^0/, '31')}`
  : '';

/** Adres als één regel, of alleen de plaats als het adres verborgen is (servicegebied-bedrijf). */
export const addressLine = business.showAddress
  ? [business.street, [business.postalCode, business.city].filter(Boolean).join(' ')].filter(Boolean).join(', ') || show('', 'adres')
  : show(business.city, 'plaats');

const dagNL: Record<string, string> = {
  Monday: 'maandag', Tuesday: 'dinsdag', Wednesday: 'woensdag', Thursday: 'donderdag',
  Friday: 'vrijdag', Saturday: 'zaterdag', Sunday: 'zondag',
};

/** Openingstijden als leesbare regels voor op de site: "maandag t/m vrijdag 08:00 - 17:00" */
export function openingHoursNL(): string[] {
  if (!business.openingHours?.length) return [show('', 'openingstijden')];
  const order = Object.keys(dagNL);
  return business.openingHours.map((h) => {
    const d = h.days.map((x) => dagNL[x] ?? x);
    const idx = h.days.map((x) => order.indexOf(x));
    const consecutive = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
    const dagen = d.length > 2 && consecutive
      ? `${d[0]} t/m ${d[d.length - 1]}`
      : d.length > 1 ? `${d.slice(0, -1).join(', ')} en ${d[d.length - 1]}` : d[0];
    return `${dagen} ${h.opens} - ${h.closes}`;
  });
}

/** Komende speciale openingstijden (feestdagen/vakantie) als leesbare regels. */
export function specialHoursNL(today = new Date()): string[] {
  const iso = today.toISOString().slice(0, 10);
  return (business.specialHours || [])
    .filter((s) => s.date >= iso)
    .map((s) => {
      const d = new Date(`${s.date}T12:00:00`).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
      return s.closed ? `${d} gesloten` : `${d} ${s.opens} - ${s.closes}`;
    });
}
