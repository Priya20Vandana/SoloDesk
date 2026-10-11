
import { useState } from "react";
import {
  Users,
  FolderKanban,
  ClipboardCheck,
  Wallet,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  UserPlus,
  FolderPlus,
  FilePlus,
  CalendarDays,
  Activity,
  ArrowRight,
  X,
  Check,
} from "lucide-react";

import "./Dashboard.css";

// ========================================
// MOCK DATA
// ========================================

const mockTasks = [
  {
    id: 1,
    title: "Finalize homepage design",
    client: "Acme Studio",
    dueDate: "2026-10-11",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Prepare project proposal",
    client: "Nova Digital",
    dueDate: "2026-10-12",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: 3,
    title: "Review mobile responsiveness",
    client: "Pixel Works",
    dueDate: "2026-10-13",
    priority: "Low",
    status: "In Progress",
  },
  {
    id: 4,
    title: "Send final project files",
    client: "Bright Labs",
    dueDate: "2026-10-15",
    priority: "High",
    status: "Pending",
  },
];

const mockApprovals = [
  {
    id: 1,
    project: "E-commerce Website",
    client: "Acme Studio",
    submittedDate: "2026-10-09",
    status: "Pending",
  },
  {
    id: 2,
    project: "Brand Identity Design",
    client: "Nova Digital",
    submittedDate: "2026-10-10",
    status: "Pending",
  },
  {
    id: 3,
    project: "Landing Page Redesign",
    client: "Pixel Works",
    submittedDate: "2026-10-08",
    status: "Pending",
  },
];

const mockActivities = [
  {
    id: 1,
    description: "Invoice sent to Acme Studio",
    date: "2026-10-11",
  },
  {
    id: 2,
    description: "Homepage design submitted for approval",
    date: "2026-10-10",
  },
  {
    id: 3,
    description: "New project started for Nova Digital",
    date: "2026-10-09",
  },
  {
    id: 4,
    description: "Payment received from Pixel Works",
    date: "2026-10-08",
  },
];

const mockReminders = [
  {
    id: 1,
    title: "Invoice payment due",
    description: "Acme Studio · ₹25,000",
    dueDate: "2026-10-12",
    type: "Payment",
  },
  {
    id: 2,
    title: "Submit project milestone",
    description: "Nova Digital · Website redesign",
    dueDate: "2026-10-13",
    type: "Deadline",
  },
  {
    id: 3,
    title: "Follow up on approval",
    description: "Pixel Works · Landing page",
    dueDate: "2026-10-14",
    type: "Follow-up",
  },
];

const initialSummary = {
  clients: 12,
  projects: 4,
  outstandingInvoices: 45000,
  invoicesCount: 5,
};

const quickActionConfig = {
  client: {
    title: "New Client",
    description: "Add a client to your business.",
    placeholder: "Client or company name",
    buttonText: "Add Client",
  },
  project: {
    title: "New Project",
    description: "Create a project for a client.",
    placeholder: "Project name",
    buttonText: "Create Project",
  },
  invoice: {
    title: "New Invoice",
    description: "Record a new outstanding invoice.",
    placeholder: "Invoice description",
    buttonText: "Create Invoice",
  },
};

// ========================================
// HELPER FUNCTIONS
// ========================================

function formatDate(dateString) {
  if (!dateString) return "No date";

  return new Date(`${dateString}T12:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPriorityClass(priority) {
  const classes = {
    High: "dashboard__badge--high",
    Medium: "dashboard__badge--medium",
    Low: "dashboard__badge--low",
  };

  return classes[priority] ?? "dashboard__badge--pending";
}

function getStatusClass(status) {
  if (status === "Completed" || status === "Approved") {
    return "dashboard__badge--completed";
  }

  if (status === "In Progress") {
    return "dashboard__badge--progress";
  }

  if (status === "Changes Requested") {
    return "dashboard__badge--changes";
  }

  return "dashboard__badge--pending";
}

// ========================================
// DASHBOARD COMPONENT
// ========================================

function Dashboard() {
  const [tasks, setTasks] = useState(mockTasks);
  const [approvals, setApprovals] = useState(mockApprovals);
  const [activities, setActivities] = useState(mockActivities);
  const [reminders, setReminders] = useState(mockReminders);

  const [summary, setSummary] = useState(initialSummary);

  const [activeAction, setActiveAction] = useState(null);
  const [actionName, setActionName] = useState("");
  const [actionClient, setActionClient] = useState("");
  const [actionAmount, setActionAmount] = useState("");
  const [message, setMessage] = useState("");

  // --------------------------------------
  // TASK ACTIONS
  // --------------------------------------

  function handleCompleteTask(taskId) {
    const selectedTask = tasks.find(
      (task) => task.id === taskId
    );

    if (!selectedTask || selectedTask.status === "Completed") {
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: "Completed" }
          : task
      )
    );

    setActivities((previousActivities) => [
      {
        id: Date.now(),
        description: `Completed task: ${selectedTask.title}`,
        date: new Date().toISOString().slice(0, 10),
      },
      ...previousActivities,
    ]);

    setMessage("Task marked as completed.");
  }

  // --------------------------------------
  // APPROVAL ACTIONS
  // --------------------------------------

  function handleApproval(approvalId, decision) {
    const selectedApproval = approvals.find(
      (approval) => approval.id === approvalId
    );

    if (!selectedApproval) return;

    setApprovals((previousApprovals) =>
      previousApprovals.map((approval) =>
        approval.id === approvalId
          ? { ...approval, status: decision }
          : approval
      )
    );

    setActivities((previousActivities) => [
      {
        id: Date.now(),
        description: `${selectedApproval.project}: ${decision}`,
        date: new Date().toISOString().slice(0, 10),
      },
      ...previousActivities,
    ]);

    setMessage(
      `${selectedApproval.project} marked ${decision.toLowerCase()}.`
    );
  }

  // --------------------------------------
  // QUICK ACTIONS
  // --------------------------------------

  function handleOpenAction(action) {
    setActiveAction(action);
    setActionName("");
    setActionClient("");
    setActionAmount("");
    setMessage("");
  }

  function handleQuickActionSubmit(event) {
    event.preventDefault();

    if (!activeAction || !actionName.trim()) {
      setMessage("Please enter a name or description.");
      return;
    }

    const action = activeAction;
    const today = new Date().toISOString().slice(0, 10);

    if (action === "invoice") {
      const amount = Number(actionAmount);

      if (!Number.isFinite(amount) || amount <= 0) {
        setMessage(
          "Enter a valid invoice amount greater than zero."
        );
        return;
      }

      setSummary((previous) => ({
        ...previous,
        outstandingInvoices:
          previous.outstandingInvoices + amount,
        invoicesCount: previous.invoicesCount + 1,
      }));
    }

    if (action === "client") {
      setSummary((previous) => ({
        ...previous,
        clients: previous.clients + 1,
      }));
    }

    if (action === "project") {
      setSummary((previous) => ({
        ...previous,
        projects: previous.projects + 1,
      }));
    }

    const clientSuffix = actionClient.trim()
      ? ` · ${actionClient.trim()}`
      : "";

    const activityDescription =
      action === "client"
        ? `New client added: ${actionName.trim()}`
        : action === "project"
          ? `New project created: ${actionName.trim()}${clientSuffix}`
          : `New invoice recorded: ${actionName.trim()}${clientSuffix}`;

    setActivities((previousActivities) => [
      {
        id: Date.now(),
        description: activityDescription,
        date: today,
      },
      ...previousActivities,
    ]);

    setActiveAction(null);
    setActionName("");
    setActionClient("");
    setActionAmount("");

    setMessage(
      `${quickActionConfig[action].title} saved locally.`
    );
  }

  function handleDismissReminder(reminderId) {
    setReminders((previousReminders) =>
      previousReminders.filter(
        (reminder) => reminder.id !== reminderId
      )
    );
  }

  // --------------------------------------
  // CALCULATED DASHBOARD DATA
  // --------------------------------------

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "Pending"
  ).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const summaryCards = [
    {
      id: "clients",
      title: "Total Clients",
      value: summary.clients,
      description: "Clients in your business",
      icon: Users,
      color: "blue",
    },
    {
      id: "projects",
      title: "Active Projects",
      value: summary.projects,
      description: "Projects in progress",
      icon: FolderKanban,
      color: "purple",
    },
    {
      id: "approvals",
      title: "Pending Approvals",
      value: pendingApprovals,
      description: "Awaiting a decision",
      icon: ClipboardCheck,
      color: "amber",
    },
    {
      id: "invoices",
      title: "Outstanding Invoices",
      value: formatCurrency(summary.outstandingInvoices),
      description: `${summary.invoicesCount} invoices recorded`,
      icon: Wallet,
      color: "green",
    },
  ];

  // --------------------------------------
  // DASHBOARD UI
  // --------------------------------------

  return (
    <main className="dashboard">
      {/* HEADER */}

      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <span className="dashboard__eyebrow">
            YOUR BUSINESS AT A GLANCE
          </span>

          <h1 className="dashboard__title">
            Welcome back!
          </h1>

          <p className="dashboard__subtitle">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="dashboard__date">
          <CalendarDays size={17} />

          <span>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* FEEDBACK MESSAGE */}

      {message && (
        <div className="dashboard__message" role="status">
          <div className="dashboard__message-content">
            <CheckCircle2 size={19} />
            <span>{message}</span>
          </div>

          <button
            type="button"
            className="dashboard__icon-button"
            onClick={() => setMessage("")}
            aria-label="Dismiss message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* QUICK ACTIONS */}

      <section className="dashboard__section">
        <div className="dashboard__section-header">
          <div>
            <h2 className="dashboard__section-title">
              Quick Actions
            </h2>

            <p className="dashboard__section-description">
              Get things done without leaving your dashboard.
            </p>
          </div>
        </div>

        <div className="dashboard__quick-actions">
          <button
            type="button"
            className="dashboard__quick-action"
            onClick={() => handleOpenAction("client")}
          >
            <span className="dashboard__quick-action-icon">
              <UserPlus size={21} />
            </span>

            <span className="dashboard__quick-action-text">
              <span className="dashboard__quick-action-title">
                New Client
              </span>
              <span className="dashboard__quick-action-description">
                Add a client
              </span>
            </span>

            <ArrowRight
              className="dashboard__quick-action-arrow"
              size={17}
            />
          </button>

          <button
            type="button"
            className="dashboard__quick-action"
            onClick={() => handleOpenAction("project")}
          >
            <span className="dashboard__quick-action-icon">
              <FolderPlus size={21} />
            </span>

            <span className="dashboard__quick-action-text">
              <span className="dashboard__quick-action-title">
                New Project
              </span>
              <span className="dashboard__quick-action-description">
                Start a project
              </span>
            </span>

            <ArrowRight
              className="dashboard__quick-action-arrow"
              size={17}
            />
          </button>

          <button
            type="button"
            className="dashboard__quick-action"
            onClick={() => handleOpenAction("invoice")}
          >
            <span className="dashboard__quick-action-icon">
              <FilePlus size={21} />
            </span>

            <span className="dashboard__quick-action-text">
              <span className="dashboard__quick-action-title">
                New Invoice
              </span>
              <span className="dashboard__quick-action-description">
                Record an invoice
              </span>
            </span>

            <ArrowRight
              className="dashboard__quick-action-arrow"
              size={17}
            />
          </button>
        </div>
      </section>

      {/* QUICK ACTION FORM */}

      {activeAction && (
        <section className="dashboard__form-card">
          <div className="dashboard__section-header">
            <div>
              <h2 className="dashboard__section-title">
                {quickActionConfig[activeAction].title}
              </h2>

              <p className="dashboard__section-description">
                {quickActionConfig[activeAction].description}
              </p>
            </div>

            <button
              type="button"
              className="dashboard__icon-button"
              onClick={() => setActiveAction(null)}
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          <form
            className="dashboard__form"
            onSubmit={handleQuickActionSubmit}
          >
            <div className="dashboard__field">
              <label
                className="dashboard__label"
                htmlFor="action-name"
              >
                {activeAction === "client"
                  ? "Client name"
                  : activeAction === "project"
                    ? "Project name"
                    : "Invoice description"}
              </label>

              <input
                className="dashboard__input"
                id="action-name"
                type="text"
                value={actionName}
                onChange={(event) =>
                  setActionName(event.target.value)
                }
                placeholder={
                  quickActionConfig[activeAction].placeholder
                }
                required
              />
            </div>

            {activeAction !== "client" && (
              <div className="dashboard__field">
                <label
                  className="dashboard__label"
                  htmlFor="action-client"
                >
                  Client name (optional)
                </label>

                <input
                  className="dashboard__input"
                  id="action-client"
                  type="text"
                  value={actionClient}
                  onChange={(event) =>
                    setActionClient(event.target.value)
                  }
                  placeholder="Enter client name"
                />
              </div>
            )}

            {activeAction === "invoice" && (
              <div className="dashboard__field">
                <label
                  className="dashboard__label"
                  htmlFor="action-amount"
                >
                  Invoice amount (₹)
                </label>

                <input
                  className="dashboard__input"
                  id="action-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={actionAmount}
                  onChange={(event) =>
                    setActionAmount(event.target.value)
                  }
                  placeholder="Enter amount"
                  required
                />
              </div>
            )}

            <div className="dashboard__form-actions">
              <button
                type="submit"
                className="dashboard__button dashboard__button--primary"
              >
                <Check size={16} />
                {quickActionConfig[activeAction].buttonText}
              </button>

              <button
                type="button"
                className="dashboard__button dashboard__button--secondary"
                onClick={() => setActiveAction(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* BUSINESS SUMMARY */}

      <section className="dashboard__section">
        <div className="dashboard__section-header">
          <div>
            <h2 className="dashboard__section-title">
              Business Overview
            </h2>

            <p className="dashboard__section-description">
              A snapshot of your freelance business.
            </p>
          </div>
        </div>

        <div className="dashboard__summary-grid">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                className="dashboard__summary-card"
                key={card.id}
              >
                <div className="dashboard__summary-top">
                  <span
                    className={`dashboard__summary-icon dashboard__summary-icon--${card.color}`}
                  >
                    <Icon size={22} />
                  </span>
                </div>

                <div>
                  <p className="dashboard__summary-label">
                    {card.title}
                  </p>

                  <p className="dashboard__summary-value">
                    {card.value}
                  </p>
                </div>

                <p className="dashboard__summary-description">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* TASKS AND APPROVALS */}

      <div className="dashboard__content-grid">
        {/* TASKS */}

        <section className="dashboard__panel">
          <div className="dashboard__panel-header">
            <div className="dashboard__panel-heading">
              <h2 className="dashboard__panel-title">
                Upcoming Tasks
              </h2>

              <p className="dashboard__panel-description">
                Keep your work moving forward.
              </p>
            </div>

            <span className="dashboard__badge dashboard__badge--progress">
              {tasks.length - completedTasks} remaining
            </span>
          </div>

          <div className="dashboard__task-progress">
            <div className="dashboard__task-progress-text">
              <span>Overall completion</span>
              <span>{completionPercentage}%</span>
            </div>

            <div
              className="dashboard__progress"
              role="progressbar"
              aria-label="Task completion"
              aria-valuenow={completionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="dashboard__progress-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="dashboard__empty">
              <Circle
                className="dashboard__empty-icon"
                size={28}
              />
              <h3 className="dashboard__empty-title">
                No tasks yet
              </h3>
              <p className="dashboard__empty-description">
                Your upcoming tasks will appear here.
              </p>
            </div>
          ) : (
            <ul className="dashboard__list">
              {tasks.map((task) => (
                <li
                  className="dashboard__task"
                  key={task.id}
                >
                  <div className="dashboard__task-main">
                    <button
                      type="button"
                      className={`dashboard__task-check ${
                        task.status === "Completed"
                          ? "dashboard__task-check--completed"
                          : ""
                      }`}
                      onClick={() =>
                        handleCompleteTask(task.id)
                      }
                      disabled={task.status === "Completed"}
                      aria-label={`Complete ${task.title}`}
                      title={
                        task.status === "Completed"
                          ? "Task completed"
                          : "Mark task complete"
                      }
                    >
                      {task.status === "Completed" && (
                        <Check size={13} />
                      )}
                    </button>

                    <div className="dashboard__task-content">
                      <h3
                        className={`dashboard__task-title ${
                          task.status === "Completed"
                            ? "dashboard__task-title--completed"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="dashboard__task-client">
                        {task.client}
                      </p>
                    </div>
                  </div>

                  <div className="dashboard__task-meta">
                    <span className="dashboard__task-date">
                      <CalendarDays size={14} />
                      {formatDate(task.dueDate)}
                    </span>

                    <span
                      className={`dashboard__badge ${getPriorityClass(task.priority)}`}
                    >
                      {task.priority} priority
                    </span>
                  </div>

                  <div>
                    <span
                      className={`dashboard__badge ${getStatusClass(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* APPROVALS */}

        <section className="dashboard__panel">
          <div className="dashboard__panel-header">
            <div className="dashboard__panel-heading">
              <h2 className="dashboard__panel-title">
                Pending Approvals
              </h2>

              <p className="dashboard__panel-description">
                Work that needs your attention.
              </p>
            </div>

            <span className="dashboard__badge dashboard__badge--pending">
              {pendingApprovals} pending
            </span>
          </div>

          {approvals.length === 0 ? (
            <div className="dashboard__empty">
              <CheckCircle2
                className="dashboard__empty-icon"
                size={28}
              />
              <h3 className="dashboard__empty-title">
                All caught up!
              </h3>
              <p className="dashboard__empty-description">
                There are no approval records to review.
              </p>
            </div>
          ) : (
            <ul className="dashboard__list">
              {approvals.map((approval) => (
                <li
                  className="dashboard__approval"
                  key={approval.id}
                >
                  <div className="dashboard__approval-top">
                    <div className="dashboard__approval-content">
                      <h3 className="dashboard__approval-title">
                        {approval.project}
                      </h3>

                      <p className="dashboard__approval-client">
                        {approval.client}
                      </p>

                      <p className="dashboard__approval-date">
                        Submitted {formatDate(approval.submittedDate)}
                      </p>
                    </div>

                    <span
                      className={`dashboard__badge ${getStatusClass(approval.status)}`}
                    >
                      {approval.status}
                    </span>
                  </div>

                  {approval.status === "Pending" && (
                    <div className="dashboard__approval-actions">
                      <button
                        type="button"
                        className="dashboard__button dashboard__button--success"
                        onClick={() =>
                          handleApproval(
                            approval.id,
                            "Approved"
                          )
                        }
                      >
                        <CheckCircle2 size={15} />
                        Approve
                      </button>

                      <button
                        type="button"
                        className="dashboard__button dashboard__button--warning"
                        onClick={() =>
                          handleApproval(
                            approval.id,
                            "Changes Requested"
                          )
                        }
                      >
                        <AlertCircle size={15} />
                        Request Changes
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ACTIVITY AND REMINDERS */}

      <div className="dashboard__content-grid">
        {/* RECENT ACTIVITY */}

        <section className="dashboard__panel">
          <div className="dashboard__panel-header">
            <div className="dashboard__panel-heading">
              <h2 className="dashboard__panel-title">
                Recent Activity
              </h2>

              <p className="dashboard__panel-description">
                A timeline of your latest business updates.
              </p>
            </div>

            <Activity size={20} />
          </div>

          {activities.length === 0 ? (
            <div className="dashboard__empty">
              <Activity
                className="dashboard__empty-icon"
                size={28}
              />
              <h3 className="dashboard__empty-title">
                No recent activity
              </h3>
              <p className="dashboard__empty-description">
                New business updates will appear here.
              </p>
            </div>
          ) : (
            <ul className="dashboard__activity">
              {activities.slice(0, 6).map((activity) => (
                <li
                  className="dashboard__activity-item"
                  key={activity.id}
                >
                  <span className="dashboard__activity-icon">
                    <Activity size={18} />
                  </span>

                  <div className="dashboard__activity-content">
                    <p className="dashboard__activity-description">
                      {activity.description}
                    </p>

                    <p className="dashboard__activity-date">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className="dashboard__button dashboard__button--secondary"
            onClick={() =>
              setMessage(
                "You're viewing the latest activity available in this demo."
              )
            }
          >
            View Activity
            <ArrowRight size={15} />
          </button>
        </section>

        {/* DEADLINES AND REMINDERS */}

        <section className="dashboard__panel">
          <div className="dashboard__panel-header">
            <div className="dashboard__panel-heading">
              <h2 className="dashboard__panel-title">
                Deadlines & Reminders
              </h2>

              <p className="dashboard__panel-description">
                Important dates to keep on your radar.
              </p>
            </div>

            <CalendarDays size={20} />
          </div>

          {reminders.length === 0 ? (
            <div className="dashboard__empty">
              <CheckCircle2
                className="dashboard__empty-icon"
                size={28}
              />
              <h3 className="dashboard__empty-title">
                You're all caught up
              </h3>
              <p className="dashboard__empty-description">
                No reminders remain in this demo.
              </p>
            </div>
          ) : (
            <ul className="dashboard__list">
              {reminders.map((reminder) => (
                <li
                  className="dashboard__reminder"
                  key={reminder.id}
                >
                  <span className="dashboard__reminder-icon">
                    {reminder.type === "Payment" ? (
                      <Wallet size={19} />
                    ) : reminder.type === "Deadline" ? (
                      <Clock size={19} />
                    ) : (
                      <AlertCircle size={19} />
                    )}
                  </span>

                  <div className="dashboard__reminder-content">
                    <h3 className="dashboard__reminder-title">
                      {reminder.title}
                    </h3>

                    <p className="dashboard__reminder-description">
                      {reminder.description}
                    </p>

                    <span className="dashboard__reminder-date">
                      <CalendarDays size={13} />
                      Due {formatDate(reminder.dueDate)}
                    </span>

                    <span className="dashboard__badge dashboard__badge--pending">
                      {reminder.type}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="dashboard__icon-button"
                    onClick={() =>
                      handleDismissReminder(reminder.id)
                    }
                    aria-label={`Dismiss ${reminder.title}`}
                    title="Dismiss reminder"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
