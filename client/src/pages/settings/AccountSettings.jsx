
import { useState } from "react";
import "./AccountSettings.css";

const initialSettings = {
  businessName: "Alex Morgan Design Studio",
  businessEmail: "alex.morgan@example.com",
  businessAddress: "Pune, Maharashtra, India",
  currency: "INR",
  timeZone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  emailPayments: true,
  emailProjects: true,
  emailTasks: true,
  emailApprovals: true,
};

function AccountSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [formData, setFormData] = useState(initialSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  function handleSettingsChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  }

  function handleEdit() {
    setFormData({ ...settings });
    setIsEditing(true);
    setMessage("");
  }

  function handleCancel() {
    setFormData({ ...settings });
    setIsEditing(false);
    setMessage("");
  }

  function handleSettingsSubmit(event) {
    event.preventDefault();

    if (
      !formData.businessName.trim() ||
      !formData.businessEmail.trim()
    ) {
      setMessage("Business name and email are required.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.businessEmail.trim()
      )
    ) {
      setMessage("Please enter a valid business email.");
      return;
    }

    setSettings({
      ...formData,
      businessName: formData.businessName.trim(),
      businessEmail: formData.businessEmail.trim(),
      businessAddress: formData.businessAddress.trim(),
    });

    setIsEditing(false);
    setMessage("Account settings saved successfully.");
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage("");
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();

    const { currentPassword, newPassword, confirmPassword } =
      passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage(
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordMessage(
        "Your new password must be different from your current password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("The new passwords do not match.");
      return;
    }

    setPasswordMessage(
      "Password form validated. Actual password changes will be available after backend authentication is implemented."
    );

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  return (
    <main className="account-settings-page">
      <header className="account-settings-header">
        <div>
          <h1>Account Settings</h1>
          <p>
            Manage your business details, preferences, and security.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="account-primary-button"
            onClick={handleEdit}
          >
            Edit Settings
          </button>
        )}
      </header>

      {message && (
        <div
          className={`account-message ${
            message.includes("successfully")
              ? "account-message-success"
              : "account-message-error"
          }`}
          role="status"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSettingsSubmit}>
        <section className="account-settings-card">
          <div className="account-card-heading">
            <h2>Business Information</h2>
            <p>Details used to identify your freelance business.</p>
          </div>

          <div className="account-form-grid">
            <div className="account-form-field">
              <label htmlFor="businessName">Business Name *</label>
              <input
                id="businessName"
                name="businessName"
                value={isEditing ? formData.businessName : settings.businessName}
                onChange={handleSettingsChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="account-form-field">
              <label htmlFor="businessEmail">Business Email *</label>
              <input
                id="businessEmail"
                name="businessEmail"
                type="email"
                value={isEditing ? formData.businessEmail : settings.businessEmail}
                onChange={handleSettingsChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="account-form-field account-field-full">
              <label htmlFor="businessAddress">Business Address</label>
              <textarea
                id="businessAddress"
                name="businessAddress"
                rows={2}
                value={isEditing ? formData.businessAddress : settings.businessAddress}
                onChange={handleSettingsChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </section>

        <section className="account-settings-card">
          <div className="account-card-heading">
            <h2>Regional Preferences</h2>
            <p>Choose how currency, dates, and times are displayed.</p>
          </div>

          <div className="account-form-grid">
            <div className="account-form-field">
              <label htmlFor="currency">Default Currency</label>
              <select
                id="currency"
                name="currency"
                value={isEditing ? formData.currency : settings.currency}
                onChange={handleSettingsChange}
                disabled={!isEditing}
              >
                <option value="INR">INR — Indian Rupee (₹)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="EUR">EUR — Euro (€)</option>
                <option value="GBP">GBP — British Pound (£)</option>
              </select>
            </div>

            <div className="account-form-field">
              <label htmlFor="timeZone">Time Zone</label>
              <select
                id="timeZone"
                name="timeZone"
                value={isEditing ? formData.timeZone : settings.timeZone}
                onChange={handleSettingsChange}
                disabled={!isEditing}
              >
                <option value="Asia/Kolkata">
                  India Standard Time (IST)
                </option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
                <option value="Europe/London">London</option>
                <option value="America/New_York">New York</option>
                <option value="America/Los_Angeles">Los Angeles</option>
              </select>
            </div>

            <div className="account-form-field">
              <label htmlFor="dateFormat">Date Format</label>
              <select
                id="dateFormat"
                name="dateFormat"
                value={isEditing ? formData.dateFormat : settings.dateFormat}
                onChange={handleSettingsChange}
                disabled={!isEditing}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </section>

        <section className="account-settings-card">
          <div className="account-card-heading">
            <h2>Notification Preferences</h2>
            <p>Choose which email updates you want to receive.</p>
          </div>

          <div className="account-notification-list">
            {[
              {
                name: "emailPayments",
                title: "Payment Updates",
                description: "Notifications when payments are recorded.",
              },
              {
                name: "emailProjects",
                title: "Project Updates",
                description: "Important changes to your projects.",
              },
              {
                name: "emailTasks",
                title: "Task Deadlines",
                description: "Reminders about upcoming task deadlines.",
              },
              {
                name: "emailApprovals",
                title: "Approval Updates",
                description: "Updates on approvals and requested revisions.",
              },
            ].map((item) => (
              <label
                className="account-notification-row"
                key={item.name}
              >
                <span className="account-notification-copy">
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </span>

                <input
                  type="checkbox"
                  name={item.name}
                  checked={
                    isEditing ? formData[item.name] : settings[item.name]
                  }
                  onChange={handleSettingsChange}
                  disabled={!isEditing}
                />
              </label>
            ))}
          </div>
        </section>

        {isEditing && (
          <div className="account-form-actions">
            <button
              type="button"
              className="account-secondary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="account-primary-button"
            >
              Save Settings
            </button>
          </div>
        )}
      </form>

      <section className="account-settings-card">
        <div className="account-card-heading">
          <h2>Password and Security</h2>
          <p>Manage your account password.</p>
        </div>

        <form
          className="account-password-form"
          onSubmit={handlePasswordSubmit}
        >
          <div className="account-form-field">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords ? "text" : "password"}
              autoComplete="current-password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="account-form-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="account-form-field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
            />
          </div>

          <label className="account-show-password">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(event) =>
                setShowPasswords(event.target.checked)
              }
            />
            Show passwords
          </label>

          {passwordMessage && (
            <div
              className={`account-message ${
                passwordMessage.startsWith("Password form validated")
                  ? "account-message-success"
                  : "account-message-error"
              }`}
              role="status"
            >
              {passwordMessage}
            </div>
          )}

          <div className="account-form-actions">
            <button
              type="submit"
              className="account-primary-button"
            >
              Validate Password Change
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AccountSettings;
