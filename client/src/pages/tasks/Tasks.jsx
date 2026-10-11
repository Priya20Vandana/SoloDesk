import { useMemo, useState } from "react";
import "./Tasks.css";

const initialTasks = [
  {
    id: 1,
    title: "Prepare homepage wireframes",
    project: "Website Redesign",
    description:
      "Create desktop and mobile wireframes for the homepage and review the layout hierarchy.",
    assignee: "You",
    priority: "High",
    status: "In Progress",
    startDate: "2026-10-08",
    dueDate: "2026-10-16",
    progress: 60,
  },
  {
    id: 2,
    title: "Collect brand references",
    project: "Brand Identity Package",
    description:
      "Gather visual references, typography ideas, and colour palette inspiration.",
    assignee: "You",
    priority: "Medium",
    status: "To Do",
    startDate: "2026-10-12",
    dueDate: "2026-10-20",
    progress: 0,
  },
  {
    id: 3,
    title: "Build landing page layout",
    project: "Landing Page Design",
    description:
      "Arrange the hero section, benefits, testimonials, and primary call to action.",
    assignee: "You",
    priority: "Urgent",
    status: "In Review",
    startDate: "2026-10-01",
    dueDate: "2026-10-09",
    progress: 90,
  },
  {
    id: 4,
    title: "Create Instagram post templates",
    project: "Social Media Templates",
    description:
      "Prepare reusable post and story templates using the approved brand styles.",
    assignee: "You",
    priority: "Low",
    status: "To Do",
    startDate: "2026-10-13",
    dueDate: "2026-10-24",
    progress: 0,
  },
  {
    id: 5,
    title: "Design onboarding screens",
    project: "Mobile App UI Design",
    description:
      "Design the first-time user onboarding flow and document the screen states.",
    assignee: "You",
    priority: "High",
    status: "Completed",
    startDate: "2026-09-20",
    dueDate: "2026-10-05",
    progress: 100,
  },
];

const statusOptions = ["To Do", "In Progress", "In Review", "Completed"];
const priorityOptions = ["Low", "Medium", "High", "Urgent"];

const projectOptions = [
  "Website Redesign",
  "Brand Identity Package",
  "Landing Page Design",
  "Social Media Templates",
  "Mobile App UI Design",
];

const emptyTask = {
  title: "",
  project: "",
  description: "",
  assignee: "You",
  priority: "Medium",
  status: "To Do",
  startDate: "",
  dueDate: "",
  progress: 0,
};

function formatDate(date) {
  if (!date) return "Not set";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-");
}

function getPriorityClass(priority) {
  return priority.toLowerCase();
}

function isOverdue(task) {
  if (!task.dueDate || task.status === "Completed") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(`${task.dueDate}T00:00:00`) < today;
}

function Icon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "view") {
    return (
      <svg {...common}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (name === "edit") {
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="m19 6-1 14H6L5 6" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [activeView, setActiveView] = useState("list");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [formData, setFormData] = useState(emptyTask);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) || null;

  const filteredTasks = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search) ||
        task.project.toLowerCase().includes(search) ||
        task.assignee.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      const matchesProject =
        projectFilter === "All" || task.project === projectFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProject
      );
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, projectFilter]);

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const overdueTasks = tasks.filter(isOverdue).length;

  function openCreateForm() {
    setFormData({ ...emptyTask });
    setEditingId(null);
    setFormError("");
    setActiveView("form");
  }

  function openEditForm(task) {
    setFormData({ ...task, progress: Number(task.progress) });
    setEditingId(task.id);
    setFormError("");
    setActiveView("form");
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "progress" ? Number(value) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.project ||
      !formData.assignee.trim() ||
      !formData.startDate ||
      !formData.dueDate
    ) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (formData.dueDate < formData.startDate) {
      setFormError("The due date cannot be earlier than the start date.");
      return;
    }

    const updatedTask = {
      ...formData,
      title: formData.title.trim(),
      assignee: formData.assignee.trim(),
      description: formData.description.trim(),
      progress:
        formData.status === "Completed"
          ? 100
          : Number(formData.progress),
    };

    if (editingId !== null) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId
            ? { ...task, ...updatedTask }
            : task
        )
      );

      setSelectedTaskId(editingId);
      setActiveView("details");
    } else {
      const newTask = { ...updatedTask, id: Date.now() };

      setTasks((current) => [newTask, ...current]);
      setSelectedTaskId(newTask.id);
      setActiveView("details");
    }

    setFormError("");
    setEditingId(null);
  }

  function updateTaskStatus(id, status) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
              progress:
                status === "Completed" ? 100 : task.progress,
            }
          : task
      )
    );
  }

  function updateSelectedProgress(value) {
    if (!selectedTask) return;

    const progress = Number(value);
    const status =
      progress === 100
        ? "Completed"
        : progress === 0
          ? "To Do"
          : "In Progress";

    setTasks((current) =>
      current.map((task) =>
        task.id === selectedTask.id
          ? { ...task, progress, status }
          : task
      )
    );
  }

  function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );

    if (selectedTaskId === id) {
      setSelectedTaskId(null);
      setActiveView("list");
    }
  }

  function backToList() {
    setSelectedTaskId(null);
    setEditingId(null);
    setFormError("");
    setActiveView("list");
  }

  if (activeView === "form") {
    return (
      <section className="tasks-page">
        <button
          className="tasks-back"
          onClick={backToList}
          type="button"
        >
          ← Back to Tasks
        </button>

        <header className="tasks-header">
          <p className="tasks-eyebrow">PROJECT MANAGEMENT</p>
          <h1>{editingId !== null ? "Edit Task" : "Create a Task"}</h1>
          <p className="tasks-subtitle">
            Define the work, connect it to a project, and set a realistic
            deadline.
          </p>
        </header>

        <form className="tasks-form" onSubmit={handleSubmit}>
          <div className="tasks-form-heading">
            <h2>Task Information</h2>
            <p>Fields marked with * are required.</p>
          </div>

          <div className="tasks-form-grid">
            <label className="tasks-field tasks-field--full">
              Task Title *
              <input
                name="title"
                value={formData.title}
                onChange={handleFieldChange}
                placeholder="e.g. Prepare homepage wireframes"
                required
              />
            </label>

            <label className="tasks-field">
              Project *
              <select
                name="project"
                value={formData.project}
                onChange={handleFieldChange}
                required
              >
                <option value="">Select a project</option>
                {projectOptions.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </label>

            <label className="tasks-field">
              Assignee *
              <input
                name="assignee"
                value={formData.assignee}
                onChange={handleFieldChange}
                placeholder="e.g. You"
                required
              />
            </label>

            <label className="tasks-field">
              Priority *
              <select
                name="priority"
                value={formData.priority}
                onChange={handleFieldChange}
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>

            <label className="tasks-field">
              Status *
              <select
                name="status"
                value={formData.status}
                onChange={handleFieldChange}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="tasks-field">
              Start Date *
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="tasks-field">
              Due Date *
              <input
                name="dueDate"
                type="date"
                min={formData.startDate || undefined}
                value={formData.dueDate}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="tasks-field">
              Progress ({formData.progress}%)
              <input
                name="progress"
                type="range"
                min="0"
                max="100"
                step="5"
                value={
                  formData.status === "Completed"
                    ? 100
                    : formData.progress
                }
                onChange={handleFieldChange}
              />
            </label>

            <label className="tasks-field tasks-field--full">
              Description
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleFieldChange}
                placeholder="Describe the task, deliverables, or acceptance criteria."
              />
            </label>
          </div>

          {formError && (
            <p className="tasks-form-error" role="alert">
              {formError}
            </p>
          )}

          <div className="tasks-form-actions">
            <button
              className="tasks-button tasks-button--secondary"
              type="button"
              onClick={backToList}
            >
              Cancel
            </button>

            <button
              className="tasks-button tasks-button--primary"
              type="submit"
            >
              {editingId !== null ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </section>
    );
  }

  if (activeView === "details" && selectedTask) {
    return (
      <section className="tasks-page">
        <button
          className="tasks-back"
          onClick={backToList}
          type="button"
        >
          ← Back to Tasks
        </button>

        <header className="tasks-header tasks-header--row">
          <div>
            <p className="tasks-eyebrow">TASK DETAILS</p>
            <h1>{selectedTask.title}</h1>
            <p className="tasks-subtitle">{selectedTask.project}</p>
          </div>

          <div className="tasks-detail-actions">
            <button
              className="tasks-button tasks-button--secondary"
              onClick={() => openEditForm(selectedTask)}
              type="button"
            >
              Edit Task
            </button>

            <button
              className="tasks-button tasks-button--danger"
              onClick={() => deleteTask(selectedTask.id)}
              type="button"
            >
              Delete Task
            </button>
          </div>
        </header>

        <div className="tasks-detail-grid">
          <article className="tasks-detail-card tasks-detail-card--main">
            <div className="tasks-detail-card-heading">
              <h2>Overview</h2>
              <span
                className={`tasks-status tasks-status--${getStatusClass(
                  selectedTask.status
                )}`}
              >
                {selectedTask.status}
              </span>
            </div>

            <p className="tasks-description">
              {selectedTask.description ||
                "No description has been added for this task."}
            </p>

            <div className="tasks-detail-meta">
              <div>
                <span>Project</span>
                <strong>{selectedTask.project}</strong>
              </div>

              <div>
                <span>Assignee</span>
                <strong>{selectedTask.assignee}</strong>
              </div>

              <div>
                <span>Start date</span>
                <strong>{formatDate(selectedTask.startDate)}</strong>
              </div>

              <div>
                <span>Due date</span>
                <strong>{formatDate(selectedTask.dueDate)}</strong>
                {isOverdue(selectedTask) && (
                  <em className="tasks-overdue">Overdue</em>
                )}
              </div>

              <div>
                <span>Priority</span>
                <strong
                  className={`tasks-priority tasks-priority--${getPriorityClass(
                    selectedTask.priority
                  )}`}
                >
                  {selectedTask.priority}
                </strong>
              </div>
            </div>
          </article>

          <article className="tasks-detail-card">
            <h2>Progress</h2>

            <div className="tasks-progress-heading">
              <strong>{selectedTask.progress}%</strong>
              <span>complete</span>
            </div>

            <div
              className="tasks-progress-track"
              aria-label={`Task ${selectedTask.progress}% complete`}
            >
              <div
                className="tasks-progress-fill"
                style={{ width: `${selectedTask.progress}%` }}
              />
            </div>

            <label className="tasks-progress-control">
              Update progress
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={selectedTask.progress}
                onChange={(event) =>
                  updateSelectedProgress(event.target.value)
                }
              />
            </label>

            <label className="tasks-field tasks-detail-status">
              Update status
              <select
                value={selectedTask.status}
                onChange={(event) =>
                  updateTaskStatus(selectedTask.id, event.target.value)
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="tasks-page">
      <header className="tasks-header tasks-header--row">
        <div>
          <p className="tasks-eyebrow">PROJECT MANAGEMENT</p>
          <h1>Tasks</h1>
          <p className="tasks-subtitle">
            Organise your work, manage priorities, and keep projects moving.
          </p>
        </div>

        <button
          className="tasks-button tasks-button--primary"
          onClick={openCreateForm}
          type="button"
        >
          + Create Task
        </button>
      </header>

      <div className="tasks-stats">
        <article className="tasks-stat">
          <span>Total Tasks</span>
          <h2>{tasks.length}</h2>
          <p>All recorded tasks</p>
        </article>

        <article className="tasks-stat">
          <span>In Progress</span>
          <h2>{inProgressTasks}</h2>
          <p>Currently being worked on</p>
        </article>

        <article className="tasks-stat">
          <span>Completed</span>
          <h2>{completedTasks}</h2>
          <p>Successfully finished</p>
        </article>

        <article className="tasks-stat">
          <span>Overdue</span>
          <h2>{overdueTasks}</h2>
          <p>Past due and not completed</p>
        </article>
      </div>

      <div className="tasks-toolbar">
        <div>
          <h2>All Tasks</h2>
          <p>Search and filter your work items.</p>
        </div>

        <div className="tasks-filters">
          <input
            type="search"
            aria-label="Search tasks"
            placeholder="Search tasks or projects..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="All">All priorities</option>
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority} priority
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by project"
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
          >
            <option value="All">All projects</option>
            {projectOptions.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tasks-table-wrapper">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <strong className="tasks-title">{task.title}</strong>
                  <span className="tasks-cell-secondary">
                    {task.assignee}
                  </span>
                </td>

                <td>{task.project}</td>

                <td>
                  <span
                    className={`tasks-priority tasks-priority--${getPriorityClass(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>

                <td>
                  <span>{formatDate(task.dueDate)}</span>
                  {isOverdue(task) && (
                    <span className="tasks-overdue">Overdue</span>
                  )}
                </td>

                <td>
                  <select
                    className={`tasks-status-select tasks-status-select--${getStatusClass(
                      task.status
                    )}`}
                    aria-label={`Change status for ${task.title}`}
                    value={task.status}
                    onChange={(event) =>
                      updateTaskStatus(task.id, event.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="tasks-progress-cell">
                  <div className="tasks-progress-track">
                    <div
                      className="tasks-progress-fill"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span>{task.progress}%</span>
                </td>

                <td>
                  <div className="tasks-row-actions">
                    <button
                      className="tasks-icon-action"
                      type="button"
                      title="View task"
                      aria-label={`View ${task.title}`}
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setActiveView("details");
                      }}
                    >
                      <Icon name="view" />
                    </button>

                    <button
                      className="tasks-icon-action"
                      type="button"
                      title="Edit task"
                      aria-label={`Edit ${task.title}`}
                      onClick={() => openEditForm(task)}
                    >
                      <Icon name="edit" />
                    </button>

                    <button
                      className="tasks-icon-action tasks-icon-action--danger"
                      type="button"
                      title="Delete task"
                      aria-label={`Delete ${task.title}`}
                      onClick={() => deleteTask(task.id)}
                    >
                      <Icon name="delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTasks.length === 0 && (
          <div className="tasks-empty">
            <h3>No tasks found</h3>
            <p>
              Try changing your search or filters, or create a new task.
            </p>
            <button
              className="tasks-button tasks-button--primary"
              type="button"
              onClick={openCreateForm}
            >
              Create Task
            </button>
          </div>
        )}
      </div>

      <p className="tasks-results-count">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>
    </section>
  );
}