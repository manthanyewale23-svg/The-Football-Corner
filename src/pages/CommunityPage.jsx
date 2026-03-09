import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotifications } from '../contexts/NotificationContext.jsx';
import { Link } from 'react-router-dom';

const MOCK_POSTS = [
  { id: 'p1', uid: 'u1', username: 'TacticMaster', initials: 'TM', content: 'Real Madrid vs Barcelona was absolutely insane! Mbappé vs Yamal — what a Clásico! ⚽🔥', tag: 'La Liga', likes: ['u2', 'u3'], comments: 4, timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'p2', uid: 'u2', username: 'GoalGuru99', initials: 'GG', content: 'Liverpool are going to win the Premier League this season. Their form is simply unmatched 🔴', tag: 'Premier League', likes: ['u1', 'u4', 'u5'], comments: 7, timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'p3', uid: 'u3', username: 'xGWizard', initials: 'XG', content: 'Haaland hat-trick again 🤯 The man is not human. 24 goals in 28 games is absolutely ridiculous. Future Ballon d\'Or?', tag: 'Transfer', likes: ['u1'], comments: 12, timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'p4', uid: 'u4', username: 'PitchProphet', initials: 'PP', content: 'Unpopular opinion: Vinicius Jr is better than Mbappé right now. Debate me 👇', tag: 'Opinion', likes: ['u2', 'u5', 'u6', 'u7'], comments: 22, timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
];

const TAGS = ['All', 'Premier League', 'La Liga', 'Opinion', 'Transfer', 'Champions League'];

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function CommunityPage() {
  const { user, userData } = useAuth();
  const { unreadCount } = useNotifications();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [tag, setTag] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState('');
  const [draftTag, setDraftTag] = useState('Opinion');

  const uid = user?.uid || 'me';
  const filtered = tag === 'All' ? posts : posts.filter(p => p.tag === tag);

  function toggleLike(postId) {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(uid);
      return { ...p, likes: liked ? p.likes.filter(l => l !== uid) : [...p.likes, uid] };
    }));
  }

  function submitPost() {
    if (!draft.trim()) return;
    const newPost = {
      id: `p${Date.now()}`,
      uid,
      username: userData?.username || 'You',
      initials: (userData?.username || 'Y').slice(0, 2).toUpperCase(),
      content: draft,
      tag: draftTag,
      likes: [],
      comments: 0,
      timestamp: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
    setDraft('');
    setShowModal(false);
  }

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Community</h1>
          <p className="text-muted text-xs">Football fans talking</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/notifications" style={{ position: 'relative', textDecoration: 'none', fontSize: 22 }} id="community-bell">
            🔔
            {unreadCount > 0 && (
              <span className="nav-badge" style={{ top: -4, right: -4 }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </Link>
          <Link to="/friends" style={{ textDecoration: 'none', fontSize: 22 }} id="community-friends-link">👥</Link>
        </div>
      </div>

      <div className="p-page pt-16">
        {/* Tags filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 16, scrollbarWidth: 'none' }}>
          {TAGS.map(t => (
            <button key={t} onClick={() => setTag(t)}
              style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 99, border: tag === t ? 'none' : '1px solid var(--border)',
                background: tag === t ? 'var(--green)' : 'var(--surface)', color: tag === t ? '#000' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
              id={`tag-filter-${t}`}
            >{t}</button>
          ))}
        </div>

        {/* New Post Button */}
        <button className="card" onClick={() => setShowModal(true)}
          style={{ width: '100%', padding: '14px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, cursor: 'pointer', border: '1px solid var(--border)' }}
          id="new-post-btn"
        >
          <div className="post-avatar">{(userData?.username || 'Y').slice(0, 2).toUpperCase()}</div>
          <span className="text-muted" style={{ fontSize: 14 }}>Share your football take...</span>
          <span style={{ marginLeft: 'auto', fontSize: 20 }}>✍️</span>
        </button>

        {/* Posts */}
        {filtered.map(post => {
          const liked = post.likes.includes(uid);
          return (
            <div key={post.id} className="card post-card" id={`post-${post.id}`}>
              <div className="post-header">
                <div className="post-avatar">{post.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{post.username}</div>
                  <div className="text-xs text-muted">{timeAgo(post.timestamp)}</div>
                </div>
                <span className="badge badge-blue" style={{ fontSize: 10 }}>{post.tag}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)' }}>{post.content}</p>
              <div className="post-actions">
                <button className={`post-action-btn${liked ? ' liked' : ''}`} onClick={() => toggleLike(post.id)} id={`like-${post.id}`}>
                  {liked ? '❤️' : '🤍'} {post.likes.length}
                </button>
                <button className="post-action-btn" id={`comment-${post.id}`}>
                  💬 {post.comments}
                </button>
                <button className="post-action-btn" id={`share-${post.id}`}>
                  🔗 Share
                </button>
              </div>
            </div>
          );
        })}
        <div style={{ height: 24 }} />
      </div>

      {/* New Post Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>📝 New Post</h2>
            <textarea
              autoFocus
              placeholder="Share your football take..."
              value={draft}
              onChange={e => setDraft(e.target.value)}
              style={{ width: '100%', minHeight: 100, padding: 14, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', fontSize: 14, resize: 'none', outline: 'none', marginBottom: 14 }}
              id="post-textarea"
            />
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {TAGS.filter(t => t !== 'All').map(t => (
                <button key={t} onClick={() => setDraftTag(t)}
                  style={{ padding: '5px 12px', borderRadius: 99, border: draftTag === t ? 'none' : '1px solid var(--border)',
                    background: draftTag === t ? 'var(--green)' : 'var(--surface)', color: draftTag === t ? '#000' : 'var(--text-secondary)',
                    fontWeight: 700, fontSize: 11, cursor: 'pointer' }}
                >{t}</button>
              ))}
            </div>
            <button className="btn btn-primary btn-full" onClick={submitPost} disabled={!draft.trim()} id="submit-post-btn">
              🌍 Post to Community
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
