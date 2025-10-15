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

## Project

This project combines data engineering, analytics, visualization, and machine learning to identify and predict areas at risk of child malnutrition (hidden hunger) at a district level in Rwanda. The goal is to provide actionable, localized insights for policymakers and program implementers so they can prioritize and tailor interventions.

Key outcomes:

- A geospatial hotspot map that highlights districts by malnutrition risk.
- Per-district dashboards with nutrition indicators, socioeconomic context, and contributing factors.
- A Python-based ML prediction model that outputs a risk score or category for districts.
- Policy briefs and summary reports that translate analytics into interventions.

## Parts of the project

Below are the main folders and their responsibilities. Each can be explored and run independently for development or testing.

- `ml_model/`

  - Contains Jupyter notebook(s) used to train and evaluate the malnutrition prediction model.
  - Includes preprocessing steps, feature selection experiments, model training, and evaluation metrics.
  - Good starting point: open `ml_model/malnutrition_model.ipynb` in VS Code or Jupyter Lab.

- `Nisr-Data_analysis/`

  - Data cleaning, exploratory data analysis (EDA), visualizations, and helper scripts used to prepare datasets for the dashboard and ML model.
  - Contains documentation (`COMPREHENSIVE_DATA_ANALYTICS_SUMMARY.md`, `PROJECT_GUIDE.md`) and outputs used to inform the dashboards and policy briefs.

- `nisr-frontend/`

  - React application that hosts the analytics dashboards and the geospatial hotspot map.
  - Key features: district-level profiles, interactive map, charts, and exportable reports.
  - Includes a small UX flow to warm up the ML prediction endpoint before redirecting users to predictions.

- `react-web-prediction_model/`
  - A focused React + TypeScript app that demonstrates the prediction model and provides controls to run sample predictions.
  - Used for interactive demos and model explainability interfaces.

## Team

This project was developed by Team AK:

- Ashimwe Geoffrey
- Kamanzi Serge

Both members contributed to data analysis, model development, frontend design, and deployment.

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
