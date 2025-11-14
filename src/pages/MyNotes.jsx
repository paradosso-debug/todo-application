import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTaskStore from "../store/useTaskStore";

const MyNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const toggleSubtask = useTaskStore((state) => state.toggleSubtask);
  const task = useTaskStore((state) =>
    state.tasks.find((item) => item.id === id)
  );

  if (!task) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Task not found.</p>
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

  return (
    <div className="max-w-2xl space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-indigo-500">
          Notes for task
        </p>
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <p className="text-sm text-slate-500">
          Priority: {task.priority} · Status: {task.status} · Due{" "}
          {task.dueDate || "—"}
        </p>
      </header>

      <section className="rounded-xl border bg-white/80 p-5 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-slate-800">
          Description / notes
        </h2>
        <p className="whitespace-pre-wrap text-sm text-slate-700">
          {task.description || "No extra notes added yet."}
        </p>
      </section>

      {task.subtasks && task.subtasks.length > 0 && (
        <section className="rounded-xl border bg-white/80 p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-800">
            Checklist
          </h2>
          <ul className="space-y-1">
            {task.subtasks.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleSubtask(task.id, item.id)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                />
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

      {task.tags && task.tags.length > 0 && (
        <section className="rounded-xl border bg-white/80 p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-800">Tags</h2>
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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate(`/edit/${task.id}`)}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Edit task
        </button>
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

export default MyNotes;
