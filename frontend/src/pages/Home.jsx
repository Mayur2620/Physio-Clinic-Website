import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaDumbbell,
  FaEnvelope,
  FaFacebookF,
  FaHeartbeat,
  FaHome,
  FaInstagram,
  FaPhoneAlt,
  FaRunning,
  FaUserInjured,
  FaUserMd,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";
import heroImg from "../assets/images/physio-hero.png";
import doctorHeadshot from "../assets/images/img6.webp";
import { useSiteContent } from "../context/site-content-hooks";
import { createMessage } from "../api/adminApi";
import "./Home.css";

const iconMap = {
  injured: FaUserInjured,
  running: FaRunning,
  dumbbell: FaDumbbell,
  heartbeat: FaHeartbeat,
  calendar: FaCalendarCheck,
  home: FaHome,
  doctor: FaUserMd,
  users: FaUsers,
};

const initialContactForm = {
  name: "",
  contact: "",
  subject: "",
  message: "",
};

const Home = () => {
  const { content } = useSiteContent();
  const [contactForm, setContactForm] = useState(initialContactForm);
  const [submitState, setSubmitState] = useState("");

  const handleInputChange = (field, value) => {
    setContactForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createMessage(contactForm);
      setContactForm(initialContactForm);
      setSubmitState("Message received. It is now visible inside the admin panel.");
    } catch {
      setSubmitState("Something went wrong sending your message. Please try again.");
    }
  };

  return (
    <main className="home-page">
      <section className="med-hero" id="home">
        <div className="hero-green-shape" aria-hidden="true"></div>
        <div className="hero-socials" aria-label="Social media links">
          <FaFacebookF />
          <FaInstagram />
          <FaWhatsapp />
        </div>

        <div className="med-container hero-grid">
          <div className="hero-doctor-wrap" data-aos="fade-left" data-aos-delay="100">
            <img
              src={doctorHeadshot}
              alt={`${content.clinicName} specialist`}
              className="hero-doctor hero-doctor-main"
            />
          </div>

          <div className="hero-copy" data-aos="fade-right">
            <h1>{content.heroTitle}</h1>
            <p>{content.heroDescription}</p>
            <Link to="/appointment" className="green-btn">
              Book Appointment
            </Link>
            <div className="pulse-line" aria-hidden="true"></div>
          </div>
        </div>

        <div className="med-container quick-stats" data-aos="fade-up" data-aos-delay="150">
          {content.quickStats.map((stat) => {
            const Icon = iconMap[stat.icon] || FaHeartbeat;

            return (
              <div key={stat.id}>
                <Icon />
                <strong>{stat.label}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-pad services-section" id="services">
        <div className="section-heading" data-aos="fade-up">
          <h2>
            Our <span>Services</span>
          </h2>
          <p>
            Focused physiotherapy services for pain relief, recovery, movement,
            and long-term physical wellness.
          </p>
        </div>

        <div className="med-container service-grid">
          {content.services.map((service, index) => {
            const Icon = iconMap[service.icon] || FaHeartbeat;

            return (
              <article
                className={`service-tile ${service.featured ? "featured" : ""}`}
                key={service.id}
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 100}
              >
                <div className="service-icon">
                  <Icon />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            );
          })}
        </div>
        <Link to="/services" className="green-btn center-btn">
          More Services
        </Link>
      </section>

      <section className="expert-band" id="about">
        <div className="med-container expert-grid">
          <div className="expert-copy" data-aos="fade-right">
            <h2>{content.aboutTitle}</h2>
            <p>{content.aboutDescription}</p>
            <div className="expert-points">
              {content.features.slice(0, 4).map((feature) => {
                const Icon = iconMap[feature.icon] || FaHeartbeat;

                return (
                  <span key={feature.id}>
                    <Icon /> {feature.title}
                  </span>
                );
              })}
            </div>
          </div>
          <img
            src={heroImg}
            alt={`${content.clinicName} doctor`}
            data-aos="fade-left"
            data-aos-delay="100"
          />
        </div>
      </section>

      <section className="section-pad doctors-section" id="doctors">
        <div className="section-heading" data-aos="fade-up">
          <h2>
            Our <span>Doctors</span>
          </h2>
          <p>
            Meet friendly medical professionals who combine skill, care, and
            practical recovery planning.
          </p>
        </div>
        <div className="med-container doctor-grid">
          {content.doctors.map((doctor, index) => (
            <article
              className="doctor-card"
              key={doctor.id}
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
            >
              <span className="doctor-badge">{doctor.role}</span>
              <img src={heroImg} alt={doctor.name} />
              <h3>{doctor.name}</h3>
              <p>{doctor.days}</p>
              <strong>{doctor.hours}</strong>
            </article>
          ))}
        </div>
        <Link to="/about" className="green-btn center-btn">
          View All Doctors
        </Link>
      </section>

      <section className="gallery-band">
        <div className="section-heading light" data-aos="fade-up">
          <h2>
            Photo <span>Gallery</span>
          </h2>
          <p>
            A closer look at our clinic spaces, treatment moments, and care team.
          </p>
        </div>
        <div className="med-container gallery-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <figure
              className="gallery-item"
              key={index}
              data-aos="zoom-in"
              data-aos-delay={(index % 3) * 100}
            >
              <img src={heroImg} alt={`Clinic gallery ${index + 1}`} />
            </figure>
          ))}
        </div>
      </section>

      <section className="team-trust section-pad">
        <div className="med-container trust-grid">
          <img src={heroImg} alt="Expert medical team" data-aos="fade-right" />
          <div className="trust-copy" data-aos="fade-left">
            <h2>
              Expert Care
              <br />
              Trusted Team
            </h2>
            <p>
              We support every visitor with attentive care and measurable progress.
            </p>
            <div className="trust-numbers">
              <span><strong>{content.trustCustomers}</strong> Happy Customers</span>
              <span><strong>{content.trustVisitors}</strong> Monthly Visitors</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="med-container contact-panel" data-aos="fade-up">
          <div className="section-heading light">
            <h2>{content.contactHeading}</h2>
            <p>{content.contactDescription}</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-left">
              <input
                type="text"
                placeholder="Your Name"
                aria-label="Your name"
                value={contactForm.name}
                onChange={(event) => handleInputChange("name", event.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Email Address/Phone No"
                aria-label="Email address or phone number"
                value={contactForm.contact}
                onChange={(event) => handleInputChange("contact", event.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Subject"
                aria-label="Subject"
                value={contactForm.subject}
                onChange={(event) => handleInputChange("subject", event.target.value)}
                required
              />
            </div>
            <div className="form-right">
              <textarea
                placeholder="Your Message"
                aria-label="Your message"
                value={contactForm.message}
                onChange={(event) => handleInputChange("message", event.target.value)}
                required
              ></textarea>
              <button type="submit">Send Message</button>
              {submitState ? <p className="form-feedback">{submitState}</p> : null}
            </div>
          </form>
        </div>
      </section>

      <div className="floating-contact" aria-hidden="true">
        <FaPhoneAlt />
        <FaEnvelope />
        <FaWhatsapp />
      </div>
    </main>
  );
};

export default Home;
