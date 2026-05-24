// src/features/settings/AdminSettings.js
import React, { useState } from 'react';
import axios from 'axios';
import './Settings.css';

const AdminSettings = ({ loggedInUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [formData, setFormData] = useState({
    firstname: loggedInUser?.firstname || '',
    lastname: loggedInUser?.lastname || '',
    email: loggedInUser?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await axios.put(`http://localhost:8080/api/v1/users/${loggedInUser?.id}`, formData);
      const updatedUser = { ...loggedInUser, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Admin profile properties saved successfully');
    } catch (err) {
      setError('Failed to update administrative profile metadata');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      await axios.put(`http://localhost:8080/api/v1/users/${loggedInUser?.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordSuccess('Admin credentials updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError('Failed to change administrator password security credentials');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Admin Workstation Settings</h1>
        <p className="settings-subtitle">Configure administrative panel security profiles</p>
      </div>

      <div className="settings-tabs">
        <button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
        <button className={`tab-button ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Security</button>
        <button className={`tab-button ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>System Properties</button>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="settings-section">
            <h2 className="section-title">Identity Parameters</h2>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleProfileSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" value={formData.firstname} onChange={(e) => setFormData({...formData, firstname: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" value={formData.lastname} onChange={(e) => setFormData({...formData, lastname: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">System Admin Contact Line</label>
                <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Saving Parameters...' : 'Save Parameters'}</button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h2 className="section-title">Security Key Lifecycle Management</h2>
            {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
            {passwordError && <div className="error-message">{passwordError}</div>}
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group"><label className="form-label">Current Master Password</label><input type="password" className="form-input" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">New Password Hash</label><input type="password" className="form-input" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Confirm Passphrase</label><input type="password" className="form-input" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} required /></div>
              </div>
              <button type="submit" className="btn-save" disabled={passwordLoading}>{passwordLoading ? 'Encrypting Array Fields...' : 'Update Password Hash'}</button>
            </form>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="settings-section">
            <h2 className="section-title">Global Platform State Metrics</h2>
            <div className="info-card"><div className="info-label">Access Boundary Architecture</div><div className="info-value">Active Isolation Protocols Engaged</div></div>
            <div className="info-card"><div className="info-label">Database Synchronization Core</div><div className="info-value">Supabase Cloud Engine Live Connectivity Link</div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;