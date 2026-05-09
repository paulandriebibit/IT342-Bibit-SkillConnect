// src/features/settings/Settings.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Settings.css';

const Settings = () => {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

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
    email: loggedInUser?.email || '',
    studentId: loggedInUser?.studentId || '',
    major: loggedInUser?.major || 'CCS',
    phone: loggedInUser?.phone || '',
    bio: loggedInUser?.bio || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'account', label: 'Account', icon: '⚙️' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/users/${loggedInUser?.id}`,
        formData
      );

      const updatedUser = { ...loggedInUser, ...formData };
      if (loggedInUser?.rememberMe) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      await axios.put(
        `http://localhost:8080/api/v1/users/${loggedInUser?.id}/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      );

      setPasswordSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.response?.data || 'Failed to change password');
      setTimeout(() => setPasswordError(''), 3000);
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = () => {
    const first = formData.firstname?.charAt(0) || '';
    const last = formData.lastname?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="settings-section">
            <h2 className="section-title">Profile Information</h2>
            
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="avatar-section">
                <div className="avatar-preview">
                  {getInitials()}
                </div>
                <div className="avatar-info">
                  <p>Your profile picture is generated from your initials</p>
                  <p className="help-text">Update your name to change your avatar</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    className="form-input"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    className="form-input"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <p className="help-text">Your CIT-U email address</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input
                    type="text"
                    name="studentId"
                    className="form-input"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="CIT-2024-001"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="major"
                    className="form-select"
                    value={formData.major}
                    onChange={handleChange}
                  >
                    <option value="CCS">College of Computer Studies</option>
                    <option value="CEA">College of Engineering & Architecture</option>
                    <option value="CASE">College of Arts, Sciences & Education</option>
                    <option value="CBA">College of Business & Accountancy</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  className="form-input"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell others about yourself and your skills"
                />
                <p className="help-text">Share your interests and what you can teach</p>
              </div>

              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        );

      case 'security':
        return (
          <div className="settings-section">
            <h2 className="section-title">Security Settings</h2>
            
            {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
            {passwordError && <div className="error-message">{passwordError}</div>}

            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-input"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-input"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <p className="help-text">Minimum 6 characters</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-save" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <div className="danger-zone">
              <h3 className="danger-title">Two-Factor Authentication</h3>
              <p className="danger-text">Add an extra layer of security to your account</p>
              <button className="btn-danger">Enable 2FA</button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <h2 className="section-title">Notification Preferences</h2>
            
            <div className="info-card">
              <div className="info-label">Email Notifications</div>
              <div className="info-value">Receive booking updates via email</div>
              <p className="help-text">Get notified when someone requests your skill</p>
            </div>

            <div className="info-card">
              <div className="info-label">Booking Alerts</div>
              <div className="info-value">Get alerts for booking confirmations</div>
              <p className="help-text">Stay updated on your skill swap status</p>
            </div>

            <div className="info-card">
              <div className="info-label">Newsletter</div>
              <div className="info-value">Weekly skill exchange highlights</div>
              <p className="help-text">Discover trending skills in your community</p>
            </div>

            <button className="btn-save">Save Preferences</button>
          </div>
        );

      case 'account':
        return (
          <div className="settings-section">
            <h2 className="section-title">Account Information</h2>
            
            <div className="info-card">
              <div className="info-label">Account Type</div>
              <div className="info-value">{loggedInUser?.role === 'ADMIN' ? 'Administrator' : 'Student'}</div>
            </div>

            <div className="info-card">
              <div className="info-label">Member Since</div>
              <div className="info-value">{loggedInUser?.createdAt ? new Date(loggedInUser.createdAt).toLocaleDateString() : 'N/A'}</div>
            </div>

            <div className="info-card">
              <div className="info-label">Account Status</div>
              <div className="info-value">Active</div>
            </div>

            <div className="danger-zone">
              <h3 className="danger-title">Delete Account</h3>
              <p className="danger-text">Permanently delete your account and all data</p>
              <button className="btn-danger">Delete Account</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account preferences</p>
      </div>

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;