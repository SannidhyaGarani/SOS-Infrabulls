import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinAsPartner from './Components/JoinAsPartner';
import ThankYou from './Components/ThankYou';
import AgentLogin from './Components/Agent panel/AgentLogin';
import AgentDashboard from './Components/Agent panel/Dashboard';
import HRDashboard from './Components/HR Panel/HRDashoard';
import Home from './Components/Homepage/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinAsPartner />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/agent/login" element={<AgentLogin />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />
      </Routes>
      <Footer/>

    </Router>
  );
}

export default App;
