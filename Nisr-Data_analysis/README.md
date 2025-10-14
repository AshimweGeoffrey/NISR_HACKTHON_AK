# Rwanda Food Security Analysis Project

## CFSVA 2021 Dataset

Comprehensive food security analysis framework for Rwanda using the Comprehensive Food Security and Vulnerability Analysis (CFSVA) 2021 dataset.

---

## Project Structure

```
Microdata/
├── README.md                           (this file)
├── PROJECT_GUIDE.md                    (detailed project guide)
├── DATA_OVERVIEW_AND_COLUMN_GUIDE.md   (data dictionary)
├── food_security_analysis_starter.py   (starter script)
│
├── data/                               (all datasets)
│   ├── CFSVA_2021_VILLAGE.dta         (village-level data: 900 villages)
│   ├── CFSVA_HH_2021_MASTER_DATASET.dta (household-level data)
│   └── CFSVAHH2021_UNDER_5_ChildWithMother.dta (child nutrition data)
│
└── village/                            (village-level analysis)
    ├── README.md                       (village analysis guide)
    ├── village_analysis_clean.py      (comprehensive analysis)
    ├── advanced_village_analytics.py  (statistical analysis)
    ├── visualize_food_security.py     (creates visualizations)
    ├── VILLAGE_ANALYSIS_REPORT.md     (written report)
    └── fig*.png                       (5 visualization figures)
```

---

## Quick Start

### 1. Explore the Data

```bash
cd village
python3 village_analysis_clean.py
```

### 2. Generate Visualizations

```bash
cd village
python3 visualize_food_security.py
```

### 3. Read the Reports

- Village analysis: `village/VILLAGE_ANALYSIS_REPORT.md`
- Project guide: `PROJECT_GUIDE.md`
- Data overview: `DATA_OVERVIEW_AND_COLUMN_GUIDE.md`

---

## Datasets Overview

### 1. Village-Level Data (CFSVA_2021_VILLAGE.dta)

- **Level**: Community/Village
- **Observations**: 900 villages
- **Variables**: 164
- **Coverage**: All 5 provinces of Rwanda
- **Content**:
  - Infrastructure access (schools, health, markets)
  - Food availability and prices
  - Labor market and wages
  - Agricultural practices
  - Community shocks and vulnerabilities

### 2. Household-Level Data (CFSVA_HH_2021_MASTER_DATASET.dta)

- **Level**: Household
- **Observations**: ~5,000+ households
- **Content**:
  - Food consumption scores (FCS)
  - Coping strategies (rCSI)
  - Wealth index
  - Expenditure patterns
  - Food security classification

### 3. Child Nutrition Data (CFSVAHH2021_UNDER_5_ChildWithMother.dta)

- **Level**: Child (Under 5 years)
- **Content**:
  - Anthropometric measurements
  - Stunting, wasting, underweight
  - Dietary diversity
  - Feeding practices

---

## Available Analyses

### Village-Level Analysis (COMPLETE)

- [x] Geographic distribution
- [x] Infrastructure access
- [x] Market dynamics
- [x] Food availability and prices
- [x] Labor market and wages
- [x] Vulnerability assessment
- [x] 5 comprehensive visualizations
- [x] Written report with recommendations

### Household-Level Analysis (PENDING)

- [ ] Food consumption analysis
- [ ] Coping strategies
- [ ] Wealth and expenditure
- [ ] Multi-dimensional food security

### Child Nutrition Analysis (PENDING)

- [ ] Malnutrition prevalence
- [ ] Dietary diversity
- [ ] Determinants analysis

### Cross-Level Analysis (PENDING)

- [ ] Village context effects on household outcomes
- [ ] Spatial clustering
- [ ] Multi-level modeling

---

## Key Findings (Village Level)

### Infrastructure Crisis

- 73.6% of villages lack primary schools
- 91% lack health facilities
- 96.4% lack markets
- Average distance to services: 64-95 km

### Food Security Concerns

- 48-58% experiencing higher-than-normal prices
- 11-13% report low food availability
- Tubers most affected (58% high prices)

### Vulnerability Assessment

- 39.3% of villages classified as HIGH vulnerability
- Western Province most vulnerable (score: 6.83/12)
- Rural areas significantly more vulnerable (p<0.0001)

### Economic Disparities

- Non-ag wages 99% higher than agricultural
- Urban wages 32-46% higher than rural
- Road access strongest protective factor (r=-0.424)

---

## Requirements

### Software

- Python 3.x
- Jupyter Notebook (optional, for interactive analysis)

### Python Packages

```bash
pip install pandas numpy matplotlib seaborn scipy statsmodels
```

### Data Format

- Stata (.dta) files
- Requires pandas with Stata support

---

## Getting Started

### Step 1: Verify Data

```bash
ls -lh data/
# Should show 3 .dta files
```

### Step 2: Run Village Analysis

```bash
cd village
python3 village_analysis_clean.py
```

### Step 3: View Visualizations

```bash
cd village
python3 visualize_food_security.py
# Check generated fig*.png files
```

### Step 4: Read Reports

```bash
# Village analysis report
cat village/VILLAGE_ANALYSIS_REPORT.md

# Project guide
cat PROJECT_GUIDE.md
```

---

## Documentation

### Main Documents

1. **PROJECT_GUIDE.md** - Complete project overview and methodology
2. **DATA_OVERVIEW_AND_COLUMN_GUIDE.md** - Data dictionary and variable definitions
3. **village/README.md** - Village analysis guide
4. **village/VILLAGE_ANALYSIS_REPORT.md** - Comprehensive findings and recommendations

### Code Documentation

All Python scripts include:

- Detailed docstrings
- Inline comments
- Section headers
- Clear variable names

---

## Analysis Workflow

### Current Status: Village Level COMPLETE

**Completed**:

1. Data exploration and cleaning
2. Descriptive statistics
3. Vulnerability index creation
4. Statistical tests and correlations
5. Visualization dashboard (5 figures)
6. Written report with policy recommendations

**Next Steps**:

1. Household-level analysis
2. Child nutrition analysis
3. Multi-level integration
4. Spatial mapping
5. Predictive modeling

---

## Extending the Analysis

### Custom Analysis Template

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load data
df_village = pd.read_stata('data/CFSVA_2021_VILLAGE.dta')
df_household = pd.read_stata('data/CFSVA_HH_2021_MASTER_DATASET.dta')
df_child = pd.read_stata('data/CFSVAHH2021_UNDER_5_ChildWithMother.dta')

# Your custom analysis here
# ...

# Export results
results.to_csv('my_analysis_results.csv')
```

### Adding New Analyses

1. Create new Python script in appropriate directory
2. Reference data using relative path: `../data/filename.dta`
3. Follow existing code structure and documentation style
4. Save outputs in same directory as script

---

## Data Quality Notes

### Known Issues

1. Some multi-select columns may have encoding issues
2. Extreme distance values (e.g., 3600km) likely data entry errors
3. Safety net coverage shows 0% (potential encoding issue)
4. Shock data incomplete in some sections

### Recommendations

- Verify extreme values before analysis
- Check multi-select encodings
- Cross-validate with other data sources
- Apply appropriate outlier handling

---

## Contributing

To add new analyses:

1. Create appropriate subdirectory (e.g., `household/`, `nutrition/`)
2. Follow existing code structure
3. Include README.md in new directory
4. Update this main README
5. Document findings

---

## License and Citation

### Data Source

- Rwanda National Institute of Statistics (NISR)
- Comprehensive Food Security and Vulnerability Analysis (CFSVA) 2021
- In collaboration with World Food Programme (WFP)

### Citation

When using this data or analysis, please cite:

```
Rwanda National Institute of Statistics (NISR) and World Food Programme (WFP).
2021. Rwanda Comprehensive Food Security and Vulnerability Analysis (CFSVA).
Kigali, Rwanda.
```

---

## Contact and Support

### For Questions About:

- **Data**: Contact NISR or WFP Rwanda
- **Analysis**: Review documentation and code comments
- **Technical Issues**: Check Python version and package installations
- **Extensions**: Follow existing code patterns

---

## Version History

### v1.0 - October 2025

- Initial village-level analysis complete
- 5 visualization figures generated
- Comprehensive written report
- Vulnerability index created
- Statistical analysis and correlations

### Planned Updates

- v1.1: Household-level analysis
- v1.2: Child nutrition analysis
- v1.3: Multi-level integration
- v1.4: Spatial mapping and GIS
- v2.0: Interactive dashboard

---

## Project Statistics

- **Datasets**: 3 (village, household, child)
- **Villages Analyzed**: 900
- **Provinces Covered**: 5
- **Households Represented**: 163,281
- **Analysis Scripts**: 4
- **Visualizations**: 5 figures
- **Documentation Pages**: 50+

---

**Project Status**: Active Development  
**Current Focus**: Village-Level Analysis (Complete)  
**Next Phase**: Household-Level Analysis  
**Last Updated**: October 14, 2025
