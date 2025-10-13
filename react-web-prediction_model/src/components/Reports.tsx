import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Eye, X, Trash2 } from 'lucide-react';
import { PredictionResult } from '../types';

interface ReportsProps {
  predictions: PredictionResult[];
  onExport: (format: 'csv' | 'pdf') => void;
  onDelete?: (id: string) => void;
}

export default function Reports({ predictions, onExport, onDelete }: ReportsProps) {
  const [selectedReport, setSelectedReport] = useState<PredictionResult | null>(null);
  const [sortField, setSortField] = useState<keyof PredictionResult>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prediction?')) {
      onDelete?.(id);
      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }
    }
  };

  const sortedPredictions = [...predictions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof PredictionResult) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Prediction Reports</h2>
          <p className="text-gray-600 mt-1">View and export all prediction results</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onExport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText size={18} />
            Export PDF
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  ID
                </th>
                <th
                  onClick={() => handleSort('childAge')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Child Age
                </th>
                <th
                  onClick={() => handleSort('region')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Region
                </th>
                <th
                  onClick={() => handleSort('riskCategory')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Risk Category
                </th>
                <th
                  onClick={() => handleSort('probability')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Probability
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedPredictions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No predictions yet. Create your first prediction to see results here.
                  </td>
                </tr>
              ) : (
                sortedPredictions.map((prediction) => (
                  <motion.tr
                    key={prediction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      #{prediction.id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {prediction.childAge} months
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{prediction.region}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          prediction.riskCategory === 'High'
                            ? 'bg-red-100 text-red-700'
                            : prediction.riskCategory === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {prediction.riskCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {prediction.probability}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(prediction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedReport(prediction)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(prediction.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Prediction Details</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Prediction ID" value={`#${selectedReport.id.slice(-6)}`} />
                  <InfoItem
                    label="Date"
                    value={new Date(selectedReport.date).toLocaleString()}
                  />
                  <InfoItem label="Child Age" value={`${selectedReport.childAge} months`} />
                  <InfoItem label="Region" value={selectedReport.region} />
                  <InfoItem label="Risk Category" value={selectedReport.riskCategory} />
                  <InfoItem label="Probability" value={`${selectedReport.probability}%`} />
                  <InfoItem label="Confidence" value={`${selectedReport.confidence}%`} />
                  <InfoItem
                    label="Education Level"
                    value={selectedReport.input.educationLevel}
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Input Parameters</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      label="Household Income"
                      value={selectedReport.input.householdIncome.toString()}
                    />
                    <InfoItem
                      label="Household Size"
                      value={selectedReport.input.householdSize.toString()}
                    />
                    <InfoItem
                      label="Food Insecurity"
                      value={selectedReport.input.foodInsecurity.toString()}
                    />
                    <InfoItem
                      label="Water Access"
                      value={selectedReport.input.waterAccess.toString()}
                    />
                    <InfoItem
                      label="Sanitation Access"
                      value={selectedReport.input.sanitationAccess.toString()}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                  <p className="text-sm text-blue-700">{selectedReport.notes}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
