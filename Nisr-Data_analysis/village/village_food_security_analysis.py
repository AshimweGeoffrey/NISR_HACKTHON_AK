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
print("LOADING VILLAGE-LEVEL FOOD SECURITY DATA")
print("=" * 80)

# Load the village dataset
df_village = pd.read_stata('../data/CFSVA_2021_VILLAGE.dta')

print(f"\n✓ Dataset loaded successfully!")
print(f"  - Total villages surveyed: {len(df_village)}")
print(f"  - Total columns: {len(df_village.columns)}")
print(f"  - Survey date range: {df_village['S0_B_DATE'].min()} to {df_village['S0_B_DATE'].max()}")

# ============================================================================
# SECTION 1: GEOGRAPHIC DISTRIBUTION
# ============================================================================
print("\n" + "=" * 80)
print("1. GEOGRAPHIC DISTRIBUTION & URBANIZATION")
print("=" * 80)

print("\n📍 VILLAGES BY PROVINCE:")
province_dist = df_village['S0_C_Prov'].value_counts()
print(province_dist)
print(f"\nTotal provinces covered: {df_village['S0_C_Prov'].nunique()}")

print("\n🏘️ URBAN vs RURAL DISTRIBUTION:")
urban_rural = df_village['UrbanRural'].value_counts()
urban_rural_pct = df_village['UrbanRural'].value_counts(normalize=True) * 100
for idx in urban_rural.index:
    print(f"  {idx}: {urban_rural[idx]} villages ({urban_rural_pct[idx]:.1f}%)")

print("\n🏘️ URBANIZATION BY PROVINCE:")
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

print("\n👥 FOCUS GROUP COMPOSITION:")
if 'S1_01' in df_village.columns:
    print(f"  Average number of informants: {df_village['S1_01'].mean():.1f}")
if 'S1_01_2' in df_village.columns:
    print(f"  Average women in group: {df_village['S1_01_2'].mean():.1f}")
if 'S1_01_3' in df_village.columns:
    print(f"  Average men in group: {df_village['S1_01_3'].mean():.1f}")

print("\n🏠 VILLAGE SIZE:")
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

print("\n🛡️ SAFETY NET COVERAGE:")
for col, name in safety_net_cols.items():
    if col in df_village.columns:
        coverage = (df_village[col] == 1).sum()
        pct = (coverage / len(df_village)) * 100
        print(f"  {name}: {coverage} villages ({pct:.1f}%)")

# Safety nets by urban/rural
print("\n🛡️ SAFETY NET ACCESS: URBAN vs RURAL")
for col, name in list(safety_net_cols.items())[:6]:  # Top 6 programs
    if col in df_village.columns:
        by_urban = pd.crosstab(df_village['UrbanRural'], 
                               df_village[col] == 1, 
                               normalize='index') * 100
        if True in by_urban.columns:
            print(f"\n{name}:")
            print(by_urban[True].round(1))

# ============================================================================
# SECTION 4: INFRASTRUCTURE ACCESS
# ============================================================================
print("\n" + "=" * 80)
print("4. INFRASTRUCTURE & SERVICES ACCESS")
print("=" * 80)

print("\n🏫 PRIMARY SCHOOL ACCESS:")
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

print("\n🏥 HEALTH FACILITY ACCESS:")
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
print("\n📊 INFRASTRUCTURE BY LOCATION:")
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

print("\n🏪 MARKET PRESENCE:")
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

print("\n🛣️ ROAD ACCESSIBILITY:")
if 'S4_02_4' in df_village.columns:
    accessible = df_village['S4_02_4'].value_counts()
    print(accessible)
    
    # Months of inaccessibility
    print("\n  Months when roads are NOT accessible:")
    month_cols = {f'S4_02_5_SMT_{i}': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i-1] 
                  for i in range(1, 13)}
    for col, month in month_cols.items():
        if col in df_village.columns:
            count = (df_village[col] == 1).sum()
            if count > 0:
                print(f"    {month}: {count} villages")

print("\n⚠️ MARKET CHALLENGES:")
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

for col, challenge in market_challenges.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            print(f"  {challenge}: {count} villages ({pct:.1f}%)")

# ============================================================================
# SECTION 6: FOOD AVAILABILITY & PRICES
# ============================================================================
print("\n" + "=" * 80)
print("6. FOOD AVAILABILITY & PRICE ASSESSMENT")
print("=" * 80)

print("\n🌾 CEREALS:")
cereal_types = {
    'S5_01_SMT_1': 'Wheat',
    'S5_01_SMT_2': 'Maize',
    'S5_01_SMT_3': 'Sorghum',
    'S5_01_SMT_4': 'Rice'
}
for col, name in cereal_types.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        print(f"  {name}: {count} villages ({pct:.1f}%)")

if 'S5_01_2' in df_village.columns:
    print("\n  Cereal Availability Rating:")
    print(df_village['S5_01_2'].value_counts())

if 'S5_01_3' in df_village.columns:
    print("\n  Cereal Price Comparison (vs normal):")
    print(df_village['S5_01_3'].value_counts())

print("\n🥔 TUBERS & ROOTS:")
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
        print(f"  {name}: {count} villages ({pct:.1f}%)")

if 'S5_02_2' in df_village.columns:
    print("\n  Tubers Availability Rating:")
    print(df_village['S5_02_2'].value_counts())

if 'S5_02_3' in df_village.columns:
    print("\n  Tubers Price Comparison (vs normal):")
    print(df_village['S5_02_3'].value_counts())

print("\n🫘 PULSES & LEGUMES:")
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
        print(f"  {name}: {count} villages ({pct:.1f}%)")

if 'S5_03_2' in df_village.columns:
    print("\n  Pulses Availability Rating:")
    print(df_village['S5_03_2'].value_counts())

# ============================================================================
# SECTION 7: LABOR & WAGES
# ============================================================================
print("\n" + "=" * 80)
print("7. LABOR MARKET & WAGES")
print("=" * 80)

if 'S6_01' in df_village.columns:
    print("\n💰 AGRICULTURAL LABOR WAGES:")
    print(f"  Average daily wage: {df_village['S6_01'].mean():.0f} RWF")
    print(f"  Median daily wage: {df_village['S6_01'].median():.0f} RWF")
    print(f"  Range: {df_village['S6_01'].min():.0f} - {df_village['S6_01'].max():.0f} RWF")

if 'S6_01_3' in df_village.columns:
    print("\n  Agricultural Wage Comparison (vs normal):")
    print(df_village['S6_01_3'].value_counts())

if 'S6_02' in df_village.columns:
    print("\n💼 NON-AGRICULTURAL LABOR WAGES:")
    print(f"  Average daily wage: {df_village['S6_02'].mean():.0f} RWF")
    print(f"  Median daily wage: {df_village['S6_02'].median():.0f} RWF")
    print(f"  Range: {df_village['S6_02'].min():.0f} - {df_village['S6_02'].max():.0f} RWF")

if 'S6_01_4' in df_village.columns:
    print("\n  Non-Agricultural Wage Comparison (vs normal):")
    print(df_village['S6_01_4'].value_counts())

# Wage comparison by urban/rural
if 'S6_01' in df_village.columns and 'UrbanRural' in df_village.columns:
    print("\n💵 WAGES BY LOCATION:")
    wage_by_location = df_village.groupby('UrbanRural')[['S6_01', 'S6_02']].mean()
    wage_by_location.columns = ['Agricultural Wage', 'Non-Ag Wage']
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
    print(f"\n🌱 Villages practicing agriculture: {practice_ag} ({pct:.1f}%)")

print("\n🌾 MAIN CROPS GROWN:")
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
        crop_data.append({'Crop': crop, 'Villages': count, 'Percentage': pct})

crop_df = pd.DataFrame(crop_data).sort_values('Villages', ascending=False)
for _, row in crop_df.iterrows():
    print(f"  {row['Crop']}: {row['Villages']:.0f} villages ({row['Percentage']:.1f}%)")

print("\n☕ CASH CROPS:")
cash_crops = {
    'S7_01_2_SMT_61': 'Tea',
    'S7_01_2_SMT_62': 'Coffee',
    'S7_01_2_SMT_64': 'Sugar cane'
}
for col, crop in cash_crops.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        print(f"  {crop}: {count} villages ({pct:.1f}%)")

# ============================================================================
# SECTION 9: SHOCKS & VULNERABILITIES
# ============================================================================
print("\n" + "=" * 80)
print("9. SHOCKS & VULNERABILITIES")
print("=" * 80)

if 'S8_01' in df_village.columns:
    experienced_shock = (df_village['S8_01'] == 1).sum()
    pct = (experienced_shock / len(df_village)) * 100
    print(f"\n⚠️ Villages experiencing shocks in past 12 months: {experienced_shock} ({pct:.1f}%)")

print("\n🌪️ TYPES OF SHOCKS:")
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
    print("  No shock data available in expected columns")

print("\n🚧 COMMUNITY DEVELOPMENT CONSTRAINTS:")
constraint_cols = {
    'S8_02_SMT_1': 'Low purchasing power',
    'S8_02_SMT_6': 'High food prices',
    'S8_02_SMT_4': 'Loss of income/jobs',
    'S8_02_SMT_9': 'Market access problems',
    'S8_02_SMT_10': 'Bad roads',
    'S8_02_SMT_8': 'Insecurity',
    'S8_02_SMT_88': 'No constraints'
}

for col, constraint in constraint_cols.items():
    if col in df_village.columns:
        count = (df_village[col] == 1).sum()
        pct = (count / len(df_village)) * 100
        if count > 0:
            print(f"  {constraint}: {count} villages ({pct:.1f}%)")

# ============================================================================
# SECTION 10: COMPOSITE VULNERABILITY INDEX
# ============================================================================
print("\n" + "=" * 80)
print("10. VILLAGE VULNERABILITY COMPOSITE INDEX")
print("=" * 80)

# Create vulnerability score (higher = more vulnerable)
vulnerability_score = pd.Series(0, index=df_village.index)

# Infrastructure access (lack of = +1 each)
if 'S3_02' in df_village.columns:
    vulnerability_score += (df_village['S3_02'] != 1).astype(int)
if 'S3_03' in df_village.columns:
    vulnerability_score += (df_village['S3_03'] != 1).astype(int)
if 'S4_01' in df_village.columns:
    vulnerability_score += (df_village['S4_01'] != 1).astype(int)

# Market challenges (+1 for each major challenge)
for col in ['S4_02_6_SMT_1', 'S4_02_6_SMT_6', 'S4_02_6_SMT_9']:
    if col in df_village.columns:
        vulnerability_score += (df_village[col] == 1).astype(int)

# Shocks (+2 for experiencing shocks)
if 'S8_01' in df_village.columns:
    vulnerability_score += (df_village['S8_01'] == 1).astype(int) * 2

# No safety nets (+1)
if 'S2_03_SMT_88' in df_village.columns:
    vulnerability_score += (df_village['S2_03_SMT_88'] == 1).astype(int)

df_village['vulnerability_score'] = vulnerability_score

print("\n📊 VULNERABILITY DISTRIBUTION:")
print(f"  Mean vulnerability score: {vulnerability_score.mean():.2f}")
print(f"  Median vulnerability score: {vulnerability_score.median():.2f}")
print(f"  Score range: {vulnerability_score.min():.0f} - {vulnerability_score.max():.0f}")

# Categorize vulnerability
df_village['vulnerability_category'] = pd.cut(vulnerability_score, 
                                              bins=[0, 2, 4, 10],
                                              labels=['Low', 'Medium', 'High'])

print("\n📈 VILLAGES BY VULNERABILITY LEVEL:")
vuln_dist = df_village['vulnerability_category'].value_counts()
for category in ['Low', 'Medium', 'High']:
    if category in vuln_dist.index:
        count = vuln_dist[category]
        pct = (count / len(df_village)) * 100
        print(f"  {category} vulnerability: {count} villages ({pct:.1f}%)")

# Vulnerability by province
print("\n🗺️ VULNERABILITY BY PROVINCE:")
if 'S0_C_Prov' in df_village.columns:
    vuln_by_prov = df_village.groupby('S0_C_Prov')['vulnerability_score'].mean().sort_values(ascending=False)
    for prov, score in vuln_by_prov.items():
        print(f"  {prov}: {score:.2f}")

print("\n" + "=" * 80)
print("✓ ANALYSIS COMPLETE!")
print("=" * 80)
print("\nKey insights generated. Ready for visualization and deeper analysis.")
