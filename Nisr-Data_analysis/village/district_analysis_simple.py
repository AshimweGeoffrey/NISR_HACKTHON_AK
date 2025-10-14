#!/usr/bin/env python3
"""
Rwanda CFSVA 2021 - District-Based Village Analysis
Analysis of 900 villages across 30 districts
"""

import pandas as pd
import numpy as np
warnings = pd.options.mode.chained_assignment = None

print("="*80)
print("RWANDA CFSVA 2021 - DISTRICT-BASED VILLAGE ANALYSIS")
print("="*80)

# Load data
df = pd.read_stata('../data/CFSVA_2021_VILLAGE.dta')

print(f"\nDataset Overview:")
print(f"  Total villages: {len(df)}")
print(f"  Total districts: {df['S0_D_Dist'].nunique()}")
print(f"  Villages per district: {len(df) // df['S0_D_Dist'].nunique()}")
print(f"  Total variables: {len(df.columns)}")

# ============================================================================
# 1. DISTRICT GEOGRAPHIC PROFILE
# ============================================================================
print("\n" + "="*80)
print("1. DISTRICT GEOGRAPHIC DISTRIBUTION")
print("="*80)

print("\nAll 30 Districts:")
district_counts = df['S0_D_Dist'].value_counts().sort_index()
for district, count in district_counts.items():
    print(f"  {district}: {count} villages")

# Urban/Rural by district
print("\n\nUrban/Rural Distribution by District:")
location_dist = pd.crosstab(df['S0_D_Dist'], df['UrbanRural'], normalize='index') * 100
print(location_dist.round(1).to_string())

# ============================================================================
# 2. CREATE DISTRICT SUMMARY
# ============================================================================
print("\n" + "="*80)
print("2. DISTRICT SUMMARY STATISTICS")
print("="*80)

# Count villages by district
district_summary = pd.DataFrame({
    'Villages': df.groupby('S0_D_Dist').size(),
    'Rural_Pct': (df[df['UrbanRural'] == 'Rural'].groupby('S0_D_Dist').size() / 
                  df.groupby('S0_D_Dist').size() * 100)
})

# Add province information
district_summary['Province'] = df.groupby('S0_D_Dist')['S0_C_Prov'].first()

print("\nDistrict Summary:")
print(district_summary.sort_values('Province').to_string())

# ============================================================================
# 3. PROVINCE-LEVEL SUMMARY
# ============================================================================
print("\n" + "="*80)
print("3. PROVINCE-LEVEL SUMMARY")
print("="*80)

province_summary = pd.DataFrame({
    'Districts': df.groupby('S0_C_Prov')['S0_D_Dist'].nunique(),
    'Villages': df.groupby('S0_C_Prov').size(),
    'Rural_Villages': df[df['UrbanRural'] == 'Rural'].groupby('S0_C_Prov').size(),
    'Urban_Villages': df[df['UrbanRural'] == 'Urban'].groupby('S0_C_Prov').size()
})
province_summary['Rural_Pct'] = (province_summary['Rural_Villages'] / 
                                 province_summary['Villages'] * 100).round(1)

print("\nProvince Overview:")
print(province_summary.to_string())

# ============================================================================
# 4. DETAILED VARIABLE ANALYSIS BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("4. AVAILABLE DATA BY DISTRICT")
print("="*80)

# Analyze numeric columns by district
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
print(f"\nTotal numeric variables: {len(numeric_cols)}")
print(f"Sample variables: {numeric_cols[:10]}")

# Create comprehensive district profile with available numeric data
district_profile = district_summary.copy()

# Add statistics for each numeric column with sufficient data
for col in numeric_cols[:20]:  # First 20 numeric columns
    non_null = df[col].notna().sum()
    if non_null > 100:  # Only include if >100 observations
        district_profile[f'{col}_mean'] = df.groupby('S0_D_Dist')[col].mean()

print(f"\nDistrict profile created with {len(district_profile.columns)} variables")

# ============================================================================
# 5. CATEGORICAL VARIABLE SUMMARY
# ============================================================================
print("\n" + "="*80)
print("5. CATEGORICAL VARIABLE PATTERNS")
print("="*80)

categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
print(f"\nTotal categorical variables: {len(categorical_cols)}")

# Show some key categorical variables by district
print("\nKey categorical patterns:")
for col in categorical_cols[:10]:
    unique_vals = df[col].nunique()
    if 2 <= unique_vals <= 10:  # Only show manageable categories
        print(f"\n{col} ({unique_vals} categories):")
        crosstab = pd.crosstab(df['S0_D_Dist'], df[col])
        print(f"  Total responses: {crosstab.sum().sum()}")

# ============================================================================
# 6. SAVE COMPREHENSIVE RESULTS
# ============================================================================
print("\n" + "="*80)
print("6. SAVING RESULTS")
print("="*80)

# Save district profile
district_profile.round(2).to_csv('district_comprehensive_profile.csv')
print("\nFiles saved:")
print("  1. district_comprehensive_profile.csv - All district metrics")

# Save summary for markdown report
summary_data = {
    'total_villages': len(df),
    'total_districts': df['S0_D_Dist'].nunique(),
    'total_provinces': df['S0_C_Prov'].nunique(),
    'urban_villages': len(df[df['UrbanRural'] == 'Urban']),
    'rural_villages': len(df[df['UrbanRural'] == 'Rural']),
    'urban_pct': (len(df[df['UrbanRural'] == 'Urban']) / len(df) * 100),
    'rural_pct': (len(df[df['UrbanRural'] == 'Rural']) / len(df) * 100),
    'variables': len(df.columns),
    'numeric_vars': len(numeric_cols),
    'categorical_vars': len(categorical_cols)
}

# Save to text file for markdown generation
with open('summary_stats.txt', 'w') as f:
    for key, value in summary_data.items():
        f.write(f"{key}: {value}\n")

print("  2. summary_stats.txt - Key statistics for report")

# Save district lists by province
with open('district_by_province.txt', 'w') as f:
    for province in df['S0_C_Prov'].unique():
        f.write(f"\n{province}:\n")
        districts = df[df['S0_C_Prov'] == province]['S0_D_Dist'].unique()
        for district in sorted(districts):
            village_count = len(df[(df['S0_C_Prov'] == province) & (df['S0_D_Dist'] == district)])
            rural_count = len(df[(df['S0_C_Prov'] == province) & 
                                (df['S0_D_Dist'] == district) & 
                                (df['UrbanRural'] == 'Rural')])
            f.write(f"  - {district}: {village_count} villages ({rural_count} rural, {village_count-rural_count} urban)\n")

print("  3. district_by_province.txt - District lists organized by province")

print("\n" + "="*80)
print("ANALYSIS COMPLETE!")
print("="*80)
print("\nReady to generate comprehensive markdown report!")
