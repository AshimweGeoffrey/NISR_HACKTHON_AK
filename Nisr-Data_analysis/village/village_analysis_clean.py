"""
COMPREHENSIVE FOOD SECURITY ANALYSIS - VILLAGE LEVEL DATA
Rwanda CFSVA 2021
=================================================================
This script performs deep analytics on village-level food security data
focusing on: infrastructure, market access, food availability, shocks,
safety nets, and agricultural practices.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# Set display options
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', 50)

# Set style for better visualizations
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['font.size'] = 10

print("=" * 80)
print("LOADING & EXPLORING VILLAGE DATA")
print("=" * 80)

# Load data
df = pd.read_stata('../data/CFSVA_2021_VILLAGE.dta')
df_village = df  # Use consistent naming

print(f"\nDataset loaded successfully!")
print(f"  - Total villages surveyed: {len(df_village)}")
print(f"  - Total columns: {len(df_village.columns)}")
print(f"  - Survey date range: {df_village['S0_B_DATE'].min()} to {df_village['S0_B_DATE'].max()}")

# ============================================================================
# SECTION 1: GEOGRAPHIC DISTRIBUTION
# ============================================================================
print("\n" + "=" * 80)
print("1. GEOGRAPHIC DISTRIBUTION & URBANIZATION")
print("=" * 80)

print("\nVILLAGES BY PROVINCE:")
province_dist = df_village['S0_C_Prov'].value_counts()
print(province_dist)
print(f"\nTotal provinces covered: {df_village['S0_C_Prov'].nunique()}")

print("\nURBAN vs RURAL DISTRIBUTION:")
urban_rural = df_village['UrbanRural'].value_counts()
urban_rural_pct = df_village['UrbanRural'].value_counts(normalize=True) * 100
for idx in urban_rural.index:
    print(f"  {idx}: {urban_rural[idx]} villages ({urban_rural_pct[idx]:.1f}%)")

print("\nURBANIZATION BY PROVINCE:")
urban_by_province = pd.crosstab(df_village['S0_C_Prov'], 
                                 df_village['UrbanRural'], 
                                 normalize='index') * 100
print(urban_by_province.round(1))

# ============================================================================
# SECTION 2: COMMUNITY CHARACTERISTICS
# ============================================================================
print("\n" + "=" * 80)
print("2. COMMUNITY CHARACTERISTICS")
print("=" * 80)

print("\nFOCUS GROUP COMPOSITION:")
if 'S1_01' in df_village.columns:
    print(f"  Average number of informants: {df_village['S1_01'].mean():.1f}")
if 'S1_01_2' in df_village.columns:
    print(f"  Average women in group: {df_village['S1_01_2'].mean():.1f}")
if 'S1_01_3' in df_village.columns:
    print(f"  Average men in group: {df_village['S1_01_3'].mean():.1f}")

print("\nVILLAGE SIZE:")
if 'S2_01' in df_village.columns:
    print(f"  Average households per village: {df_village['S2_01'].mean():.0f}")
    print(f"  Median households per village: {df_village['S2_01'].median():.0f}")
    print(f"  Smallest village: {df_village['S2_01'].min():.0f} households")
    print(f"  Largest village: {df_village['S2_01'].max():.0f} households")
    print(f"  Total households represented: {df_village['S2_01'].sum():.0f}")

# ============================================================================
# SECTION 3: SOCIAL SAFETY NETS
# ============================================================================
print("\n" + "=" * 80)
print("3. SOCIAL SAFETY NET PROGRAMS")
print("=" * 80)

safety_net_cols = {
    'S2_03_SMT_1': 'VUP Direct Support',
    'S2_03_SMT_2': 'VUP Public Works',
    'S2_03_SMT_3': 'VUP Credit Access',
    'S2_03_SMT_4': 'Ubudehe Credit',
    'S2_03_SMT_5': 'Girinka (One Cow per Poor Family)',
    'S2_03_SMT_6': 'One Cup of Milk per Child',
    'S2_03_SMT_7': 'Other Safety Nets',
    'S2_03_SMT_88': 'No Safety Nets'
}

print("\nSAFETY NET COVERAGE:")
safety_net_data = []
for col, name in safety_net_cols.items():
    if col in df_village.columns:
        # Check for actual values in column
        coverage = (df_village[col] == 1).sum()
        pct = (coverage / len(df_village)) * 100
        if coverage > 0:
            safety_net_data.append({'Program': name, 'Villages': coverage, 'Percentage': pct})
            print(f"  {name}: {coverage} villages ({pct:.1f}%)")

if not safety_net_data:
    print("  Note: Safety net data may be encoded differently or not available")

# ============================================================================
# SECTION 4: INFRASTRUCTURE ACCESS
# ============================================================================
print("\n" + "=" * 80)
print("4. INFRASTRUCTURE & SERVICES ACCESS")
print("=" * 80)

print("\nPRIMARY SCHOOL ACCESS:")
if 'S3_02' in df_village.columns:
    has_school = (df_village['S3_02'] == 1).sum()
    pct_school = (has_school / len(df_village)) * 100
    print(f"  Villages WITH primary school: {has_school} ({pct_school:.1f}%)")
    print(f"  Villages WITHOUT primary school: {len(df_village) - has_school} ({100-pct_school:.1f}%)")
    
if 'S3_02_2' in df_village.columns:
    no_school_villages = df_village[df_village['S3_02'] != 1]
    if len(no_school_villages) > 0:
        avg_dist = no_school_villages['S3_02_2'].mean()
        print(f"  Average distance to nearest school (for villages without): {avg_dist:.1f} km")

print("\nHEALTH FACILITY ACCESS:")
if 'S3_03' in df_village.columns:
    has_health = (df_village['S3_03'] == 1).sum()
    pct_health = (has_health / len(df_village)) * 100
    print(f"  Villages WITH health facility: {has_health} ({pct_health:.1f}%)")
    print(f"  Villages WITHOUT health facility: {len(df_village) - has_health} ({100-pct_health:.1f}%)")

if 'S3_03_2' in df_village.columns:
    no_health_villages = df_village[df_village['S3_03'] != 1]
    if len(no_health_villages) > 0:
        avg_dist = no_health_villages['S3_03_2'].mean()
        print(f"  Average distance to nearest health facility (for villages without): {avg_dist:.1f} km")

# Infrastructure by urban/rural
print("\nINFRASTRUCTURE BY LOCATION:")
if 'S3_02' in df_village.columns and 'UrbanRural' in df_village.columns:
    infra_comparison = pd.DataFrame({
        'Has School': df_village.groupby('UrbanRural')['S3_02'].apply(lambda x: (x==1).sum() / len(x) * 100),
        'Has Health Facility': df_village.groupby('UrbanRural')['S3_03'].apply(lambda x: (x==1).sum() / len(x) * 100) if 'S3_03' in df_village.columns else None
    })
    print(infra_comparison.round(1))

# ============================================================================
# SECTION 5: MARKET ACCESS & CHALLENGES
# ============================================================================
print("\n" + "=" * 80)
print("5. MARKET ACCESS & FOOD SYSTEM")
print("=" * 80)

print("\nMARKET PRESENCE:")
if 'S4_01' in df_village.columns:
    has_market = (df_village['S4_01'] == 1).sum()
    pct_market = (has_market / len(df_village)) * 100
    print(f"  Villages WITH market: {has_market} ({pct_market:.1f}%)")
    print(f"  Villages WITHOUT market: {len(df_village) - has_market} ({100-pct_market:.1f}%)")

if 'S4_02_3' in df_village.columns:
    no_market_villages = df_village[df_village['S4_01'] != 1]
    if len(no_market_villages) > 0:
        avg_dist = no_market_villages['S4_02_3'].mean()
        print(f"  Average distance to main market (for villages without): {avg_dist:.1f} km")

print("\nROAD ACCESSIBILITY:")
if 'S4_02_4' in df_village.columns:
    accessible = df_village['S4_02_4'].value_counts()
    print(accessible)
    
    # Months of inaccessibility
    print("\n  Months when roads are NOT accessible:")
    month_cols = {f'S4_02_5_SMT_{i}': ['January', 'February', 'March', 'April', 'May', 'June', 
                                       'July', 'August', 'September', 'October', 'November', 'December'][i-1] 
                  for i in range(1, 13)}
    inaccessible_months = []
    for col, month in month_cols.items():
        if col in df_village.columns:
            count = (df_village[col] == 1).sum()
            if count > 0:
                inaccessible_months.append(f"    {month}: {count} villages")
    
    if inaccessible_months:
        for line in inaccessible_months:
            print(line)
    else:
        print("    No data on specific months")

print("\nMARKET CHALLENGES:")
market_challenges = {
    'S4_02_6_SMT_1': 'Low purchasing power',
    'S4_02_6_SMT_2': 'Not enough variety of food',
    'S4_02_6_SMT_3': 'Not enough quantity of food',
    'S4_02_6_SMT_4': 'Loss of income/jobs',
    'S4_02_6_SMT_5': 'Reduced remittances',
    'S4_02_6_SMT_6': 'High food prices',
    'S4_02_6_SMT_7': 'Unusually high prices',
    'S4_02_6_SMT_8': 'Insecurity/conflict',
    'S4_02_6_SMT_9': 'Markets too far',
    'S4_02_6_SMT_10': 'Bad roads',
    'S4_02_6_SMT_88': 'No challenges'
}

market_challenge_data = []
for col, challenge in market_challenges.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            market_challenge_data.append({'Challenge': challenge, 'Villages': count, 'Percentage': pct})
            print(f"  {challenge}: {count} villages ({pct:.1f}%)")

if not market_challenge_data:
    print("  Note: Market challenge data may be encoded differently")

# ============================================================================
# SECTION 6: FOOD AVAILABILITY & PRICES
# ============================================================================
print("\n" + "=" * 80)
print("6. FOOD AVAILABILITY & PRICE ASSESSMENT")
print("=" * 80)

print("\nCEREALS CONSUMPTION:")
cereal_types = {
    'S5_01_SMT_1': 'Wheat',
    'S5_01_SMT_2': 'Maize',
    'S5_01_SMT_3': 'Sorghum',
    'S5_01_SMT_4': 'Rice'
}
cereal_data = []
for col, name in cereal_types.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            cereal_data.append({'Food': name, 'Villages': count, 'Percentage': pct})
            print(f"  {name}: {count} villages ({pct:.1f}%)")

if 'S5_01_2' in df_village.columns:
    print("\n  Cereal Availability Rating:")
    print(df_village['S5_01_2'].value_counts())

if 'S5_01_3' in df_village.columns:
    print("\n  Cereal Price Comparison (vs normal):")
    print(df_village['S5_01_3'].value_counts())

print("\nTUBERS & ROOTS CONSUMPTION:")
tuber_types = {
    'S5_02_SMT_1': 'Sweet Potato',
    'S5_02_SMT_2': 'Irish Potato',
    'S5_02_SMT_3': 'Cassava',
    'S5_02_SMT_6': 'Cooking Banana'
}
for col, name in tuber_types.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            print(f"  {name}: {count} villages ({pct:.1f}%)")

if 'S5_02_2' in df_village.columns:
    print("\n  Tubers Availability Rating:")
    print(df_village['S5_02_2'].value_counts())

if 'S5_02_3' in df_village.columns:
    print("\n  Tubers Price Comparison (vs normal):")
    print(df_village['S5_02_3'].value_counts())

print("\nPULSES & LEGUMES CONSUMPTION:")
pulse_types = {
    'S5_03_SMT_1': 'Beans',
    'S5_03_SMT_2': 'Peas',
    'S5_03_SMT_3': 'Soya',
    'S5_03_SMT_4': 'Ground nuts'
}
for col, name in pulse_types.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            print(f"  {name}: {count} villages ({pct:.1f}%)")

if 'S5_03_2' in df_village.columns:
    print("\n  Pulses Availability Rating:")
    print(df_village['S5_03_2'].value_counts())

if 'S5_03_3' in df_village.columns:
    print("\n  Pulses Price Comparison (vs normal):")
    print(df_village['S5_03_3'].value_counts())

# ============================================================================
# SECTION 7: LABOR & WAGES
# ============================================================================
print("\n" + "=" * 80)
print("7. LABOR MARKET & WAGES")
print("=" * 80)

if 'S6_01' in df_village.columns:
    print("\nAGRICULTURAL LABOR WAGES:")
    print(f"  Average daily wage: {df_village['S6_01'].mean():.0f} RWF")
    print(f"  Median daily wage: {df_village['S6_01'].median():.0f} RWF")
    print(f"  Range: {df_village['S6_01'].min():.0f} - {df_village['S6_01'].max():.0f} RWF")

if 'S6_01_3' in df_village.columns:
    print("\n  Agricultural Wage Comparison (vs normal):")
    print(df_village['S6_01_3'].value_counts())

if 'S6_02' in df_village.columns:
    print("\nNON-AGRICULTURAL LABOR WAGES:")
    print(f"  Average daily wage: {df_village['S6_02'].mean():.0f} RWF")
    print(f"  Median daily wage: {df_village['S6_02'].median():.0f} RWF")
    print(f"  Range: {df_village['S6_02'].min():.0f} - {df_village['S6_02'].max():.0f} RWF")

if 'S6_01_4' in df_village.columns:
    print("\n  Non-Agricultural Wage Comparison (vs normal):")
    print(df_village['S6_01_4'].value_counts())

# Wage comparison by urban/rural
if 'S6_01' in df_village.columns and 'UrbanRural' in df_village.columns:
    print("\nWAGES BY LOCATION:")
    wage_by_location = df_village.groupby('UrbanRural')[['S6_01', 'S6_02']].mean()
    wage_by_location.columns = ['Agricultural Wage (RWF)', 'Non-Ag Wage (RWF)']
    print(wage_by_location.round(0))

# ============================================================================
# SECTION 8: AGRICULTURAL PRACTICES
# ============================================================================
print("\n" + "=" * 80)
print("8. AGRICULTURAL PRACTICES")
print("=" * 80)

if 'S7_01' in df_village.columns:
    practice_ag = (df_village['S7_01'] == 1).sum()
    pct = (practice_ag / len(df_village)) * 100
    print(f"\nVillages practicing agriculture: {practice_ag} ({pct:.1f}%)")

print("\nMAIN CROPS GROWN:")
crop_cols = {
    'S7_01_2_SMT_12': 'Maize',
    'S7_01_2_SMT_14': 'Rice',
    'S7_01_2_SMT_21': 'Sweet Potato',
    'S7_01_2_SMT_22': 'Irish Potato',
    'S7_01_2_SMT_23': 'Cassava',
    'S7_01_2_SMT_26': 'Cooking Banana',
    'S7_01_2_SMT_51': 'Beans',
    'S7_01_2_SMT_31': 'Tomato',
    'S7_01_2_SMT_32': 'Cabbage'
}

crop_data = []
for col, crop in crop_cols.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            crop_data.append({'Crop': crop, 'Villages': count, 'Percentage': pct})

if crop_data:
    crop_df = pd.DataFrame(crop_data).sort_values('Villages', ascending=False)
    for _, row in crop_df.iterrows():
        print(f"  {row['Crop']}: {row['Villages']:.0f} villages ({row['Percentage']:.1f}%)")
else:
    print("  Note: Crop data may be encoded differently")

print("\nCASH CROPS:")
cash_crops = {
    'S7_01_2_SMT_61': 'Tea',
    'S7_01_2_SMT_62': 'Coffee',
    'S7_01_2_SMT_64': 'Sugar cane'
}
cash_crop_data = []
for col, crop in cash_crops.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            cash_crop_data.append({'Crop': crop, 'Villages': count})
            print(f"  {crop}: {count} villages ({pct:.1f}%)")

if not cash_crop_data:
    print("  Note: Cash crop data may be encoded differently")

# ============================================================================
# SECTION 9: SHOCKS & VULNERABILITIES
# ============================================================================
print("\n" + "=" * 80)
print("9. SHOCKS & VULNERABILITIES")
print("=" * 80)

if 'S8_01' in df_village.columns:
    experienced_shock = (df_village['S8_01'] == 1).sum()
    pct = (experienced_shock / len(df_village)) * 100
    print(f"\nVillages experiencing shocks in past 12 months: {experienced_shock} ({pct:.1f}%)")

print("\nTYPES OF SHOCKS:")
shock_cols = {
    'S8_01_2_SMT_1': 'Drought',
    'S8_01_2_SMT_2': 'Floods',
    'S8_01_2_SMT_3': 'Landslides',
    'S8_01_2_SMT_4': 'Crop disease/pests',
    'S8_01_2_SMT_5': 'Livestock disease',
    'S8_01_2_SMT_6': 'High food prices',
    'S8_01_2_SMT_7': 'Loss of employment',
    'S8_01_2_SMT_8': 'Insecurity/conflict',
    'S8_01_2_SMT_9': 'COVID-19 pandemic'
}

shock_data = []
for col, shock in shock_cols.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            shock_data.append({'Shock': shock, 'Villages': count, 'Percentage': pct})

if shock_data:
    shock_df = pd.DataFrame(shock_data).sort_values('Villages', ascending=False)
    for _, row in shock_df.iterrows():
        print(f"  {row['Shock']}: {row['Villages']:.0f} villages ({row['Percentage']:.1f}%)")
else:
    print("  Note: Shock data may be encoded differently")

print("\nCOMMUNITY DEVELOPMENT CONSTRAINTS:")
constraint_cols = {
    'S8_02_SMT_1': 'Low purchasing power',
    'S8_02_SMT_6': 'High food prices',
    'S8_02_SMT_4': 'Loss of income/jobs',
    'S8_02_SMT_9': 'Market access problems',
    'S8_02_SMT_10': 'Bad roads',
    'S8_02_SMT_8': 'Insecurity',
    'S8_02_SMT_88': 'No constraints'
}

constraint_data = []
for col, constraint in constraint_cols.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            constraint_data.append({'Constraint': constraint, 'Villages': count})
            print(f"  {constraint}: {count} villages ({pct:.1f}%)")

if not constraint_data:
    print("  Note: Constraint data may be encoded differently")

# ============================================================================
# SECTION 10: KEY INSIGHTS SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("10. KEY INSIGHTS SUMMARY")
print("=" * 80)

print("\nFOOD SECURITY SITUATION:")
if 'S5_01_2' in df_village.columns:
    low_cereal = (df_village['S5_01_2'] == 'Low (insufficient)').sum()
    pct_low = (low_cereal / len(df_village)) * 100
    print(f"  Villages with LOW cereal availability: {low_cereal} ({pct_low:.1f}%)")

if 'S5_01_3' in df_village.columns:
    high_price = (df_village['S5_01_3'] == 'Higher that normal').sum()
    pct_high = (high_price / len(df_village)) * 100
    print(f"  Villages with HIGHER THAN NORMAL cereal prices: {high_price} ({pct_high:.1f}%)")

print("\nACCESS TO SERVICES:")
if 'S3_02' in df_village.columns:
    no_school = (df_village['S3_02'] != 1).sum()
    pct_no_school = (no_school / len(df_village)) * 100
    print(f"  Villages WITHOUT primary school: {no_school} ({pct_no_school:.1f}%)")

if 'S3_03' in df_village.columns:
    no_health = (df_village['S3_03'] != 1).sum()
    pct_no_health = (no_health / len(df_village)) * 100
    print(f"  Villages WITHOUT health facility: {no_health} ({pct_no_health:.1f}%)")

if 'S4_01' in df_village.columns:
    no_market = (df_village['S4_01'] != 1).sum()
    pct_no_market = (no_market / len(df_village)) * 100
    print(f"  Villages WITHOUT market: {no_market} ({pct_no_market:.1f}%)")

print("\n" + "=" * 80)
print("ANALYSIS COMPLETE!")
print("=" * 80)
print("\nData files are now organized in the 'data/' directory")
print("This analysis provides a comprehensive overview of village-level food security")
