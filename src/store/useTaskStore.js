// We import `create` from Zustand.
// Zustand is a very lightweight state management library
// that lets us create a GLOBAL store.
// A global store works like React state — but available EVERYWHERE
// without prop drilling.
import { create } from "zustand";

// We import nanoid to generate unique, random IDs for tasks and subtasks.
// Example output: "V1StGXR8_Z5jdHi6B-myT"
import { nanoid } from "nanoid";

// ------------------------------------------------------------
// initialTasks:
// This is our STARTER DATA for the task list.
// It gives the app some example tasks the first time it loads.
// In a real app, these might come from:
// - a database
// - an API
// - localStorage
// ------------------------------------------------------------
const initialTasks = [
  {
    // Each task needs a unique ID
    id: nanoid(),

    // Task title (short and clear)
    title: "Finish React homework",

    // Longer text notes that show in the MyNotes page
    description:
      "Work on the notes app UI and connect it to Zustand + React Router.",

    // Due date (YYYY-MM-DD)
    dueDate: "2025-11-14",

    // Priority level
    priority: "High",

    // Status can be: "Pending" or "Completed"
    status: "Pending",

    // Tags help categorize tasks (like #React, #Daily, #Health)
    tags: ["Learning", "React"],

    // Subtasks are mini-items inside the main task
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

// ------------------------------------------------------------
// useTaskStore:
// We create the Zustand store by calling create().
// The function inside create((set) => { ... })
// receives a `set` function that lets us UPDATE the global state.
//
// This is similar to React's setState(),
// except it works for your entire app.
// ------------------------------------------------------------
const useTaskStore = create((set) => ({
  // =======================
  // MAIN STATE (GLOBAL DATA)
  // =======================
  // All tasks live here in one big array.
  tasks: initialTasks,

  // --------------------------------------------------------
  // ADD A NEW TASK
  // addTask(taskData)
  // This receives the fields from the Add/Edit form and creates a NEW task object.
  // --------------------------------------------------------
  addTask: (taskData) => {
    const newTask = {
      // Always generate a new unique ID for a new task
      id: nanoid(),

      // Default status for a brand-new task is always "Pending"
      status: "Pending",

      // Default subtasks should be an empty array
      // unless the caller passes something in taskData
      subtasks: [],

      // Spread the rest of the fields from the form
      ...taskData,
    };

    // set((state) => { ... }) is how we UPDATE the store.
    // We NEVER mutate state directly.
    //
    // We ALWAYS return a NEW array, because React & Zustand
    // depend on IMMUTABLE updates to detect changes.
    set((state) => ({
      // Add new task to the FRONT of the array.
      tasks: [newTask, ...state.tasks],
    }));
  },

  // --------------------------------------------------------
  // UPDATE AN EXISTING TASK
  // updateTask(id, updates)
  // This function finds the task with the matching ID
  // and replaces ONLY the fields we want to update.
  // --------------------------------------------------------
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        // If this is the correct task...
        task.id === id
          ? // ...return a NEW object combining the old task + new updates
            { ...task, ...updates }
          : // Otherwise return task unchanged
            task
      ),
    })),

  // --------------------------------------------------------
  // DELETE A TASK
  // deleteTask(id)
  // Uses .filter() to REMOVE a task based on the ID.
  // --------------------------------------------------------
  deleteTask: (id) =>
    set((state) => ({
      // Keep every task EXCEPT the one with this ID
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  // --------------------------------------------------------
  // TOGGLE TASK STATUS
  // toggleStatus(id)
  //
  // If a task is Pending → make it Completed
  // If a task is Completed → make it Pending
  //
  // We use && logic and immutable updates.
  // --------------------------------------------------------
  toggleStatus: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              // Copy previous task fields
              ...task,
              // Flip the status
              status: task.status === "Completed" ? "Pending" : "Completed",
            }
          : task
      ),
    })),

  // --------------------------------------------------------
  // TOGGLE SUBTASK STATUS
  // toggleSubtask(taskId, subtaskId)
  //
  // 1) Find the correct task by taskId
  // 2) Inside that task, find the correct subtask by subtaskId
  // 3) Flip the "done" boolean
  // --------------------------------------------------------
  toggleSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        // If this is NOT the correct task, return it unchanged
        task.id !== taskId
          ? task
          : {
              // Otherwise, modify THIS task
              ...task,

              // Update ONLY the subtasks array
              subtasks: (task.subtasks || []).map((sub) =>
                // Find the matching subtask
                sub.id === subtaskId
                  ? // Toggle its `done` field
                    { ...sub, done: !sub.done }
                  : // Leave others unchanged
                    sub
              ),
            }
      ),
    })),
}));

// Export the store hook.
// We will call useTaskStore() inside components to access:
// - tasks
// - addTask()
// - updateTask()
// - deleteTask()
// - toggleStatus()
// - toggleSubtask()
export default useTaskStore;
