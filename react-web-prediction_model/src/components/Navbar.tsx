// navbar intentionally lightweight; no external icons required here
import { useState } from "react";

const MAIN_SITE = "https://nisr-hackthon-ak.vercel.app/";

export default function Navbar() {
  const [toast, setToast] = useState("");

  // Use an anchor link to open the main site in a new tab (no popups)

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
          <a
            className="btn-primary"
            href={MAIN_SITE}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setToast("Opening NISR Data Dashboard in a new tab...");
              setTimeout(() => setToast(""), 3000);
            }}
            aria-label="Open NISR Data Dashboard in new tab"
            title="Open NISR Data Dashboard"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="inline mr-2"
              aria-hidden
            >
              <path
                d="M14 3h7v7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 14L21 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21H3V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Open NISR Data Dashboard
          </a>

          {toast && (
            <div className="ml-2 px-3 py-1 rounded bg-primary-50 border border-primary-200 text-primary-600">
              {toast}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
