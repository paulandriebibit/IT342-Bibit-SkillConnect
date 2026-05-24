// src/features/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../catalog/SkillCatalog.css'; 
import '../bookings/BookingDashboard.css'; 
import '../../components/Sidebar.css'; 

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ totalStudents: 0, totalSkills: 0, totalBookings: 0 });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [removalReason, setRemovalReason] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const metricsRes = await axios.get('http://localhost:8080/api/v1/admin/metrics');
      const skillsRes = await axios.get('http://localhost:8080/api/v1/skills');
      setMetrics(metricsRes.data);
      setSkills(skillsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics tracking loops', err);
    } finally {
      setLoading(false);
    }
  };

  const openModerationModal = (skill) => {
    setSelectedSkill(skill);
    setRemovalReason('');
    setShowModal(true);
  };

  const closeModerationModal = () => {
    setSelectedSkill(null);
    setRemovalReason('');
    setShowModal(false);
  };

  const executePolicyRemoval = async (e) => {
    e.preventDefault();
    if (!removalReason.trim()) {
      alert("Please state an official reason for data removal compliance standards.");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/v1/admin/skills/${selectedSkill.id}/moderate`, {
        reason: removalReason
      });
      alert(`Posting managed. Infraction registered against user account ID: ${selectedSkill.providerId}`);
      closeModerationModal();
      fetchAdminData(); 
    } catch (err) {
      alert('Failed to execute administrative policy compliance workflow processing.');
    }
  };

  if (loading) return <div className="text-center" style={{ padding: '60px' }}><p>Loading Monitoring Panel...</p></div>;

  return (
    <div className="BookingContainer">
      <div className="BookingHeader">
        <h1 className="BookingTitle">Admin Oversight Console</h1>
        <p className="BookingSubtitle">Monitor exchange transaction metrics and moderate system-wide skills.</p>
      </div>

      <div className="StatsGrid">
        <div className="StatCard">
          <span className="StatCardValue">{metrics.totalStudents}</span>
          <span className="StatCardLabel">Enrolled Active Students</span>
        </div>
        <div className="StatCard">
          <span className="StatCardValue">{metrics.totalSkills}</span>
          <span className="StatCardLabel">Active Market Postings</span>
        </div>
        <div className="StatCard">
          <span className="StatCardValue">{metrics.totalBookings}</span>
          <span className="StatCardLabel">Swaps Processed</span>
        </div>
      </div>

      <div className="BookingHeader" style={{ marginTop: '40px' }}>
        <h2 className="BookingTitle">Global Marketplace Content Management</h2>
      </div>

      <div className="SkillsGrid">
        {skills.map(skill => (
          <div key={skill.id} className="SkillCard">
            <div className="CardHeader">
              <span className="CategoryTag">{skill.category}</span>
              <span 
                className="StatusBadge StatusCancelled" 
                style={{ cursor: 'pointer' }} 
                onClick={() => openModerationModal(skill)}
              >
                Remove
              </span>
            </div>
            <h3 className="SkillTitle">{skill.title}</h3>
            <p className="SkillDescription">{skill.description}</p>
            <div className="CardFooter">
              <span className="ProviderName">Posted by: {skill.providerName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic PopUp Custom Moderation Input Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModerationModal}>
          <div className="logout-modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title" style={{ color: '#1A6B64' }}>Moderate Marketplace Item</h3>
            <p className="modal-message">
              You are removing <strong>"{selectedSkill?.title}"</strong> posted by user <strong>{selectedSkill?.providerName}</strong>. This policy action will attach a permanent log statement directly to their user record container.
            </p>
            
            <form onSubmit={executePolicyRemoval} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'left' }}>
                <label className="InputLabel" style={{ marginBottom: '8px', fontWeight: '600' }}>Reason for Item Purge / Warning Log *</label>
                <textarea
                  className="InputField"
                  style={{ width: '100%', minHeight: '100px', fontFamily: 'inherit', resize: 'none', padding: '12px' }}
                  placeholder="State the compliance reason (e.g., Profanity, Spam, Plagiarism, Out of Bounds request)..."
                  value={removalReason}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="modal-btn cancel" onClick={closeModerationModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn confirm" style={{ backgroundColor: '#DC2626' }}>
                  Confirm Removal & Log Warning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;