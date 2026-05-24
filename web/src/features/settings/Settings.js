// src/features/settings/Settings.js - Update your file to forward the prop
import React from 'react';
import StudentSettings from './StudentSettings';
import AdminSettings from './AdminSettings';

const Settings = ({ onProfileUpdate }) => { // Accept the prop here
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  if (loggedInUser?.role === 'ADMIN') {
    return <AdminSettings loggedInUser={loggedInUser} />;
  }

  return <StudentSettings loggedInUser={loggedInUser} onProfileUpdate={onProfileUpdate} />; // Pass it down
};

export default Settings;