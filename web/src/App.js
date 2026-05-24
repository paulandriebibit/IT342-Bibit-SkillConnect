import React, { useState, useEffect } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Sidebar from './components/Sidebar';
import SkillCatalog from './features/catalog/SkillCatalog';
import BookingDashboard from './features/bookings/BookingDashboard';
import AdminDashboard from './features/admin/AdminDashboard'; 
import FriendsChat from './features/messages/FriendsChat';
import Settings from './features/settings/Settings';
import './Theme.css';
import './components/Sidebar.css';
import AboutUs from './features/about/AboutUs';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState('marketplace');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [activeNotif, setActiveNotif] = useState(null);
  const [targetedChatPartner, setTargetedChatPartner] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setCurrentPage(parsedUser?.role === 'ADMIN' ? 'admin-terminal' : 'marketplace');
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !user?.id || user?.role === 'ADMIN') return;

    const eventSource = new EventSource(`http://localhost:8080/api/v1/notifications/stream/${user.id}`);

    eventSource.addEventListener("NOTIFICATION", (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [data, ...prev]);
      setActiveNotif(data);
      setShowNotifPopup(true);
    });

    return () => {
      eventSource.close();
    };
  }, [isLoggedIn, user]);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setCurrentPage(loggedInUser?.role === 'ADMIN' ? 'admin-terminal' : 'marketplace');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleInitiateChat = (partner) => {
    setTargetedChatPartner(partner);
    setCurrentPage('messages');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'admin-terminal': return <AdminDashboard />;
      case 'marketplace': return <SkillCatalog onStartChat={handleInitiateChat} />;
      case 'bookings': return <BookingDashboard onStartChat={handleInitiateChat} />;
      case 'messages': return <FriendsChat preselectedPartner={targetedChatPartner} />;
      case 'settings': return <Settings onProfileUpdate={handleProfileUpdate} />;
      case 'about-us': return <AboutUs />; 
      default: return <SkillCatalog onStartChat={handleInitiateChat} />;
    }
  };

  const getPageTitle = () => {
    switch(currentPage) {
      case 'admin-terminal': return 'Oversight Terminal';
      case 'marketplace': return 'Skill Marketplace';
      case 'bookings': return 'My Bookings';
      case 'messages': return 'Friends Chat';
      case 'settings': return 'Settings';
      case 'about-us': return 'About SkillConnect'; 
      default: return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch(currentPage) {
      case 'admin-terminal': return 'System oversight and platform auditing controls';
      case 'marketplace': return 'Discover and swap skills with fellow CIT-U students';
      case 'bookings': return 'Track and manage all your skill swap requests';
      case 'messages': return 'Chat with your skill swap matches in real time';
      case 'settings': return 'Manage your account settings and preferences';
      case 'about-us': return 'Learn more about the peer-to-peer barter ecosystem'; 
      default: return 'Welcome back to SkillConnect';
    }
  };

  if (!isLoggedIn) {
    return showLogin 
      ? <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setShowLogin(false)} />
      : <Register onSwitchToLogin={() => setShowLogin(true)} />;
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} onLogout={handleLogout} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="main-content">
        <div className="welcome-header">
          <h1 className="welcome-title">{getPageTitle()}</h1>
          <p className="welcome-subtitle">{getPageSubtitle()}</p>
        </div>
        <div className="content-card">{renderPage()}</div>
      </main>

      {showNotifPopup && activeNotif && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#FFFFFF', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', borderRadius: '8px', borderLeft: '4px solid #238B7A', padding: '16px 20px', width: '360px', zIndex: '9999', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#238B7A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real-Time Alert</span>
            <button style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '16px', cursor: 'pointer' }} onClick={() => setShowNotifPopup(false)}>×</button>
          </div>
          <p style={{ margin: '0', fontSize: '14px', color: '#1E293B', fontWeight: '500', lineHeight: '1.4' }}>{activeNotif.message}</p>
          <button 
            style={{ alignSelf: 'flex-end', background: '#238B7A', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }} 
            onClick={() => { 
              if (activeNotif.type === 'NEW_MESSAGE') {
                setTargetedChatPartner({ id: activeNotif.senderId, name: activeNotif.senderName });
                setCurrentPage('messages');
              } else {
                setCurrentPage('bookings'); 
              }
              setShowNotifPopup(false); 
            }}
          >
            {activeNotif.type === 'NEW_MESSAGE' ? 'Open Chat' : 'View Requests'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;