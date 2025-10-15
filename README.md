# NISR_HACKATHON_AK — Team AK (Solution)

This repository contains the Team AK solution for the NISR Hackathon 2025 (Track 2: Ending Hidden Hunger). We built a district-level analytics platform and a machine-learning prediction app that together help map malnutrition hotspots across Rwanda and predict district-level malnutrition risk.

Live deployment: https://nisr-hackthon-ak.vercel.app/

ML prediction endpoint (used by the app): https://nisr-hackthon-ak-p9n3.vercel.app/

## Summary

Team AK (Ashimwe Geoffrey & Kamanzi Serge) created a full-stack, open-source system to make hidden hunger visible and actionable. The platform includes:

- Interactive geospatial hotspot maps (district-level).
- District analytics dashboards with nutrition indicators, economic and agricultural factors.
- A Python ML model that predicts district malnutrition risk scores.
- Policy brief templates and guidance tied to district analytics.

## Transcript (Final — NISR Hackathon 2025)

🎤 Final Transcript — NISR Hackathon 2025 (Team AK: Ashimwe Geoffrey & Kamanzi Serge)

Track 2: Ending Hidden Hunger

[Opening — 0:00–0:20]
Hello everyone, we are Team AK, made up of Ashimwe Geoffrey and Kamanzi Serge.
For the NISR Hackathon 2025, we worked on Track 2: Ending Hidden Hunger — a challenge focused on addressing micronutrient deficiencies across Rwanda.

[Problem Introduction — 0:20–0:45]
Hidden hunger — or micronutrient deficiency — is a silent threat that weakens communities and limits development.
Our mission was to use data and machine learning to map malnutrition hotspots, analyze root causes, and predict district-level malnutrition risk, so interventions can be better targeted and more effective.

[Solution Overview — 0:45–1:30]
We built a district-level analytics platform combined with a machine learning prediction model.
Our system identifies and visualizes malnutrition hotspots across Rwanda, providing detailed analytics for every district — including factors like household income, agricultural output, and school nutrition metrics.

The ML model, built with Python, predicts the malnutrition risk score for each district, allowing stakeholders to identify vulnerable zones early.
The platform itself was developed with React (TypeScript/TSX), and we deployed it on Vercel for fast and stable web access.

[Demonstration — 1:30–2:10]
Here’s a quick look at our website:
You can see the interactive hotspot map, where each district is color-coded based on malnutrition risk.
Users can click any district to view its analytics dashboard — showing nutrition indicators, economic data, and contributing factors.

We’ll now run a sample test on our prediction model, which processes district-level data and instantly predicts the malnutrition risk category, helping guide future interventions and resource allocation.

[Impact & Policy Relevance — 2:10–2:40]
By focusing on district-level analytics, we ensure that policy recommendations are localized, practical, and evidence-based.
Our results support collaboration between health, agriculture, and education sectors, highlighting specific areas that need immediate attention.
We also drafted policy briefs that summarize actionable steps each district can take.

[Closing — 2:40–3:00]
Our entire project is open-source, and all datasets, analytics notebooks, and visualization tools are available in our GitHub repository.
Team AK is committed to turning data into action — making hidden hunger visible, measurable, and ultimately, preventable.
Thank you.

✅ Slide/Video Caption Summary

Team AK (Ashimwe Geoffrey & Kamanzi Serge)
Track 2: Ending Hidden Hunger
Focus: District-level analytics & ML prediction of malnutrition risk
Tech Stack: Python | React (TSX) | Vercel
Outputs: Geospatial hotspot maps, district analytics dashboards, ML predictions, policy briefs
Open Source: https://github.com/AshimweGeoffrey/NISR_HACKTHON_AK

## Repository structure

Top-level folders of interest:

- `ml_model/` — Jupyter notebook(s) used to build and evaluate the malnutrition prediction model (Python).
- `Nisr-Data_analysis/` — Data cleaning, exploratory analysis, and district/village-level analytics scripts and outputs.
- `nisr-frontend/` — React frontend for analytics and dashboard visualizations.
- `react-web-prediction_model/` — React + TypeScript frontend focused on prediction workflows and model demos.

## Quick start (local development)

Prerequisites:

- Node.js (>=16) and npm (or yarn)
- Python 3.8+ (for notebooks and scripts)

Run the analytics frontend:

```bash
cd nisr-frontend
npm install
npm run dev
```

Run the prediction frontend:

```bash
cd react-web-prediction_model
npm install
npm run dev
```

## Open the deployed site

The live, deployed interface for the analytics and prediction platform is available at:

https://nisr-hackthon-ak.vercel.app/

## Notes about ML warm-up behavior

The main analytics navigation includes an ML Prediction action that opens a short wait overlay and sends wake pings to the deployed ML app (Vercel) before redirecting. This behavior helps reduce cold-start delays when the prediction service is deployed on serverless platforms.

## Contributing

Contributions are welcome. Please open issues or pull requests on the repository. If you reuse or extend the models, cite the dataset sources and document any changes to preprocessing or model parameters.

## License & Contact

This project is open-source. For questions or collaboration, open an issue or reach out via the GitHub repository.
