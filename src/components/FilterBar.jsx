import React from "react";

const tagOptions = ["Daily", "Monthly", "Classes", "Work"];

const FilterBar = ({ filters, onChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({
      ...filters,
      [name]: value,
    });
  };

  const handleTagClick = (tag) => {
    onChange({
      ...filters,
      tag: filters.tag === tag ? "all" : tag,
    });
  };

  return (
    <section className="space-y-3 rounded-xl border bg-white/70 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-600">Filter your tasks</p>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => {
            const isActive = filters.tag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition
                  ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Search
          </label>
          <input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by title or description..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 md:flex md:flex-none">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Priority
            </label>
            <select
              name="priority"
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

export default FilterBar;
