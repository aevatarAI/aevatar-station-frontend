import { Moon, Sun } from "lucide-react";
import type React from "react";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "icon" | "minimal";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = "md",
  variant = "button",
}) => {
  const { toggleTheme, isLight } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (variant === "icon") {
    return (
      // biome-ignore lint/a11y/useButtonType: <explanation>
      <button
        onClick={toggleTheme}
        className={cn(
          "rounded-full p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
          sizeClasses[size],
          className,
        )}
        aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      >
        {isLight ? (
          <Moon size={iconSizes[size]} className="text-gray-700" />
        ) : (
          <Sun size={iconSizes[size]} className="text-yellow-400" />
        )}
      </button>
    );
  }

  if (variant === "minimal") {
    return (
      // biome-ignore lint/a11y/useButtonType: <explanation>
      <button
        onClick={toggleTheme}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
          className,
        )}
        aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      >
        {isLight ? (
          <>
            <Moon size={16} />
            <span>Dark</span>
          </>
        ) : (
          <>
            <Sun size={16} />
            <span>Light</span>
          </>
        )}
      </button>
    );
  }

  return (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border-gray-300)] bg-white px-4 py-2",
        "text-sm font-medium text-gray-700 shadow-sm transition-all duration-200",
        "hover:bg-gray-50 hover:border-[var(--color-border-gray-400)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "dark:border-[var(--color-border-gray-600)] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-[var(--color-border-gray-500)]",
        "dark:focus:ring-offset-gray-900",
        sizeClasses[size],
        className,
      )}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      {isLight ? (
        <>
          <Moon size={iconSizes[size]} />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun size={iconSizes[size]} />
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
};
