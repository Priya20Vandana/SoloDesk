
import { useState } from "react";
import {
  Users,
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
  FolderKanban,
  UserRound,
} from "lucide-react";
import "./Clients.css";

const initialClients = [
  {
    id: 1,
    name: "Olivia Martin",
    company: "Bright Studio",
    email: "olivia@brightstudio.com",
    phone: "+91 98765 43210",
    status: "Active",
    projects: 3,
    joined: "2026-08-12",
    notes: "Branding and website design client.",
  },
  {
    id: 2,
    name: "James Wilson",
    company: "Wilson Consulting",
    email: "james@wilsonconsulting.com",
    phone: "+91 98765 12345",
    status: "Active",
    projects: 2,
    joined: "2026-07-24",
    notes: "Interested in ongoing design support.",
  },
  {
    id: 3,
    name: "Sophia Chen",
    company: "Chen Digital",
    email: "sophia@chendigital.com",
    phone: "+91 99887 77665",
    status: "Inactive",
    projects: 1,
    joined: "2026-05-18",
    notes: "Previous website project.",
  },
  {
    id: 4,
    name: "Ethan Taylor",
    company: "Taylor Works",
    email: "ethan@taylorworks.com",
    phone: "+91 91234 56789",
    status: "Active",
    projects: 4,
    joined: "2026-09-02",
    notes: "Long-term client with recurring work.",
  },
];

const emptyClient = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "Active",
  projects: "0",
  joined: new Date().toISOString().slice(0, 10),
  notes: "",
};

function Clients() {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState("list");
  const [form, setForm] = useState(emptyClient);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState("");

  const selectedClient = clients.find(
    (client) => client.id === selectedId
  );

  const filteredClients = clients.filter((client) => {
    const query = search.toLowerCase();

    const matchesSearch = [
      client.name,
      client.company,
      client.email,
    ].some((value) => value.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All" || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeCount = clients.filter(
    (client) => client.status === "Active"
  ).length;

  const totalProjects = clients.reduce(
    (total, client) => total + (Number(client.projects) || 0),
    0
  );

  function openCreateForm() {
    setForm({ ...emptyClient });
    setEditingId(null);
    setView("form");
    setNotice("");
  }

  function openEditForm(client) {
    setForm({ ...client, projects: String(client.projects) });
    setEditingId(client.id);
    setSelectedId(client.id);
    setView("form");
    setNotice("");
  }

  function openDetails(client) {
    setSelectedId(client.id);
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

    const duplicateEmail = clients.some(
      (client) =>
        client.email.toLowerCase() === form.email.trim().toLowerCase() &&
        client.id !== editingId
    );

    if (duplicateEmail) {
      setNotice("A client with this email address already exists.");
      return;
    }

    const savedClient = {
      ...form,
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      projects: Math.max(0, Number(form.projects) || 0),
    };

    if (editingId) {
      setClients((current) =>
        current.map((client) =>
          client.id === editingId ? savedClient : client
        )
      );
      setNotice("Client updated successfully.");
    } else {
      setClients((current) => [savedClient, ...current]);
      setNotice("Client added successfully.");
    }

    setSelectedId(savedClient.id);
    setEditingId(null);
    setView("details");
  }

  function handleDelete(client) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${client.name}?`
    );

    if (!confirmed) return;

    setClients((current) =>
      current.filter((item) => item.id !== client.id)
    );

    setSelectedId(null);
    setView("list");
    setNotice("Client deleted successfully.");
  }

  function backToList() {
    setView("list");
    setEditingId(null);
    setNotice("");
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <main className="clients-page">
      <header className="clients-header">
        <div>
          <p className="clients-eyebrow">RELATIONSHIP MANAGEMENT</p>
          <h1>Clients</h1>
          <p className="clients-subtitle">
            Manage your clients, contact information, and relationships.
          </p>
        </div>

        {view === "list" && (
          <button
            className="clients-button clients-button--primary"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            Add Client
          </button>
        )}
      </header>

      {notice && (
        <div className="clients-notice" role="status">
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
          <section className="clients-stats">
            <article className="clients-stat">
              <span className="clients-stat__icon clients-stat__icon--blue">
                <Users size={22} />
              </span>
              <div>
                <p>Total Clients</p>
                <h2>{clients.length}</h2>
                <span>All registered clients</span>
              </div>
            </article>

            <article className="clients-stat">
              <span className="clients-stat__icon clients-stat__icon--green">
                <UserRound size={22} />
              </span>
              <div>
                <p>Active Clients</p>
                <h2>{activeCount}</h2>
                <span>Currently active</span>
              </div>
            </article>

            <article className="clients-stat">
              <span className="clients-stat__icon clients-stat__icon--purple">
                <FolderKanban size={22} />
              </span>
              <div>
                <p>Total Projects</p>
                <h2>{totalProjects}</h2>
                <span>Across listed clients</span>
              </div>
            </article>
          </section>

          <section className="clients-card">
            <div className="clients-toolbar">
              <div>
                <h2>All Clients</h2>
                <p>{filteredClients.length} clients found</p>
              </div>

              <div className="clients-controls">
                <label className="clients-search">
                  <Search size={18} />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search clients..."
                  />
                </label>

                <select
                  className="clients-select"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  aria-label="Filter clients by status"
                >
                  <option value="All">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {filteredClients.length > 0 ? (
              <div className="clients-table-wrap">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Company</th>
                      <th>Phone</th>
                      <th>Projects</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td>
                          <div className="clients-person">
                            <span className="clients-avatar">
                              {getInitials(client.name)}
                            </span>
                            <div>
                              <strong>{client.name}</strong>
                              <span>{client.email}</span>
                            </div>
                          </div>
                        </td>

                        <td>{client.company}</td>
                        <td>{client.phone || "—"}</td>
                        <td>{client.projects}</td>

                        <td>
                          <span
                            className={`clients-status clients-status--${client.status.toLowerCase()}`}
                          >
                            {client.status}
                          </span>
                        </td>

                        <td>
                          <div className="clients-actions">
                            <button
                              title="View details"
                              aria-label={`View ${client.name}`}
                              onClick={() => openDetails(client)}
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              title="Edit client"
                              aria-label={`Edit ${client.name}`}
                              onClick={() => openEditForm(client)}
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              className="clients-actions__delete"
                              title="Delete client"
                              aria-label={`Delete ${client.name}`}
                              onClick={() => handleDelete(client)}
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
              <div className="clients-empty">
                <Users size={36} />
                <h3>No clients found</h3>
                <p>Try a different search or clear the status filter.</p>
                <button
                  className="clients-button clients-button--secondary"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
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
        <section className="clients-card clients-form-card">
          <button className="clients-back" onClick={backToList}>
            <ArrowLeft size={17} />
            Back to Clients
          </button>

          <div className="clients-form-heading">
            <h2>{editingId ? "Edit Client" : "Add New Client"}</h2>
            <p>
              {editingId
                ? "Update this client's information."
                : "Enter the contact details for your new client."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="clients-form-grid">
              <label className="clients-field">
                <span>Full name *</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  required
                />
              </label>

              <label className="clients-field">
                <span>Company *</span>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  required
                />
              </label>

              <label className="clients-field">
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

              <label className="clients-field">
                <span>Phone number</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </label>

              <label className="clients-field">
                <span>Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <label className="clients-field">
                <span>Number of projects</span>
                <input
                  type="number"
                  min="0"
                  name="projects"
                  value={form.projects}
                  onChange={handleChange}
                />
              </label>

              <label className="clients-field">
                <span>Client since</span>
                <input
                  type="date"
                  name="joined"
                  value={form.joined}
                  onChange={handleChange}
                />
              </label>

              <label className="clients-field clients-field--full">
                <span>Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Additional client information..."
                />
              </label>
            </div>

            <div className="clients-form-actions">
              <button
                type="button"
                className="clients-button clients-button--secondary"
                onClick={backToList}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="clients-button clients-button--primary"
              >
                {editingId ? "Save Changes" : "Create Client"}
              </button>
            </div>
          </form>
        </section>
      )}

      {view === "details" && selectedClient && (
        <section className="clients-card clients-details">
          <button className="clients-back" onClick={backToList}>
            <ArrowLeft size={17} />
            Back to Clients
          </button>

          <div className="clients-details-header">
            <div className="clients-person clients-person--large">
              <span className="clients-avatar clients-avatar--large">
                {getInitials(selectedClient.name)}
              </span>
              <div>
                <h2>{selectedClient.name}</h2>
                <p>{selectedClient.company}</p>
                <span
                  className={`clients-status clients-status--${selectedClient.status.toLowerCase()}`}
                >
                  {selectedClient.status}
                </span>
              </div>
            </div>

            <button
              className="clients-button clients-button--primary"
              onClick={() => openEditForm(selectedClient)}
            >
              <Pencil size={17} />
              Edit Client
            </button>
          </div>

          <div className="clients-details-grid">
            <article className="clients-detail-item">
              <Mail size={19} />
              <div>
                <span>Email address</span>
                <strong>{selectedClient.email}</strong>
              </div>
            </article>

            <article className="clients-detail-item">
              <Phone size={19} />
              <div>
                <span>Phone number</span>
                <strong>{selectedClient.phone || "Not provided"}</strong>
              </div>
            </article>

            <article className="clients-detail-item">
              <Building2 size={19} />
              <div>
                <span>Company</span>
                <strong>{selectedClient.company}</strong>
              </div>
            </article>

            <article className="clients-detail-item">
              <FolderKanban size={19} />
              <div>
                <span>Number of projects</span>
                <strong>{selectedClient.projects}</strong>
              </div>
            </article>
          </div>

          <div className="clients-notes">
            <h3>Client Notes</h3>
            <p>{selectedClient.notes || "No notes added yet."}</p>
          </div>

          <div className="clients-form-actions">
            <button
              className="clients-button clients-button--danger"
              onClick={() => handleDelete(selectedClient)}
            >
              <Trash2 size={17} />
              Delete Client
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default Clients;
