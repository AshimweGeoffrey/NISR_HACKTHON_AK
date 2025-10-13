import { LayoutDashboard, LineChart, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
}

const menuItems = [
  { id: 'admin', label: 'Admin', icon: LayoutDashboard },
  { id: 'prediction', label: 'Prediction', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'analysis', label: 'Analysis', icon: LineChart },
];

export default function Sidebar({ activeSection, onSectionChange, isOpen }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-xl transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-blue-100 hover:bg-blue-500'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-500">
          <p className="text-xs text-blue-200">© 2025 Health Analytics</p>
        </div>
      </div>
    </motion.aside>
  );
}
