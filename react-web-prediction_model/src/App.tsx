import { useState, useEffect } from "react";
// Sidebar removed in favor of a bottom floating options bar
import Navbar from "./components/Navbar";
import Admin from "./components/Admin";
import Prediction from "./components/Prediction";
import Reports from "./components/Reports";
import Analysis from "./components/Analysis";
import { PredictionResult, ActivityLog } from "./types";

function App() {
  const [activeSection, setActiveSection] = useState("admin");
  // sidebar removed; bottom options used instead
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const savedPredictions = localStorage.getItem("predictions");
    const savedLogs = localStorage.getItem("activityLogs");

    if (savedPredictions) {
      setPredictions(JSON.parse(savedPredictions));
    }

    if (savedLogs) {
      setActivityLogs(JSON.parse(savedLogs));
    } else {
      const initialLogs: ActivityLog[] = [
        {
          id: "1",
          action: "System initialized",
          timestamp: new Date().toLocaleString(),
          type: "system",
        },
      ];
      setActivityLogs(initialLogs);
      localStorage.setItem("activityLogs", JSON.stringify(initialLogs));
    }
  }, []);

  const handlePredictionComplete = (result: PredictionResult) => {
    const newPredictions = [...predictions, result];
    setPredictions(newPredictions);
    localStorage.setItem("predictions", JSON.stringify(newPredictions));

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action: `New ${result.riskCategory.toLowerCase()} risk prediction created for ${
        result.region
      } region`,
      timestamp: new Date().toLocaleString(),
      type: "prediction",
    };

    const newLogs = [newLog, ...activityLogs];
    setActivityLogs(newLogs);
    localStorage.setItem("activityLogs", JSON.stringify(newLogs));
  };

  const handleExport = (format: "csv" | "pdf") => {
    if (predictions.length === 0) {
      alert("No data to export");
      return;
    }

    if (format === "csv") {
      const headers = [
        "ID",
        "Child Age",
        "Region",
        "Risk Category",
        "Probability",
        "Confidence",
        "Date",
        "Household Income",
        "Food Insecurity",
        "Water Access",
        "Sanitation Access",
        "Education Level",
      ];

      const rows = predictions.map((p) => [
        p.id,
        p.childAge,
        p.region,
        p.riskCategory,
        p.probability,
        p.confidence,
        new Date(p.date).toLocaleString(),
        p.input.householdIncome,
        p.input.foodInsecurity,
        p.input.waterAccess,
        p.input.sanitationAccess,
        p.input.educationLevel,
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `health-predictions-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert("PDF export functionality would require a PDF generation library");
    }

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action: `Exported ${
        predictions.length
      } predictions to ${format.toUpperCase()}`,
      timestamp: new Date().toLocaleString(),
      type: "export",
    };

    const newLogs = [newLog, ...activityLogs];
    setActivityLogs(newLogs);
    localStorage.setItem("activityLogs", JSON.stringify(newLogs));
  };

  const handleDeletePrediction = (id: string) => {
    const newPredictions = predictions.filter((p) => p.id !== id);
    setPredictions(newPredictions);
    localStorage.setItem("predictions", JSON.stringify(newPredictions));

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action: `Deleted prediction #${id.slice(-6)}`,
      timestamp: new Date().toLocaleString(),
      type: "system",
    };

    const newLogs = [newLog, ...activityLogs];
    setActivityLogs(newLogs);
    localStorage.setItem("activityLogs", JSON.stringify(newLogs));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <Navbar />

        <main className="flex-1 p-6">
          {activeSection === "admin" && (
            <Admin predictions={predictions} activityLogs={activityLogs} />
          )}
          {activeSection === "prediction" && (
            <Prediction onPredictionComplete={handlePredictionComplete} />
          )}
          {activeSection === "reports" && (
            <Reports
              predictions={predictions}
              onExport={handleExport}
              onDelete={handleDeletePrediction}
            />
          )}
          {activeSection === "analysis" && (
            <Analysis predictions={predictions} />
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <p className="text-center text-sm text-gray-600">
            Child Health Analytics Dashboard © 2025
          </p>
        </footer>
      </div>
      <BottomOptionsInline
        activeSection={activeSection}
        onSectionChange={(s: string) => setActiveSection(s)}
      />
    </div>
  );
}

// Inline BottomOptions component (keeps import resolution simple)
import { motion } from "framer-motion";
import { Settings, BarChart2, FileText, User } from "lucide-react";

function BottomOptionsInline({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (s: string) => void;
}) {
  const items: { id: string; label: string; Icon: React.ElementType }[] = [
    { id: "admin", label: "Admin", Icon: Settings },
    { id: "prediction", label: "Prediction", Icon: User },
    { id: "reports", label: "Reports", Icon: FileText },
    { id: "analysis", label: "Analysis", Icon: BarChart2 },
  ];

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 bottom-6 z-40">
      <div className="bg-white/90 backdrop-blur-lg shadow-lg rounded-full px-3 py-2 flex items-center gap-2">
        {items.map((item) => {
          const active = item.id === activeSection;
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors focus:outline-none ${
                active
                  ? "bg-primary-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.Icon
                size={16}
                className={active ? "text-white" : "text-gray-600"}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Replace external BottomOptions component usage with inline one in JSX

export default App;
