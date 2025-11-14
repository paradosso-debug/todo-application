import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AddEditTask from "./pages/AddEditTask";
import MyNotes from "./pages/MyNotes";
import Settings from "./pages/Settings";
import useThemeStore from "./store/useThemeStore";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/add", label: "Add task" },
  { to: "/settings", label: "Settings" },
];

export default function App() {
  const { darkMode, font } = useThemeStore();
  const location = useLocation();

  const baseBg = darkMode
    ? "from-slate-950 via-slate-950 to-slate-900"
    : "from-slate-50 via-slate-100 to-slate-200";

  const appClasses = `min-h-screen bg-gradient-to-b ${baseBg} text-slate-900`;
  const fontClass =
    font === "serif"
      ? "font-serif"
      : font === "mono"
      ? "font-mono"
      : "font-sans";

  const headerClasses = darkMode
    ? "border-b border-slate-800/60 bg-slate-950/80 backdrop-blur"
    : "border-b border-slate-200/80 bg-white/80 backdrop-blur";

  const cardClasses = darkMode
    ? "rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.8)]"
    : "rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]";

  return (
    <div className={`${appClasses} ${fontClass}`}>
      {/* Top nav */}
      <header className={headerClasses}>
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold tracking-tight"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-[11px] text-white shadow-sm">
              ✔
            </span>
            <span>Get Shit Done</span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-full px-3 py-1 transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : darkMode
                      ? "text-slate-200 hover:bg-slate-800/80"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main shell */}
      <main className="mx-auto flex max-w-5xl px-4 py-8">
        <div className="w-full">
          <div className={cardClasses}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/add" element={<AddEditTask />} />
              <Route path="/edit/:id" element={<AddEditTask />} />
              <Route path="/notes/:id" element={<MyNotes />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}
