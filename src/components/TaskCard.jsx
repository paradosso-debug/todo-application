// Import React so we can write JSX (HTML-looking code inside JavaScript)
import React from "react";

// useNavigate is a hook from react-router-dom that lets us change pages using code.
// Example: navigate("/edit/123")
import { useNavigate } from "react-router-dom";

// This imports our Zustand store hook so we can access global state functions.
import useTaskStore from "../store/useTaskStore";

// This object is used as a lookup table for priority colors meaning:
// priorityColor["High"] → "bg-red-500"
// priorityColor["Medium"] → "bg-amber-400"
// priorityColor["Low"] → "bg-emerald-500"
const priorityColor = {
  High: "bg-red-500",
  Medium: "bg-amber-400",
  Low: "bg-emerald-500",
};

// Functional component that receives ONE prop: { task }
// task is an object containing title, description, id, priority, status, tags, dueDate
const TaskCard = ({ task }) => {
  // Gives us a function to navigate to another route programmatically
  const navigate = useNavigate();

  // Zustand store functions:
  // This extracts toggleStatus from the global store
  const toggleStatus = useTaskStore((state) => state.toggleStatus);

  // This extracts deleteTask from the global store
  const deleteTask = useTaskStore((state) => state.deleteTask);

  // When the user clicks the round toggle button,
  // we call toggleStatus and pass the task id so Zustand updates the state.
  const handleToggle = () => {
    toggleStatus(task.id);
  };

  // When the Delete button is clicked, we confirm, and then delete by id.
  const handleDelete = () => {
    if (window.confirm("Delete this task?")) {
      deleteTask(task.id);
    }
  };

  // The UI — we return an <article> containing EVERYTHING about the task card.
  return (
    <article className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      {/* ================= STATUS TOGGLE BUTTON ================= */}
      <button
        type="button"
        onClick={handleToggle} // calls function that toggles Completed/Pending
        className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
          // Conditional class:
          // If status is "Completed":
          //  - green background
          //  - green border
          //  - white checkmark
          task.status === "Completed"
            ? "border-emerald-500 bg-emerald-500 text-white"
            : // If NOT completed:
              //  - gray border
              //  - white background
              //  - invisible checkmark
              "border-slate-300 bg-white text-transparent hover:border-indigo-400"
        }`}
        aria-label="Toggle task status"
      >
        {/* checkmark symbol inside the toggle button */}✓
      </button>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="flex-1 space-y-2">
        {/* ========== HEADER: title, description, priority, due date ========== */}
        <header className="flex items-start justify-between gap-2">
          <div>
            {/* Task title */}
            <h3 className="text-sm font-semibold text-slate-900">
              {task.title}
            </h3>

            {/* Task description with 2-line clamp */}
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {task.description}
            </p>
          </div>

          {/* RIGHT SIDE: priority badge + due date */}
          <div className="flex flex-col items-end gap-1 text-right">
            {/* PRIORITY INDICATOR */}
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-700">
              {/* Small colored circle showing priority color */}
              <span
                className={`h-2 w-2 rounded-full ${
                  // Look up the color using the priorityColor object
                  // If priority not found, default to gray
                  priorityColor[task.priority] || "bg-slate-400"
                }`}
              />
              {/* Text: High priority / Medium priority / Low priority */}
              {task.priority} priority
            </span>

            {/* DUE DATE TEXT */}
            <span className="text-[10px] text-slate-400">
              {/* If dueDate exists -> show "Due <date>" else show "No due date" */}
              {task.dueDate ? `Due ${task.dueDate}` : "No due date"}
            </span>
          </div>
        </header>

        {/* ================= TAGS SECTION ================= */}
        {/* Only render this DIV if tags exist AND tags has at least 1 element */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {/* Loop through tags and print each one */}
            {task.tags.map((tag) => (
              <span
                key={tag} // required by React to track each element in the loop
                className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ================= FOOTER: status badge + action buttons ================= */}
        <footer className="flex items-center justify-between pt-1">
          {/* STATUS BADGE (Pending/Completed) */}
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              // Color depends on task.status
              task.status === "Completed"
                ? "bg-emerald-50 text-emerald-700" // completed is green
                : "bg-amber-50 text-amber-700" // pending is orange
            }`}
          >
            {task.status}
          </span>

          {/* ACTION BUTTONS (Notes, Edit, Delete) */}
          <div className="flex items-center gap-2 text-xs">
            {/* Go to Notes page */}
            <button
              type="button"
              onClick={() => navigate(`/notes/${task.id}`)}
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:bg-slate-100"
            >
              Notes
            </button>

            {/* Go to Edit page */}
            <button
              type="button"
              onClick={() => navigate(`/edit/${task.id}`)}
              className="rounded-full bg-slate-900 px-3 py-1 text-white transition hover:bg-slate-800"
            >
              Edit
            </button>

            {/* Delete the task */}
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full border border-rose-200 px-3 py-1 text-rose-600 transition hover:bg-rose-50"
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
};

// Export so other components can import and use this
export default TaskCard;
