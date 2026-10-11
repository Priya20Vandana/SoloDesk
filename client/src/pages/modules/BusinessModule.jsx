
import { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  X,
  Users,
  UserRound,
  Handshake,
  FolderKanban,
  ListTodo,
  Flag,
  ClipboardCheck,
  Receipt,
  CreditCard,
  FileText,
  CalendarDays,
} from "lucide-react";
import "./BusinessModule.css";

const moduleConfig = {
  Clients: {
    title: "Clients",
    description: "Manage your client relationships and contact details.",
    singular: "Client",
    icon: Users,
    columns: ["Name", "Company", "Email", "Status"],
    fields: [
      ["name", "Full name", "text", true],
      ["company", "Company", "text", true],
      ["email", "Email address", "email", true],
      ["phone", "Phone number", "text", false],
      ["status", "Status", "select", true, ["Active", "Inactive"]],
      ["notes", "Notes", "textarea", false],
    ],
    initial: [
      { id: 1, name: "Olivia Martin", company: "Bright Studio", email: "olivia@brightstudio.com", phone: "+91 98765 43210", status: "Active", notes: "Branding and website client." },
      { id: 2, name: "James Wilson", company: "Wilson Consulting", email: "james@wilsonconsulting.com", phone: "+91 98765 12345", status: "Active", notes: "Ongoing design support." },
      { id: 3, name: "Sophia Chen", company: "Chen Digital", email: "sophia@chendigital.com", phone: "+91 99887 77665", status: "Inactive", notes: "Previous website project." },
    ],
  },
  Leads: {
    title: "Leads",
    description: "Track potential clients and follow up on opportunities.",
    singular: "Lead",
    icon: UserRound,
    columns: ["Name", "Company", "Source", "Status"],
    fields: [
      ["name", "Full name", "text", true],
      ["company", "Company", "text", true],
      ["email", "Email address", "email", true],
      ["phone", "Phone number", "text", false],
      ["source", "Lead source", "select", true, ["Website", "Referral", "LinkedIn", "Social media", "Other"]],
      ["value", "Potential value (₹)", "number", false],
      ["status", "Status", "select", true, ["New", "Contacted", "Qualified", "Lost", "Converted"]],
      ["notes", "Notes", "textarea", false],
    ],
    initial: [
      { id: 11, name: "Daniel Brown", company: "Brown Creative", email: "daniel@browncreative.com", source: "Website", value: 45000, status: "New", notes: "Interested in a business website." },
      { id: 12, name: "Ava Patel", company: "Patel Ventures", email: "ava@patelventures.com", source: "Referral", value: 65000, status: "Contacted", notes: "Follow up about requirements." },
      { id: 13, name: "Noah Garcia", company: "Garcia Media", email: "noah@garciamedia.com", source: "LinkedIn", value: 85000, status: "Qualified", notes: "Qualified for branding work." },
    ],
  },
  "Deals & Proposals": {
    title: "Deals & Proposals",
    description: "Manage opportunities, proposals, pricing, and agreements.",
    singular: "Deal",
    icon: Handshake,
    columns: ["Deal", "Client", "Value", "Deadline", "Status"],
    fields: [
      ["name", "Deal name", "text", true],
      ["client", "Client", "text", true],
      ["value", "Deal value (₹)", "number", true],
      ["deadline", "Deadline", "date", false],
      ["paymentTerms", "Payment terms", "text", false],
      ["status", "Status", "select", true, ["Draft", "Proposal Sent", "Negotiation", "Accepted", "Rejected"]],
      ["notes", "Scope and notes", "textarea", false],
    ],
    initial: [
      { id: 21, name: "Website Redesign", client: "Bright Studio", value: 85000, deadline: "2026-11-15", paymentTerms: "50% upfront, 50% on completion", status: "Proposal Sent", notes: "Website redesign and responsive layouts." },
      { id: 22, name: "Brand Identity", client: "Wilson Consulting", value: 45000, deadline: "2026-11-20", paymentTerms: "50% upfront, 50% on delivery", status: "Negotiation", notes: "Logo and brand guidelines." },
    ],
  },
  Projects: {
    title: "Projects",
    description: "Organise client work, deadlines, and project progress.",
    singular: "Project",
    icon: FolderKanban,
    columns: ["Project", "Client", "Deadline", "Progress", "Status"],
    fields: [
      ["name", "Project name", "text", true],
      ["client", "Client", "text", true],
      ["startDate", "Start date", "date", false],
      ["deadline", "Deadline", "date", false],
      ["progress", "Progress (%)", "number", true],
      ["status", "Status", "select", true, ["Planning", "In Progress", "On Hold", "Completed"]],
      ["notes", "Description", "textarea", false],
    ],
    initial: [
      { id: 31, name: "Website Redesign", client: "Bright Studio", startDate: "2026-10-01", deadline: "2026-11-15", progress: 65, status: "In Progress", notes: "Redesign the company website." },
      { id: 32, name: "Brand Identity", client: "Wilson Consulting", startDate: "2026-10-05", deadline: "2026-11-20", progress: 25, status: "In Progress", notes: "Create a new brand identity." },
    ],
  },
  Tasks: {
    title: "Tasks",
    description: "Track individual tasks, priorities, and deadlines.",
    singular: "Task",
    icon: ListTodo,
    columns: ["Task", "Project", "Priority", "Due date", "Status"],
    fields: [
      ["name", "Task name", "text", true],
      ["project", "Project", "text", true],
      ["assignee", "Assignee", "text", false],
      ["dueDate", "Due date", "date", false],
      ["priority", "Priority", "select", true, ["Low", "Medium", "High"]],
      ["status", "Status", "select", true, ["To Do", "In Progress", "Completed"]],
      ["notes", "Description", "textarea", false],
    ],
    initial: [
      { id: 41, name: "Create homepage wireframes", project: "Website Redesign", assignee: "You", dueDate: "2026-10-15", priority: "High", status: "In Progress", notes: "Prepare initial homepage layouts." },
      { id: 42, name: "Prepare logo concepts", project: "Brand Identity", assignee: "You", dueDate: "2026-10-18", priority: "Medium", status: "To Do", notes: "Explore three visual directions." },
    ],
  },
  Milestones: {
    title: "Milestones",
    description: "Track major deliverables and project checkpoints.",
    singular: "Milestone",
    icon: Flag,
    columns: ["Milestone", "Project", "Due date", "Status"],
    fields: [
      ["name", "Milestone name", "text", true],
      ["project", "Project", "text", true],
      ["dueDate", "Due date", "date", false],
      ["amount", "Milestone amount (₹)", "number", false],
      ["status", "Status", "select", true, ["Upcoming", "In Progress", "Submitted", "Completed"]],
      ["notes", "Deliverable details", "textarea", false],
    ],
    initial: [
      { id: 51, name: "Wireframes Approved", project: "Website Redesign", dueDate: "2026-10-20", amount: 20000, status: "In Progress", notes: "Homepage and key page wireframes." },
      { id: 52, name: "Logo Concepts Delivered", project: "Brand Identity", dueDate: "2026-10-25", amount: 15000, status: "Upcoming", notes: "Present three logo concepts." },
    ],
  },
  Approvals: {
    title: "Approvals",
    description: "Review deliverables, record decisions, and manage revisions.",
    singular: "Approval",
    icon: ClipboardCheck,
    columns: ["Submission", "Project", "Submitted date", "Status"],
    fields: [
      ["name", "Submission title", "text", true],
      ["project", "Project", "text", true],
      ["submittedDate", "Submitted date", "date", false],
      ["status", "Decision", "select", true, ["Pending", "Approved", "Changes Requested", "Rejected"]],
      ["feedback", "Feedback or revision notes", "textarea", false],
    ],
    initial: [
      { id: 61, name: "Homepage Wireframes", project: "Website Redesign", submittedDate: "2026-10-10", status: "Pending", feedback: "" },
      { id: 62, name: "Initial Logo Concepts", project: "Brand Identity", submittedDate: "2026-10-08", status: "Changes Requested", feedback: "Please explore a simpler icon." },
    ],
  },
  Invoices: {
    title: "Invoices",
    description: "Create invoices and monitor due dates and outstanding balances.",
    singular: "Invoice",
    icon: Receipt,
    columns: ["Invoice", "Client", "Amount", "Due date", "Status"],
    fields: [
      ["name", "Invoice number", "text", true],
      ["client", "Client", "text", true],
      ["amount", "Invoice amount (₹)", "number", true],
      ["paid", "Amount received (₹)", "number", true],
      ["issueDate", "Issue date", "date", false],
      ["dueDate", "Due date", "date", false],
      ["status", "Status", "select", true, ["Draft", "Sent", "Paid", "Overdue"]],
      ["notes", "Description", "textarea", false],
    ],
    initial: [
      { id: 71, name: "INV-001", client: "Bright Studio", amount: 40000, paid: 20000, issueDate: "2026-10-01", dueDate: "2026-10-20", status: "Sent", notes: "Website project milestone payment." },
      { id: 72, name: "INV-002", client: "Wilson Consulting", amount: 25000, paid: 25000, issueDate: "2026-09-20", dueDate: "2026-10-05", status: "Paid", notes: "Brand discovery phase." },
    ],
  },
  Payments: {
    title: "Payments",
    description: "Review received payments and track payment records.",
    singular: "Payment",
    icon: CreditCard,
    columns: ["Reference", "Client", "Amount", "Date", "Method"],
    fields: [
      ["name", "Payment reference", "text", true],
      ["client", "Client", "text", true],
      ["invoice", "Invoice number", "text", true],
      ["amount", "Amount received (₹)", "number", true],
      ["paymentDate", "Payment date", "date", true],
      ["method", "Payment method", "select", true, ["Bank Transfer", "UPI", "Card", "Cash", "Other"]],
      ["status", "Status", "select", true, ["Received", "Pending", "Failed"]],
      ["notes", "Notes", "textarea", false],
    ],
    initial: [
      { id: 81, name: "PAY-001", client: "Bright Studio", invoice: "INV-001", amount: 20000, paymentDate: "2026-10-05", method: "Bank Transfer", status: "Received", notes: "First milestone payment." },
      { id: 82, name: "PAY-002", client: "Wilson Consulting", invoice: "INV-002", amount: 25000, paymentDate: "2026-10-02", method: "UPI", status: "Received", notes: "Invoice settled." },
    ],
  },
};

const emptyRecord = (config) =>
  Object.fromEntries(config.fields.map(([key]) => [key, ""]));

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function statusClass(value) {
  return String(value || "unknown")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function displayValue(record, field) {
  const value = record[field];

  if (["amount", "value", "paid"].includes(field)) {
    return money(value);
  }

  if (field === "progress") {
    return `${Number(value) || 0}%`;
  }

  return value || "—";
}

export default function BusinessModule({ activePage }) {
  const config = moduleConfig[activePage];

  const [recordsByModule, setRecordsByModule] = useState(() =>
    Object.fromEntries(
      Object.entries(moduleConfig).map(([key, value]) => [
        key,
        value.initial.map((item) => ({ ...item })),
      ])
    )
  );

  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");

  if (!config) {
    return (
      <main className="business-page">
        <h1>Page not found</h1>
        <p>This module has not been configured yet.</p>
      </main>
    );
  }

  const records = recordsByModule[activePage] || [];
  const Icon = config.icon;
  const statusField = config.fields.find(([key]) => key === "status");
  const statusOptions = statusField?.[4] || [];
  const selectedRecord = records.find((item) => item.id === selectedId);

  const filteredRecords = records.filter((record) => {
    const matchesSearch = Object.values(record).some((value) =>
      String(value ?? "").toLowerCase().includes(search.toLowerCase())
    );

    const matchesFilter =
      filter === "All" || record.status === filter;

    return matchesSearch && matchesFilter;
  });

  function updateRecords(updater) {
    setRecordsByModule((current) => ({
      ...current,
      [activePage]: updater(current[activePage] || []),
    }));
  }

  function openCreate() {
    setForm(emptyRecord(config));
    setEditingId(null);
    setSelectedId(null);
    setView("form");
    setNotice("");
  }

  function openEdit(record) {
    setForm({ ...emptyRecord(config), ...record });
    setEditingId(record.id);
    setSelectedId(record.id);
    setView("form");
    setNotice("");
  }

  function openDetails(record) {
    setSelectedId(record.id);
    setView("details");
    setNotice("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const record = {
      ...form,
      id: editingId ?? Date.now(),
    };

    updateRecords((current) =>
      editingId
        ? current.map((item) =>
            item.id === editingId ? record : item
          )
        : [record, ...current]
    );

    setSelectedId(record.id);
    setEditingId(null);
    setView("details");
    setNotice(
      `${config.singular} ${editingId ? "updated" : "created"} successfully.`
    );
  }

  function deleteRecord(record) {
    if (!window.confirm(`Delete "${record.name}"?`)) return;

    updateRecords((current) =>
      current.filter((item) => item.id !== record.id)
    );

    setSelectedId(null);
    setView("list");
    setNotice(`${config.singular} deleted.`);
  }

  function updateStatus(record, nextStatus) {
    updateRecords((current) =>
      current.map((item) =>
        item.id === record.id
          ? { ...item, status: nextStatus }
          : item
      )
    );
    setNotice("Status updated.");
  }

  function getPrimaryName(record) {
    return record.name || record.client || "Untitled";
  }

  const amountTotal = records.reduce(
    (sum, record) => sum + (Number(record.amount) || Number(record.value) || 0),
    0
  );

  const statusCount = statusField
    ? records.filter((record) =>
        ["Active", "Qualified", "Accepted", "In Progress", "Received", "Paid", "Approved"].includes(record.status)
      ).length
    : 0;

  return (
    <main className="business-page">
      <header className="business-header">
        <div>
          <p className="business-eyebrow">SOLODESK WORKSPACE</p>
          <h1>{config.title}</h1>
          <p className="business-subtitle">{config.description}</p>
        </div>

        {view === "list" && (
          <button
            className="business-button business-button--primary"
            onClick={openCreate}
          >
            <Plus size={18} />
            New {config.singular}
          </button>
        )}
      </header>

      {notice && (
        <div className="business-notice">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}

      {view === "list" && (
        <>
          <section className="business-summary">
            <article className="business-summary-card">
              <span className="business-summary-icon">
                <Icon size={22} />
              </span>
              <div>
                <span>Total records</span>
                <strong>{records.length}</strong>
              </div>
            </article>

            <article className="business-summary-card">
              <span className="business-summary-icon business-summary-icon--green">
                <ClipboardCheck size={22} />
              </span>
              <div>
                <span>Active / completed</span>
                <strong>{statusCount}</strong>
              </div>
            </article>

            <article className="business-summary-card">
              <span className="business-summary-icon business-summary-icon--purple">
                <FileText size={22} />
              </span>
              <div>
                <span>Total value</span>
                <strong>{money(amountTotal)}</strong>
              </div>
            </article>
          </section>

          <section className="business-card">
            <div className="business-toolbar">
              <div>
                <h2>All {config.title}</h2>
                <p>{filteredRecords.length} records</p>
              </div>

              <div className="business-controls">
                <label className="business-search">
                  <Search size={18} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={`Search ${config.title.toLowerCase()}...`}
                  />
                </label>

                {statusOptions.length > 0 && (
                  <select
                    className="business-select"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    aria-label="Filter by status"
                  >
                    <option value="All">All statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {filteredRecords.length ? (
              <div className="business-table-wrap">
                <table className="business-table">
                  <thead>
                    <tr>
                      {config.columns.map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id}>
                        {config.columns.map((column, index) => {
                          const keys = config.fields.map(([key]) => key);
                          const field = keys[index] || keys[0];

                          const columnField = {
                            Name: "name",
                            Deal: "name",
                            Project: "name",
                            Task: "name",
                            Milestone: "name",
                            Submission: "name",
                            Invoice: "name",
                            Reference: "name",
                            Company: "company",
                            Client: "client",
                            Email: "email",
                            Source: "source",
                            Value: "value",
                            "Potential value": "value",
                            "Due date": "dueDate",
                            Deadline: "deadline",
                            "Submitted date": "submittedDate",
                            "Payment date": "paymentDate",
                            Date: "paymentDate",
                            Method: "method",
                            Priority: "priority",
                            Progress: "progress",
                            Status: "status",
                          }[column] || field;

                          let value = record[columnField];

                          if (column === "Value" || column === "Potential value" || column === "Amount") {
                            value = money(value);
                          } else if (column === "Progress") {
                            value = `${Number(value) || 0}%`;
                          } else if (!value) {
                            value = "—";
                          }

                          return (
                            <td key={column}>
                              {column === "Status" ? (
                                <span
                                  className={`business-status business-status--${statusClass(value)}`}
                                >
                                  {value}
                                </span>
                              ) : column === "Priority" ? (
                                <span
                                  className={`business-status business-status--${statusClass(value)}`}
                                >
                                  {value}
                                </span>
                              ) : (
                                value
                              )}
                            </td>
                          );
                        })}

                        <td>
                          <div className="business-actions">
                            <button
                              title="View details"
                              aria-label={`View ${getPrimaryName(record)}`}
                              onClick={() => openDetails(record)}
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              title="Edit"
                              aria-label={`Edit ${getPrimaryName(record)}`}
                              onClick={() => openEdit(record)}
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              title="Delete"
                              aria-label={`Delete ${getPrimaryName(record)}`}
                              onClick={() => deleteRecord(record)}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="business-empty">
                <Icon size={36} />
                <h3>No records found</h3>
                <p>Try another search or create a new record.</p>
                <button
                  className="business-button business-button--secondary"
                  onClick={openCreate}
                >
                  <Plus size={17} />
                  New {config.singular}
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {view === "form" && (
        <section className="business-card business-form-card">
          <button
            className="business-back"
            onClick={() => setView(editingId ? "details" : "list")}
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <h2>{editingId ? "Edit" : "Create"} {config.singular}</h2>
          <p className="business-form-description">
            Complete the details below.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="business-form-grid">
              {config.fields.map(([key, label, type, required, options]) => (
                <label
                  className={`business-field ${type === "textarea" ? "business-field--full" : ""}`}
                  key={key}
                >
                  <span>{label}{required ? " *" : ""}</span>

                  {type === "select" ? (
                    <select
                      value={form[key] ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      required={required}
                    >
                      <option value="">Select...</option>
                      {options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : type === "textarea" ? (
                    <textarea
                      value={form[key] ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      rows={4}
                    />
                  ) : (
                    <input
                      type={type}
                      value={form[key] ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      min={type === "number" ? 0 : undefined}
                      required={required}
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="business-form-actions">
              <button
                type="button"
                className="business-button business-button--secondary"
                onClick={() => setView(editingId ? "details" : "list")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="business-button business-button--primary"
              >
                {editingId ? "Save changes" : `Create ${config.singular}`}
              </button>
            </div>
          </form>
        </section>
      )}

      {view === "details" && selectedRecord && (
        <section className="business-card business-details">
          <button
            className="business-back"
            onClick={() => setView("list")}
          >
            <ArrowLeft size={17} />
            Back to {config.title}
          </button>

          <div className="business-details-heading">
            <span className="business-summary-icon">
              <Icon size={25} />
            </span>
            <div>
              <h2>{getPrimaryName(selectedRecord)}</h2>
              <p>{selectedRecord.company || selectedRecord.client || selectedRecord.project || config.singular}</p>
              {selectedRecord.status && (
                <span className={`business-status business-status--${statusClass(selectedRecord.status)}`}>
                  {selectedRecord.status}
                </span>
              )}
            </div>
          </div>

          <div className="business-detail-grid">
            {config.fields.map(([key, label]) => (
              <article className="business-detail-item" key={key}>
                <span>{label}</span>
                <strong>
                  {key === "amount" || key === "value" || key === "paid"
                    ? money(selectedRecord[key])
                    : key === "progress"
                    ? `${Number(selectedRecord[key]) || 0}%`
                    : selectedRecord[key] || "Not provided"}
                </strong>
              </article>
            ))}
          </div>

          {statusOptions.length > 0 && (
            <div className="business-status-editor">
              <label htmlFor="business-status-update">Update status</label>
              <select
                id="business-status-update"
                value={selectedRecord.status || ""}
                onChange={(event) =>
                  updateStatus(selectedRecord, event.target.value)
                }
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          )}

          <div className="business-form-actions">
            <button
              className="business-button business-button--danger"
              onClick={() => deleteRecord(selectedRecord)}
            >
              <Trash2 size={17} />
              Delete
            </button>
            <button
              className="business-button business-button--primary"
              onClick={() => openEdit(selectedRecord)}
            >
              <Pencil size={17} />
              Edit {config.singular}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
