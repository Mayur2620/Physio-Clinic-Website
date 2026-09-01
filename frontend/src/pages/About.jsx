import { FaHeartbeat, FaHome, FaUserMd, FaUsers } from "react-icons/fa";
import { useSiteContent } from "../context/site-content-hooks";
import "./About.css";

const iconMap = {
  heartbeat: FaHeartbeat,
  doctor: FaUserMd,
  home: FaHome,
  users: FaUsers,
};

const About = () => {
  const { content } = useSiteContent();

  return (
    <section className="inner-page">
      <div className="container">
        <div className="inner-hero">
          <span>About {content.clinicName}</span>
          <h1>{content.aboutPageTitle}</h1>
          <p>{content.aboutPageDescription}</p>
        </div>

        <div className="feature-grid">
          {content.features.map((feature) => {
            const Icon = iconMap[feature.icon] || FaHeartbeat;

            return (
              <article key={feature.id}>
                <Icon />
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
