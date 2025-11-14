import React from "react";
import { useNavigate } from "react-router-dom";
import useTaskStore from "../store/useTaskStore";

const priorityColor = {
  High: "bg-red-500",
  Medium: "bg-amber-400",
  Low: "bg-emerald-500",
};

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const toggleStatus = useTaskStore((state) => state.toggleStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleToggle = () => {
    toggleStatus(task.id);
  };

  const handleDelete = () => {
    if (window.confirm("Delete this task?")) {
      deleteTask(task.id);
    }
  };

  return (
    <article className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      {/* status toggle */}
      <button
        type="button"
        onClick={handleToggle}
        className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.status === "Completed"
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 bg-white text-transparent hover:border-indigo-400"
        }`}
        aria-label="Toggle task status"
      >
        ✓
      </button>

      <div className="flex-1 space-y-2">
        <header className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {task.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {task.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-700">
              <span
                className={`h-2 w-2 rounded-full ${
                  priorityColor[task.priority] || "bg-slate-400"
                }`}
              />
              {task.priority} priority
            </span>
            <span className="text-[10px] text-slate-400">
              {task.dueDate ? `Due ${task.dueDate}` : "No due date"}
            </span>
          </div>
        </header>

        {task.tags && task.tags.length > 0 && (
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
        )}

        <footer className="flex items-center justify-between pt-1">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              task.status === "Completed"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {task.status}
          </span>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => navigate(`/notes/${task.id}`)}
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:bg-slate-100"
            >
              Notes
            </button>
            <button
              type="button"
              onClick={() => navigate(`/edit/${task.id}`)}
              className="rounded-full bg-slate-900 px-3 py-1 text-white transition hover:bg-slate-800"
            >
              Edit
            </button>
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

export default TaskCard;
