// src/features/bookings/BookingDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/BookingDashboard.css';

const BookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = loggedInUser?.id;

  console.log('Current User:', loggedInUser);
  console.log('Current User ID:', currentUserId);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/bookings');
      console.log('All bookings from backend:', res.data);
      console.log('Number of bookings:', res.data.length);
      
      // Log each booking's IDs for debugging
      res.data.forEach(booking => {
        console.log(`Booking ${booking.id}: requesterId=${booking.requesterId}, providerId=${booking.providerId}`);
      });
      
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/bookings/${bookingId}/status`, { status: newStatus });
      alert(`Booking ${newStatus.toLowerCase()} successfully!`);
      fetchBookings();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update booking status');
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return { class: 'StatusConfirmed', label: '✓ Confirmed' };
      case 'COMPLETED':
        return { class: 'StatusCompleted', label: '✓ Completed' };
      case 'CANCELLED':
        return { class: 'StatusCancelled', label: '✗ Cancelled' };
      default:
        return { class: 'StatusPending', label: '⏳ Pending' };
    }
  };

  const getMyBookings = () => {
    console.log('Filtering for user ID:', currentUserId);
    const filtered = bookings.filter(booking => {
      const matches = booking.requesterId === currentUserId || booking.providerId === currentUserId;
      if (matches) {
        console.log('Found matching booking:', booking);
      }
      return matches;
    });
    console.log('My bookings filtered:', filtered);
    return filtered;
  };

  const getFilteredBookings = () => {
    const myBookings = getMyBookings();
    
    if (activeTab === 'all') return myBookings;
    if (activeTab === 'received') {
      return myBookings.filter(b => b.providerId === currentUserId);
    }
    if (activeTab === 'sent') {
      return myBookings.filter(b => b.requesterId === currentUserId);
    }
    return myBookings;
  };

  const filteredBookings = getFilteredBookings();
  
  const stats = {
    total: getMyBookings().length,
    pending: getMyBookings().filter(b => b.status === 'PENDING').length,
    confirmed: getMyBookings().filter(b => b.status === 'CONFIRMED').length,
    completed: getMyBookings().filter(b => b.status === 'COMPLETED').length
  };

  if (loading) {
    return (
      <div className="BookingContainer">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="BookingContainer">
      <div className="BookingHeader">
        <h1 className="BookingTitle">My Activity</h1>
        <p className="BookingSubtitle">Track your skill swap requests and upcoming sessions</p>
      </div>

      <div className="StatsGrid">
        <div className="StatCard">
          <div className="StatCardIcon"></div>
          <div className="StatCardValue">{stats.total}</div>
          <div className="StatCardLabel">My Exchanges</div>
        </div>
        <div className="StatCard">
          <div className="StatCardIcon"></div>
          <div className="StatCardValue">{stats.pending}</div>
          <div className="StatCardLabel">Pending</div>
        </div>
        <div className="StatCard">
          <div className="StatCardIcon"></div>
          <div className="StatCardValue">{stats.confirmed}</div>
          <div className="StatCardLabel">Confirmed</div>
        </div>
        <div className="StatCard">
          <div className="StatCardIcon"></div>
          <div className="StatCardValue">{stats.completed}</div>
          <div className="StatCardLabel">Completed</div>
        </div>
      </div>

      <div className="BookingTabs">
        <button 
          className={`TabButton ${activeTab === 'all' ? 'Active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({getMyBookings().length})
        </button>
        <button 
          className={`TabButton ${activeTab === 'received' ? 'Active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received ({getMyBookings().filter(b => b.providerId === currentUserId).length})
        </button>
        <button 
          className={`TabButton ${activeTab === 'sent' ? 'Active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent ({getMyBookings().filter(b => b.requesterId === currentUserId).length})
        </button>
      </div>

      <div className="BookingsCard">
        {filteredBookings.length === 0 ? (
          <div className="EmptyBookings">
            <div className="EmptyIcon"></div>
            <h3 className="EmptyTitle">No bookings yet</h3>
            <p className="EmptyText">Visit the Marketplace to start a skill swap!</p>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
              Debug: Your User ID is {currentUserId}
            </p>
          </div>
        ) : (
          <table className="BookingsTable">
            <thead>
              <tr>
                <th>SKILL REQUESTED</th>
                <th>{activeTab === 'received' ? 'REQUESTED BY' : 'PROVIDED BY'}</th>
                <th>STATUS</th>
                <th>DATE</th>
                {activeTab === 'received' && <th>ACTIONS</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const statusStyle = getStatusStyle(booking.status);
                const isReceived = booking.providerId === currentUserId;
                const canAct = isReceived && booking.status === 'PENDING';
                
                return (
                  <tr key={booking.id}>
                    <td style={{ fontWeight: '600', color: '#1E293B' }}>
                      {booking.skillTitle}
                    </td>
                    <td>
                      {activeTab === 'received' 
                        ? (booking.requesterName || 'Unknown User')
                        : (booking.providerName || 'Unknown User')
                      }
                    </td>
                    <td>
                      <span className={`StatusBadge ${statusStyle.class}`}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td style={{ color: '#64748B' }}>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    {activeTab === 'received' && (
                      <td>
                        {canAct ? (
                          <div className="ActionButtons">
                            <button
                              className="ActionBtn ActionConfirm"
                              onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            >
                              ✓ Accept
                            </button>
                            <button
                              className="ActionBtn ActionCancel"
                              onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            >
                              ✗ Decline
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '12px' }}>
                            {booking.status === 'CONFIRMED' ? 'Confirmed' : 'No action needed'}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;