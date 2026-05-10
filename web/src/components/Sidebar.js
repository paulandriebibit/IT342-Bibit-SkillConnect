// src/components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPage, setCurrentPage, user, onLogout, isOpen, setIsOpen }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'my-skills', label: 'My Skills' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const getInitials = () => {
    const first = user?.firstname?.charAt(0) || '';
    const last = user?.lastname?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div>
            <span className="logo-icon">🌿</span>
            <span className="logo-text">SkillConnect</span>
          </div>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            {getInitials()}
          </div>
          <div className="user-name">
            {user?.firstname} {user?.lastname}
          </div>
          <div className="user-email">
            {user?.email}
          </div>
        </div>

        <div className="nav-menu">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </div>

        <button className="logout-btn" onClick={handleLogoutClick}>
          <span>Logout</span>
        </button>
      </div>
      
      <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}></div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Confirm Logout</h3>
            <p className="modal-message">Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;