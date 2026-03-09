import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

const SEED_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'news',
    icon: '📰',
    title: 'Breaking: Haaland scores hat-trick!',
    body: 'Man City 3-0 Bayern — Champions League QF',
    link: '/',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'n2',
    type: 'match',
    icon: '⚽',
    title: 'Match Started!',
    body: 'Real Madrid vs Barcelona — El Clásico is LIVE 🔴',
    link: '/matches',
    read: false,
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 'n3',
    type: 'friend',
    icon: '👥',
    title: 'Friend Request',
    body: 'TacticMaster sent you a friend request',
    link: '/friends',
    read: false,
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 'n4',
    type: 'match',
    icon: '🔔',
    title: 'Half Time!',
    body: 'Liverpool 2-0 Chelsea — Half Time whistle blown',
    link: '/matches',
    read: true,
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('tfc-notifications');
      return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('tfc-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  function addNotification(type, icon, title, body, link = '/') {
    const newN = {
      id: `n${Date.now()}`,
      type,
      icon,
      title,
      body,
      link,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newN, ...prev]);
  }

  function markRead(id) {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markRead, markAllRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
