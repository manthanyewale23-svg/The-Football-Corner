import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('tfc-notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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
