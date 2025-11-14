import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import useTaskStore from "../store/useTaskStore";

const emptyForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  status: "Pending",
  tags: "",
  subtasks: "",
};

const AddEditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(id);

  // Load task data when editing
  useEffect(() => {
    if (isEditing) {
      const existing = tasks.find((task) => task.id === id);
      if (existing) {
        setForm({
          title: existing.title,
          description: existing.description,
          dueDate: existing.dueDate,
          priority: existing.priority,
          status: existing.status,
          tags: existing.tags ? existing.tags.join(", ") : "",
          subtasks: existing.subtasks
            ? existing.subtasks.map((s) => s.text).join("\n")
            : "",
        });
      }
    } else {
      setForm(emptyForm);
    }
  }, [id, isEditing, tasks]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      priority: form.priority,
      status: form.status,
      tags:
        form.tags.trim() === ""
          ? []
          : form.tags.split(",").map((tag) => tag.trim()),
      subtasks:
        form.subtasks.trim() === ""
          ? []
          : form.subtasks
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line !== "")
              .map((text) => ({ id: nanoid(), text, done: false })),
    };

    if (!payload.title) {
      alert("Please add a title.");
      return;
    }

    if (isEditing) {
      updateTask(id, payload);
    } else {
      addTask(payload);
    }

    navigate("/");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit task" : "Add a new task"}
        </h1>
        <p className="text-sm text-slate-500">
          Give your task a clear title, due date and priority. You can always
          edit it later.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white/80 p-5 shadow-sm"
      >
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Write a short, clear title..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            Description / notes
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Add context, links or notes for this task..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            Checklist (one item per line)
          </label>
          <textarea
            name="subtasks"
            value={form.subtasks}
            onChange={handleChange}
            rows={3}
            placeholder={"Example:\nResearch topic\nOutline notes\nReview"}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500">
              Due date
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500">
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            Tags (comma separated)
          </label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. Daily, Work, React"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {isEditing ? "Save changes" : "Save task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditTask;
