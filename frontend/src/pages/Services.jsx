import {
  FaCalendarCheck,
  FaDumbbell,
  FaHeartbeat,
  FaHome,
  FaRunning,
  FaUserInjured,
} from "react-icons/fa";
import { useSiteContent } from "../context/site-content-hooks";
import "./Services.css";

const iconMap = {
  injured: FaUserInjured,
  running: FaRunning,
  dumbbell: FaDumbbell,
  heartbeat: FaHeartbeat,
  calendar: FaCalendarCheck,
  home: FaHome,
};

const Services = () => {
  const { content } = useSiteContent();

  return (
    <section className="inner-page">
      <div className="container">
        <div className="inner-hero">
          <span>Our Services</span>
          <h1>{content.servicesPageTitle}</h1>
          <p>{content.servicesPageDescription}</p>
        </div>

        <div className="feature-grid">
          {content.services.map((service) => {
            const Icon = iconMap[service.icon] || FaHeartbeat;

            return (
              <article key={service.id}>
                <Icon />
                <h2>{service.title}</h2>
                <p>{service.details || service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
