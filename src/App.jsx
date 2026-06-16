import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinAsPartner from './Components/JoinAsPartner';
import ThankYou from './Components/ThankYou';
import AgentLogin from './Components/Agent panel/AgentLogin';
import AgentDashboard from './Components/Agent panel/Dashboard';
import HRDashboard from './Components/HR Panel/HRDashoard';
import Home from './Components/Homepage/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminPanel from './Components/Admin/AdminPanel';
import ProtectedAdminRoute from './Components/Admin/ProtectedAdminRoute';
import ScrollToTop from './Components/ScrollToTop';
import FloatingScrollToTop from './Components/FloatingScrollToTop';

// Pages
import About from './Components/Pages/About/About';
import TeamMembersPage from './Components/Pages/About/Team';
import Director from './Components/Pages/About Director/Director';
import ContactSection from './Components/Pages/Contact/Contact';
import Gallery from './Components/Pages/Gallary/Gallery';
import Complete from './Components/Pages/Project/Complete';
import OngoingProjects from './Components/Pages/Project/Gallery';
import ProjectDetail from './Components/Pages/Project/ProjectDetail';

import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <FloatingScrollToTop />
      <Routes>
        {/* Admin Routes (No Site Header/Footer) */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<AdminPanel />} />
        </Route>
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/agent/login" element={<AgentLogin />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />

        {/* Main Site Routes */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* About dropdown */}
                <Route path="/about" element={<About />} />
                <Route path="/about-director" element={<Director />} />
                <Route path="/team" element={<TeamMembersPage />} />

                {/* Projects dropdown */}
                <Route path="/projects/completed" element={<Complete />} />
                <Route path="/projects/ongoing" element={<OngoingProjects />} />
                <Route path="/projects/:projectId" element={<ProjectDetail />} />

                {/* Gallery */}
                <Route path="/gallery" element={<Gallery />} />

                {/* Contact */}
                <Route path="/contact" element={<ContactSection />} />

                {/* Other existing routes */}
                <Route path="/join" element={<JoinAsPartner />} />

              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
