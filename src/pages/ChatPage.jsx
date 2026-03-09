import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const MOCK_FRIENDS = {
  u1: { username: 'TacticMaster', isOnline: true },
  u2: { username: 'GoalGuru99', isOnline: false },
  u3: { username: 'xGWizard', isOnline: true },
  u4: { username: 'PitchProphet', isOnline: false },
  u5: { username: 'FootballOracle', isOnline: true },
};

const SEED_MESSAGES = [
  { id: 'm1', senderId: 'u3', text: 'Hey! Did you see the Clásico last night? 🔥', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'm2', senderId: 'me', text: 'Yes! Mbappé was incredible. What a finish!', timestamp: new Date(Date.now() - 28 * 60000).toISOString() },
  { id: 'm3', senderId: 'u3', text: 'Barcelona almost had it though. Yamal is something else at 17!', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
];

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPage() {
  const { uid: friendUid } = useParams();
  const { user } = useAuth();
  const myUid = user?.uid || 'me';
  const friend = MOCK_FRIENDS[friendUid] || { username: 'Unknown', isOnline: false };

  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    if (!text.trim()) return;
    const msg = {
      id: `m${Date.now()}`,
      senderId: myUid,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    setText('');

    // Simulate auto-reply after 1.5s
    setTimeout(() => {
      const replies = [
        '😂 No way!', 'Totally agree!', '⚽ Football is life!',
        'Did you predict the score?', 'I think Liverpool will win the league 🔴',
        'Haaland is unstoppable this season!', 'Who do you think wins the UCL?',
      ];
      const reply = {
        id: `m${Date.now() + 1}`,
        senderId: friendUid,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      {/* Header */}
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/friends" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>←</Link>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#000' }}>
              {friend.username.slice(0, 2).toUpperCase()}
            </div>
            {friend.isOnline && (
              <div style={{ width: 10, height: 10, background: 'var(--green)', borderRadius: '50%', border: '2px solid var(--bg-primary)', position: 'absolute', bottom: 0, right: 0 }} />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{friend.username}</div>
            <div className="text-xs" style={{ color: friend.isOnline ? 'var(--green)' : 'var(--text-muted)' }}>
              {friend.isOnline ? '🟢 Online' : '⚫ Offline'}
            </div>
          </div>
        </div>
        <span style={{ fontSize: 20 }}>⚽</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 72 }}>
        <div className="chat-wrap">
          {messages.map(msg => {
            const isMine = msg.senderId === myUid;
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                  {msg.text}
                </div>
                <div className="chat-time" style={{ textAlign: isMine ? 'right' : 'left' }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="chat-input-bar" style={{ paddingBottom: 'calc(var(--nav-height) + 12px)' }}>
        <input
          className="input"
          style={{ flex: 1, padding: '10px 14px', fontSize: 14 }}
          placeholder="Message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          id="chat-input"
        />
        <button
          className="btn btn-primary"
          style={{ padding: '10px 18px', fontSize: 18, flexShrink: 0 }}
          onClick={send}
          id="chat-send-btn"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
