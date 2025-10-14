"""
FOOD SECURITY VISUALIZATION DASHBOARD
Rwanda CFSVA 2021 - Village Level
=================================================================
Creates comprehensive visualizations for food security analysis
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# Load and prepare data
print("Loading data and creating visualizations...")
df = pd.read_stata('../data/CFSVA_2021_VILLAGE.dta')

# Create vulnerability score
vuln_score = pd.Series(0, index=df.index)
vuln_score += (df['S3_02'] != 1).astype(int)
vuln_score += (df['S3_03'] != 1).astype(int)
vuln_score += (df['S4_01'] != 1).astype(int)
vuln_score += (df['S4_02_4'] == 'No').astype(int)
vuln_score += (df['S4_02_3'] > 10).fillna(False).astype(int)
vuln_score += (df['S5_01_2'] == 'Low (insufficient)').astype(int)
vuln_score += (df['S5_02_2'] == 'Low (insufficient)').astype(int)
vuln_score += (df['S5_03_2'] == 'Low (insufficient)').astype(int)
vuln_score += (df['S5_01_3'] == 'Higher that normal').astype(int)
vuln_score += (df['S5_02_3'] == 'Higher that normal').astype(int)
vuln_score += (df['S6_01'] < df['S6_01'].median()).fillna(False).astype(int)
vuln_score += (df['S6_01_3'] == 'Lower than normal').astype(int)

df['vulnerability_score'] = vuln_score
df['vulnerability_level'] = pd.cut(vuln_score, bins=[-1, 3, 6, 100],
                                   labels=['Low', 'Medium', 'High'])

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.facecolor'] = 'white'

# ============================================================================
# FIGURE 1: Geographic Overview
# ============================================================================
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.suptitle('Rwanda Food Security - Geographic & Demographic Overview', 
             fontsize=16, fontweight='bold', y=0.995)

# 1.1 Villages by Province
ax1 = axes[0, 0]
prov_counts = df['S0_C_Prov'].value_counts().sort_values()
colors = sns.color_palette("viridis", len(prov_counts))
prov_counts.plot(kind='barh', ax=ax1, color=colors)
ax1.set_title('Villages Surveyed by Province', fontsize=12, fontweight='bold')
ax1.set_xlabel('Number of Villages')
ax1.set_ylabel('')
for i, v in enumerate(prov_counts):
    ax1.text(v + 3, i, str(int(v)), va='center')

# 1.2 Urban vs Rural Distribution
ax2 = axes[0, 1]
urban_rural = df['UrbanRural'].value_counts()
colors_ur = ['#2ecc71', '#e74c3c']
wedges, texts, autotexts = ax2.pie(urban_rural, labels=urban_rural.index, 
                                     autopct='%1.1f%%', colors=colors_ur,
                                     startangle=90)
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontweight('bold')
    autotext.set_fontsize(11)
ax2.set_title('Urban vs Rural Distribution', fontsize=12, fontweight='bold')

# 1.3 Village Size Distribution
ax3 = axes[1, 0]
village_sizes = df['S2_01'].dropna()
ax3.hist(village_sizes, bins=30, color='skyblue', edgecolor='black', alpha=0.7)
ax3.axvline(village_sizes.mean(), color='red', linestyle='--', linewidth=2, 
            label=f'Mean: {village_sizes.mean():.0f}')
ax3.axvline(village_sizes.median(), color='green', linestyle='--', linewidth=2,
            label=f'Median: {village_sizes.median():.0f}')
ax3.set_title('Village Size Distribution (Households)', fontsize=12, fontweight='bold')
ax3.set_xlabel('Number of Households')
ax3.set_ylabel('Number of Villages')
ax3.legend()
ax3.grid(axis='y', alpha=0.3)

# 1.4 Vulnerability by Province
ax4 = axes[1, 1]
vuln_by_prov = df.groupby('S0_C_Prov')['vulnerability_score'].mean().sort_values()
colors_vuln = sns.color_palette("RdYlGn_r", len(vuln_by_prov))
vuln_by_prov.plot(kind='barh', ax=ax4, color=colors_vuln)
ax4.set_title('Average Vulnerability Score by Province', fontsize=12, fontweight='bold')
ax4.set_xlabel('Vulnerability Score')
ax4.set_ylabel('')
for i, v in enumerate(vuln_by_prov):
    ax4.text(v + 0.1, i, f'{v:.2f}', va='center')

plt.tight_layout()
plt.savefig('fig1_geographic_overview.png', dpi=300, bbox_inches='tight')
print("✓ Figure 1 saved: fig1_geographic_overview.png")
plt.close()

# ============================================================================
# FIGURE 2: Infrastructure & Market Access
# ============================================================================
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.suptitle('Infrastructure & Market Access Analysis', 
             fontsize=16, fontweight='bold', y=0.995)

# 2.1 Infrastructure Access
ax1 = axes[0, 0]
infra_data = pd.DataFrame({
    'School': [(df['S3_02'] == 1).sum(), (df['S3_02'] != 1).sum()],
    'Health Facility': [(df['S3_03'] == 1).sum(), (df['S3_03'] != 1).sum()],
    'Market': [(df['S4_01'] == 1).sum(), (df['S4_01'] != 1).sum()]
}, index=['Has Access', 'No Access'])
infra_data.T.plot(kind='bar', ax=ax1, color=['#27ae60', '#e74c3c'], width=0.7)
ax1.set_title('Infrastructure Access by Type', fontsize=12, fontweight='bold')
ax1.set_xlabel('')
ax1.set_ylabel('Number of Villages')
ax1.legend(title='Status')
ax1.set_xticklabels(ax1.get_xticklabels(), rotation=0)
ax1.grid(axis='y', alpha=0.3)

# 2.2 Road Accessibility by Province
ax2 = axes[0, 1]
road_by_prov = df.groupby('S0_C_Prov')['S4_02_4'].apply(
    lambda x: (x == 'Yes').sum() / len(x) * 100
).sort_values()
colors_road = sns.color_palette("YlGn", len(road_by_prov))
road_by_prov.plot(kind='barh', ax=ax2, color=colors_road)
ax2.set_title('Year-Round Road Accessibility by Province', fontsize=12, fontweight='bold')
ax2.set_xlabel('% of Villages')
ax2.set_ylabel('')
for i, v in enumerate(road_by_prov):
    ax2.text(v + 1, i, f'{v:.1f}%', va='center')

# 2.3 Distance to Services (for villages without)
ax3 = axes[1, 0]
no_school_dist = df[df['S3_02'] != 1]['S3_02_2'].dropna()
no_health_dist = df[df['S3_03'] != 1]['S3_03_2'].dropna()
no_market_dist = df[df['S4_01'] != 1]['S4_02_3'].dropna()

distances = pd.DataFrame({
    'School': [no_school_dist.mean(), no_school_dist.median()],
    'Health': [no_health_dist.mean(), no_health_dist.median()],
    'Market': [no_market_dist.mean(), no_market_dist.median()]
}, index=['Mean', 'Median'])

distances.plot(kind='bar', ax=ax3, color=['#3498db', '#e67e22', '#9b59b6'], width=0.7)
ax3.set_title('Average Distance to Nearest Service (km)', fontsize=12, fontweight='bold')
ax3.set_xlabel('')
ax3.set_ylabel('Distance (km)')
ax3.set_xticklabels(ax3.get_xticklabels(), rotation=0)
ax3.legend(title='Service Type')
ax3.grid(axis='y', alpha=0.3)

# 2.4 Infrastructure by Urban/Rural
ax4 = axes[1, 1]
infra_ur = pd.DataFrame({
    'School': df.groupby('UrbanRural')['S3_02'].apply(lambda x: (x==1).sum()/len(x)*100),
    'Health': df.groupby('UrbanRural')['S3_03'].apply(lambda x: (x==1).sum()/len(x)*100),
    'Market': df.groupby('UrbanRural')['S4_01'].apply(lambda x: (x==1).sum()/len(x)*100),
    'Good Roads': df.groupby('UrbanRural')['S4_02_4'].apply(lambda x: (x=='Yes').sum()/len(x)*100)
})
infra_ur.plot(kind='bar', ax=ax4, width=0.8)
ax4.set_title('Infrastructure Access: Urban vs Rural', fontsize=12, fontweight='bold')
ax4.set_xlabel('')
ax4.set_ylabel('% of Villages')
ax4.set_xticklabels(ax4.get_xticklabels(), rotation=0)
ax4.legend(title='Infrastructure Type', bbox_to_anchor=(1.05, 1))
ax4.grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.savefig('fig2_infrastructure_access.png', dpi=300, bbox_inches='tight')
print("✓ Figure 2 saved: fig2_infrastructure_access.png")
plt.close()

# ============================================================================
# FIGURE 3: Food Availability & Prices
# ============================================================================
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.suptitle('Food Availability & Price Dynamics', 
             fontsize=16, fontweight='bold', y=0.995)

# 3.1 Food Availability by Category
ax1 = axes[0, 0]
avail_data = pd.DataFrame({
    'Cereals': df['S5_01_2'].value_counts(normalize=True) * 100,
    'Tubers': df['S5_02_2'].value_counts(normalize=True) * 100,
    'Pulses': df['S5_03_2'].value_counts(normalize=True) * 100,
    'Vegetables': df['S5_04_2'].value_counts(normalize=True) * 100
}).T
avail_order = ['Sufficient', 'Moderately sufficient', 'Low (insufficient)']
avail_data = avail_data[[c for c in avail_order if c in avail_data.columns]]
avail_data.plot(kind='bar', stacked=True, ax=ax1, 
                color=['#27ae60', '#f39c12', '#e74c3c'], width=0.7)
ax1.set_title('Food Availability by Category', fontsize=12, fontweight='bold')
ax1.set_xlabel('')
ax1.set_ylabel('% of Villages')
ax1.set_xticklabels(ax1.get_xticklabels(), rotation=0)
ax1.legend(title='Availability', bbox_to_anchor=(1.05, 1))
ax1.grid(axis='y', alpha=0.3)

# 3.2 Price Trends
ax2 = axes[0, 1]
price_data = pd.DataFrame({
    'Cereals': df['S5_01_3'].value_counts(normalize=True) * 100,
    'Tubers': df['S5_02_3'].value_counts(normalize=True) * 100,
    'Pulses': df['S5_03_3'].value_counts(normalize=True) * 100,
    'Vegetables': df['S5_04_3'].value_counts(normalize=True) * 100
}).T
price_order = ['Lower than normal', 'Normal', 'Higher that normal']
price_data = price_data[[c for c in price_order if c in price_data.columns]]
price_data.plot(kind='bar', stacked=True, ax=ax2,
                color=['#3498db', '#95a5a6', '#e74c3c'], width=0.7)
ax2.set_title('Price Trends Compared to Normal', fontsize=12, fontweight='bold')
ax2.set_xlabel('')
ax2.set_ylabel('% of Villages')
ax2.set_xticklabels(ax2.get_xticklabels(), rotation=0)
ax2.legend(title='Price Level', bbox_to_anchor=(1.05, 1))
ax2.grid(axis='y', alpha=0.3)

# 3.3 Cereal Availability vs Prices (Heatmap)
ax3 = axes[1, 0]
cross_tab = pd.crosstab(df['S5_01_2'], df['S5_01_3'], normalize='index') * 100
sns.heatmap(cross_tab, annot=True, fmt='.1f', cmap='RdYlGn_r', ax=ax3, 
            cbar_kws={'label': '% of Villages'})
ax3.set_title('Cereal Availability vs Price (% within availability level)', 
              fontsize=12, fontweight='bold')
ax3.set_xlabel('Price Level')
ax3.set_ylabel('Availability Level')

# 3.4 Food Insecurity Indicators
ax4 = axes[1, 1]
food_insecurity = pd.DataFrame({
    'Low Availability': [
        (df['S5_01_2'] == 'Low (insufficient)').sum(),
        (df['S5_02_2'] == 'Low (insufficient)').sum(),
        (df['S5_03_2'] == 'Low (insufficient)').sum(),
        (df['S5_04_2'] == 'Low (insufficient)').sum()
    ],
    'High Prices': [
        (df['S5_01_3'] == 'Higher that normal').sum(),
        (df['S5_02_3'] == 'Higher that normal').sum(),
        (df['S5_03_3'] == 'Higher that normal').sum(),
        (df['S5_04_3'] == 'Higher that normal').sum()
    ]
}, index=['Cereals', 'Tubers', 'Pulses', 'Vegetables'])

x = np.arange(len(food_insecurity))
width = 0.35
ax4.bar(x - width/2, food_insecurity['Low Availability'], width, 
        label='Low Availability', color='#e74c3c')
ax4.bar(x + width/2, food_insecurity['High Prices'], width,
        label='High Prices', color='#f39c12')
ax4.set_title('Food Insecurity Indicators by Category', fontsize=12, fontweight='bold')
ax4.set_xlabel('Food Category')
ax4.set_ylabel('Number of Villages')
ax4.set_xticks(x)
ax4.set_xticklabels(food_insecurity.index)
ax4.legend()
ax4.grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.savefig('fig3_food_availability_prices.png', dpi=300, bbox_inches='tight')
print("✓ Figure 3 saved: fig3_food_availability_prices.png")
plt.close()

# ============================================================================
# FIGURE 4: Labor Market & Wages
# ============================================================================
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.suptitle('Labor Market & Wage Analysis', 
             fontsize=16, fontweight='bold', y=0.995)

# 4.1 Wage Distribution
ax1 = axes[0, 0]
ax1.hist(df['S6_01'].dropna(), bins=30, alpha=0.7, label='Agricultural', 
         color='#27ae60', edgecolor='black')
ax1.hist(df['S6_02'].dropna(), bins=30, alpha=0.7, label='Non-Agricultural',
         color='#3498db', edgecolor='black')
ax1.axvline(df['S6_01'].median(), color='#27ae60', linestyle='--', linewidth=2)
ax1.axvline(df['S6_02'].median(), color='#3498db', linestyle='--', linewidth=2)
ax1.set_title('Daily Wage Distribution', fontsize=12, fontweight='bold')
ax1.set_xlabel('Daily Wage (RWF)')
ax1.set_ylabel('Number of Villages')
ax1.legend()
ax1.grid(axis='y', alpha=0.3)

# 4.2 Wages by Location
ax2 = axes[0, 1]
wage_by_location = df.groupby('UrbanRural')[['S6_01', 'S6_02']].mean()
wage_by_location.columns = ['Agricultural', 'Non-Agricultural']
wage_by_location.plot(kind='bar', ax=ax2, color=['#27ae60', '#3498db'], width=0.7)
ax2.set_title('Average Wages: Urban vs Rural', fontsize=12, fontweight='bold')
ax2.set_xlabel('')
ax2.set_ylabel('Daily Wage (RWF)')
ax2.set_xticklabels(ax2.get_xticklabels(), rotation=0)
ax2.legend(title='Wage Type')
ax2.grid(axis='y', alpha=0.3)

# 4.3 Wage Trends
ax3 = axes[1, 0]
ag_trend = df['S6_01_3'].value_counts()
non_ag_trend = df['S6_01_4'].value_counts()
trend_data = pd.DataFrame({
    'Agricultural': ag_trend,
    'Non-Agricultural': non_ag_trend
})
trend_order = ['Lower than normal', 'Normal', 'Higher that normal']
trend_data = trend_data.reindex(trend_order)
trend_data.plot(kind='bar', ax=ax3, color=['#27ae60', '#3498db'], width=0.7)
ax3.set_title('Wage Trends Compared to Normal', fontsize=12, fontweight='bold')
ax3.set_xlabel('')
ax3.set_ylabel('Number of Villages')
ax3.set_xticklabels(ax3.get_xticklabels(), rotation=45, ha='right')
ax3.legend(title='Wage Type')
ax3.grid(axis='y', alpha=0.3)

# 4.4 Wage Premium Analysis
ax4 = axes[1, 1]
premiums = pd.DataFrame({
    'Non-Ag Premium': [
        ((df[df['UrbanRural']=='Urban']['S6_02'].mean() - 
          df[df['UrbanRural']=='Urban']['S6_01'].mean()) / 
         df[df['UrbanRural']=='Urban']['S6_01'].mean() * 100),
        ((df[df['UrbanRural']=='Rural']['S6_02'].mean() - 
          df[df['UrbanRural']=='Rural']['S6_01'].mean()) / 
         df[df['UrbanRural']=='Rural']['S6_01'].mean() * 100)
    ],
    'Urban Premium (Ag)': [
        ((df[df['UrbanRural']=='Urban']['S6_01'].mean() - 
          df[df['UrbanRural']=='Rural']['S6_01'].mean()) / 
         df[df['UrbanRural']=='Rural']['S6_01'].mean() * 100),
        0
    ],
    'Urban Premium (Non-Ag)': [
        ((df[df['UrbanRural']=='Urban']['S6_02'].mean() - 
          df[df['UrbanRural']=='Rural']['S6_02'].mean()) / 
         df[df['UrbanRural']=='Rural']['S6_02'].mean() * 100),
        0
    ]
}, index=['Urban', 'Rural'])

premiums.plot(kind='bar', ax=ax4, width=0.7)
ax4.set_title('Wage Premiums (%)', fontsize=12, fontweight='bold')
ax4.set_xlabel('')
ax4.set_ylabel('Premium (%)')
ax4.set_xticklabels(ax4.get_xticklabels(), rotation=0)
ax4.axhline(y=0, color='black', linestyle='-', linewidth=0.5)
ax4.legend(bbox_to_anchor=(1.05, 1))
ax4.grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.savefig('fig4_labor_wages.png', dpi=300, bbox_inches='tight')
print("✓ Figure 4 saved: fig4_labor_wages.png")
plt.close()

# ============================================================================
# FIGURE 5: Vulnerability Analysis
# ============================================================================
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.suptitle('Village Vulnerability Analysis', 
             fontsize=16, fontweight='bold', y=0.995)

# 5.1 Vulnerability Score Distribution
ax1 = axes[0, 0]
ax1.hist(df['vulnerability_score'], bins=range(3, 14), color='coral',
         edgecolor='black', alpha=0.7)
ax1.axvline(df['vulnerability_score'].mean(), color='red', linestyle='--',
            linewidth=2, label=f'Mean: {df["vulnerability_score"].mean():.2f}')
ax1.axvline(df['vulnerability_score'].median(), color='blue', linestyle='--',
            linewidth=2, label=f'Median: {df["vulnerability_score"].median():.2f}')
ax1.set_title('Vulnerability Score Distribution', fontsize=12, fontweight='bold')
ax1.set_xlabel('Vulnerability Score')
ax1.set_ylabel('Number of Villages')
ax1.legend()
ax1.grid(axis='y', alpha=0.3)

# 5.2 Vulnerability by Province
ax2 = axes[0, 1]
vuln_levels_prov = pd.crosstab(df['S0_C_Prov'], df['vulnerability_level'], 
                                normalize='index') * 100
vuln_levels_prov[['Low', 'Medium', 'High']].plot(kind='bar', stacked=True, ax=ax2,
                                                   color=['#27ae60', '#f39c12', '#e74c3c'],
                                                   width=0.7)
ax2.set_title('Vulnerability Levels by Province', fontsize=12, fontweight='bold')
ax2.set_xlabel('')
ax2.set_ylabel('% of Villages')
ax2.set_xticklabels(ax2.get_xticklabels(), rotation=45, ha='right')
ax2.legend(title='Vulnerability')
ax2.grid(axis='y', alpha=0.3)

# 5.3 Vulnerability Components
ax3 = axes[1, 0]
components = pd.DataFrame({
    'Villages Affected': [
        (df['S3_02'] != 1).sum(),  # No school
        (df['S3_03'] != 1).sum(),  # No health
        (df['S4_01'] != 1).sum(),  # No market
        (df['S4_02_4'] == 'No').sum(),  # Poor roads
        (df['S5_01_2'] == 'Low (insufficient)').sum(),  # Low cereal
        (df['S5_01_3'] == 'Higher that normal').sum(),  # High prices
        (df['S6_01'] < df['S6_01'].median()).sum()  # Low wages
    ]
}, index=['No School', 'No Health', 'No Market', 'Poor Roads',
          'Low Food\nAvailability', 'High Prices', 'Low Wages'])

colors_comp = sns.color_palette("Reds_r", len(components))
components.plot(kind='barh', ax=ax3, color=colors_comp, legend=False)
ax3.set_title('Vulnerability Components (# of Villages Affected)', 
              fontsize=12, fontweight='bold')
ax3.set_xlabel('Number of Villages')
ax3.set_ylabel('')
for i, v in enumerate(components['Villages Affected']):
    ax3.text(v + 10, i, str(int(v)), va='center')

# 5.4 Urban vs Rural Vulnerability
ax4 = axes[1, 1]
vuln_ur = df.groupby(['UrbanRural', 'vulnerability_level']).size().unstack(fill_value=0)
vuln_ur = vuln_ur[['Low', 'Medium', 'High']]
vuln_ur.plot(kind='bar', ax=ax4, color=['#27ae60', '#f39c12', '#e74c3c'], width=0.7)
ax4.set_title('Vulnerability: Urban vs Rural', fontsize=12, fontweight='bold')
ax4.set_xlabel('')
ax4.set_ylabel('Number of Villages')
ax4.set_xticklabels(ax4.get_xticklabels(), rotation=0)
ax4.legend(title='Vulnerability Level')
ax4.grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.savefig('fig5_vulnerability_analysis.png', dpi=300, bbox_inches='tight')
print("✓ Figure 5 saved: fig5_vulnerability_analysis.png")
plt.close()

print("\n" + "=" * 80)
print("✓ ALL VISUALIZATIONS COMPLETE!")
print("=" * 80)
print("\nGenerated 5 comprehensive figures:")
print("  1. fig1_geographic_overview.png")
print("  2. fig2_infrastructure_access.png")
print("  3. fig3_food_availability_prices.png")
print("  4. fig4_labor_wages.png")
print("  5. fig5_vulnerability_analysis.png")
print("\nAll figures saved in current directory at 300 DPI resolution.")
