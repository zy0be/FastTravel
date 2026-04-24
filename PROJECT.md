# SpeedTravel — Project Overview

## C'est quoi ?
SaaS de voyage budget : l'user entre un budget, on trouve le meilleur combo vol + hôtel qui rentre dedans.
Critère mandatory : budget. Optionnel : dates, ville de départ, pays destination.

## Stack
- **Framework** : Next.js 16 (App Router) + TypeScript
- **Style** : Tailwind CSS dark theme
- **API** : SerpAPI (Google Flights + Google Hotels)
- **Déploiement** : Vercel
- **Repo** : github.com/zy0be/FastTravel

## URLs
- **Production** : speedtravel.app (+ fasttravel-mu.vercel.app)
- **Mail pro** : contact@speedtravel.app → contact.speedtravel@gmail.com (via ImprovMX)

## Architecture
```
src/
├── app/
│   ├── page.tsx              ← Page principale (search + résultats)
│   ├── layout.tsx            ← Layout + Travelpayouts Drive script
│   └── api/search/route.ts   ← API POST /api/search (logique core)
├── components/
│   ├── SearchForm.tsx         ← Formulaire budget, dates, origine
│   └── ComboCard.tsx          ← Card résultat vol + hôtel
├── lib/
│   └── amadeus.ts            ← Placeholder (remplacé par SerpAPI)
└── types/
    └── travel.ts             ← Types SearchParams, TravelCombo, etc.
```

## Flow de recherche
1. User entre budget (+ optionnel : dates, ville départ, pays)
2. API route cherche vols via SerpAPI Google Flights (15 destinations populaires)
3. Pour chaque vol dans le budget → cherche hôtels via SerpAPI Google Hotels
4. Filtre les combos vol + hôtel ≤ budget
5. Trie par prix et retourne max 20 résultats

## Variables d'environnement
```
SERPAPI_KEY=352d52387e7e77bfb71d407d6e340df807b3b4ffb16c1a3dde85013e329d62b4
BOOKING_AFFILIATE_ID=101734199       ← CJ Affiliate PID
SKYSCANNER_AFFILIATE_ID=TP-522297    ← Travelpayouts marker
```

## Monétisation
| Source | Système | Commission |
|--------|---------|------------|
| Hôtels | CJ Affiliate → Booking.com FR (ID: 4297313) | 4% par réservation |
| Vols   | Travelpayouts Drive (script auto) | ~1-2% par billet |

### Liens affiliés hôtels
Format CJ : `https://www.anrdoezrs.net/click-101734199-4297313?url={BOOKING_URL}`
Statut Booking.com FR : **en attente d'approbation** (24-48h)

### Travelpayouts
- Marker : 522297
- Script intégré dans layout.tsx
- Drive actif sur speedtravel.app

## Domaine & DNS (Namecheap)
| Type | Host | Value |
|------|------|-------|
| A Record | @ | 76.76.21.21 (Vercel) |
| MX Record | @ | mx1.improvmx.com (priority 10) |
| MX Record | @ | mx2.improvmx.com (priority 20) |
| TXT Record | @ | v=spf1 include:spf.improvmx.com ~all |

## Comptes créés
- **SerpAPI** : compte actif, clé configurée
- **Vercel** : projet "fasttravel" (hobby plan)
- **GitHub** : github.com/zy0be/FastTravel
- **Namecheap** : domaine speedtravel.app (~11€/an)
- **ImprovMX** : email forwarding actif
- **CJ Affiliate** : compte actif, PID 101734199
- **Travelpayouts** : compte actif, marker 522297

## Prochaines étapes
- [ ] Attendre approbation Booking.com FR sur CJ
- [ ] Mettre à jour email sur CJ/Travelpayouts avec contact@speedtravel.app
- [ ] Marketing : vidéo TikTok/Reels
- [ ] Features : filtres type de voyage (plage, city break, montagne)
- [ ] Features : alertes prix
- [ ] Features : page résultat shareable
