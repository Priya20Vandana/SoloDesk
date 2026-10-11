
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import "./Register.css";

function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      ...(name === "password" ? { confirmPassword: "" } : {}),
    }));

    setMessage("");
  }

  function validateForm() {
    const newErrors = {};
    const email = formData.email.trim();

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Use at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.terms) {
      newErrors.terms = "Please accept the terms to continue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (isLoading || !validateForm()) return;

    setIsLoading(true);

    // Mock registration only. No account is created.
    setTimeout(() => {
      setIsLoading(false);
      setMessage(
        "Registration demo complete! Real account creation will be connected later."
      );
    }, 800);
  }

  return (
    <AuthLayout>
      <div className="register">
        <div className="register__heading">
          <span className="register__eyebrow">
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h2 className="register__title">Create your account</h2>

          <p className="register__description">
            Bring your clients, projects, and freelance business
            together in one workspace.
          </p>
        </div>

        {message && (
          <div className="register__message" role="status">
            <CheckCircle2 size={19} />
            <p>{message}</p>
          </div>
        )}

        <form className="register__form" onSubmit={handleSubmit}>
          <AuthInput
            label="Full name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            autoComplete="name"
            error={errors.fullName}
            required
            disabled={isLoading}
          />

          <AuthInput
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email}
            required
            disabled={isLoading}
          />

          <AuthInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password}
            required
            disabled={isLoading}
          />

          <AuthInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Enter your password again"
            autoComplete="new-password"
            error={errors.confirmPassword}
            required
            disabled={isLoading}
          />

          <div className="register__terms-group">
            <label className="register__terms">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={Boolean(errors.terms)}
              />

              <span>
                I agree to the{" "}
                <button
                  type="button"
                  className="register__terms-link"
                  onClick={() =>
                    setMessage(
                      "Terms and conditions are a placeholder for now."
                    )
                  }
                >
                  Terms and Conditions
                </button>
                .
              </span>
            </label>

            {errors.terms && (
              <p className="register__error" role="alert">
                {errors.terms}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="register__submit"
            disabled={isLoading}
          >
            <span>
              {isLoading ? "Creating account..." : "Create account"}
            </span>

            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="register__login">
          <p>Already have an account?</p>

          <button
            type="button"
            className="register__text-button"
            onClick={() => onNavigate?.("login")}
          >
            Log in
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;
