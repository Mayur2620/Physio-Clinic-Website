import { HashRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Appointment from "../pages/Appointment";
import Contact from "../pages/Contact";
import AdminPanel from "../pages/AdminPanel";
import AdminLogin from "../pages/AdminLogin";
import RequireAdmin from "./RequireAdmin";
import { AuthProvider } from "../context/AuthContext";
import { SiteContentProvider } from "../context/SiteContentContext";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="appointment" element={<Appointment />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPanel />
                </RequireAdmin>
              }
            />
          </Routes>
        </Router>
      </SiteContentProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
