import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import TaskList from "../components/TaskList";
import useTaskStore from "../store/useTaskStore";

const Homepage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    tag: "all",
    date: "all",
  });

  const tasks = useTaskStore((state) => state.tasks);

  const { total, completed, pending } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
            <span className="h-1 w-6 rounded-full bg-indigo-500" />
            Today
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Let&apos;s be productive today
          </h1>
          <p className="max-w-lg text-sm text-slate-500">
            Capture tasks, attach notes and keep everything in one clean,
            focused dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/add")}
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-500"
        >
          + Add new task
        </button>
      </header>

      {/* STATS ROW */}
      <div className="grid gap-3 text-xs sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Total
            </p>
            <p className="text-lg font-semibold">{total}</p>
          </div>
          <span className="h-7 w-7 rounded-full bg-indigo-100 text-center text-[11px] font-semibold text-indigo-700 leading-7">
            ✔
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
              Completed
            </p>
            <p className="text-lg font-semibold">{completed}</p>
          </div>
          <span className="h-7 w-7 rounded-full bg-emerald-100 text-center text-[11px] font-semibold text-emerald-700 leading-7">
            ✓
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">
              Pending
            </p>
            <p className="text-lg font-semibold">{pending}</p>
          </div>
          <span className="h-7 w-7 rounded-full bg-amber-100 text-center text-[11px] font-semibold text-amber-700 leading-7">
            …
          </span>
        </div>
      </div>

      {/* FILTER BAR */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* TASK LIST */}
      <TaskList filters={filters} />
    </div>
  );
};

export default Homepage;
