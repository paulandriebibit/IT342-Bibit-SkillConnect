import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../catalog/SkillCatalog.css';
import '../bookings/BookingDashboard.css';

const VerifiedUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to resolve user account lists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteConfirmation = (student) => {
    setSelectedUser(student);
    setShowConfirmModal(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedUser(null);
    setShowConfirmModal(false);
  };

  const handleExecuteAccountDeletion = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/admin/users/${selectedUser.id}`);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
      closeDeleteConfirmation();
    } catch (err) {
      console.error('Failed operational routine during database item erasure:', err);
      alert('Failed to delete account node record');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Loading user registry ledger...</div>;
  }

  return (
    <div className="BookingContainer">
      <div className="BookingsCard">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student Profile</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Institutional ID</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department Node</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Line</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Management Controls</th>
            </tr>
          </thead>
          <tbody>
            {users.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '18px 24px' }}>
                  <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '14px' }}>{student.firstname} {student.lastname}</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{student.email}</div>
                </td>
                <td style={{ padding: '18px 24px', fontSize: '14px', color: '#475569' }}>{student.studentId || 'Unspecified'}</td>
                <td style={{ padding: '18px 24px', fontSize: '14px', color: '#475569' }}>
                  <span className="CategoryTag" style={{ padding: '4px 10px', fontSize: '11px' }}>{student.major}</span>
                </td>
                <td style={{ padding: '18px 24px', fontSize: '14px', color: '#475569', fontFamily: 'monospace' }}>{student.phone || 'None Linked'}</td>
                <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                  <button 
                    className="ActionCancel" 
                    style={{ border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                    onClick={() => openDeleteConfirmation(student)}
                  >
                    Delete Node
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '48px 24px', textAlign: 'center', color: '#64748B' }}>No student profile records discovered in current registry container.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay" onClick={closeDeleteConfirmation}>
          <div className="logout-modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title" style={{ color: '#EF4444' }}>Purge Student Identity?</h3>
            <p className="modal-message">
              Are you sure you want to permanently delete the account for <strong>{selectedUser?.firstname} {selectedUser?.lastname}</strong>? This structural action is irreversible and drops all database logs.
            </p>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={closeDeleteConfirmation}>Cancel</button>
              <button className="modal-btn confirm" style={{ backgroundColor: '#EF4444' }} onClick={handleExecuteAccountDeletion}>Confirm Deletion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedUsersList;