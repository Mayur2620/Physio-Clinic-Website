import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import { useSiteContent } from "../context/site-content-hooks";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { content, loading, error } = useSiteContent();

  useEffect(() => {
    AOS.init({ duration: 650, easing: "ease-out-cubic", once: true, offset: 60 });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [location.pathname, content]);

  useEffect(() => {
    const scrollToSection = (sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) {
        return;
      }

      const navbar = document.querySelector(".custom-navbar");
      const offset = navbar ? navbar.getBoundingClientRect().height + 16 : 16;
      const top = section.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    const handleCustomScroll = (event) => {
      scrollToSection(event.detail);
    };

    window.addEventListener("app:scroll-to-section", handleCustomScroll);

    return () => {
      window.removeEventListener("app:scroll-to-section", handleCustomScroll);
    };
  }, []);

  useEffect(() => {
    const sectionId = location.state?.scrollTo;
    if (!sectionId) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("app:scroll-to-section", { detail: sectionId }));
      navigate(location.pathname, { replace: true, state: null });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.state, navigate]);

  if (loading || !content) {
    return (
      <div className="text-center py-5" role="status">
        {error ? "Unable to reach the server. Please try again shortly." : "Loading..."}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
