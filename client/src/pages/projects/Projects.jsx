import { useMemo, useState } from "react";
import "./Projects.css";
const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    client: "Acme Studio",
    description:
      "Redesign the company website with responsive layouts, improved navigation, and updated service pages.",
    budget: 45000,
    startDate: "2026-10-01",
    deadline: "2026-11-15",
    status: "In Progress",
    progress: 65,
  },
  {
    id: 2,
    name: "Brand Identity Package",
    client: "Northstar Labs",
    description:
      "Develop a complete brand identity with logo concepts, typography, colour palette, and brand guidelines.",
    budget: 30000,
    startDate: "2026-10-05",
    deadline: "2026-11-22",
    status: "Planning",
    progress: 10,
  },
  {
    id: 3,
    name: "Landing Page Design",
    client: "Greenfield Co.",
    description:
      "Design a conversion-focused landing page for desktop and mobile devices.",
    budget: 18000,
    startDate: "2026-09-01",
    deadline: "2026-10-05",
    status: "Completed",
    progress: 100,
  },
  {
    id: 4,
    name: "Social Media Templates",
    client: "Brightpath Media",
    description:
      "Create reusable branded templates for social media content and campaigns.",
    budget: 12000,
    startDate: "2026-10-08",
    deadline: "2026-10-30",
    status: "On Hold",
    progress: 30,
  },
  {
    id: 5,
    name: "Mobile App UI Design",
    client: "Orbit Finance",
    description:
      "Design mobile application screens, wireframes, and a clickable prototype.",
    budget: 65000,
    startDate: "2026-11-01",
    deadline: "2026-12-10",
    status: "Planning",
    progress: 0,
  },
];
const projectStatuses = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
  "Cancelled",
];
const emptyProject = {
  name: "",
  client: "",
  description: "",
  budget: "",
  startDate: "",
  deadline: "",
  status: "Planning",
  progress: 0,
};
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}
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
export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeView, setActiveView] = useState("list");
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const filteredProjects = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search) ||
        project.client.toLowerCase().includes(search);
      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);
  const activeProjects = projects.filter(
    (project) =>
      ["Planning", "In Progress"].includes(project.status)
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;
  const totalBudget = projects
    .filter((project) => project.status !== "Cancelled")
    .reduce((total, project) => total + Number(project.budget || 0), 0);
  function openCreateForm() {
    setFormData({ ...emptyProject });
    setEditingId(null);
    setFormError("");
    setActiveView("form");
  }
  function openEditForm(project) {
    setFormData({
      ...project,
      budget: String(project.budget),
    });
    setEditingId(project.id);
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
      !formData.name.trim() ||
      !formData.client.trim() ||
      !formData.description.trim() ||
      formData.budget === "" ||
      Number(formData.budget) <= 0 ||
      !formData.startDate ||
      !formData.deadline
    ) {
      setFormError(
        "Complete all required fields and enter a budget greater than zero."
      );
      return;
    }
    if (formData.deadline < formData.startDate) {
      setFormError("The deadline cannot be before the start date.");
      return;
    }
    const progress =
      formData.status === "Completed"
        ? 100
        : Math.min(100, Math.max(0, Number(formData.progress) || 0));
    const updatedProject = {
      ...formData,
      name: formData.name.trim(),
      client: formData.client.trim(),
      description: formData.description.trim(),
      budget: Number(formData.budget),
      progress,
    };
    if (editingId !== null) {
      setProjects((current) =>
        current.map((project) =>
          project.id === editingId
            ? { ...project, ...updatedProject }
            : project
        )
      );
    } else {
      setProjects((current) => [
        { ...updatedProject, id: Date.now() },
        ...current,
      ]);
    }
    setFormError("");
    setEditingId(null);
    setFormData({ ...emptyProject });
    setActiveView("list");
  }
  function updateProjectStatus(project, status) {
    const updatedProject = {
      ...project,
      status,
      progress: status === "Completed" ? 100 : project.progress,
    };
    setProjects((current) =>
      current.map((item) =>
        item.id === project.id ? updatedProject : item
      )
    );
    setSelectedProject((current) =>
      current?.id === project.id ? updatedProject : current
    );
  }
  function updateProjectProgress(project, progress) {
    const updatedProject = {
      ...project,
      progress: Number(progress),
      status:
        Number(progress) === 100
          ? "Completed"
          : project.status === "Completed"
            ? "In Progress"
            : project.status,
    };
    setProjects((current) =>
      current.map((item) =>
        item.id === project.id ? updatedProject : item
      )
    );
    setSelectedProject((current) =>
      current?.id === project.id ? updatedProject : current
    );
  }
  function deleteProject(project) {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    setProjects((current) =>
      current.filter((item) => item.id !== project.id)
    );
    if (selectedProject?.id === project.id) {
      setSelectedProject(null);
    }
    setActiveView("list");
  }
  function openProjectDetails(project) {
    setSelectedProject(project);
    setActiveView("details");
  }
  function backToList() {
    setSelectedProject(null);
    setEditingId(null);
    setActiveView("list");
  }
  if (activeView === "form") {
    return (
      <section className="projects-page">
        <button
          className="projects-back"
          type="button"
          onClick={backToList}
        >
          ← Back to Projects
        </button>
        <header className="projects-header">
          <p className="projects-eyebrow">PROJECT MANAGEMENT</p>
          <h1>{editingId !== null ? "Edit Project" : "Create Project"}</h1>
          <p className="projects-subtitle">
            Organise project details, budgets, deadlines, and progress.
          </p>
        </header>
        <form className="projects-form" onSubmit={handleSubmit}>
          <div className="projects-form-heading">
            <h2>Project Information</h2>
            <p>Fields marked with * are required.</p>
          </div>
          <div className="projects-form-grid">
            <label className="projects-field">
              Project Name *
              <input
                name="name"
                value={formData.name}
                onChange={handleFieldChange}
                placeholder="e.g. Website Redesign"
                required
              />
            </label>
            <label className="projects-field">
              Client Name *
              <input
                name="client"
                value={formData.client}
                onChange={handleFieldChange}
                placeholder="Enter client or company"
                required
              />
            </label>
            <label className="projects-field">
              Budget (INR) *
              <input
                name="budget"
                type="number"
                min="1"
                step="1"
                value={formData.budget}
                onChange={handleFieldChange}
                placeholder="e.g. 45000"
                required
              />
            </label>
            <label className="projects-field">
              Project Status *
              <select
                name="status"
                value={formData.status}
                onChange={handleFieldChange}
                required
              >
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="projects-field">
              Start Date *
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleFieldChange}
                required
              />
            </label>
            <label className="projects-field">
              Deadline *
              <input
                name="deadline"
                type="date"
                min={formData.startDate || undefined}
                value={formData.deadline}
                onChange={handleFieldChange}
                required
              />
            </label>
            <label className="projects-field projects-field--full">
              Project Description *
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleFieldChange}
                placeholder="Describe the goals, scope, and expected deliverables."
                required
              />
            </label>
            <label className="projects-field projects-field--full">
              Progress: {formData.progress}%
              <input
                name="progress"
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.progress}
                onChange={handleFieldChange}
                disabled={formData.status === "Completed"}
              />
            </label>
          </div>
          {formError && (
            <p className="projects-form-error" role="alert">
              {formError}
            </p>
          )}
          <div className="projects-form-actions">
            <button
              className="projects-button projects-button--secondary"
              type="button"
              onClick={backToList}
            >
              Cancel
            </button>
            <button
              className="projects-button projects-button--primary"
              type="submit"
            >
              {editingId !== null ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </section>
    );
  }
  if (activeView === "details" && selectedProject) {
    return (
      <section className="projects-page">
        <button
          className="projects-back"
          type="button"
          onClick={backToList}
        >
          ← Back to Projects
        </button>
        <header className="projects-detail-header">
          <div>
            <p className="projects-eyebrow">PROJECT DETAILS</p>
            <h1>{selectedProject.name}</h1>
            <p className="projects-subtitle">
              Client: {selectedProject.client}
            </p>
          </div>
          <div className="projects-detail-actions">
            <button
              className="projects-button projects-button--secondary"
              type="button"
              onClick={() => openEditForm(selectedProject)}
            >
              Edit Project
            </button>
            <button
              className="projects-button projects-button--danger"
              type="button"
              onClick={() => deleteProject(selectedProject)}
            >
              Delete
            </button>
          </div>
        </header>
        <div className="projects-detail-grid">
          <article className="projects-detail-card">
            <span>Project Budget</span>
            <h2>{formatCurrency(selectedProject.budget)}</h2>
          </article>
          <article className="projects-detail-card">
            <span>Start Date</span>
            <h2>{formatDate(selectedProject.startDate)}</h2>
          </article>
          <article className="projects-detail-card">
            <span>Deadline</span>
            <h2>{formatDate(selectedProject.deadline)}</h2>
          </article>
          <article className="projects-detail-card">
            <span>Project Status</span>
            <select
              className={`projects-status-select projects-status-select--${getStatusClass(
                selectedProject.status
              )}`}
              value={selectedProject.status}
              onChange={(event) =>
                updateProjectStatus(selectedProject, event.target.value)
              }
              aria-label="Update project status"
            >
              {projectStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </article>
        </div>
        <article className="projects-detail-section">
          <h2>Project Progress</h2>
          <div className="projects-progress-heading">
            <span>Overall completion</span>
            <strong>{selectedProject.progress}%</strong>
          </div>
          <div
            className="projects-progress-track"
            role="progressbar"
            aria-label="Project completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={selectedProject.progress}
          >
            <div
              className="projects-progress-fill"
              style={{ width: `${selectedProject.progress}%` }}
            />
          </div>
          <label className="projects-progress-control">
            Update progress
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={selectedProject.progress}
              onChange={(event) =>
                updateProjectProgress(selectedProject, event.target.value)
              }
              disabled={selectedProject.status === "On Hold" ||
                selectedProject.status === "Cancelled"}
            />
          </label>
        </article>
        <article className="projects-detail-section">
          <h2>Project Description</h2>
          <p className="projects-description">
            {selectedProject.description}
          </p>
        </article>
        <article className="projects-detail-section">
          <h2>Tasks & Milestones</h2>
          <p className="projects-placeholder">
            Tasks and milestones will be connected to this project when we
            build those modules.
          </p>
        </article>
      </section>
    );
  }
  return (
    <section className="projects-page">
      <header className="projects-header projects-header--row">
        <div>
          <p className="projects-eyebrow">BUSINESS MANAGEMENT</p>
          <h1>Projects</h1>
          <p className="projects-subtitle">
            Track project work, budgets, deadlines, and progress in one place.
          </p>
        </div>
        <button
          className="projects-button projects-button--primary"
          type="button"
          onClick={openCreateForm}
        >
          + Create Project
        </button>
      </header>
      <div className="projects-stats">
        <article className="projects-stat">
          <span>Total Projects</span>
          <h2>{projects.length}</h2>
          <p>All recorded projects</p>
        </article>
        <article className="projects-stat">
          <span>Active Projects</span>
          <h2>{activeProjects}</h2>
          <p>Planning and in progress</p>
        </article>
        <article className="projects-stat">
          <span>Completed Projects</span>
          <h2>{completedProjects}</h2>
          <p>Successfully completed</p>
        </article>
        <article className="projects-stat">
          <span>Total Project Budget</span>
          <h2>{formatCurrency(totalBudget)}</h2>
          <p>Excludes cancelled projects</p>
        </article>
      </div>
      <div className="projects-toolbar">
        <div>
          <h2>All Projects</h2>
          <p>Find and manage your projects.</p>
        </div>
        <div className="projects-filters">
          <input
            type="search"
            aria-label="Search projects"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            aria-label="Filter projects by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            {projectStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="projects-table-wrapper">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Budget</th>
              <th>Deadline</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>
                  <strong className="projects-name">{project.name}</strong>
                  <span className="projects-cell-secondary">
                    Started {formatDate(project.startDate)}
                  </span>
                </td>
                <td>{project.client}</td>
                <td className="projects-budget">
                  {formatCurrency(project.budget)}
                </td>
                <td>{formatDate(project.deadline)}</td>
                <td>
                  <div className="projects-table-progress">
                    <div className="projects-progress-track">
                      <div
                        className="projects-progress-fill"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span>{project.progress}%</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`projects-status projects-status--${getStatusClass(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td>
                  <div className="projects-row-actions">
                <button
                  className="projects-icon-action"
                  type="button"
                  onClick={() => openProjectDetails(project)}
                  aria-label={`View ${project.name}`}
                  title="View project"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                </button>
                <button
                  className="projects-icon-action"
                  type="button"
                  onClick={() => openEditForm(project)}
                  aria-label={`Edit ${project.name}`}
                  title="Edit project"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="m14 6 4 4M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProjects.length === 0 && (
          <div className="projects-empty">
            <h3>No projects found</h3>
            <p>Try another search or status filter, or create a new project.</p>
            <button
              className="projects-button projects-button--primary"
              type="button"
              onClick={openCreateForm}
            >
              Create Project
            </button>
          </div>
        )}
      </div>
      <p className="projects-results-count">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>
    </section>
  );
}
