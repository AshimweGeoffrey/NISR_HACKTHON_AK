import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { PredictionResult, ActivityLog } from '../types';

interface AdminProps {
  predictions: PredictionResult[];
  activityLogs: ActivityLog[];
}

export default function Admin({ predictions, activityLogs }: AdminProps) {
  const totalPredictions = predictions.length;
  const highRiskCases = predictions.filter((p) => p.riskCategory === 'High').length;
  const mediumRiskCases = predictions.filter((p) => p.riskCategory === 'Medium').length;
  const lowRiskCases = predictions.filter((p) => p.riskCategory === 'Low').length;

  const stats = [
    {
      label: 'Total Predictions',
      value: totalPredictions,
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'High Risk Cases',
      value: highRiskCases,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: 'Medium Risk Cases',
      value: mediumRiskCases,
      icon: Activity,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Low Risk Cases',
      value: lowRiskCases,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">System Monitoring</h2>
        <p className="text-gray-600 mt-1">Overview of system health and activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon size={28} className={stat.iconColor} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health</h3>
          <div className="space-y-4">
            <HealthItem label="API Status" status="Operational" color="green" />
            <HealthItem label="Database" status="Healthy" color="green" />
            <HealthItem label="Prediction Model" status="Active" color="green" />
            <HealthItem label="Data Processing" status="Running" color="blue" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activityLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    log.type === 'prediction'
                      ? 'bg-blue-500'
                      : log.type === 'export'
                      ? 'bg-green-500'
                      : 'bg-gray-500'
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{log.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function HealthItem({
  label,
  status,
  color,
}: {
  label: string;
  status: string;
  color: 'green' | 'blue' | 'yellow' | 'red';
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
        {status}
      </span>
    </div>
  );
}
