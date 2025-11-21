// We import React so we can write JSX (HTML-like syntax inside JavaScript).
import React from "react";

// From react-router-dom we import:
// - useNavigate → lets us move the user to another route programmatically (ex: navigate("/"))
// - useParams → lets us read variables from the URL (ex: /notes/123 → id = "123")
import { useNavigate, useParams } from "react-router-dom";

// We import our Zustand store hook, which contains all tasks and actions.
import useTaskStore from "../store/useTaskStore";

// ------------------------------------------------------------
// MyNotes Component
// This page is used to VIEW the details of a specific task.
// The page shows:
// - Task title
// - Description
// - Subtasks with checkboxes
// - Tags like #Work, #React
//
// It also lets the user:
// - Toggle (check/uncheck) each subtask
// - Navigate back to homepage
// - Navigate to edit screen
// ------------------------------------------------------------
const MyNotes = () => {
  // Extract the "id" from the URL.
  // Example: Route is /notes/:id → URL is /notes/abc123 → id = "abc123"
  const { id } = useParams();

  // Get navigation function to move user to other pages.
  const navigate = useNavigate();

  // Pull the toggleSubtask action from Zustand.
  // toggleSubtask expects TWO arguments: (taskId, subtaskId)
  const toggleSubtask = useTaskStore((state) => state.toggleSubtask);

  // Pull the SPECIFIC task we need from Zustand.
  // state.tasks is the array of all tasks.
  // .find() returns the first task whose id matches the id from the URL.
  const task = useTaskStore((state) =>
    state.tasks.find((item) => item.id === id)
  );

  // --------------------------------------------------------
  // If the task does NOT exist:
  // For example:
  // - user typed an invalid id in the URL
  // - item was deleted
  //
  // We show a message + button to go home.
  // --------------------------------------------------------
  if (!task) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Task not found.</p>

        {/* Button → go back home */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Go back home
        </button>
      </div>
    );
  }

  // --------------------------------------------------------
  // If the task DOES exist, we display all its information below.
  // --------------------------------------------------------
  return (
    <div className="max-w-2xl space-y-4">
      {/* =================== HEADER SECTION =================== */}
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-indigo-500">
          Notes for task
        </p>

        {/* Task title */}
        <h1 className="text-2xl font-bold">{task.title}</h1>

        {/* Small metadata: Priority, Status, Due date */}
        <p className="text-sm text-slate-500">
          Priority: {task.priority} · Status: {task.status} · Due{" "}
          {/* If dueDate is empty, show "—" instead of blank */}
          {task.dueDate || "—"}
        </p>
      </header>

      {/* =================== DESCRIPTION SECTION =================== */}
      <section className="rounded-xl border bg-white/80 p-5 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-slate-800">
          Description / notes
        </h2>

        {/* We use whitespace-pre-wrap so line breaks in description are preserved. */}
        <p className="whitespace-pre-wrap text-sm text-slate-700">
          {/* If no description, show fallback message */}
          {task.description || "No extra notes added yet."}
        </p>
      </section>

      {/* =================== CHECKLIST / SUBTASKS SECTION =================== */}
      {/* Only show checklist section if subtasks exist AND length is > 0 */}
      {task.subtasks && task.subtasks.length > 0 && (
        <section className="rounded-xl border bg-white/80 p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-800">
            Checklist
          </h2>

          <ul className="space-y-1">
            {/* Loop over each subtask in task.subtasks */}
            {task.subtasks.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                {/* Checkbox:
                    - checked = boolean stored in item.done
                    - onChange calls toggleSubtask(task.id, subtask.id)
                  */}
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleSubtask(task.id, item.id)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                />

                {/* The text next to the checkbox.
                    If item.done is true → gray + line-through (completed).
                    Otherwise → normal dark text.
                 */}
                <span
                  className={
                    item.done ? "text-slate-400 line-through" : "text-slate-700"
                  }
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* =================== TAGS SECTION =================== */}
      {/* Only show if tags array exists AND there are items in it */}
      {task.tags && task.tags.length > 0 && (
        <section className="rounded-xl border bg-white/80 p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-800">Tags</h2>

          {/* Display each tag as a small label like #Work */}
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* =================== BOTTOM ACTION BUTTONS =================== */}
      <div className="flex gap-2">
        {/* EDIT TASK BUTTON */}
        <button
          type="button"
          onClick={() => navigate(`/edit/${task.id}`)}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Edit task
        </button>

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Back to tasks
        </button>
      </div>
    </div>
  );
};

// Export the component so it can be used in the router.
export default MyNotes;
