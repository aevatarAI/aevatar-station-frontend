import type React from "react";
import { useThemeContext } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

export const ThemeToggleExample: React.FC = () => {
  const { theme, isLight, isDark } = useThemeContext();

  return (
    <div className="p-6 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Theme Toggle Examples</h2>
        <p className="mb-4">Current theme: {theme}</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              isLight
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Light Mode: {isLight ? "Active" : "Inactive"}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              isDark ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
            }`}
          >
            Dark Mode: {isDark ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Default button variant */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3">Default Button</h3>
          <ThemeToggle variant="button" />
        </div>

        {/* Icon variant */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3">Icon Only</h3>
          <ThemeToggle variant="icon" size="lg" />
        </div>

        {/* Minimal variant */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3">Minimal</h3>
          <ThemeToggle variant="minimal" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-3">Different Sizes</h3>
        <div className="flex items-center justify-center gap-4">
          <ThemeToggle variant="icon" size="sm" />
          <ThemeToggle variant="icon" size="md" />
          <ThemeToggle variant="icon" size="lg" />
        </div>
      </div>

      <div className="mt-8 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Theme Information</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Current Theme:</strong> {theme}
          </p>
          <p>
            <strong>CSS Variables Active:</strong> Yes
          </p>
          <p>
            <strong>Local Storage:</strong>{" "}
            {localStorage.getItem("theme") || "Not set"}
          </p>
          <p>
            <strong>System Preference:</strong>{" "}
            {window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "Dark"
              : "Light"}
          </p>
        </div>
      </div>
    </div>
  );
};
