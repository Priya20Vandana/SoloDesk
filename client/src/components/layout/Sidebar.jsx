
import {
  LayoutDashboard,
  UsersRound,
  UserRoundSearch,
  Handshake,
  FolderKanban,
  ListTodo,
  Milestone,
  ClipboardCheck,
  ReceiptText,
  CreditCard,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import "./Sidebar.css";

const navigationGroups = [
  {
    label: "WORKSPACE",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "CLIENT MANAGEMENT",
    items: [
      {
        label: "Clients",
        icon: UsersRound,
      },
      {
        label: "Leads",
        icon: UserRoundSearch,
      },
      {
        label: "Deals & Proposals",
        icon: Handshake,
      },
    ],
  },
  {
    label: "PROJECT MANAGEMENT",
    items: [
      {
        label: "Projects",
        icon: FolderKanban,
      },
      {
        label: "Tasks",
        icon: ListTodo,
      },
      {
        label: "Milestones",
        icon: Milestone,
      },
      {
        label: "Approvals",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    label: "FINANCE",
    items: [
      {
        label: "Invoices",
        icon: ReceiptText,
      },
      {
        label: "Payments",
        icon: CreditCard,
      },
    ],
  },
];

function Sidebar({
  activePage = "Dashboard",
  onNavigate,
}) {
  const [unused] = [];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">S</div>

        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">SoloDesk</span>
          <span className="sidebar-brand-caption">
            FREELANCER WORKSPACE
          </span>
        </div>
      </div>

      <nav className="sidebar-navigation" aria-label="Main navigation">
        {navigationGroups.map((group) => (
          <div className="sidebar-group" key={group.label}>
            <p className="sidebar-group-label">{group.label}</p>

            <div className="sidebar-group-items">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.label;

                return (
                  <button
                    type="button"
                    key={item.label}
                    className={`sidebar-link ${
                      isActive ? "is-active" : ""
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onNavigate?.(item.label)}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className={`sidebar-link sidebar-settings-link ${
            activePage === "Settings" ? "is-active" : ""
          }`}
          aria-current={activePage === "Settings" ? "page" : undefined}
          onClick={() => onNavigate?.("Settings")}
        >
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </button>

        <div className="sidebar-workspace-card">
          <div className="sidebar-workspace-avatar">A</div>

          <div className="sidebar-workspace-info">
            <span className="sidebar-workspace-name">
              Alex's Workspace
            </span>
            <span className="sidebar-workspace-plan">
              Personal account
            </span>
          </div>

          <span className="sidebar-workspace-status" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
