
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import "./ForgotPassword.css";

function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    setEmail(event.target.value);
    setError("");
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Mock recovery request. No email is sent.
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 800);
  }

  return (
    <AuthLayout>
      <div className="forgot-password">
        {!submitted ? (
          <>
            <div className="forgot-password__icon">
              <Mail size={25} strokeWidth={1.7} />
            </div>

            <div className="forgot-password__heading">
              <span className="forgot-password__eyebrow">
                ACCOUNT RECOVERY
              </span>

              <h2 className="forgot-password__title">
                Forgot your password?
              </h2>

              <p className="forgot-password__description">
                No worries. Enter the email address associated
                with your account and we'll guide you through
                the recovery process.
              </p>
            </div>

            <form
              className="forgot-password__form"
              onSubmit={handleSubmit}
            >
              <AuthInput
                label="Email address"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                error={error}
                required
                disabled={isLoading}
              />

              <button
                type="submit"
                className="forgot-password__submit"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Continue"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>
          </>
        ) : (
          <div className="forgot-password__success">
            <div className="forgot-password__success-icon">
              <CheckCircle2 size={30} />
            </div>

            <h2 className="forgot-password__title">
              Request received
            </h2>

            <p className="forgot-password__description">
              This is a demonstration of the recovery flow for{" "}
              <strong>{email.trim()}</strong>. No email has been
              sent. You can preview the reset-password screen next.
            </p>

            <button
              type="button"
              className="forgot-password__submit"
              onClick={() => onNavigate?.("reset")}
            >
              Preview reset password
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="forgot-password__back"
              onClick={() => onNavigate?.("login")}
            >
              <ArrowLeft size={16} />
              Back to login
            </button>
          </div>
        )}

        {!submitted && (
          <button
            type="button"
            className="forgot-password__back"
            onClick={() => onNavigate?.("login")}
          >
            <ArrowLeft size={16} />
            Back to login
          </button>
        )}
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
