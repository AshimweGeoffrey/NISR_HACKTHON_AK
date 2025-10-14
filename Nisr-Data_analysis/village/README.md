# Village-Level Food Security Analysis

## Rwanda CFSVA 2021

This directory contains all analysis tools and outputs for village-level food security analysis.

---

## Directory Structure

```
village/
├── README.md                           (this file)
├── village_analysis_clean.py          (comprehensive text-based analysis)
├── advanced_village_analytics.py      (statistical analysis with correlations)
├── visualize_food_security.py         (creates 5 visualization figures)
├── village_food_security_analysis.py  (original analysis script)
├── VILLAGE_ANALYSIS_REPORT.md         (comprehensive written report)
└── fig*.png                           (generated visualization figures)
```

---

## Data Source

All scripts reference the data directory:

- **Data Path**: `../data/CFSVA_2021_VILLAGE.dta`
- **Villages**: 900
- **Variables**: 164
- **Households Represented**: 163,281

---

## Available Analysis Scripts

### 1. village_analysis_clean.py

**Purpose**: Comprehensive text-based analysis without emojis

**What it does**:

- Geographic distribution analysis
- Community characteristics
- Infrastructure access (schools, health, markets)
- Food availability and pricing
- Labor market and wages
- Agricultural practices
- Vulnerability assessment

**Run it**:

```bash
cd village
python3 village_analysis_clean.py
```

**Output**: Detailed console output with statistics and distributions

---

### 2. advanced_village_analytics.py

**Purpose**: Statistical analysis with advanced metrics

**What it does**:

- Detailed demographic analysis
- Infrastructure gap assessment
- Market access analysis
- Food security indicators
- Wage disparities (urban/rural, ag/non-ag)
- Composite vulnerability index
- Correlation analysis
- Statistical tests (t-tests)

**Run it**:

```bash
cd village
python3 advanced_village_analytics.py
```

**Output**:

- Statistical summaries
- Vulnerability scores
- Correlation matrix
- Significance tests

---

### 3. visualize_food_security.py

**Purpose**: Generate publication-quality visualizations

**What it creates**:

1. **fig1_geographic_overview.png**

   - Province distribution
   - Urban/rural split
   - Village size histogram
   - Vulnerability by province

2. **fig2_infrastructure_access.png**

   - Infrastructure access rates
   - Road accessibility by province
   - Distance to services
   - Urban vs rural comparison

3. **fig3_food_availability_prices.png**

   - Food availability by category
   - Price trends
   - Availability-price heatmap
   - Food insecurity indicators

4. **fig4_labor_wages.png**

   - Wage distribution
   - Urban vs rural wages
   - Wage trends
   - Wage premiums

5. **fig5_vulnerability_analysis.png**
   - Vulnerability score distribution
   - Vulnerability by province
   - Component breakdown
   - Urban vs rural comparison

**Run it**:

```bash
cd village
python3 visualize_food_security.py
```

**Output**: 5 PNG files at 300 DPI resolution

---

## Key Findings Summary

### Critical Issues

- **87.1%** of villages are rural
- **73.6%** lack primary schools
- **91%** lack health facilities
- **96.4%** lack markets
- **39.3%** classified as HIGH vulnerability

### Food Security

- **12.7%** report low cereal availability
- **48-58%** experiencing higher-than-normal prices
- Price increases most severe for tubers (58%)

### Economic Disparities

- Non-agricultural wages **99% higher** than agricultural
- Urban agricultural wages **32% higher** than rural
- Urban non-agricultural wages **46% higher** than rural

### Most Vulnerable Provinces

1. Western (avg score: 6.83/12)
2. Southern (avg score: 6.64/12)
3. Kigali City (avg score: 5.87/12)
4. Northern (avg score: 5.77/12)
5. Eastern (avg score: 5.66/12)

### Key Protective Factor

- **Good roads** show strongest correlation (r=-0.424) with reduced vulnerability
- 36.2% of villages lack year-round road access

---

## Running All Analyses

To run the complete analysis pipeline:

```bash
cd /home/micro/Nisr\ 2021\ food\ security/Microdata/village

# 1. Run comprehensive analysis
python3 village_analysis_clean.py > analysis_output.txt

# 2. Run statistical analysis
python3 advanced_village_analytics.py > statistical_output.txt

# 3. Generate visualizations
python3 visualize_food_security.py

# View results
ls -lh *.png
```

---

## Outputs Generated

### Text Reports

- Console output with detailed statistics
- Crosstabs and frequency distributions
- Vulnerability classifications
- Correlation matrices

### Visualizations (PNG)

- All figures saved at 300 DPI
- Publication-ready quality
- Clear labels and legends
- Color-coded for insights

### Written Report

- VILLAGE_ANALYSIS_REPORT.md
- Comprehensive 10-section report
- Policy recommendations
- Data quality notes

---

## Next Steps

### Extend Analysis

1. Link with household-level data
2. Link with child nutrition data
3. Create spatial maps
4. Time series analysis (if multi-year data available)

### Custom Analysis

Modify scripts to:

- Focus on specific provinces
- Filter high-vulnerability villages
- Create custom indicators
- Export results to CSV

### Example Filters

```python
# In any script, after loading data:

# Focus on high vulnerability
high_vuln = df[df['vulnerability_score'] >= 8]

# Focus on specific province
western = df[df['S0_C_Prov'] == 'Western']

# Villages with multiple challenges
complex_issues = df[
    (df['S5_01_2'] == 'Low (insufficient)') &
    (df['S5_01_3'] == 'Higher that normal')
]

# Export for GIS/Excel
df.to_csv('village_data_export.csv', index=False)
```

---

## Technical Notes

### Requirements

- Python 3.x
- pandas
- numpy
- matplotlib
- seaborn
- scipy

### Install dependencies:

```bash
pip install pandas numpy matplotlib seaborn scipy
```

### Data Path

All scripts use relative path: `../data/CFSVA_2021_VILLAGE.dta`

Make sure data directory structure is:

```
Microdata/
├── data/
│   └── CFSVA_2021_VILLAGE.dta
└── village/
    └── [analysis scripts]
```

---

## Support

For questions or to extend the analysis:

1. Review the scripts (well-commented)
2. Check VILLAGE_ANALYSIS_REPORT.md for methodology
3. Modify scripts for custom analysis
4. Create new visualizations following existing patterns

---

**Last Updated**: October 14, 2025  
**Data Source**: Rwanda CFSVA 2021 Village Survey  
**Analysis Level**: Village (community) level  
**Sample Size**: 900 villages across 5 provinces
