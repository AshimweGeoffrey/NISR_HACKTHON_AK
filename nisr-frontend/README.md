<div align="center">

# NISR Nutrition Analytics Frontend

Interactive dashboards and geospatial visuals that surface Rwanda’s malnutrition insights.

</div>

## Overview

This React + Vite SPA powers the public-facing prototype for the National Institute of Statistics of Rwanda (NISR) hackathon. It features:

- **Story-driven home experience** that frames the nutrition challenge and calls visitors to action.
- **Dynamic hotspot map** built on Leaflet with district-level hovering, province styling, and modal drill downs backed by GeoJSON.
- **Analytics workspace** composed of responsive Recharts visuals (bubble, radial, heatmap, pie, stacked area & bar) aligned to a shared design palette defined in `src/styles/styles.css`.
- **Persistent navigation and footer** to move between pages (`/`, `/hotspot`, `/analytics`).

## Quick Start

| Command           | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `npm install`     | Install project dependencies.                                   |
| `npm run dev`     | Launch the Vite dev server (defaults to http://localhost:5173). |
| `npm run build`   | Generate an optimized production build in `dist/`.              |
| `npm run preview` | Serve the production build locally.                             |
| `npm run lint`    | Run ESLint across the codebase.                                 |

> **Requirements:** Node.js 18+ (or any runtime supported by Vite 7) and npm 9+.

## Project Structure

```
nisr-frontend/
├── public/
│   ├── assets/Map.svg              # Decorative map asset for the hotspot hero
│   └── rwanda_districts.json       # GeoJSON driving the Leaflet map
├── src/
│   ├── components/
│   │   ├── RwandaMap.jsx           # Interactive province/district overlay with modal details
│   │   ├── navigation.tsx          # Top navigation powered by react-router NavLink
│   │   └── footer.tsx
│   ├── pages/
│   │   ├── analytics.tsx           # Recharts dashboard using Rwanda nutrition mock data
│   │   ├── dynamicHotspot.tsx      # Hotspot hero + embedded map view
│   │   └── nisrHome.tsx            # Landing content and program highlights
│   ├── styles/                     # Global palette, navigation, analytics, map styles
│   └── utils/                      # (reserved for future helpers)
├── eslint.config.js
├── vite.config.js
└── README.md
```

## Key Technologies

- **React 19** for component-driven UI.
- **React Router 6** handling multi-page navigation without reloads.
- **React Leaflet + Leaflet 1.9** delivering the geospatial hotspot experience.
- **Recharts 2** powering all analytic data visualisations.
- **CSS custom properties** managed via `src/styles/styles.css` for consistent theming across cards (`card-analytics`), charts, and controls.

## Styling & Theming

- Theme colors live in `src/styles/styles.css`, with semantic tokens (`--color-primary-*`, `--color-secondary-*`).
- Page-specific styles scope under `.analytics-page` and `.dynamic-hotspot-page` to avoid leakage.
- Cards on the analytics grid share the `card-analytics` class, ensuring unified spacing, borders, and shadows.

## Geospatial Data

- `public/rwanda_districts.json` provides administrative boundaries. Replace or enrich this file to update the Leaflet layers.
- Province styling derives from `provinceColors` inside `RwandaMap.jsx`. Adjust the palette there to reflect design updates.

## Development Tips

- The map modal instantiates a Leaflet mini-map; when editing modal markup, keep the `miniMapRef` container intact.
- Charts pull mock data arrays defined at the top of `analytics.tsx`. Swap with live API data or hooks when available.
- ESLint (configured via `eslint.config.js`) ships with React rules—run `npm run lint` before committing.

## Deployment

1. `npm run build`
2. Serve the contents of `dist/` via any static host (Netlify, Vercel, Azure Static Web Apps, etc.).

## Future Enhancements

- Integrate real nutrition datasets via API services.
- Add filters/time-range selectors to the analytics grid.
- Expand the routing skeleton for “Causes + Solution” and “Policies” menu items.

---

Built for the NISR hackathon to spotlight data-driven nutrition insights in Rwanda.
