import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { useSiteContent } from "../context/site-content-hooks";
import "./Contact.css";

const Contact = () => {
  const { content } = useSiteContent();

  return (
    <section className="inner-page">
      <div className="container contact-layout">
        <div className="inner-hero">
          <span>Contact</span>
          <h1>Talk with the clinic team.</h1>
          <p>
            Reach out for appointments, questions, treatment guidance, or a
            quick conversation about the right next step.
          </p>
        </div>

        <div className="contact-cards">
          <article>
            <FaPhoneAlt />
            <h2>Phone</h2>
            <p>{content.phone}</p>
          </article>
          <article>
            <FaEnvelope />
            <h2>Email</h2>
            <p>{content.email}</p>
          </article>
          <article>
            <FaWhatsapp />
            <h2>WhatsApp</h2>
            <p>{content.whatsappText}</p>
          </article>
          <article>
            <FaMapMarkerAlt />
            <h2>Location</h2>
            <p>{content.address}</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Contact;
