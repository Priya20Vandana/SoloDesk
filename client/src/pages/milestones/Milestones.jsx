import { useMemo, useState } from "react";
import "./Milestones.css";

const initialMilestones = [
  {
    id: 1,
    title: "Homepage Wireframes",
    project: "Website Redesign",
    description:
      "Complete the desktop and mobile homepage wireframes for client review.",
    dueDate: "2026-10-18",
    amount: 15000,
    status: "In Progress",
    progress: 65,
  },
  {
    id: 2,
    title: "Brand Direction Approval",
    project: "Brand Identity Package",
    description:
      "Present the proposed logo directions, typography, and colour palette.",
    dueDate: "2026-10-22",
    amount: 12000,
    status: "Pending",
    progress: 0,
  },
  {
    id: 3,
    title: "Landing Page First Draft",
    project: "Landing Page Design",
    description:
      "Submit the first complete landing page design for client feedback.",
    dueDate: "2026-10-08",
    amount: 9000,
    status: "Submitted for Approval",
    progress: 100,
  },
  {
    id: 4,
    title: "Social Template Approval",
    project: "Social Media Templates",
    description:
      "Obtain approval for the initial social media template collection.",
    dueDate: "2026-10-28",
    amount: 6000,
    status: "Approved",
    progress: 100,
  },
  {
    id: 5,
    title: "Onboarding Design Delivery",
    project: "Mobile App UI Design",
    description:
      "Deliver the approved onboarding screens and associated design assets.",
    dueDate: "2026-10-05",
    amount: 18000,
    status: "Completed",
    progress: 100,
  },
];

const statusOptions = [
  "Pending",
  "In Progress",
  "Submitted for Approval",
  "Approved",
  "Completed",
];

const projectOptions = [
  "Website Redesign",
  "Brand Identity Package",
  "Landing Page Design",
  "Social Media Templates",
  "Mobile App UI Design",
];

const emptyMilestone = {
  title: "",
  project: "",
  description: "",
  dueDate: "",
  amount: "",
  status: "Pending",
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

function isOverdue(milestone) {
  if (
    !milestone.dueDate ||
    ["Approved", "Completed"].includes(milestone.status)
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(`${milestone.dueDate}T00:00:00`) < today;
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

export default function Milestones() {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [activeView, setActiveView] = useState("list");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);
  const [formData, setFormData] = useState(emptyMilestone);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  const selectedMilestone =
    milestones.find((item) => item.id === selectedMilestoneId) || null;

  const filteredMilestones = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return milestones.filter((milestone) => {
      const matchesSearch =
        milestone.title.toLowerCase().includes(search) ||
        milestone.project.toLowerCase().includes(search) ||
        milestone.description.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || milestone.status === statusFilter;

      const matchesProject =
        projectFilter === "All" || milestone.project === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [milestones, searchTerm, statusFilter, projectFilter]);

  const completedCount = milestones.filter(
    (item) => item.status === "Completed"
  ).length;

  const pendingCount = milestones.filter((item) =>
    ["Pending", "In Progress"].includes(item.status)
  ).length;

  const awaitingApprovalCount = milestones.filter(
    (item) => item.status === "Submitted for Approval"
  ).length;

  const overdueCount = milestones.filter(isOverdue).length;

  const totalValue = milestones.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  function openCreateForm() {
    setFormData({ ...emptyMilestone });
    setEditingId(null);
    setFormError("");
    setActiveView("form");
  }

  function openEditForm(milestone) {
    setFormData({
      ...milestone,
      amount: String(milestone.amount),
    });
    setEditingId(milestone.id);
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
      !formData.dueDate ||
      formData.amount === "" ||
      Number(formData.amount) < 0
    ) {
      setFormError(
        "Please complete all required fields and enter a valid amount."
      );
      return;
    }

    const progress =
      ["Approved", "Completed"].includes(formData.status)
        ? 100
        : Number(formData.progress);

    const updatedMilestone = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      amount: Number(formData.amount),
      progress,
    };

    if (editingId !== null) {
      setMilestones((current) =>
        current.map((item) =>
          item.id === editingId
            ? { ...item, ...updatedMilestone }
            : item
        )
      );

      setSelectedMilestoneId(editingId);
      setActiveView("details");
    } else {
      const newMilestone = {
        ...updatedMilestone,
        id: Date.now(),
      };

      setMilestones((current) => [newMilestone, ...current]);
      setSelectedMilestoneId(newMilestone.id);
      setActiveView("details");
    }

    setFormError("");
    setEditingId(null);
  }

  function updateMilestoneStatus(id, status) {
    setMilestones((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              progress: ["Approved", "Completed"].includes(status)
                ? 100
                : item.progress,
            }
          : item
      )
    );
  }

  function updateSelectedProgress(value) {
    if (!selectedMilestone) return;

    const progress = Number(value);

    setMilestones((current) =>
      current.map((item) =>
        item.id === selectedMilestone.id
          ? {
              ...item,
              progress,
              status:
                progress === 100
                  ? "Submitted for Approval"
                  : progress === 0
                    ? "Pending"
                    : "In Progress",
            }
          : item
      )
    );
  }

  function deleteMilestone(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this milestone?"
    );

    if (!confirmed) return;

    setMilestones((current) =>
      current.filter((item) => item.id !== id)
    );

    if (selectedMilestoneId === id) {
      setSelectedMilestoneId(null);
      setActiveView("list");
    }
  }

  function backToList() {
    setSelectedMilestoneId(null);
    setEditingId(null);
    setFormError("");
    setActiveView("list");
  }

  if (activeView === "form") {
    return (
      <section className="milestones-page">
        <button
          className="milestones-back"
          type="button"
          onClick={backToList}
        >
          ← Back to Milestones
        </button>

        <header className="milestones-header">
          <p className="milestones-eyebrow">PROJECT MANAGEMENT</p>
          <h1>
            {editingId !== null ? "Edit Milestone" : "Create a Milestone"}
          </h1>
          <p className="milestones-subtitle">
            Define a project checkpoint, set its deadline, and record its value.
          </p>
        </header>

        <form className="milestones-form" onSubmit={handleSubmit}>
          <div className="milestones-form-heading">
            <h2>Milestone Information</h2>
            <p>Fields marked with * are required.</p>
          </div>

          <div className="milestones-form-grid">
            <label className="milestones-field milestones-field--full">
              Milestone Title *
              <input
                name="title"
                value={formData.title}
                onChange={handleFieldChange}
                placeholder="e.g. Homepage Design Approval"
                required
              />
            </label>

            <label className="milestones-field">
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

            <label className="milestones-field">
              Due Date *
              <input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="milestones-field">
              Milestone Value (INR) *
              <input
                name="amount"
                type="number"
                min="0"
                step="1"
                value={formData.amount}
                onChange={handleFieldChange}
                placeholder="e.g. 15000"
                required
              />
            </label>

            <label className="milestones-field">
              Status *
              <select
                name="status"
                value={formData.status}
                onChange={handleFieldChange}
                required
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="milestones-field milestones-field--full">
              Progress ({formData.progress}%)
              <input
                className="milestones-range"
                name="progress"
                type="range"
                min="0"
                max="100"
                step="5"
                value={
                  ["Approved", "Completed"].includes(formData.status)
                    ? 100
                    : formData.progress
                }
                onChange={handleFieldChange}
              />
            </label>

            <label className="milestones-field milestones-field--full">
              Description
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleFieldChange}
                placeholder="Describe the expected deliverable or checkpoint."
              />
            </label>
          </div>

          {formError && (
            <p className="milestones-form-error" role="alert">
              {formError}
            </p>
          )}

          <div className="milestones-form-actions">
            <button
              className="milestones-button milestones-button--secondary"
              type="button"
              onClick={backToList}
            >
              Cancel
            </button>

            <button
              className="milestones-button milestones-button--primary"
              type="submit"
            >
              {editingId !== null ? "Save Changes" : "Create Milestone"}
            </button>
          </div>
        </form>
      </section>
    );
  }

  if (activeView === "details" && selectedMilestone) {
    return (
      <section className="milestones-page">
        <button
          className="milestones-back"
          type="button"
          onClick={backToList}
        >
          ← Back to Milestones
        </button>

        <header className="milestones-header milestones-header--row">
          <div>
            <p className="milestones-eyebrow">MILESTONE DETAILS</p>
            <h1>{selectedMilestone.title}</h1>
            <p className="milestones-subtitle">
              {selectedMilestone.project}
            </p>
          </div>

          <div className="milestones-detail-actions">
            <button
              className="milestones-button milestones-button--secondary"
              type="button"
              onClick={() => openEditForm(selectedMilestone)}
            >
              Edit Milestone
            </button>

            <button
              className="milestones-button milestones-button--danger"
              type="button"
              onClick={() => deleteMilestone(selectedMilestone.id)}
            >
              Delete Milestone
            </button>
          </div>
        </header>

        <div className="milestones-detail-grid">
          <article className="milestones-detail-card">
            <div className="milestones-detail-card-heading">
              <h2>Overview</h2>
              <span
                className={`milestones-status milestones-status--${getStatusClass(
                  selectedMilestone.status
                )}`}
              >
                {selectedMilestone.status}
              </span>
            </div>

            <p className="milestones-description">
              {selectedMilestone.description ||
                "No description has been added for this milestone."}
            </p>

            <div className="milestones-detail-meta">
              <div>
                <span>Project</span>
                <strong>{selectedMilestone.project}</strong>
              </div>

              <div>
                <span>Target date</span>
                <strong>{formatDate(selectedMilestone.dueDate)}</strong>
                {isOverdue(selectedMilestone) && (
                  <em className="milestones-overdue">Overdue</em>
                )}
              </div>

              <div>
                <span>Milestone value</span>
                <strong>{formatCurrency(selectedMilestone.amount)}</strong>
              </div>
            </div>
          </article>

          <article className="milestones-detail-card">
            <h2>Progress</h2>

            <div className="milestones-progress-heading">
              <strong>{selectedMilestone.progress}%</strong>
              <span>complete</span>
            </div>

            <div
              className="milestones-progress-track"
              role="progressbar"
              aria-label="Milestone progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={selectedMilestone.progress}
            >
              <div
                className="milestones-progress-fill"
                style={{ width: `${selectedMilestone.progress}%` }}
              />
            </div>

            <label className="milestones-progress-control">
              Update progress
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={selectedMilestone.progress}
                onChange={(event) =>
                  updateSelectedProgress(event.target.value)
                }
              />
            </label>

            <label className="milestones-field milestones-detail-status">
              Update status
              <select
                value={selectedMilestone.status}
                onChange={(event) =>
                  updateMilestoneStatus(
                    selectedMilestone.id,
                    event.target.value
                  )
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
    <section className="milestones-page">
      <header className="milestones-header milestones-header--row">
        <div>
          <p className="milestones-eyebrow">PROJECT MANAGEMENT</p>
          <h1>Milestones</h1>
          <p className="milestones-subtitle">
            Track important deliverables, deadlines, and project checkpoints.
          </p>
        </div>

        <button
          className="milestones-button milestones-button--primary"
          type="button"
          onClick={openCreateForm}
        >
          + Create Milestone
        </button>
      </header>

      <div className="milestones-stats">
        <article className="milestones-stat">
          <span>Total Milestones</span>
          <h2>{milestones.length}</h2>
          <p>All project checkpoints</p>
        </article>

        <article className="milestones-stat">
          <span>Pending / In Progress</span>
          <h2>{pendingCount}</h2>
          <p>Milestones still underway</p>
        </article>

        <article className="milestones-stat">
          <span>Awaiting Approval</span>
          <h2>{awaitingApprovalCount}</h2>
          <p>Submitted for client review</p>
        </article>

        <article className="milestones-stat">
          <span>Overdue</span>
          <h2>{overdueCount}</h2>
          <p>Past target date and unfinished</p>
        </article>
      </div>

      <div className="milestones-summary-strip">
        <div>
          <span>Completed milestones</span>
          <strong>{completedCount}</strong>
        </div>

        <div>
          <span>Total milestone value</span>
          <strong>{formatCurrency(totalValue)}</strong>
        </div>
      </div>

      <div className="milestones-toolbar">
        <div>
          <h2>All Milestones</h2>
          <p>Search and filter your project checkpoints.</p>
        </div>

        <div className="milestones-filters">
          <input
            type="search"
            aria-label="Search milestones"
            placeholder="Search milestones or projects..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            aria-label="Filter milestones by status"
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
            aria-label="Filter milestones by project"
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

      <div className="milestones-table-wrapper">
        <table className="milestones-table">
          <thead>
            <tr>
              <th>Milestone</th>
              <th>Project</th>
              <th>Target Date</th>
              <th>Value</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMilestones.map((milestone) => (
              <tr key={milestone.id}>
                <td>
                  <strong className="milestones-title">
                    {milestone.title}
                  </strong>
                  <span className="milestones-cell-secondary">
                    {milestone.description || "No description"}
                  </span>
                </td>

                <td>{milestone.project}</td>

                <td>
                  <span>{formatDate(milestone.dueDate)}</span>
                  {isOverdue(milestone) && (
                    <span className="milestones-overdue">Overdue</span>
                  )}
                </td>

                <td className="milestones-value">
                  {formatCurrency(milestone.amount)}
                </td>

                <td>
                  <select
                    className={`milestones-status-select milestones-status-select--${getStatusClass(
                      milestone.status
                    )}`}
                    aria-label={`Change status for ${milestone.title}`}
                    value={milestone.status}
                    onChange={(event) =>
                      updateMilestoneStatus(
                        milestone.id,
                        event.target.value
                      )
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="milestones-progress-cell">
                  <div
                    className="milestones-progress-track"
                    role="progressbar"
                    aria-label={`${milestone.title} progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={milestone.progress}
                  >
                    <div
                      className="milestones-progress-fill"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                  <span>{milestone.progress}%</span>
                </td>

                <td>
                  <div className="milestones-row-actions">
                    <button
                      className="milestones-icon-action"
                      type="button"
                      title="View milestone"
                      aria-label={`View ${milestone.title}`}
                      onClick={() => {
                        setSelectedMilestoneId(milestone.id);
                        setActiveView("details");
                      }}
                    >
                      <Icon name="view" />
                    </button>

                    <button
                      className="milestones-icon-action"
                      type="button"
                      title="Edit milestone"
                      aria-label={`Edit ${milestone.title}`}
                      onClick={() => openEditForm(milestone)}
                    >
                      <Icon name="edit" />
                    </button>

                    <button
                      className="milestones-icon-action milestones-icon-action--danger"
                      type="button"
                      title="Delete milestone"
                      aria-label={`Delete ${milestone.title}`}
                      onClick={() => deleteMilestone(milestone.id)}
                    >
                      <Icon name="delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMilestones.length === 0 && (
          <div className="milestones-empty">
            <h3>No milestones found</h3>
            <p>
              Try changing your search or filters, or create a new milestone.
            </p>
            <button
              className="milestones-button milestones-button--primary"
              type="button"
              onClick={openCreateForm}
            >
              Create Milestone
            </button>
          </div>
        )}
      </div>

      <p className="milestones-results-count">
        Showing {filteredMilestones.length} of {milestones.length} milestones
      </p>
    </section>
  );
}