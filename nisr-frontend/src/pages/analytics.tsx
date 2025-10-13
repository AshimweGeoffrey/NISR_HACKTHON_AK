import "../styles/analytics.css";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxisProps,
  YAxisProps,
} from "recharts";

const primaryBlue = "var(--color-primary-700)";
const primaryRed = "var(--color-secondary-400-400)";
const mutedGray = "var(--color-primary-200)";
const primarySoft = "var(--color-primary-400)";
const primaryLighter = "var(--color-primary-300)";
const primaryPale = "var(--color-primary-100)";

const screeningBubbleData = [
  {
    month: "Jan",
    childrenScreened: 82000,
    samAdmissions: 2100,
    severityIndex: 12,
  },
  {
    month: "Feb",
    childrenScreened: 90500,
    samAdmissions: 2300,
    severityIndex: 14,
  },
  {
    month: "Mar",
    childrenScreened: 98800,
    samAdmissions: 2500,
    severityIndex: 16,
  },
  {
    month: "Apr",
    childrenScreened: 95200,
    samAdmissions: 2400,
    severityIndex: 15,
  },
  {
    month: "May",
    childrenScreened: 110300,
    samAdmissions: 2650,
    severityIndex: 18,
  },
  {
    month: "Jun",
    childrenScreened: 106400,
    samAdmissions: 2580,
    severityIndex: 17,
  },
];

const nutritionOutcomeSplit = [
  { name: "Stunting (U5)", value: 33.1, fill: primaryRed },
  { name: "Wasting (U5)", value: 4.0, fill: primaryBlue },
  { name: "Underweight (U5)", value: 8.4, fill: mutedGray },
];

const deliveryModeShare = [
  { name: "Community Health Workers", value: 54, fill: primaryRed },
  { name: "Health Posts", value: 29, fill: primaryBlue },
  { name: "Mobile Outreach", value: 17, fill: mutedGray },
];

const supportChannelShare = [
  { name: "Health Centres", value: 42, fill: primaryRed },
  { name: "Nutrition Corners", value: 27, fill: primarySoft },
  { name: "NGO Partners", value: 19, fill: primaryLighter },
  { name: "Community Groups", value: 12, fill: primaryPale },
];

const coverageSeries = [
  { month: "Jan", vitaminACoverage: 72, therapeuticFoodCoverage: 45 },
  { month: "Feb", vitaminACoverage: 75, therapeuticFoodCoverage: 49 },
  { month: "Mar", vitaminACoverage: 78, therapeuticFoodCoverage: 55 },
  { month: "Apr", vitaminACoverage: 80, therapeuticFoodCoverage: 60 },
  { month: "May", vitaminACoverage: 83, therapeuticFoodCoverage: 64 },
  { month: "Jun", vitaminACoverage: 85, therapeuticFoodCoverage: 67 },
];

const caseTrendSeries = [
  { month: "Jan", moderateCases: 4100, severeCases: 1400 },
  { month: "Feb", moderateCases: 4300, severeCases: 1600 },
  { month: "Mar", moderateCases: 4700, severeCases: 1800 },
  { month: "Apr", moderateCases: 4900, severeCases: 1750 },
  { month: "May", moderateCases: 4600, severeCases: 1680 },
  { month: "Jun", moderateCases: 4200, severeCases: 1580 },
];

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

const axisStyle: Partial<XAxisProps & YAxisProps> = {
  tickLine: false,
  axisLine: false,
  tick: { fill: "var(--color-primary-500)", fontSize: 12 },
};

const AnalyticsPage = () => {
  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div>
          <h1>Rwanda Nutrition Analytics</h1>
          <p>
            Mock monitoring data for malnutrition indicators across districts.
          </p>
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
        <article className="card-analytics card-span-2">
          <div className="card-header">
            <h2>Screening Volume</h2>
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
                domain={[0, 120000]}
                {...axisStyle}
              />
              <ZAxis dataKey="severityIndex" range={[80, 240]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => {
                  if (name === "childrenScreened") {
                    return [
                      `${Number(value).toLocaleString()} children`,
                      "Screened",
                    ];
                  }
                  if (name === "samAdmissions") {
                    return [
                      `${Number(value).toLocaleString()} cases`,
                      "SAM Admissions",
                    ];
                  }
                  if (name === "severityIndex") {
                    return [`${value}`, "Severity index"];
                  }
                  return [String(value), name];
                }}
              />
              <Scatter
                data={screeningBubbleData}
                fill={primaryRed}
                name="Monthly screenings"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </article>

        <article className="card-analytics">
          <div className="card-header">
            <h2>Nutrition Outcomes</h2>
            <span className="metric-sub">
              Prevalence among under-five children
            </span>
          </div>
          <div className="radial-chart">
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart
                innerRadius="45%"
                outerRadius="105%"
                data={nutritionOutcomeSplit}
                startAngle={100}
                endAngle={-260}
              >
                <RadialBar background dataKey="value" cornerRadius={12} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Prevalence"]}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <ul className="radial-legend">
            {nutritionOutcomeSplit.map((item) => (
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
            <h2>Clinic load by time</h2>
            <span className="metric-sub">
              Hourly nutrition visits across districts
            </span>
          </div>
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
        </article>

        <article className="card-analytics">
          <div className="card-header">
            <h2>Service delivery</h2>
            <span className="metric-sub">Share of children reached</span>
          </div>
          <div className="center-pie">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={deliveryModeShare}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {deliveryModeShare.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="center-label">
              <strong>1.26M</strong>
              <span>Children reached</span>
            </div>
          </div>
        </article>

        <article className="card-analytics">
          <div className="card-header">
            <h2>Support channels</h2>
            <span className="metric-sub">Where families seek care</span>
          </div>
          <div className="center-pie">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={supportChannelShare}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {supportChannelShare.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="center-label">
              <strong>92k</strong>
              <span>Families supported</span>
            </div>
          </div>
          <ul className="referral-list">
            {supportChannelShare.map((item) => (
              <li key={item.name}>
                <span className="swatch" style={{ background: item.fill }} />
                {item.name} <span>{item.value}%</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card-analytics card-span-2">
          <div className="card-header">
            <h2>Micronutrient coverage</h2>
            <div className="tab-group">
              <button className="active">Year</button>
              <button>Month</button>
              <button>Week</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={coverageSeries}
              margin={{ left: 0, right: 0, top: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-primary-100)"
              />
              <XAxis dataKey="month" {...axisStyle} />
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
                  <stop offset="5%" stopColor={primaryBlue} stopOpacity={0.5} />
                  <stop
                    offset="95%"
                    stopColor={primaryBlue}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryRed} stopOpacity={0.5} />
                  <stop
                    offset="95%"
                    stopColor={primaryRed}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </article>

        <article className="card-analytics card-span-2">
          <div className="card-header">
            <h2>Treatment admissions</h2>
            <div className="tab-group">
              <button className="active">Year</button>
              <button>Month</button>
              <button>Week</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={caseTrendSeries} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-primary-100)"
              />
              <XAxis dataKey="month" {...axisStyle} />
              <YAxis {...axisStyle} domain={[0, 6000]} />
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
        </article>
      </section>
    </div>
  );
};

export default AnalyticsPage;
