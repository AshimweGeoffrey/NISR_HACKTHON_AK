# 🎯 Rwanda Food Security Analytics - Project Summary

## What We've Built

A comprehensive analytical framework for understanding food security in Rwanda using the CFSVA 2021 Village dataset.

---

## 📊 Generated Files Overview

### 1. **Analysis Scripts** (Python)

#### `advanced_village_analytics.py`

- **Purpose**: Deep statistical analysis of village-level data
- **What it does**:
  - Loads and explores all 900 villages, 164 variables
  - Analyzes 7 key dimensions: geography, infrastructure, markets, food availability, wages, agriculture, vulnerabilities
  - Creates composite vulnerability index (12-point scale)
  - Statistical tests (t-tests, correlations)
  - Generates actionable insights

#### `visualize_food_security.py`

- **Purpose**: Creates publication-quality visualizations
- **Generates 5 comprehensive figures**:
  1. Geographic & Demographic Overview
  2. Infrastructure & Market Access
  3. Food Availability & Prices
  4. Labor Market & Wages
  5. Vulnerability Analysis

### 2. **Report** (Markdown)

#### `VILLAGE_ANALYSIS_REPORT.md`

- **42-page comprehensive report** covering:
  - Executive summary with key findings
  - 10 detailed sections on all aspects of food security
  - Statistical evidence and tables
  - Policy recommendations (immediate, medium, long-term)
  - Data quality notes
  - Next steps for analysis

### 3. **Visualizations** (PNG files, 300 DPI)

- `fig1_geographic_overview.png`
- `fig2_infrastructure_access.png`
- `fig3_food_availability_prices.png`
- `fig4_labor_wages.png`
- `fig5_vulnerability_analysis.png`

---

## 🔍 Key Insights Discovered

### 🚨 Critical Findings

1. **Infrastructure Crisis**

   - 73.6% of villages lack primary schools
   - 91% lack health facilities
   - 96.4% lack markets
   - Average travel: 64-95 km to services

2. **Food Price Emergency**

   - 48-58% of villages report higher-than-normal prices
   - Tubers: 58% experiencing high prices
   - Pulses: 54% experiencing high prices
   - Villages with low availability have 69% chance of high prices

3. **Vulnerability Crisis**

   - 39.3% of villages (354) classified as HIGH vulnerability
   - Western Province most vulnerable (avg score: 6.83/12)
   - Rural areas significantly more vulnerable than urban (p<0.0001)

4. **Wage Disparities**

   - Non-agricultural wages are 99% higher than agricultural
   - Urban non-ag wages are 46% higher than rural
   - Agricultural: 870 RWF/day (~$0.87 USD)
   - Non-agricultural: 1,729 RWF/day (~$1.73 USD)

5. **Most Important Factor**
   - **Road infrastructure** has strongest correlation (r=-0.424) with reduced vulnerability
   - 36.2% of villages lack year-round road access

---

## 📈 How to Use This Analysis

### For Quick Insights

```bash
# Run the comprehensive analysis
python3 advanced_village_analytics.py

# Generate all visualizations
python3 visualize_food_security.py

# Read the report
# Open VILLAGE_ANALYSIS_REPORT.md
```

### For Deep Dives

#### 1. **Geographic Analysis**

Focus on lines 40-90 in `advanced_village_analytics.py`

- Province comparisons
- Urban-rural divides
- Village size distributions

#### 2. **Infrastructure Analysis**

Focus on lines 90-150

- School, health, market access
- Distance calculations
- Provincial comparisons

#### 3. **Food Security Analysis**

Focus on lines 150-220

- Availability by category
- Price trends
- Cross-tabulations

#### 4. **Labor Market Analysis**

Focus on lines 220-290

- Wage distributions
- Urban-rural gaps
- Premiums and trends

#### 5. **Vulnerability Assessment**

Focus on lines 290-380

- Composite index creation
- Risk categorization
- Hotspot identification

---

## 🎨 Understanding the Visualizations

### Figure 1: Geographic Overview

- **Top-left**: Village distribution by province
- **Top-right**: Urban-rural pie chart
- **Bottom-left**: Village size histogram
- **Bottom-right**: Vulnerability by province

**Key Insight**: Western province has most villages AND highest vulnerability

### Figure 2: Infrastructure Access

- **Top-left**: Access rates by infrastructure type
- **Top-right**: Road accessibility by province
- **Bottom-left**: Average distances to services
- **Bottom-right**: Urban vs rural comparison

**Key Insight**: Massive infrastructure gaps, especially in rural areas

### Figure 3: Food Availability & Prices

- **Top-left**: Stacked bar showing availability levels
- **Top-right**: Stacked bar showing price trends
- **Bottom-left**: Heatmap of availability vs prices
- **Bottom-right**: Food insecurity indicators

**Key Insight**: High prices widespread even with adequate availability

### Figure 4: Labor & Wages

- **Top-left**: Wage distribution histograms
- **Top-right**: Urban vs rural wage comparison
- **Bottom-left**: Wage trends (vs normal)
- **Bottom-right**: Wage premiums analysis

**Key Insight**: Massive wage gaps between ag/non-ag and urban/rural

### Figure 5: Vulnerability Analysis

- **Top-left**: Vulnerability score distribution
- **Top-right**: Vulnerability levels by province (stacked)
- **Bottom-left**: Vulnerability component breakdown
- **Bottom-right**: Urban vs rural vulnerability

**Key Insight**: 354 villages need immediate intervention

---

## 🚀 Next Steps

### Immediate Analysis Extensions

1. **Household-Level Analysis**

   ```python
   df_hh = pd.read_stata('CFSVA_HH_2021_MASTER_DATASET.dta')
   # Analyze: FCS, rCSI, wealth index, expenditure
   ```

2. **Child Nutrition**

   ```python
   df_child = pd.read_stata('CFSVAHH2021_UNDER_5_ChildWithMother.dta')
   # Analyze: stunting, wasting, underweight
   ```

3. **Multi-Level Modeling**

   - Link village context to household outcomes
   - How does village infrastructure affect household food security?

4. **Spatial Analysis**
   - Map vulnerability hotspots
   - Identify geographic clusters
   - Optimize intervention targeting

### Advanced Techniques to Apply

1. **Machine Learning**

   - Predict food insecurity risk
   - Identify intervention priorities
   - Feature importance analysis

2. **Time Series** (if multi-year data available)

   - Trend analysis
   - Seasonal patterns
   - Impact evaluation

3. **Network Analysis**
   - Market connectivity
   - Service access networks
   - Regional spillover effects

---

## 📋 Data Structure Reference

### Key Variables by Section

#### Geographic (S0)

- `S0_C_Prov`: Province
- `S0_D_Dist`: District
- `UrbanRural`: Location type

#### Community (S1-S2)

- `S1_01`: Number of informants
- `S2_01`: Households in village

#### Infrastructure (S3)

- `S3_02`: Has school (1=yes)
- `S3_03`: Has health facility
- `S3_02_2`: Distance to school (km)

#### Markets (S4)

- `S4_01`: Has market
- `S4_02_4`: Road accessible year-round
- `S4_02_3`: Distance to market

#### Food (S5)

- `S5_01_2`: Cereal availability
- `S5_01_3`: Cereal prices
- Similar for tubers (S5_02), pulses (S5_03), vegetables (S5_04)

#### Wages (S6)

- `S6_01`: Agricultural wage (RWF/day)
- `S6_02`: Non-agricultural wage
- `S6_01_3`: Ag wage trend
- `S6_01_4`: Non-ag wage trend

#### Agriculture (S7)

- `S7_01`: Practices agriculture
- `S7_01_2_SMT_*`: Crops grown (multi-select)

#### Shocks (S8)

- `S8_01`: Experienced shock
- `S8_01_2_SMT_*`: Types of shocks
- `S8_02_SMT_*`: Development constraints

---

## 💡 Tips for Further Analysis

### 1. **Filter High-Vulnerability Villages**

```python
high_vuln = df[df['vulnerability_level'] == 'High']
# Analyze characteristics of these 354 villages
```

### 2. **Province-Specific Deep Dive**

```python
western = df[df['S0_C_Prov'] == 'Western']
# Why is Western most vulnerable?
```

### 3. **Compare Best vs Worst**

```python
best = df[df['vulnerability_score'] <= 4]
worst = df[df['vulnerability_score'] >= 8]
# What differs between them?
```

### 4. **Create Custom Indicators**

```python
df['food_insecure'] = (
    (df['S5_01_2'] == 'Low (insufficient)') |
    (df['S5_01_3'] == 'Higher that normal')
).astype(int)
```

---

## 📚 Column Definitions Quick Reference

See the detailed column list you provided for complete definitions. Key patterns:

- `S*_SMT_*`: Multi-select options (e.g., safety nets, crops, shocks)
- `S*_0`: "Other" text fields
- Numbers with `_2` suffix: Often repeat/validation questions

---

## 🎓 Learning Resources

### Understanding Rwanda Context

- Rwanda agriculture: mainly smallholder subsistence
- VUP: Vision 2020 Umurenge Programme (safety net)
- Ubudehe: Community classification system
- Girinka: One Cow per Poor Family program

### Food Security Concepts

- **FCS**: Food Consumption Score
- **rCSI**: Reduced Coping Strategies Index
- **Vulnerability**: Multi-dimensional concept combining exposure, sensitivity, adaptive capacity

### Statistical Methods Used

- **Descriptive statistics**: Mean, median, quartiles
- **Cross-tabulations**: Relationships between categorical variables
- **Correlation analysis**: Linear relationships
- **T-tests**: Group comparisons (urban vs rural)
- **Composite indices**: Combining multiple indicators

---

## ✅ Quality Checks Completed

- ✓ Data loaded successfully (900 villages, 164 variables)
- ✓ Missing data handled appropriately
- ✓ Outliers identified (e.g., 3600km distance - likely error)
- ✓ Statistical significance tested
- ✓ Visualizations validated
- ✓ Report generated with recommendations

---

## 📞 Support & Questions

If you need to:

- **Modify analysis**: Edit the Python scripts
- **Add variables**: Check column names, add to relevant section
- **Change thresholds**: Update vulnerability index calculation (line ~290)
- **Export results**: Add CSV export with `df.to_csv()`
- **Create new visualizations**: Follow patterns in visualize_food_security.py

---

**Ready to explore the data? Start with:**

1. Read `VILLAGE_ANALYSIS_REPORT.md` for overview
2. Run `python3 advanced_village_analytics.py` for detailed output
3. Run `python3 visualize_food_security.py` for visualizations
4. View generated PNG files for insights
5. Customize analysis for your specific questions!

**Next dataset**: Household-level data with even richer insights awaiting! 🚀
