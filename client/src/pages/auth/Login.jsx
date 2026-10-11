
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";

import "./Login.css";

function Login({ onNavigate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
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
    }));

    setMessage("");
  }

  function validateForm() {
    const newErrors = {};
    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (isLoading || !validateForm()) {
      return;
    }

    setIsLoading(true);

    // Temporary frontend demo.
    // Real credential verification will be implemented later.
    setTimeout(() => {
      setIsLoading(false);

      if (onNavigate) {
        onNavigate("workspace");
      } else {
        setMessage(
          "Login demo complete. Workspace navigation is unavailable."
        );
      }
    }, 500);
  }

  function navigateTo(page) {
    if (onNavigate) {
      onNavigate(page);
    }
  }

  return (
    <AuthLayout>
      <div className="login">
        <div className="login__heading">
          <span className="login__eyebrow">
            YOUR WORKSPACE AWAITS
          </span>

          <h2 className="login__title">Welcome back</h2>

          <p className="login__description">
            Sign in to manage your clients, projects, and
            freelance business.
          </p>
        </div>

        {message && (
          <div className="login__message" role="status">
            <CheckCircle2 size={19} />
            <p>{message}</p>
          </div>
        )}

        <form
          className="login__form"
          onSubmit={handleSubmit}
        >
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
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            required
            disabled={isLoading}
          />

          <div className="login__options">
            <label className="login__remember">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="login__text-button"
              onClick={() => navigateTo("forgot")}
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="login__submit"
            disabled={isLoading}
          >
            <span>
              {isLoading ? "Please wait..." : "Log in"}
            </span>

            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="login__register">
          <p>Don't have an account?</p>

          <button
            type="button"
            className="login__text-button login__register-link"
            onClick={() => navigateTo("register")}
          >
            Create an account
          </button>
        </div>

        <p className="login__security-note">
          Your independent business, organised in one place.
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;
