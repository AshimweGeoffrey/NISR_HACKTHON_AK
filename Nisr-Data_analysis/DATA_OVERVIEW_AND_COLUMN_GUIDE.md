# Rwanda Food Security Data - CFSVA 2021
## Comprehensive Data Overview and Column Guide

---

## 📊 Dataset Summary

This workspace contains **3 datasets** from the Rwanda Comprehensive Food Security and Vulnerability Analysis (CFSVA) 2021:

### 1. **Main Household Dataset** (`CFSVA_HH_2021_MASTER_DATASET.dta`)
- **9,000 households** surveyed
- **1,080 variables** covering multiple domains
- Most comprehensive dataset with household-level information

### 2. **Village Dataset** (`CFSVA_2021_VILLAGE.dta`)
- **900 villages** surveyed
- **164 variables** on village-level characteristics
- Community infrastructure and services

### 3. **Under-5 Children Dataset** (`CFSVAHH2021_UNDER_5_ChildWithMother.dta`)
- **1,690 children under 5 years**
- **134 variables** on child nutrition and feeding practices
- Includes anthropometric measurements

---

## 🗺️ Geographic Coverage

### Provinces (5):
- **Southern**: 2,400 households (26.7%)
- **Western**: 2,100 households (23.3%)
- **Eastern**: 2,100 households (23.3%)
- **Northern**: 1,500 households (16.7%)
- **Kigali City**: 900 households (10.0%)

### Districts: 30 districts covered

### Urban/Rural:
- **Rural**: 7,840 households (87.1%)
- **Urban**: 1,160 households (12.9%)

---

## 🔑 Key Variable Categories

### 1. **GEOGRAPHIC & ADMINISTRATIVE VARIABLES**

| Variable | Description | Type |
|----------|-------------|------|
| `S0_B_DATE` | Survey date | Date |
| `S0_C_Prov` | Province (Kigali city, Northern, Southern, Eastern, Western) | Categorical |
| `S0_D_Dist` | District | Categorical |
| `UrbanRural` | Urban or Rural location | Categorical |
| `S0_E_Livezone` | Livelihood zone | Categorical |
| `VHHSize` | Village household size | Numeric |
| `FinalWeight` | Survey weight for statistical analysis | Numeric |

### 2. **FOOD SECURITY INDICATORS**

#### Food Consumption Score (FCS)
| Variable | Description | Values/Stats |
|----------|-------------|--------------|
| `FCS` | Food Consumption Score (composite indicator) | Mean: 45.88, Range: 10-112 |
| `FCG` | Food Consumption Groups | Poor (280), Borderline (2,189), Acceptable (6,531) |
| `Starch` | Starch consumption frequency | Numeric |
| `Pulses` | Pulses consumption frequency | Numeric |
| `Milk` | Milk consumption frequency | Numeric |
| `Meat` | Meat/protein consumption frequency | Numeric |
| `Vegetables` | Vegetable consumption frequency | Numeric |
| `Fruit` | Fruit consumption frequency | Numeric |
| `Oil` | Oil/fat consumption frequency | Numeric |
| `Sugar` | Sugar consumption frequency | Numeric |

#### Food Security Status
| Variable | Description | Distribution |
|----------|-------------|--------------|
| `FS_final` | Final food security classification | Food secure (40.3%), Marginally food secure (38.4%), Moderately food insecure (19.4%), Severely food insecure (1.9%) |
| `chronically_FS` | Chronic food security status | Binary |

#### Food Group Consumption
| Variable | Description |
|----------|-------------|
| `FG_VitACat` | Vitamin A rich food consumption category |
| `FG_ProteinCat` | Protein rich food consumption category |
| `FG_HIronCat` | Heme iron rich food consumption category |

### 3. **COPING STRATEGIES**

| Variable | Description | Distribution |
|----------|-------------|--------------|
| `stress_coping` | Stress-level coping strategies | 3,808 HH adopting (42.3%) |
| `crisis_coping` | Crisis-level coping strategies | 2,397 HH adopting (26.6%) |
| `emergency_coping` | Emergency-level coping strategies | 492 HH adopting (5.5%) |
| `Max_coping_behaviour` | Maximum coping behavior category | No coping (48.3%), Stress (22.0%), Crisis (24.3%), Emergency (5.5%) |

**Common Coping Strategies Include:**
- Selling assets
- Borrowing food/money
- Reducing meal portions
- Sending children to eat elsewhere
- Selling productive assets (emergency)

### 4. **HOUSEHOLD ECONOMICS**

#### Expenditure Variables (Annual, in RWF)
| Variable | Description | Mean | Median |
|----------|-------------|------|--------|
| `FIE` | Food expenditure | 23,757 | 13,500 |
| `NFIE` | Non-food expenditure | 41,682 | 10,968 |
| `T_EXP` | Total expenditure | 65,438 | 26,923 |
| `An_HH_EXP` | Annual household expenditure | - | - |
| `AnPerCap_EXP` | Annual per capita expenditure | 175,297 | 76,615 |
| `PerCap_FIE` | Per capita food expenditure | - | - |
| `share_exp_cat` | Share of expenditure category | - | - |

#### Wealth & Income
| Variable | Description | Distribution |
|----------|-------------|--------------|
| `WI_cat` | Wealth Index Category | Poorest (19.0%), Poor (22.3%), Medium (15.8%), Wealth (27.0%), Wealthiest (16.0%) |
| `Income_Quintile` | Income Quintile | Lowest (24.4%), Low (18.6%), Medium (22.7%), High (13.9%), Highest (20.5%) |

### 5. **HOUSEHOLD DEMOGRAPHICS**

| Variable | Description |
|----------|-------------|
| `respondent_gender` | Gender of respondent |
| `S1_01` through `S1_01_10` | Household roster information |
| Household size variables | Number of members |
| Age and sex composition | Age groups and gender distribution |
| Education levels | Household member education |
| Disability status | Disability indicators |

### 6. **CHILD NUTRITION INDICATORS** (Under-5 Dataset)

#### Anthropometric Measurements
| Variable | Description | Key Statistics |
|----------|-------------|----------------|
| `weight` | Child weight (kg) | - |
| `height` | Child height/length (cm) | - |
| `muac` | Mid-upper arm circumference | - |
| `oedema` | Presence of bilateral pitting edema | - |

#### Nutrition Indices
| Variable | Description | Prevalence |
|----------|-------------|------------|
| `WAZ` | Weight-for-Age Z-score | - |
| `HAZ` | Height-for-Age Z-score | - |
| `WHZ` | Weight-for-Height Z-score | - |
| `Stunting` | Stunting status (chronic malnutrition) | 29.2% (354 moderate + 125 severe) |
| `Wasting` | Wasting status (acute malnutrition) | 3.0% (36 moderate + 14 severe) |
| `Underweight` | Underweight status | 9.5% (115 moderate + 41 severe) |

#### Infant and Young Child Feeding (IYCF)
| Variable | Description | Stats |
|----------|-------------|------|
| `minimumDietaryDiversity` | Meets minimum dietary diversity | 42.3% meet |
| `minimumMealFrequency` | Meets minimum meal frequency | - |
| `atLeast2Milk` | Consumed at least 2 milk feedings | - |
| `minimumAcceptableDiet` | Meets minimum acceptable diet | 19.5% meet |
| `ageCat` | Age category of child | - |

#### Mother's Characteristics
| Variable | Description |
|----------|-------------|
| `mother_education` | Mother's education level |
| `mother_read_and_write` | Mother's literacy status |
| `mother_disability` | Mother's disability status |
| `mother_marital_status` | Mother's marital status |

### 7. **VILLAGE-LEVEL VARIABLES** (Village Dataset)

The village dataset contains information on:
- **Infrastructure**: Roads, markets, health facilities
- **Services**: Schools, water sources, electricity
- **Agriculture**: Farming practices, irrigation, livestock
- **Shocks**: Natural disasters, conflicts, price changes
- **Programs**: Safety nets, food assistance, development programs

Common prefixes:
- `S1_` - Basic village information
- `S2_` - Infrastructure and services
- `S3_` - Agriculture and livelihoods
- `S4_` - Health and education services
- `S5_` - Water and sanitation
- `S6_` - Markets and prices
- `S7_` - Shocks and hazards
- `S8_` - Programs and assistance

---

## 📈 Key Findings Summary

### Food Security Status (2021)
- **40.3%** Food secure
- **38.4%** Marginally food secure
- **19.4%** Moderately food insecure
- **1.9%** Severely food insecure
- **Total food insecure: 21.3%**

### Food Consumption
- Mean FCS: **45.88** (Borderline to Acceptable)
- **72.6%** have acceptable consumption
- **24.3%** have borderline consumption
- **3.1%** have poor consumption

### Coping Strategies
- **51.7%** of households adopting some coping strategies
- Most common: stress-level strategies (reduced food quality/quantity)
- Emergency strategies (selling productive assets): **5.5%**

### Child Nutrition (Under-5)
- **Stunting**: 29.2% (chronic malnutrition indicator)
- **Wasting**: 3.0% (acute malnutrition indicator)
- **Underweight**: 9.5%
- Only **19.5%** of children meet minimum acceptable diet

### Economic Status
- Median annual household expenditure: **26,923 RWF**
- Food accounts for **~36%** of total expenditure
- Significant wealth disparity across quintiles

---

## 🔍 Data Analysis Suggestions

### Potential Analyses:

1. **Geographic Analysis**
   - Food security by province/district
   - Urban vs rural disparities
   - Livelihood zone analysis

2. **Vulnerability Analysis**
   - Identify most vulnerable populations
   - Coping strategy patterns
   - Wealth and food security correlation

3. **Nutrition Analysis**
   - Child malnutrition hotspots
   - Maternal factors affecting child nutrition
   - Dietary diversity patterns

4. **Economic Analysis**
   - Expenditure patterns by wealth quintile
   - Food vs non-food expenditure
   - Income sources and food security

5. **Temporal Analysis**
   - Seasonal variations (if data available)
   - Comparison with previous surveys

6. **Multivariate Analysis**
   - Determinants of food insecurity
   - Risk factors for child malnutrition
   - Protective factors for food security

---

## 📝 Important Notes

### Survey Weights
- Use `FinalWeight` for all statistical analyses to ensure representative estimates
- Weights account for sampling design and non-response

### Missing Values
- Check for missing values in each variable before analysis
- Some variables may have "Don't know" or "Refused" categories

### Data Types
- **Categorical**: 472 variables (use for grouping and classification)
- **Numeric**: 323 float64 + 8 int16 + 67 int32 + 90 int8
- **Text**: 120 object variables

### Confidentiality
- This is microdata - ensure proper data handling
- Aggregate results for reporting
- Don't identify individual households

---

## 🚀 Getting Started with Analysis

### Recommended First Steps:

1. **Load and explore the data**
   ```python
   import pandas as pd
   df_hh = pd.read_stata('CFSVA_HH_2021_MASTER_DATASET.dta')
   df_village = pd.read_stata('CFSVA_2021_VILLAGE.dta')
   df_child = pd.read_stata('CFSVAHH2021_UNDER_5_ChildWithMother.dta')
   ```

2. **Check data quality**
   - Missing values
   - Outliers
   - Data consistency

3. **Apply survey weights**
   ```python
   # For weighted means
   weighted_mean = np.average(df_hh['FCS'], weights=df_hh['FinalWeight'])
   ```

4. **Start with descriptive statistics**
   - Provincial summaries
   - Urban/rural comparisons
   - Key indicator distributions

5. **Create visualizations**
   - Maps of food insecurity
   - Charts of key indicators
   - Trend analysis

---

**Dataset Source**: National Institute of Statistics of Rwanda (NISR)
**Survey Year**: 2021
**Survey Type**: Comprehensive Food Security and Vulnerability Analysis (CFSVA)

---

*This guide provides an overview of the main variables. For detailed questionnaires and methodology, refer to the survey documentation.*
