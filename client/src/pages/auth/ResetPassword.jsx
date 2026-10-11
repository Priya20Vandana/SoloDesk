
import { useState } from "react";
import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import "./ResetPassword.css";

function ResetPassword({ onNavigate }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      ...(name === "password" ? { confirmPassword: "" } : {}),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "New password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Use at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || isLoading) {
      return;
    }

    setIsLoading(true);

    // Mock reset only. No password is changed or stored.
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
  }

  return (
    <AuthLayout>
      <div className="reset-password">
        {!isSuccess ? (
          <>
            <div className="reset-password__icon">
              <LockKeyhole size={25} strokeWidth={1.7} />
            </div>

            <div className="reset-password__heading">
              <span className="reset-password__eyebrow">
                ACCOUNT SECURITY
              </span>

              <h2 className="reset-password__title">
                Set a new password
              </h2>

              <p className="reset-password__description">
                Choose a strong password to help keep your
                freelance workspace secure.
              </p>
            </div>

            <form
              className="reset-password__form"
              onSubmit={handleSubmit}
            >
              <AuthInput
                label="New password"
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
                label="Confirm new password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your new password again"
                autoComplete="new-password"
                error={errors.confirmPassword}
                required
                disabled={isLoading}
              />

              <div className="reset-password__guidance">
                <span className="reset-password__guidance-title">
                  Password requirements
                </span>

                <span
                  className={
                    formData.password.length >= 8
                      ? "reset-password__requirement reset-password__requirement--met"
                      : "reset-password__requirement"
                  }
                >
                  <CheckCircle2 size={15} />
                  At least 8 characters
                </span>

                <span
                  className={
                    formData.password &&
                    formData.password === formData.confirmPassword
                      ? "reset-password__requirement reset-password__requirement--met"
                      : "reset-password__requirement"
                  }
                >
                  <CheckCircle2 size={15} />
                  Passwords match
                </span>
              </div>

              <button
                type="submit"
                className="reset-password__submit"
                disabled={isLoading}
              >
                {isLoading ? "Resetting password..." : "Reset password"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>
          </>
        ) : (
          <div className="reset-password__success">
            <div className="reset-password__icon reset-password__icon--success">
              <CheckCircle2 size={30} />
            </div>

            <h2 className="reset-password__title">
              You're all set!
            </h2>

            <p className="reset-password__description">
              The reset flow demo is complete. No real password
              was changed. In the finished application, this is
              where you'd confirm a successful password reset.
            </p>

            <button
              type="button"
              className="reset-password__submit"
              onClick={() => onNavigate?.("login")}
            >
              Return to login
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;
