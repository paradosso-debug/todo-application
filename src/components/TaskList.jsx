import React from "react";
import useTaskStore from "../store/useTaskStore";
import TaskCard from "./TaskCard";

const TaskList = ({ filters }) => {
  const tasks = useTaskStore((state) => state.tasks || []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      filters.search.trim() === "" ||
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "all" || task.status === filters.status;

    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    const matchesTag =
      filters.tag === "all" ||
      (task.tags && task.tags.some((tag) => tag === filters.tag));

    const matchesDate = (() => {
      if (filters.date === "all" || !task.dueDate) return true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);

      if (filters.date === "today") {
        return due.getTime() === today.getTime();
      }

      if (filters.date === "overdue") {
        return due < today && task.status !== "Completed";
      }

      if (filters.date === "week") {
        const diffDays = (due - today) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }

      return true;
    })();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesTag &&
      matchesDate
    );
  });

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Tasks{" "}
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
            {filteredTasks.length}
          </span>
        </h2>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-sm text-slate-500">
          No tasks match these filters yet. Add one or clear the filters.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskList;
