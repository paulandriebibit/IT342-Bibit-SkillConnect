// src/features/settings/StudentSettings.js
import React, { useState } from 'react';
import axios from 'axios';
import './Settings.css';

const StudentSettings = ({ loggedInUser, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [formData, setFormData] = useState({
    firstname: loggedInUser?.firstname || '',
    lastname: loggedInUser?.lastname || '',
    email: loggedInUser?.email || '',
    studentId: loggedInUser?.studentId || '',
    major: loggedInUser?.major || 'CCS',
    phone: loggedInUser?.phone || '',
    bio: loggedInUser?.bio || '' // Can cleanly persist as empty string now
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Strict typing mask: prevent entering non-numeric characters or exceeding 11 digits
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 11) return;
      setFormData({ ...formData, phone: numericValue });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Enforce strict limit constraint: must be exactly 11 characters
    if (formData.phone.length !== 11) {
      setError('Phone number must be exactly 11 digits long');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await axios.put(`http://localhost:8080/api/v1/users/${loggedInUser?.id}`, formData);
      const updatedUser = { ...loggedInUser, ...formData };
      
      if (loggedInUser?.rememberMe) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      
      setSuccess('Student profile information synchronized successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update student session data models');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All credential validation attributes are strictly required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Your new credential phrase must contain at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('The matching confirmation verification phrase does not sync');
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

      setPasswordSuccess('Password authentication parameters successfully recovered and rotated');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to authorize security phrase recovery loop';
      setPasswordError(errMsg);
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

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Student Profile Settings</h1>
        <p className="settings-subtitle">Manage your marketplace presentation and peer details</p>
      </div>

      <div className="settings-tabs">
        <button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>My Profile</button>
        <button className={`tab-button ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Security</button>
        <button className={`tab-button ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>Clearance Registry</button>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="settings-section">
            <h2 className="section-title">Marketplace Identity</h2>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleProfileSubmit}>
              <div className="avatar-section">
                <div className="avatar-preview">{getInitials()}</div>
                <div className="avatar-info">
                  <p>Your workspace representation thumbnail</p>
                  <p className="help-text">Standard initial compilation matrix</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input read-only-field" value={formData.firstname} readOnly style={{ backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input read-only-field" value={formData.lastname} readOnly style={{ backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">CIT-U Academic Email</label>
                <input type="email" className="form-input read-only-field" value={formData.email} readOnly style={{ backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Student ID Reference</label>
                  <input type="text" className="form-input read-only-field" value={formData.studentId} readOnly style={{ backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">College Affiliation </label>
                  <input type="text" className="form-input read-only-field" value={formData.major} readOnly style={{ backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Network Contact (Must be exactly 11 digits)</label>
                <input 
                  type="text" 
                  name="phone"
                  className="form-input" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="09XXXXXXXXX" 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biography Overview (Optional)</label>
                <textarea 
                  name="bio"
                  className="form-input" 
                  rows="3" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  placeholder="Tell others about your skills and interests (optional)..." 
                  // FIX: Removed the 'required' tag so users can leave this empty or wipe it clean
                />
              </div>

              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Synchronizing State...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h2 className="section-title">Modify Security Password</h2>
            {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
            {passwordError && <div className="error-message">{passwordError}</div>}
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Security Key</label>
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
                  <p className="help-text">Minimum 6 characters required</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Verify New Password</label>
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
                {passwordLoading ? 'Rotating Encryption Matrices...' : 'Update Password Credentials'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="settings-section">
            <h2 className="section-title">Institutional Verification Profile</h2>
            <div className="info-card"><div className="info-label">Clearance Verification</div><div className="info-value">Active Verified Student</div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSettings;