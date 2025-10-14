"""
Script: generate_frontend_json.py
Purpose: Read analysis data from `Nisr-Data_analysis` (CSV / Stata) and write JSON files into `nisr-frontend/public/data` for the frontend to consume.

Usage:
  python scripts/generate_frontend_json.py

The script will:
- Read `child_nutrition/district_malnutrition_rates.csv` and write `district_malnutrition_rates.json`
- Attempt to read common .dta files in `Nisr-Data_analysis/data/` and convert sample metadata or selected variables to JSON.

Notes:
- Requires pandas to read Stata (.dta) files.
- This script is read-only for analysis folders and will only write into `nisr-frontend/public/data/`.
"""

import os
import json
from pathlib import Path

try:
    import pandas as pd
except Exception as e:
    print("pandas is required. Install with: pip install pandas")
    raise

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / 'Nisr-Data_analysis'
FRONTEND_DATA_DIR = ROOT / 'nisr-frontend' / 'public' / 'data'
SCRIPTS_DIR = ROOT / 'scripts'

FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)

outputs = []

# 1) Convert district_malnutrition_rates.csv
csv_path = DATA_DIR / 'child_nutrition' / 'district_malnutrition_rates.csv'
if csv_path.exists():
    print(f"Reading {csv_path}")
    df = pd.read_csv(csv_path)
    out_path = FRONTEND_DATA_DIR / 'district_malnutrition_rates.json'
    df.to_json(out_path, orient='records', force_ascii=False, date_format='iso')
    outputs.append(str(out_path))

    # Generate enriched analytics JSONs from district malnutrition rates
    try:
        # Ensure numeric columns are floats
        num_cols = ['Stunting_Rate', 'Wasting_Rate', 'Underweight_Rate']
        for c in num_cols:
            if c in df.columns:
                df[c] = pd.to_numeric(df[c], errors='coerce').fillna(0.0)

        # Risk score: weighted combination (Stunting 60%, Wasting 30%, Underweight 10%)
        df['RiskScore'] = (0.6 * df.get('Stunting_Rate', 0.0) +
                           0.3 * df.get('Wasting_Rate', 0.0) +
                           0.1 * df.get('Underweight_Rate', 0.0))
        # Cap score to 100
        df['RiskScore'] = df['RiskScore'].clip(upper=100)

        def hotspot_category(score):
            if score >= 40:
                return 'Severe'
            if score >= 25:
                return 'High'
            if score >= 15:
                return 'Moderate'
            return 'Low'

        df['Hotspot'] = df['RiskScore'].apply(hotspot_category)

        # Recommendations by hotspot
        rec_map = {
            'Severe': [
                'Immediate nutrition interventions (supplementary feeding).',
                'Strengthen community health and growth monitoring.',
                'Short-term cash or food assistance and agricultural support.'
            ],
            'High': [
                'Targeted nutrition education and supplementation.',
                'Improve access to clean water and sanitation.',
                'Support small-holder agriculture and diversification.'
            ],
            'Moderate': [
                'Nutrition counselling and school feeding pilots.',
                'Sanitation improvements and hygiene promotion.'
            ],
            'Low': [
                'Maintain preventive programs and monitoring.'
            ]
        }

        analytics = []
        for _, row in df.iterrows():
            recs = rec_map.get(row['Hotspot'], [])
            analytics.append({
                'District': row.get('District'),
                'Province': row.get('Province'),
                'Stunting_Rate': float(row.get('Stunting_Rate', 0.0)),
                'Wasting_Rate': float(row.get('Wasting_Rate', 0.0)),
                'Underweight_Rate': float(row.get('Underweight_Rate', 0.0)),
                'RiskScore': float(round(row.get('RiskScore', 0.0), 2)),
                'Hotspot': row.get('Hotspot'),
                'Recommendations': recs
            })

        # Write district analytics file (to be joined with GeoJSON by frontend)
        district_analytics_path = FRONTEND_DATA_DIR / 'district_analytics.json'
        with open(district_analytics_path, 'w', encoding='utf-8') as f:
            json.dump(analytics, f, ensure_ascii=False, indent=2)
        outputs.append(str(district_analytics_path))

        # Top hotspots by RiskScore and by Stunting
        top_by_risk = df.sort_values('RiskScore', ascending=False).head(10)
        top_by_stunting = df.sort_values('Stunting_Rate', ascending=False).head(10)

        top_hotspots = {
            'by_risk': top_by_risk[['District', 'Province', 'RiskScore', 'Hotspot']].to_dict(orient='records'),
            'by_stunting': top_by_stunting[['District', 'Province', 'Stunting_Rate']].to_dict(orient='records')
        }
        top_path = FRONTEND_DATA_DIR / 'top_hotspots.json'
        with open(top_path, 'w', encoding='utf-8') as f:
            json.dump(top_hotspots, f, ensure_ascii=False, indent=2)
        outputs.append(str(top_path))

        # Province summaries
        prov = df.groupby('Province').agg({
            'Stunting_Rate': 'mean',
            'Wasting_Rate': 'mean',
            'Underweight_Rate': 'mean',
            'RiskScore': 'mean'
        }).reset_index()
        prov['Stunting_Rate'] = prov['Stunting_Rate'].round(2)
        prov['Wasting_Rate'] = prov['Wasting_Rate'].round(2)
        prov['Underweight_Rate'] = prov['Underweight_Rate'].round(2)
        prov['RiskScore'] = prov['RiskScore'].round(2)

        province_summary_path = FRONTEND_DATA_DIR / 'province_summary.json'
        prov.to_json(province_summary_path, orient='records', force_ascii=False)
        outputs.append(str(province_summary_path))

        # Policy briefs: auto-generate concise briefs per hotspot province
        briefs = []
        for _, prow in prov.iterrows():
            province = prow['Province']
            brief = {
                'Province': province,
                'Summary': f"{province} has average stunting rate {prow['Stunting_Rate']}% and a risk score of {prow['RiskScore']}. Priority: scale-up nutrition and WASH interventions in high-risk districts.",
                'RecommendedActions': [
                    'Scale up community-based management of acute malnutrition.',
                    'Invest in maternal & child health services and growth monitoring.',
                    'Promote diversified agriculture and market access for nutritious foods.'
                ]
            }
            briefs.append(brief)

        briefs_path = FRONTEND_DATA_DIR / 'policy_briefs.json'
        with open(briefs_path, 'w', encoding='utf-8') as f:
            json.dump(briefs, f, ensure_ascii=False, indent=2)
        outputs.append(str(briefs_path))

    except Exception as e:
        print('Failed to generate analytics JSONs:', e)
else:
    print(f"Warning: {csv_path} not found")

# 2) Convert available .dta files (sample first N rows and columns) as JSON metadata + sample
dta_dir = DATA_DIR / 'data'
if dta_dir.exists():
    for dta in dta_dir.glob('*.dta'):
        name = dta.stem
        try:
            print(f"Reading {dta} (this may take a moment)")
            df = pd.read_stata(dta)
            # create a smaller sample export with columns and first 200 rows
            sample = df.head(200)
            # Simplify column names to str
            sample.columns = [str(c) for c in sample.columns]
            out_sample = FRONTEND_DATA_DIR / f'{name}_sample.json'
            sample.to_json(out_sample, orient='records', force_ascii=False, date_format='iso')
            # Basic metadata
            meta = {
                'file': dta.name,
                'rows': int(len(df)),
                'columns': [str(c) for c in df.columns],
            }
            out_meta = FRONTEND_DATA_DIR / f'{name}_meta.json'
            with open(out_meta, 'w', encoding='utf-8') as f:
                json.dump(meta, f, ensure_ascii=False, indent=2)
            outputs.append(str(out_sample))
            outputs.append(str(out_meta))
        except Exception as e:
            print(f"Failed to read {dta}: {e}")
else:
    print(f"Warning: {dta_dir} not found")

print('\nGenerated files:')
for p in outputs:
    print(' -', p)

print('\nDone. Frontend can consume these files from public/data/*.json')
