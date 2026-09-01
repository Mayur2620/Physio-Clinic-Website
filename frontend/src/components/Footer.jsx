import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logoIcon from "../assets/icons/revive-care-icon.png";
import { useSiteContent } from "../context/site-content-hooks";
import "./Footer.css";

const Footer = () => {
  const { content } = useSiteContent();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logoIcon} alt="Revive Care logo" className="footer-logo-icon" />
            <span className="footer-logo-text">
              <strong>Revive Care</strong>
              <small>Physiotherapy Clinic</small>
            </span>
          </div>
          <p>{content.clinicDescription}</p>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p><FaEnvelope /> {content.email}</p>
          <p><FaPhoneAlt /> {content.phone}</p>
          <p><FaMapMarkerAlt /> {content.address}</p>
        </div>

        <div className="footer-subscribe">
          <h3>Be our subscribers</h3>
          <p>Receive our newest treatment updates.</p>
          <form>
            <input type="email" placeholder="Email Address" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer-socials">
            <FaFacebookF />
            <FaInstagram />
            <FaWhatsapp />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>2026 All rights reserved</span>
        <span>Privacy Policy | Terms Of Service</span>
      </div>
    </footer>
  );
};

export default Footer;
