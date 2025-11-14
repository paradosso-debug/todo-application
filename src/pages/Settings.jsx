import React from "react";
import useThemeStore from "../store/useThemeStore";

const Settings = () => {
  const { darkMode, toggleTheme, font, setFont } = useThemeStore();

  return (
    <div className="max-w-xl space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-slate-500">
          Personalize how your dashboard looks.
        </p>
      </header>

      <section className="rounded-xl border bg-white/80 p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          Appearance
        </h2>

        {/* Dark mode toggle */}
        <label className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-700">
          <span>Dark mode</span>
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full border transition
              ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-300 bg-slate-200"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition
                ${darkMode ? "translate-x-5" : "translate-x-1"}`}
            />
          </button>
        </label>

        {/* Font preference */}
        <div className="space-y-1 text-sm text-slate-700">
          <span className="block text-xs font-semibold text-slate-500">
            Font style
          </span>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="sans">Modern (Sans-serif)</option>
            <option value="serif">Classic (Serif)</option>
            <option value="mono">Code / Mono</option>
          </select>
        </div>
      </section>
    </div>
  );
};

export default Settings;
