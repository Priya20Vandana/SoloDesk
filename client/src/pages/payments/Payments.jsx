
import { useMemo, useState } from "react";
import "./Payments.css";

const initialPayments = [
  {
    id: 1,
    reference: "PAY-2026-001",
    invoiceNumber: "INV-2026-001",
    client: "Acme Studio",
    project: "Website Redesign",
    amount: 10000,
    paymentDate: "2026-10-10",
    method: "Bank Transfer",
    transactionReference: "TXN-ACM-1001",
    notes: "Partial payment received for the website redesign invoice.",
  },
  {
    id: 2,
    reference: "PAY-2026-002",
    invoiceNumber: "INV-2026-005",
    client: "Orbit Finance",
    project: "Mobile App UI Design",
    amount: 65000,
    paymentDate: "2026-10-07",
    method: "UPI",
    transactionReference: "UPI-ORB-1002",
    notes: "Full payment received for the mobile app UI design invoice.",
  },
];

const paymentMethods = [
  "Bank Transfer",
  "UPI",
  "Cash",
  "Credit Card",
  "Other",
];

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

function getCurrentMonthPayments(payments) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return payments.filter((payment) => {
    const paymentDate = new Date(`${payment.paymentDate}T00:00:00`);

    return (
      paymentDate.getMonth() === currentMonth &&
      paymentDate.getFullYear() === currentYear
    );
  });
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
      <path d="M9 12h12" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 3h16v18l-4-2-4 2-4-2-4 2V3Z" />
      <path d="M8 8h8M8 12h8M8 16h4" />
    </svg>
  );
}

function Payments() {
  const [payments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("All Methods");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const today = new Date();

    return payments.filter((payment) => {
      const matchesSearch = [
        payment.reference,
        payment.invoiceNumber,
        payment.client,
        payment.project,
        payment.transactionReference,
        payment.method,
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesMethod =
        selectedMethod === "All Methods" ||
        payment.method === selectedMethod;

      const paymentDate = new Date(`${payment.paymentDate}T00:00:00`);
      let matchesDate = true;

      if (dateFilter === "This Month") {
        matchesDate =
          paymentDate.getMonth() === today.getMonth() &&
          paymentDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === "Last 30 Days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        matchesDate = paymentDate >= thirtyDaysAgo && paymentDate <= today;
      }

      return matchesSearch && matchesMethod && matchesDate;
    });
  }, [payments, searchTerm, selectedMethod, dateFilter]);

  const totalReceived = useMemo(
    () => payments.reduce((total, payment) => total + payment.amount, 0),
    [payments]
  );

  const thisMonthPayments = useMemo(
    () => getCurrentMonthPayments(payments),
    [payments]
  );

  const totalThisMonth = thisMonthPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const paymentMethodCount = new Set(
    payments.map((payment) => payment.method)
  ).size;

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
  };

  const handleBackToList = () => {
    setSelectedPayment(null);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (selectedPayment) {
    return (
      <main className="payments-page">
        <div className="payments-page-header no-print">
          <div>
            <h1>Payment Details</h1>
            <p>Review the recorded payment and its receipt.</p>
          </div>

          <button
            type="button"
            className="payments-back-button"
            onClick={handleBackToList}
          >
            <ArrowLeftIcon />
            Back to Payments
          </button>
        </div>

        <section className="payment-detail-card">
          <div className="payment-detail-top no-print">
            <div className="payment-detail-icon">
              <ReceiptIcon />
            </div>

            <div>
              <h2>Payment Receipt</h2>
              <p>{selectedPayment.reference}</p>
            </div>

            <button
              type="button"
              className="payments-primary-button payment-print-button"
              onClick={handlePrintReceipt}
            >
              <ReceiptIcon />
              Print Receipt
            </button>
          </div>

          <div className="payment-receipt-heading">
            <span className="payment-receipt-label">Amount Received</span>
            <h2>{formatCurrency(selectedPayment.amount)}</h2>
            <span className="payment-recorded-badge">Recorded</span>
          </div>

          <div className="payment-detail-section">
            <h3>Payment Information</h3>

            <div className="payment-detail-grid">
              <div className="payment-detail-field">
                <span>Payment Reference</span>
                <strong>{selectedPayment.reference}</strong>
              </div>

              <div className="payment-detail-field">
                <span>Payment Date</span>
                <strong>{formatDate(selectedPayment.paymentDate)}</strong>
              </div>

              <div className="payment-detail-field">
                <span>Payment Method</span>
                <strong>{selectedPayment.method}</strong>
              </div>

              <div className="payment-detail-field">
                <span>Transaction Reference</span>
                <strong>
                  {selectedPayment.transactionReference || "—"}
                </strong>
              </div>
            </div>
          </div>

          <div className="payment-detail-section">
            <h3>Invoice and Client</h3>

            <div className="payment-detail-grid">
              <div className="payment-detail-field">
                <span>Invoice Number</span>
                <strong>{selectedPayment.invoiceNumber}</strong>
              </div>

              <div className="payment-detail-field">
                <span>Client</span>
                <strong>{selectedPayment.client}</strong>
              </div>

              <div className="payment-detail-field payment-detail-field-full">
                <span>Project</span>
                <strong>{selectedPayment.project}</strong>
              </div>
            </div>
          </div>

          <div className="payment-detail-section payment-notes-section">
            <h3>Notes</h3>
            <p>{selectedPayment.notes || "No notes added."}</p>
          </div>

          <div className="payment-receipt-footer">
            This receipt is a UI preview generated from SoloDesk mock data.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="payments-page">
      <div className="payments-page-header">
        <div>
          <h1>Payments</h1>
          <p>Track received payments and review transaction details.</p>
        </div>
      </div>

      <section className="payments-summary-grid">
        <article className="payments-summary-card">
          <div className="payments-summary-top">
            <span>Total Received</span>
            <div className="payments-summary-icon">
              <ReceiptIcon />
            </div>
          </div>
          <h2>{formatCurrency(totalReceived)}</h2>
          <p>Across all recorded payments</p>
        </article>

        <article className="payments-summary-card">
          <div className="payments-summary-top">
            <span>Total Payments</span>
            <div className="payments-summary-icon">
              <EyeIcon />
            </div>
          </div>
          <h2>{payments.length}</h2>
          <p>Individual payment records</p>
        </article>

        <article className="payments-summary-card">
          <div className="payments-summary-top">
            <span>Received This Month</span>
            <div className="payments-summary-icon">
              <ReceiptIcon />
            </div>
          </div>
          <h2>{formatCurrency(totalThisMonth)}</h2>
          <p>{thisMonthPayments.length} payments this month</p>
        </article>

        <article className="payments-summary-card">
          <div className="payments-summary-top">
            <span>Payment Methods</span>
            <div className="payments-summary-icon">
              <ReceiptIcon />
            </div>
          </div>
          <h2>{paymentMethodCount}</h2>
          <p>Methods used in recorded payments</p>
        </article>
      </section>

      <section className="payments-list-section">
        <div className="payments-list-heading">
          <div>
            <h2>Payment History</h2>
            <p>View and search individual payment records.</p>
          </div>
          <span className="payments-record-count">
            {filteredPayments.length} records
          </span>
        </div>

        <div className="payments-filters">
          <div className="payments-search-wrapper">
            <label htmlFor="payments-search">Search payments</label>
            <input
              id="payments-search"
              type="search"
              placeholder="Search reference, client, invoice..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="payments-filter-field">
            <label htmlFor="payments-method-filter">Payment Method</label>
            <select
              id="payments-method-filter"
              value={selectedMethod}
              onChange={(event) => setSelectedMethod(event.target.value)}
            >
              <option>All Methods</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="payments-filter-field">
            <label htmlFor="payments-date-filter">Date</label>
            <select
              id="payments-date-filter"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            >
              <option>All Time</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment Reference</th>
                <th>Invoice</th>
                <th>Client / Project</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <span className="payments-reference">
                      {payment.reference}
                    </span>
                  </td>
                  <td>{payment.invoiceNumber}</td>
                  <td>
                    <div className="payments-client-cell">
                      <strong>{payment.client}</strong>
                      <span>{payment.project}</span>
                    </div>
                  </td>
                  <td>{formatDate(payment.paymentDate)}</td>
                  <td>
                    <span className="payments-method-badge">
                      {payment.method}
                    </span>
                  </td>
                  <td className="payments-amount-cell">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="payments-icon-button"
                      aria-label={`View payment ${payment.reference}`}
                      title="View payment"
                      onClick={() => handleViewPayment(payment)}
                    >
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="payments-empty-state">
              <div className="payments-empty-icon">
                <ReceiptIcon />
              </div>
              <h3>No payments found</h3>
              <p>
                Try changing your search or filters to find a payment.
              </p>
              <button
                type="button"
                className="payments-secondary-button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedMethod("All Methods");
                  setDateFilter("All Time");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Payments;
