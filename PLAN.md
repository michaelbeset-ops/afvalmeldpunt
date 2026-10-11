# afvalmeldpunt.nl, promotiesite (eigen product Sitefront)

## Stand
Checkpoint 1, ronde 2 (na feedback Michael): logo, QR/plaatje, header en hero.
Niet gedeployd, niet gecommit.

## Logo-idee (gekozen: "QR-bak met open klep")
Een QR-hoekmarkering die een afvalbak is met de klep open: hier kun je iets kwijt, en de bak
tilt als het ware zijn hoedje. Het oog is het blokje uit een QR-hoek, dus midden in de QR rijmt het merk
op de drie echte hoekmarkeringen. Afgevallen: zuil als uitroepteken (lijkt brandblusser/batterij),
zuil met gezicht (spookje), QR-punt (generieke QR-hoek), pin-zuil (kaart-icoon), glimlach in vierkant
(smiley-doos), en de klep mét handgreep (te dicht bij het "verwijderen"-prullenbakicoon).
Overzicht: shots/logo-concepten.png, gekozen versie: shots/logo-overzicht.png.

## Kleur (familie b-advice, eigen nuance)
Inkt #142019 (groen-getint), grond #1b2822, tekst #44554b, bosgroen #1c6a43 (accent/knoppen),
fris #3f9f64 (oog in het logo, details), papier #f9faf9. Aluminium blijft koel grijs.
Fonts: Schibsted Grotesk 800 (koppen), Public Sans (tekst).

## Onderzoek: zo zien NL ondergrondse containers eruit
- Vier basisdelen: betonnen put, stalen binnenbak, veiligheidsvloer en inworpzuil. Een 5 m3-put is
  ca. 1,95 x 1,95 x 2,6 m buitenmaat. Bron: plaatsingsinstructie ondergrondse containers (SSI Schäfer),
  https://oss.nl/to2/Plaatsingsinstructie-ondergrondse-containers-01022008.htm
- Veiligheidsplatform: thermisch verzinkt traanplaat 4-5 mm, licht afwaterend (2-4%), stroef, gelijk
  met de bestrating. Inworpzuil: verduurzaamd plaatstaal, gepoedercoat, vandaalbestendig, NEN-EN 13071.
  Bron: gemeentelijke bestekken op TenderNed, o.a.
  https://www.tenderned.nl/papi/tenderned-rs-tns/v2/publicaties/283682/documenten/8222063/content
- Kleur per afvalsoort is niet landelijk vastgelegd: vaak een antraciet zuil met gekleurde sticker of
  wrap (bijv. blauw papier, grijs rest). Bron: raadsantwoord Roosendaal,
  https://raad.roosendaal.nl/Documenten/152-2022-Beantwoording-raadsvragen-PvdA-Voortgang-pilot-afvalcontainers.pdf
- Restafval vaak met afvalpas (pasjeslezer op de zuil); sommige gemeenten zijn ermee gestopt.
  Bron: https://www.utrecht.nl/nieuws/nieuwsbericht-gemeente-utrecht/ondergrondse-containers-zonder-pasje
- Beeldreferentie (alleen bekeken, niet gebruikt): Wikimedia Commons, o.a. "Ondergrondse afvalcontainer.jpg"
  (Amsterdam, Marion Golsteijn, CC BY-SA 4.0): antraciet zuil, liggende trommel bovenop, pasjeslezer
  rechts, containernummer. https://commons.wikimedia.org/wiki/File:Ondergrondse_afvalcontainer.jpg
  En "Ondergrondse restafvalcontainers.jpg" (rij zuilen op eigen platform in de bestrating).
- Vertaald naar de tekening: rij van drie zuilen (papier blauw, PMD oranje, rest grijs) met gekleurde
  band en sticker, trommel met greep, pasjeslezer met lampje, traanplaat-platform, en de bakken in
  doorsnede met papier, los PMD en zakken. Geen foto's van fabrikanten gebruikt.

## Bestanden
- src/lib/merk.mjs: beeldmerk (gedeeld door site en scripts)
- src/lib/qr.mjs: QR-generator (foutcorrectie H, 9x9 uitsparing voor het logo)
- tools/maak-logo.mjs, tools/logo-concepten.mjs, tools/logo-blad.mjs: logo's en overzichten
- tools/maak-qr.mjs (`npm run qr`): QR-bestanden + decodetest met jsQR en ZXing
- tools/shots.mjs: zelfreview-screenshots + scrollbreedte + QR-test op het gerenderde plaatje
- /plaatje: werkpagina met het plaatje groot (noindex, niet in sitemap)

## Nog aanleveren / open
- [[AANLEVEREN: e-mailadres voor demo-aanvragen]] en Web3Forms-key (formulier komt na de hero)
- Ankers #demo en #melden bestaan nog niet (secties volgen na akkoord)
- og-afbeelding

## Ronde 3 (na akkoord op logo, plaatje en richting)
- Zuilen opnieuw: rechte, slanke romp (ca. 1:2,3), afgeronde kap uit één stuk, trommel met greep op
  borsthoogte, pasjeslezer, fractie-wrap onderaan + sticker, voet op traanplaat-platform. Gevels in lijnwerk
  erachter, links zacht weglopend.
- Hele site gebouwd: Hoe het werkt (route met drie haltes), Meldflow (klikbare telefoon), Dashboard
  (nagebouwd, voorbeeldgegevens, klikbaar), Voor wie, Het plaatje, Iets melden (#melden), Demo (#demo,
  Web3Forms), footer, /privacy. Geen cookies, geen JSON-LD (geen echte bedrijfsgegevens).
- Lighthouse mobiel (tools/lh.mjs): 100/100/100/100 op / en /privacy.
- og.jpg via tools/maak-og.mjs.

## Vulgraadsensor (toegevoegd 10-10-2026)
- Eigen sectie #sensor tussen Meldflow en Dashboard: eerst de bewoner, dan de container zelf, daarna
  komt alles samen in het dashboard. Op de site staat hij als optie ("Als optie leveren we...").
- [[AANLEVEREN: standaard of optie?]] (Michael zei "we bieden een vulgraadsensor aan")
- [[AANLEVEREN: technische gegevens vulgraadsensor]] (techniek, voeding, meldmoment): bewust niets verzonnen.
- Dashboard: voorbeeldmelding "Bijna vol" met label "Sensor" naast "Bewoner"-meldingen bij container 0123.

## SEO, privacy en cookies (11-10-2026)
- Cookiemelding (src/components/Cookiemelding.astro): de site plaatst alleen een functioneel cookie
  (`afvalmeldpunt_cookiekeuze`, 12 maanden), dus een korte mededeling met "Begrepen". Komt er later
  analytics of een embed bij: categorie in `optioneel` zetten en het script als
  `type="text/plain" data-cookie-categorie="..."` laden, dan verschijnen accepteren/weigeren/instellingen
  vanzelf. "Cookie-instellingen" in de footer opent de melding opnieuw. Test: tools/test-cookies.mjs.
- Privacyverklaring uitgebreid: grondslag, verwerkers (Web3Forms, GitHub), doorgifte buiten de EU,
  beveiliging, cookietabel, alle AVG-rechten, wijzigingen, inhoudsopgave rechts op desktop.
- SEO: JSON-LD (WebSite + WebPage, alleen vaststaande gegevens), og:site_name, og:image:alt, twitter-tags,
  apple-touch-icon, 404-pagina (noindex, niet in sitemap), interne links naar /privacy/ (geen redirect).
- Lighthouse mobiel: / en /privacy/ 100/100/100/100.
- Nieuw aan te leveren: [[AANLEVEREN: vestigingsadres]] voor de privacyverklaring.
