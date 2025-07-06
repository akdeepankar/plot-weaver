"use client";

import { useState } from "react";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/localization";

interface LanguageSelectorProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  className?: string;
}

export function LanguageSelector({ currentLocale, onLocaleChange, className = "" }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
      >
        <span className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
          {currentLocale.toUpperCase().slice(0, 2)}
        </span>
        <span className="text-xs">{SUPPORTED_LOCALES[currentLocale]}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {Object.entries(SUPPORTED_LOCALES).map(([code, name]) => (
              <button
                key={code}
                onClick={() => {
                  onLocaleChange(code as Locale);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  currentLocale === code ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {code.toUpperCase().slice(0, 2)}
                  </span>
                  {name}
                  {currentLocale === code && (
                    <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 