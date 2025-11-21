// Import React to allow JSX usage
import React from "react";

// Import Zustand store hook so we can access the list of tasks from global state
import useTaskStore from "../store/useTaskStore";

// Import the TaskCard component, which renders each individual task
import TaskCard from "./TaskCard";

// TaskList receives ONE prop: filters
// filters = { search, status, priority, tag, date }
const TaskList = ({ filters }) => {
  // --------------------------------------------------------
  // Retrieve the array of tasks from Zustand global store.
  // If tasks is undefined, we fall back to an empty array with `|| []`
  // This prevents errors if tasks hasn't been set yet.
  // --------------------------------------------------------
  const tasks = useTaskStore((state) => state.tasks || []);

  // --------------------------------------------------------
  // filteredTasks will be the result of filtering the full tasks array.
  // Each filter rule must pass (AND condition).
  // --------------------------------------------------------
  const filteredTasks = tasks.filter((task) => {
    // --------------------------------------------------------
    // 1️⃣ SEARCH MATCH
    // User typed in search field, so we check:
    // - If search is empty → automatically match
    // - If title includes the search text (case-insensitive)
    // - If description includes the search text (case-insensitive)
    // --------------------------------------------------------
    const matchesSearch =
      filters.search.trim() === "" || // empty search → match everything
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase());

    // --------------------------------------------------------
    // 2️⃣ STATUS MATCH
    // If filter says "all", everything matches.
    // Otherwise status must match exactly.
    // --------------------------------------------------------
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;

    // --------------------------------------------------------
    // 3️⃣ PRIORITY MATCH
    // Same logic: "all" → match everything.
    // Otherwise, compare the exact string.
    // --------------------------------------------------------
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    // --------------------------------------------------------
    // 4️⃣ TAG MATCH
    // "all" → accept everything
    // Otherwise, check if task.tags contains the selected tag.
    // some() returns TRUE if ANY element matches the condition.
    // Example: ["Daily","Work"].some(tag => tag === "Work") → true
    // --------------------------------------------------------
    const matchesTag =
      filters.tag === "all" ||
      (task.tags && task.tags.some((tag) => tag === filters.tag));

    // --------------------------------------------------------
    // 5️⃣ DATE MATCH — IIFE (Immediately Invoked Function Expression)
    // This block runs instantly and returns TRUE/FALSE.
    // We use this format so we can use return inside multiple condition branches.
    // --------------------------------------------------------
    const matchesDate = (() => {
      // 🔹 If filtering by "all", OR the task has no dueDate → automatically match
      if (filters.date === "all" || !task.dueDate) return true;

      // Create a date object for today and zero out the time
      // So that comparisons only consider the calendar day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Create a date object for the task's due date
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);

      // ---------- TODAY ----------
      if (filters.date === "today") {
        // Compare dates PERFECTLY (same time → same number)
        return due.getTime() === today.getTime();
      }

      // ---------- OVERDUE ----------
      if (filters.date === "overdue") {
        // Due date is before today AND the task is not completed
        return due < today && task.status !== "Completed";
      }

      // ---------- THIS WEEK ----------
      if (filters.date === "week") {
        // Difference in days between due date and today
        const diffDays = (due - today) / (1000 * 60 * 60 * 24);

        // Due date between 0 and 7 days from now
        return diffDays >= 0 && diffDays <= 7;
      }

      // Default fall-through (in case of unknown option)
      return true;
    })();

    // --------------------------------------------------------
    // FINAL RETURN:
    // The task must satisfy *ALL* match conditions to be included.
    // This is a giant AND chain.
    // --------------------------------------------------------
    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesTag &&
      matchesDate
    );
  });

  // --------------------------------------------------------
  // JSX OUTPUT STARTS HERE
  // --------------------------------------------------------
  return (
    <section className="space-y-3">
      {/* Header row with title + count badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Tasks{" "}
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
            {/* Show how many tasks passed the filters */}
            {filteredTasks.length}
          </span>
        </h2>
      </div>

      {/* --------------------------------------------------------
          CONDITIONAL RENDERING:
          If no tasks match, show a message.
          Otherwise show map() list of TaskCard components.
      -------------------------------------------------------- */}
      {filteredTasks.length === 0 ? (
        // Case: No tasks found
        <p className="text-sm text-slate-500">
          No tasks match these filters yet. Add one or clear the filters.
        </p>
      ) : (
        // Case: We have tasks to show
        <div className="space-y-3">
          {/* Loop through filtered tasks and render a TaskCard for each */}
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  );
};

// Export component so it can be used elsewhere
export default TaskList;
