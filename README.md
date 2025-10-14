# NISR_HACKTHON_AK Repository

This repository contains code, data, and frontend applications for comprehensive analytics and prediction modeling related to food security and malnutrition in Rwanda. Below is an overview of the main folders, their contents, and instructions on how to run the tools provided.

---

## Folder Structure & Description

### 1. `ml_model/`

- **malnutrition_model.ipynb**: Jupyter notebook for building and analyzing malnutrition prediction models.
- **How to run**: Open with Jupyter Notebook or VS Code's notebook interface.

### 2. `Nisr-Data_analysis/`

- **COMPREHENSIVE_DATA_ANALYTICS_SUMMARY.md**: Summary of analytics performed.
- **DATA_OVERVIEW_AND_COLUMN_GUIDE.md**: Guide to dataset columns.
- **food_security_analysis_starter.py**: Starter script for food security analysis.
- **PROJECT_GUIDE.md**: Project instructions and overview.
- **README.md**: Data analysis folder readme.
- **STUNNING_FACTS_SUMMARY.md**: Key findings summary.
- **child_nutrition/**: Scripts and outputs for child malnutrition analysis.
- **data/**: Contains raw data files (`.dta` format).
- **village/**: Scripts and reports for village-level analytics.

- **How to run Python scripts**:
  ```bash
  cd Nisr-Data_analysis
  python food_security_analysis_starter.py
  # Or run other scripts as needed
  ```
  Ensure you have Python 3.x and required packages installed (see script headers for dependencies).

### 3. `nisr-frontend/`

- **React-based frontend for data visualization and dashboards.**
- **Key files**: `index.html`, `vite.config.js`, `src/` (main app and components), `public/` (assets and geojson).
- **How to run**:
  ```bash
  cd nisr-frontend
  npm install
  npm run dev
  ```
  Access the app at `http://localhost:5173` (default Vite port).

### 4. `react-web-prediction_model/`

- **React + TypeScript frontend for prediction modeling.**
- **Key files**: `src/` (main app and components), `package.json`, `vite.config.ts`.
- **How to run**:
  ```bash
  cd react-web-prediction_model
  npm install
  npm run dev
  ```
  Access the app at `http://localhost:5173`.

---

## Tools & Technologies Used

- **Python**: Data analysis and modeling scripts.
- **Jupyter Notebook**: Interactive model development.
- **React, Vite, TypeScript**: Frontend dashboards and prediction tools.
- **Markdown**: Documentation and reports.
- **Data files**: Stata `.dta` format for raw data.

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AshimweGeoffrey/NISR_HACKTHON_AK.git
   cd NISR_HACKTHON_AK
   ```
2. **Install Python dependencies** (for data analysis):
   - Check script headers for required packages (e.g., pandas, numpy, matplotlib, etc.).
   - Install with pip:
     ```bash
     pip install pandas numpy matplotlib
     ```
3. **Install Node.js dependencies** (for frontend):
   - Make sure Node.js and npm are installed.
   - Run `npm install` in each frontend folder before starting the dev server.

---

## Notes

- Data files are large and may require additional RAM to process.
- For Jupyter notebooks, use VS Code or Jupyter Lab for best experience.
- Frontend apps use Vite for fast development and hot-reloading.

---

## Contact & Contribution

For questions or contributions, open an issue or pull request on GitHub.
