import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

// Theme'i DOM'a uygulayan helper fonksiyon
const applyThemeToDOM = (theme: Theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// İlk tema değerini belirleyen fonksiyon
const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";

  // LocalStorage'dan kaydedilmiş tema
  const savedTheme = localStorage.getItem("theme") as Theme;
  if (savedTheme) {
    return savedTheme;
  }

  // Sistem tercihi
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light", // İlk değer, initializeTheme ile güncellenecek

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";

    set({ theme: newTheme });

    // LocalStorage'a kaydet
    localStorage.setItem("theme", newTheme);

    // DOM'a uygula
    applyThemeToDOM(newTheme);
  },

  setTheme: (theme: Theme) => {
    set({ theme });

    // LocalStorage'a kaydet
    localStorage.setItem("theme", theme);

    // DOM'a uygula
    applyThemeToDOM(theme);
  },

  initializeTheme: () => {
    const initialTheme = getInitialTheme();
    set({ theme: initialTheme });
    applyThemeToDOM(initialTheme);

    // Sistem dark mode değişikliklerini dinle
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        // Eğer kullanıcı manuel olarak tema seçmemişse sistem tercihini takip et
        const savedTheme = localStorage.getItem("theme");
        if (!savedTheme) {
          const newTheme = e.matches ? "dark" : "light";
          get().setTheme(newTheme);
        }
      };

      mediaQuery.addEventListener("change", handleChange);

      // Cleanup için return function (bu Zustand'da doğrudan mümkün değil,
      // bu yüzden component seviyesinde useEffect kullanacağız)
    }
  },
}));
