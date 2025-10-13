# NISR Hackathon Frontend

Lightweight React + Vite interface for the nutrition analytics prototype. Use the steps below to install and run locally.

## Getting Started

```
npm install
npm run dev
```

- `npm install` – pull all dependencies.
- `npm run dev` – start the Vite dev server (http://localhost:5173).

### Additional Scripts

- `npm run build` – create a production bundle in `dist/`.
- `npm run preview` – preview the production build locally.
- `npm run lint` – execute ESLint checks.

## Project Structure

```
nisr-frontend/
├── public/
│   ├── assets/Map.svg
│   └── rwanda_districts.json
├── src/
│   ├── components/
│   │   ├── RwandaMap.jsx
│   │   ├── navigation.tsx
│   │   └── footer.tsx
│   ├── pages/
│   │   ├── analytics.tsx
│   │   ├── dynamicHotspot.tsx
│   │   └── nisrHome.tsx
│   ├── styles/
│   └── utils/
├── eslint.config.js
├── vite.config.js
└── README.md
```

## Stack Snapshot

- React 19 with React Router 6.
- Leaflet + React Leaflet for the hotspot visual.
- Recharts for analytics charts.
- CSS variables defined in `src/styles/styles.css` for shared theming.

## Deployment

1. `npm run build`
2. Serve `dist/` from any static host.

## Notes

- Leaflet map data lives in `public/rwanda_districts.json`.
- Analytics charts use mock datasets inside `src/pages/analytics.tsx`.
