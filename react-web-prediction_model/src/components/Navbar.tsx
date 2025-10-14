import { User } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Hamburger/menu removed — navigation moved to bottom options */}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <circle cx="12" cy="8" r="3" />
                <path d="M5 20c1-4 6-7 7-7s6 3 7 7" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-800">
                Malnutrition in Children
              </h2>
              <p className="text-xs text-gray-500">Prediction & Monitoring</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification and login UI removed (not implemented) */}
        </div>
      </div>
    </nav>
  );
}
