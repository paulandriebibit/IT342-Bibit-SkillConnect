import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingDashboard.css';

const BookingDashboard = ({ onStartChat }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [targetedBookingId, setTargetedBookingId] = useState(null);
  const [resultConfig, setResultConfig] = useState({ title: '', message: '', isSuccess: true });
  
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = loggedInUser?.id;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/bookings/my-bookings/${currentUserId}`);
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching filtered bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const processDeclineClick = (bookingId) => {
    setTargetedBookingId(bookingId);
    setShowDeclineModal(true);
  };

  const executeStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings();
      
      if (newStatus === 'CANCELLED') {
        setShowDeclineModal(false);
        setResultConfig({
          title: 'Request Declined',
          message: 'The swap request has been rejected. The requester will be notified of this action.',
          isSuccess: false
        });
      } else {
        setResultConfig({
          title: 'Swap Request Accepted',
          message: 'You have successfully confirmed this swap! You can now message the student via the Friends tab.',
          isSuccess: true
        });
      }
      setShowResultModal(true);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update request status.');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'sent') return booking.requesterId === currentUserId;
    if (activeTab === 'received') return booking.providerId === currentUserId;
    return true;
  });

  if (loading) return <div className="BookingContainer"><p>Loading bookings ledger...</p></div>;

  return (
    <div className="BookingContainer">
      <div className="BookingTabs">
        <button className={`TabButton ${activeTab === 'all' ? 'Active' : ''}`} onClick={() => setActiveTab('all')}>All Activities</button>
        <button className={`TabButton ${activeTab === 'sent' ? 'Active' : ''}`} onClick={() => setActiveTab('sent')}>Sent Requests</button>
        <button className={`TabButton ${activeTab === 'received' ? 'Active' : ''}`} onClick={() => setActiveTab('received')}>Received Offers</button>
      </div>

      <div className="BookingsCard">
        {filteredBookings.length === 0 ? (
          <div className="EmptyBookings"><span className="EmptyTitle">No Activity Logged</span></div>
        ) : (
          <table className="BookingsTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Skill Item</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Swapping Partner</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Assignment Context</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const isRequester = booking.requesterId === currentUserId;
                const displayPartnerName = isRequester ? booking.providerName : booking.requesterName;
                const partnerId = isRequester ? booking.providerId : booking.requesterId;
                const canAct = booking.status === 'PENDING' && !isRequester;

                return (
                  <tr key={booking.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 12px', fontWeight: '600' }}>{booking.skillTitle}</td>
                    <td style={{ padding: '16px 12px' }}>{displayPartnerName}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className={`StatusBadge ${isRequester ? 'StatusPending' : 'StatusConfirmed'}`} style={{ fontSize: '11px' }}>
                        {isRequester ? 'Outgoing Request' : 'Incoming Offer'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className={`StatusBadge Status${booking.status}`}>{booking.status}</span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {canAct && (
                          <>
                            <button className="ActionBtn ActionConfirm" style={{ padding: '6px 12px', background: '#238B7A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => executeStatusChange(booking.id, 'CONFIRMED')}>✓ Accept</button>
                            <button className="ActionBtn ActionCancel" style={{ padding: '6px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => processDeclineClick(booking.id)}>✗ Decline</button>
                          </>
                        )}
                        <button 
                          style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #238B7A', color: '#238B7A', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                          onClick={() => onStartChat({ id: partnerId, name: displayPartnerName })}
                        >
                          💬 Chat
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showDeclineModal && (
        <div className="modal-overlay" onClick={() => setShowDeclineModal(false)}>
          <div className="logout-modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title" style={{ color: '#DC2626' }}>Decline Swap Offer?</h3>
            <p className="modal-message">Are you sure you want to reject this skill trade? This operation will notify the requesting student.</p>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={() => setShowDeclineModal(false)}>Cancel</button>
              <button className="modal-btn confirm" style={{ backgroundColor: '#DC2626' }} onClick={() => executeStatusChange(targetedBookingId, 'CANCELLED')}>Decline Offer</button>
            </div>
          </div>
        </div>
      )}

      {showResultModal && (
        <div className="modal-overlay" onClick={() => setShowResultModal(false)}>
          <div className="logout-modal" style={{ maxWidth: '420px', textAlign: 'center', padding: '30px 20px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: resultConfig.isSuccess ? '#DCFCE7' : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span style={{ fontSize: '24px', color: resultConfig.isSuccess ? '#16A34A' : '#DC2626' }}>{resultConfig.isSuccess ? '✓' : '✕'}</span>
            </div>
            <h3 className="modal-title" style={{ fontSize: '18px', marginBottom: '8px' }}>{resultConfig.title}</h3>
            <p className="modal-message" style={{ fontSize: '13px', marginBottom: '20px' }}>{resultConfig.message}</p>
            <button className="modal-btn confirm" style={{ background: '#238B7A', width: '100%' }} onClick={() => setShowResultModal(false)}>Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDashboard;