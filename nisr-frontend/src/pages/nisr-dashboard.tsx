import React, { useEffect, useState } from "react";

export default function NisrDashboard() {
  const [provinceSummary, setProvinceSummary] = useState<any[]>([]);

  useEffect(() => {
    fetch("/data/province_summary.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((d) => setProvinceSummary(d))
      .catch(() => setProvinceSummary([]));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation (kept minimal; component provides markup) */}

      {/* Hero Section */}
      <section
        className="py-16 px-8 full-bleed hero-full"
        style={{ background: "var(--bg)" }}
      >
        <div className="max-w-7xl mx-auto hero-grid">
          {/* Left Column - Stats Cards */}
          <div className="space-y-6">
            {/* Large stat card */}
            <div className="card large">
              <div className="muted-label">Lorem ipsum</div>
              <div className="stat-value-lg">721M</div>
            </div>

            {/* Two column stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div className="card stat-small">
                <div className="muted-label">Lorem ipsum</div>
                <div className="stat-value-md">10,000</div>
              </div>
              <div className="card stat-red">
                <div className="stat-value-md">3112K</div>
                <div className="muted-label">Lorem ipsum dolor sit amet</div>
              </div>
            </div>

            {/* Bottom stat card */}
            <div className="card stat-small">
              <div className="muted-label">Lorem ipsum</div>
              <div className="stat-value-md">4,876</div>
              <div className="muted-label">Lorem ipsum dolor sit amet</div>
            </div>
          </div>

          {/* Right Column - Overview */}
          <div
            className="overview"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1>
              Overview of Key
              <br />
              Yearly
              <br />
              Achievements
            </h1>
            <p className="text-sm text-gray-700 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing
              <br />
              elit, sed do eiusmod tempor incididunt.
            </p>
            <div className="big-number">721M</div>
            {/* Province summary mini widget */}
            {provinceSummary.length > 0 && (
              <div className="card mt-6">
                <h4>Province summary (sample)</h4>
                <ul>
                  {provinceSummary.slice(0, 4).map((p: any) => (
                    <li key={p.Province}>
                      {p.Province}: Stunting {p.Stunting_Rate}% — Risk{" "}
                      {p.RiskScore}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Closing Remarks Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto closing-grid">
          {/* Left side */}
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Closing Remarks:
              <br />
              Looking Forward
              <br />
              Together
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna.
            </p>
            <button className="btn-maps">Maps</button>
          </div>

          {/* Right side - Year cards */}
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
                2025
              </div>
              <div className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor -
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                className="card"
                style={{ background: "#222831", color: "#fff" }}
              >
                <div style={{ fontSize: 44, fontWeight: 700, marginBottom: 8 }}>
                  70%
                </div>
                <div className="text-xs">
                  Lorem ipsum dolor sit amet, consectetur
                </div>
              </div>
              <div className="card stat-small">
                <div style={{ fontSize: 44, fontWeight: 700, marginBottom: 8 }}>
                  2000
                </div>
                <div className="text-xs text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Growth Section */}
      <section className="growth">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-4">
            Business Growth and
            <br />
            Expansion Highlights
          </h2>
          <p className="text-sm text-gray-700 mb-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </p>

          {/* Bar Chart */}
          <div className="bars">
            <div className="bar">
              <div className="col" style={{ height: "90%" }}>
                <span>90%</span>
              </div>
            </div>
            <div className="bar">
              <div className="col" style={{ height: "60%" }}>
                <span>60%</span>
              </div>
            </div>
            <div className="bar">
              <div className="col" style={{ height: "50%" }}>
                <span>50%</span>
              </div>
            </div>
            <div className="bar">
              <div className="col" style={{ height: "56%" }}>
                <span>56%</span>
              </div>
            </div>
            <div className="bar">
              <div className="col" style={{ height: "70%" }}>
                <span>70%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="quote">
            "We are convinced that combating malnutrition effectively should be
            part and parcel of poverty reduction and economic development."
          </blockquote>
          <p className="text-right text-sm font-semibold">— Paul Kagame</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p className="text-red-400 text-sm">AK @2025 Nisr Hackthon 2025</p>
      </footer>
    </div>
  );
}
