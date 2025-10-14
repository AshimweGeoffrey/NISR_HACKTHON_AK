"""
ADVANCED FOOD SECURITY ANALYTICS - VILLAGE LEVEL
Rwanda CFSVA 2021
=================================================================
Deep-dive analytics with visualizations and statistical insights
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# Enhanced display settings
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
sns.set_palette("husl")
plt.rcParams['figure.figsize'] = (14, 8)

print("=" * 80)
print("LOADING & EXPLORING VILLAGE DATA")
print("=" * 80)

# Load data
df = pd.read_stata('../data/CFSVA_2021_VILLAGE.dta')
print(f"\n✓ Loaded {len(df)} villages with {len(df.columns)} variables")

# Explore column structure
print("\n📊 COLUMN GROUPS:")
column_groups = {}
for col in df.columns:
    if col.startswith('S'):
        section = col.split('_')[0]
        if section not in column_groups:
            column_groups[section] = []
        column_groups[section].append(col)

for section, cols in sorted(column_groups.items()):
    print(f"  {section}: {len(cols)} columns")

# ============================================================================
# GEOGRAPHIC & DEMOGRAPHIC ANALYSIS
# ============================================================================
print("\n" + "=" * 80)
print("SECTION 1: GEOGRAPHIC & DEMOGRAPHIC ANALYSIS")
print("=" * 80)

# Province distribution
print("\n📍 PROVINCE DISTRIBUTION:")
prov_dist = df['S0_C_Prov'].value_counts()
prov_pct = (prov_dist / len(df) * 100).round(1)
for prov in prov_dist.index:
    print(f"  {prov}: {prov_dist[prov]} villages ({prov_pct[prov]}%)")

# Urban-Rural
print("\n🏘️ URBAN vs RURAL:")
urban_dist = df['UrbanRural'].value_counts()
for ur in urban_dist.index:
    pct = (urban_dist[ur] / len(df) * 100).round(1)
    print(f"  {ur}: {urban_dist[ur]} villages ({pct}%)")

# Village size analysis
print("\n🏠 VILLAGE SIZE STATISTICS:")
village_size = df['S2_01'].dropna()
print(f"  Total households: {village_size.sum():,.0f}")
print(f"  Average per village: {village_size.mean():.0f}")
print(f"  Median: {village_size.median():.0f}")
print(f"  Std deviation: {village_size.std():.0f}")
print(f"  Range: {village_size.min():.0f} - {village_size.max():.0f}")

# Quartile analysis
quartiles = village_size.quantile([0.25, 0.5, 0.75])
print(f"\n  Quartiles:")
print(f"    25th percentile: {quartiles[0.25]:.0f} households")
print(f"    50th percentile: {quartiles[0.50]:.0f} households")
print(f"    75th percentile: {quartiles[0.75]:.0f} households")

# Size by urban/rural
print("\n  Village size by location:")
size_by_ur = df.groupby('UrbanRural')['S2_01'].agg(['mean', 'median', 'std'])
print(size_by_ur.round(0))

# ============================================================================
# INFRASTRUCTURE ACCESS ANALYSIS
# ============================================================================
print("\n" + "=" * 80)
print("SECTION 2: INFRASTRUCTURE ACCESS")
print("=" * 80)

# School access
print("\n🏫 SCHOOL ACCESS:")
has_school = df['S3_02'].value_counts()
print(f"  Villages with school: {has_school.get(1, 0)} ({has_school.get(1, 0)/len(df)*100:.1f}%)")
print(f"  Villages without school: {has_school.get(0, 0)} ({has_school.get(0, 0)/len(df)*100:.1f}%)")

no_school = df[df['S3_02'] != 1]['S3_03_2'].dropna()
if len(no_school) > 0:
    print(f"\n  For villages without school:")
    print(f"    Average distance to nearest: {no_school.mean():.1f} km")
    print(f"    Median distance: {no_school.median():.1f} km")
    print(f"    Maximum distance: {no_school.max():.1f} km")

# Health facility access
print("\n🏥 HEALTH FACILITY ACCESS:")
has_health = df['S3_03'].value_counts()
print(f"  Villages with facility: {has_health.get(1, 0)} ({has_health.get(1, 0)/len(df)*100:.1f}%)")
print(f"  Villages without facility: {has_health.get(0, 0)} ({has_health.get(0, 0)/len(df)*100:.1f}%)")

no_health = df[df['S3_03'] != 1]['S3_03_2'].dropna()
if len(no_health) > 0:
    print(f"\n  For villages without health facility:")
    print(f"    Average distance to nearest: {no_health.mean():.1f} km")
    print(f"    Median distance: {no_health.median():.1f} km")
    print(f"    Maximum distance: {no_health.max():.1f} km")

# Infrastructure by province
print("\n📊 INFRASTRUCTURE BY PROVINCE:")
infra_by_prov = df.groupby('S0_C_Prov').agg({
    'S3_02': lambda x: (x == 1).sum() / len(x) * 100,
    'S3_03': lambda x: (x == 1).sum() / len(x) * 100
})
infra_by_prov.columns = ['% with School', '% with Health']
print(infra_by_prov.round(1))

# ============================================================================
# MARKET ACCESS & FOOD SYSTEM
# ============================================================================
print("\n" + "=" * 80)
print("SECTION 3: MARKET ACCESS & CHALLENGES")
print("=" * 80)

# Market presence
print("\n🏪 MARKET PRESENCE:")
has_market = df['S4_01'].value_counts()
print(f"  Villages with market: {has_market.get(1, 0)} ({has_market.get(1, 0)/len(df)*100:.1f}%)")
print(f"  Villages without market: {has_market.get(0, 0)} ({has_market.get(0, 0)/len(df)*100:.1f}%)")

# Distance to market
no_market = df[df['S4_01'] != 1]['S4_02_3'].dropna()
if len(no_market) > 0:
    print(f"\n  Distance to main market (for villages without):")
    print(f"    Average: {no_market.mean():.1f} km")
    print(f"    Median: {no_market.median():.1f} km")
    print(f"    Range: {no_market.min():.1f} - {no_market.max():.1f} km")

# Road accessibility
print("\n🛣️ ROAD ACCESSIBILITY:")
road_access = df['S4_02_4'].value_counts()
for val in road_access.index:
    pct = (road_access[val] / len(df) * 100).round(1)
    print(f"  {val}: {road_access[val]} villages ({pct}%)")

# Road access by province
print("\n  Road accessibility by province:")
road_by_prov = df.groupby('S0_C_Prov')['S4_02_4'].apply(
    lambda x: (x == 'Yes').sum() / len(x) * 100
).round(1)
for prov, pct in road_by_prov.sort_values(ascending=False).items():
    print(f"    {prov}: {pct}%")

# ============================================================================
# FOOD AVAILABILITY & PRICES
# ============================================================================
print("\n" + "=" * 80)
print("SECTION 4: FOOD AVAILABILITY & PRICE DYNAMICS")
print("=" * 80)

food_categories = {
    'CEREALS': ('S5_01_2', 'S5_01_3'),
    'TUBERS & ROOTS': ('S5_02_2', 'S5_02_3'),
    'PULSES & LEGUMES': ('S5_03_2', 'S5_03_3'),
    'VEGETABLES': ('S5_04_2', 'S5_04_3')
}

for category, (avail_col, price_col) in food_categories.items():
    print(f"\n{category}:")
    
    # Availability
    if avail_col in df.columns:
        avail = df[avail_col].value_counts()
        print(f"  Availability:")
        for val in avail.index:
            pct = (avail[val] / df[avail_col].notna().sum() * 100).round(1)
            print(f"    {val}: {avail[val]} villages ({pct}%)")
    
    # Prices
    if price_col in df.columns:
        prices = df[price_col].value_counts()
        print(f"  Prices (compared to normal):")
        for val in prices.index:
            pct = (prices[val] / df[price_col].notna().sum() * 100).round(1)
            print(f"    {val}: {prices[val]} villages ({pct}%)")

# Cross-tabulation: Availability vs Prices for Cereals
if 'S5_01_2' in df.columns and 'S5_01_3' in df.columns:
    print("\n📊 CEREAL AVAILABILITY vs PRICE (Cross-tab):")
    cross_tab = pd.crosstab(df['S5_01_2'], df['S5_01_3'], 
                            normalize='index') * 100
    print(cross_tab.round(1))

# ============================================================================
# LABOR MARKET ANALYSIS
# ============================================================================
print("\n" + "=" * 80)
print("SECTION 5: LABOR MARKET & WAGES")
print("=" * 80)

# Agricultural wages
print("\n💰 AGRICULTURAL LABOR WAGES:")
ag_wage = df['S6_01'].dropna()
print(f"  Sample size: {len(ag_wage)} villages")
print(f"  Mean: {ag_wage.mean():.0f} RWF/day")
print(f"  Median: {ag_wage.median():.0f} RWF/day")
print(f"  Std dev: {ag_wage.std():.0f}")
print(f"  Range: {ag_wage.min():.0f} - {ag_wage.max():.0f} RWF")

# Wage distribution (quartiles)
print(f"\n  Distribution:")
print(f"    25th percentile: {ag_wage.quantile(0.25):.0f} RWF")
print(f"    50th percentile: {ag_wage.quantile(0.50):.0f} RWF")
print(f"    75th percentile: {ag_wage.quantile(0.75):.0f} RWF")

# Non-agricultural wages
print("\n💼 NON-AGRICULTURAL LABOR WAGES:")
non_ag_wage = df['S6_02'].dropna()
print(f"  Sample size: {len(non_ag_wage)} villages")
print(f"  Mean: {non_ag_wage.mean():.0f} RWF/day")
print(f"  Median: {non_ag_wage.median():.0f} RWF/day")
print(f"  Std dev: {non_ag_wage.std():.0f}")
print(f"  Range: {non_ag_wage.min():.0f} - {non_ag_wage.max():.0f} RWF")

# Wage premium
wage_premium = ((non_ag_wage.mean() - ag_wage.mean()) / ag_wage.mean() * 100)
print(f"\n  Non-agricultural wage premium: {wage_premium:.1f}%")

# Wages by location
print("\n💵 WAGE COMPARISON BY LOCATION:")
wage_comparison = df.groupby('UrbanRural')[['S6_01', 'S6_02']].agg(['mean', 'median'])
wage_comparison.columns = ['Ag Mean', 'Ag Median', 'Non-Ag Mean', 'Non-Ag Median']
print(wage_comparison.round(0))

# Urban wage premium
urban_ag = df[df['UrbanRural'] == 'Urban']['S6_01'].mean()
rural_ag = df[df['UrbanRural'] == 'Rural']['S6_01'].mean()
urban_premium_ag = ((urban_ag - rural_ag) / rural_ag * 100)
print(f"\n  Urban agricultural wage premium: {urban_premium_ag:.1f}%")

urban_non_ag = df[df['UrbanRural'] == 'Urban']['S6_02'].mean()
rural_non_ag = df[df['UrbanRural'] == 'Rural']['S6_02'].mean()
urban_premium_non_ag = ((urban_non_ag - rural_non_ag) / rural_non_ag * 100)
print(f"  Urban non-agricultural wage premium: {urban_premium_non_ag:.1f}%")

# Wage trends (compared to normal)
print("\n📈 WAGE TRENDS:")
if 'S6_01_3' in df.columns:
    ag_trend = df['S6_01_3'].value_counts()
    print(f"  Agricultural wages:")
    for val in ag_trend.index:
        pct = (ag_trend[val] / df['S6_01_3'].notna().sum() * 100).round(1)
        print(f"    {val}: {ag_trend[val]} villages ({pct}%)")

if 'S6_01_4' in df.columns:
    non_ag_trend = df['S6_01_4'].value_counts()
    print(f"  Non-agricultural wages:")
    for val in non_ag_trend.index:
        pct = (non_ag_trend[val] / df['S6_01_4'].notna().sum() * 100).round(1)
        print(f"    {val}: {non_ag_trend[val]} villages ({pct}%)")

# ============================================================================
# COMPOSITE VULNERABILITY INDEX
# ============================================================================
print("\n" + "=" * 80)
print("SECTION 6: VILLAGE VULNERABILITY INDEX")
print("=" * 80)

# Create comprehensive vulnerability score
vuln_score = pd.Series(0, index=df.index)

# Factor 1: Infrastructure deficits (0-3 points)
vuln_score += (df['S3_02'] != 1).astype(int)  # No school
vuln_score += (df['S3_03'] != 1).astype(int)  # No health facility
vuln_score += (df['S4_01'] != 1).astype(int)  # No market

# Factor 2: Market access (0-2 points)
vuln_score += (df['S4_02_4'] == 'No').astype(int)  # Poor road access
vuln_score += (df['S4_02_3'] > 10).fillna(False).astype(int)  # Far from market

# Factor 3: Food availability (0-3 points)
vuln_score += (df['S5_01_2'] == 'Low (insufficient)').astype(int)  # Low cereal
vuln_score += (df['S5_02_2'] == 'Low (insufficient)').astype(int)  # Low tubers
vuln_score += (df['S5_03_2'] == 'Low (insufficient)').astype(int)  # Low pulses

# Factor 4: Food prices (0-2 points)
vuln_score += (df['S5_01_3'] == 'Higher that normal').astype(int)
vuln_score += (df['S5_02_3'] == 'Higher that normal').astype(int)

# Factor 5: Wages (0-2 points)
vuln_score += (df['S6_01'] < df['S6_01'].median()).fillna(False).astype(int)
vuln_score += (df['S6_01_3'] == 'Lower than normal').astype(int)

df['vulnerability_score'] = vuln_score

# Categorize
df['vulnerability_level'] = pd.cut(vuln_score, 
                                   bins=[-1, 3, 6, 100],
                                   labels=['Low', 'Medium', 'High'])

print("\n📊 VULNERABILITY SCORE DISTRIBUTION:")
print(f"  Mean score: {vuln_score.mean():.2f}")
print(f"  Median score: {vuln_score.median():.2f}")
print(f"  Std deviation: {vuln_score.std():.2f}")
print(f"  Range: {vuln_score.min():.0f} - {vuln_score.max():.0f}")

print("\n📈 VILLAGES BY VULNERABILITY LEVEL:")
vuln_dist = df['vulnerability_level'].value_counts()
for level in ['Low', 'Medium', 'High']:
    if level in vuln_dist.index:
        count = vuln_dist[level]
        pct = (count / len(df) * 100)
        print(f"  {level}: {count} villages ({pct:.1f}%)")

# Vulnerability by province
print("\n🗺️ AVERAGE VULNERABILITY BY PROVINCE:")
vuln_by_prov = df.groupby('S0_C_Prov')['vulnerability_score'].agg(['mean', 'median', 'std'])
vuln_by_prov = vuln_by_prov.sort_values('mean', ascending=False)
print(vuln_by_prov.round(2))

# Vulnerability by urban/rural
print("\n🏘️ VULNERABILITY BY LOCATION:")
vuln_by_ur = df.groupby('UrbanRural')['vulnerability_score'].agg(['mean', 'median', 'std'])
print(vuln_by_ur.round(2))

# High vulnerability hotspots
print("\n🚨 HIGH VULNERABILITY HOTSPOTS:")
high_vuln = df[df['vulnerability_level'] == 'High']
if len(high_vuln) > 0:
    hotspot_analysis = high_vuln.groupby('S0_C_Prov').size().sort_values(ascending=False)
    for prov, count in hotspot_analysis.items():
        pct = (count / len(high_vuln) * 100)
        print(f"  {prov}: {count} villages ({pct:.1f}% of high-vulnerability villages)")

# ============================================================================
# CORRELATION ANALYSIS
# ============================================================================
print("\n" + "=" * 80)
print("SECTION 7: KEY CORRELATIONS")
print("=" * 80)

# Create numerical indicators
df['has_school'] = (df['S3_02'] == 1).astype(int)
df['has_health'] = (df['S3_03'] == 1).astype(int)
df['has_market'] = (df['S4_01'] == 1).astype(int)
df['good_roads'] = (df['S4_02_4'] == 'Yes').astype(int)
df['is_urban'] = (df['UrbanRural'] == 'Urban').astype(int)

# Correlation matrix
corr_vars = ['vulnerability_score', 'has_school', 'has_health', 'has_market', 
             'good_roads', 'is_urban', 'S2_01', 'S6_01', 'S6_02']
corr_vars = [v for v in corr_vars if v in df.columns]

print("\n📊 CORRELATION WITH VULNERABILITY SCORE:")
correlations = df[corr_vars].corr()['vulnerability_score'].sort_values()
for var, corr in correlations.items():
    if var != 'vulnerability_score':
        print(f"  {var}: {corr:.3f}")

# Statistical test: Urban vs Rural vulnerability
print("\n📈 STATISTICAL TEST: Urban vs Rural Vulnerability")
urban_vuln = df[df['UrbanRural'] == 'Urban']['vulnerability_score']
rural_vuln = df[df['UrbanRural'] == 'Rural']['vulnerability_score']
t_stat, p_value = stats.ttest_ind(urban_vuln, rural_vuln)
print(f"  T-statistic: {t_stat:.3f}")
print(f"  P-value: {p_value:.4f}")
print(f"  Result: {'Significant' if p_value < 0.05 else 'Not significant'} difference (α=0.05)")

print("\n" + "=" * 80)
print("✓ ANALYSIS COMPLETE!")
print("=" * 80)
print(f"\nDataset enriched with {len([c for c in df.columns if c.startswith('vulnerability')])} new variables")
print("Ready for visualization and export")
