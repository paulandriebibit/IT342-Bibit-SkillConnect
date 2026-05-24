import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPage, setCurrentPage, user, onLogout, isOpen, setIsOpen }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = user?.role === 'ADMIN' 
    ? [
        { id: 'admin-terminal', label: 'Admin Console' },
        { id: 'marketplace', label: 'View Marketplace' },
        { id: 'settings', label: 'Settings' }
      ]
    : [
        { id: 'marketplace', label: 'Marketplace' },
        { id: 'bookings', label: 'Bookings' },
        { id: 'messages', label: 'Friends' },
        { id: 'settings', label: 'Settings' },
        { id: 'about-us', label: 'About Us' }
      ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>☰</button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div><span className="logo-text">SkillConnect</span></div>
        </div>
        <div className="sidebar-user-section">
          <h3>
            {user?.firstname} {user?.lastname}
          </h3>
          <span>
            {user?.role === 'ADMIN' ? 'Administrator' : user?.major || 'Student'}
          </span>
        </div>
        <div className="nav-menu">
          {menuItems.map((item) => (
            <div key={item.id} className={`nav-item ${currentPage === item.id ? 'active' : ''}`} onClick={() => handleNavClick(item.id)}>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </div>
        <button className="logout-btn" onClick={() => setShowLogoutModal(true)}><span>Logout</span></button>
      </div>
      <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}></div>
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Confirm Logout</h3>
            <p className="modal-message">Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="modal-btn confirm" onClick={() => { onLogout(); setShowLogoutModal(false); }}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;