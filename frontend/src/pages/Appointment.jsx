import { useState } from "react";
import { Link } from "react-router-dom";
import { createAppointment } from "../api/adminApi";
import "./Appointment.css";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  serviceType: "",
  preferredDate: "",
  message: "",
};

const Appointment = () => {
  const [formData, setFormData] = useState(initialForm);
  const [submitState, setSubmitState] = useState("");

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createAppointment(formData);
      setFormData(initialForm);
      setSubmitState("Appointment request saved. You can review it in the admin panel.");
    } catch {
      setSubmitState("Something went wrong saving your request. Please try again.");
    }
  };

  return (
    <section className="inner-page">
      <div className="container appointment-layout">
        <div className="inner-hero">
          <span>Book Appointment</span>
          <h1>Start with a focused consultation.</h1>
          <p>
            Share your concern, choose a preferred time, and our team will help
            you begin a clear recovery plan.
          </p>
          <Link to="/contact" className="inner-link">Need help choosing?</Link>
        </div>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            aria-label="Full name"
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone number"
            aria-label="Phone number"
            value={formData.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            required
          />
          <select
            aria-label="Service type"
            value={formData.serviceType}
            onChange={(event) => handleChange("serviceType", event.target.value)}
            required
          >
            <option value="" disabled>Service type</option>
            <option>Pain management</option>
            <option>Sports rehabilitation</option>
            <option>Posture and mobility</option>
            <option>Wellness program</option>
          </select>
          <input
            type="date"
            aria-label="Preferred date"
            value={formData.preferredDate}
            onChange={(event) => handleChange("preferredDate", event.target.value)}
          />
          <textarea
            placeholder="Tell us what you need help with"
            aria-label="Message"
            value={formData.message}
            onChange={(event) => handleChange("message", event.target.value)}
            required
          ></textarea>
          <button type="submit">Request Appointment</button>
          {submitState ? <p className="inner-form-feedback">{submitState}</p> : null}
        </form>
      </div>
    </section>
  );
};

export default Appointment;
