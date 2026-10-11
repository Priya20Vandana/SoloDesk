
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./AuthInput.css";

function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  autoComplete,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType =
    isPassword && showPassword ? "text" : type;

  const inputId = `auth-input-${name}`;
  const errorId = `${inputId}-error`;

  return (
    <div className="auth-input">
      <label
        className="auth-input__label"
        htmlFor={inputId}
      >
        {label}
        {required && (
          <span className="auth-input__required"> *</span>
        )}
      </label>

      <div
        className={`auth-input__field-wrapper ${
          error ? "auth-input__field-wrapper--error" : ""
        }`}
      >
        <input
          id={inputId}
          className="auth-input__field"
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />

        {isPassword && (
          <button
            className="auth-input__visibility-button"
            type="button"
            onClick={() =>
              setShowPassword((previous) => !previous)
            }
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            aria-pressed={showPassword}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff size={19} strokeWidth={1.8} />
            ) : (
              <Eye size={19} strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          className="auth-input__error"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthInput;
