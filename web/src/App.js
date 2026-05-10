// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Sidebar from './components/Sidebar';
import SkillCatalog from './features/catalog/SkillCatalog';
import CreateSkill from './features/skills/CreateSkill';
import BookingDashboard from './features/bookings/BookingDashboard';
import './Theme.css';
import './components/Sidebar.css';
import Settings from './features/settings/Settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState('marketplace');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    setUser(JSON.parse(storedUser));
    setIsLoggedIn(true);
    setCurrentPage('marketplace');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('marketplace');
  };

  if (!isLoggedIn) {
    return showLogin ? (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowLogin(false)}
      />
    ) : (
      <Register 
        onSwitchToLogin={() => setShowLogin(true)}
      />
    );
  }

  const renderPage = () => {
  switch(currentPage) {
    case 'marketplace':
      return <SkillCatalog />;
    case 'my-skills':
      return <CreateSkill />;
    case 'bookings':
      return <BookingDashboard />;
    case 'settings':
      return <Settings />;
    default:
      return <SkillCatalog />;
  }
};

  const getPageTitle = () => {
  switch(currentPage) {
    case 'marketplace': return 'Skill Marketplace';
    case 'my-skills': return 'My Skills';
    case 'bookings': return 'My Bookings';
    case 'settings': return 'Settings';
    default: return 'Dashboard';
  }
};
  const getPageSubtitle = () => {
  switch(currentPage) {
    case 'marketplace': return 'Discover and swap skills with fellow CIT-U students';
    case 'my-skills': return 'Manage the skills you offer to the community';
    case 'bookings': return 'Track and manage all your skill swap requests';
    case 'settings': return 'Manage your account settings and preferences';
    default: return 'Welcome back to SkillConnect';
  }
};

  return (
    <div className="app-container">
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <main className="main-content">
        <div className="welcome-header">
          <h1 className="welcome-title">{getPageTitle()}</h1>
          <p className="welcome-subtitle">{getPageSubtitle()}</p>
        </div>
        
        <div className="content-card">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;