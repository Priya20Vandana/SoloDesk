
import { useState } from "react";
import "./Profile.css";

const initialProfile = {
  fullName: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+91 98765 43210",
  jobTitle: "Freelance UI/UX Designer",
  location: "Pune, India",
  bio: "I help businesses create intuitive digital experiences through thoughtful design and user-focused solutions.",
};

function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
  };

  const handleEdit = () => {
    setFormData({ ...profile });
    setIsEditing(true);
    setMessage("");
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = formData.email.trim();

    if (!formData.fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setProfile({
      ...formData,
      fullName: formData.fullName.trim(),
      email: normalizedEmail,
      phone: formData.phone.trim(),
      jobTitle: formData.jobTitle.trim(),
      location: formData.location.trim(),
      bio: formData.bio.trim(),
    });

    setIsEditing(false);
    setMessage("Profile updated successfully.");
  };

  const getInitials = (name) => {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  };

  return (
    <main className="profile-page">
      <header className="profile-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information and professional details.</p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="profile-primary-button"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        )}
      </header>

      {message && (
        <div
          className={`profile-message ${
            isEditing ? "profile-message-error" : "profile-message-success"
          }`}
          role="status"
        >
          {message}
        </div>
      )}

      <section className="profile-card">
        <div className="profile-card-heading">
          <h2>Personal Information</h2>
          <p>Your personal and professional details.</p>
        </div>

        <div className="profile-identity">
          <div className="profile-avatar" aria-label="Profile initials">
            {getInitials(profile.fullName)}
          </div>

          <div className="profile-identity-details">
            <h3>{profile.fullName}</h3>
            <p>{profile.jobTitle || "Add your professional title"}</p>
            <span>{profile.email}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-form-grid">
            <div className="profile-form-field">
              <label htmlFor="profile-fullName">Full Name *</label>
              <input
                id="profile-fullName"
                name="fullName"
                type="text"
                value={isEditing ? formData.fullName : profile.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                required
                autoComplete="name"
                placeholder="Enter your full name"
              />
            </div>

            <div className="profile-form-field">
              <label htmlFor="profile-email">Email Address *</label>
              <input
                id="profile-email"
                name="email"
                type="email"
                value={isEditing ? formData.email : profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
                autoComplete="email"
                placeholder="Enter your email address"
              />
            </div>

            <div className="profile-form-field">
              <label htmlFor="profile-phone">Phone Number</label>
              <input
                id="profile-phone"
                name="phone"
                type="tel"
                value={isEditing ? formData.phone : profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                autoComplete="tel"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="profile-form-field">
              <label htmlFor="profile-jobTitle">Professional Title</label>
              <input
                id="profile-jobTitle"
                name="jobTitle"
                type="text"
                value={isEditing ? formData.jobTitle : profile.jobTitle}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. Freelance Web Developer"
              />
            </div>

            <div className="profile-form-field profile-form-field-full">
              <label htmlFor="profile-location">Location</label>
              <input
                id="profile-location"
                name="location"
                type="text"
                value={isEditing ? formData.location : profile.location}
                onChange={handleChange}
                disabled={!isEditing}
                autoComplete="address-level2"
                placeholder="Enter your city and country"
              />
            </div>

            <div className="profile-form-field profile-form-field-full">
              <label htmlFor="profile-bio">Professional Bio</label>
              <textarea
                id="profile-bio"
                name="bio"
                value={isEditing ? formData.bio : profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                maxLength={500}
                placeholder="Tell clients a little about yourself..."
              />
              <span className="profile-character-count">
                {(isEditing ? formData.bio : profile.bio).length}/500
                characters
              </span>
            </div>
          </div>

          {isEditing && (
            <div className="profile-form-actions">
              <button
                type="button"
                className="profile-secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button type="submit" className="profile-primary-button">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}

export default Profile;
