"""
Rwanda Food Security Analysis - Starter Script
CFSVA 2021 Data Analysis

This script provides a foundation for analyzing the Rwanda food security datasets.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Set display options
pd.set_option('display.max_columns', 50)
pd.set_option('display.width', 1000)
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# Define data paths
DATA_DIR = Path('/home/micro/Nisr 2021 food security/Microdata')
HH_FILE = DATA_DIR / 'CFSVA_HH_2021_MASTER_DATASET.dta'
VILLAGE_FILE = DATA_DIR / 'CFSVA_2021_VILLAGE.dta'
CHILD_FILE = DATA_DIR / 'CFSVAHH2021_UNDER_5_ChildWithMother.dta'

print("=" * 80)
print("Loading Rwanda Food Security Datasets...")
print("=" * 80)

# Load datasets
df_household = pd.read_stata(HH_FILE)
df_village = pd.read_stata(VILLAGE_FILE)
df_child = pd.read_stata(CHILD_FILE)

print(f"\n✓ Loaded {len(df_household):,} households")
print(f"✓ Loaded {len(df_village):,} villages")
print(f"✓ Loaded {len(df_child):,} children under 5")

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def weighted_mean(df, variable, weight_col='FinalWeight'):
    """Calculate weighted mean for a variable."""
    return np.average(df[variable].dropna(), weights=df.loc[df[variable].notna(), weight_col])

def weighted_percentage(df, variable, weight_col='FinalWeight'):
    """Calculate weighted percentage distribution."""
    grouped = df.groupby(variable)[weight_col].sum()
    return (grouped / grouped.sum() * 100).round(2)

def create_crosstab(df, row_var, col_var, weight_col='FinalWeight'):
    """Create weighted crosstab."""
    pivot = df.pivot_table(values=weight_col, index=row_var, columns=col_var, aggfunc='sum', fill_value=0)
    return pivot.div(pivot.sum(axis=1), axis=0) * 100

# ============================================================================
# BASIC DATA EXPLORATION
# ============================================================================

print("\n" + "=" * 80)
print("BASIC DATA EXPLORATION")
print("=" * 80)

print("\n1. GEOGRAPHIC DISTRIBUTION")
print("-" * 40)
print("\nProvinces:")
print(weighted_percentage(df_household, 'S0_C_Prov'))

print("\nUrban vs Rural:")
print(weighted_percentage(df_household, 'UrbanRural'))

print("\n2. FOOD SECURITY STATUS")
print("-" * 40)
food_sec = weighted_percentage(df_household, 'FS_final')
print(food_sec)

print("\n3. FOOD CONSUMPTION SCORE")
print("-" * 40)
print(f"Weighted Mean FCS: {weighted_mean(df_household, 'FCS'):.2f}")
print("\nFood Consumption Groups:")
print(weighted_percentage(df_household, 'FCG'))

print("\n4. COPING STRATEGIES")
print("-" * 40)
print(weighted_percentage(df_household, 'Max_coping_behaviour'))

print("\n5. WEALTH DISTRIBUTION")
print("-" * 40)
print(weighted_percentage(df_household, 'WI_cat'))

# ============================================================================
# CHILD NUTRITION ANALYSIS
# ============================================================================

print("\n" + "=" * 80)
print("CHILD NUTRITION INDICATORS")
print("=" * 80)

print("\n1. STUNTING (Chronic Malnutrition)")
print("-" * 40)
stunting_dist = df_child['Stunting'].value_counts()
print(stunting_dist)
print(f"Total Stunted: {(stunting_dist.get('Moderately stunted', 0) + stunting_dist.get('Severely stunted', 0)) / len(df_child) * 100:.1f}%")

print("\n2. WASTING (Acute Malnutrition)")
print("-" * 40)
wasting_dist = df_child['Wasting'].value_counts()
print(wasting_dist)
print(f"Total Wasted: {(wasting_dist.get('Moderately wasted', 0) + wasting_dist.get('Severely wasted', 0)) / len(df_child) * 100:.1f}%")

print("\n3. DIETARY DIVERSITY")
print("-" * 40)
print(df_child['minimumDietaryDiversity'].value_counts())

print("\n4. MINIMUM ACCEPTABLE DIET")
print("-" * 40)
print(df_child['minimumAcceptableDiet'].value_counts())

# ============================================================================
# EXAMPLE ANALYSES
# ============================================================================

print("\n" + "=" * 80)
print("EXAMPLE: FOOD SECURITY BY PROVINCE")
print("=" * 80)

# Food security by province
fs_by_province = create_crosstab(df_household, 'S0_C_Prov', 'FS_final')
print(fs_by_province.round(1))

print("\n" + "=" * 80)
print("EXAMPLE: FOOD SECURITY BY URBAN/RURAL")
print("=" * 80)

# Food security by urban/rural
fs_by_urban = create_crosstab(df_household, 'UrbanRural', 'FS_final')
print(fs_by_urban.round(1))

print("\n" + "=" * 80)
print("EXAMPLE: COPING STRATEGIES BY WEALTH QUINTILE")
print("=" * 80)

# Coping by wealth
coping_by_wealth = create_crosstab(df_household, 'WI_cat', 'Max_coping_behaviour')
print(coping_by_wealth.round(1))

# ============================================================================
# SAVE CLEANED DATASETS (OPTIONAL)
# ============================================================================

print("\n" + "=" * 80)
print("Analysis Complete!")
print("=" * 80)
print("\nDatasets are loaded and ready for further analysis.")
print("\nAvailable DataFrames:")
print("  - df_household: Main household dataset")
print("  - df_village: Village-level dataset")
print("  - df_child: Under-5 children dataset")
print("\nHelper functions available:")
print("  - weighted_mean(df, variable)")
print("  - weighted_percentage(df, variable)")
print("  - create_crosstab(df, row_var, col_var)")
print("\n" + "=" * 80)

# ============================================================================
# NEXT STEPS SUGGESTIONS
# ============================================================================

print("\n📊 SUGGESTED NEXT STEPS:")
print("-" * 80)
print("""
1. GEOGRAPHIC ANALYSIS
   - Map food insecurity by district
   - Identify hotspots for interventions
   
2. VULNERABILITY PROFILING
   - Characteristics of food insecure households
   - Risk factors analysis
   
3. NUTRITION DEEP DIVE
   - Child malnutrition correlates
   - Maternal factors analysis
   
4. ECONOMIC ANALYSIS
   - Expenditure patterns
   - Income sources and food security
   
5. MULTIVARIATE MODELING
   - Logistic regression for food insecurity
   - Determinants of child malnutrition
   
6. VISUALIZATION
   - Create dashboards
   - Generate maps and charts
""")

print("=" * 80)
