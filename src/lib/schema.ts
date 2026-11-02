// src/lib/schema.ts
// JSON-LD-bouwstenen. Alles verwijst naar één entiteit (#business) via @id, zodat Google
// en AI-systemen één bedrijf zien met diensten, pagina's en profielen eromheen.
// Regel: alleen markeren wat ook zichtbaar op de pagina staat, en alleen echte gegevens.
import { seo, business, siteUrl, absUrl } from './site';

const LANG = (seo as { language?: string }).language || 'nl-NL';

type Node = Record<string, unknown>;
const id = (frag: string) => `${siteUrl}/#${frag}`;
const clean = (o: Node): Node =>
  Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== '' && v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)),
  );

export const BUSINESS_ID = id('business');
export const WEBSITE_ID = id('website');

/** De entiteit: LocalBusiness-subtype (of Organization voor niet-lokale bedrijven). */
export function businessNode(extra: Node = {}): Node {
  const b = business;
  const sameAs = [...(b.sameAs || []), b.gbpUrl].filter(Boolean);
  const identifier = b.kvk
    ? [{ '@type': 'PropertyValue', propertyID: 'KvK', value: b.kvk }]
    : undefined;
  const address = b.showAddress
    ? clean({
        '@type': 'PostalAddress',
        streetAddress: b.street,
        postalCode: b.postalCode,
        addressLocality: b.city,
        addressRegion: b.region,
        addressCountry: b.country || 'NL',
      })
    : clean({ '@type': 'PostalAddress', addressLocality: b.city, addressRegion: b.region, addressCountry: b.country || 'NL' });

  return clean({
    '@type': b.schemaType || 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: b.name,
    legalName: b.legalName,
    description: b.description,
    url: absUrl('/'),
    logo: b.logo ? absUrl(b.logo) : undefined,
    image: b.image ? absUrl(b.image) : undefined,
    telephone: b.phone,
    email: b.email,
    address,
    geo: b.showAddress && b.geo ? { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng } : undefined,
    openingHoursSpecification: [
      ...(b.openingHours || []).map((o) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: o.days,
        opens: o.opens,
        closes: o.closes,
      })),
      // Speciale tijden (feestdagen/vakantie). Gesloten = opens en closes 00:00 (Google-conventie).
      // Statische site: na een rebuild vallen verlopen datums vanzelf weg.
      ...(b.specialHours || [])
        .filter((s) => s.date >= new Date().toISOString().slice(0, 10))
        .map((s) => ({
          '@type': 'OpeningHoursSpecification',
          validFrom: s.date,
          validThrough: s.date,
          opens: s.closed ? '00:00' : s.opens,
          closes: s.closed ? '00:00' : s.closes,
        })),
    ],
    areaServed: (b.areaServed || []).map((name) => ({ '@type': 'City', name })),
    priceRange: b.priceRange,
    foundingDate: b.foundingYear,
    founder: b.founder ? { '@type': 'Person', name: b.founder } : undefined,
    vatID: b.vatID,
    identifier,
    sameAs,
    // Bewust GEEN aggregateRating/review op het eigen bedrijf: Google toont daar geen
    // sterren voor (self-serving reviews) en het kan als misleidend worden gezien.
    ...(b.extra || {}),
    ...extra,
  });
}

export function websiteNode(): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absUrl('/'),
    name: business.name,
    inLanguage: LANG,
    publisher: { '@id': BUSINESS_ID },
  };
}

/** Per pagina: koppelt de pagina aan site en bedrijf. */
export function webPageNode(p: { path: string; title: string; description?: string; type?: string; image?: string; dateModified?: string }): Node {
  const url = absUrl(p.path);
  return clean({
    '@type': p.type || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: p.title,
    description: p.description,
    inLanguage: LANG,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': BUSINESS_ID },
    primaryImageOfPage: p.image ? { '@type': 'ImageObject', url: absUrl(p.image) } : undefined,
    dateModified: p.dateModified,
  });
}

export function breadcrumbNode(items: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

/** Dienstpagina. areaServed standaard het werkgebied uit de config. */
export function serviceNode(s: { name: string; path: string; description: string; serviceType?: string; areaServed?: string[]; offers?: { price?: string; minPrice?: string; maxPrice?: string; unitText?: string } }): Node {
  const offers = s.offers
    ? clean({
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: s.offers.price,
        priceSpecification: s.offers.minPrice || s.offers.maxPrice
          ? clean({ '@type': 'PriceSpecification', priceCurrency: 'EUR', minPrice: s.offers.minPrice, maxPrice: s.offers.maxPrice, unitText: s.offers.unitText })
          : undefined,
      })
    : undefined;
  return clean({
    '@type': 'Service',
    '@id': `${absUrl(s.path)}#service`,
    name: s.name,
    serviceType: s.serviceType || s.name,
    description: s.description,
    url: absUrl(s.path),
    provider: { '@id': BUSINESS_ID },
    areaServed: (s.areaServed || business.areaServed || []).map((name) => ({ '@type': 'City', name })),
    offers,
  });
}

/** Blogartikel / kennisbank. Datums moeten kloppen met wat zichtbaar op de pagina staat. */
export function articleNode(a: { path: string; title: string; description?: string; image: string; datePublished: string; dateModified?: string; author: string; authorUrl?: string }): Node {
  return clean({
    '@type': 'BlogPosting',
    '@id': `${absUrl(a.path)}#article`,
    headline: a.title,
    description: a.description,
    image: absUrl(a.image),
    datePublished: a.datePublished,
    dateModified: a.dateModified || a.datePublished,
    author: clean({ '@type': 'Person', name: a.author, url: a.authorUrl }),
    publisher: { '@id': BUSINESS_ID },
    mainEntityOfPage: { '@id': `${absUrl(a.path)}#webpage` },
    inLanguage: LANG,
  });
}

/** Zichtbare FAQ. Geen rich result meer (sinds mei 2026). Optioneel: de zichtbare FAQ zelf is wat telt;
 *  markup schaadt niet en beschrijft de pagina netjes. Valideren met validator.schema.org (niet meer in de Rich Results Test). */
export function faqNode(items: { q: string; a: string }[]): Node {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

/** Product (webshop/boutique). Alleen met echte prijs en voorraad. */
export function productNode(p: { path: string; name: string; description: string; images: string[]; sku?: string; brand?: string; price: string; availability?: 'InStock' | 'OutOfStock' | 'PreOrder'; condition?: 'NewCondition' | 'UsedCondition' }): Node {
  return clean({
    '@type': 'Product',
    '@id': `${absUrl(p.path)}#product`,
    name: p.name,
    description: p.description,
    image: p.images.map((i) => absUrl(i)),
    sku: p.sku,
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    offers: {
      '@type': 'Offer',
      url: absUrl(p.path),
      priceCurrency: 'EUR',
      price: p.price,
      availability: `https://schema.org/${p.availability || 'InStock'}`,
      itemCondition: `https://schema.org/${p.condition || 'NewCondition'}`,
      seller: { '@id': BUSINESS_ID },
    },
  });
}

/** Evenement (horeca, winkel-events). Alleen echte data en locatie. */
export function eventNode(e: { path: string; name: string; description: string; startDate: string; endDate?: string; image?: string; price?: string }): Node {
  return clean({
    '@type': 'Event',
    name: e.name,
    description: e.description,
    startDate: e.startDate,
    endDate: e.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@id': BUSINESS_ID },
    organizer: { '@id': BUSINESS_ID },
    image: e.image ? absUrl(e.image) : undefined,
    url: absUrl(e.path),
    offers: e.price ? { '@type': 'Offer', price: e.price, priceCurrency: 'EUR', url: absUrl(e.path), availability: 'https://schema.org/InStock' } : undefined,
  });
}

/** Persoon achter het bedrijf (over-ons-pagina): sterk voor E-E-A-T en entiteitsherkenning. */
export function personNode(p: { name: string; jobTitle?: string; image?: string; sameAs?: string[]; knowsAbout?: string[] }): Node {
  return clean({
    '@type': 'Person',
    '@id': id(`person-${p.name.toLowerCase().replace(/\s+/g, '-')}`),
    name: p.name,
    jobTitle: p.jobTitle,
    image: p.image ? absUrl(p.image) : undefined,
    worksFor: { '@id': BUSINESS_ID },
    sameAs: p.sameAs,
    knowsAbout: p.knowsAbout,
  });
}
