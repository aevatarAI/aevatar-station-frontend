import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first - user's saved preference
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }

    // Default to dark mode - no system preference detection
    return "dark";
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setLightTheme = () => {
    setTheme("light");
    localStorage.setItem("theme", "light");
  };

  const setDarkTheme = () => {
    setTheme("dark");
    localStorage.setItem("theme", "dark");
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    // Update body class for Tailwind dark mode support
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Removed system preference detection - theme only changes on user action

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isLight: theme === "light",
    isDark: theme === "dark",
  };
};
