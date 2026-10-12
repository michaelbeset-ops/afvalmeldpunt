// Alle bedrijfsgegevens op één plek: footer, privacyverklaring, contactpagina en JSON-LD lezen hier.
export const BEDRIJF = {
  naam: 'Sitefront',
  email: 'info@sitefront.nl',
  kvk: '42057398',
  website: 'https://www.sitefront.nl',
};
// Web3Forms-key voor het demoformulier. Leeg: het formulier opent dan een kant-en-klare mail.
export const WEB3FORMS_KEY = '';
export const kvkBekend = !BEDRIJF.kvk.includes('AANLEVEREN');
