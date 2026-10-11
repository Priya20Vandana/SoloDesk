import { useMemo, useState } from "react";

import "./Deals.css";

const initialDeals = [

  {

    id: 1,

    title: "Website Redesign",

    client: "Acme Studio",

    email: "hello@acmestudio.com",

    scope: "Redesign the company website with responsive layouts, improved navigation, and updated service pages.",

    value: 45000,

    deadline: "2026-11-15",

    paymentTerms: "50% upfront, 50% on completion",

    status: "Proposal Sent",

    notes: "Waiting for the client to review the proposal.",

  },

  {

    id: 2,

    title: "Brand Identity Package",

    client: "Northstar Labs",

    email: "contact@northstarlabs.com",

    scope: "Create a brand identity system including logo concepts, typography, colour palette, and brand guidelines.",

    value: 30000,

    deadline: "2026-11-22",

    paymentTerms: "40% upfront, 60% on delivery",

    status: "Negotiation",

    notes: "Client requested a discussion about the project scope.",

  },

  {

    id: 3,

    title: "Landing Page Design",

    client: "Greenfield Co.",

    email: "team@greenfield.co",

    scope: "Design and deliver a conversion-focused landing page with mobile and desktop layouts.",

    value: 18000,

    deadline: "2026-11-05",

    paymentTerms: "50% upfront, 50% on completion",

    status: "Accepted",

    notes: "Ready to move into project planning.",

  },

  {

    id: 4,

    title: "Social Media Templates",

    client: "Brightpath Media",

    email: "hello@brightpath.media",

    scope: "Develop a reusable set of branded social media templates for multiple content formats.",

    value: 12000,

    deadline: "2026-10-30",

    paymentTerms: "100% on completion",

    status: "Draft",

    notes: "Proposal is being prepared.",

  },

  {

    id: 5,

    title: "Mobile App UI Design",

    client: "Orbit Finance",

    email: "projects@orbitfinance.com",

    scope: "Create mobile application wireframes, polished interface screens, and a clickable prototype.",

    value: 65000,

    deadline: "2026-12-10",

    paymentTerms: "30% upfront, 40% at design approval, 30% on completion",

    status: "Rejected",

    notes: "Client decided not to proceed at this time.",

  },

];

const statusOptions = [

  "Draft",

  "Proposal Sent",

  "Negotiation",

  "Accepted",

  "Rejected",

];

const emptyDeal = {

  title: "",

  client: "",

  email: "",

  scope: "",

  value: "",

  deadline: "",

  paymentTerms: "50% upfront, 50% on completion",

  status: "Draft",

  notes: "",

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

export default function Deals() {

  const [deals, setDeals] = useState(initialDeals);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [activeView, setActiveView] = useState("list");

  const [selectedDeal, setSelectedDeal] = useState(null);

  const [formData, setFormData] = useState(emptyDeal);

  const [editingId, setEditingId] = useState(null);

  const [formError, setFormError] = useState("");

  const filteredDeals = useMemo(() => {

    const search = searchTerm.trim().toLowerCase();

    return deals.filter((deal) => {

      const matchesSearch =

        deal.title.toLowerCase().includes(search) ||

        deal.client.toLowerCase().includes(search) ||

        deal.email.toLowerCase().includes(search);

      const matchesStatus =

        statusFilter === "All" || deal.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [deals, searchTerm, statusFilter]);

  const totalValue = deals

    .filter((deal) => deal.status !== "Rejected")

    .reduce((total, deal) => total + Number(deal.value || 0), 0);

  const acceptedValue = deals

    .filter((deal) => deal.status === "Accepted")

    .reduce((total, deal) => total + Number(deal.value || 0), 0);

  const activeDeals = deals.filter(

    (deal) => !["Accepted", "Rejected"].includes(deal.status)

  ).length;

  function openCreateForm() {

    setFormData({ ...emptyDeal });

    setEditingId(null);

    setFormError("");

    setActiveView("form");

  }

  function openEditForm(deal) {

    setFormData({

      ...deal,

      value: String(deal.value),

    });

    setEditingId(deal.id);

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

  function handleSubmit(event) {

    event.preventDefault();

    if (

      !formData.title.trim() ||

      !formData.client.trim() ||

      !formData.email.trim() ||

      !formData.scope.trim() ||

      !formData.value ||

      Number(formData.value) <= 0 ||

      !formData.deadline ||

      !formData.paymentTerms.trim()

    ) {

      setFormError("Please complete all required fields with valid values.");

      return;

    }

    const updatedDeal = {

      ...formData,

      title: formData.title.trim(),

      client: formData.client.trim(),

      email: formData.email.trim(),

      scope: formData.scope.trim(),

      paymentTerms: formData.paymentTerms.trim(),

      value: Number(formData.value),

      notes: formData.notes.trim(),

    };

    if (editingId !== null) {

      setDeals((current) =>

        current.map((deal) =>

          deal.id === editingId ? { ...deal, ...updatedDeal } : deal

        )

      );

    } else {

      setDeals((current) => [

        {

          ...updatedDeal,

          id: Date.now(),

        },

        ...current,

      ]);

    }

    setFormError("");

    setActiveView("list");

    setEditingId(null);

    setFormData({ ...emptyDeal });

  }

  function updateDealStatus(id, status) {

    setDeals((current) =>

      current.map((deal) =>

        deal.id === id ? { ...deal, status } : deal

      )

    );

    setSelectedDeal((current) =>

      current && current.id === id ? { ...current, status } : current

    );

  }

  function deleteDeal(id) {

    const confirmed = window.confirm(

      "Are you sure you want to delete this deal?"

    );

    if (!confirmed) return;

    setDeals((current) => current.filter((deal) => deal.id !== id));

    if (selectedDeal?.id === id) {

      setSelectedDeal(null);

      setActiveView("list");

    }

  }

  function openProposal(deal) {

    setSelectedDeal(deal);

    setActiveView("proposal");

  }

  function backToList() {

    setSelectedDeal(null);

    setActiveView("list");

  }

  if (activeView === "form") {

    return (

      <section className="deals-page">

        <button className="deals-back" onClick={backToList} type="button">

          ← Back to Deals

        </button>

        <header className="deals-header">

          <p className="deals-eyebrow">DEALS & PROPOSALS</p>

          <h1>{editingId !== null ? "Edit Deal" : "Create a Deal"}</h1>

          <p className="deals-subtitle">

            Define the project scope, pricing, payment terms, and deadline.

          </p>

        </header>

        <form className="deals-form" onSubmit={handleSubmit}>

          <div className="deals-form-heading">

            <h2>Deal Information</h2>

            <p>Fields marked with * are required.</p>

          </div>

          <div className="deals-form-grid">

            <label className="deals-field">

              Deal Title *

              <input

                name="title"

                value={formData.title}

                onChange={handleFieldChange}

                placeholder="e.g. Website Redesign"

                required

              />

            </label>

            <label className="deals-field">

              Client Name *

              <input

                name="client"

                value={formData.client}

                onChange={handleFieldChange}

                placeholder="Enter client or company name"

                required

              />

            </label>

            <label className="deals-field">

              Client Email *

              <input

                name="email"

                type="email"

                value={formData.email}

                onChange={handleFieldChange}

                placeholder="client@example.com"

                required

              />

            </label>

            <label className="deals-field">

              Deal Value (INR) *

              <input

                name="value"

                type="number"

                min="1"

                step="1"

                value={formData.value}

                onChange={handleFieldChange}

                placeholder="e.g. 45000"

                required

              />

            </label>

            <label className="deals-field">

              Deadline *

              <input

                name="deadline"

                type="date"

                value={formData.deadline}

                onChange={handleFieldChange}

                required

              />

            </label>

            <label className="deals-field">

              Deal Status *

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

            <label className="deals-field deals-field--full">

              Project Scope *

              <textarea

                name="scope"

                rows="5"

                value={formData.scope}

                onChange={handleFieldChange}

                placeholder="Describe the deliverables, services, and project requirements."

                required

              />

            </label>

            <label className="deals-field deals-field--full">

              Payment Terms *

              <input

                name="paymentTerms"

                value={formData.paymentTerms}

                onChange={handleFieldChange}

                placeholder="e.g. 50% upfront, 50% on completion"

                required

              />

            </label>

            <label className="deals-field deals-field--full">

              Internal Notes

              <textarea

                name="notes"

                rows="3"

                value={formData.notes}

                onChange={handleFieldChange}

                placeholder="Add follow-up notes or negotiation details."

              />

            </label>

          </div>

          {formError && (

            <p className="deals-form-error" role="alert">

              {formError}

            </p>

          )}

          <div className="deals-form-actions">

            <button

              className="deals-button deals-button--secondary"

              type="button"

              onClick={backToList}

            >

              Cancel

            </button>

            <button className="deals-button deals-button--primary" type="submit">

              {editingId !== null ? "Save Changes" : "Create Deal"}

            </button>

          </div>

        </form>

      </section>

    );

  }

  if (activeView === "proposal" && selectedDeal) {

    return (

      <section className="deals-page">

        <button className="deals-back" onClick={backToList} type="button">

          ← Back to Deals

        </button>

        <div className="deals-proposal">

          <div className="deals-proposal-top">

            <div>

              <p className="deals-eyebrow">SOLODESK · PROPOSAL PREVIEW</p>

              <h1>{selectedDeal.title}</h1>

              <p className="deals-subtitle">

                Prepared for {selectedDeal.client}

              </p>

            </div>

            <span

              className={`deals-status deals-status--${getStatusClass(

                selectedDeal.status

              )}`}

            >

              {selectedDeal.status}

            </span>

          </div>

          <div className="deals-proposal-value">

            <span>Proposed project value</span>

            <strong>{formatCurrency(selectedDeal.value)}</strong>

          </div>

          <div className="deals-proposal-section">

            <h2>Client Information</h2>

            <p>{selectedDeal.client}</p>

            <p>{selectedDeal.email}</p>

          </div>

          <div className="deals-proposal-section">

            <h2>Project Scope & Deliverables</h2>

            <p className="deals-proposal-copy">{selectedDeal.scope}</p>

          </div>

          <div className="deals-proposal-grid">

            <div>

              <span>Project deadline</span>

              <strong>{formatDate(selectedDeal.deadline)}</strong>

            </div>

            <div>

              <span>Payment terms</span>

              <strong>{selectedDeal.paymentTerms}</strong>

            </div>

          </div>

          {selectedDeal.notes && (

            <div className="deals-proposal-section">

              <h2>Notes</h2>

              <p className="deals-proposal-copy">{selectedDeal.notes}</p>

            </div>

          )}

          <div className="deals-proposal-actions">

            <button

              className="deals-button deals-button--secondary"

              type="button"

              onClick={() => openEditForm(selectedDeal)}

            >

              Edit Deal

            </button>

            <button

              className="deals-button deals-button--primary"

              type="button"

              onClick={() => window.print()}

            >

              Print Proposal

            </button>

          </div>

        </div>

      </section>

    );

  }

  return (

    <section className="deals-page">

      <header className="deals-header deals-header--row">

        <div>

          <p className="deals-eyebrow">BUSINESS MANAGEMENT</p>

          <h1>Deals & Proposals</h1>

          <p className="deals-subtitle">

            Manage opportunities, prepare proposals, and track client decisions.

          </p>

        </div>

        <button

          className="deals-button deals-button--primary"

          onClick={openCreateForm}

          type="button"

        >

          + Create Deal

        </button>

      </header>

      <div className="deals-stats">

        <article className="deals-stat">

          <span>Total Pipeline Value</span>

          <h2>{formatCurrency(totalValue)}</h2>

          <p>All deals except rejected</p>

        </article>

        <article className="deals-stat">

          <span>Accepted Value</span>

          <h2>{formatCurrency(acceptedValue)}</h2>

          <p>Deals marked as accepted</p>

        </article>

        <article className="deals-stat">

          <span>Active Deals</span>

          <h2>{activeDeals}</h2>

          <p>Drafts, proposals, and negotiations</p>

        </article>

        <article className="deals-stat">

          <span>Total Deals</span>

          <h2>{deals.length}</h2>

          <p>All recorded opportunities</p>

        </article>

      </div>

      <div className="deals-toolbar">

        <div>

          <h2>All Deals</h2>

          <p>Search and review your current opportunities.</p>

        </div>

        <div className="deals-filters">

          <input

            type="search"

            aria-label="Search deals"

            placeholder="Search deals or clients..."

            value={searchTerm}

            onChange={(event) => setSearchTerm(event.target.value)}

          />

          <select

            aria-label="Filter by deal status"

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

        </div>

      </div>

      <div className="deals-table-wrapper">

        <table className="deals-table">

          <thead>

            <tr>

              <th>Deal</th>

              <th>Client</th>

              <th>Value</th>

              <th>Deadline</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredDeals.map((deal) => (

              <tr key={deal.id}>

                <td>

                  <strong className="deals-title">{deal.title}</strong>

                  <span className="deals-cell-secondary">

                    {deal.paymentTerms}

                  </span>

                </td>

                <td>

                  <strong className="deals-client">{deal.client}</strong>

                  <span className="deals-cell-secondary">{deal.email}</span>

                </td>

                <td className="deals-value">{formatCurrency(deal.value)}</td>

                <td>{formatDate(deal.deadline)}</td>

                <td>

                  <select

                    className={`deals-status-select deals-status-select--${getStatusClass(

                      deal.status

                    )}`}

                    aria-label={`Change status for ${deal.title}`}

                    value={deal.status}

                    onChange={(event) =>

                      updateDealStatus(deal.id, event.target.value)

                    }

                  >

                    {statusOptions.map((status) => (

                      <option key={status} value={status}>

                        {status}

                      </option>

                    ))}

                  </select>

                </td>

                <td>

                  <div className="deals-row-actions">
                    <button
                      className="deals-icon-action"
                      type="button"
                      onClick={() => openProposal(deal)}
                      aria-label={`Preview proposal for ${deal.title}`}
                      title="Preview proposal"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M2.5 12s3.4-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.4 6.5-9.5 6.5S2.5 12 2.5 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      className="deals-icon-action"
                      type="button"
                      onClick={() => openEditForm(deal)}
                      aria-label={`Edit ${deal.title}`}
                      title="Edit deal"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <button
                      className="deals-icon-action deals-icon-action--danger"
                      type="button"
                      onClick={() => deleteDeal(deal.id)}
                      aria-label={`Delete ${deal.title}`}
                      title="Delete deal"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="m19 6-1 14H6L5 6" />
                        <path d="M10 11v5M14 11v5" />
                      </svg>
                    </button>
                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filteredDeals.length === 0 && (

          <div className="deals-empty">

            <h3>No deals found</h3>

            <p>Try another search or status filter, or create a new deal.</p>

            <button

              className="deals-button deals-button--primary"

              type="button"

              onClick={openCreateForm}

            >

              Create Deal

            </button>

          </div>

        )}

      </div>

      <p className="deals-results-count">

        Showing {filteredDeals.length} of {deals.length} deals

      </p>

    </section>

  );

}
