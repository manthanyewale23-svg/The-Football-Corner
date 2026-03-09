import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotifications } from '../contexts/NotificationContext.jsx';

const MOCK_USERS = [
  { uid: 'u1', username: 'TacticMaster', favoriteTeam: 'Liverpool', isOnline: true },
  { uid: 'u2', username: 'GoalGuru99', favoriteTeam: 'Arsenal', isOnline: false },
  { uid: 'u3', username: 'xGWizard', favoriteTeam: 'Manchester City', isOnline: true },
  { uid: 'u4', username: 'PitchProphet', favoriteTeam: 'Real Madrid', isOnline: false },
  { uid: 'u5', username: 'FootballOracle', favoriteTeam: 'Barcelona', isOnline: true },
];

export default function FriendsPage() {
  const { user, userData } = useAuth();
  const { addNotification } = useNotifications();
  const [search, setSearch] = useState('');
  const [sentRequests, setSentRequests] = useState([]);
  const [friends, setFriends] = useState(['u3']); // Simulate one existing friend
  const [requests, setRequests] = useState([
    { uid: 'u5', username: 'FootballOracle', favoriteTeam: 'Barcelona' },
  ]);
  const [tab, setTab] = useState('friends');

  const myUid = user?.uid || 'me';

  const searchResults = search.length >= 2
    ? MOCK_USERS.filter(u =>
        u.uid !== myUid &&
        !friends.includes(u.uid) &&
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  function sendRequest(uid) {
    setSentRequests(prev => [...prev, uid]);
    addNotification('friend', '👥', 'Friend request sent!', `You sent a request to ${MOCK_USERS.find(u => u.uid === uid)?.username}`, '/friends');
  }

  function acceptRequest(req) {
    setFriends(prev => [...prev, req.uid]);
    setRequests(prev => prev.filter(r => r.uid !== req.uid));
  }

  function declineRequest(uid) {
    setRequests(prev => prev.filter(r => r.uid !== uid));
  }

  const friendList = MOCK_USERS.filter(u => friends.includes(u.uid));

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Friends</h1>
          <p className="text-muted text-xs">{friendList.length} friends</p>
        </div>
        <span style={{ fontSize: 24 }}>👥</span>
      </div>

      <div className="p-page pt-16">
        {/* Tabs */}
        <div className="tab-bar">
          <button className={`tab-btn${tab === 'friends' ? ' active' : ''}`} onClick={() => setTab('friends')} id="friends-tab">
            👥 Friends
          </button>
          <button className={`tab-btn${tab === 'requests' ? ' active' : ''}`} onClick={() => setTab('requests')} id="requests-tab">
            📩 Requests {requests.length > 0 && `(${requests.length})`}
          </button>
          <button className={`tab-btn${tab === 'find' ? ' active' : ''}`} onClick={() => setTab('find')} id="find-tab">
            🔍 Find
          </button>
        </div>

        {/* Friends list */}
        {tab === 'friends' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            {friendList.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <p>No friends yet — search to add some!</p>
              </div>
            )}
            {friendList.map(u => (
              <div key={u.uid} className="friend-row" id={`friend-${u.uid}`}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#000' }}>
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  {u.isOnline && <div className="online-dot" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{u.username}</div>
                  <div className="text-xs text-muted">⭐ {u.favoriteTeam} · {u.isOnline ? '🟢 Online' : '⚫ Offline'}</div>
                </div>
                <Link to={`/chat/${u.uid}`} className="btn btn-outline btn-sm" style={{ textDecoration: 'none', fontSize: 12 }} id={`chat-${u.uid}`}>
                  💬 Chat
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Requests */}
        {tab === 'requests' && (
          <>
            {requests.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📩</div>
                <p>No pending requests</p>
              </div>
            )}
            {requests.map(req => (
              <div key={req.uid} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }} id={`request-${req.uid}`}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,var(--yellow),var(--orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#000', flexShrink: 0 }}>
                  {req.username.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{req.username}</div>
                  <div className="text-xs text-muted">⭐ {req.favoriteTeam}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => acceptRequest(req)} id={`accept-${req.uid}`}>✅ Accept</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => declineRequest(req.uid)} id={`decline-${req.uid}`}>❌</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Find */}
        {tab === 'find' && (
          <>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <input
                className="input"
                placeholder="🔍 Search by username..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="find-friends-search"
              />
            </div>
            {search.length < 2 && (
              <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '32px 0' }}>
                Type at least 2 characters to search
              </p>
            )}
            {searchResults.map(u => (
              <div key={u.uid} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }} id={`find-user-${u.uid}`}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0 }}>
                  {u.username.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{u.username}</div>
                  <div className="text-xs text-muted">⭐ {u.favoriteTeam}</div>
                </div>
                {sentRequests.includes(u.uid) ? (
                  <span className="badge badge-green" style={{ fontSize: 11 }}>✓ Sent</span>
                ) : (
                  <button className="btn btn-outline btn-sm" onClick={() => sendRequest(u.uid)} id={`add-${u.uid}`}>➕ Add</button>
                )}
              </div>
            ))}
          </>
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
