// We import React so we can use JSX (HTML-like syntax inside JavaScript).
// We also import two React Hooks:
// - useMemo: to memoize (remember) computed values so we don’t recalculate them unnecessarily.
// - useState: to create and manage local state inside this component (for filters).
import React, { useMemo, useState } from "react";

// From react-router-dom we import useNavigate.
// useNavigate is a hook that returns a function we can use to "navigate" the user
// to another URL in our single-page app. Example: navigate("/add").
import { useNavigate } from "react-router-dom";

// We import our FilterBar and TaskList components, which are used below.
// - FilterBar = top section where the user can filter tasks.
// - TaskList = component that shows the list of tasks based on filters.
import FilterBar from "../components/FilterBar";
import TaskList from "../components/TaskList";

// We import our Zustand store hook to get the list of tasks.
import useTaskStore from "../store/useTaskStore";

// ------------------------------------------------------------
// Homepage Component
// This is the main dashboard screen of the app.
// It shows:
// - A header with a title and "Add new task" button.
// - Stats (total, completed, pending).
// - Filters (search, status, priority, tag).
// - The actual task list below.
// ------------------------------------------------------------
const Homepage = () => {
  // useNavigate gives us a function to move the user to different routes.
  // We store that function in the variable "navigate".
  const navigate = useNavigate();

  // filters state:
  // We use useState to store all current filter values in ONE object.
  // Each key in this object corresponds to a specific filter:
  // - search: text typed by user to filter by title/description
  // - status: "all", "Pending", "Completed"
  // - priority: "all", "High", "Medium", "Low"
  // - tag: "all" or one of the tag options
  // - date: "all" (placeholder in case we add date filters later)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    tag: "all",
    date: "all",
  });

  // Pull the tasks array from our Zustand store.
  // useTaskStore((state) => state.tasks) means:
  // - state is the entire Zustand store
  // - state.tasks is the specific piece we care about → array of task objects.
  const tasks = useTaskStore((state) => state.tasks);

  // --------------------------------------------------------
  // useMemo for derived stats
  //
  // We want to calculate:
  // - total: how many tasks exist in total
  // - completed: how many tasks have status === "Completed"
  // - pending: how many are NOT completed
  //
  // useMemo(() => { ... }, [tasks]) means:
  // "Only recalculate these numbers when tasks changes."
  // This can avoid unnecessary recalculations on every single re-render.
  // --------------------------------------------------------
  const { total, completed, pending } = useMemo(() => {
    // total = the length of the tasks array
    const total = tasks.length;

    // completed = count of tasks where t.status === "Completed"
    const completed = tasks.filter((t) => t.status === "Completed").length;

    // pending = everything else that’s not completed
    const pending = total - completed;

    // We return an object with these values,
    // so we can destructure { total, completed, pending } above.
    return { total, completed, pending };
  }, [tasks]);

  // --------------------------------------------------------
  // JSX RETURN:
  // This is the UI structure for the Homepage.
  // It wraps everything in a vertical stack with spacing.
  // --------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* =================== PAGE HEADER SECTION =================== */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {/* LEFT SIDE: Title, subtitle, small label */}
        <div className="space-y-2">
          {/* Small pill label that says "Today" */}
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
            {/* The small purple bar before the word "Today" */}
            <span className="h-1 w-6 rounded-full bg-indigo-500" />
            Today
          </p>

          {/* Main page title */}
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Let&apos;s be productive today
          </h1>

          {/* Subtitle / description under the title */}
          <p className="max-w-lg text-sm text-slate-500">
            Capture tasks, attach notes and keep everything in one clean,
            focused dashboard.
          </p>
        </div>

        {/* RIGHT SIDE: "Add new task" button */}
        <button
          type="button"
          // When the button is clicked, we navigate the user to the "/add" route.
          // That route presumably shows the AddEditTask component in "add" mode.
          onClick={() => navigate("/add")}
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-500"
        >
          + Add new task
        </button>
      </header>

      {/* =================== STATS ROW SECTION =================== */}
      {/* We show three small cards: Total, Completed, Pending */}
      <div className="grid gap-3 text-xs sm:grid-cols-3">
        {/* ----- CARD 1: TOTAL TASKS ----- */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800">
          <div className="space-y-0.5">
            {/* Label */}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Total
            </p>
            {/* Number of total tasks (from useMemo) */}
            <p className="text-lg font-semibold">{total}</p>
          </div>

          {/* Right circle icon area */}
          <span className="h-7 w-7 rounded-full bg-indigo-100 text-center text-[11px] font-semibold text-indigo-700 leading-7">
            ✔
          </span>
        </div>

        {/* ----- CARD 2: COMPLETED TASKS ----- */}
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          <div className="space-y-0.5">
            {/* Label */}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
              Completed
            </p>
            {/* Number of completed tasks */}
            <p className="text-lg font-semibold">{completed}</p>
          </div>

          {/* Right side icon */}
          <span className="h-7 w-7 rounded-full bg-emerald-100 text-center text-[11px] font-semibold text-emerald-700 leading-7">
            ✓
          </span>
        </div>

        {/* ----- CARD 3: PENDING TASKS ----- */}
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <div className="space-y-0.5">
            {/* Label */}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">
              Pending
            </p>
            {/* Number of pending tasks */}
            <p className="text-lg font-semibold">{pending}</p>
          </div>

          {/* Right side icon (ellipsis to represent "still in progress") */}
          <span className="h-7 w-7 rounded-full bg-amber-100 text-center text-[11px] font-semibold text-amber-700 leading-7">
            …
          </span>
        </div>
      </div>

      {/* =================== FILTER BAR SECTION =================== */}
      {/* We pass two props into FilterBar:
          - filters: the current filter values stored in this component.
          - onChange: a function (setFilters) that FilterBar can call to update filters.
         So FilterBar is a "controlled" child that updates the parent's filter state. */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* =================== TASK LIST SECTION =================== */}
      {/* We pass filters down into TaskList so that TaskList can:
          - read those filters
          - apply them when showing tasks
         This keeps the filtering logic centralized and controlled by the Homepage. */}
      <TaskList filters={filters} />
    </div>
  );
};

// We export Homepage so it can be used in our router and rendered as a page.
export default Homepage;
