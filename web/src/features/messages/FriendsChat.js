import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const FriendsChat = ({ preselectedPartner }) => {
  const [contacts, setContacts] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = loggedInUser?.id;
  
  const chatBottomRef = useRef(null);

  useEffect(() => {
    fetchChatContacts();
  }, []);

  useEffect(() => {
    if (preselectedPartner) {
      handleSelectContact(preselectedPartner);
    }
  }, [preselectedPartner]);

  useEffect(() => {
    if (!activePartner) return;
    fetchChatLogs(activePartner.id);

    const checkIncomingInterval = setInterval(() => {
      fetchChatLogs(activePartner.id);
    }, 4000);

    return () => clearInterval(checkIncomingInterval);
  }, [activePartner]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatContacts = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/messages/contacts/${currentUserId}`);
      setContacts(res.data);
      if (res.data.length > 0 && !preselectedPartner && !activePartner) {
        setActivePartner(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching chat partners logs:', err);
    }
  };

  const fetchChatLogs = async (partnerId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/messages/history?user1=${currentUserId}&user2=${partnerId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error rendering communication threads:', err);
    }
  };

  const handleSelectContact = (contact) => {
    setActivePartner(contact);
    setContacts((prev) => {
      if (prev.some(c => String(c.id) === String(contact.id))) return prev;
      return [contact, ...prev];
    });
  };

  const handleSendMessageSubmit = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activePartner) return;

    const payload = {
      senderId: currentUserId,
      senderName: `${loggedInUser?.firstname || ''} ${loggedInUser?.lastname || ''}`.trim(),
      receiverId: activePartner.id,
      receiverName: activePartner.name,
      content: typedMessage.trim()
    };

    try {
      const res = await axios.post('http://localhost:8080/api/v1/messages', payload);
      setMessages((prev) => [...prev, res.data]);
      setTypedMessage('');
      fetchChatContacts();
    } catch (err) {
      console.error('Failed to ship text block trace:', err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '620px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      
      <div style={{ width: '260px', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
        <div style={{ padding: '20px', fontSize: '15px', fontWeight: '700', color: '#1E293B', borderBottom: '1px solid #E2E8F0' }}>Active Match Channels</div>
        <div style={{ flex: '1', overflowY: 'auto' }}>
          {contacts.length === 0 ? (
            <p style={{ padding: '20px', fontSize: '13px', color: '#94A3B8', textAlign: 'center' }}>No active chat partners available. Request a swap to start messaging.</p>
          ) : (
            contacts.map(c => (
              <div 
                key={c.id} 
                style={{ padding: '14px 20px', cursor: 'pointer', background: activePartner?.id === c.id ? '#E2E8F0' : 'transparent', borderBottom: '1px solid #EDF2F7', transition: 'all 0.1s' }}
                onClick={() => setActivePartner(c)}
              >
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#1E293B' }}>{c.name}</div>
                <span style={{ fontSize: '11px', color: '#238B7A', fontWeight: '500' }}>Active</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
        {activePartner ? (
          <>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#1E293B' }}>{activePartner.name}</div>
            </div>

            <div style={{ flex: '1', padding: '24px', overflowY: 'auto', background: '#F1F5F9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map(m => {
                const isMe = m.senderId === currentUserId;
                return (
                  <div key={m.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%', background: isMe ? '#238B7A' : '#FFFFFF', color: isMe ? '#FFFFFF' : '#1E293B', padding: '12px 16px', borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', lineHeight: '1.4', wordBreak: 'break-word' }}>{m.content}</div>
                    <div style={{ fontSize: '10px', opacity: '0.7', textAlign: 'right', marginTop: '4px' }}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSendMessageSubmit} style={{ padding: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '12px', background: '#F8FAFC' }}>
              <input 
                type="text" 
                style={{ flex: '1', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' }}
                placeholder={`Type your reply message to ${activePartner.name}...`}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                required
              />
              <button type="submit" style={{ background: '#238B7A', color: 'white', border: 'none', padding: '0 24px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Send</button>
            </form>
          </>
        ) : (
          <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '14px' }}>Select an active communications node channel from the sidebar list matrix.</div>
        )}
      </div>

    </div>
  );
};

export default FriendsChat;