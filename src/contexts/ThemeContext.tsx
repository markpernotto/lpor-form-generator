import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Track if user has manually toggled (session only)
  const [
    hasManuallyToggled,
    setHasManuallyToggled,
  ] = useState(false);

  const [theme, setTheme] = useState<Theme>(
    () => {
      // Detect system preference on mount
      if (
        window.matchMedia &&
        window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches
      ) {
        return "dark";
      }
      return "light";
    },
  );

  useEffect(() => {
    // Only listen for system preference changes if user hasn't manually toggled
    if (hasManuallyToggled) return;

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    const handleChange = (
      e: MediaQueryListEvent,
    ) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener(
      "change",
      handleChange,
    );
    return () =>
      mediaQuery.removeEventListener(
        "change",
        handleChange,
      );
  }, [hasManuallyToggled]);

  useEffect(() => {
    // Apply theme class to document root
    if (theme === "dark") {
      document.documentElement.classList.add(
        "dark",
      );
    } else {
      document.documentElement.classList.remove(
        "dark",
      );
    }
  }, [theme]);

  const toggleTheme = () => {
    setHasManuallyToggled(true);
    setTheme((prev) => {
      return prev === "light"
        ? "dark"
        : "light";
    });
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useTheme must be used within a ThemeProvider",
    );
  }
  return context;
};
