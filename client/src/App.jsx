
import { useState } from "react";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/dashboard/Dashboard";
import BusinessModule from "./pages/modules/BusinessModule";
import Clients from "./pages/clients/Clients";
import Leads from "./pages/leads/Leads";
import Deals from "./pages/deals/Deals";
import Projects from "./pages/projects/Projects";
import Tasks from "./pages/tasks/Tasks";
import Milestones from "./pages/milestones/Milestones";
import Approvals from "./pages/approvals/Approvals";
import Invoices from "./pages/invoices/Invoices";
import Payments from "./pages/payments/Payments";
import Profile from "./pages/settings/Profile";
import AccountSettings from "./pages/settings/AccountSettings";

import "./App.css";

const pageDetails = {
  Dashboard: {
    subtitle: "Here's what's happening with your business.",
    showNewAction: true,
    newActionLabel: "New Project",
  },
  Clients: {
    subtitle: "Manage your client relationships.",
  },
  Leads: {
    subtitle: "Keep track of potential clients.",
  },
  "Deals & Proposals": {
    subtitle: "Manage deals, proposals, and agreements.",
  },
  Projects: {
    subtitle: "Organise and track your active projects.",
    showNewAction: true,
    newActionLabel: "New Project",
  },
  Tasks: {
    subtitle: "Keep your work organised and on schedule.",
  },
  Milestones: {
    subtitle: "Track important project deliverables.",
  },
  Approvals: {
    subtitle: "Review submissions, feedback, and revisions.",
  },
  Invoices: {
    subtitle: "Manage invoices and outstanding balances.",
    showNewAction: true,
    newActionLabel: "New Invoice",
  },
  Payments: {
    subtitle: "Track received payments and payment history.",
  },
  "My Profile": {
    subtitle: "Manage your personal information and professional details.",
  },
  Settings: {
    subtitle: "Manage your account and preferences.",
  },
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  // Temporary frontend-only authentication state.
  const [appMode, setAppMode] = useState("auth");
  const [authPage, setAuthPage] = useState("login");

  const activePageDetails = pageDetails[activePage] ?? {
    subtitle: "Manage your freelance business.",
  };

  function handleAuthNavigate(page) {
    if (page === "workspace") {
      setActivePage("Dashboard");
      setAppMode("workspace");
      return;
    }

    setAuthPage(page);
  }

  function handleNewAction() {
    alert(
      `${activePageDetails.newActionLabel ?? "New action"} clicked`
    );
  }

  function handleSignOut() {
    setAuthPage("login");
    setAppMode("auth");
  }

  // Show authentication screens before entering the workspace.
  if (appMode === "auth") {
    let authScreen;

    switch (authPage) {
      case "register":
        authScreen = (
          <Register onNavigate={handleAuthNavigate} />
        );
        break;

      case "forgot":
        authScreen = (
          <ForgotPassword onNavigate={handleAuthNavigate} />
        );
        break;

      case "reset":
        authScreen = (
          <ResetPassword onNavigate={handleAuthNavigate} />
        );
        break;

      case "login":
      default:
        authScreen = (
          <Login onNavigate={handleAuthNavigate} />
        );
        break;
    }

    return (
      <>
        {authScreen}

        <button
          type="button"
          className="app-preview-switch"
          onClick={() => handleAuthNavigate("workspace")}
        >
          Preview workspace
        </button>
      </>
    );
  }

  // Show the existing SoloDesk application layout.
  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="app-workspace">
        <Navbar
          title={activePage}
          subtitle={activePageDetails.subtitle}
          showNewAction={
            activePageDetails.showNewAction ?? false
          }
          newActionLabel={
            activePageDetails.newActionLabel ?? "New"
          }
          onNewAction={handleNewAction}
          onProfileClick={() => setActivePage("My Profile")}
          onSettingsClick={() => setActivePage("Settings")}
          onSignOut={handleSignOut}
        />

        <div className="app-main">
          {activePage === "Projects" ? (
            <Projects />
          ) : activePage === "Deals & Proposals" ? (
            <Deals />
          ) : activePage === "Clients" ? (
            <Clients />
          ) : activePage === "Leads" ? (
            <Leads />
          ) : activePage === "Dashboard" ? (
            <Dashboard />
          ) : activePage === "Tasks" ? (
            <Tasks />
          ) : activePage === "Milestones" ? (
            <Milestones />
          ) : activePage === "Approvals" ? (
            <Approvals />
          ) : activePage === "Invoices" ? (
            <Invoices />
          ) : activePage === "Payments" ? (
            <Payments />
          ) : activePage === "My Profile" ? (
            <Profile />
          ) : activePage === "Settings" ? (
  <AccountSettings />
) :(
            <BusinessModule activePage={activePage} />
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;
