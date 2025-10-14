#!/usr/bin/env python3
"""
Rwanda CFSVA 2021 - Child Malnutrition Rates by District
Analysis of stunting, wasting, and underweight prevalence across 30 districts
"""

import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

print("="*80)
print("CHILD MALNUTRITION RATES BY DISTRICT - RWANDA CFSVA 2021")
print("="*80)

# Load child nutrition data
df = pd.read_stata('../data/CFSVAHH2021_UNDER_5_ChildWithMother.dta')

print(f"\nDataset Overview:")
print(f"  Total children: {len(df)}")
print(f"  Age range: 6-24 months")
print(f"  Total districts: {df['S0_D_Dist'].nunique()}")

# ============================================================================
# 1. OVERALL MALNUTRITION PREVALENCE
# ============================================================================
print("\n" + "="*80)
print("1. NATIONAL MALNUTRITION PREVALENCE")
print("="*80)

# Calculate national rates
stunting_moderate = (df['Stunting'] == 'Moderately stunted').sum()
stunting_severe = (df['Stunting'] == 'Severely stunted').sum()
stunting_total = stunting_moderate + stunting_severe
stunting_rate = (stunting_total / df['Stunting'].notna().sum() * 100)

wasting_moderate = (df['Wasting'] == 'Moderately wasted').sum()
wasting_severe = (df['Wasting'] == 'Severely wasted').sum()
wasting_total = wasting_moderate + wasting_severe
wasting_rate = (wasting_total / df['Wasting'].notna().sum() * 100)

underweight_moderate = (df['Underweight'] == 'Moderately underweight').sum()
underweight_severe = (df['Underweight'] == 'Severely underweight').sum()
underweight_total = underweight_moderate + underweight_severe
underweight_rate = (underweight_total / df['Underweight'].notna().sum() * 100)

print(f"\nNational Rates:")
print(f"  Stunting: {stunting_rate:.1f}% ({stunting_total}/{df['Stunting'].notna().sum()} children)")
print(f"    - Moderate: {stunting_moderate} ({stunting_moderate/df['Stunting'].notna().sum()*100:.1f}%)")
print(f"    - Severe: {stunting_severe} ({stunting_severe/df['Stunting'].notna().sum()*100:.1f}%)")
print(f"\n  Wasting: {wasting_rate:.1f}% ({wasting_total}/{df['Wasting'].notna().sum()} children)")
print(f"    - Moderate: {wasting_moderate} ({wasting_moderate/df['Wasting'].notna().sum()*100:.1f}%)")
print(f"    - Severe: {wasting_severe} ({wasting_severe/df['Wasting'].notna().sum()*100:.1f}%)")
print(f"\n  Underweight: {underweight_rate:.1f}% ({underweight_total}/{df['Underweight'].notna().sum()} children)")
print(f"    - Moderate: {underweight_moderate} ({underweight_moderate/df['Underweight'].notna().sum()*100:.1f}%)")
print(f"    - Severe: {underweight_severe} ({underweight_severe/df['Underweight'].notna().sum()*100:.1f}%)")

# ============================================================================
# 2. MALNUTRITION RATES BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("2. STUNTING RATES BY DISTRICT")
print("="*80)

# Calculate stunting by district
district_malnutrition = []

for district in sorted(df['S0_D_Dist'].dropna().unique()):
    district_df = df[df['S0_D_Dist'] == district]
    
    # Sample size
    n_total = len(district_df)
    n_measured = district_df['Stunting'].notna().sum()
    
    # Stunting
    stunted_mod = (district_df['Stunting'] == 'Moderately stunted').sum()
    stunted_sev = (district_df['Stunting'] == 'Severely stunted').sum()
    stunted_total = stunted_mod + stunted_sev
    stunting_pct = (stunted_total / n_measured * 100) if n_measured > 0 else 0
    
    # Wasting
    wasted_mod = (district_df['Wasting'] == 'Moderately wasted').sum()
    wasted_sev = (district_df['Wasting'] == 'Severely wasted').sum()
    wasted_total = wasted_mod + wasted_sev
    wasting_pct = (wasted_total / district_df['Wasting'].notna().sum() * 100) if district_df['Wasting'].notna().sum() > 0 else 0
    
    # Underweight
    underweight_mod = (district_df['Underweight'] == 'Moderately underweight').sum()
    underweight_sev = (district_df['Underweight'] == 'Severely underweight').sum()
    underweight_total = underweight_mod + underweight_sev
    underweight_pct = (underweight_total / district_df['Underweight'].notna().sum() * 100) if district_df['Underweight'].notna().sum() > 0 else 0
    
    # Province
    province = district_df['S0_C_Prov'].mode()[0] if len(district_df['S0_C_Prov'].mode()) > 0 else 'Unknown'
    
    district_malnutrition.append({
        'District': district,
        'Province': province,
        'Total_Children': n_total,
        'Measured': n_measured,
        'Stunted': stunted_total,
        'Stunting_Rate': stunting_pct,
        'Stunted_Moderate': stunted_mod,
        'Stunted_Severe': stunted_sev,
        'Wasted': wasted_total,
        'Wasting_Rate': wasting_pct,
        'Wasted_Moderate': wasted_mod,
        'Wasted_Severe': wasted_sev,
        'Underweight': underweight_total,
        'Underweight_Rate': underweight_pct,
        'Underweight_Moderate': underweight_mod,
        'Underweight_Severe': underweight_sev
    })

# Create dataframe
district_malnutrition_df = pd.DataFrame(district_malnutrition)

# Sort by stunting rate (highest to lowest)
district_malnutrition_df_sorted = district_malnutrition_df.sort_values('Stunting_Rate', ascending=False)

print("\nStunting Rates by District (Ranked Highest to Lowest):")
print("-" * 80)
print(f"{'Rank':<5} {'District':<20} {'Province':<15} {'Children':<10} {'Stunting %':<12} {'Moderate':<10} {'Severe':<8}")
print("-" * 80)

for idx, row in enumerate(district_malnutrition_df_sorted.iterrows(), 1):
    _, data = row
    print(f"{idx:<5} {data['District']:<20} {data['Province']:<15} {data['Total_Children']:<10} "
          f"{data['Stunting_Rate']:<11.1f}% {data['Stunted_Moderate']:<10} {data['Stunted_Severe']:<8}")

# ============================================================================
# 3. WASTING RATES BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("3. WASTING RATES BY DISTRICT")
print("="*80)

district_malnutrition_df_wasting = district_malnutrition_df.sort_values('Wasting_Rate', ascending=False)

print("\nWasting Rates by District (Ranked Highest to Lowest):")
print("-" * 80)
print(f"{'Rank':<5} {'District':<20} {'Province':<15} {'Children':<10} {'Wasting %':<12} {'Moderate':<10} {'Severe':<8}")
print("-" * 80)

for idx, row in enumerate(district_malnutrition_df_wasting.iterrows(), 1):
    _, data = row
    print(f"{idx:<5} {data['District']:<20} {data['Province']:<15} {data['Total_Children']:<10} "
          f"{data['Wasting_Rate']:<11.1f}% {data['Wasted_Moderate']:<10} {data['Wasted_Severe']:<8}")

# ============================================================================
# 4. UNDERWEIGHT RATES BY DISTRICT
# ============================================================================
print("\n" + "="*80)
print("4. UNDERWEIGHT RATES BY DISTRICT")
print("="*80)

district_malnutrition_df_underweight = district_malnutrition_df.sort_values('Underweight_Rate', ascending=False)

print("\nUnderweight Rates by District (Ranked Highest to Lowest):")
print("-" * 80)
print(f"{'Rank':<5} {'District':<20} {'Province':<15} {'Children':<10} {'Underweight %':<14} {'Moderate':<10} {'Severe':<8}")
print("-" * 80)

for idx, row in enumerate(district_malnutrition_df_underweight.iterrows(), 1):
    _, data = row
    print(f"{idx:<5} {data['District']:<20} {data['Province']:<15} {data['Total_Children']:<10} "
          f"{data['Underweight_Rate']:<13.1f}% {data['Underweight_Moderate']:<10} {data['Underweight_Severe']:<8}")

# ============================================================================
# 5. PROVINCIAL SUMMARY
# ============================================================================
print("\n" + "="*80)
print("5. PROVINCIAL SUMMARY")
print("="*80)

provincial_summary = district_malnutrition_df.groupby('Province').agg({
    'Total_Children': 'sum',
    'Stunted': 'sum',
    'Wasted': 'sum',
    'Underweight': 'sum',
    'Measured': 'sum'
})

provincial_summary['Stunting_Rate'] = (provincial_summary['Stunted'] / provincial_summary['Measured'] * 100)
provincial_summary['Wasting_Rate'] = (provincial_summary['Wasted'] / provincial_summary['Measured'] * 100)
provincial_summary['Underweight_Rate'] = (provincial_summary['Underweight'] / provincial_summary['Measured'] * 100)

print("\nMalnutrition Rates by Province:")
print(provincial_summary[['Total_Children', 'Stunting_Rate', 'Wasting_Rate', 'Underweight_Rate']].round(1).to_string())

# ============================================================================
# 6. HIGH-RISK DISTRICTS (STUNTING >= 35%)
# ============================================================================
print("\n" + "="*80)
print("6. HIGH-RISK DISTRICTS (Stunting >= 35%)")
print("="*80)

high_risk = district_malnutrition_df[district_malnutrition_df['Stunting_Rate'] >= 35.0].sort_values('Stunting_Rate', ascending=False)

if len(high_risk) > 0:
    print(f"\nFound {len(high_risk)} districts with stunting rates >= 35%:")
    print("-" * 80)
    for idx, row in high_risk.iterrows():
        print(f"\n{row['District']} ({row['Province']} Province)")
        print(f"  Sample: {row['Total_Children']} children")
        print(f"  Stunting: {row['Stunting_Rate']:.1f}% ({row['Stunted']} children)")
        print(f"    - Moderate: {row['Stunted_Moderate']}, Severe: {row['Stunted_Severe']}")
        print(f"  Wasting: {row['Wasting_Rate']:.1f}% ({row['Wasted']} children)")
        print(f"  Underweight: {row['Underweight_Rate']:.1f}% ({row['Underweight']} children)")
else:
    print("\nNo districts with stunting rates >= 35%")

# ============================================================================
# 7. LOW-RISK DISTRICTS (STUNTING < 20%)
# ============================================================================
print("\n" + "="*80)
print("7. LOW-RISK DISTRICTS (Stunting < 20%)")
print("="*80)

low_risk = district_malnutrition_df[district_malnutrition_df['Stunting_Rate'] < 20.0].sort_values('Stunting_Rate')

if len(low_risk) > 0:
    print(f"\nFound {len(low_risk)} districts with stunting rates < 20%:")
    print("-" * 80)
    for idx, row in low_risk.iterrows():
        print(f"\n{row['District']} ({row['Province']} Province)")
        print(f"  Sample: {row['Total_Children']} children")
        print(f"  Stunting: {row['Stunting_Rate']:.1f}% ({row['Stunted']} children)")
        print(f"  Wasting: {row['Wasting_Rate']:.1f}% ({row['Wasted']} children)")
        print(f"  Underweight: {row['Underweight_Rate']:.1f}% ({row['Underweight']} children)")
else:
    print("\nNo districts with stunting rates < 20%")

# ============================================================================
# 8. SAVE RESULTS
# ============================================================================
print("\n" + "="*80)
print("8. SAVING RESULTS")
print("="*80)

# Save comprehensive district malnutrition data
district_malnutrition_df_sorted.to_csv('district_malnutrition_rates.csv', index=False)
print("\nFiles saved:")
print("  1. district_malnutrition_rates.csv - Complete district-level data")

# Save summary report
with open('district_malnutrition_report.txt', 'w') as f:
    f.write("RWANDA CFSVA 2021 - CHILD MALNUTRITION BY DISTRICT\n")
    f.write("="*80 + "\n\n")
    
    f.write("NATIONAL SUMMARY\n")
    f.write("-"*80 + "\n")
    f.write(f"Total Children: {len(df)}\n")
    f.write(f"Stunting Rate: {stunting_rate:.1f}%\n")
    f.write(f"Wasting Rate: {wasting_rate:.1f}%\n")
    f.write(f"Underweight Rate: {underweight_rate:.1f}%\n\n")
    
    f.write("TOP 10 HIGHEST STUNTING DISTRICTS\n")
    f.write("-"*80 + "\n")
    for idx, (_, row) in enumerate(district_malnutrition_df_sorted.head(10).iterrows(), 1):
        f.write(f"{idx:2d}. {row['District']:<20s} ({row['Province']:<12s}): {row['Stunting_Rate']:5.1f}% "
                f"({row['Stunted']}/{row['Measured']} children)\n")
    
    f.write("\n\nTOP 10 LOWEST STUNTING DISTRICTS\n")
    f.write("-"*80 + "\n")
    for idx, (_, row) in enumerate(district_malnutrition_df_sorted.tail(10).iterrows(), 1):
        f.write(f"{idx:2d}. {row['District']:<20s} ({row['Province']:<12s}): {row['Stunting_Rate']:5.1f}% "
                f"({row['Stunted']}/{row['Measured']} children)\n")
    
    f.write("\n\nPROVINCIAL SUMMARY\n")
    f.write("-"*80 + "\n")
    for province, data in provincial_summary.iterrows():
        f.write(f"\n{province}:\n")
        f.write(f"  Children: {data['Total_Children']:.0f}\n")
        f.write(f"  Stunting: {data['Stunting_Rate']:.1f}%\n")
        f.write(f"  Wasting: {data['Wasting_Rate']:.1f}%\n")
        f.write(f"  Underweight: {data['Underweight_Rate']:.1f}%\n")

print("  2. district_malnutrition_report.txt - Summary report")

print("\n" + "="*80)
print("ANALYSIS COMPLETE!")
print("="*80)
print(f"\nKey Findings:")
print(f"  - Highest stunting district: {district_malnutrition_df_sorted.iloc[0]['District']} "
      f"({district_malnutrition_df_sorted.iloc[0]['Stunting_Rate']:.1f}%)")
print(f"  - Lowest stunting district: {district_malnutrition_df_sorted.iloc[-1]['District']} "
      f"({district_malnutrition_df_sorted.iloc[-1]['Stunting_Rate']:.1f}%)")
print(f"  - Districts with stunting >= 35%: {len(high_risk)}")
print(f"  - Districts with stunting < 20%: {len(low_risk)}")
