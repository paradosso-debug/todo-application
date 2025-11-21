// We import React so we can write JSX syntax (HTML-looking code in JavaScript).
import React from "react";

// This is an array of strings. Each string is one tag option.
// We will LOOP through this array to generate the tag buttons dynamically.
const tagOptions = ["Daily", "Monthly", "Classes", "Work"];

// This is a React FUNCTION COMPONENT called FilterBar.
// It receives TWO PROPS from the parent component:
// 1) filters = an object containing the current filter values (search, status, priority, tag)
// 2) onChange = a function that the parent gives us so we can send updated filter values back up.
const FilterBar = ({ filters, onChange }) => {
  // --------------------------------------------------------
  // handleChange — triggered whenever the user types in the search box
  // or changes the <select> dropdowns.
  // --------------------------------------------------------
  const handleChange = (event) => {
    // event.target contains info about the element that triggered the change
    // name = the filter key (example: "search", "status", "priority")
    // value = whatever the user typed or selected
    const { name, value } = event.target;

    // We call the parent's onChange function and send a NEW object.
    // We spread (...) the existing filters object to copy all current values.
    // Then we replace ONLY the one that changed using [name]: value
    // Example output: { search: "abc", status: "all", priority: "High", tag: "Daily" }
    onChange({
      ...filters, // copy all existing filter values
      [name]: value, // update only the field that triggered the event
    });
  };

  // --------------------------------------------------------
  // handleTagClick — handles clicking on tag filters (Daily, Monthly, etc.)
  // --------------------------------------------------------
  const handleTagClick = (tag) => {
    // If the clicked tag is already active, we reset it back to "all".
    // Otherwise, we set the filters.tag to the clicked tag.
    onChange({
      ...filters,
      tag: filters.tag === tag ? "all" : tag, // toggle on/off behavior
    });
  };

  // --------------------------------------------------------
  // The RETURN is the actual JSX UI.
  // This component returns a <section> that contains:
  // - Tag filter buttons
  // - Search input
  // - Status dropdown
  // - Priority dropdown
  // --------------------------------------------------------
  return (
    <section className="space-y-3 rounded-xl border bg-white/70 p-4 shadow-sm">
      {/* ----------- TOP BAR: LABEL + TAG BUTTONS ------------ */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Small title */}
        <p className="text-sm font-medium text-slate-600">Filter your tasks</p>

        {/* Container holding all tag buttons */}
        <div className="flex flex-wrap gap-2">
          {/* 
            We LOOP through tagOptions. For each tag (Daily, Monthly, etc.), we create a button.
            tagOptions.map returns a NEW array of JSX button elements.
          */}
          {tagOptions.map((tag) => {
            // Check if this tag is currently selected
            const isActive = filters.tag === tag;

            return (
              <button
                key={tag} // key helps React track each button in the loop
                type="button"
                onClick={() => handleTagClick(tag)} // clicking updates filters
                className={`rounded-full px-3 py-1 text-xs font-medium border transition
                  ${
                    // Conditional class: if active → Indigo style. If not → gray style.
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
              >
                {tag} {/* The button text */}
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------- SECOND ROW: SEARCH + SELECTS ------------ */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* --- SEARCH INPUT --- */}
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Search
          </label>

          {/* Controlled input: value comes from filters.search */}
          <input
            name="search" // this ties the input to filters.search
            value={filters.search} // controlled input
            onChange={handleChange} // updates the filter state
            placeholder="Search by title or description..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* --- STATUS & PRIORITY DROPDOWNS --- */}
        <div className="grid flex-1 grid-cols-2 gap-3 md:flex md:flex-none">
          {/* --- STATUS SELECT --- */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Status
            </label>

            <select
              name="status" // ties to filters.status
              value={filters.status} // controlled select
              onChange={handleChange} // update on change
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* --- PRIORITY SELECT --- */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Priority
            </label>

            <select
              name="priority" // ties to filters.priority
              value={filters.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

// We export the component so it can be imported in another file.
export default FilterBar;
