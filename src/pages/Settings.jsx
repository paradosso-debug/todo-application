// We import React because this file contains JSX (HTML-like syntax inside JavaScript).
import React from "react";

// We import our Zustand theme store, which holds theme information like:
// - darkMode (true/false)
// - toggleTheme() (function to switch light ↔ dark)
// - font (string: "sans", "serif", or "mono")
// - setFont() (function to update font preference)
import useThemeStore from "../store/useThemeStore";

// ------------------------------------------------------------
// Settings Component
// This page allows the USER to customize the appearance of the dashboard.
// It shows:
// - A toggle switch for dark mode
// - A dropdown to choose the font style
//
// Both settings are stored globally in Zustand,
// so changes here affect the entire application.
// ------------------------------------------------------------
const Settings = () => {
  // We extract values + actions from our Zustand theme store.
  //
  // darkMode → a boolean that tells if dark mode is active.
  // toggleTheme → switches darkMode between true and false.
  // font → current font preference chosen by the user.
  // setFont → function to update the user's chosen font.
  const { darkMode, toggleTheme, font, setFont } = useThemeStore();

  // --------------------------------------------------------
  // JSX RETURN: everything visible on the Settings page.
  // --------------------------------------------------------
  return (
    <div className="max-w-xl space-y-4">
      {/* =================== PAGE HEADER =================== */}
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>

        <p className="text-sm text-slate-500">
          Personalize how your dashboard looks.
        </p>
      </header>

      {/* =================== APPEARANCE SETTINGS BOX =================== */}
      <section className="rounded-xl border bg-white/80 p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          Appearance
        </h2>

        {/* =================== DARK MODE TOGGLE =================== */}
        {/* 
          This is a custom toggle switch.

          - The LABEL wraps the toggle + the text "Dark mode".
          - The BUTTON visually looks like a switch.
          - Clicking the button triggers toggleTheme() from Zustand.
          - The switch's colors and thumb position depend on darkMode (true/false).
        */}
        <label className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-700">
          <span>Dark mode</span>

          {/* Toggle button */}
          <button
            type="button"
            onClick={toggleTheme} // clicking runs the global theme toggle
            className={`relative inline-flex h-6 w-11 items-center rounded-full border transition
              ${
                // The background + border color depend on darkMode value.
                darkMode
                  ? "border-slate-800 bg-slate-900" // dark mode ON → dark switch
                  : "border-slate-300 bg-slate-200" // dark mode OFF → light switch
              }`}
          >
            {/* The inner circle (the "thumb" that slides left or right).
                We animate its position using CSS classes.

                translate-x-1  → thumb on left (light mode)
                translate-x-5  → thumb on right (dark mode)
            */}
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition
                ${darkMode ? "translate-x-5" : "translate-x-1"}`}
            />
          </button>
        </label>

        {/* =================== FONT PREFERENCE DROPDOWN =================== */}
        {/* 
          This section allows the user to choose a font family.
          The selected value is stored in Zustand (font).

          Whenever the user chooses a new option, we call setFont(newValue).
        */}
        <div className="space-y-1 text-sm text-slate-700">
          {/* Label above the dropdown */}
          <span className="block text-xs font-semibold text-slate-500">
            Font style
          </span>

          {/* Dropdown (select) for choosing a font */}
          <select
            value={font} // controlled value from Zustand
            onChange={(e) => setFont(e.target.value)} // update font on change
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {/* Each option sets a different global font style */}
            <option value="sans">Modern (Sans-serif)</option>
            <option value="serif">Classic (Serif)</option>
            <option value="mono">Code / Mono</option>
          </select>
        </div>
      </section>
    </div>
  );
};

// Export component so our router can render the Settings page.
export default Settings;
