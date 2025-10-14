"""
CHILD MALNUTRITION ANALYSIS - UNDER 5 YEARS
Rwanda CFSVA 2021
=================================================================
Comprehensive analysis of malnutrition among children under 5 years
Focuses on: stunting, wasting, underweight, dietary diversity,
feeding practices, illness patterns, and healthcare access
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

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (14, 8)

print("=" * 80)
print("LOADING CHILD NUTRITION & MALNUTRITION DATA")
print("=" * 80)

# Load the child dataset
df = pd.read_stata('../data/CFSVAHH2021_UNDER_5_ChildWithMother.dta')

print(f"\nDataset loaded successfully!")
print(f"  Total children: {len(df)}")
print(f"  Total variables: {len(df.columns)}")
print(f"  Unique households: {df['index'].nunique() if 'index' in df.columns else 'N/A'}")

# ============================================================================
# SECTION 1: DEMOGRAPHIC PROFILE
# ============================================================================
print("\n" + "=" * 80)
print("1. CHILD DEMOGRAPHIC PROFILE")
print("=" * 80)

print("\nAGE DISTRIBUTION:")
if 'S13_01_4' in df.columns:
    age_months = df['S13_01_4'].dropna()
    print(f"  Total children with age data: {len(age_months)}")
    print(f"  Mean age: {age_months.mean():.1f} months")
    print(f"  Median age: {age_months.median():.1f} months")
    print(f"  Age range: {age_months.min():.0f} - {age_months.max():.0f} months")
    
    # Age categories
    if 'ageCat' in df.columns:
        print("\nAge Categories:")
        age_cat_dist = df['ageCat'].value_counts().sort_index()
        for cat, count in age_cat_dist.items():
            pct = (count / len(df)) * 100
            print(f"  {cat}: {count} children ({pct:.1f}%)")

print("\nSEX DISTRIBUTION:")
if 'S13_01_5' in df.columns:
    sex_dist = df['S13_01_5'].value_counts()
    for sex, count in sex_dist.items():
        pct = (count / len(df)) * 100
        print(f"  {sex}: {count} children ({pct:.1f}%)")

print("\nGEOGRAPHIC DISTRIBUTION:")
if 'S0_C_Prov' in df.columns:
    prov_dist = df['S0_C_Prov'].value_counts()
    print("  By Province:")
    for prov, count in prov_dist.items():
        pct = (count / len(df)) * 100
        print(f"    {prov}: {count} children ({pct:.1f}%)")

if 'UrbanRural' in df.columns:
    print("\n  By Location:")
    ur_dist = df['UrbanRural'].value_counts()
    for loc, count in ur_dist.items():
        pct = (count / len(df)) * 100
        print(f"    {loc}: {count} children ({pct:.1f}%)")

# ============================================================================
# SECTION 2: MALNUTRITION PREVALENCE
# ============================================================================
print("\n" + "=" * 80)
print("2. MALNUTRITION PREVALENCE")
print("=" * 80)

print("\nSTUNTING (Height-for-Age):")
if 'Stunting' in df.columns:
    stunting = df['Stunting'].value_counts()
    total_measured = df['Stunting'].notna().sum()
    print(f"  Total children measured: {total_measured}")
    for status, count in stunting.items():
        pct = (count / total_measured) * 100
        print(f"  {status}: {count} children ({pct:.1f}%)")
    
    if 'HAZ' in df.columns:
        haz = df['HAZ'].dropna()
        print(f"\n  Height-for-Age Z-Score (HAZ):")
        print(f"    Mean: {haz.mean():.2f}")
        print(f"    Median: {haz.median():.2f}")
        print(f"    Range: {haz.min():.2f} to {haz.max():.2f}")

print("\nWASTING (Weight-for-Height):")
if 'Wasting' in df.columns:
    wasting = df['Wasting'].value_counts()
    total_measured = df['Wasting'].notna().sum()
    print(f"  Total children measured: {total_measured}")
    for status, count in wasting.items():
        pct = (count / total_measured) * 100
        print(f"  {status}: {count} children ({pct:.1f}%)")
    
    if 'WHZ' in df.columns:
        whz = df['WHZ'].dropna()
        print(f"\n  Weight-for-Height Z-Score (WHZ):")
        print(f"    Mean: {whz.mean():.2f}")
        print(f"    Median: {whz.median():.2f}")
        print(f"    Range: {whz.min():.2f} to {whz.max():.2f}")

print("\nUNDERWEIGHT (Weight-for-Age):")
if 'Underweight' in df.columns:
    underweight = df['Underweight'].value_counts()
    total_measured = df['Underweight'].notna().sum()
    print(f"  Total children measured: {total_measured}")
    for status, count in underweight.items():
        pct = (count / total_measured) * 100
        print(f"  {status}: {count} children ({pct:.1f}%)")
    
    if 'WAZ' in df.columns:
        waz = df['WAZ'].dropna()
        print(f"\n  Weight-for-Age Z-Score (WAZ):")
        print(f"    Mean: {waz.mean():.2f}")
        print(f"    Median: {waz.median():.2f}")
        print(f"    Range: {waz.min():.2f} to {waz.max():.2f}")

print("\nEDEMA (Nutritional):")
if 'oedema' in df.columns:
    edema = df['oedema'].value_counts()
    total_checked = df['oedema'].notna().sum()
    print(f"  Total children checked: {total_checked}")
    for status, count in edema.items():
        pct = (count / total_checked) * 100
        print(f"  {status}: {count} children ({pct:.1f}%)")

print("\nMUAC (Mid-Upper Arm Circumference):")
if 'muac' in df.columns:
    muac = df['muac'].dropna()
    print(f"  Total children measured: {len(muac)}")
    print(f"  Mean MUAC: {muac.mean():.1f} mm")
    print(f"  Median MUAC: {muac.median():.1f} mm")
    print(f"  Range: {muac.min():.0f} - {muac.max():.0f} mm")
    print(f"\n  MUAC Categories:")
    print(f"    Severe malnutrition (<115mm): {(muac < 115).sum()} ({(muac < 115).sum()/len(muac)*100:.1f}%)")
    print(f"    Moderate malnutrition (115-125mm): {((muac >= 115) & (muac < 125)).sum()} ({((muac >= 115) & (muac < 125)).sum()/len(muac)*100:.1f}%)")
    print(f"    Normal (>=125mm): {(muac >= 125).sum()} ({(muac >= 125).sum()/len(muac)*100:.1f}%)")

# ============================================================================
# SECTION 3: MALNUTRITION BY DEMOGRAPHICS
# ============================================================================
print("\n" + "=" * 80)
print("3. MALNUTRITION BY DEMOGRAPHICS")
print("=" * 80)

# By Province
print("\nSTUNTING BY PROVINCE:")
if 'Stunting' in df.columns and 'S0_C_Prov' in df.columns:
    stunting_prov = pd.crosstab(df['S0_C_Prov'], df['Stunting'], normalize='index') * 100
    # Calculate total stunting (moderate + severe)
    stunted_total = pd.Series(0.0, index=stunting_prov.index)
    if 'Moderately stunted' in stunting_prov.columns:
        stunted_total += stunting_prov['Moderately stunted']
    if 'Severely stunted' in stunting_prov.columns:
        stunted_total += stunting_prov['Severely stunted']
    
    stunting_rates = stunted_total.sort_values(ascending=False)
    for prov, rate in stunting_rates.items():
        print(f"  {prov}: {rate:.1f}% stunted")

print("\nWASTING BY PROVINCE:")
if 'Wasting' in df.columns and 'S0_C_Prov' in df.columns:
    wasting_prov = pd.crosstab(df['S0_C_Prov'], df['Wasting'], normalize='index') * 100
    # Calculate total wasting (moderate + severe)
    wasted_total = pd.Series(0.0, index=wasting_prov.index)
    if 'Moderately wasted' in wasting_prov.columns:
        wasted_total += wasting_prov['Moderately wasted']
    if 'Severely wasted' in wasting_prov.columns:
        wasted_total += wasting_prov['Severely wasted']
    
    wasting_rates = wasted_total.sort_values(ascending=False)
    for prov, rate in wasting_rates.items():
        print(f"  {prov}: {rate:.1f}% wasted")

# By Urban/Rural
print("\nMALNUTRITION BY LOCATION:")
if 'UrbanRural' in df.columns:
    for indicator in ['Stunting', 'Wasting', 'Underweight']:
        if indicator in df.columns:
            print(f"\n  {indicator}:")
            malnut_ur = pd.crosstab(df['UrbanRural'], df[indicator], normalize='index') * 100
            
            # Calculate totals for affected children
            affected_total = pd.Series(0.0, index=malnut_ur.index)
            if indicator == 'Stunting':
                if 'Moderately stunted' in malnut_ur.columns:
                    affected_total += malnut_ur['Moderately stunted']
                if 'Severely stunted' in malnut_ur.columns:
                    affected_total += malnut_ur['Severely stunted']
            elif indicator == 'Wasting':
                if 'Moderately wasted' in malnut_ur.columns:
                    affected_total += malnut_ur['Moderately wasted']
                if 'Severely wasted' in malnut_ur.columns:
                    affected_total += malnut_ur['Severely wasted']
            elif indicator == 'Underweight':
                if 'Moderately underweight' in malnut_ur.columns:
                    affected_total += malnut_ur['Moderately underweight']
                if 'Severely underweight' in malnut_ur.columns:
                    affected_total += malnut_ur['Severely underweight']
            
            for loc, rate in affected_total.items():
                print(f"    {loc}: {rate:.1f}%")

# By Age
print("\nMALNUTRITION BY AGE GROUP:")
if 'ageCat' in df.columns:
    for indicator in ['Stunting', 'Wasting', 'Underweight']:
        if indicator in df.columns:
            print(f"\n  {indicator}:")
            malnut_age = pd.crosstab(df['ageCat'], df[indicator], normalize='index') * 100
            
            # Calculate totals for affected children
            affected_total = pd.Series(0.0, index=malnut_age.index)
            if indicator == 'Stunting':
                if 'Moderately stunted' in malnut_age.columns:
                    affected_total += malnut_age['Moderately stunted']
                if 'Severely stunted' in malnut_age.columns:
                    affected_total += malnut_age['Severely stunted']
            elif indicator == 'Wasting':
                if 'Moderately wasted' in malnut_age.columns:
                    affected_total += malnut_age['Moderately wasted']
                if 'Severely wasted' in malnut_age.columns:
                    affected_total += malnut_age['Severely wasted']
            elif indicator == 'Underweight':
                if 'Moderately underweight' in malnut_age.columns:
                    affected_total += malnut_age['Moderately underweight']
                if 'Severely underweight' in malnut_age.columns:
                    affected_total += malnut_age['Severely underweight']
            
            for age, rate in affected_total.sort_index().items():
                print(f"    {age}: {rate:.1f}%")

# By Sex
print("\nMALNUTRITION BY SEX:")
if 'S13_01_5' in df.columns:
    for indicator in ['Stunting', 'Wasting', 'Underweight']:
        if indicator in df.columns:
            print(f"\n  {indicator}:")
            malnut_sex = pd.crosstab(df['S13_01_5'], df[indicator], normalize='index') * 100
            
            # Calculate totals for affected children
            affected_total = pd.Series(0.0, index=malnut_sex.index)
            if indicator == 'Stunting':
                if 'Moderately stunted' in malnut_sex.columns:
                    affected_total += malnut_sex['Moderately stunted']
                if 'Severely stunted' in malnut_sex.columns:
                    affected_total += malnut_sex['Severely stunted']
            elif indicator == 'Wasting':
                if 'Moderately wasted' in malnut_sex.columns:
                    affected_total += malnut_sex['Moderately wasted']
                if 'Severely wasted' in malnut_sex.columns:
                    affected_total += malnut_sex['Severely wasted']
            elif indicator == 'Underweight':
                if 'Moderately underweight' in malnut_sex.columns:
                    affected_total += malnut_sex['Moderately underweight']
                if 'Severely underweight' in malnut_sex.columns:
                    affected_total += malnut_sex['Severely underweight']
            
            for sex, rate in affected_total.items():
                print(f"    {sex}: {rate:.1f}%")

# ============================================================================
# SECTION 4: DIETARY DIVERSITY & FEEDING PRACTICES
# ============================================================================
print("\n" + "=" * 80)
print("4. DIETARY DIVERSITY & FEEDING PRACTICES")
print("=" * 80)

print("\nMINIMUM DIETARY DIVERSITY (MDD):")
if 'minimumDietaryDiversity' in df.columns:
    mdd = df['minimumDietaryDiversity'].value_counts()
    total = df['minimumDietaryDiversity'].notna().sum()
    for status, count in mdd.items():
        pct = (count / total) * 100
        print(f"  {status}: {count} children ({pct:.1f}%)")

print("\nMINIMUM MEAL FREQUENCY (MMF):")
if 'minimumMealFrequency' in df.columns:
    mmf = df['minimumMealFrequency'].value_counts()
    total = df['minimumMealFrequency'].notna().sum()
    for status, count in mmf.items():
        pct = (count / total) * 100
        print(f"  {status}: {count} children ({pct:.1f}%)")

print("\nMINIMUM ACCEPTABLE DIET (MAD):")
if 'minimumAcceptableDiet' in df.columns:
    mad = df['minimumAcceptableDiet'].value_counts()
    total = df['minimumAcceptableDiet'].notna().sum()
    for status, count in mad.items():
        pct = (count / total) * 100
        print(f"  {status}: {count} children ({pct:.1f}%)")

print("\nMEAL FREQUENCY:")
if 'S13_17' in df.columns:
    meal_freq = df['S13_17'].value_counts()
    total = df['S13_17'].notna().sum()
    print(f"  Meal frequency distribution:")
    for freq, count in meal_freq.sort_index().items():
        pct = (count / total) * 100
        print(f"    {freq} times: {count} children ({pct:.1f}%)")

print("\nBREASTFEEDING:")
if 'AS13_15' in df.columns:
    bf = df['AS13_15'].value_counts()
    total = df['AS13_15'].notna().sum()
    print(f"  Currently breastfeeding:")
    for status, count in bf.items():
        pct = (count / total) * 100
        print(f"    {status}: {count} children ({pct:.1f}%)")

if 'AS13_15_2' in df.columns:
    ever_bf = df['AS13_15_2'].value_counts()
    total = df['AS13_15_2'].notna().sum()
    print(f"\n  Ever breastfed:")
    for status, count in ever_bf.items():
        pct = (count / total) * 100
        print(f"    {status}: {count} children ({pct:.1f}%)")

# ============================================================================
# SECTION 5: FOOD GROUP CONSUMPTION
# ============================================================================
print("\n" + "=" * 80)
print("5. FOOD GROUP CONSUMPTION (LAST 24 HOURS)")
print("=" * 80)

food_groups = {
    'AS13_16': 'Grains/Cereals (porridge, bread, rice)',
    'BS13_16': 'White potatoes/tubers',
    'CS13_16': 'Legumes and nuts',
    'DS13_16': 'Milk/cheese/yogurt',
    'ES13_16': 'Organ meat (liver, kidney)',
    'FS13_16': 'Meat (beef, pork, lamb, chicken)',
    'GS13_16': 'Fish (fresh or dried)',
    'HS13_16': 'Eggs',
    'IS13_16': 'Vitamin A rich vegetables',
    'JS13_16': 'Dark green leafy vegetables',
    'KS13_16': 'Ripe fruits (mangoes, papaya)',
    'LS13_16': 'Other fruits/vegetables'
}

print("\nFOOD GROUP CONSUMPTION RATES:")
for col, food_group in food_groups.items():
    if col in df.columns:
        consumed = (df[col] == 'Yes').sum() if df[col].dtype == 'object' else (df[col] == 1).sum()
        total = df[col].notna().sum()
        pct = (consumed / total * 100) if total > 0 else 0
        print(f"  {food_group}: {pct:.1f}%")

# ============================================================================
# SECTION 6: CHILD HEALTH & ILLNESS
# ============================================================================
print("\n" + "=" * 80)
print("6. CHILD HEALTH & ILLNESS (LAST 2 WEEKS)")
print("=" * 80)

print("\nILLNESS PREVALENCE:")
illness_vars = {
    'S13_09': 'Fever',
    'S13_10': 'Cough',
    'S13_11': 'Diarrhea'
}

for col, illness in illness_vars.items():
    if col in df.columns:
        had_illness = (df[col] == 'Yes').sum() if df[col].dtype == 'object' else (df[col] == 1).sum()
        total = df[col].notna().sum()
        pct = (had_illness / total * 100) if total > 0 else 0
        print(f"  {illness}: {had_illness} children ({pct:.1f}%)")

print("\nHEALTHCARE ACCESS:")
if 'S13_12' in df.columns:
    healthcare = df['S13_12'].value_counts()
    total = df['S13_12'].notna().sum()
    print(f"  Saw healthcare provider when sick:")
    for status, count in healthcare.items():
        pct = (count / total) * 100
        print(f"    {status}: {count} children ({pct:.1f}%)")

print("\nPREVENTIVE HEALTH MEASURES:")
if 'S13_07' in df.columns:
    vit_a = (df['S13_07'] == 'Yes').sum() if df['S13_07'].dtype == 'object' else (df['S13_07'] == 1).sum()
    total = df['S13_07'].notna().sum()
    pct = (vit_a / total * 100) if total > 0 else 0
    print(f"  Received Vitamin A (last 6 months): {pct:.1f}%")

if 'S13_08' in df.columns:
    deworm = (df['S13_08'] == 'Yes').sum() if df['S13_08'].dtype == 'object' else (df['S13_08'] == 1).sum()
    total = df['S13_08'].notna().sum()
    pct = (deworm / total * 100) if total > 0 else 0
    print(f"  Received deworming (last 6 months): {pct:.1f}%")

if 'S13_14' in df.columns:
    mosquito_net = (df['S13_14'] == 'Yes').sum() if df['S13_14'].dtype == 'object' else (df['S13_14'] == 1).sum()
    total = df['S13_14'].notna().sum()
    pct = (mosquito_net / total * 100) if total > 0 else 0
    print(f"  Slept under mosquito net: {pct:.1f}%")

if 'S13_13' in df.columns:
    handwashing = (df['S13_13'] == 'Yes').sum() if df['S13_13'].dtype == 'object' else (df['S13_13'] == 1).sum()
    total = df['S13_13'].notna().sum()
    pct = (handwashing / total * 100) if total > 0 else 0
    print(f"  Hands washed before eating: {pct:.1f}%")

# ============================================================================
# SECTION 7: MATERNAL FACTORS
# ============================================================================
print("\n" + "=" * 80)
print("7. MATERNAL CHARACTERISTICS")
print("=" * 80)

print("\nMOTHER'S EDUCATION:")
if 'mother_education' in df.columns:
    edu = df['mother_education'].value_counts()
    total = df['mother_education'].notna().sum()
    for level, count in edu.items():
        pct = (count / total) * 100
        print(f"  {level}: {count} ({pct:.1f}%)")

print("\nMOTHER'S LITERACY:")
if 'mother_read_and_write' in df.columns:
    literacy = df['mother_read_and_write'].value_counts()
    total = df['mother_read_and_write'].notna().sum()
    for status, count in literacy.items():
        pct = (count / total) * 100
        print(f"  {status}: {count} ({pct:.1f}%)")

print("\nMOTHER'S MARITAL STATUS:")
if 'mother_marital_status' in df.columns:
    marital = df['mother_marital_status'].value_counts()
    total = df['mother_marital_status'].notna().sum()
    for status, count in marital.items():
        pct = (count / total) * 100
        print(f"  {status}: {count} ({pct:.1f}%)")

print("\nMOTHER'S DISABILITY:")
if 'mother_disability' in df.columns:
    disability = df['mother_disability'].value_counts()
    total = df['mother_disability'].notna().sum()
    for status, count in disability.items():
        pct = (count / total) * 100
        print(f"  {status}: {count} ({pct:.1f}%)")

# ============================================================================
# SECTION 8: HOUSEHOLD CONTEXT
# ============================================================================
print("\n" + "=" * 80)
print("8. HOUSEHOLD SOCIOECONOMIC CONTEXT")
print("=" * 80)

print("\nFOOD SECURITY STATUS:")
if 'FS_final' in df.columns:
    fs = df['FS_final'].value_counts()
    total = df['FS_final'].notna().sum()
    for status, count in fs.items():
        pct = (count / total) * 100
        print(f"  {status}: {count} households ({pct:.1f}%)")

print("\nWEALTH INDEX:")
if 'WI_cat' in df.columns:
    wi = df['WI_cat'].value_counts()
    total = df['WI_cat'].notna().sum()
    for category, count in wi.items():
        pct = (count / total) * 100
        print(f"  {category}: {count} households ({pct:.1f}%)")

print("\nINCOME QUINTILE:")
if 'Income_Quintile' in df.columns:
    inc = df['Income_Quintile'].value_counts().sort_index()
    total = df['Income_Quintile'].notna().sum()
    for quintile, count in inc.items():
        pct = (count / total) * 100
        print(f"  {quintile}: {count} households ({pct:.1f}%)")

print("\nFOOD CONSUMPTION SCORE (FCS):")
if 'FCS' in df.columns:
    fcs = df['FCS'].dropna()
    print(f"  Mean FCS: {fcs.mean():.1f}")
    print(f"  Median FCS: {fcs.median():.1f}")
    print(f"  Range: {fcs.min():.0f} - {fcs.max():.0f}")

if 'FCG' in df.columns:
    print("\n  Food Consumption Groups:")
    fcg = df['FCG'].value_counts()
    total = df['FCG'].notna().sum()
    for group, count in fcg.items():
        pct = (count / total) * 100
        print(f"    {group}: {count} households ({pct:.1f}%)")

# ============================================================================
# SECTION 9: KEY ASSOCIATIONS
# ============================================================================
print("\n" + "=" * 80)
print("9. MALNUTRITION ASSOCIATIONS")
print("=" * 80)

print("\nSTUNTING BY HOUSEHOLD FOOD SECURITY:")
if 'Stunting' in df.columns and 'FS_final' in df.columns:
    stunting_fs = pd.crosstab(df['FS_final'], df['Stunting'], normalize='index') * 100
    # Calculate total stunting
    stunted_total = pd.Series(0.0, index=stunting_fs.index)
    if 'Moderately stunted' in stunting_fs.columns:
        stunted_total += stunting_fs['Moderately stunted']
    if 'Severely stunted' in stunting_fs.columns:
        stunted_total += stunting_fs['Severely stunted']
    
    for fs_status, rate in stunted_total.items():
        print(f"  {fs_status}: {rate:.1f}% stunted")

print("\nSTUNTING BY WEALTH INDEX:")
if 'Stunting' in df.columns and 'WI_cat' in df.columns:
    stunting_wi = pd.crosstab(df['WI_cat'], df['Stunting'], normalize='index') * 100
    # Calculate total stunting
    stunted_total = pd.Series(0.0, index=stunting_wi.index)
    if 'Moderately stunted' in stunting_wi.columns:
        stunted_total += stunting_wi['Moderately stunted']
    if 'Severely stunted' in stunting_wi.columns:
        stunted_total += stunting_wi['Severely stunted']
    
    for wi_cat, rate in stunted_total.items():
        print(f"  {wi_cat}: {rate:.1f}% stunted")

print("\nSTUNTING BY DIETARY DIVERSITY:")
if 'Stunting' in df.columns and 'minimumDietaryDiversity' in df.columns:
    stunting_mdd = pd.crosstab(df['minimumDietaryDiversity'], df['Stunting'], normalize='index') * 100
    # Calculate total stunting
    stunted_total = pd.Series(0.0, index=stunting_mdd.index)
    if 'Moderately stunted' in stunting_mdd.columns:
        stunted_total += stunting_mdd['Moderately stunted']
    if 'Severely stunted' in stunting_mdd.columns:
        stunted_total += stunting_mdd['Severely stunted']
    
    for mdd_status, rate in stunted_total.items():
        print(f"  {mdd_status}: {rate:.1f}% stunted")

print("\nWASTING BY RECENT ILLNESS:")
if 'Wasting' in df.columns and 'S13_11' in df.columns:
    wasting_illness = pd.crosstab(df['S13_11'], df['Wasting'], normalize='index') * 100
    # Calculate total wasting
    wasted_total = pd.Series(0.0, index=wasting_illness.index)
    if 'Moderately wasted' in wasting_illness.columns:
        wasted_total += wasting_illness['Moderately wasted']
    if 'Severely wasted' in wasting_illness.columns:
        wasted_total += wasting_illness['Severely wasted']
    
    for illness_status, rate in wasted_total.items():
        print(f"  Had diarrhea={illness_status}: {rate:.1f}% wasted")

print("\n" + "=" * 80)
print("ANALYSIS COMPLETE!")
print("=" * 80)
print("\nKey insights generated. Ready for visualization and deeper analysis.")
