import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, you'd pass the logged-in user's ID here
        axios.get('http://localhost:8080/api/v1/bookings')
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'CONFIRMED': return { bg: '#D1FAE5', text: '#065F46' };
            case 'CANCELLED': return { bg: '#FEE2E2', text: '#991B1B' };
            default: return { bg: '#FEF3C7', text: '#92400E' }; // Pending
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading your history...</div>;

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: '#0F172A', fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' }}>My Activity</h2>
                <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}>Track your skill swap requests and upcoming sessions.</p>
            </div>

            <div style={containerStyle}>
                {bookings.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
                        No bookings yet. Visit the Marketplace to start a swap!
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                                <th style={thStyle}>SKILL REQUESTED</th>
                                <th style={thStyle}>PARTNER</th>
                                <th style={thStyle}>STATUS</th>
                                <th style={thStyle}>DATE INITIATED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => {
                                const statusColors = getStatusStyle(booking.status);
                                return (
                                    <tr key={booking.id} style={trStyle}>
                                        <td style={{ ...tdStyle, fontWeight: '600', color: '#1E293B' }}>{booking.skillTitle}</td>
                                        <td style={tdStyle}>{booking.providerName || 'Peer Student'}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                ...badgeStyle,
                                                backgroundColor: statusColors.bg,
                                                color: statusColors.text
                                            }}>
                                                {booking.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, color: '#64748B' }}>
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                        </td>
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

// --- Styles ---

const containerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden'
};

const thStyle = {
    padding: '16px 24px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: '0.05em',
    backgroundColor: '#F8FAFC'
};

const tdStyle = {
    padding: '20px 24px',
    fontSize: '14px',
    color: '#475569'
};

const trStyle = {
    borderBottom: '1px solid #F1F5F9',
    transition: 'background-color 0.2s'
};

const badgeStyle = {
    padding: '4px 12px',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-block'
};

export default BookingDashboard;