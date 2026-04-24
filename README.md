# NEXT_API — Météo 🌤️

Application météo construite avec **Next.js** (App Router) et l'API **OpenWeatherMap**.

## Fonctionnalités

- 🔍 Recherche météo par nom de ville
- 🌡️ Affichage de la température, ressenti, humidité, vent, pression
- 🇫🇷 Interface en français avec données météo localisées
- 🛣️ Route API `/api/weather?city=<ville>` exposée via Next.js

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- Clé API gratuite [OpenWeatherMap](https://openweathermap.org/api)

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Nathan-L-A/NEXT_API.git
cd NEXT_API

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local et y ajouter votre clé API OpenWeatherMap

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Route API

```
GET /api/weather?city=<nom_de_ville>
```

### Exemple de réponse

```json
{
  "city": "Paris",
  "country": "FR",
  "temperature": 18,
  "feelsLike": 17,
  "humidity": 65,
  "description": "ciel dégagé",
  "icon": "01d",
  "windSpeed": 15,
  "minTemp": 14,
  "maxTemp": 21,
  "pressure": 1013
}
```

### Codes d'erreur

| Statut | Description |
|--------|-------------|
| 400 | Paramètre `city` manquant |
| 404 | Ville introuvable |
| 500 | Clé API non configurée ou erreur serveur |

## Stack technique

- [Next.js 16](https://nextjs.org/) — Framework React (App Router)
- [TypeScript](https://www.typescriptlang.org/) — Typage statique
- [Tailwind CSS](https://tailwindcss.com/) — Styles utilitaires
- [OpenWeatherMap API](https://openweathermap.org/api) — Données météo
