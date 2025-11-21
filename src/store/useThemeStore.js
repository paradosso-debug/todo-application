// We import `create` from Zustand.
// Zustand is a tiny but powerful state management library.
// It lets us create a GLOBAL store that any component can access.
import { create } from "zustand";

// We import `persist` from Zustand middleware.
// "Middleware" adds extra features to the store.
// persist() allows the store to SAVE its data to localStorage automatically.
// This means the user's theme choice remains even after refreshing the page.
import { persist } from "zustand/middleware";

// ------------------------------------------------------------
// useThemeStore
// This store controls THEME settings for the entire app.
// Specifically:
// - darkMode → whether dark mode is ON or OFF
// - toggleTheme() → a function to flip darkMode true ↔ false automatically
//
// We wrap the store with persist() so the theme stays saved after reload.
// ------------------------------------------------------------
const useThemeStore = create(
  // persist() wraps our store configuration.
  persist(
    // This function receives "set" → used to update the store values.
    (set) => ({
      // =======================
      // STATE VARIABLES
      // =======================

      // Whether dark mode is currently enabled.
      // false = light mode
      // true  = dark mode
      darkMode: false,

      // =======================
      // ACTIONS / METHODS
      // =======================

      // toggleTheme:
      // This function flips darkMode between true and false.
      //
      // set((state) => ...) updates the Zustand store.
      // state.darkMode is the PREVIOUS value.
      // !state.darkMode flips it:
      //   false → true
      //   true  → false
      toggleTheme: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),
    }),

    // =======================
    // PERSISTENCE SETTINGS
    // =======================
    {
      // name: "theme-storage"
      // This is the KEY used inside localStorage.
      //
      // The store data will be saved as:
      //   localStorage["theme-storage"]
      //
      // Inside that, Zustand stores:
      //   { darkMode: true/false }
      name: "theme-storage",
    }
  )
);

// Export the hook so any component can use it.
// Example:
//   const { darkMode, toggleTheme } = useThemeStore();
export default useThemeStore;
