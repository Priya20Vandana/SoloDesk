
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  UserRound,
  Settings,
  LogOut,
  CheckCheck,
  Clock3,
  X,
} from "lucide-react";
import "./Navbar.css";

const mockNotifications = [
  {
    id: 1,
    title: "New project milestone",
    message: "Website Redesign is ready for review.",
    time: "10 min ago",
    type: "project",
    unread: true,
  },
  {
    id: 2,
    title: "Invoice payment received",
    message: "Your payment of ₹12,500 has been recorded.",
    time: "1 hour ago",
    type: "payment",
    unread: true,
  },
  {
    id: 3,
    title: "Task deadline approaching",
    message: "Landing Page Design is due tomorrow.",
    time: "3 hours ago",
    type: "task",
    unread: false,
  },
];

export default function Navbar({
  title = "Dashboard",
  subtitle = "Here's what's happening with your business.",
  showNewAction = false,
  newActionLabel = "New",
  onNewAction,
  onProfileClick,
  onSettingsClick,
  onSignOut,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [notifications, setNotifications] = useState(
    mockNotifications
  );

  const navbarRef = useRef(null);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setActiveMenu(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function toggleMenu(menuName) {
    setActiveMenu((currentMenu) =>
      currentMenu === menuName ? null : menuName
    );
  }

  function markAllAsRead() {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  function handleProfileAction(callback) {
    setActiveMenu(null);
    callback?.();
  }

  return (
    <header className="navbar" ref={navbarRef}>
      <div className="navbar-heading">
        <div className="navbar-page-title">{title}</div>

        {subtitle && (
          <p className="navbar-page-subtitle">{subtitle}</p>
        )}
      </div>

      <div className="navbar-actions">
        <label className="navbar-search">
          <Search
            className="navbar-search-icon"
            size={18}
            aria-hidden="true"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search anything..."
            aria-label="Search SoloDesk"
          />

          {searchQuery && (
            <button
              type="button"
              className="navbar-search-clear"
              aria-label="Clear search"
              onClick={() => setSearchQuery("")}
            >
              <X size={15} />
            </button>
          )}
        </label>

        {showNewAction && (
          <button
            type="button"
            className="navbar-new-button"
            onClick={onNewAction}
          >
            <Plus size={17} />
            <span>{newActionLabel}</span>
          </button>
        )}

        {/* Notifications */}
        <div className="navbar-menu-wrapper">
          <button
            type="button"
            className={`navbar-icon-button ${
              activeMenu === "notifications" ? "is-active" : ""
            }`}
            onClick={() => toggleMenu("notifications")}
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={activeMenu === "notifications"}
            aria-haspopup="true"
          >
            <Bell size={20} strokeWidth={1.8} />

            {unreadCount > 0 && (
              <span className="navbar-notification-dot" />
            )}
          </button>

          {activeMenu === "notifications" && (
            <div
              className="navbar-dropdown navbar-notifications-dropdown"
              role="region"
              aria-label="Notifications"
            >
              <div className="navbar-dropdown-header">
                <div>
                  <h3>Notifications</h3>
                  <p>
                    {unreadCount > 0
                      ? `${unreadCount} unread updates`
                      : "You're all caught up"}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="navbar-text-button"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck size={15} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="navbar-notification-list">
                {notifications.map((notification) => (
                  <div
                    className={`navbar-notification-item ${
                      notification.unread ? "is-unread" : ""
                    }`}
                    key={notification.id}
                  >
                    <span
                      className={`navbar-notification-marker marker-${notification.type}`}
                    >
                      {notification.type === "payment" ? "₹" : ""}
                    </span>

                    <div className="navbar-notification-content">
                      <div className="navbar-notification-title">
                        {notification.title}
                      </div>

                      <p>{notification.message}</p>

                      <span className="navbar-notification-time">
                        <Clock3 size={12} />
                        {notification.time}
                      </span>
                    </div>

                    {notification.unread && (
                      <span
                        className="navbar-unread-indicator"
                        aria-label="Unread"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="navbar-dropdown-footer">
                <span>You're viewing recent updates</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="navbar-profile-wrapper">
          <button
            type="button"
            className={`navbar-profile-button ${
              activeMenu === "profile" ? "is-active" : ""
            }`}
            onClick={() => toggleMenu("profile")}
            aria-expanded={activeMenu === "profile"}
            aria-haspopup="true"
          >
            <span className="navbar-avatar" aria-hidden="true">
              A
            </span>

            <span className="navbar-profile-details">
              <span className="navbar-profile-name">
                Alex Morgan
              </span>

              <span className="navbar-profile-role">
                Freelancer
              </span>
            </span>

            <ChevronDown
              className={`navbar-profile-chevron ${
                activeMenu === "profile" ? "is-rotated" : ""
              }`}
              size={16}
            />
          </button>

          {activeMenu === "profile" && (
            <div
              className="navbar-dropdown navbar-profile-dropdown"
              role="menu"
              aria-label="Profile menu"
            >
              <div className="navbar-profile-dropdown-header">
                <span className="navbar-avatar navbar-avatar-large">
                  A
                </span>

                <div>
                  <strong>Alex Morgan</strong>
                  <span>alex.morgan@example.com</span>
                </div>
              </div>

              <div className="navbar-dropdown-divider" />

              <button
                type="button"
                className="navbar-menu-item"
                role="menuitem"
                onClick={() =>
                  handleProfileAction(onProfileClick)
                }
              >
                <UserRound size={17} />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className="navbar-menu-item"
                role="menuitem"
                onClick={() =>
                  handleProfileAction(onSettingsClick)
                }
              >
                <Settings size={17} />
                <span>Account Settings</span>
              </button>

              <div className="navbar-dropdown-divider" />

              <button
                type="button"
                className="navbar-menu-item navbar-signout-item"
                role="menuitem"
                onClick={() =>
                  handleProfileAction(onSignOut)
                }
              >
                <LogOut size={17} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
