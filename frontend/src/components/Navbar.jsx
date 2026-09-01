import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoIcon from "../assets/icons/revive-care-icon.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionNav = (sectionId) => (event) => {
    event.preventDefault();

    if (isHome) {
      window.dispatchEvent(new CustomEvent("app:scroll-to-section", { detail: sectionId }));
      return;
    }

    navigate("/", { state: { scrollTo: sectionId } });
  };

  return (
    <nav
      className={`navbar navbar-expand-lg custom-navbar ${
        !isHome || isScrolled ? "solid" : ""
      }`}
    >
      <div className="container">

        <Link className="navbar-brand brand-mark" to="/">
          <img src={logoIcon} alt="Revive Care logo" className="brand-logo-icon" />
          <span className="brand-logo-text">
            <strong>Revive<em>Care</em></strong>
            <small>Physiotherapy Clinic</small>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleSectionNav("home")}>
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleSectionNav("services")}>
                Services
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleSectionNav("about")}>
                About Us
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleSectionNav("doctors")}>
                Doctors
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleSectionNav("contact")}>
                Contact
              </Link>
            </li>

            <li className="nav-item">
              <Link className="btn btn-primary ms-3" to="/appointment">
                Book Appointment
              </Link>
            </li>

            <li className="nav-item">
              <Link className="btn btn-outline-admin ms-3" to="/admin">
                Admin
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
