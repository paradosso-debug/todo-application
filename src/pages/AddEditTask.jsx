// We import React and two special React Hooks: useEffect and useState.
// - React: allows us to write components using JSX (HTML-like syntax in JS).
// - useState: lets this component remember and update values over time (like form data).
// - useEffect: lets us run side effects (code that reacts to changes, like loading data when the page opens).
import React, { useEffect, useState } from "react";

// From react-router-dom, we import:
// - useNavigate: a hook that lets us MOVE the user to another page with code (like navigate("/")).
// - useParams: a hook that lets us READ parameters from the URL (like /edit/123 → id = 123).
import { useNavigate, useParams } from "react-router-dom";

// nanoid is a small library that creates unique IDs (like "abc123xyz").
// We will use this to give each subtask its own unique id.
import { nanoid } from "nanoid";

// This is our custom Zustand store where we keep the list of tasks.
// useTaskStore is a hook we created elsewhere that gives us access to:
// - all tasks
// - functions to add and update tasks
import useTaskStore from "../store/useTaskStore";

// ------------------------------------------------------------
// emptyForm:
// This object represents the INITIAL shape of our form fields.
// Whenever we start adding a NEW task, we will use this as the base.
// Each property matches the "name" of our inputs in the form below.
// ------------------------------------------------------------
const emptyForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium", // default value when creating a new task
  status: "Pending", // default is "Pending", not completed yet
  tags: "",
  subtasks: "",
};

// ------------------------------------------------------------
// AddEditTask Component
// This ONE component handles TWO scenarios:
//
// 1) ADD MODE  → when there is NO id in the URL (e.g., /add)
// 2) EDIT MODE → when there IS an id in the URL (e.g., /edit/123)
//
// If an id exists, we load that task's data into the form.
// If no id, we start with an empty form and create a new task.
// ------------------------------------------------------------
const AddEditTask = () => {
  // useNavigate gives us a function we can call to move the user to another route.
  // Example: navigate("/") will send the user back to the homepage.
  const navigate = useNavigate();

  // useParams reads the dynamic parts of the URL.
  // If our route looks like "/edit/:id" and the user visits "/edit/abc123",
  // then useParams() will give us an object like { id: "abc123" }.
  const { id } = useParams();

  // We pull reactive data and actions from our Zustand store:
  // - tasks: the full array of existing tasks
  // - addTask: function to add a new task
  // - updateTask: function to update an existing task by id
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  // form state:
  // We use useState to store and manage all the form fields together in ONE object.
  // At the start, we use emptyForm so everything is blank or has default values.
  const [form, setForm] = useState(emptyForm);

  // isEditing:
  // If there is an "id" from the URL, Boolean(id) becomes true → EDIT MODE.
  // If no "id", Boolean(undefined) is false → ADD MODE.
  const isEditing = Boolean(id);

  // --------------------------------------------------------
  // useEffect → runs when certain dependencies change.
  //
  // In this case, we want to:
  // - When in EDIT MODE, load the existing task data into the form.
  // - When in ADD MODE, make sure the form is reset to empty values.
  //
  // The dependency array [id, isEditing, tasks] means:
  // "Run this effect whenever id, isEditing, or tasks change."
  // --------------------------------------------------------
  useEffect(() => {
    if (isEditing) {
      // We look for the task in our tasks array that matches the id from the URL.
      // tasks.find(...) goes through each task until it finds a match.
      const existing = tasks.find((task) => task.id === id);

      // If we actually found a task (defensive check):
      if (existing) {
        // We fill the form state with that task's data.
        // Some fields can be copied directly (title, description, etc.).
        // Others like tags and subtasks need to be transformed for the form.
        setForm({
          title: existing.title,
          description: existing.description,
          dueDate: existing.dueDate,
          priority: existing.priority,
          status: existing.status,

          // TAGS:
          // In the store, tags are probably saved as an ARRAY: ["Work", "React"]
          // But for this input, we want a TEXT string like "Work, React".
          // .join(", ") combines all array items into one string separated by comma and space.
          tags: existing.tags ? existing.tags.join(", ") : "",

          // SUBTASKS:
          // In the store, subtasks are probably an array of objects:
          // [{ id: "...", text: "Step 1", done: false }, ...]
          // For the textarea, we want a multi-line string:
          // "Step 1\nStep 2\nStep 3"
          subtasks: existing.subtasks
            ? existing.subtasks
                .map((s) => s.text) // take only the text of each subtask
                .join("\n") // put each on its own line
            : "",
        });
      }
    } else {
      // If we are NOT editing (so we are adding a new task),
      // we make sure the form is completely reset to the empty template.
      setForm(emptyForm);
    }
  }, [id, isEditing, tasks]);

  // --------------------------------------------------------
  // handleChange:
  // This function is called whenever any input or textarea changes.
  //
  // For example, typing in the title input will trigger this.
  // We use the "name" attribute of the input to know which field to update.
  // --------------------------------------------------------
  const handleChange = (event) => {
    // event.target is the DOM element (input, textarea, select) that was changed.
    const { name, value } = event.target;

    // We update our form state using the setter setForm.
    // We pass a callback (prev) which gives us the previous state.
    // Then we:
    // - copy all previous fields using the spread operator (...prev)
    // - overwrite ONLY the one that changed using [name]: value
    //
    // [name] is a "computed property name" meaning it will be replaced with the value of the variable "name".
    // Example: if name === "title", this becomes { ...prev, title: value }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------------
  // handleSubmit:
  // This function runs when the user presses the "Save task" button.
  // It:
  // 1) Stops the form from reloading the page.
  // 2) Builds a payload object based on the current form values.
  // 3) Cleans and transforms tags + subtasks.
  // 4) Decides whether to ADD a new task or UPDATE an existing one.
  // 5) Navigates the user back to the homepage.
  // --------------------------------------------------------
  const handleSubmit = (event) => {
    // By default, submitting a form would refresh the page.
    // We use preventDefault() to keep this as a single-page app behavior.
    event.preventDefault();

    // We construct a new task object called "payload".
    // This object will be passed into addTask or updateTask.
    const payload = {
      // We trim whitespace from title and description to avoid "  My Task  " issues.
      title: form.title.trim(),
      description: form.description.trim(),

      // These fields can be taken as-is from the form state.
      dueDate: form.dueDate,
      priority: form.priority,
      status: form.status,

      // TAGS:
      // If the tags input is completely empty or just spaces,
      // we store an empty array [].
      //
      // Otherwise:
      // - split the string by commas → gives an array of strings
      // - trim spaces around each tag
      //
      // Example:
      // "Work, React ,  Daily" → ["Work", "React", "Daily"]
      tags:
        form.tags.trim() === ""
          ? []
          : form.tags.split(",").map((tag) => tag.trim()),

      // SUBTASKS:
      // If subtasks textarea is empty → keep an empty array.
      // Otherwise:
      // - split the content by line breaks ("\n")
      // - trim each line
      // - remove any lines that are empty
      // - convert each line into a subtask object with:
      //      { id: someUniqueId, text: "line content", done: false }
      subtasks:
        form.subtasks.trim() === ""
          ? []
          : form.subtasks
              .split("\n") // break at each new line
              .map((line) => line.trim()) // remove spaces at start and end of each line
              .filter((line) => line !== "") // remove empty lines
              .map((text) => ({
                id: nanoid(), // generate unique ID per subtask
                text, // same as text: text
                done: false, // default each new subtask as not completed
              })),
    };

    // BASIC VALIDATION:
    // If the title ends up empty after trimming, we stop and warn the user.
    if (!payload.title) {
      alert("Please add a title.");
      return; // stop here, do not save
    }

    // Now we decide whether we're updating or adding:
    if (isEditing) {
      // EDIT MODE:
      // We call updateTask from Zustand and pass:
      // - the id of the task to update
      // - the new data in payload
      updateTask(id, payload);
    } else {
      // ADD MODE:
      // We call addTask to insert a brand new task into our store.
      addTask(payload);
    }

    // After successfully saving (either add or update),
    // we navigate the user back to the homepage ("/").
    navigate("/");
  };

  // --------------------------------------------------------
  // handleCancel:
  // This function is called when the user clicks the "Cancel" button.
  // Instead of saving anything, we simply navigate back one step in history.
  // navigate(-1) means:
  // "Go back to the previous page in the browser history."
  // --------------------------------------------------------
  const handleCancel = () => {
    navigate(-1);
  };

  // --------------------------------------------------------
  // JSX RETURN:
  // This is the structure of what will show on the screen.
  // We build:
  // - A title and description at the top
  // - A form with controlled inputs (value comes from state, updates via handleChange)
  // - Inputs for title, description, subtasks, dueDate, priority, status, tags
  // - Buttons for Cancel and Save
  // --------------------------------------------------------
  return (
    <div className="max-w-2xl space-y-4">
      {/* ---------------- PAGE HEADER (TITLE + DESCRIPTION TEXT) ---------------- */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">
          {/* We show different text depending on whether we're editing or adding */}
          {isEditing ? "Edit task" : "Add a new task"}
        </h1>

        <p className="text-sm text-slate-500">
          Give your task a clear title, due date and priority. You can always
          edit it later.
        </p>
      </header>

      {/* ---------------- MAIN FORM CONTAINER ---------------- */}
      {/* onSubmit is connected to our handleSubmit function above. */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white/80 p-5 shadow-sm"
      >
        {/* ---------------- TITLE INPUT ---------------- */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            Title
          </label>

          {/* This is a controlled input:
              - value={form.title} means its value is always synced with state.
              - onChange={handleChange} updates the form state whenever user types.
          */}
          <input
            name="title" // this MUST match the property in the form object
            value={form.title}
            onChange={handleChange}
            placeholder="Write a short, clear title..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* ---------------- DESCRIPTION TEXTAREA ---------------- */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            Description / notes
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4} // visible height of the textarea
            placeholder="Add context, links or notes for this task..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* ---------------- SUBTASKS / CHECKLIST TEXTAREA ---------------- */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            Checklist (one item per line)
          </label>

          {/* This textarea will be converted into an array of subtasks on submit. */}
          <textarea
            name="subtasks"
            value={form.subtasks}
            onChange={handleChange}
            rows={3}
            placeholder={"Example:\nResearch topic\nOutline notes\nReview"}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* ---------------- GRID: DUE DATE, PRIORITY, STATUS ---------------- */}
        {/* On larger screens (md:), this becomes 3 columns side by side. */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* DUE DATE FIELD */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500">
              Due date
            </label>

            <input
              type="date" // gives us a browser date picker
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* PRIORITY SELECT DROPDOWN */}
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
              {/* The value property here must match what we store in the task object. */}
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* STATUS SELECT DROPDOWN */}
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
              {/* We keep status options aligned with what our app logic expects. */}
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* ---------------- TAGS INPUT ---------------- */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            Tags (comma separated)
          </label>

          {/* Example: "Daily, Work, React" → ["Daily", "Work", "React"] in the store */}
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. Daily, Work, React"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* ---------------- ACTION BUTTONS (CANCEL + SAVE) ---------------- */}
        <div className="flex justify-end gap-2 pt-2">
          {/* CANCEL BUTTON — calls handleCancel instead of submitting the form */}
          <button
            type="button" // type="button" so it doesn't trigger form submit
            onClick={handleCancel}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>

          {/* SAVE BUTTON — type="submit" triggers onSubmit on the <form> */}
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {/* Button text changes depending on add vs edit mode */}
            {isEditing ? "Save changes" : "Save task"}
          </button>
        </div>
      </form>
    </div>
  );
};

// We export this component so other parts of the app can import and use it.
export default AddEditTask;
