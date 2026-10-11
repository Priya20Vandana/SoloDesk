import { useMemo, useState } from "react";
import "./Approvals.css";

const initialApprovals = [
  {
    id: 1,
    title: "Homepage Wireframes",
    project: "Website Redesign",
    itemType: "Task",
    submittedBy: "You",
    submittedDate: "2026-10-08",
    description:
      "Desktop and mobile homepage wireframes, including navigation and content hierarchy.",
    status: "Pending Review",
    feedback: "",
    history: [
      {
        id: 1,
        action: "Submitted for approval",
        date: "2026-10-08",
        note: "Wireframes submitted for client review.",
      },
    ],
  },
  {
    id: 2,
    title: "Brand Direction Concepts",
    project: "Brand Identity Package",
    itemType: "Milestone",
    submittedBy: "You",
    submittedDate: "2026-10-06",
    description:
      "Initial logo concepts, typography options, and proposed brand colours.",
    status: "Changes Requested",
    feedback:
      "Please explore one more logo direction and adjust the colour palette.",
    history: [
      {
        id: 2,
        action: "Submitted for approval",
        date: "2026-10-04",
        note: "Initial brand concepts submitted.",
      },
      {
        id: 3,
        action: "Changes requested",
        date: "2026-10-06",
        note: "Explore another logo direction and adjust the colour palette.",
      },
    ],
  },
  {
    id: 3,
    title: "Landing Page First Draft",
    project: "Landing Page Design",
    itemType: "Milestone",
    submittedBy: "You",
    submittedDate: "2026-10-05",
    description:
      "First landing page design with hero section, features, testimonials, and call to action.",
    status: "Approved",
    feedback: "Approved. The layout and content hierarchy look good.",
    history: [
      {
        id: 4,
        action: "Submitted for approval",
        date: "2026-10-03",
        note: "First draft submitted for review.",
      },
      {
        id: 5,
        action: "Approved",
        date: "2026-10-05",
        note: "The layout and content hierarchy were approved.",
      },
    ],
  },
  {
    id: 4,
    title: "Social Media Template Set",
    project: "Social Media Templates",
    itemType: "Task",
    submittedBy: "You",
    submittedDate: "2026-10-09",
    description:
      "Reusable social media post and story templates using the agreed visual style.",
    status: "Draft",
    feedback: "",
    history: [],
  },
];

const statusOptions = [
  "Draft",
  "Pending Review",
  "Approved",
  "Changes Requested",
];

const projectOptions = [
  "Website Redesign",
  "Brand Identity Package",
  "Landing Page Design",
  "Social Media Templates",
  "Mobile App UI Design",
];

const itemTypeOptions = ["Task", "Milestone"];

const emptyApproval = {
  title: "",
  project: "",
  itemType: "Task",
  submittedBy: "You",
  submittedDate: "",
  description: "",
  status: "Draft",
  feedback: "",
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

export default function Approvals() {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [activeView, setActiveView] = useState("list");
  const [selectedApprovalId, setSelectedApprovalId] = useState(null);
  const [formData, setFormData] = useState(emptyApproval);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [decisionFeedback, setDecisionFeedback] = useState("");
  const [decisionError, setDecisionError] = useState("");

  const selectedApproval =
    approvals.find((item) => item.id === selectedApprovalId) || null;

  const filteredApprovals = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return approvals.filter((approval) => {
      const matchesSearch =
        approval.title.toLowerCase().includes(search) ||
        approval.project.toLowerCase().includes(search) ||
        approval.description.toLowerCase().includes(search) ||
        approval.feedback.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || approval.status === statusFilter;

      const matchesProject =
        projectFilter === "All" || approval.project === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [approvals, searchTerm, statusFilter, projectFilter]);

  const pendingCount = approvals.filter(
    (item) => item.status === "Pending Review"
  ).length;

  const approvedCount = approvals.filter(
    (item) => item.status === "Approved"
  ).length;

  const changesRequestedCount = approvals.filter(
    (item) => item.status === "Changes Requested"
  ).length;

  const draftCount = approvals.filter(
    (item) => item.status === "Draft"
  ).length;

  function openCreateForm() {
    setFormData({
      ...emptyApproval,
      submittedDate: new Date().toLocaleDateString("en-CA"),
    });
    setEditingId(null);
    setFormError("");
    setActiveView("form");
  }

  function openEditForm(approval) {
    if (approval.status === "Approved") return;

    setFormData({ ...approval });
    setEditingId(approval.id);
    setFormError("");
    setActiveView("form");
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function addHistoryEntry(approval, action, note, date) {
    return [
      ...(approval.history || []),
      {
        id: Date.now(),
        action,
        date,
        note,
      },
    ];
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.project ||
      !formData.submittedDate ||
      !formData.description.trim()
    ) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (
      formData.status === "Approved" ||
      formData.status === "Changes Requested"
    ) {
      setFormError(
        "Use the approval decision actions to record an approval or request changes."
      );
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-CA");

    if (formData.submittedDate > currentDate) {
      setFormError("The submission date cannot be in the future.");
      return;
    }

    if (editingId !== null) {
      setApprovals((current) =>
        current.map((approval) => {
          if (approval.id !== editingId) return approval;

          const updated = {
            ...approval,
            ...formData,
            title: formData.title.trim(),
            description: formData.description.trim(),
          };

          const changed =
            approval.title !== updated.title ||
            approval.description !== updated.description ||
            approval.project !== updated.project ||
            approval.itemType !== updated.itemType;

          return changed
            ? {
                ...updated,
                history: addHistoryEntry(
                  updated,
                  "Request updated",
                  "Approval request details were updated.",
                  currentDate
                ),
              }
            : updated;
        })
      );

      setSelectedApprovalId(editingId);
      setActiveView("details");
    } else {
      const newApproval = {
        ...formData,
        id: Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        feedback: "",
        history: [
          {
            id: Date.now() + 1,
            action:
              formData.status === "Pending Review"
                ? "Submitted for approval"
                : "Draft created",
            date: currentDate,
            note:
              formData.status === "Pending Review"
                ? "Work submitted for review."
                : "Approval request saved as a draft.",
          },
        ],
      };

      setApprovals((current) => [newApproval, ...current]);
      setSelectedApprovalId(newApproval.id);
      setActiveView("details");
    }

    setFormError("");
    setEditingId(null);
  }

  function submitForApproval(id) {
    const currentDate = new Date().toLocaleDateString("en-CA");

    setApprovals((current) =>
      current.map((approval) => {
        if (approval.id !== id) return approval;

        if (
          !["Draft", "Changes Requested"].includes(approval.status)
        ) {
          return approval;
        }

        return {
          ...approval,
          status: "Pending Review",
          submittedDate: currentDate,
          feedback: "",
          history: addHistoryEntry(
            approval,
            "Submitted for approval",
            "Work submitted for review.",
            currentDate
          ),
        };
      })
    );

    setDecisionFeedback("");
    setDecisionError("");
  }

  function recordDecision(id, status) {
    if (!["Approved", "Changes Requested"].includes(status)) return;

    const note = decisionFeedback.trim();

    if (status === "Changes Requested" && !note) {
      setDecisionError(
        "Please describe the changes needed before submitting this decision."
      );
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-CA");

    setApprovals((current) =>
      current.map((approval) => {
        if (approval.id !== id) return approval;
        if (approval.status !== "Pending Review") return approval;

        return {
          ...approval,
          status,
          feedback:
            note ||
            (status === "Approved"
              ? "Approved without additional comments."
              : ""),
          history: addHistoryEntry(
            approval,
            status === "Approved" ? "Approved" : "Changes requested",
            note ||
              (status === "Approved"
                ? "Work approved."
                : "Changes requested."),
            currentDate
          ),
        };
      })
    );

    setDecisionFeedback("");
    setDecisionError("");
  }

  function deleteApproval(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this approval request?"
    );

    if (!confirmed) return;

    setApprovals((current) =>
      current.filter((approval) => approval.id !== id)
    );

    if (selectedApprovalId === id) {
      setSelectedApprovalId(null);
      setActiveView("list");
    }
  }

  function backToList() {
    setSelectedApprovalId(null);
    setEditingId(null);
    setFormError("");
    setDecisionError("");
    setDecisionFeedback("");
    setActiveView("list");
  }

  if (activeView === "form") {
    return (
      <section className="approvals-page">
        <button
          className="approvals-back"
          type="button"
          onClick={backToList}
        >
          ← Back to Approvals
        </button>

        <header className="approvals-header">
          <p className="approvals-eyebrow">CLIENT WORKFLOW</p>
          <h1>
            {editingId !== null
              ? "Edit Approval Request"
              : "Create Approval Request"}
          </h1>
          <p className="approvals-subtitle">
            Record the work being submitted and track its review outcome.
          </p>
        </header>

        <form className="approvals-form" onSubmit={handleSubmit}>
          <div className="approvals-form-heading">
            <h2>Request Information</h2>
            <p>Fields marked with * are required.</p>
          </div>

          <div className="approvals-form-grid">
            <label className="approvals-field approvals-field--full">
              Request Title *
              <input
                name="title"
                value={formData.title}
                onChange={handleFieldChange}
                placeholder="e.g. Homepage Wireframes"
                required
              />
            </label>

            <label className="approvals-field">
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

            <label className="approvals-field">
              Work Type *
              <select
                name="itemType"
                value={formData.itemType}
                onChange={handleFieldChange}
              >
                {itemTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="approvals-field">
              Submitted By *
              <input
                name="submittedBy"
                value={formData.submittedBy}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="approvals-field">
              Submission Date *
              <input
                name="submittedDate"
                type="date"
                value={formData.submittedDate}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="approvals-field">
              Request Status *
              <select
                name="status"
                value={formData.status}
                onChange={handleFieldChange}
              >
                <option value="Draft">Draft</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </label>

            <label className="approvals-field approvals-field--full">
              Work Description *
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleFieldChange}
                placeholder="Describe the deliverable being submitted for review."
                required
              />
            </label>
          </div>

          {formError && (
            <p className="approvals-form-error" role="alert">
              {formError}
            </p>
          )}

          <div className="approvals-form-actions">
            <button
              className="approvals-button approvals-button--secondary"
              type="button"
              onClick={backToList}
            >
              Cancel
            </button>

            <button
              className="approvals-button approvals-button--primary"
              type="submit"
            >
              {editingId !== null ? "Save Changes" : "Create Request"}
            </button>
          </div>
        </form>
      </section>
    );
  }

  if (activeView === "details" && selectedApproval) {
    const canSubmit = ["Draft", "Changes Requested"].includes(
      selectedApproval.status
    );

    return (
      <section className="approvals-page">
        <button
          className="approvals-back"
          type="button"
          onClick={backToList}
        >
          ← Back to Approvals
        </button>

        <header className="approvals-header approvals-header--row">
          <div>
            <p className="approvals-eyebrow">APPROVAL DETAILS</p>
            <h1>{selectedApproval.title}</h1>
            <p className="approvals-subtitle">
              {selectedApproval.project}
            </p>
          </div>

          <div className="approvals-detail-actions">
            {selectedApproval.status !== "Approved" && (
              <button
                className="approvals-button approvals-button--secondary"
                type="button"
                onClick={() => openEditForm(selectedApproval)}
              >
                Edit Request
              </button>
            )}

            {canSubmit && (
              <button
                className="approvals-button approvals-button--primary"
                type="button"
                onClick={() => submitForApproval(selectedApproval.id)}
              >
                Submit for Approval
              </button>
            )}

            <button
              className="approvals-button approvals-button--danger"
              type="button"
              onClick={() => deleteApproval(selectedApproval.id)}
            >
              Delete
            </button>
          </div>
        </header>

        <div className="approvals-detail-grid">
          <article className="approvals-detail-card">
            <div className="approvals-detail-card-heading">
              <h2>Submitted Work</h2>
              <span
                className={`approvals-status approvals-status--${getStatusClass(
                  selectedApproval.status
                )}`}
              >
                {selectedApproval.status}
              </span>
            </div>

            <p className="approvals-description">
              {selectedApproval.description}
            </p>

            <div className="approvals-detail-meta">
              <div>
                <span>Project</span>
                <strong>{selectedApproval.project}</strong>
              </div>

              <div>
                <span>Work type</span>
                <strong>{selectedApproval.itemType}</strong>
              </div>

              <div>
                <span>Submitted by</span>
                <strong>{selectedApproval.submittedBy}</strong>
              </div>

              <div>
                <span>Submission date</span>
                <strong>{formatDate(selectedApproval.submittedDate)}</strong>
              </div>
            </div>

            {selectedApproval.feedback && (
              <div className="approvals-feedback">
                <h3>Latest Feedback</h3>
                <p>{selectedApproval.feedback}</p>
              </div>
            )}

            {selectedApproval.status === "Pending Review" && (
              <div className="approvals-decision">
                <h3>Record Review Decision</h3>
                <p>
                  Enter client feedback or a review note before recording
                  the decision.
                </p>

                <label className="approvals-field">
                  Feedback / Review Notes
                  <textarea
                    rows="4"
                    value={decisionFeedback}
                    onChange={(event) => {
                      setDecisionFeedback(event.target.value);
                      setDecisionError("");
                    }}
                    placeholder="Enter approval notes or the changes required."
                  />
                </label>

                {decisionError && (
                  <p className="approvals-form-error" role="alert">
                    {decisionError}
                  </p>
                )}

                <div className="approvals-decision-actions">
                  <button
                    className="approvals-button approvals-button--warning"
                    type="button"
                    onClick={() =>
                      recordDecision(
                        selectedApproval.id,
                        "Changes Requested"
                      )
                    }
                  >
                    Request Changes
                  </button>

                  <button
                    className="approvals-button approvals-button--primary"
                    type="button"
                    onClick={() =>
                      recordDecision(selectedApproval.id, "Approved")
                    }
                  >
                    Approve Work
                  </button>
                </div>
              </div>
            )}
          </article>

          <article className="approvals-detail-card">
            <h2>Approval History</h2>
            <p className="approvals-history-intro">
              Review submissions, decisions, and feedback recorded for this
              request.
            </p>

            {selectedApproval.history.length > 0 ? (
              <ol className="approvals-timeline">
                {selectedApproval.history.map((entry) => (
                  <li key={entry.id}>
                    <span className="approvals-timeline-dot" />
                    <div className="approvals-timeline-content">
                      <strong>{entry.action}</strong>
                      <time>{formatDate(entry.date)}</time>
                      <p>{entry.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="approvals-history-empty">
                No history yet. Submit this request to start tracking its
                review.
              </div>
            )}
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="approvals-page">
      <header className="approvals-header approvals-header--row">
        <div>
          <p className="approvals-eyebrow">CLIENT WORKFLOW</p>
          <h1>Approvals</h1>
          <p className="approvals-subtitle">
            Submit work for review, record decisions, and track client feedback.
          </p>
        </div>

        <button
          className="approvals-button approvals-button--primary"
          type="button"
          onClick={openCreateForm}
        >
          + Create Request
        </button>
      </header>

      <div className="approvals-stats">
        <article className="approvals-stat">
          <span>Total Requests</span>
          <h2>{approvals.length}</h2>
          <p>All recorded approval requests</p>
        </article>

        <article className="approvals-stat">
          <span>Pending Review</span>
          <h2>{pendingCount}</h2>
          <p>Waiting for a decision</p>
        </article>

        <article className="approvals-stat">
          <span>Approved</span>
          <h2>{approvedCount}</h2>
          <p>Accepted deliverables</p>
        </article>

        <article className="approvals-stat">
          <span>Changes Requested</span>
          <h2>{changesRequestedCount}</h2>
          <p>Revisions needed</p>
        </article>
      </div>

      <div className="approvals-summary-strip">
        <div>
          <span>Draft requests</span>
          <strong>{draftCount}</strong>
        </div>
        <div>
          <span>Awaiting a decision</span>
          <strong>{pendingCount}</strong>
        </div>
      </div>

      <div className="approvals-toolbar">
        <div>
          <h2>All Approval Requests</h2>
          <p>Search and filter submitted work.</p>
        </div>

        <div className="approvals-filters">
          <input
            type="search"
            aria-label="Search approval requests"
            placeholder="Search requests or projects..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            aria-label="Filter approval status"
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
            aria-label="Filter approval project"
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

      <div className="approvals-table-wrapper">
        <table className="approvals-table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Project</th>
              <th>Type</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredApprovals.map((approval) => (
              <tr key={approval.id}>
                <td>
                  <strong className="approvals-title">
                    {approval.title}
                  </strong>
                  <span className="approvals-cell-secondary">
                    {approval.submittedBy}
                  </span>
                </td>

                <td>{approval.project}</td>

                <td>{approval.itemType}</td>

                <td>{formatDate(approval.submittedDate)}</td>

                <td>
                  <span
                    className={`approvals-status approvals-status--${getStatusClass(
                      approval.status
                    )}`}
                  >
                    {approval.status}
                  </span>
                </td>

                <td>
                  <div className="approvals-row-actions">
                    <button
                      className="approvals-icon-action"
                      type="button"
                      title="View request"
                      aria-label={`View ${approval.title}`}
                      onClick={() => {
                        setSelectedApprovalId(approval.id);
                        setDecisionFeedback("");
                        setDecisionError("");
                        setActiveView("details");
                      }}
                    >
                      <Icon name="view" />
                    </button>

                    {approval.status !== "Approved" && (
                      <button
                        className="approvals-icon-action"
                        type="button"
                        title="Edit request"
                        aria-label={`Edit ${approval.title}`}
                        onClick={() => openEditForm(approval)}
                      >
                        <Icon name="edit" />
                      </button>
                    )}

                    <button
                      className="approvals-icon-action approvals-icon-action--danger"
                      type="button"
                      title="Delete request"
                      aria-label={`Delete ${approval.title}`}
                      onClick={() => deleteApproval(approval.id)}
                    >
                      <Icon name="delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApprovals.length === 0 && (
          <div className="approvals-empty">
            <h3>No approval requests found</h3>
            <p>
              Try changing your filters, or create a new approval request.
            </p>
            <button
              className="approvals-button approvals-button--primary"
              type="button"
              onClick={openCreateForm}
            >
              Create Request
            </button>
          </div>
        )}
      </div>

      <p className="approvals-results-count">
        Showing {filteredApprovals.length} of {approvals.length} requests
      </p>
    </section>
  );
}