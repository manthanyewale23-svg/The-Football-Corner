import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotifications } from '../contexts/NotificationContext.jsx';
import { db } from '../services/firebase.js';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

export default function FriendsPage() {
  const { user, userData } = useAuth();
  const { addNotification } = useNotifications();
  const [search, setSearch] = useState('');

  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  // Need to store the actual friend user objects, not just IDs
  const [friendProfiles, setFriendProfiles] = useState([]);
  const [requestProfiles, setRequestProfiles] = useState([]);

  const [tab, setTab] = useState('friends');
  const [loading, setLoading] = useState(false);

  const myUid = user?.uid;

  // 1. Listen for Incoming Requests
  useEffect(() => {
    if (!myUid) return;

    const q = query(collection(db, 'friendRequests'), where('receiverId', '==', myUid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const incoming = [];
      snapshot.forEach(doc => {
        incoming.push({ id: doc.id, ...doc.data() });
      });
      setRequests(incoming);

      // Fetch details for these users
      const profiles = await fetchUserProfiles(incoming.map(r => r.senderId));
      setRequestProfiles(profiles);
    });

    return () => unsubscribe();
  }, [myUid]);

  // 2. Listen for My Friends List (from userData)
  useEffect(() => {
    if (userData && userData.friends) {
      const friendIds = userData.friends;
      setFriends(friendIds);

      // Fetch friend details
      if (friendIds.length > 0) {
        fetchUserProfiles(friendIds).then(setFriendProfiles);
      } else {
        setFriendProfiles([]);
      }
    } else {
      setFriends([]);
      setFriendProfiles([]);
    }
  }, [userData]);

  // Helper function to fetch user profiles by their UIDs
  async function fetchUserProfiles(uids) {
    if (!uids || uids.length === 0) return [];

    // Note: Firestore 'in' queries are limited to 10 items.
    // For a real app, you might need to chunk these.
    const chunks = [];
    for (let i = 0; i < uids.length; i += 10) {
      chunks.push(uids.slice(i, i + 10));
    }

    const results = [];
    for (const chunk of chunks) {
      const q = query(collection(db, 'users'), where('uid', 'in', chunk));
      const snap = await getDocs(q);
      snap.forEach(d => results.push(d.data()));
    }
    return results;
  }

  // 3. Search for Users
  useEffect(() => {
    async function searchUsers() {
      if (search.length < 2) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        // Fetch users and filter client-side for case-insensitive and partial matching
        // (Suitable for smaller apps, solves the strict case-sensitivity of Firestore)
        const snap = await getDocs(collection(db, 'users'));
        const results = [];
        const searchLower = search.toLowerCase();

        snap.forEach(doc => {
          const data = doc.data();
          // Filter out myself, existing friends, and check for a substring match
          const friendIds = friends || [];
          const safeMyUid = myUid || '';

          if (
            data.uid !== safeMyUid &&
            !friendIds.includes(data.uid) &&
            data.username &&
            typeof data.username === 'string' &&
            data.username.toLowerCase().includes(searchLower)
          ) {
            results.push(data);
          }
        });
        console.log("Found matches:", results);
        setSearchResults(results);
      } catch (err) {
        console.error("Search error:", err);
      }
      setLoading(false);
    }

    // Simple debounce
    const timeout = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeout);
  }, [search, myUid, friends]);


  async function sendRequest(receiverUid, receiverName) {
    if (!myUid) return;

    setSentRequests(prev => [...prev, receiverUid]);

    try {
      // Use a combined string as the document ID so we can't send duplicates
      const requestId = `${myUid}_${receiverUid}`;
      await setDoc(doc(db, 'friendRequests', requestId), {
        senderId: myUid,
        receiverId: receiverUid,
        timestamp: new Date()
      });
      addNotification('friend', '👥', 'Friend request sent!', `You sent a request to ${receiverName}`, '/friends');
    } catch (err) {
      console.error("Error sending request:", err);
      // Revert optimism
      setSentRequests(prev => prev.filter(id => id !== receiverUid));
    }
  }

  async function acceptRequest(req) {
    if (!userData) return;

    try {
      // 1. Add them to my friends list
      const myRef = doc(db, 'users', myUid);
      const myNewFriends = [...(userData.friends || []), req.senderId];
      await setDoc(myRef, { friends: myNewFriends }, { merge: true });

      // 2. Add me to their friends list
      const theirRef = doc(db, 'users', req.senderId);
      const theirDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', req.senderId)));
      let theirData = null;
      theirDoc.forEach(d => theirData = d.data());

      if (theirData) {
        const theirNewFriends = [...(theirData.friends || []), myUid];
        await setDoc(theirRef, { friends: theirNewFriends }, { merge: true });
      }

      // 3. Delete the request document
      await deleteDoc(doc(db, 'friendRequests', req.id));

      addNotification('friend', '✅', 'Friend request accepted!', '', '/friends');
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  }

  async function declineRequest(reqId) {
    try {
      await deleteDoc(doc(db, 'friendRequests', reqId));
    } catch (err) {
      console.error("Error declining request:", err);
    }
  }

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Friends</h1>
          <p className="text-muted text-xs">{friendProfiles.length} friends</p>
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
            {friendProfiles.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <p>No friends yet — search to add some!</p>
              </div>
            )}
            {friendProfiles.map(u => (
              <div key={u.uid} className="friend-row" id={`friend-${u.uid}`}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#000' }}>
                    {(u.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{u.username || 'User'}</div>
                  <div className="text-xs text-muted">⭐ {u.favoriteTeam || 'No team'}</div>
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
            {requestProfiles.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📩</div>
                <p>No pending requests</p>
              </div>
            )}
            {requestProfiles.map(u => {
              // Find the corresponding request object
              const req = requests.find(r => r.senderId === u.uid);
              if (!req) return null;

              return (
                <div key={req.id} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }} id={`request-${req.id}`}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,var(--yellow),var(--orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#000', flexShrink: 0 }}>
                    {(u.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{u.username || 'User'}</div>
                    <div className="text-xs text-muted">⭐ {u.favoriteTeam || 'No team'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => acceptRequest(req)} id={`accept-${req.id}`}>✅</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => declineRequest(req.id)} id={`decline-${req.id}`}>❌</button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Find */}
        {tab === 'find' && (
          <>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <input
                className="input"
                placeholder="🔍 Search by username... (Case sensitive)"
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
            {loading ? (
              <p className="text-center text-muted">Searching...</p>
            ) : (
              searchResults.map(u => (
                <div key={u.uid} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }} id={`find-user-${u.uid}`}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0 }}>
                    {(u.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{u.username || 'User'}</div>
                    <div className="text-xs text-muted">⭐ {u.favoriteTeam || 'No team'}</div>
                  </div>
                  {sentRequests.includes(u.uid) ? (
                    <span className="badge badge-green" style={{ fontSize: 11 }}>✓ Sent</span>
                  ) : (
                    <button className="btn btn-outline btn-sm" onClick={() => sendRequest(u.uid, u.username)} id={`add-${u.uid}`}>➕ Add</button>
                  )}
                </div>
              ))
            )}
          </>
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
