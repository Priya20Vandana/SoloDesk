
import { useMemo, useState } from "react";
import "./Invoices.css";

const initialInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-2026-001",
    client: "Acme Studio",
    project: "Website Redesign",
    issueDate: "2026-10-01",
    dueDate: "2026-10-15",
    paymentTerms: "Net 14",
    status: "Sent",
    notes: "Payment for the website redesign project.",
    items: [
      { id: 1, description: "Homepage Design", quantity: 1, rate: 20000 },
      { id: 2, description: "Inner Page Design", quantity: 1, rate: 15000 },
    ],
    payments: [
      {
        id: 1,
        amount: 10000,
        date: "2026-10-05",
        method: "Bank Transfer",
        reference: "TXN-1001",
      },
    ],
  },
  {
    id: 2,
    invoiceNumber: "INV-2026-002",
    client: "Northstar Labs",
    project: "Brand Identity Package",
    issueDate: "2026-10-02",
    dueDate: "2026-10-20",
    paymentTerms: "Net 18",
    status: "Sent",
    notes: "Brand identity design deliverables.",
    items: [
      { id: 1, description: "Logo Design", quantity: 1, rate: 18000 },
      { id: 2, description: "Brand Guidelines", quantity: 1, rate: 12000 },
    ],
    payments: [],
  },
  {
    id: 3,
    invoiceNumber: "INV-2026-003",
    client: "Greenfield Co.",
    project: "Landing Page Design",
    issueDate: "2026-09-15",
    dueDate: "2026-09-30",
    paymentTerms: "Net 15",
    status: "Sent",
    notes: "Final landing page design payment.",
    items: [
      { id: 1, description: "Landing Page Design", quantity: 1, rate: 18000 },
    ],
    payments: [],
  },
  {
    id: 4,
    invoiceNumber: "INV-2026-004",
    client: "Brightpath Media",
    project: "Social Media Templates",
    issueDate: "2026-10-04",
    dueDate: "2026-10-18",
    paymentTerms: "Net 14",
    status: "Draft",
    notes: "",
    items: [
      { id: 1, description: "Social Media Templates", quantity: 1, rate: 12000 },
    ],
    payments: [],
  },
  {
    id: 5,
    invoiceNumber: "INV-2026-005",
    client: "Orbit Finance",
    project: "Mobile App UI Design",
    issueDate: "2026-09-01",
    dueDate: "2026-09-15",
    paymentTerms: "Net 14",
    status: "Sent",
    notes: "First milestone payment.",
    items: [
      { id: 1, description: "Mobile App UI Design", quantity: 1, rate: 65000 },
    ],
    payments: [
      {
        id: 1,
        amount: 65000,
        date: "2026-09-10",
        method: "Bank Transfer",
        reference: "TXN-1005",
      },
    ],
  },
];

const clients = [
  "Acme Studio",
  "Northstar Labs",
  "Greenfield Co.",
  "Brightpath Media",
  "Orbit Finance",
];

const projects = [
  "Website Redesign",
  "Brand Identity Package",
  "Landing Page Design",
  "Social Media Templates",
  "Mobile App UI Design",
];

const statusOptions = ["Draft", "Sent", "Partially Paid", "Paid", "Overdue"];

const emptyForm = {
  client: "",
  project: "",
  issueDate: "2026-10-11",
  dueDate: "",
  paymentTerms: "Net 14",
  notes: "",
  items: [{ id: 1, description: "", quantity: 1, rate: 0 }],
};

const emptyPayment = {
  amount: "",
  date: "2026-10-11",
  method: "Bank Transfer",
  reference: "",
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInvoiceTotal(invoice) {
  return invoice.items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0) * Number(item.rate || 0),
    0
  );
}

function getAmountPaid(invoice) {
  return invoice.payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );
}

function getBalance(invoice) {
  return Math.max(0, getInvoiceTotal(invoice) - getAmountPaid(invoice));
}

function getInvoiceStatus(invoice) {
  if (invoice.status === "Draft") return "Draft";

  const total = getInvoiceTotal(invoice);
  const paid = getAmountPaid(invoice);

  if (total > 0 && paid >= total) return "Paid";
  if (paid > 0) return "Partially Paid";

  const today = new Date().toISOString().slice(0, 10);

  if (invoice.dueDate && invoice.dueDate < today) return "Overdue";

  return "Sent";
}

function StatusBadge({ status }) {
  return (
    <span
      className={`invoice-status status-${status
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  );
}

function SummaryCard({ label, value, description }) {
  return (
    <div className="invoice-summary-card">
      <p className="invoice-summary-label">{label}</p>
      <h3>{value}</h3>
      <p className="invoice-summary-description">{description}</p>
    </div>
  );
}

export default function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [activeView, setActiveView] = useState("list");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("All");
  const [formData, setFormData] = useState(emptyForm);
  const [paymentData, setPaymentData] = useState(emptyPayment);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedInvoice = invoices.find(
    (invoice) => invoice.id === selectedInvoiceId
  );

  const invoiceStats = useMemo(() => {
    const totalInvoiced = invoices
      .filter((invoice) => invoice.status !== "Draft")
      .reduce((total, invoice) => total + getInvoiceTotal(invoice), 0);

    const totalReceived = invoices.reduce(
      (total, invoice) => total + getAmountPaid(invoice),
      0
    );

    const outstanding = invoices
      .filter((invoice) => invoice.status !== "Draft")
      .reduce((total, invoice) => total + getBalance(invoice), 0);

    const overdue = invoices.filter(
      (invoice) => getInvoiceStatus(invoice) === "Overdue"
    ).length;

    return { totalInvoiced, totalReceived, outstanding, overdue };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const status = getInvoiceStatus(invoice);
      const search = searchTerm.toLowerCase();

      const matchesSearch = [
        invoice.invoiceNumber,
        invoice.client,
        invoice.project,
      ].some((value) => value.toLowerCase().includes(search));

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      const matchesClient =
        clientFilter === "All" || invoice.client === clientFilter;

      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [invoices, searchTerm, statusFilter, clientFilter]);

  function resetMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  function openCreateForm() {
    setEditingInvoiceId(null);
    setFormData({
      ...emptyForm,
      issueDate: new Date().toISOString().slice(0, 10),
      items: [{ id: 1, description: "", quantity: 1, rate: 0 }],
    });
    resetMessages();
    setActiveView("form");
  }

  function openEditForm(invoice) {
    if (getInvoiceStatus(invoice) === "Paid") {
      setErrorMessage("Paid invoices cannot be edited.");
      return;
    }

    setEditingInvoiceId(invoice.id);
    setFormData({
      client: invoice.client,
      project: invoice.project,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      paymentTerms: invoice.paymentTerms,
      notes: invoice.notes || "",
      items: invoice.items.map((item) => ({ ...item })),
    });
    resetMessages();
    setActiveView("form");
  }

  function openDetails(invoice) {
    setSelectedInvoiceId(invoice.id);
    setShowPaymentForm(false);
    setPaymentData({
      ...emptyPayment,
      date: new Date().toISOString().slice(0, 10),
    });
    resetMessages();
    setActiveView("details");
  }

  function backToList() {
    setActiveView("list");
    setSelectedInvoiceId(null);
    setEditingInvoiceId(null);
    setShowPaymentForm(false);
    resetMessages();
  }

  function updateFormField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function updateItem(itemId, field, value) {
    setFormData((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addItem() {
    setFormData((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: Date.now(),
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
    }));
  }

  function removeItem(itemId) {
    setFormData((current) => ({
      ...current,
      items:
        current.items.length > 1
          ? current.items.filter((item) => item.id !== itemId)
          : current.items,
    }));
  }

  function handleInvoiceSubmit(event) {
    event.preventDefault();
    resetMessages();

    if (!formData.client || !formData.project) {
      setErrorMessage("Please select both a client and a project.");
      return;
    }

    if (!formData.issueDate || !formData.dueDate) {
      setErrorMessage("Please enter the issue date and due date.");
      return;
    }

    if (formData.dueDate < formData.issueDate) {
      setErrorMessage("The due date cannot be earlier than the issue date.");
      return;
    }

    if (
      formData.items.some(
        (item) =>
          !item.description.trim() ||
          Number(item.quantity) <= 0 ||
          Number(item.rate) < 0
      )
    ) {
      setErrorMessage(
        "Each line item needs a description, a positive quantity, and a valid rate."
      );
      return;
    }

    const cleanedItems = formData.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      rate: Number(item.rate),
    }));

    if (getInvoiceTotal({ items: cleanedItems }) <= 0) {
      setErrorMessage("The invoice total must be greater than zero.");
      return;
    }

    if (editingInvoiceId) {
      setInvoices((current) =>
        current.map((invoice) =>
          invoice.id === editingInvoiceId
            ? {
                ...invoice,
                ...formData,
                items: cleanedItems,
              }
            : invoice
        )
      );
      setSuccessMessage("Invoice updated successfully.");
    } else {
      const nextId = Math.max(0, ...invoices.map((invoice) => invoice.id)) + 1;

      const newInvoice = {
        id: nextId,
        invoiceNumber: `INV-2026-${String(nextId).padStart(3, "0")}`,
        ...formData,
        items: cleanedItems,
        payments: [],
        status: "Draft",
      };

      setInvoices((current) => [newInvoice, ...current]);
      setSuccessMessage("Invoice created successfully.");
    }

    setActiveView("list");
    setEditingInvoiceId(null);
  }

  function updateInvoiceStatus(invoiceId, nextStatus) {
    if (
      nextStatus === "Paid" ||
      nextStatus === "Partially Paid" ||
      nextStatus === "Overdue"
    ) {
      return;
    }

    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === invoiceId
          ? { ...invoice, status: nextStatus }
          : invoice
      )
    );
  }

  function handlePaymentSubmit(event) {
    event.preventDefault();
    resetMessages();

    if (!selectedInvoice) return;

    const amount = Number(paymentData.amount);
    const balance = getBalance(selectedInvoice);

    if (!amount || amount <= 0) {
      setErrorMessage("Enter a payment amount greater than zero.");
      return;
    }

    if (amount > balance) {
      setErrorMessage(
        `The payment cannot exceed the outstanding balance of ${formatCurrency(
          balance
        )}.`
      );
      return;
    }

    if (!paymentData.date) {
      setErrorMessage("Please select the payment date.");
      return;
    }

    const newPayment = {
      id: Date.now(),
      amount,
      date: paymentData.date,
      method: paymentData.method,
      reference: paymentData.reference.trim(),
    };

    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === selectedInvoice.id
          ? {
              ...invoice,
              payments: [...invoice.payments, newPayment],
            }
          : invoice
      )
    );

    setPaymentData({
      ...emptyPayment,
      date: new Date().toISOString().slice(0, 10),
    });
    setShowPaymentForm(false);
    setSuccessMessage("Payment recorded successfully.");
  }

  function deleteInvoice(invoice) {
    const confirmed = window.confirm(
      `Delete ${invoice.invoiceNumber}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setInvoices((current) =>
      current.filter((item) => item.id !== invoice.id)
    );
    setSelectedInvoiceId(null);
    setActiveView("list");
    setSuccessMessage("Invoice deleted successfully.");
  }

  const formTotal = formData.items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0) * Number(item.rate || 0),
    0
  );

  return (
    <main className="invoices-page">
      {activeView === "list" && (
        <>
          <header className="invoice-page-header">
            <div>
              <h1>Invoices &amp; Payments</h1>
              <p>
                Manage invoices, track payments, and monitor outstanding
                balances.
              </p>
            </div>
            <button
              className="invoice-primary-button"
              onClick={openCreateForm}
            >
              + Create Invoice
            </button>
          </header>

          {successMessage && (
            <div className="invoice-alert invoice-alert-success" role="status">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="invoice-alert invoice-alert-error" role="alert">
              {errorMessage}
            </div>
          )}

          <section className="invoice-summary-grid">
            <SummaryCard
              label="Total Invoiced"
              value={formatCurrency(invoiceStats.totalInvoiced)}
              description="Excludes draft invoices"
            />
            <SummaryCard
              label="Amount Received"
              value={formatCurrency(invoiceStats.totalReceived)}
              description="Payments recorded"
            />
            <SummaryCard
              label="Outstanding"
              value={formatCurrency(invoiceStats.outstanding)}
              description="Remaining to be collected"
            />
            <SummaryCard
              label="Overdue Invoices"
              value={invoiceStats.overdue}
              description="Past their due date"
            />
          </section>

          <section className="invoice-list-section">
            <div className="invoice-list-heading">
              <div>
                <h2>All Invoices</h2>
                <p>{filteredInvoices.length} invoice(s) found</p>
              </div>
            </div>

            <div className="invoice-filters">
              <input
                type="search"
                aria-label="Search invoices"
                placeholder="Search invoice, client, or project..."
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
                aria-label="Filter by client"
                value={clientFilter}
                onChange={(event) => setClientFilter(event.target.value)}
              >
                <option value="All">All clients</option>
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </div>

            <div className="invoice-table-wrapper">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client / Project</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Total</th>
                    <th>Outstanding</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const status = getInvoiceStatus(invoice);

                    return (
                      <tr key={invoice.id}>
                        <td>
                          <strong>{invoice.invoiceNumber}</strong>
                        </td>
                        <td>
                          <div className="invoice-client-cell">
                            <strong>{invoice.client}</strong>
                            <span>{invoice.project}</span>
                          </div>
                        </td>
                        <td>{formatDate(invoice.issueDate)}</td>
                        <td>{formatDate(invoice.dueDate)}</td>
                        <td>{formatCurrency(getInvoiceTotal(invoice))}</td>
                        <td>{formatCurrency(getBalance(invoice))}</td>
                        <td>
                          <StatusBadge status={status} />
                        </td>
                        <td>
                          <div className="invoice-row-actions">
                            <button
                              type="button"
                              className="invoice-icon-button"
                              title="View invoice"
                              aria-label={`View ${invoice.invoiceNumber}`}
                              onClick={() => openDetails(invoice)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>

                            {status !== "Paid" && (
                              <button
                                type="button"
                                className="invoice-icon-button"
                                title="Edit invoice"
                                aria-label={`Edit ${invoice.invoiceNumber}`}
                                onClick={() => openEditForm(invoice)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan="8" className="invoice-empty-state">
                        <h3>No invoices found</h3>
                        <p>
                          Try changing your search or filters, or create a new
                          invoice.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {activeView === "form" && (
        <section className="invoice-form-page">
          <button className="invoice-back-button" onClick={backToList}>
            ← Back to Invoices
          </button>

          <header className="invoice-page-header invoice-form-header">
            <div>
              <h1>{editingInvoiceId ? "Edit Invoice" : "Create Invoice"}</h1>
              <p>Add invoice details and line items.</p>
            </div>
          </header>

          {errorMessage && (
            <div className="invoice-alert invoice-alert-error" role="alert">
              {errorMessage}
            </div>
          )}

          <form className="invoice-form" onSubmit={handleInvoiceSubmit}>
            <section className="invoice-form-section">
              <h2>Invoice Information</h2>

              <div className="invoice-form-grid">
                <label>
                  Client <span className="required">*</span>
                  <select
                    required
                    value={formData.client}
                    onChange={(event) =>
                      updateFormField("client", event.target.value)
                    }
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client} value={client}>
                        {client}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Project <span className="required">*</span>
                  <select
                    required
                    value={formData.project}
                    onChange={(event) =>
                      updateFormField("project", event.target.value)
                    }
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project} value={project}>
                        {project}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Issue Date <span className="required">*</span>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(event) =>
                      updateFormField("issueDate", event.target.value)
                    }
                  />
                </label>

                <label>
                  Due Date <span className="required">*</span>
                  <input
                    type="date"
                    required
                    min={formData.issueDate || undefined}
                    value={formData.dueDate}
                    onChange={(event) =>
                      updateFormField("dueDate", event.target.value)
                    }
                  />
                </label>

                <label>
                  Payment Terms
                  <select
                    value={formData.paymentTerms}
                    onChange={(event) =>
                      updateFormField("paymentTerms", event.target.value)
                    }
                  >
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 7">Net 7</option>
                    <option value="Net 14">Net 14</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                  </select>
                </label>

                <label className="invoice-full-width">
                  Notes
                  <textarea
                    rows="3"
                    placeholder="Add payment instructions or notes..."
                    value={formData.notes}
                    onChange={(event) =>
                      updateFormField("notes", event.target.value)
                    }
                  />
                </label>
              </div>
            </section>

            <section className="invoice-form-section">
              <div className="invoice-section-title-row">
                <div>
                  <h2>Line Items</h2>
                  <p>
                    Add the services or deliverables included in this invoice.
                  </p>
                </div>
                <button
                  type="button"
                  className="invoice-secondary-button"
                  onClick={addItem}
                >
                  + Add Item
                </button>
              </div>

              <div className="invoice-line-items">
                {formData.items.map((item, index) => (
                  <div className="invoice-line-item" key={item.id}>
                    <label>
                      Description
                      <input
                        type="text"
                        required
                        placeholder="e.g. Homepage Design"
                        value={item.description}
                        onChange={(event) =>
                          updateItem(item.id, "description", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Quantity
                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(item.id, "quantity", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Rate (₹)
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(event) =>
                          updateItem(item.id, "rate", event.target.value)
                        }
                      />
                    </label>

                    <div className="invoice-line-total">
                      <span>Line Total</span>
                      <strong>
                        {formatCurrency(
                          Number(item.quantity || 0) * Number(item.rate || 0)
                        )}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="invoice-remove-item"
                      aria-label={`Remove line item ${index + 1}`}
                      title="Remove item"
                      disabled={formData.items.length === 1}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="invoice-form-total">
                <span>Invoice Total</span>
                <strong>{formatCurrency(formTotal)}</strong>
              </div>
            </section>

            <div className="invoice-form-actions">
              <button
                type="button"
                className="invoice-secondary-button"
                onClick={backToList}
              >
                Cancel
              </button>
              <button type="submit" className="invoice-primary-button">
                {editingInvoiceId ? "Save Changes" : "Create Draft Invoice"}
              </button>
            </div>
          </form>
        </section>
      )}

      {activeView === "details" && selectedInvoice && (
        <section className="invoice-details-page">
          <button className="invoice-back-button" onClick={backToList}>
            ← Back to Invoices
          </button>

          {successMessage && (
            <div className="invoice-alert invoice-alert-success" role="status">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="invoice-alert invoice-alert-error" role="alert">
              {errorMessage}
            </div>
          )}

          <header className="invoice-page-header">
            <div>
              <p className="invoice-eyebrow">Invoice Details</p>
              <h1>{selectedInvoice.invoiceNumber}</h1>
              <div className="invoice-detail-status">
                <StatusBadge status={getInvoiceStatus(selectedInvoice)} />
              </div>
            </div>

            <div className="invoice-detail-header-actions">
              {getInvoiceStatus(selectedInvoice) !== "Paid" && (
                <button
                  className="invoice-secondary-button"
                  onClick={() => openEditForm(selectedInvoice)}
                >
                  Edit Invoice
                </button>
              )}
              <button
                className="invoice-danger-button"
                onClick={() => deleteInvoice(selectedInvoice)}
              >
                Delete Invoice
              </button>
            </div>
          </header>

          <div className="invoice-detail-summary">
            <div>
              <span>Invoice Total</span>
              <strong>{formatCurrency(getInvoiceTotal(selectedInvoice))}</strong>
            </div>
            <div>
              <span>Amount Received</span>
              <strong>{formatCurrency(getAmountPaid(selectedInvoice))}</strong>
            </div>
            <div>
              <span>Outstanding Balance</span>
              <strong>{formatCurrency(getBalance(selectedInvoice))}</strong>
            </div>
          </div>

          <section className="invoice-detail-card">
            <h2>Invoice Information</h2>
            <div className="invoice-detail-grid">
              <div>
                <span>Client</span>
                <strong>{selectedInvoice.client}</strong>
              </div>
              <div>
                <span>Project</span>
                <strong>{selectedInvoice.project}</strong>
              </div>
              <div>
                <span>Issue Date</span>
                <strong>{formatDate(selectedInvoice.issueDate)}</strong>
              </div>
              <div>
                <span>Due Date</span>
                <strong>{formatDate(selectedInvoice.dueDate)}</strong>
              </div>
              <div>
                <span>Payment Terms</span>
                <strong>{selectedInvoice.paymentTerms}</strong>
              </div>
              <div>
                <span>Invoice Status</span>
                <strong>{getInvoiceStatus(selectedInvoice)}</strong>
              </div>
              {selectedInvoice.notes && (
                <div className="invoice-detail-notes">
                  <span>Notes</span>
                  <p>{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          </section>

          <section className="invoice-detail-card">
            <h2>Line Items</h2>
            <div className="invoice-table-wrapper">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.rate)}</td>
                      <td>{formatCurrency(item.quantity * item.rate)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="3">Invoice Total</th>
                    <th>{formatCurrency(getInvoiceTotal(selectedInvoice))}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <section className="invoice-detail-card">
            <div className="invoice-section-title-row">
              <div>
                <h2>Payment History</h2>
                <p>Record and review payments received for this invoice.</p>
              </div>

              {getBalance(selectedInvoice) > 0 &&
                getInvoiceStatus(selectedInvoice) !== "Draft" && (
                  <button
                    className="invoice-primary-button"
                    onClick={() => {
                      setShowPaymentForm((current) => !current);
                      setErrorMessage("");
                      setPaymentData({
                        ...emptyPayment,
                        date: new Date().toISOString().slice(0, 10),
                      });
                    }}
                  >
                    {showPaymentForm ? "Cancel Payment" : "+ Record Payment"}
                  </button>
                )}
            </div>

            {showPaymentForm && (
              <form
                className="invoice-payment-form"
                onSubmit={handlePaymentSubmit}
              >
                <h3>Record a Payment</h3>
                <p>
                  Remaining balance:{" "}
                  <strong>
                    {formatCurrency(getBalance(selectedInvoice))}
                  </strong>
                </p>

                <div className="invoice-form-grid">
                  <label>
                    Amount Received (₹) <span className="required">*</span>
                    <input
                      type="number"
                      min="0.01"
                      max={getBalance(selectedInvoice)}
                      step="0.01"
                      required
                      value={paymentData.amount}
                      onChange={(event) =>
                        setPaymentData((current) => ({
                          ...current,
                          amount: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    Payment Date <span className="required">*</span>
                    <input
                      type="date"
                      required
                      value={paymentData.date}
                      onChange={(event) =>
                        setPaymentData((current) => ({
                          ...current,
                          date: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    Payment Method
                    <select
                      value={paymentData.method}
                      onChange={(event) =>
                        setPaymentData((current) => ({
                          ...current,
                          method: event.target.value,
                        }))
                      }
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label>
                    Transaction Reference
                    <input
                      type="text"
                      placeholder="e.g. TXN-1006"
                      value={paymentData.reference}
                      onChange={(event) =>
                        setPaymentData((current) => ({
                          ...current,
                          reference: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="invoice-form-actions">
                  <button
                    type="button"
                    className="invoice-secondary-button"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="invoice-primary-button">
                    Save Payment
                  </button>
                </div>
              </form>
            )}

            {selectedInvoice.payments.length > 0 ? (
              <div className="invoice-table-wrapper">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Payment Date</th>
                      <th>Method</th>
                      <th>Reference</th>
                      <th>Amount Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.payments
                      .slice()
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((payment) => (
                        <tr key={payment.id}>
                          <td>{formatDate(payment.date)}</td>
                          <td>{payment.method}</td>
                          <td>{payment.reference || "—"}</td>
                          <td>{formatCurrency(payment.amount)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="invoice-empty-state">
                <h3>No payments recorded</h3>
                <p>Recorded payments will appear here.</p>
              </div>
            )}
          </section>

          {getInvoiceStatus(selectedInvoice) === "Draft" && (
            <section className="invoice-detail-card">
              <h2>Invoice Actions</h2>
              <p>
                Send this draft invoice when it is ready to share with the
                client.
              </p>
              <button
                className="invoice-primary-button"
                onClick={() => updateInvoiceStatus(selectedInvoice.id, "Sent")}
              >
                Mark as Sent
              </button>
            </section>
          )}
        </section>
      )}
    </main>
  );
}
