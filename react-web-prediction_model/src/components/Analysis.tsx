import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  MapPin,
  DollarSign,
} from "lucide-react";
import { PredictionResult } from "../types";

interface AnalysisProps {
  predictions: PredictionResult[];
}

const COLORS = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#10B981",
};

const CHART_COLORS = {
  primary: "#10B981", // Green
  secondary: "#14B8A6", // Teal
  accent: "#06B6D4", // Cyan
  gradient1: "#10B981",
  gradient2: "#059669",
};

export default function Analysis({ predictions }: AnalysisProps) {
  const riskCategoryData = [
    {
      name: "High",
      value: predictions.filter((p) => p.riskCategory === "High").length,
    },
    {
      name: "Medium",
      value: predictions.filter((p) => p.riskCategory === "Medium").length,
    },
    {
      name: "Low",
      value: predictions.filter((p) => p.riskCategory === "Low").length,
    },
  ].filter((item) => item.value > 0);

  const regionData = predictions.reduce((acc, pred) => {
    const existing = acc.find((item) => item.name === pred.region);
    if (existing) {
      existing.High += pred.riskCategory === "High" ? 1 : 0;
      existing.Medium += pred.riskCategory === "Medium" ? 1 : 0;
      existing.Low += pred.riskCategory === "Low" ? 1 : 0;
    } else {
      acc.push({
        name: pred.region,
        High: pred.riskCategory === "High" ? 1 : 0,
        Medium: pred.riskCategory === "Medium" ? 1 : 0,
        Low: pred.riskCategory === "Low" ? 1 : 0,
      });
    }
    return acc;
  }, [] as { name: string; High: number; Medium: number; Low: number }[]);

  const timelineData = predictions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, pred) => {
      const date = new Date(pred.date).toLocaleDateString();
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.predictions += 1;
      } else {
        acc.push({ date, predictions: 1 });
      }
      return acc;
    }, [] as { date: string; predictions: number }[]);

  const educationData = predictions
    .filter((pred) => pred.input && pred.input.educationLevel)
    .reduce((acc, pred) => {
      const existing = acc.find(
        (item) => item.name === pred.input.educationLevel
      );
      if (existing) {
        existing.High += pred.riskCategory === "High" ? 1 : 0;
        existing.Medium += pred.riskCategory === "Medium" ? 1 : 0;
        existing.Low += pred.riskCategory === "Low" ? 1 : 0;
      } else {
        acc.push({
          name: pred.input.educationLevel,
          High: pred.riskCategory === "High" ? 1 : 0,
          Medium: pred.riskCategory === "Medium" ? 1 : 0,
          Low: pred.riskCategory === "Low" ? 1 : 0,
        });
      }
      return acc;
    }, [] as { name: string; High: number; Medium: number; Low: number }[]);

  // Income vs Risk Analysis
  const incomeRiskData = predictions
    .filter((pred) => pred.input && pred.input.householdIncome)
    .map((pred) => ({
      income: pred.input.householdIncome,
      probability: pred.probability,
      riskCategory: pred.riskCategory,
    }))
    .sort((a, b) => a.income - b.income);

  // Food Insecurity Analysis
  const foodInsecurityData = predictions
    .filter((pred) => pred.input && pred.input.foodInsecurity !== undefined)
    .reduce((acc, pred) => {
      const level = pred.input.foodInsecurity;
      const existing = acc.find((item) => item.level === level);
      if (existing) {
        existing.count += 1;
        existing.avgRisk += pred.probability;
      } else {
        acc.push({ level, count: 1, avgRisk: pred.probability });
      }
      return acc;
    }, [] as { level: number; count: number; avgRisk: number }[])
    .map((item) => ({ ...item, avgRisk: item.avgRisk / item.count }))
    .sort((a, b) => a.level - b.level);

  // Water & Sanitation Access
  const waterSanitationData = [
    {
      category: "Both Available",
      count: predictions.filter(
        (p) => p.input?.waterAccess === 1 && p.input?.sanitationAccess === 1
      ).length,
    },
    {
      category: "Water Only",
      count: predictions.filter(
        (p) => p.input?.waterAccess === 1 && p.input?.sanitationAccess === 0
      ).length,
    },
    {
      category: "Sanitation Only",
      count: predictions.filter(
        (p) => p.input?.waterAccess === 0 && p.input?.sanitationAccess === 1
      ).length,
    },
    {
      category: "Neither",
      count: predictions.filter(
        (p) => p.input?.waterAccess === 0 && p.input?.sanitationAccess === 0
      ).length,
    },
  ].filter((item) => item.count > 0);

  // Household Size Analysis
  const householdSizeData = predictions
    .filter((pred) => pred.input && pred.input.householdSize)
    .reduce((acc, pred) => {
      const size = pred.input.householdSize;
      const existing = acc.find((item) => item.size === size);
      if (existing) {
        existing.High += pred.riskCategory === "High" ? 1 : 0;
        existing.Medium += pred.riskCategory === "Medium" ? 1 : 0;
        existing.Low += pred.riskCategory === "Low" ? 1 : 0;
      } else {
        acc.push({
          size,
          High: pred.riskCategory === "High" ? 1 : 0,
          Medium: pred.riskCategory === "Medium" ? 1 : 0,
          Low: pred.riskCategory === "Low" ? 1 : 0,
        });
      }
      return acc;
    }, [] as { size: number; High: number; Medium: number; Low: number }[])
    .sort((a, b) => a.size - b.size);

  // Age Distribution
  const ageDistributionData = predictions
    .reduce((acc, pred) => {
      const ageGroup =
        pred.childAge < 6
          ? "0-5 months"
          : pred.childAge < 12
          ? "6-11 months"
          : pred.childAge < 24
          ? "12-23 months"
          : pred.childAge < 36
          ? "24-35 months"
          : "36+ months";

      const existing = acc.find((item) => item.ageGroup === ageGroup);
      if (existing) {
        existing.count += 1;
        existing.avgProbability += pred.probability;
      } else {
        acc.push({ ageGroup, count: 1, avgProbability: pred.probability });
      }
      return acc;
    }, [] as { ageGroup: string; count: number; avgProbability: number }[])
    .map((item) => ({
      ...item,
      avgProbability: item.avgProbability / item.count,
    }));

  if (predictions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Analysis</h2>
          <p className="text-gray-600 mt-1">
            Visualize prediction trends and patterns
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600">
              Create predictions to see visualizations and analysis of your
              data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have enough data for meaningful visualizations
  const hasEnoughData = predictions.length >= 3;

  // Calculate key metrics
  const totalCases = predictions.length;
  const highRiskCases = predictions.filter(
    (p) => p.riskCategory === "High"
  ).length;
  const avgRisk =
    predictions.length > 0
      ? (
          predictions.reduce((sum, p) => sum + p.probability, 0) /
          predictions.length
        ).toFixed(1)
      : 0;
  const regionsAffected = new Set(predictions.map((p) => p.region)).size;
  const riskTrend =
    predictions.length >= 2
      ? predictions[predictions.length - 1].probability >
        predictions[0].probability
        ? "up"
        : "down"
      : "neutral";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Data Analysis Dashboard
        </h2>
        <p className="text-gray-600 mt-1">
          Comprehensive analytics across {predictions.length} predictions
        </p>
      </div>

      {/* Dashboard Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cases Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-primary-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-primary-50 text-sm font-medium mb-1">
              Total Cases
            </p>
            <h3 className="text-3xl font-bold">
              {totalCases.toLocaleString()}
            </h3>
          </div>
        </motion.div>

        {/* High Risk Cases Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent-red rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-accent-red text-sm font-medium mb-1">
              High Risk Cases
            </p>
            <h3 className="text-3xl font-bold">
              {highRiskCases.toLocaleString()}
            </h3>
            <p className="text-accent-red text-xs mt-1">
              {totalCases > 0
                ? ((highRiskCases / totalCases) * 100).toFixed(1)
                : 0}
              % of total
            </p>
          </div>
        </motion.div>

        {/* Average Risk Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-primary-700 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              {riskTrend === "up" ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )}
            </div>
          </div>
          <div>
            <p className="text-primary-50 text-sm font-medium mb-1">
              Average Risk
            </p>
            <h3 className="text-3xl font-bold">{avgRisk}%</h3>
            <p className="text-purple-100 text-xs mt-1">Across all cases</p>
          </div>
        </motion.div>

        {/* Regions Affected Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-primary-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-primary-50 text-sm font-medium mb-1">
              Regions Affected
            </p>
            <h3 className="text-3xl font-bold">{regionsAffected}</h3>
            <p className="text-primary-50 text-xs mt-1">Geographic coverage</p>
          </div>
        </motion.div>
      </div>

      {!hasEnoughData && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-primary-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-primary-600">
                Limited Data Available
              </h3>
              <p className="text-sm text-primary-600 mt-1">
                Create at least 3 predictions to unlock detailed visualizations
                and trends.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Risk Category Distribution */}
        {riskCategoryData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-600 rounded"></span>
              Risk Category Distribution
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Overview of risk levels across all predictions
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskCategoryData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[entry.name as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Total Cases: {predictions.length}
              </p>
            </div>
          </motion.div>
        )}

        {/* 2. Predictions Over Time */}
        {timelineData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-600 rounded"></span>
              Predictions Over Time
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Temporal trend of prediction activity
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient
                    id="colorPredictions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  style={{ fontSize: "11px" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="predictions"
                  stroke="#14B8A6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPredictions)"
                  name="Predictions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* 3. Risk by Region */}
        {regionData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-600 rounded"></span>
              Risk by Region
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Geographic distribution of malnutrition risk
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                  label={{ value: "Cases", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="High"
                  fill="#EF4444"
                  name="High Risk"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="Medium"
                  fill="#F59E0B"
                  name="Medium Risk"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="Low"
                  fill="#10B981"
                  name="Low Risk"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Regions analyzed: {regionData.length}
              </p>
            </div>
          </motion.div>
        )}

        {/* 4. Education Level vs Risk */}
        {educationData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-600 rounded"></span>
              Mother's Education Impact
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Correlation between maternal education and child health risk
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={educationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="High"
                  stackId="a"
                  fill="#EF4444"
                  name="High Risk"
                  radius={[0, 8, 8, 0]}
                />
                <Bar
                  dataKey="Medium"
                  stackId="a"
                  fill="#F59E0B"
                  name="Medium Risk"
                />
                <Bar dataKey="Low" stackId="a" fill="#10B981" name="Low Risk" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* 5. Income vs Risk Correlation */}
        {incomeRiskData.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-600 rounded"></span>
              Income vs Risk Probability
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              How household income affects malnutrition risk
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incomeRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="income"
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "Household Income",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "Risk %",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: "#8B5CF6", r: 5 }}
                  name="Risk Probability"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* 6. Food Insecurity Analysis */}
        {foodInsecurityData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-600 rounded"></span>
              Food Insecurity Impact
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Relationship between food insecurity levels and health risk
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={foodInsecurityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="level"
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "Insecurity Level",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#10B981"
                  name="Number of Cases"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="avgRisk"
                  fill="#14B8A6"
                  name="Avg Risk %"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* 7. Water & Sanitation Access */}
        {waterSanitationData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-600 rounded"></span>
              Water & Sanitation Access
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Infrastructure access distribution among cases
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={waterSanitationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ category, percent }) =>
                    `${category}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {waterSanitationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#10B981", "#3B82F6", "#F59E0B", "#EF4444"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* 8. Household Size Impact */}
        {householdSizeData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-pink-600 rounded"></span>
              Household Size Impact
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              How family size correlates with malnutrition risk
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={householdSizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="size"
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "Household Size",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                  label={{ value: "Cases", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="High"
                  stackId="a"
                  fill="#EF4444"
                  name="High Risk"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="Medium"
                  stackId="a"
                  fill="#F59E0B"
                  name="Medium Risk"
                />
                <Bar dataKey="Low" stackId="a" fill="#10B981" name="Low Risk" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* 9. Age Distribution & Risk */}
        {ageDistributionData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl shadow-md p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-teal-600 rounded"></span>
              Age Distribution & Average Risk
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Child age groups and their associated risk levels
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ageDistributionData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="ageGroup"
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  name="Number of Cases"
                />
                <Area
                  type="monotone"
                  dataKey="avgProbability"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRisk)"
                  name="Average Risk %"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Age groups analyzed: {ageDistributionData.length}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Numeric Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pageviews Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <p className="text-sm text-gray-600 font-medium mb-2 uppercase tracking-wide">
            Total Predictions
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-bold text-gray-900">
              {totalCases.toLocaleString()}
            </h3>
          </div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={timelineData.slice(-7)}>
                <defs>
                  <linearGradient
                    id="miniGradient1"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="predictions"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#miniGradient1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Total Visits Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <p className="text-sm text-gray-600 font-medium mb-2 uppercase tracking-wide">
            High Risk Cases
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-bold text-gray-900">
              {highRiskCases.toLocaleString()}
            </h3>
          </div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={timelineData.slice(-7)}>
                <defs>
                  <linearGradient
                    id="miniGradient2"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="predictions"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#miniGradient2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Average Impressions Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <p className="text-sm text-gray-600 font-medium mb-2 uppercase tracking-wide">
            Avg Risk Level
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-bold text-gray-900">{avgRisk}%</h3>
          </div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={regionData.slice(0, 5)}>
                <Bar dataKey="High" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cost Per Click Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <p className="text-sm text-gray-600 font-medium mb-2 uppercase tracking-wide">
            Regions Covered
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-bold text-gray-900">
              {regionsAffected}
            </h3>
          </div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={regionData}>
                <Bar dataKey="Low" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <p className="text-sm text-primary-600 font-medium mb-1">
              Most Common Risk
            </p>
            <p className="text-2xl font-bold text-primary-600">
              {riskCategoryData.sort((a, b) => b.value - a.value)[0]?.name ||
                "N/A"}
            </p>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-sm text-teal-600 font-medium mb-1">
              Average Probability
            </p>
            <p className="text-2xl font-bold text-teal-800">
              {predictions.length > 0
                ? (
                    predictions.reduce((sum, p) => sum + p.probability, 0) /
                    predictions.length
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm text-emerald-600 font-medium mb-1">
              Most Affected Region
            </p>
            <p className="text-2xl font-bold text-emerald-800">
              {regionData.sort(
                (a, b) =>
                  b.High + b.Medium + b.Low - (a.High + a.Medium + a.Low)
              )[0]?.name || "N/A"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
