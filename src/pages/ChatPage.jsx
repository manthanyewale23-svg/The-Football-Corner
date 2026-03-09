import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { db } from '../services/firebase.js';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, serverTimestamp, doc, getDoc
} from 'firebase/firestore';

function formatTime(ts) {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Create a consistent chat room ID from two UIDs (always sorted so both users get the same room)
function getChatRoomId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

export default function ChatPage() {
  const { uid: friendUid } = useParams();
  const { user } = useAuth();
  const myUid = user?.uid;

  const [friendData, setFriendData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  // 1. Fetch friend's real username from Firestore
  useEffect(() => {
    if (!friendUid) return;
    async function loadFriend() {
      try {
        const snap = await getDoc(doc(db, 'users', friendUid));
        if (snap.exists()) {
          setFriendData(snap.data());
        } else {
          setFriendData({ username: 'User', isOnline: false });
        }
      } catch (err) {
        console.error('Could not load friend:', err);
        setFriendData({ username: 'User', isOnline: false });
      }
    }
    loadFriend();
  }, [friendUid]);

  // 2. Listen for real messages from Firestore in real time
  useEffect(() => {
    if (!myUid || !friendUid) return;

    const roomId = getChatRoomId(myUid, friendUid);
    const q = query(
      collection(db, 'chats', roomId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = [];
      snap.forEach(d => msgs.push({ id: d.id, ...d.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [myUid, friendUid]);

  // 3. Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Send a real message to Firestore
  async function send() {
    if (!text.trim() || !myUid) return;
    const roomId = getChatRoomId(myUid, friendUid);
    const msgText = text.trim();
    setText('');
    try {
      await addDoc(collection(db, 'chats', roomId, 'messages'), {
        senderId: myUid,
        text: msgText,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }

  const username = friendData?.username || 'Loading...';
  const initials = username.slice(0, 2).toUpperCase();
  const photoURL = friendData?.photoURL;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      {/* Header */}
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/friends" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>←</Link>
          <div style={{ position: 'relative' }}>
            {photoURL ? (
              <img
                src={photoURL}
                alt={username}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--green)' }}
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--teal))', display: photoURL ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#000' }}>
              {initials}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{username}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Tap to see profile</div>
          </div>
        </div>
        <span style={{ fontSize: 20 }}>⚽</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 72 }}>
        <div className="chat-wrap">
          {messages.length === 0 && (
            <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '40px 0' }}>
              No messages yet. Say hello! 👋
            </p>
          )}
          {messages.map(msg => {
            const isMine = msg.senderId === myUid;
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                  {msg.text}
                </div>
                <div className="chat-time" style={{ textAlign: isMine ? 'right' : 'left' }}>
                  {formatTime(msg.createdAt)}
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
