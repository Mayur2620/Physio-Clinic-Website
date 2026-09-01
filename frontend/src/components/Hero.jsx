import "./Hero.css";
import { Link } from "react-router-dom";
import heroImg from "../assets/images/physio-hero.png";



const Hero = () => {
  return (
    <section className="hero-section d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Content */}
          <div className="col-md-6">
            <h1 className="hero-title">
              Restore Your Movement, Live Pain Free
            </h1>

            <p className="hero-text">
              Expert physiotherapy care for pain relief, injury recovery, and
              long-term wellness.
            </p>

            <div className="hero-buttons">
              <Link to="/appointment" className="btn btn-primary me-3">
                Book Appointment
              </Link>

              <Link to="/services" className="btn btn-outline-primary">
                View Services
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-md-6 text-center">
            <img src={heroImg} alt="Physiotherapy" className="hero-image" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
