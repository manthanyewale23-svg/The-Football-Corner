import { NavLink } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext.jsx';

const navItems = [
  { to: '/', label: 'Home', icon: '🏡' },
  { to: '/matches', label: 'Matches', icon: '⚽' },
  { to: '/trivia', label: 'Trivia', icon: '🧩' },
  { to: '/community', label: 'Community', icon: '🌍' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const { unreadCount } = useNotifications();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          aria-label={item.label}
          id={`nav-${item.label.toLowerCase()}`}
        >
          <span className="nav-icon-wrap">
            <span className="nav-icon">{item.icon}</span>
            {item.to === '/community' && unreadCount > 0 && (
              <span className="nav-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </span>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
