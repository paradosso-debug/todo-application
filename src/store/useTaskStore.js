// src/store/useTaskStore.js
import { create } from "zustand";
import { nanoid } from "nanoid";

const initialTasks = [
  {
    id: nanoid(),
    title: "Finish React homework",
    description:
      "Work on the notes app UI and connect it to Zustand + React Router.",
    dueDate: "2025-11-14",
    priority: "High",
    status: "Pending",
    tags: ["Learning", "React"],
    subtasks: [
      { id: nanoid(), text: "Review requirements", done: false },
      { id: nanoid(), text: "Connect store to UI", done: false },
    ],
  },
  {
    id: nanoid(),
    title: "Prepare JS class",
    description: "Plan examples for array methods and localStorage practice.",
    dueDate: "2025-11-15",
    priority: "Medium",
    status: "Pending",
    tags: ["Teaching", "Daily"],
    subtasks: [
      { id: nanoid(), text: "Pick 3 array methods", done: true },
      { id: nanoid(), text: "Write mini exercises", done: false },
    ],
  },
  {
    id: nanoid(),
    title: "Workout + stretch",
    description: "Quick walk + stretch session to reset after coding.",
    dueDate: "2025-11-14",
    priority: "Low",
    status: "Completed",
    tags: ["Health", "Daily"],
    subtasks: [
      { id: nanoid(), text: "10 min walk", done: true },
      { id: nanoid(), text: "Stretch legs + back", done: true },
    ],
  },
];

const useTaskStore = create((set) => ({
  tasks: initialTasks,

  // ➕ ADD
  addTask: (taskData) => {
    const newTask = {
      id: nanoid(),
      status: "Pending",
      subtasks: [],
      ...taskData,
    };

    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }));
  },

  // ✏️ UPDATE
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),

  // ❌ DELETE
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  // ✅ TOGGLE STATUS
  toggleStatus: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "Completed" ? "Pending" : "Completed",
            }
          : task
      ),
    })),

  // ☑️ TOGGLE SUBTASK
  toggleSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id !== taskId
          ? task
          : {
              ...task,
              subtasks: (task.subtasks || []).map((sub) =>
                sub.id === subtaskId ? { ...sub, done: !sub.done } : sub
              ),
            }
      ),
    })),
}));

export default useTaskStore;
