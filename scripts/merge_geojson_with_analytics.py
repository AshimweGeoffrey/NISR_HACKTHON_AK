#!/usr/bin/env python3
"""
Merge analytics JSON into the GeoJSON used by the frontend map.

Reads:
 - nisr-frontend/src/components/rwanda_districts.json (GeoJSON features)
 - nisr-frontend/public/data/district_analytics.json (analytics records)

Writes:
 - nisr-frontend/public/rwanda_districts.json (enriched GeoJSON the frontend fetches)

Usage:
  python3 scripts/merge_geojson_with_analytics.py

The script matches analytics 'District' to GeoJSON feature.properties.NAME_2 using a
simple normalization (casefold, remove non-alphanum). It reports matched and unmatched
districts.
"""

from pathlib import Path
import json
import re
import unicodedata
from pprint import pprint


ROOT = Path(__file__).resolve().parents[1]
SRC_GEOJSON = ROOT / 'nisr-frontend' / 'src' / 'components' / 'rwanda_districts.json'
ANALYTICS = ROOT / 'nisr-frontend' / 'public' / 'data' / 'district_analytics.json'
DEST = ROOT / 'nisr-frontend' / 'public' / 'rwanda_districts.json'


def normalize(name: str) -> str:
    if name is None:
        return ''
    # unicode normalize, lower, remove non-alphanumeric
    n = unicodedata.normalize('NFKD', str(name))
    n = n.casefold()
    n = re.sub(r"[^0-9a-z]+", '', n)
    return n


def load_json(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    print('Loading geojson from', SRC_GEOJSON)
    geo = load_json(SRC_GEOJSON)

    print('Loading analytics from', ANALYTICS)
    analytics = load_json(ANALYTICS)

    # build analytics lookup
    lookup = {}
    for rec in analytics:
        key = normalize(rec.get('District'))
        if not key:
            continue
        lookup[key] = rec

    features = geo.get('features', [])
    matched = 0
    unmatched = []

    for feat in features:
        props = feat.get('properties', {})
        name2 = props.get('NAME_2') or props.get('NAME') or props.get('name')
        key = normalize(name2)
        rec = lookup.get(key)
        if rec:
            # inject fields into properties (do not remove existing props)
            props['Stunting_Rate'] = rec.get('Stunting_Rate')
            props['Wasting_Rate'] = rec.get('Wasting_Rate')
            props['Underweight_Rate'] = rec.get('Underweight_Rate')
            props['RiskScore'] = rec.get('RiskScore')
            props['Hotspot'] = rec.get('Hotspot')
            props['Recommendations'] = rec.get('Recommendations')
            matched += 1
        else:
            unmatched.append(name2)

    print(f'Matched analytics to {matched} features, {len(unmatched)} unmatched')
    if unmatched:
        print('Some unmatched districts (sample 20):')
        pprint(unmatched[:20])

    # write to DEST
    DEST.parent.mkdir(parents=True, exist_ok=True)
    with open(DEST, 'w', encoding='utf-8') as f:
        json.dump(geo, f, ensure_ascii=False)

    print('Wrote enriched GeoJSON to', DEST)


if __name__ == '__main__':
    main()
