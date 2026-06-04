# SpeedTravel — Project Overview

## C'est quoi ?
SaaS de voyage budget : l'user entre un budget, on trouve le meilleur combo vol + hôtel qui rentre dedans.
Critère mandatory : budget. Optionnel : dates, ville de départ, pays destination (chips multi-select).

## Stack
- **Framework** : Next.js 16 (App Router) + TypeScript
- **Style** : Tailwind CSS dark theme
- **API** : SerpAPI (Google Flights + Google Hotels)
- **Déploiement** : Vercel (projet nommé "fasttravel" sur Vercel)
- **Repo** : github.com/zy0be/FastTravel

## URLs
- **Production** : speedtravel.app (+ fasttravel-mu.vercel.app)
- **Mail pro** : contact@speedtravel.app → contact.speedtravel@gmail.com (via ImprovMX ✅ actif)

## Architecture
```
src/
├── app/
│   ├── page.tsx              ← Page principale (search + résultats)
│   ├── layout.tsx            ← Layout + Travelpayouts Drive script
│   ├── privacy/page.tsx      ← Privacy Policy (GDPR)
│   ├── legal/page.tsx        ← Mentions légales
│   └── api/search/route.ts   ← API POST /api/search (logique core)
├── components/
│   ├── SearchForm.tsx         ← Budget + chips pays destination + dates + origine
│   └── ComboCard.tsx          ← Card résultat vol + hôtel (photo, logo, rating, boutons)
├── lib/
│   └── amadeus.ts            ← Placeholder vide (remplacé par SerpAPI)
└── types/
    └── travel.ts             ← Types SearchParams, TravelCombo, FlightOffer, HotelOffer
```

## Flow de recherche
1. User entre budget + optionnel : dates, ville départ, chips pays destination
2. API route cherche vols via SerpAPI Google Flights (20 destinations, filtrées par pays si sélectionné)
3. Pour chaque vol dans le budget → cherche hôtels via SerpAPI Google Hotels
4. Filtre les combos vol + hôtel ≤ budget
5. Trie par prix et retourne max 20 résultats

## Destinations disponibles (POPULAR_DESTINATIONS dans route.ts)
BCN/Spain, LIS/Portugal, PRG/Czech, BUD/Hungary, ATH/Greece, WAW/Poland,
VIE/Austria, DUB/Ireland, CPH/Denmark, BKK/Thailand, DXB/UAE, IST/Turkey,
MXP/Italy, FCO/Italy, AMS/Netherlands, MAD/Spain, CDG/France, LYS/France,
SKG/Greece, OPO/Portugal

## Variables d'environnement
```
SERPAPI_KEY=352d52387e7e77bfb71d407d6e340df807b3b4ffb16c1a3dde85013e329d62b4
BOOKING_AFFILIATE_ID=101734199       ← CJ Affiliate PID
SKYSCANNER_AFFILIATE_ID=TP-522297    ← Travelpayouts marker
```
Toutes configurées sur Vercel production via `vercel env add`.

## Monétisation
| Source | Système | Commission | Statut |
|--------|---------|------------|--------|
| Hôtels | Google Hotels direct link + Travelpayouts Drive auto | variable | ✅ actif |
| Hôtels | CJ Affiliate → Booking.com FR (ID: 4297313) | 4% | ⏳ candidature soumise |
| Vols   | Travelpayouts Drive (script auto, marker 522297) | ~1-2% | ✅ actif |

### État liens hôtels (IMPORTANT)
- **Actuellement** : utilise `hotel.link` de SerpAPI (lien direct Google Hotels) — Travelpayouts Drive gère l'affiliation automatiquement
- **Quand Booking.com FR approuvé** : réactiver format CJ dans `buildHotelUrl` → `https://www.anrdoezrs.net/click-101734199-4297313?url={BOOKING_URL}`
- Le code CJ est commenté dans `src/app/api/search/route.ts` fonction `buildHotelUrl`

### CJ Affiliate — Booking.com FR
- PID : 101734199
- Advertiser ID Booking.com FR : 4297313
- Statut : **candidature soumise** (soumise ~juin 2026, review manuelle)
- Si refusé → alternative : affiliate.booking.com (programme direct, plus accessible)

### Travelpayouts
- Marker : 522297
- Script : `https://emrldtp.com/NTIyMjk3.js?t=522297` intégré dans layout.tsx
- Drive actif sur speedtravel.app ✅
- Programmes sélectionnés : Kiwi.com (vols), Booking.com (hôtels)

## Domaine & DNS (Namecheap)
| Type | Host | Value |
|------|------|-------|
| A Record | @ | 76.76.21.21 (Vercel) |
| MX Record | @ | mx1.improvmx.com (priority 10) |
| MX Record | @ | mx2.improvmx.com (priority 20) |
| TXT Record | @ | v=spf1 include:spf.improvmx.com ~all |

## Comptes créés
- **SerpAPI** : compte actif, clé configurée (100 req/mois gratuit)
- **Vercel** : projet "fasttravel" (hobby plan), déploiement auto depuis CLI
- **GitHub** : github.com/zy0be/FastTravel (public)
- **Namecheap** : domaine speedtravel.app (~11€/an, renew annuel)
- **ImprovMX** : email forwarding actif ✅ contact@speedtravel.app → Gmail
- **CJ Affiliate** : compte actif, PID 101734199, CID 7938941
- **Travelpayouts** : compte actif, marker 522297, paiement Revolut configuré
- **Gmail dédié** : contact.speedtravel@gmail.com

## Pages légales (ajoutées session 2)
- `/privacy` — Privacy Policy GDPR avec affiliate disclosure
- `/legal` — Mentions légales éditeur + hébergeur + disclaimer
- Footer mis à jour avec liens + contact@speedtravel.app

## Comment déployer
```powershell
git add . && git commit -m "message" && git push
vercel --prod
```
Si token expiré : `vercel login --github` d'abord

## Prochaines étapes
- [ ] Attendre approbation Booking.com FR sur CJ (email à contact.speedtravel@gmail.com)
- [ ] Si approuvé : réactiver liens CJ dans buildHotelUrl (src/app/api/search/route.ts)
- [ ] Si refusé : s'inscrire sur affiliate.booking.com (programme direct)
- [ ] Ramener du trafic : poster sur Reddit (r/solotravel, r/shoestring), Twitter
- [ ] Marketing : vidéo TikTok/Reels avec un vrai deal trouvé sur le site
- [ ] Features : filtres type de voyage (plage, city break, montagne)
- [ ] Features : alertes prix
- [ ] Features : page résultat shareable
