import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaEnvelope,
  FaExternalLinkAlt,
  FaFileAlt,
  FaSearch,
  FaSignOutAlt,
  FaStethoscope,
  FaTachometerAlt,
  FaThLarge,
  FaUndo,
  FaUserMd,
} from "react-icons/fa";
import {
  deleteAppointment,
  deleteMessage,
  fetchAppointments,
  fetchMessages,
  fetchSiteContent,
  resetSiteContent,
  updateAppointmentStatus,
  updateMessageStatus,
  updateSiteContent,
} from "../api/adminApi";
import { useAuth } from "../context/auth-hooks";
import { createContentItemId } from "../data/siteContent";
import "./AdminPanel.css";

const iconOptions = [
  { value: "heartbeat", label: "Heartbeat" },
  { value: "home", label: "Home" },
  { value: "calendar", label: "Calendar" },
  { value: "doctor", label: "Doctor" },
  { value: "users", label: "Users" },
  { value: "injured", label: "Injury" },
  { value: "running", label: "Running" },
  { value: "dumbbell", label: "Dumbbell" },
];

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: FaTachometerAlt },
  { id: "content", label: "Site Content", icon: FaFileAlt },
  { id: "homepage", label: "Homepage Sections", icon: FaThLarge },
  { id: "services", label: "Services", icon: FaStethoscope },
  { id: "doctors", label: "Doctors", icon: FaUserMd },
  { id: "appointments", label: "Appointments", icon: FaCalendarCheck },
  { id: "messages", label: "Messages", icon: FaEnvelope },
];

const SAVABLE_TABS = new Set(["content", "homepage", "services", "doctors"]);

const createQuickStat = () => ({
  id: createContentItemId("stat"),
  icon: "heartbeat",
  label: "New quick stat",
});

const createFeature = () => ({
  id: createContentItemId("feature"),
  icon: "heartbeat",
  title: "New feature",
  description: "Add a short explanation for this feature.",
});

const createService = () => ({
  id: createContentItemId("service"),
  icon: "heartbeat",
  title: "New service",
  description: "Add the homepage service summary.",
  details: "Add the detailed service explanation for the services page.",
  featured: false,
});

const createDoctor = () => ({
  id: createContentItemId("doctor"),
  name: "New doctor",
  role: "Physiotherapist",
  days: "Monday to Friday",
  hours: "10:00 A.M.-6:00 P.M.",
});

const formatDate = (value) => {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const SiteContentForm = ({ content, onChange }) => (
  <section className="admin-card admin-card-clinic">
    <div className="admin-card-head">
      <span className="admin-section-tag">Content System</span>
      <h2>Clinic Settings</h2>
      <p>These fields power the homepage, about page, contact page, and footer.</p>
    </div>
    <div className="admin-form-grid">
      <label>
        Clinic name
        <input value={content.clinicName} onChange={(e) => onChange("clinicName", e.target.value)} />
      </label>
      <label>
        Phone
        <input value={content.phone} onChange={(e) => onChange("phone", e.target.value)} />
      </label>
      <label>
        Email
        <input value={content.email} onChange={(e) => onChange("email", e.target.value)} />
      </label>
      <label>
        Address
        <input value={content.address} onChange={(e) => onChange("address", e.target.value)} />
      </label>
      <label className="admin-span-2">
        Footer / clinic description
        <textarea
          rows="3"
          value={content.clinicDescription}
          onChange={(e) => onChange("clinicDescription", e.target.value)}
        />
      </label>
      <label className="admin-span-2">
        Hero title
        <input value={content.heroTitle} onChange={(e) => onChange("heroTitle", e.target.value)} />
      </label>
      <label className="admin-span-2">
        Hero description
        <textarea
          rows="3"
          value={content.heroDescription}
          onChange={(e) => onChange("heroDescription", e.target.value)}
        />
      </label>
      <label className="admin-span-2">
        Homepage about title
        <input value={content.aboutTitle} onChange={(e) => onChange("aboutTitle", e.target.value)} />
      </label>
      <label className="admin-span-2">
        Homepage about description
        <textarea
          rows="3"
          value={content.aboutDescription}
          onChange={(e) => onChange("aboutDescription", e.target.value)}
        />
      </label>
      <label className="admin-span-2">
        About page title
        <input
          value={content.aboutPageTitle}
          onChange={(e) => onChange("aboutPageTitle", e.target.value)}
        />
      </label>
      <label className="admin-span-2">
        About page description
        <textarea
          rows="3"
          value={content.aboutPageDescription}
          onChange={(e) => onChange("aboutPageDescription", e.target.value)}
        />
      </label>
      <label className="admin-span-2">
        Services page title
        <input
          value={content.servicesPageTitle}
          onChange={(e) => onChange("servicesPageTitle", e.target.value)}
        />
      </label>
      <label className="admin-span-2">
        Services page description
        <textarea
          rows="3"
          value={content.servicesPageDescription}
          onChange={(e) => onChange("servicesPageDescription", e.target.value)}
        />
      </label>
      <label className="admin-span-2">
        Contact heading
        <input
          value={content.contactHeading}
          onChange={(e) => onChange("contactHeading", e.target.value)}
        />
      </label>
      <label className="admin-span-2">
        Contact description
        <textarea
          rows="3"
          value={content.contactDescription}
          onChange={(e) => onChange("contactDescription", e.target.value)}
        />
      </label>
      <label>
        Happy customers
        <input
          value={content.trustCustomers}
          onChange={(e) => onChange("trustCustomers", e.target.value)}
        />
      </label>
      <label>
        Monthly visitors
        <input
          value={content.trustVisitors}
          onChange={(e) => onChange("trustVisitors", e.target.value)}
        />
      </label>
      <label className="admin-span-2">
        WhatsApp text
        <input value={content.whatsappText} onChange={(e) => onChange("whatsappText", e.target.value)} />
      </label>
    </div>
  </section>
);

const HomepageSectionsPanel = ({ content, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <>
    <section className="admin-card">
      <div className="admin-card-head admin-card-head-inline">
        <div>
          <span className="admin-section-tag">Homepage</span>
          <h2>Homepage Quick Stats</h2>
          <p>Add, edit, or remove the stat items shown under the hero section.</p>
        </div>
        <button
          type="button"
          className="admin-outline"
          onClick={() => addArrayItem("quickStats", createQuickStat)}
        >
          Add stat
        </button>
      </div>
      <div className="admin-stack">
        {content.quickStats.map((stat) => (
          <div className="admin-entity-card" key={stat.id}>
            <div className="admin-entity-head">
              <strong>{stat.label}</strong>
              <button
                type="button"
                className="admin-danger"
                onClick={() => removeArrayItem("quickStats", stat.id)}
              >
                Delete
              </button>
            </div>
            <div className="admin-inline-grid compact-grid">
              <label>
                Label
                <input
                  value={stat.label}
                  onChange={(e) => updateArrayItem("quickStats", stat.id, "label", e.target.value)}
                />
              </label>
              <label>
                Icon
                <select
                  value={stat.icon}
                  onChange={(e) => updateArrayItem("quickStats", stat.id, "icon", e.target.value)}
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="admin-card">
      <div className="admin-card-head admin-card-head-inline">
        <div>
          <span className="admin-section-tag">About Page</span>
          <h2>About Page Features</h2>
          <p>Control the feature cards used on the about page and homepage highlight band.</p>
        </div>
        <button
          type="button"
          className="admin-outline"
          onClick={() => addArrayItem("features", createFeature)}
        >
          Add feature
        </button>
      </div>
      <div className="admin-stack">
        {content.features.map((feature) => (
          <div className="admin-entity-card" key={feature.id}>
            <div className="admin-entity-head">
              <strong>{feature.title}</strong>
              <button
                type="button"
                className="admin-danger"
                onClick={() => removeArrayItem("features", feature.id)}
              >
                Delete
              </button>
            </div>
            <div className="admin-form-grid">
              <label>
                Title
                <input
                  value={feature.title}
                  onChange={(e) => updateArrayItem("features", feature.id, "title", e.target.value)}
                />
              </label>
              <label>
                Icon
                <select
                  value={feature.icon}
                  onChange={(e) => updateArrayItem("features", feature.id, "icon", e.target.value)}
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-span-2">
                Description
                <textarea
                  rows="3"
                  value={feature.description}
                  onChange={(e) =>
                    updateArrayItem("features", feature.id, "description", e.target.value)
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  </>
);

const ServicesPanel = ({ content, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <section className="admin-card">
    <div className="admin-card-head admin-card-head-inline">
      <div>
        <span className="admin-section-tag">Services</span>
        <h2>Services</h2>
        <p>Fully manage service cards shown on both the homepage and services page.</p>
      </div>
      <button
        type="button"
        className="admin-outline"
        onClick={() => addArrayItem("services", createService)}
      >
        Add service
      </button>
    </div>
    <div className="admin-stack">
      {content.services.map((service) => (
        <div className="admin-entity-card" key={service.id}>
          <div className="admin-entity-head">
            <strong>{service.title}</strong>
            <button
              type="button"
              className="admin-danger"
              onClick={() => removeArrayItem("services", service.id)}
            >
              Delete
            </button>
          </div>
          <div className="admin-form-grid">
            <label>
              Service title
              <input
                value={service.title}
                onChange={(e) => updateArrayItem("services", service.id, "title", e.target.value)}
              />
            </label>
            <label>
              Icon
              <select
                value={service.icon}
                onChange={(e) => updateArrayItem("services", service.id, "icon", e.target.value)}
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-span-2">
              Homepage description
              <textarea
                rows="2"
                value={service.description}
                onChange={(e) =>
                  updateArrayItem("services", service.id, "description", e.target.value)
                }
              />
            </label>
            <label className="admin-span-2">
              Services page description
              <textarea
                rows="3"
                value={service.details}
                onChange={(e) => updateArrayItem("services", service.id, "details", e.target.value)}
              />
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={service.featured}
                onChange={(e) =>
                  updateArrayItem("services", service.id, "featured", e.target.checked)
                }
              />
              Featured service card
            </label>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const DoctorsPanel = ({ content, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <section className="admin-card">
    <div className="admin-card-head admin-card-head-inline">
      <div>
        <span className="admin-section-tag">Medical Team</span>
        <h2>Doctors</h2>
        <p>Add, edit, or remove doctors shown on the homepage roster.</p>
      </div>
      <button type="button" className="admin-outline" onClick={() => addArrayItem("doctors", createDoctor)}>
        Add doctor
      </button>
    </div>
    <div className="admin-stack">
      {content.doctors.map((doctor) => (
        <div className="admin-entity-card" key={doctor.id}>
          <div className="admin-entity-head">
            <strong>{doctor.name}</strong>
            <button
              type="button"
              className="admin-danger"
              onClick={() => removeArrayItem("doctors", doctor.id)}
            >
              Delete
            </button>
          </div>
          <div className="admin-form-grid">
            <label>
              Name
              <input
                value={doctor.name}
                onChange={(e) => updateArrayItem("doctors", doctor.id, "name", e.target.value)}
              />
            </label>
            <label>
              Role
              <input
                value={doctor.role}
                onChange={(e) => updateArrayItem("doctors", doctor.id, "role", e.target.value)}
              />
            </label>
            <label>
              Available days
              <input
                value={doctor.days}
                onChange={(e) => updateArrayItem("doctors", doctor.id, "days", e.target.value)}
              />
            </label>
            <label>
              Hours
              <input
                value={doctor.hours}
                onChange={(e) => updateArrayItem("doctors", doctor.id, "hours", e.target.value)}
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const SearchBox = ({ value, onChange, placeholder }) => (
  <div className="admin-search-box">
    <FaSearch />
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

const AppointmentsPanel = ({ items, search, setSearch, onStatusChange, onDelete }) => (
  <section className="admin-card">
    <div className="admin-card-head">
      <span className="admin-section-tag">Appointments</span>
      <h2>Appointment Requests</h2>
      <p>Manage booking requests submitted from the appointment page.</p>
    </div>
    <SearchBox value={search} onChange={setSearch} placeholder="Search by name, phone, email, service..." />
    <div className="admin-list">
      {items.length === 0 ? (
        <p className="admin-empty">
          {search ? "No appointments match your search." : "No appointments yet."}
        </p>
      ) : (
        items.map((appointment) => (
          <article className="admin-list-item" key={appointment.id}>
            <div className="admin-list-row">
              <h3>{appointment.name}</h3>
              <select
                value={appointment.status}
                onChange={(e) => onStatusChange(appointment.id, e.target.value)}
              >
                <option>New</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
            <p>{appointment.serviceType || "General inquiry"}</p>
            <span>{appointment.phone}</span>
            <span>{appointment.email}</span>
            <span>{appointment.preferredDate || "No preferred date selected"}</span>
            <p>{appointment.message}</p>
            <span>Created: {formatDate(appointment.createdAt)}</span>
            <button
              type="button"
              className="admin-danger subtle"
              onClick={() => onDelete(appointment.id)}
            >
              Delete appointment
            </button>
          </article>
        ))
      )}
    </div>
  </section>
);

const MessagesPanel = ({ items, search, setSearch, onStatusChange, onDelete }) => (
  <section className="admin-card">
    <div className="admin-card-head">
      <span className="admin-section-tag">Inbox</span>
      <h2>Contact Messages</h2>
      <p>Manage contact form messages from the public website.</p>
    </div>
    <SearchBox value={search} onChange={setSearch} placeholder="Search by name, contact, subject..." />
    <div className="admin-list">
      {items.length === 0 ? (
        <p className="admin-empty">{search ? "No messages match your search." : "No messages yet."}</p>
      ) : (
        items.map((message) => (
          <article className="admin-list-item" key={message.id}>
            <div className="admin-list-row">
              <h3>{message.name}</h3>
              <select value={message.status} onChange={(e) => onStatusChange(message.id, e.target.value)}>
                <option>Unread</option>
                <option>In progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <p>{message.subject || "Website inquiry"}</p>
            <span>{message.contact}</span>
            <p>{message.message}</p>
            <span>Created: {formatDate(message.createdAt)}</span>
            <button type="button" className="admin-danger subtle" onClick={() => onDelete(message.id)}>
              Delete message
            </button>
          </article>
        ))
      )}
    </div>
  </section>
);

const OverviewPanel = ({ totals, appointments, messages, onNavigate }) => (
  <>
    <section className="admin-stats">
      <article>
        <span className="admin-stat-label">Website</span>
        <strong>{totals.services}</strong>
        <span>Services</span>
      </article>
      <article>
        <span className="admin-stat-label">Team</span>
        <strong>{totals.doctors}</strong>
        <span>Doctors</span>
      </article>
      <article>
        <span className="admin-stat-label">About</span>
        <strong>{totals.features}</strong>
        <span>About Features</span>
      </article>
      <article>
        <span className="admin-stat-label">Hero</span>
        <strong>{totals.stats}</strong>
        <span>Quick Stats</span>
      </article>
      <article>
        <span className="admin-stat-label">Leads</span>
        <strong>{totals.appointments}</strong>
        <span>Appointments</span>
      </article>
      <article>
        <span className="admin-stat-label">Inbox</span>
        <strong>{totals.messages}</strong>
        <span>Messages</span>
      </article>
    </section>

    <div className="admin-overview-grid">
      <section className="admin-card">
        <div className="admin-card-head admin-card-head-inline">
          <div>
            <span className="admin-section-tag">Latest</span>
            <h2>Recent Appointments</h2>
          </div>
          <button type="button" className="admin-outline" onClick={() => onNavigate("appointments")}>
            View all
          </button>
        </div>
        <div className="admin-preview-list">
          {appointments.length === 0 ? (
            <p className="admin-empty">No appointments yet.</p>
          ) : (
            appointments.slice(0, 4).map((item) => (
              <div className="admin-preview-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <span className="admin-badge-pill">{item.status}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-head admin-card-head-inline">
          <div>
            <span className="admin-section-tag">Latest</span>
            <h2>Recent Messages</h2>
          </div>
          <button type="button" className="admin-outline" onClick={() => onNavigate("messages")}>
            View all
          </button>
        </div>
        <div className="admin-preview-list">
          {messages.length === 0 ? (
            <p className="admin-empty">No messages yet.</p>
          ) : (
            messages.slice(0, 4).map((item) => (
              <div className="admin-preview-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <span className="admin-badge-pill">{item.status}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  </>
);

const AdminPanel = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!statusMessage) {
      return;
    }
    const timer = setTimeout(() => setStatusMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contentData, appointmentsData, messagesData] = await Promise.all([
          fetchSiteContent(),
          fetchAppointments(),
          fetchMessages(),
        ]);
        setContent(contentData);
        setAppointments(appointmentsData);
        setMessages(messagesData);
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setLoadError("Unable to load admin data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const totals = useMemo(
    () => ({
      services: content?.services.length ?? 0,
      doctors: content?.doctors.length ?? 0,
      stats: content?.quickStats.length ?? 0,
      features: content?.features.length ?? 0,
      appointments: appointments.length,
      messages: messages.length,
    }),
    [
      appointments.length,
      content?.doctors.length,
      content?.features.length,
      content?.quickStats.length,
      content?.services.length,
      messages.length,
    ]
  );

  const newAppointmentsCount = useMemo(
    () => appointments.filter((item) => item.status === "New").length,
    [appointments]
  );

  const unreadMessagesCount = useMemo(
    () => messages.filter((item) => item.status === "Unread").length,
    [messages]
  );

  const filteredAppointments = useMemo(() => {
    const query = appointmentSearch.trim().toLowerCase();
    if (!query) {
      return appointments;
    }

    return appointments.filter((item) =>
      [item.name, item.phone, item.email, item.serviceType, item.message]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [appointments, appointmentSearch]);

  const filteredMessages = useMemo(() => {
    const query = messageSearch.trim().toLowerCase();
    if (!query) {
      return messages;
    }

    return messages.filter((item) =>
      [item.name, item.contact, item.subject, item.message]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [messages, messageSearch]);

  const handleContentChange = (field, value) => {
    setContent((current) => ({ ...current, [field]: value }));
  };

  const updateArrayItem = (arrayName, id, field, value) => {
    setContent((current) => ({
      ...current,
      [arrayName]: current[arrayName].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (arrayName, itemFactory) => {
    setContent((current) => ({
      ...current,
      [arrayName]: [...current[arrayName], itemFactory()],
    }));
  };

  const removeArrayItem = (arrayName, id) => {
    setContent((current) => ({
      ...current,
      [arrayName]: current[arrayName].filter((item) => item.id !== id),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateSiteContent(content);
      setContent(updated);
      setStatusMessage("Changes saved successfully.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const updated = await resetSiteContent();
    setContent(updated);
    setStatusMessage("Content reset to the demo values.");
  };

  const describeNotification = (notification) => {
    if (!notification || !notification.attempted) {
      if (notification?.reason === "not_configured") {
        return "Status updated. SMS/WhatsApp notifications aren't configured yet.";
      }
      if (notification?.reason === "invalid_phone") {
        return "Status updated. Couldn't notify the customer — invalid phone number.";
      }
      return "";
    }

    const channels = [];
    if (notification.sms === "sent") channels.push("SMS");
    if (notification.whatsapp === "sent") channels.push("WhatsApp");
    const failed = [];
    if (notification.sms === "failed") failed.push("SMS");
    if (notification.whatsapp === "failed") failed.push("WhatsApp");

    let message = channels.length
      ? `Customer notified via ${channels.join(" & ")}.`
      : "Status updated.";
    if (failed.length) {
      message += ` ${failed.join(" & ")} notification failed.`;
    }
    return message;
  };

  const handleAppointmentStatusChange = async (id, status) => {
    const updated = await updateAppointmentStatus(id, status);
    setAppointments((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    const description = describeNotification(updated.notification);
    if (description) {
      setStatusMessage(description);
    }
  };

  const handleAppointmentDelete = async (id) => {
    await deleteAppointment(id);
    setAppointments((current) => current.filter((item) => item.id !== id));
  };

  const handleMessageStatusChange = async (id, status) => {
    const updated = await updateMessageStatus(id, status);
    setMessages((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleMessageDelete = async (id) => {
    await deleteMessage(id);
    setMessages((current) => current.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-loading">
          <span className="admin-spinner" aria-hidden="true" />
          <p>Loading admin data...</p>
        </div>
      </main>
    );
  }

  if (loadError || !content) {
    return (
      <main className="admin-page">
        <div className="admin-loading">
          <p>{loadError || "Something went wrong."}</p>
        </div>
      </main>
    );
  }

  const activeLabel = NAV_ITEMS.find((item) => item.id === activeTab)?.label ?? "Overview";

  return (
    <main className="admin-page">
      <div className="admin-shell admin-shell-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <span className="admin-kicker">Admin Panel</span>
            <h1>{content.clinicName}</h1>
          </div>

          <nav className="admin-nav">
            {NAV_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const badge =
                item.id === "appointments"
                  ? newAppointmentsCount
                  : item.id === "messages"
                  ? unreadMessagesCount
                  : 0;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon />
                  <span>{item.label}</span>
                  {badge > 0 ? <span className="admin-nav-badge">{badge}</span> : null}
                </button>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <Link to="/" className="admin-link">
              <FaExternalLinkAlt /> View website
            </Link>
            <button type="button" className="admin-ghost" onClick={handleReset}>
              <FaUndo /> Reset demo content
            </button>
            <button type="button" className="admin-ghost" onClick={handleLogout}>
              <FaSignOutAlt /> Log out
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-main-head">
            <h1>{activeLabel}</h1>
            <p>
              Edit live content, manage services and doctors, and keep up with appointment and
              contact leads.
            </p>
          </div>

          <div className="admin-tab-panel" key={activeTab}>
            {activeTab === "overview" && (
              <OverviewPanel
                totals={totals}
                appointments={appointments}
                messages={messages}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === "content" && (
              <SiteContentForm content={content} onChange={handleContentChange} />
            )}

            {activeTab === "homepage" && (
              <HomepageSectionsPanel
                content={content}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
              />
            )}

            {activeTab === "services" && (
              <ServicesPanel
                content={content}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
              />
            )}

            {activeTab === "doctors" && (
              <DoctorsPanel
                content={content}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
              />
            )}

            {activeTab === "appointments" && (
              <AppointmentsPanel
                items={filteredAppointments}
                search={appointmentSearch}
                setSearch={setAppointmentSearch}
                onStatusChange={handleAppointmentStatusChange}
                onDelete={handleAppointmentDelete}
              />
            )}

            {activeTab === "messages" && (
              <MessagesPanel
                items={filteredMessages}
                search={messageSearch}
                setSearch={setMessageSearch}
                onStatusChange={handleMessageStatusChange}
                onDelete={handleMessageDelete}
              />
            )}
          </div>

          {SAVABLE_TABS.has(activeTab) && (
            <div className="admin-save-bar">
              {statusMessage ? (
                <span className="admin-status admin-status-pop">
                  <FaCheckCircle /> {statusMessage}
                </span>
              ) : (
                <span />
              )}
              <button type="button" className="admin-primary" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <span className="admin-btn-spinner" aria-hidden="true" /> Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          )}

          {!SAVABLE_TABS.has(activeTab) && statusMessage && (
            <div className="admin-toast">
              <FaCheckCircle /> {statusMessage}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminPanel;
