
import "./AuthLayout.css";
import { BriefcaseBusiness } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <header className="auth-layout__header">
        <div className="auth-layout__brand">
          <div className="auth-layout__logo">
            <BriefcaseBusiness size={24} strokeWidth={1.8} />
          </div>

          <div className="auth-layout__brand-text">
            <h1 className="auth-layout__brand-name">
              SoloDesk
            </h1>

            <p className="auth-layout__brand-tagline">
              YOUR FREELANCE WORKSPACE
            </p>
          </div>
        </div>
      </header>

      <main className="auth-layout__main">
        <section className="auth-layout__content">
          {children}
        </section>
      </main>

      <footer className="auth-layout__footer">
        <p>
          Built for your independent journey.
        </p>
      </footer>
    </div>
  );
}

export default AuthLayout;
