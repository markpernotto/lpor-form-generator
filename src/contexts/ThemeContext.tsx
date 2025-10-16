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
    console.log("Applying theme:", theme);
    if (theme === "dark") {
      document.documentElement.classList.add(
        "dark",
      );
      console.log(
        "Added 'dark' class to html element",
      );
    } else {
      document.documentElement.classList.remove(
        "dark",
      );
      console.log(
        "Removed 'dark' class from html element",
      );
    }
  }, [theme]);

  const toggleTheme = () => {
    console.log(
      "Toggle clicked! Current theme:",
      theme,
    );
    setHasManuallyToggled(true);
    setTheme((prev) => {
      const newTheme =
        prev === "light" ? "dark" : "light";
      console.log(
        "Switching theme from",
        prev,
        "to",
        newTheme,
      );
      return newTheme;
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useTheme must be used within a ThemeProvider",
    );
  }
  return context;
};
