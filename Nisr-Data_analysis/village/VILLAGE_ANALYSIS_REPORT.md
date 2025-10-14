# Rwanda Food Security Analysis - Village Level Data

## Comprehensive Analytical Report

### CFSVA 2021 Dataset

---

## Executive Summary

This analysis examines **900 villages** across Rwanda using the CFSVA 2021 Village dataset, representing **163,281 households** across all 5 provinces. The data reveals critical insights into food security, infrastructure access, market dynamics, and community vulnerability.

### Key Findings:

1. **High Rural Vulnerability**: 87.1% of villages are rural, with significantly higher vulnerability scores
2. **Infrastructure Deficits**: 73.6% lack primary schools, 91% lack health facilities, 96.4% lack markets
3. **Food Price Pressures**: 48-58% of villages report food prices higher than normal across all categories
4. **Wage Disparities**: Urban non-agricultural wages are 46% higher than rural; non-ag wages are 99% higher than agricultural
5. **Vulnerability Crisis**: 39.3% of villages classified as HIGH vulnerability

---

## 1. Geographic & Demographic Profile

### Provincial Distribution

- **Southern Province**: 240 villages (26.7%)
- **Western Province**: 210 villages (23.3%)
- **Eastern Province**: 210 villages (23.3%)
- **Northern Province**: 150 villages (16.7%)
- **Kigali City**: 90 villages (10.0%)

### Urban-Rural Divide

- **Rural**: 784 villages (87.1%)
- **Urban**: 116 villages (12.9%)

### Village Size Characteristics

- **Total households**: 163,281
- **Average per village**: 181 households
- **Median**: 162 households
- **Range**: 46 - 2,200 households
- **Urban villages are 39% larger** (240 vs 173 households average)

---

## 2. Infrastructure & Services Access

### Critical Gaps Identified

#### Primary Education

- **26.4%** have a primary school in the village
- **73.6%** must travel to access education
- Average distance to nearest school: **63.9 km**
- Maximum distance: **300 km**

#### Healthcare

- **Only 9%** have a health facility
- **91%** lack local healthcare access
- Average distance to nearest facility: **63.9 km**

#### Market Access

- **3.6%** have a market in the village
- **96.4%** must travel to access markets
- Average distance to main market: **95 km**
- Maximum distance: **3,600 km** (data quality issue?)

### Road Accessibility

- **63.8%** have year-round road access
- **36.2%** have seasonal accessibility issues

**Provincial Rankings (% with year-round access):**

1. Kigali City: 77.8%
2. Northern: 70.7%
3. Eastern: 68.1%
4. Southern: 65.0%
5. Western: 47.1%

### Urban-Rural Infrastructure Disparity

Urban villages have significantly better infrastructure access, though gaps persist even in urban areas.

---

## 3. Food Availability & Price Dynamics

### Availability Assessment

#### Cereals (Wheat, Maize, Sorghum, Rice)

- Sufficient: 60.4%
- Moderately sufficient: 26.9%
- **Low/insufficient: 12.7%**

#### Tubers & Roots

- Sufficient: 58.4%
- Moderately sufficient: 30.0%
- **Low/insufficient: 11.6%**

#### Pulses & Legumes

- Sufficient: 58.3%
- Moderately sufficient: 30.7%
- **Low/insufficient: 11.0%**

#### Vegetables

- Sufficient: 65.7%
- Moderately sufficient: 26.9%
- **Low/insufficient: 7.4%**

### Price Trends (Compared to Normal)

**Major Concern: Widespread Price Increases**

| Food Category | Higher than Normal | Normal    | Lower than Normal |
| ------------- | ------------------ | --------- | ----------------- |
| Cereals       | **48.3%**          | 17.3%     | 34.3%             |
| Tubers        | **58.0%**          | 23.9%     | 18.1%             |
| Pulses        | **54.1%**          | 20.8%     | 25.1%             |
| Vegetables    | 30.2%              | **45.3%** | 24.4%             |

### Critical Insight: Availability-Price Relationship

Villages with **low cereal availability** experience high prices **69.3%** of the time, compared to only 41.4% in villages with sufficient availability. This indicates market dysfunction beyond simple supply-demand dynamics.

---

## 4. Labor Market & Wages

### Wage Levels (Daily)

#### Agricultural Labor

- Mean: **870 RWF/day** (~$0.87 USD at 2021 rates)
- Median: 800 RWF
- Range: 100 - 2,500 RWF
- Quartiles: 700 (25th) | 800 (50th) | 1,000 (75th)

#### Non-Agricultural Labor

- Mean: **1,729 RWF/day** (~$1.73 USD)
- Median: 1,500 RWF
- Range: 100 - 7,000 RWF
- **Premium over agricultural: 98.7%**

### Geographic Wage Disparities

| Location          | Agricultural Wage | Non-Agricultural Wage |
| ----------------- | ----------------- | --------------------- |
| **Urban**         | 1,103 RWF         | 2,386 RWF             |
| **Rural**         | 835 RWF           | 1,632 RWF             |
| **Urban Premium** | **+32.1%**        | **+46.2%**            |

### Wage Trends

#### Agricultural Wages (vs normal)

- Normal: 54.4%
- Higher: 29.6%
- Lower: 16.0%

#### Non-Agricultural Wages (vs normal)

- Normal: 67.8%
- Higher: 22.5%
- Lower: 9.7%

**Interpretation**: Most wages are stable or increasing, suggesting labor demand but also potential inflationary pressures.

---

## 5. Village Vulnerability Analysis

### Composite Vulnerability Index

We created a 12-point vulnerability index combining:

- Infrastructure deficits (school, health, market)
- Market access (roads, distance)
- Food availability (cereals, tubers, pulses)
- Food prices (cereals, tubers)
- Wage levels and trends

### Results

**Mean Score**: 6.23 (out of 12)  
**Median Score**: 6.00  
**Range**: 3 - 12

### Vulnerability Classification

| Level            | Villages | Percentage |
| ---------------- | -------- | ---------- |
| **Low** (0-3)    | 7        | 0.8%       |
| **Medium** (4-6) | 539      | 59.9%      |
| **High** (7+)    | 354      | **39.3%**  |

### Provincial Vulnerability Rankings

| Province     | Avg Score | Risk Level |
| ------------ | --------- | ---------- |
| **Western**  | 6.83      | Highest    |
| **Southern** | 6.64      | High       |
| Kigali City  | 5.87      | Moderate   |
| Northern     | 5.77      | Moderate   |
| **Eastern**  | 5.66      | Lowest     |

### Urban vs Rural Vulnerability

| Location | Mean Score | Median |
| -------- | ---------- | ------ |
| Urban    | 5.66       | 6.0    |
| Rural    | 6.32       | 6.0    |

**Statistical Test**: The difference is **statistically significant** (p < 0.0001), confirming rural areas face systematically higher vulnerability.

### High-Vulnerability Hotspots

**354 villages** classified as high vulnerability:

- Western Province: 128 villages (36.2%)
- Southern Province: 120 villages (33.9%)
- Eastern Province: 43 villages (12.1%)
- Northern Province: 41 villages (11.6%)
- Kigali City: 22 villages (6.2%)

---

## 6. Key Correlations & Insights

### What Reduces Vulnerability?

**Strongest Protective Factors** (negative correlation with vulnerability):

1. **Good roads** (r = -0.424) - Most important
2. **Higher agricultural wages** (r = -0.302)
3. **Higher non-agricultural wages** (r = -0.261)
4. **Urban location** (r = -0.146)

**Interpretation**: Market connectivity (roads) is the single most important factor in reducing food insecurity at the village level. Economic factors (wages) are also critical.

### What Increases Vulnerability?

Based on component analysis, villages are most affected by:

1. **No market access**: 868 villages (96.4%)
2. **No health facility**: 819 villages (91.0%)
3. **No school**: 662 villages (73.6%)
4. **Poor roads**: 326 villages (36.2%)
5. **High food prices**: 435-522 villages (48-58%)
6. **Low food availability**: 99-114 villages (11-13%)
7. **Low wages**: 450 villages (50%)

---

## 7. Critical Recommendations

### Immediate Priorities (0-12 months)

1. **Road Infrastructure Investment**

   - Target Western & Southern provinces
   - Focus on year-round accessibility
   - Impact: Strongest correlation with reduced vulnerability

2. **Market Access Enhancement**

   - Mobile markets for remote villages
   - Distance-based targeting (villages >10km from market)
   - Subsidized transport for market days

3. **Food Price Stabilization**
   - Strategic reserves for areas with concurrent low availability + high prices
   - Price monitoring in 354 high-vulnerability villages
   - Targeted food assistance programs

### Medium-Term Interventions (1-3 years)

4. **Infrastructure Development**

   - Health facilities in high-vulnerability clusters
   - Schools in underserved areas (prioritize villages >60km from nearest)
   - Market hubs in regional centers

5. **Wage Support & Employment**

   - Rural employment programs (cash-for-work)
   - Agricultural productivity investments
   - Non-farm income diversification

6. **Safety Net Expansion**
   - Current data shows 0% coverage (potential data issue)
   - Target 354 high-vulnerability villages first
   - Design location-specific interventions based on vulnerability drivers

### Long-Term Strategy (3-5 years)

7. **Reduce Urban-Rural Gap**

   - Agricultural commercialization
   - Rural industrialization
   - Value chain development

8. **Regional Equity**
   - Special attention to Western & Southern provinces
   - Province-specific food security strategies
   - Inter-provincial learning & best practice sharing

---

## 8. Data Quality Notes

### Potential Issues Identified

1. **Safety net columns**: All show 0% coverage - likely data encoding issue
2. **Distance measurements**: Some extreme values (e.g., 3600km to market)
3. **Crop-specific data**: Multi-select columns show 0% across all options
4. **Shock data**: Appears incomplete

### Recommendations for Future Data Collection

1. Verify multi-select question encoding
2. Add validation rules for distance measurements
3. Include GPS coordinates for mapping
4. Expand shock module with specific impact measures
5. Add household-level linkages for deeper analysis

---

## 9. Next Steps for Analysis

### Recommended Deep Dives

1. **Household-Level Analysis**

   - Link with `CFSVA_HH_2021_MASTER_DATASET.dta`
   - Food consumption scores (FCS)
   - Coping strategies
   - Wealth index analysis

2. **Child Nutrition Analysis**

   - Use `CFSVAHH2021_UNDER_5_ChildWithMother.dta`
   - Stunting, wasting, underweight prevalence
   - Link nutrition outcomes to village-level factors

3. **Multi-Level Modeling**

   - Village-level contextual effects on household food security
   - Geographic clustering analysis
   - Spatial mapping of vulnerability

4. **Seasonal Analysis**
   - Survey timing effects
   - Agricultural calendar alignment
   - Lean season identification

---

## 10. Technical Appendix

### Dataset Specifications

- **File**: CFSVA_2021_VILLAGE.dta
- **Format**: Stata 13+
- **Observations**: 900 villages
- **Variables**: 164
- **Survey Period**: Multiple dates in 2021
- **Geographic Coverage**: All 5 provinces of Rwanda

### Analysis Tools Used

- **Python 3**: Data processing
- **Pandas**: Data manipulation
- **Matplotlib/Seaborn**: Visualization
- **SciPy**: Statistical testing
- **StatsModels**: (recommended for regression analysis)

### Reproducibility

All analysis code is available in:

- `advanced_village_analytics.py` - Main analysis
- `visualize_food_security.py` - Visualization dashboard
- Generated figures: 5 PNG files at 300 DPI

---

## Conclusion

This village-level analysis reveals a **critical food security situation** in rural Rwanda, characterized by:

- **Severe infrastructure deficits** limiting access to essential services
- **Market dysfunction** with widespread price increases despite adequate availability
- **Significant urban-rural disparities** in both infrastructure and economic opportunity
- **Regional inequality** with Western and Southern provinces most vulnerable

The **composite vulnerability index** identifies 354 high-risk villages requiring immediate intervention. Road infrastructure emerges as the **single most important factor** for reducing vulnerability, followed by wage levels and economic opportunity.

**Urgent action is needed**, particularly in Western and Southern provinces, to address infrastructure gaps, improve market connectivity, and stabilize food prices before the situation deteriorates further.

---

**Report Generated**: October 14, 2025  
**Analyst**: Food Security Analytics Team  
**Dataset**: Rwanda CFSVA 2021 - Village Level Data  
**Contact**: For questions or additional analysis requests
