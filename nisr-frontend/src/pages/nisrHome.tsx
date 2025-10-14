import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/nisrHome.css";

export default function NisrHome() {
  const navigate = useNavigate();
  const [policyBriefs, setPolicyBriefs] = useState<any[]>([]);
  const [districtAnalytics, setDistrictAnalytics] = useState<any[]>([]);
  const [topHotspots, setTopHotspots] = useState<any[]>([]);
  const [provinceSummary, setProvinceSummary] = useState<any[]>([]);

  // derived insights
  const [averageRisk, setAverageRisk] = useState<number | null>(null);
  const [hotspotCounts, setHotspotCounts] = useState<any>({});
  const [topDistricts, setTopDistricts] = useState<any[]>([]);
  const [totalDistricts, setTotalDistricts] = useState<number>(0);
  const [recommendationCounts, setRecommendationCounts] = useState<any>({});
  const [provinceAverages, setProvinceAverages] = useState<any[]>([]);
  const [criticalCount, setCriticalCount] = useState<number>(0);

  useEffect(() => {
    fetch("/data/policy_briefs.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((d) => setPolicyBriefs(d))
      .catch(() => setPolicyBriefs([]));
  }, []);

  useEffect(() => {
    // load district analytics and hotspots
    fetch("/data/district_analytics.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((d) => setDistrictAnalytics(d))
      .catch(() => setDistrictAnalytics([]));

    fetch("/data/top_hotspots.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((d) => setTopHotspots(d))
      .catch(() => setTopHotspots([]));

    fetch("/data/province_summary.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((d) => setProvinceSummary(d))
      .catch(() => setProvinceSummary([]));
  }, []);

  useEffect(() => {
    if (!districtAnalytics || districtAnalytics.length === 0) return;

    // average RiskScore
    const scores = districtAnalytics
      .map((d: any) => (d.RiskScore !== undefined ? Number(d.RiskScore) : NaN))
      .filter((s: number) => !isNaN(s));
    const avg = scores.length
      ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
      : null;
    setAverageRisk(avg !== null ? Number(avg.toFixed(1)) : null);

    // hotspot counts
    const counts: any = {};
    districtAnalytics.forEach((d: any) => {
      const h = d.Hotspot || "Unknown";
      counts[h] = (counts[h] || 0) + 1;
    });
    setHotspotCounts(counts);

    // top districts by RiskScore
    const tops = [...districtAnalytics]
      .filter(
        (d: any) => d.RiskScore !== undefined && !isNaN(Number(d.RiskScore))
      )
      .sort((a: any, b: any) => Number(b.RiskScore) - Number(a.RiskScore))
      .slice(0, 5);
    setTopDistricts(tops);
  }, [districtAnalytics]);

  useEffect(() => {
    // count districts with RiskScore >= 40 (highest risk)
    const critical = districtAnalytics.filter(
      (d: any) =>
        d.RiskScore !== undefined &&
        !isNaN(Number(d.RiskScore)) &&
        Number(d.RiskScore) >= 40
    ).length;
    setCriticalCount(critical);
  }, [districtAnalytics]);

  useEffect(() => {
    // totals and recommendation aggregation
    setTotalDistricts(districtAnalytics.length || 0);

    const recCounts: any = {};
    districtAnalytics.forEach((d: any) => {
      if (Array.isArray(d.Recommendations)) {
        d.Recommendations.forEach((r: string) => {
          const key = String(r).trim();
          if (!key) return;
          recCounts[key] = (recCounts[key] || 0) + 1;
        });
      }
    });
    setRecommendationCounts(recCounts);

    // province averages - prefer server-provided summary (accept `AvgRisk` or `RiskScore`), fallback to district grouping
    if (provinceSummary && provinceSummary.length) {
      // detect numeric field from server summary: AvgRisk or RiskScore
      const sample = provinceSummary[0];
      const field =
        sample && typeof sample.AvgRisk === "number"
          ? "AvgRisk"
          : sample && typeof sample.RiskScore === "number"
          ? "RiskScore"
          : null;
      if (field) {
        const arr = provinceSummary
          .map((p: any) => ({
            Province: p.Province,
            AvgRisk: Number(p[field]) || 0,
          }))
          .sort((a: any, b: any) => Number(b.AvgRisk) - Number(a.AvgRisk));
        setProvinceAverages(arr.slice(0, 6));
      } else {
        // fallback to computing from district-level data
        const byProv: any = {};
        districtAnalytics.forEach((d: any) => {
          const p = d.Province || d.ProvinceName || d.NAME_1 || "Unknown";
          byProv[p] = byProv[p] || [];
          if (d.RiskScore !== undefined && !isNaN(Number(d.RiskScore)))
            byProv[p].push(Number(d.RiskScore));
        });
        const arr = Object.keys(byProv).map((k) => ({
          Province: k,
          AvgRisk: byProv[k].length
            ? byProv[k].reduce((a: number, b: number) => a + b, 0) /
              byProv[k].length
            : 0,
        }));
        arr.sort((a, b) => Number(b.AvgRisk) - Number(a.AvgRisk));
        setProvinceAverages(arr.slice(0, 6));
      }
    } else {
      const byProv: any = {};
      districtAnalytics.forEach((d: any) => {
        const p = d.Province || d.ProvinceName || d.NAME_1 || "Unknown";
        byProv[p] = byProv[p] || [];
        if (d.RiskScore !== undefined && !isNaN(Number(d.RiskScore)))
          byProv[p].push(Number(d.RiskScore));
      });
      const arr = Object.keys(byProv).map((k) => ({
        Province: k,
        AvgRisk: byProv[k].length
          ? byProv[k].reduce((a: number, b: number) => a + b, 0) /
            byProv[k].length
          : 0,
      }));
      arr.sort((a, b) => Number(b.AvgRisk) - Number(a.AvgRisk));
      setProvinceAverages(arr.slice(0, 6));
    }
  }, [districtAnalytics, provinceSummary]);

  return (
    <div className="min-h-screen">
      {/* Navigation (kept minimal; component provides markup) */}

      {/* Hero Section - data-driven storytelling */}
      <section className="py-16  hero-full" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto hero-grid">
          {/* Left Column - Story & Key Insights */}
          <div className="hero-cards">
            <div className="card large">
              <div className="muted-label">
                National Nutrition Snapshot — 2025
              </div>
              <div className="stat-value-lg">
                {averageRisk !== null ? `${averageRisk}` : "—"}
                <span
                  style={{ display: "block", fontSize: 16, fontWeight: 500 }}
                >
                  average risk score across districts
                </span>
              </div>
              <div style={{ marginTop: 12 }} className="text-sm text-gray-600">
                {topDistricts.length > 0 ? (
                  <>
                    Top hotspot: <strong>{topDistricts[0].District}</strong> —
                    risk {Number(topDistricts[0].RiskScore).toFixed(1)}
                  </>
                ) : (
                  "Insights loading..."
                )}
              </div>
            </div>

            {/* Two column stats: hotspots & province highlight */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "2fr 1fr",
                gap: 16,
              }}
            >
              <div className="card stat-small">
                <div className="muted-label">Hotspots by risk level</div>
                <div className="stat-value-md">
                  {criticalCount} highest • {hotspotCounts["High"] || 0} high
                </div>
              </div>
              {/* right stacked cards */}
              <div className="right-stacked">
                <div className="card stat-red">
                  <div className="stat-value-md">
                    {topDistricts.length > 0 ? topDistricts[0].District : "—"}
                  </div>
                  <div className="muted-label">Highest risk district</div>
                </div>
                <div className="card stat-small">
                  <div className="muted-label">Province most affected</div>
                  <div className="stat-value-md">
                    {provinceAverages && provinceAverages.length
                      ? provinceAverages[0].Province
                      : provinceSummary && provinceSummary.length
                      ? provinceSummary[0].Province
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Overview (storytelling) */}
          <div
            className="overview"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <h1>
              Malnutrition risk is not evenly distributed —
              <br /> it concentrates in a handful of districts.
            </h1>
            <p className="text-sm text-gray-700 mb-8">
              Our analytics combine stunting, wasting and underweight prevalence
              into a single risk score to highlight places that need immediate
              attention. Explore hotspot districts and targeted recommendations.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-maps"
                onClick={() => {
                  navigate("/hotspot");
                }}
              >
                Open Map
              </button>
              <button
                className="btn-maps"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onClick={() => {
                  // Download district analytics as JSON and CSV options
                  const data = districtAnalytics || [];
                  if (!data || data.length === 0) {
                    // fallback: try to fetch the file directly
                    fetch("/data/district_analytics.json")
                      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
                      .then((d) => triggerDownload(d))
                      .catch(() => alert("No report available to download"));
                    return;
                  }
                  triggerDownload(data);
                }}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Remarks / Analytics Summary */}
      <section className="py-16 px-8 closing-section">
        <div className="max-w-7xl mx-auto closing-grid">
          {/* Left side */}
          <div>
            <h2 className="text-4xl font-bold mb-6">What the data tells us</h2>
            <p className="text-sm text-gray-700 mb-6">
              Across {totalDistricts} districts, a small subset accounts for the
              highest malnutrition risk. This summary highlights where targeted
              interventions can generate the largest impact.
            </p>
            <button
              className="btn-maps"
              onClick={() => {
                navigate("/hotspot");
              }}
            >
              Open Interactive Map
            </button>
          </div>

          {/* Right side - Key Figures */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div className="card stat-red">
              <div
                style={{ fontSize: "56px", fontWeight: 700, marginBottom: 12 }}
              >
                {criticalCount}
              </div>
              <div className="text-sm">Highest-risk districts (≥40)</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="card">
                <div style={{ fontSize: 44, fontWeight: 700, marginBottom: 8 }}>
                  {averageRisk !== null ? `${averageRisk}` : "—"}
                </div>
                <div className="text-xs">National average risk score</div>
              </div>
              <div className="card stat-small">
                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                  {Object.keys(recommendationCounts).length}
                </div>
                <div className="text-xs text-gray-700">
                  Unique recommendations surfaced
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy briefs quick view */}
      <section className="py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="mb-4">Policy briefs </h3>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {policyBriefs && policyBriefs.length > 0 ? (
              (() => {
                // Ensure Western brief is included when present
                const briefs: any[] = Array.isArray(policyBriefs)
                  ? [...policyBriefs]
                  : [];
                // find Western if present (case-insensitive match)
                const westernIndex = briefs.findIndex(
                  (p: any) => String(p.Province).toLowerCase() === "western"
                );
                if (westernIndex > -1) {
                  // move Western to the front if not already
                  const western = briefs.splice(westernIndex, 1)[0];
                  // avoid duplicates
                  briefs.unshift(western);
                }
                // de-duplicate by Province (preserve order)
                const seen = new Set();
                const display = [] as any[];
                for (const b of briefs) {
                  const key = String(b.Province || "").trim();
                  if (!key || seen.has(key)) continue;
                  seen.add(key);
                  display.push(b);
                  if (display.length >= 5) break;
                }

                return display.map((b: any) => (
                  <div key={b.Province} className="card">
                    <strong>{b.Province}</strong>
                    <p className="text-sm">{b.Summary}</p>
                  </div>
                ));
              })()
            ) : (
              <div className="card">No policy briefs available</div>
            )}
          </div>
        </div>
      </section>

      {/* Province Averages / Rankings */}
      <section className="growth">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-4">
            Provinces with the highest average risk
          </h2>
          <p className="text-sm text-gray-700 mb-6">
            These provinces show the highest mean RiskScore across their
            districts — useful for planning provincial interventions.
          </p>

          <div className="bars">
            {provinceAverages.map((p: any, i: number) => (
              <div className="bar" key={p.Province}>
                <div
                  className="col"
                  style={{
                    height: `${Math.min(
                      100,
                      Math.round((p.AvgRisk || 0) * 2)
                    )}%`,
                  }}
                >
                  <span>{Math.round(p.AvgRisk || 0)}%</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12 }}>{p.Province}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-8 quote-section">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="quote">
            "We are convinced that combating malnutrition effectively should be
            part and parcel of poverty reduction and economic development."
          </blockquote>
          <p className="quote-author">— Paul Kagame</p>
        </div>
      </section>
    </div>
  );
}

// Helper to trigger download menu prompting JSON/CSV selection
function triggerDownload(data: any[]) {
  // Offer both JSON and CSV; we'll produce CSV client-side
  const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const jsonUrl = URL.createObjectURL(jsonBlob);

  // csv
  const header = Object.keys(data[0] || {});
  const csvRows = [header.join(",")].concat(
    data.map((row) =>
      header
        .map((h) => {
          const v = row[h];
          if (v === null || v === undefined) return "";
          const s = String(v).replace(/"/g, '""');
          return s.includes(",") || s.includes("\n") ? `"${s}"` : s;
        })
        .join(",")
    )
  );
  const csvBlob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(csvBlob);

  // Build a tiny chooser using window.confirm for simplicity
  const wantCSV = window.confirm(
    "Download report as CSV? (Cancel to download JSON)"
  );
  const url = wantCSV ? csvUrl : jsonUrl;
  const name = wantCSV ? "district_analytics.csv" : "district_analytics.json";
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 5000);
  // show ephemeral toast to confirm download started
  showToast(`${name} download started`);
}

function showToast(message: string, ms = 3500) {
  try {
    const existing = document.getElementById("nisr-toast");
    if (existing) existing.remove();

    const t = document.createElement("div");
    t.id = "nisr-toast";
    t.setAttribute("role", "status");
    t.setAttribute("aria-live", "polite");
    t.style.position = "fixed";
    t.style.right = "18px";
    t.style.bottom = "18px";
    t.style.zIndex = "2000";
    t.style.background = "var(--color-primary-800)";
    t.style.color = "#fff";
    t.style.padding = "10px 14px";
    t.style.borderRadius = "8px";
    t.style.boxShadow = "0 8px 20px rgba(0,0,0,0.35)";
    t.style.fontWeight = "600";
    t.style.fontSize = "13px";
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.transition = "opacity 260ms ease, transform 260ms ease";
      t.style.opacity = "0";
      t.style.transform = "translateY(6px)";
      setTimeout(() => t.remove(), 300);
    }, ms);
  } catch (e) {
    // ignore in test environments
    // fallback to alert if necessary
    // alert(message);
  }
}
