import React, { useEffect, useState } from "react";
import "../styles/analytics.css";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
  ZAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

// Simple theme colors used by the analytics widgets (local fallbacks)
const primaryRed = "#b10026";
const primaryBlue = "#2b83d8";
const mutedGray = "#6b7280";
const primarySoft = "#fd8d3c";
const primaryLighter = "#ffd8c4";
const primaryPale = "#ffe7d4";

// Lightweight local types used for small series in this page
type RangeKey = "year" | "month" | "week";
interface CoveragePoint {
  period: string;
  vitaminACoverage: number;
  therapeuticFoodCoverage: number;
}
interface AdmissionsPoint {
  period: string;
  moderateCases: number;
  severeCases: number;
}

// Remove hard-coded mocks: we'll compute these from the JSON model outputs

const coverageSeriesByRange: Record<RangeKey, CoveragePoint[]> = {
  year: [
    { period: "Jan", vitaminACoverage: 68, therapeuticFoodCoverage: 41 },
    { period: "Feb", vitaminACoverage: 70, therapeuticFoodCoverage: 43 },
    { period: "Mar", vitaminACoverage: 73, therapeuticFoodCoverage: 46 },
    { period: "Apr", vitaminACoverage: 76, therapeuticFoodCoverage: 49 },
    { period: "May", vitaminACoverage: 78, therapeuticFoodCoverage: 52 },
    { period: "Jun", vitaminACoverage: 80, therapeuticFoodCoverage: 55 },
    { period: "Jul", vitaminACoverage: 81, therapeuticFoodCoverage: 57 },
    { period: "Aug", vitaminACoverage: 83, therapeuticFoodCoverage: 59 },
    { period: "Sep", vitaminACoverage: 84, therapeuticFoodCoverage: 61 },
    { period: "Oct", vitaminACoverage: 85, therapeuticFoodCoverage: 63 },
    { period: "Nov", vitaminACoverage: 86, therapeuticFoodCoverage: 65 },
    { period: "Dec", vitaminACoverage: 87, therapeuticFoodCoverage: 67 },
  ],
  month: [
    { period: "Week 1", vitaminACoverage: 75, therapeuticFoodCoverage: 50 },
    { period: "Week 2", vitaminACoverage: 77, therapeuticFoodCoverage: 52 },
    { period: "Week 3", vitaminACoverage: 78, therapeuticFoodCoverage: 53 },
    { period: "Week 4", vitaminACoverage: 79, therapeuticFoodCoverage: 54 },
  ],
  week: [
    { period: "Mon", vitaminACoverage: 76, therapeuticFoodCoverage: 52 },
    { period: "Tue", vitaminACoverage: 77, therapeuticFoodCoverage: 53 },
    { period: "Wed", vitaminACoverage: 78, therapeuticFoodCoverage: 54 },
    { period: "Thu", vitaminACoverage: 79, therapeuticFoodCoverage: 55 },
    { period: "Fri", vitaminACoverage: 80, therapeuticFoodCoverage: 56 },
    { period: "Sat", vitaminACoverage: 78, therapeuticFoodCoverage: 55 },
    { period: "Sun", vitaminACoverage: 75, therapeuticFoodCoverage: 52 },
  ],
};

const caseTrendSeriesByRange: Record<RangeKey, AdmissionsPoint[]> = {
  year: [
    { period: "Jan", moderateCases: 4300, severeCases: 1500 },
    { period: "Feb", moderateCases: 4400, severeCases: 1550 },
    { period: "Mar", moderateCases: 4500, severeCases: 1600 },
    { period: "Apr", moderateCases: 4700, severeCases: 1650 },
    { period: "May", moderateCases: 4800, severeCases: 1700 },
    { period: "Jun", moderateCases: 5000, severeCases: 1750 },
    { period: "Jul", moderateCases: 4900, severeCases: 1700 },
    { period: "Aug", moderateCases: 4800, severeCases: 1650 },
    { period: "Sep", moderateCases: 4600, severeCases: 1600 },
    { period: "Oct", moderateCases: 4500, severeCases: 1550 },
    { period: "Nov", moderateCases: 4400, severeCases: 1500 },
    { period: "Dec", moderateCases: 4300, severeCases: 1450 },
  ],
  month: [
    { period: "Week 1", moderateCases: 1200, severeCases: 410 },
    { period: "Week 2", moderateCases: 1250, severeCases: 420 },
    { period: "Week 3", moderateCases: 1300, severeCases: 430 },
    { period: "Week 4", moderateCases: 1280, severeCases: 425 },
  ],
  week: [
    { period: "Mon", moderateCases: 175, severeCases: 60 },
    { period: "Tue", moderateCases: 180, severeCases: 62 },
    { period: "Wed", moderateCases: 185, severeCases: 64 },
    { period: "Thu", moderateCases: 190, severeCases: 65 },
    { period: "Fri", moderateCases: 200, severeCases: 68 },
    { period: "Sat", moderateCases: 185, severeCases: 63 },
    { period: "Sun", moderateCases: 160, severeCases: 58 },
  ],
};

const heatmapSlots = [
  "12am",
  "1am",
  "2am",
  "3am",
  "4am",
  "5am",
  "6am",
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
  "8pm",
  "9pm",
  "10pm",
];

const heatmapData: Array<{ day: string; values: number[] }> = [
  {
    day: "Sun",
    values: [
      500, 600, 800, 1000, 1200, 900, 700, 800, 1100, 1500, 2300, 2600, 3200,
      3500, 3000, 2600, 2200, 2000, 1800, 1500, 1200, 900, 600,
    ],
  },
  {
    day: "Mon",
    values: [
      800, 900, 1100, 1400, 1700, 2000, 2500, 2800, 3200, 3600, 4000, 4300,
      4500, 4600, 4300, 4000, 3600, 3100, 2600, 2200, 1700, 1200, 900,
    ],
  },
  {
    day: "Tue",
    values: [
      700, 800, 1000, 1200, 1500, 1900, 2300, 2800, 3300, 3800, 4100, 4400,
      4600, 4700, 4300, 3800, 3200, 2700, 2300, 1900, 1500, 1100, 800,
    ],
  },
  {
    day: "Wed",
    values: [
      600, 700, 900, 1100, 1400, 1800, 2200, 2500, 3000, 3400, 3800, 4200, 4500,
      4700, 4400, 3900, 3300, 2900, 2500, 2100, 1700, 1300, 900,
    ],
  },
  {
    day: "Thu",
    values: [
      550, 650, 800, 1000, 1300, 1600, 1900, 2300, 2800, 3200, 3600, 4000, 4200,
      4300, 4000, 3500, 3000, 2600, 2200, 1800, 1400, 1000, 700,
    ],
  },
  {
    day: "Fri",
    values: [
      600, 700, 900, 1200, 1600, 2000, 2400, 2900, 3400, 3800, 4200, 4500, 4700,
      4800, 4600, 4100, 3600, 3200, 2800, 2300, 1800, 1300, 900,
    ],
  },
  {
    day: "Sat",
    values: [
      500, 600, 800, 1000, 1200, 1500, 1800, 2200, 2600, 3000, 3400, 3700, 4000,
      4100, 3800, 3400, 2900, 2500, 2100, 1700, 1300, 900, 600,
    ],
  },
];

const heatMax = Math.max(...heatmapData.flatMap((row) => row.values));

const getHeatColor = (value: number) => {
  const intensity = value / heatMax;
  const mix = Math.round(25 + intensity * 60);
  return `color-mix(in srgb, var(--color-secondary-400-400) ${mix}%, transparent)`;
};

// Shared perceptual heat palette used for both the day×area heatmap and the
// indicator matrix. Accepts a fraction t in [0,1] and returns an rgba color.
const heatPaletteFromFraction = (t: number) => {
  const tt = Math.min(1, Math.max(0, t || 0));
  if (tt <= 0) return "#ffffff00";
  if (tt < 0.4) return `rgba(255,247,188,${0.35 + tt * 0.9})`;
  if (tt < 0.75) return `rgba(254,196,79,${0.45 + (tt - 0.4) * 1.1})`;
  return `rgba(179,0,0,${0.55 + (tt - 0.75) * 1.2})`;
};

// Helper to compute a Day-of-week x Area (district or province) heatmap from child sample data
// level: 'district' | 'province' (default: 'province' for denser aggregates)
const computeHeatmapFromSample = (
  sample: any[] | null,
  level: "district" | "province" = "province"
) => {
  if (!sample || !sample.length) return null;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // consider only visits to formal health facilities / staff
  // common survey values include: "Staff at health facility", "Community health care worker",
  // "None", "Other", etc. We treat facility/staff values as facility visits.
  const isFacilityVisit = (row: any) => {
    const v = row.S13_12;
    if (v === null || v === undefined) return false;
    const s = String(v).toLowerCase();
    // accept common facility indicators
    return (
      s.includes("staff") ||
      s.includes("health facility") ||
      s.includes("clinic") ||
      s.includes("hospital") ||
      s.includes("facility")
    );
  };

  const counts: Record<string, Record<string, number>> = {};
  const totals: Record<string, number> = {};

  sample.forEach((r: any) => {
    try {
      const d = r.S0_B_DATE ? new Date(r.S0_B_DATE) : null;
      if (!d || isNaN(d.getTime())) return;
      const day = days[d.getDay()];
      const district =
        level === "province"
          ? r.S0_C_Prov || r.S0_C_Prov || r.Province || "Unknown"
          : r.S0_D_Dist || r.S0_D_Dist || r.District || "Unknown";
      if (!counts[district]) counts[district] = {};
      counts[district][day] = counts[district][day] || 0;
      // increment only for facility visits (avoid double-counting)
      if (isFacilityVisit(r)) {
        counts[district][day] += 1;
        totals[district] = (totals[district] || 0) + 1;
      }
    } catch (e) {
      // ignore parse errors
    }
  });

  // show only top K districts to keep the heatmap readable; smaller default = 8
  // if aggregating by province, we may show all provinces (usually 5) so set TOP_K to a larger
  const TOP_K = level === "province" ? 12 : 8;
  const topDistricts = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_K)
    .map((x) => x[0]);

  if (!topDistricts.length) return null;

  const data = days.map((day) => ({
    day,
    values: topDistricts.map((d) => counts[d]?.[day] || 0),
  }));

  const max = Math.max(...data.flatMap((r) => r.values), 0);
  // use a perceptually-ordered color scale (soft yellow -> orange -> red)
  const getColor = (value: number) => {
    if (max === 0) return "transparent";
    const t = value / max; // 0..1
    // interpolate between three stops: #fff7bc (light) -> #fec44f (mid) -> #b30000 (dark)
    if (t <= 0) return "#ffffff00";
    if (t < 0.4) return `rgba(255,247,188,${0.35 + t * 0.9})`; // light yellowish
    if (t < 0.75) return `rgba(254,196,79,${0.45 + (t - 0.4) * 1.1})`; // orange
    return `rgba(179,0,0,${0.55 + (t - 0.75) * 1.2})`; // deep red
  };

  return { slots: topDistricts, data, max, getColor };
};

const sampleHeatmap = computeHeatmapFromSample(null);

// Compute an indicator matrix (provinces x indicators) from the child sample.
// Each cell is converted to a percentage (0-100) for color mapping; original
// values are kept in tooltip text.
const computeIndicatorMatrixFromSample = (sample: any[] | null) => {
  if (!sample || !sample.length) return null;
  const provinces = Array.from(
    new Set(
      sample.map(
        (r: any) => r.S0_C_Prov || r.S0_C_Prov || r.S0_C_Prov || "Unknown"
      )
    )
  );
  if (!provinces.length) return null;

  // indicators to show and how to compute them
  const indicators = [
    {
      id: "minDD",
      label: "Meets min diet diversity",
      unit: "%",
      compute: (rows: any[]) => {
        const total = rows.length;
        if (!total) return { pct: 0, raw: 0 };
        const ok = rows.filter(
          (r) =>
            r.minimumDietaryDiversity &&
            String(r.minimumDietaryDiversity).toLowerCase().includes("meets")
        ).length;
        return { pct: Math.round((ok / total) * 100), raw: (ok / total) * 100 };
      },
    },
    {
      id: "minMF",
      label: "Meets min meal frequency",
      unit: "%",
      compute: (rows: any[]) => {
        const total = rows.length;
        if (!total) return { pct: 0, raw: 0 };
        const ok = rows.filter(
          (r) =>
            r.minimumMealFrequency &&
            String(r.minimumMealFrequency).toLowerCase().includes("meets")
        ).length;
        return { pct: Math.round((ok / total) * 100), raw: (ok / total) * 100 };
      },
    },
    {
      id: "fcgAccept",
      label: "Acceptable food consumption (FCG)",
      unit: "%",
      compute: (rows: any[]) => {
        const total = rows.length;
        if (!total) return { pct: 0, raw: 0 };
        const ok = rows.filter(
          (r) => r.FCG && String(r.FCG).toLowerCase().includes("acceptable")
        ).length;
        return { pct: Math.round((ok / total) * 100), raw: (ok / total) * 100 };
      },
    },
    {
      id: "foodSecure",
      label: "Food secure or marginally",
      unit: "%",
      compute: (rows: any[]) => {
        const total = rows.length;
        if (!total) return { pct: 0, raw: 0 };
        const ok = rows.filter((r) => {
          const v = r.FS_final || r.FS_final || r.FS_final;
          if (!v) return false;
          const s = String(v).toLowerCase();
          return s.includes("food secure") || s.includes("marginally");
        }).length;
        return { pct: Math.round((ok / total) * 100), raw: (ok / total) * 100 };
      },
    },
    {
      id: "avgFCS",
      label: "Average FCS",
      unit: "score",
      compute: (rows: any[]) => {
        const vals = rows
          .map((r) =>
            typeof r.FCS === "number" ? r.FCS : r.FCS ? Number(r.FCS) : NaN
          )
          .filter((v) => !isNaN(v));
        if (!vals.length) return { pct: 0, raw: 0 };
        const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
        return { pct: avg, raw: avg };
      },
    },
  ];

  // aggregate rows by province
  const grouped: Record<string, any[]> = {};
  provinces.forEach((p) => (grouped[p] = []));
  sample.forEach((r: any) => {
    const p = r.S0_C_Prov || r.S0_C_Prov || r.S0_C_Prov || "Unknown";
    if (!grouped[p]) grouped[p] = [];
    grouped[p].push(r);
  });

  // compute values
  const valuesByIndicator = indicators.map((ind) => {
    const values = provinces.map((p) => ind.compute(grouped[p] || []));
    return { ...ind, values };
  });

  // normalize avgFCS to percentage of max to reuse the same color scale
  const fcsIndex = valuesByIndicator.findIndex((i) => i.id === "avgFCS");
  let maxFcs = 0;
  if (fcsIndex >= 0) {
    maxFcs = Math.max(
      ...valuesByIndicator[fcsIndex].values.map((v: any) => v.raw || 0)
    );
    if (maxFcs <= 0) maxFcs = 1;
    valuesByIndicator[fcsIndex].values = valuesByIndicator[fcsIndex].values.map(
      (v: any) => ({ ...v, pct: Math.round((v.raw / maxFcs) * 100) })
    );
  }

  // build matrix rows: each row is { label, unit, values: [ { pct, raw } ... ] }
  const rows = valuesByIndicator.map((i) => ({
    label: i.label,
    unit: i.unit,
    values: i.values,
  }));

  // get max pct for color scale (should be 100 for pct indicators)
  const maxPct = Math.max(
    ...rows.flatMap((r) => r.values.map((v: any) => v.pct || 0)),
    0
  );

  const getColor = (pct: number) => {
    if (!pct) return "#ffffff00";
    const t = Math.min(1, Math.max(0, pct / Math.max(100, maxPct)));
    return heatPaletteFromFraction(t);
  };

  return { provinces, rows, maxPct, getColor };
};

const axisStyle: Partial<XAxisProps & YAxisProps> = {
  tickLine: false,
  axisLine: false,
  tick: { fill: "var(--color-primary-500)", fontSize: 12 },
};

const AnalyticsPage = () => {
  const [coverageRange, setCoverageRange] = useState<RangeKey>("year");
  const [admissionsRange, setAdmissionsRange] = useState<RangeKey>("year");
  const [districtAnalytics, setDistrictAnalytics] = useState<any[]>([]);
  const [topHotspots, setTopHotspots] = useState<any | null>(null);
  const [policyBriefs, setPolicyBriefs] = useState<any[]>([]);
  const [provinceSummary, setProvinceSummary] = useState<any[]>([]);
  const [districtRates, setDistrictRates] = useState<any[]>([]);
  const [childSample, setChildSample] = useState<any[] | null>(null);

  useEffect(() => {
    // Fetch analytics JSONs generated by the backend script
    fetch("/data/district_analytics.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((data) => setDistrictAnalytics(data))
      .catch(() => setDistrictAnalytics([]));

    fetch("/data/top_hotspots.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve(null)))
      .then((data) => setTopHotspots(data))
      .catch(() => setTopHotspots(null));

    fetch("/data/province_summary.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((d) => setProvinceSummary(d))
      .catch(() => setProvinceSummary([]));

    fetch("/data/district_malnutrition_rates.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((d) => setDistrictRates(d))
      .catch(() => setDistrictRates([]));

    fetch("/data/policy_briefs.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((data) => setPolicyBriefs(data))
      .catch(() => setPolicyBriefs([]));

    // try to fetch child-level sample data to power clinic load heatmap
    fetch("/data/CFSVAHH2021_UNDER_5_ChildWithMother_sample.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((d) => setChildSample(Array.isArray(d) ? d : []))
      .catch(() => setChildSample(null));
  }, []);

  // small derived series: coverage and admissions fallbacks (if no time-series provided)
  const coverageSeries = coverageSeriesByRange[coverageRange];
  const caseTrendSeries = caseTrendSeriesByRange[admissionsRange];

  const admissionsMax =
    caseTrendSeries.length > 0
      ? Math.max(
          ...caseTrendSeries.map(
            (entry) => entry.moderateCases + entry.severeCases
          )
        )
      : 0;
  const admissionsDomain =
    admissionsMax > 0 ? Math.ceil((admissionsMax + 100) / 100) * 100 : 100;

  // Real-data derived summaries
  const totalChildrenMeasured =
    (districtRates && districtRates.length
      ? districtRates.reduce(
          (s: number, d: any) =>
            s + (Number(d.Measured) || Number(d.Total_Children) || 0),
          0
        )
      : 0) || 0;

  const totalStunted =
    (districtRates && districtRates.length
      ? districtRates.reduce(
          (s: number, d: any) => s + (Number(d.Stunted) || 0),
          0
        )
      : 0) || 0;

  const serviceDeliveryPie = [
    { name: "Stunted (survey count)", value: totalStunted, fill: primaryRed },
    {
      name: "Not stunted",
      value: Math.max(0, totalChildrenMeasured - totalStunted),
      fill: primaryBlue,
    },
  ];

  // Aggregate recommendations across districts to surface programmatic channels
  const recommendationCounts: Record<string, number> = {};
  (districtAnalytics || []).forEach((d) => {
    if (Array.isArray(d.Recommendations)) {
      d.Recommendations.forEach((r: string) => {
        const k = String(r).trim();
        recommendationCounts[k] = (recommendationCounts[k] || 0) + 1;
      });
    }
  });

  const recommendationPie = Object.entries(recommendationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, v], i) => ({
      name: k,
      value: v,
      fill: [primaryRed, "#e31a1c", primarySoft, "#31a354", primaryBlue][i % 5],
    }));

  // Build a province-level coverage series for the Micronutrient/coverage card
  const provinceCoverageSeries = (provinceSummary || []).map((p: any) => ({
    province: p.Province,
    stunting: Number(p.Stunting_Rate) || 0,
    wasting: Number(p.Wasting_Rate) || 0,
    underweight: Number(p.Underweight_Rate) || 0,
  }));

  // Compute radial chart values (national averages) or fallback
  const nutritionOutcomeSplitComputed: {
    name: string;
    value: number;
    fill: string;
  }[] =
    provinceSummary && provinceSummary.length
      ? [
          {
            name: "Stunting (U5)",
            value:
              provinceSummary.reduce(
                (s: number, p: any) => s + Number(p.Stunting_Rate),
                0
              ) / provinceSummary.length,
            fill: primaryRed,
          },
          {
            name: "Wasting (U5)",
            value:
              provinceSummary.reduce(
                (s: number, p: any) => s + Number(p.Wasting_Rate),
                0
              ) / provinceSummary.length,
            fill: primaryBlue,
          },
          {
            name: "Underweight (U5)",
            value:
              provinceSummary.reduce(
                (s: number, p: any) => s + Number(p.Underweight_Rate),
                0
              ) / provinceSummary.length,
            fill: mutedGray,
          },
        ]
      : [
          { name: "Stunting (U5)", value: 33.1, fill: primaryRed },
          { name: "Wasting (U5)", value: 4.0, fill: primaryBlue },
          { name: "Underweight (U5)", value: 8.4, fill: mutedGray },
        ];

  // Admissions / caseload proxy: top districts by stunted counts
  const districtCaseloadSeries = (districtRates || [])
    .map((d: any) => ({
      district: d.District,
      stunted: Number(d.Stunted) || 0,
    }))
    .sort((a: any, b: any) => b.stunted - a.stunted)
    .slice(0, 12); // show top 12 districts to keep chart readable

  // Support channels proxy: derive from aggregated Recommendations (which indicate common program areas)
  const supportChannelsFromRecommendations = recommendationPie.map((r) => ({
    name: r.name,
    value: r.value,
    fill: r.fill,
  }));

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div>
          <h1>Rwanda Nutrition Analytics</h1>
          <p>
            Mock monitoring data for malnutrition indicators across districts.
          </p>
        </div>
        {/* Lightweight analytics widgets (non-intrusive) */}
        <div className="header-analytics-widgets" aria-hidden={false}>
          {topHotspots && topHotspots.by_risk && (
            <div className="top-hotspots-widget">
              <strong>Top Hotspots</strong>
              <ol>
                {topHotspots.by_risk.slice(0, 5).map((d: any) => (
                  <li key={d.District}>
                    {d.District} — {d.Hotspot} ({d.RiskScore})
                  </li>
                ))}
              </ol>
            </div>
          )}
          {policyBriefs && policyBriefs.length > 0 && (
            <div className="policy-briefs-widget">
              <strong>Policy briefs</strong>
              <ul>
                {policyBriefs.slice(0, 3).map((b: any) => (
                  <li key={b.Province}>
                    {b.Province}: {b.Summary}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="header-stats">
          <div>
            <span className="label">Children Screened (YTD)</span>
            <strong>612,200</strong>
          </div>
          <div>
            <span className="label">SAM Admissions</span>
            <strong>14,830</strong>
          </div>
          <div>
            <span className="label">Therapeutic Completion</span>
            <strong>67%</strong>
          </div>
        </div>
      </header>

      <section className="analytics-grid">
        {/* Small district analytics preview for quick lookup */}
        {districtAnalytics && districtAnalytics.length > 0 && (
          <aside className="district-analytics-preview card-analytics card-span-1">
            <div className="card-header">
              <h3>District analytics (sample)</h3>
            </div>
            <ul className="district-list">
              {districtAnalytics.slice(0, 8).map((d) => (
                <li key={d.District}>
                  <strong>{d.District}</strong>
                  <div className="small-meta">
                    {d.Province} — {d.Hotspot} ({d.RiskScore})
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <article className="card-analytics card-span-2">
          <div className="card-header">
            <h2>District screening preview</h2>
            <span className="metric-sub">
              Stunting and wasting rates (sample preview by district)
            </span>
            <div className="indicator-group">
              <span className="indicator users" /> Children Screened
              <span className="indicator new" /> SAM Admissions
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-primary-100)"
              />
              <XAxis dataKey="month" type="category" {...axisStyle} />
              <YAxis
                dataKey="childrenScreened"
                type="number"
                domain={[0, "dataMax"]}
                {...axisStyle}
              />
              <ZAxis dataKey="severityIndex" range={[80, 240]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => {
                  if (name === "childrenScreened") {
                    return [`${Number(value).toFixed(1)}%`, "Stunting rate"];
                  }
                  if (name === "samAdmissions") {
                    return [`${Number(value).toFixed(1)}%`, "Wasting rate"];
                  }
                  if (name === "severityIndex") {
                    return [`${value}`, "Risk score"];
                  }
                  return [String(value), name];
                }}
              />
              <Scatter
                data={districtAnalytics.map((d) => ({
                  month: d.District,
                  childrenScreened: Number(d.Stunting_Rate) || 0,
                  samAdmissions: Number(d.Wasting_Rate) || 0,
                  severityIndex: Number(d.RiskScore) || 0,
                }))}
                fill={primaryRed}
                name="District screening preview"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </article>

        <article className="card-analytics">
          <div className="card-header">
            <h2>Nutrition outcomes (U5)</h2>
            <span className="metric-sub">
              National averages for stunting, wasting and underweight
            </span>
          </div>
          <div className="radial-chart">
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart
                innerRadius="45%"
                outerRadius="105%"
                data={nutritionOutcomeSplitComputed}
                startAngle={100}
                endAngle={-260}
              >
                <RadialBar background dataKey="value" cornerRadius={12} />
                <Tooltip
                  formatter={(value: number) => [
                    `${Number(value).toFixed(1)}%`,
                    "Prevalence",
                  ]}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <ul className="radial-legend">
            {nutritionOutcomeSplitComputed.map((item) => (
              <li key={item.name}>
                <span className="radial-legend-label">
                  <span className="swatch" style={{ background: item.fill }} />
                  {item.name}
                </span>
                <strong>{item.value}%</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="card-analytics heatmap-card card-span-3">
          <div className="card-header">
            <h2>Food security & WASH matrix</h2>
            <span className="metric-sub">
              Province-level indicators (diet diversity, meal frequency, FCG,
              FCS)
            </span>
          </div>
          {/* Use sample-derived indicator matrix when available; otherwise keep the static demo heatmap */}
          {childSample && computeIndicatorMatrixFromSample(childSample) ? (
            (() => {
              const m = computeIndicatorMatrixFromSample(childSample)!;
              return (
                <>
                  <div className="matrix-grid" style={{ padding: 6 }}>
                    <div
                      className="matrix-header"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div style={{ width: 160 }} />
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {m.provinces.map((p: string) => (
                          <div
                            key={p}
                            style={{
                              minWidth: 90,
                              textAlign: "center",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      {m.rows.map((row: any, rIdx: number) => (
                        <div
                          key={row.label}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <div style={{ width: 160, fontWeight: 600 }}>
                            {row.label}
                            <small style={{ marginLeft: 8, fontWeight: 400 }}>
                              {row.unit}
                            </small>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {row.values.map((cell: any, cIdx: number) => (
                              <div
                                key={`${rIdx}-${cIdx}`}
                                className="matrix-cell"
                                title={`${m.provinces[cIdx]} — ${row.label}: ${
                                  cell.pct
                                }${row.unit === "%" ? "%" : ""} (raw: ${Number(
                                  cell.raw
                                ).toFixed(1)})`}
                                style={{
                                  width: 90,
                                  height: 36,
                                  backgroundColor: m.getColor(cell.pct),
                                  borderRadius: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                }}
                              >
                                <strong>
                                  {cell.pct}
                                  {row.unit === "%" ? "%" : ""}
                                </strong>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 8 }} className="heatmap-note">
                      <small>
                        Matrix shows percent (or normalized score) by province
                        for selected food-security indicators computed from the
                        child sample data.
                      </small>
                    </div>
                    <footer
                      className="heatmap-legend"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 8,
                      }}
                    >
                      <span>0</span>
                      <div
                        style={{
                          flex: 1,
                          height: 10,
                          borderRadius: 6,
                          background:
                            "linear-gradient(90deg,#fff7bc 0%, #fec44f 50%, #b30000 100%)",
                        }}
                      />
                      <span>50</span>
                      <span style={{ marginLeft: 8 }}>100</span>
                    </footer>
                  </div>
                </>
              );
            })()
          ) : (
            <>
              <div className="heatmap">
                <div className="heatmap-days">
                  <span />
                  {heatmapData.map((row) => (
                    <span key={row.day}>{row.day}</span>
                  ))}
                </div>
                <div className="heatmap-grid">
                  <div className="heatmap-hours">
                    {heatmapSlots.map((slot) => (
                      <span key={slot}>{slot}</span>
                    ))}
                  </div>
                  <div className="heatmap-cells">
                    {heatmapData.map((row) => (
                      <div className="heatmap-row" key={row.day}>
                        {row.values.map((value, index) => (
                          <span
                            key={`${row.day}-${index}`}
                            style={{ backgroundColor: getHeatColor(value) }}
                            title={`${row.day} ${
                              heatmapSlots[index]
                            }: ${value.toLocaleString()} users`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <footer className="heatmap-legend">
                <span>500</span>
                <div className="legend-bar" />
                <span>{heatMax.toLocaleString()}</span>
              </footer>
            </>
          )}
        </article>

        <article className="card-analytics card-span-2">
          <div className="card-header">
            <h2>Province nutrition summary</h2>
            <span className="metric-sub">
              Average stunting, wasting and underweight prevalence by province
            </span>
          </div>
          <div style={{ padding: 12 }}>
            {provinceSummary && provinceSummary.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {provinceSummary.map((p: any) => (
                  <div
                    key={p.Province}
                    style={{
                      padding: 8,
                      border: "1px solid var(--color-primary-100)",
                      borderRadius: 6,
                    }}
                  >
                    <strong>{p.Province}</strong>
                    <div>Stunting: {Number(p.Stunting_Rate).toFixed(1)}%</div>
                    <div>Wasting: {Number(p.Wasting_Rate).toFixed(1)}%</div>
                    <div>
                      Underweight: {Number(p.Underweight_Rate).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No province summary available</div>
            )}
          </div>
        </article>

        <article className="card-analytics">
          <div className="card-header">
            <h2>Treatment/admissions proxy</h2>
            <span className="metric-sub">
              Stunted caseload proxy by district (top districts)
            </span>
          </div>
          <div style={{ padding: 12 }}>
            {districtRates && districtRates.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={districtRates.map((d: any) => ({
                    district: d.District,
                    stunted: Number(d.Stunted) || 0,
                  }))}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-primary-100)"
                  />
                  <XAxis dataKey="district" {...axisStyle} />
                  <YAxis {...axisStyle} />
                  <Tooltip />
                  <Bar dataKey="stunted" fill={primaryRed} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div>No rate data</div>
            )}
          </div>
        </article>
        <article className="card-analytics">
          <div className="card-header">
            <h2>Stunting breakdown (survey)</h2>
            <span className="metric-sub">
              Share of measured children who are stunted vs not stunted
            </span>
          </div>
          <div className="center-pie">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={serviceDeliveryPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {serviceDeliveryPie.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="center-label">
              <strong>{totalChildrenMeasured.toLocaleString()}</strong>
              <span>Children measured</span>
            </div>
          </div>
        </article>

        <article className="card-analytics">
          <div className="card-header">
            <h2>Support channels & recommendations</h2>
            <span className="metric-sub">
              Where families seek care — aggregated recommendation mentions
            </span>
          </div>
          <div className="center-pie">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={supportChannelsFromRecommendations}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {supportChannelsFromRecommendations.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="center-label">
              <strong>
                {supportChannelsFromRecommendations.reduce(
                  (s, x) => s + x.value,
                  0
                )}
              </strong>
              <span>Recommendation mentions</span>
            </div>
          </div>
          <ul className="referral-list">
            {supportChannelsFromRecommendations.map((item) => (
              <li key={item.name}>
                <span className="swatch" style={{ background: item.fill }} />
                {item.name} <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card-analytics card-span-2">
          <div className="card-header">
            <h2>Coverage & malnutrition trends</h2>
            <span className="metric-sub">
              Micronutrient coverage (fallback) or malnutrition rates by
              period/province
            </span>
            <div className="tab-group">
              <button
                className={coverageRange === "year" ? "active" : ""}
                onClick={() => setCoverageRange("year")}
                type="button"
              >
                Year
              </button>
              <button
                className={coverageRange === "month" ? "active" : ""}
                onClick={() => setCoverageRange("month")}
                type="button"
              >
                Month
              </button>
              <button
                className={coverageRange === "week" ? "active" : ""}
                onClick={() => setCoverageRange("week")}
                type="button"
              >
                Week
              </button>
            </div>
          </div>
          {provinceCoverageSeries && provinceCoverageSeries.length > 0 ? (
            <div style={{ padding: 12 }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={provinceCoverageSeries} margin={{ top: 5 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-primary-100)"
                  />
                  <XAxis dataKey="province" {...axisStyle} />
                  <YAxis {...axisStyle} />
                  <Tooltip />
                  <Bar dataKey="stunting" fill={primaryRed} name="Stunting %" />
                  <Bar dataKey="wasting" fill={primaryBlue} name="Wasting %" />
                  <Bar
                    dataKey="underweight"
                    fill={mutedGray}
                    name="Underweight %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={coverageSeries}
                margin={{ left: 0, right: 0, top: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-primary-100)"
                />
                <XAxis dataKey="period" {...axisStyle} />
                <YAxis
                  {...axisStyle}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="vitaminACoverage"
                  stroke={primaryBlue}
                  fill="url(#colorUsers)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="therapeuticFoodCoverage"
                  stroke={primaryRed}
                  fill="url(#colorNewUsers)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={primaryBlue}
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor={primaryBlue}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorNewUsers"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={primaryRed}
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor={primaryRed}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </article>

        <article className="card-analytics card-span-2">
          <div className="card-header">
            <h2>Treatment admissions</h2>
            <span className="metric-sub">
              Estimated admissions: moderate and severe cases
            </span>
            <div className="tab-group">
              <button
                className={admissionsRange === "year" ? "active" : ""}
                onClick={() => setAdmissionsRange("year")}
                type="button"
              >
                Year
              </button>
              <button
                className={admissionsRange === "month" ? "active" : ""}
                onClick={() => setAdmissionsRange("month")}
                type="button"
              >
                Month
              </button>
              <button
                className={admissionsRange === "week" ? "active" : ""}
                onClick={() => setAdmissionsRange("week")}
                type="button"
              >
                Week
              </button>
            </div>
          </div>
          {districtCaseloadSeries && districtCaseloadSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={districtCaseloadSeries} barSize={28}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-primary-100)"
                />
                <XAxis dataKey="district" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip />
                <Bar dataKey="stunted" fill={primaryRed} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={caseTrendSeries} barSize={28}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-primary-100)"
                />
                <XAxis dataKey="period" {...axisStyle} />
                <YAxis
                  {...axisStyle}
                  domain={[0, admissionsDomain]}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <Tooltip />
                <Bar
                  dataKey="moderateCases"
                  stackId="a"
                  fill={mutedGray}
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="severeCases"
                  stackId="a"
                  fill={primaryRed}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </article>
      </section>
    </div>
  );
};

export default AnalyticsPage;
