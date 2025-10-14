#!/usr/bin/env python3
"""
Rwanda CFSVA 2021 - Comprehensive District-Based Village Analysis
Analysis of 900 villages across 30 districts
"""

import pandas as pd
import numpy as np
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

print("="*80)
print("LOADING VILLAGE DATA - DISTRICT-BASED ANALYSIS")
print("="*80)

# Load data
df = pd.read_stata('../data/CFSVA_2021_VILLAGE.dta')

print(f"\nDataset loaded successfully!")
print(f"  Total villages: {len(df)}")
print(f"  Total districts: {df['S0_D_Dist'].nunique()}")
print(f"  Villages per district: {len(df) // df['S0_D_Dist'].nunique()}")

# ============================================================================
# 1. DISTRICT PROFILE
# ============================================================================
print("\n" + "="*80)
print("1. DISTRICT GEOGRAPHIC DISTRIBUTION")
print("="*80)

district_counts = df['S0_D_Dist'].value_counts().sort_index()
print(f"\nAll 30 Districts (30 villages each):")
for district, count in district_counts.items():
    print(f"  {district}: {count} villages")

# Location type by district
location_by_district = pd.crosstab(df['S0_D_Dist'], df['S1Q1_Location'], normalize='index') * 100
print("\n\nUrban/Rural Distribution by District:")
print(location_by_district.round(1))

# ============================================================================
# 2. INFRASTRUCTURE ACCESS BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("2. INFRASTRUCTURE ACCESS BY DISTRICT")
print("="*80)

# Water access
water_by_district = df.groupby('S0_D_Dist')['S2Q1_Time_Water'].mean()
print("\n\nAverage time to water source (minutes) by district:")
print(water_by_district.sort_values(ascending=False).round(1))

# Market access
market_by_district = df.groupby('S0_D_Dist')['S2Q3_Time_Market'].mean()
print("\n\nAverage time to market (minutes) by district:")
print(market_by_district.sort_values(ascending=False).round(1))

# Health facility access
health_by_district = df.groupby('S0_D_Dist')['S2Q2_Time_Health'].mean()
print("\n\nAverage time to health facility (minutes) by district:")
print(health_by_district.sort_values(ascending=False).round(1))

# ============================================================================
# 3. FOOD PRICES BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("3. FOOD PRICES BY DISTRICT")
print("="*80)

# Key staple prices
staples = {
    'S3Q1a_Beans': 'Beans (RWF/kg)',
    'S3Q1c_Maize': 'Maize (RWF/kg)',
    'S3Q1e_Rice': 'Rice (RWF/kg)',
    'S3Q1g_IrishPotatoes': 'Irish Potatoes (RWF/kg)',
    'S3Q1i_SweetPotatoes': 'Sweet Potatoes (RWF/kg)'
}

for col, name in staples.items():
    print(f"\n{name} by district:")
    prices = df.groupby('S0_D_Dist')[col].mean()
    print(prices.sort_values(ascending=False).round(0))

# ============================================================================
# 4. AGRICULTURAL WAGES BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("4. AGRICULTURAL WAGES BY DISTRICT")
print("="*80)

# Daily agricultural wages
wages_cols = ['S4Q1a_Wage_AgriMale', 'S4Q1b_Wage_AgriFemale']
print("\nMean daily agricultural wages (RWF) by district:")
wage_by_district = df.groupby('S0_D_Dist')[wages_cols].mean()
print(wage_by_district.round(0))

# Gender wage gap
wage_by_district['Gap'] = wage_by_district['S4Q1a_Wage_AgriMale'] - wage_by_district['S4Q1b_Wage_AgriFemale']
wage_by_district['Gap_Pct'] = (wage_by_district['Gap'] / wage_by_district['S4Q1b_Wage_AgriFemale'] * 100)
print("\n\nGender wage gap by district:")
print(wage_by_district[['Gap', 'Gap_Pct']].sort_values('Gap_Pct', ascending=False).round(1))

# ============================================================================
# 5. FOOD SECURITY VULNERABILITY INDEX BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("5. VULNERABILITY INDEX BY DISTRICT")
print("="*80)

# Create vulnerability index based on multiple factors
vulnerability_data = df.copy()

# Infrastructure access (poor access = 1, good = 0)
vulnerability_data['infra_water'] = (df['S2Q1_Time_Water'] > df['S2Q1_Time_Water'].median()).astype(int)
vulnerability_data['infra_market'] = (df['S2Q3_Time_Market'] > df['S2Q3_Time_Market'].median()).astype(int)
vulnerability_data['infra_health'] = (df['S2Q2_Time_Health'] > df['S2Q2_Time_Health'].median()).astype(int)

# Food prices (high prices = 1, low = 0)
vulnerability_data['price_beans'] = (df['S3Q1a_Beans'] > df['S3Q1a_Beans'].median()).astype(int)
vulnerability_data['price_maize'] = (df['S3Q1c_Maize'] > df['S3Q1c_Maize'].median()).astype(int)
vulnerability_data['price_rice'] = (df['S3Q1e_Rice'] > df['S3Q1e_Rice'].median()).astype(int)

# Wages (low wages = 1, high = 0)
vulnerability_data['wage_male'] = (df['S4Q1a_Wage_AgriMale'] < df['S4Q1a_Wage_AgriMale'].median()).astype(int)
vulnerability_data['wage_female'] = (df['S4Q1b_Wage_AgriFemale'] < df['S4Q1b_Wage_AgriFemale'].median()).astype(int)

# Calculate total vulnerability score (0-8)
vuln_cols = ['infra_water', 'infra_market', 'infra_health', 'price_beans', 
             'price_maize', 'price_rice', 'wage_male', 'wage_female']
vulnerability_data['vuln_score'] = vulnerability_data[vuln_cols].sum(axis=1)

# District-level vulnerability
district_vulnerability = vulnerability_data.groupby('S0_D_Dist')['vuln_score'].agg(['mean', 'std'])
district_vulnerability['high_vuln_pct'] = (vulnerability_data.groupby('S0_D_Dist')['vuln_score']
                                           .apply(lambda x: (x >= 5).sum() / len(x) * 100))

print("\nVulnerability Index by District (0-8 scale, higher = more vulnerable):")
print(district_vulnerability.sort_values('mean', ascending=False).round(2))

# ============================================================================
# 6. MARKET FUNCTIONALITY BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("6. MARKET FUNCTIONALITY BY DISTRICT")
print("="*80)

# Food availability in markets
food_avail_cols = [col for col in df.columns if 'S3Q2' in col and 'Availability' in col]
if food_avail_cols:
    print("\nFood availability in markets by district:")
    for col in food_avail_cols[:5]:  # First 5 items
        avail = pd.crosstab(df['S0_D_Dist'], df[col], normalize='index') * 100
        if 'Available' in avail.columns:
            print(f"\n{col}:")
            print(avail['Available'].sort_values(ascending=False).round(1))

# ============================================================================
# 7. AGRICULTURAL PRODUCTION BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("7. AGRICULTURAL CONTEXT BY DISTRICT")
print("="*80)

# Land availability
if 'S5Q1_Land_Cultivable' in df.columns:
    land_by_district = pd.crosstab(df['S0_D_Dist'], df['S5Q1_Land_Cultivable'], 
                                   normalize='index') * 100
    print("\nCultivable land availability by district:")
    print(land_by_district.round(1))

# ============================================================================
# 8. STATISTICAL SUMMARY BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("8. COMPREHENSIVE DISTRICT RANKINGS")
print("="*80)

# Create comprehensive district profile
district_profile = pd.DataFrame({
    'Villages': df.groupby('S0_D_Dist').size(),
    'Avg_Water_Time': df.groupby('S0_D_Dist')['S2Q1_Time_Water'].mean(),
    'Avg_Market_Time': df.groupby('S0_D_Dist')['S2Q3_Time_Market'].mean(),
    'Avg_Health_Time': df.groupby('S0_D_Dist')['S2Q2_Time_Health'].mean(),
    'Bean_Price': df.groupby('S0_D_Dist')['S3Q1a_Beans'].mean(),
    'Rice_Price': df.groupby('S0_D_Dist')['S3Q1e_Rice'].mean(),
    'Male_Wage': df.groupby('S0_D_Dist')['S4Q1a_Wage_AgriMale'].mean(),
    'Female_Wage': df.groupby('S0_D_Dist')['S4Q1b_Wage_AgriFemale'].mean(),
    'Vuln_Score': vulnerability_data.groupby('S0_D_Dist')['vuln_score'].mean()
})

print("\n\nTOP 10 MOST VULNERABLE DISTRICTS:")
top_vulnerable = district_profile.nlargest(10, 'Vuln_Score')
for idx, (district, row) in enumerate(top_vulnerable.iterrows(), 1):
    print(f"\n{idx}. {district}")
    print(f"   Vulnerability Score: {row['Vuln_Score']:.2f}/8")
    print(f"   Water access: {row['Avg_Water_Time']:.0f} min")
    print(f"   Market access: {row['Avg_Market_Time']:.0f} min")
    print(f"   Daily wages: Male {row['Male_Wage']:.0f} RWF, Female {row['Female_Wage']:.0f} RWF")

print("\n\nTOP 10 LEAST VULNERABLE DISTRICTS:")
least_vulnerable = district_profile.nsmallest(10, 'Vuln_Score')
for idx, (district, row) in enumerate(least_vulnerable.iterrows(), 1):
    print(f"\n{idx}. {district}")
    print(f"   Vulnerability Score: {row['Vuln_Score']:.2f}/8")
    print(f"   Water access: {row['Avg_Water_Time']:.0f} min")
    print(f"   Market access: {row['Avg_Market_Time']:.0f} min")
    print(f"   Daily wages: Male {row['Male_Wage']:.0f} RWF, Female {row['Female_Wage']:.0f} RWF")

# ============================================================================
# SAVE RESULTS TO FILE FOR MD REPORT
# ============================================================================
print("\n" + "="*80)
print("SAVING COMPREHENSIVE RESULTS")
print("="*80)

# Save district profile to CSV for reference
district_profile.round(2).to_csv('district_profile_summary.csv')
print("\nDistrict profile saved to: district_profile_summary.csv")

# Save detailed results
with open('district_analysis_detailed.txt', 'w') as f:
    f.write("RWANDA CFSVA 2021 - DISTRICT-BASED ANALYSIS\n")
    f.write("="*80 + "\n\n")
    
    f.write("VULNERABILITY RANKINGS\n")
    f.write("-"*80 + "\n")
    vuln_ranked = district_profile.sort_values('Vuln_Score', ascending=False)
    for idx, (district, row) in enumerate(vuln_ranked.iterrows(), 1):
        f.write(f"{idx:2d}. {district:20s} - Score: {row['Vuln_Score']:.2f}/8\n")
    
    f.write("\n\nINFRASTRUCTURE ACCESS RANKINGS\n")
    f.write("-"*80 + "\n")
    f.write("\nWater Access (minutes to source):\n")
    water_ranked = district_profile.sort_values('Avg_Water_Time', ascending=False)
    for idx, (district, time) in enumerate(water_ranked['Avg_Water_Time'].items(), 1):
        f.write(f"{idx:2d}. {district:20s} - {time:.1f} minutes\n")
    
    f.write("\n\nFOOD PRICE RANKINGS\n")
    f.write("-"*80 + "\n")
    f.write("\nBean Prices (RWF/kg):\n")
    bean_ranked = district_profile.sort_values('Bean_Price', ascending=False)
    for idx, (district, price) in enumerate(bean_ranked['Bean_Price'].items(), 1):
        f.write(f"{idx:2d}. {district:20s} - {price:.0f} RWF\n")
    
    f.write("\n\nWAGE RANKINGS\n")
    f.write("-"*80 + "\n")
    f.write("\nMale Agricultural Wages (RWF/day):\n")
    wage_ranked = district_profile.sort_values('Male_Wage', ascending=False)
    for idx, (district, wage) in enumerate(wage_ranked['Male_Wage'].items(), 1):
        f.write(f"{idx:2d}. {district:20s} - {wage:.0f} RWF\n")

print("Detailed rankings saved to: district_analysis_detailed.txt")

print("\n" + "="*80)
print("DISTRICT-BASED ANALYSIS COMPLETE!")
print("="*80)
print("\nKey outputs generated:")
print("  1. district_profile_summary.csv - Comprehensive district metrics")
print("  2. district_analysis_detailed.txt - Detailed rankings")
print("\nReady to generate markdown report!")
