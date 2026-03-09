import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext.jsx';

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const TYPE_BG = {
  news: 'rgba(61,142,248,0.15)',
  match: 'rgba(0,200,83,0.15)',
  friend: 'rgba(255,203,43,0.15)',
  message: 'rgba(29,233,182,0.15)',
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const navigate = useNavigate();

  function handleTap(n) {
    markRead(n.id);
    navigate(n.link);
  }

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="page-title" style={{ fontSize: 20 }}>Notifications</h1>
          <p className="text-muted text-xs">{unreadCount} unread</p>
        </div>
        <button
          onClick={markAllRead}
          style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
          id="notif-mark-all-read"
        >
          Mark all read
        </button>
      </div>

      <div style={{ paddingBottom: 80 }}>
        {notifications.length === 0 && (
          <div className="empty-state" style={{ paddingTop: 80 }}>
            <div className="empty-state-icon">🔔</div>
            <p>No notifications yet</p>
          </div>
        )}

        {notifications.map(n => (
          <div
            key={n.id}
            className={`notif-item${!n.read ? ' unread' : ''}`}
            onClick={() => handleTap(n)}
            id={`notif-${n.id}`}
          >
            <div className="notif-icon-circle" style={{ background: TYPE_BG[n.type] || 'var(--surface)' }}>
              {n.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{n.title}</div>
              <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>{n.body}</div>
              <div className="text-xs text-muted" style={{ marginTop: 4 }}>{timeAgo(n.timestamp)}</div>
            </div>
            {!n.read && <div className="notif-unread-dot" />}
          </div>
        ))}

        {notifications.length > 0 && (
          <div style={{ padding: '20px 16px', textAlign: 'center' }}>
            <button
              onClick={clearAll}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}
              id="notif-clear-all"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
