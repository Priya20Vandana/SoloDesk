
import { useState } from "react";
import {
  UserRoundSearch,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  X,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  IndianRupee,
  ArrowRight,
  Users,
} from "lucide-react";
import "./Leads.css";

const initialLeads = [
  {
    id: 101,
    name: "Daniel Brown",
    company: "Brown Creative",
    email: "daniel@browncreative.com",
    phone: "+91 91234 56789",
    source: "Website",
    value: "45000",
    status: "New",
    followUp: "2026-10-15",
    notes: "Interested in a new business website.",
  },
  {
    id: 102,
    name: "Ava Patel",
    company: "Patel Ventures",
    email: "ava@patelventures.com",
    phone: "+91 99888 12345",
    source: "Referral",
    value: "65000",
    status: "Contacted",
    followUp: "2026-10-13",
    notes: "Discuss project requirements and timeline.",
  },
  {
    id: 103,
    name: "Noah Garcia",
    company: "Garcia Media",
    email: "noah@garciamedia.com",
    phone: "+91 98765 98765",
    source: "LinkedIn",
    value: "85000",
    status: "Qualified",
    followUp: "2026-10-16",
    notes: "Qualified for a branding project.",
  },
  {
    id: 104,
    name: "Mia Thompson",
    company: "Thompson Retail",
    email: "mia@thompsonretail.com",
    phone: "+91 97654 32109",
    source: "Social media",
    value: "30000",
    status: "Lost",
    followUp: "",
    notes: "Budget was not suitable at this time.",
  },
];

const emptyLead = {
  name: "",
  company: "",
  email: "",
  phone: "",
  source: "Website",
  value: "",
  status: "New",
  followUp: "",
  notes: "",
};

const statuses = ["New", "Contacted", "Qualified", "Lost"];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Leads() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [view, setView] = useState("list");
  const [form, setForm] = useState(emptyLead);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState("");

  const selectedLead = leads.find((lead) => lead.id === selectedId);

  const filteredLeads = leads.filter((lead) => {
    const query = search.toLowerCase();

    const matchesSearch = [
      lead.name,
      lead.company,
      lead.email,
    ].some((value) => value.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All" || lead.status === statusFilter;

    const matchesSource =
      sourceFilter === "All" || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const qualifiedCount = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  const activePipeline = leads
    .filter((lead) => ["New", "Contacted", "Qualified"].includes(lead.status))
    .reduce((total, lead) => total + (Number(lead.value) || 0), 0);

  const qualifiedValue = leads
    .filter((lead) => lead.status === "Qualified")
    .reduce((total, lead) => total + (Number(lead.value) || 0), 0);

  function openCreateForm() {
    setForm({ ...emptyLead });
    setEditingId(null);
    setView("form");
    setNotice("");
  }

  function openEditForm(lead) {
    setForm({ ...lead });
    setEditingId(lead.id);
    setSelectedId(lead.id);
    setView("form");
    setNotice("");
  }

  function openDetails(lead) {
    setSelectedId(lead.id);
    setView("details");
    setNotice("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const duplicateEmail = leads.some(
      (lead) =>
        lead.email.toLowerCase() === form.email.trim().toLowerCase() &&
        lead.id !== editingId
    );

    if (duplicateEmail) {
      setNotice("A lead with this email address already exists.");
      return;
    }

    const savedLead = {
      ...form,
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      value: String(Math.max(0, Number(form.value) || 0)),
    };

    if (editingId) {
      setLeads((current) =>
        current.map((lead) =>
          lead.id === editingId ? savedLead : lead
        )
      );
      setNotice("Lead updated successfully.");
    } else {
      setLeads((current) => [savedLead, ...current]);
      setNotice("Lead added successfully.");
    }

    setSelectedId(savedLead.id);
    setEditingId(null);
    setView("details");
  }

  function handleDelete(lead) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${lead.name}?`
    );

    if (!confirmed) return;

    setLeads((current) =>
      current.filter((item) => item.id !== lead.id)
    );

    setSelectedId(null);
    setView("list");
    setNotice("Lead deleted successfully.");
  }

  function updateStatus(lead, status) {
    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id ? { ...item, status } : item
      )
    );
    setNotice(`Lead status updated to ${status}.`);
  }

  function convertLead(lead) {
    const confirmed = window.confirm(
      `Convert ${lead.name} into a client?`
    );

    if (!confirmed) return;

    // Temporary UI-stage behaviour:
    // mark the lead as Converted. Connecting this action to the
    // Clients data will be implemented using shared state.
    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? { ...item, status: "Converted" }
          : item
      )
    );

    setNotice(
      "Lead marked as converted. Shared client creation will be connected next."
    );
  }

  function backToList() {
    setView("list");
    setEditingId(null);
    setNotice("");
  }

  return (
    <main className="leads-page">
      <header className="leads-header">
        <div>
          <p className="leads-eyebrow">SALES PIPELINE</p>
          <h1>Leads</h1>
          <p className="leads-subtitle">
            Track potential clients, manage follow-ups, and grow your pipeline.
          </p>
        </div>

        {view === "list" && (
          <button
            className="leads-button leads-button--primary"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            Add Lead
          </button>
        )}
      </header>

      {notice && (
        <div className="leads-notice" role="status">
          <span>{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {view === "list" && (
        <>
          <section className="leads-stats">
            <article className="leads-stat">
              <span className="leads-stat__icon leads-stat__icon--blue">
                <UserRoundSearch size={22} />
              </span>
              <div>
                <p>Total Leads</p>
                <h2>{leads.length}</h2>
                <span>All potential clients</span>
              </div>
            </article>

            <article className="leads-stat">
              <span className="leads-stat__icon leads-stat__icon--green">
                <Users size={22} />
              </span>
              <div>
                <p>Qualified Leads</p>
                <h2>{qualifiedCount}</h2>
                <span>Ready for the next step</span>
              </div>
            </article>

            <article className="leads-stat">
              <span className="leads-stat__icon leads-stat__icon--purple">
                <IndianRupee size={22} />
              </span>
              <div>
                <p>Active Pipeline Value</p>
                <h2>{formatCurrency(activePipeline)}</h2>
                <span>Excludes lost and converted leads</span>
              </div>
            </article>
          </section>

          <section className="leads-pipeline">
            {statuses.filter((status) => status !== "Lost").map((status) => {
              const count = leads.filter(
                (lead) => lead.status === status
              ).length;

              return (
                <article className="leads-pipeline-card" key={status}>
                  <span
                    className={`leads-pipeline-dot leads-pipeline-dot--${status.toLowerCase()}`}
                  />
                  <div>
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="leads-card">
            <div className="leads-toolbar">
              <div>
                <h2>All Leads</h2>
                <p>{filteredLeads.length} leads found</p>
              </div>

              <div className="leads-controls">
                <label className="leads-search">
                  <Search size={18} />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search leads..."
                  />
                </label>

                <select
                  className="leads-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by lead status"
                >
                  <option value="All">All statuses</option>
                  {[...statuses, "Converted"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>

                <select
                  className="leads-select"
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value)}
                  aria-label="Filter by lead source"
                >
                  <option value="All">All sources</option>
                  {["Website", "Referral", "LinkedIn", "Social media", "Other"].map(
                    (source) => (
                      <option key={source}>{source}</option>
                    )
                  )}
                </select>
              </div>
            </div>

            {filteredLeads.length > 0 ? (
              <div className="leads-table-wrap">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Source</th>
                      <th>Potential Value</th>
                      <th>Follow-up</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <div className="leads-person">
                            <span className="leads-avatar">
                              {getInitials(lead.name)}
                            </span>
                            <div>
                              <strong>{lead.name}</strong>
                              <span>{lead.company}</span>
                              <span>{lead.email}</span>
                            </div>
                          </div>
                        </td>

                        <td>{lead.source}</td>
                        <td className="leads-value">
                          {formatCurrency(lead.value)}
                        </td>
                        <td>{lead.followUp || "Not scheduled"}</td>

                        <td>
                          <span
                            className={`leads-status leads-status--${lead.status.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {lead.status}
                          </span>
                        </td>

                        <td>
                          <div className="leads-actions">
                            <button
                              title="View details"
                              aria-label={`View ${lead.name}`}
                              onClick={() => openDetails(lead)}
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              title="Edit lead"
                              aria-label={`Edit ${lead.name}`}
                              onClick={() => openEditForm(lead)}
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              className="leads-actions__delete"
                              title="Delete lead"
                              aria-label={`Delete ${lead.name}`}
                              onClick={() => handleDelete(lead)}
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
              <div className="leads-empty">
                <UserRoundSearch size={36} />
                <h3>No leads found</h3>
                <p>Try adjusting your search or filters.</p>
                <button
                  className="leads-button leads-button--secondary"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setSourceFilter("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {view === "form" && (
        <section className="leads-card leads-form-card">
          <button className="leads-back" onClick={backToList}>
            <ArrowLeft size={17} />
            Back to Leads
          </button>

          <div className="leads-form-heading">
            <h2>{editingId ? "Edit Lead" : "Add New Lead"}</h2>
            <p>Capture the lead's contact information and opportunity details.</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="leads-form"
          >
            <div className="leads-form-grid">
              <label className="leads-field">
                <span>Full name *</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  required
                />
              </label>

              <label className="leads-field">
                <span>Company *</span>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  required
                />
              </label>

              <label className="leads-field">
                <span>Email address *</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </label>

              <label className="leads-field">
                <span>Phone number</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </label>

              <label className="leads-field">
                <span>Lead source *</span>
                <select
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  required
                >
                  {["Website", "Referral", "LinkedIn", "Social media", "Other"].map(
                    (source) => (
                      <option key={source}>{source}</option>
                    )
                  )}
                </select>
              </label>

              <label className="leads-field">
                <span>Potential value (₹)</span>
                <input
                  type="number"
                  min="0"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  placeholder="45000"
                />
              </label>

              <label className="leads-field">
                <span>Lead status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                  <option>Converted</option>
                </select>
              </label>

              <label className="leads-field">
                <span>Next follow-up</span>
                <input
                  type="date"
                  name="followUp"
                  value={form.followUp}
                  onChange={handleChange}
                />
              </label>

              <label className="leads-field leads-field--full">
                <span>Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Requirements, conversation notes, and next steps..."
                />
              </label>
            </div>

            <div className="leads-form-actions">
              <button
                type="button"
                className="leads-button leads-button--secondary"
                onClick={backToList}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="leads-button leads-button--primary"
              >
                {editingId ? "Save Changes" : "Create Lead"}
              </button>
            </div>
          </form>
        </section>
      )}

      {view === "details" && selectedLead && (
        <section className="leads-card leads-details">
          <button className="leads-back" onClick={backToList}>
            <ArrowLeft size={17} />
            Back to Leads
          </button>

          <div className="leads-details-header">
            <div className="leads-person leads-person--large">
              <span className="leads-avatar leads-avatar--large">
                {getInitials(selectedLead.name)}
              </span>
              <div>
                <h2>{selectedLead.name}</h2>
                <p>{selectedLead.company}</p>
                <span
                  className={`leads-status leads-status--${selectedLead.status.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {selectedLead.status}
                </span>
              </div>
            </div>

            <div className="leads-details-actions">
              <button
                className="leads-button leads-button--secondary"
                onClick={() => openEditForm(selectedLead)}
              >
                <Pencil size={17} />
                Edit Lead
              </button>

              {selectedLead.status !== "Converted" &&
                selectedLead.status !== "Lost" && (
                  <button
                    className="leads-button leads-button--primary"
                    onClick={() => convertLead(selectedLead)}
                  >
                    <ArrowRight size={17} />
                    Convert to Client
                  </button>
                )}
            </div>
          </div>

          <div className="leads-details-grid">
            <article className="leads-detail-item">
              <Mail size={19} />
              <div>
                <span>Email address</span>
                <strong>{selectedLead.email}</strong>
              </div>
            </article>

            <article className="leads-detail-item">
              <Phone size={19} />
              <div>
                <span>Phone number</span>
                <strong>{selectedLead.phone || "Not provided"}</strong>
              </div>
            </article>

            <article className="leads-detail-item">
              <Building2 size={19} />
              <div>
                <span>Company</span>
                <strong>{selectedLead.company}</strong>
              </div>
            </article>

            <article className="leads-detail-item">
              <IndianRupee size={19} />
              <div>
                <span>Potential value</span>
                <strong>{formatCurrency(selectedLead.value)}</strong>
              </div>
            </article>

            <article className="leads-detail-item">
              <UserRoundSearch size={19} />
              <div>
                <span>Lead source</span>
                <strong>{selectedLead.source}</strong>
              </div>
            </article>

            <article className="leads-detail-item">
              <CalendarDays size={19} />
              <div>
                <span>Next follow-up</span>
                <strong>{selectedLead.followUp || "Not scheduled"}</strong>
              </div>
            </article>
          </div>

          <div className="leads-status-editor">
            <label htmlFor="lead-status">Update lead status</label>
            <select
              id="lead-status"
              value={selectedLead.status}
              onChange={(event) => updateStatus(selectedLead, event.target.value)}
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
              <option>Converted</option>
            </select>
          </div>

          <div className="leads-notes">
            <h3>Lead Notes</h3>
            <p>{selectedLead.notes || "No notes added yet."}</p>
          </div>

          <div className="leads-form-actions">
            <button
              className="leads-button leads-button--danger"
              onClick={() => handleDelete(selectedLead)}
            >
              <Trash2 size={17} />
              Delete Lead
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default Leads;
