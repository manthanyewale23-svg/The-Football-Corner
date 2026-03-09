import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import BottomNav from './components/BottomNav.jsx';

import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MatchesPage from './pages/MatchesPage.jsx';
import MatchDetailPage from './pages/MatchDetailPage.jsx';
import PredictionsPage from './pages/PredictionsPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import FDPPage from './pages/FDPPage.jsx';
import CareerPage from './pages/CareerPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import TriviaPage from './pages/TriviaPage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loader-wrap" style={{ minHeight: '100dvh' }}>
        <div className="loader-spinner" />
        <p className="text-muted">Loading The Football Corner...</p>
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" replace />;
}

function AppLayout({ children, hideNav }) {
  return (
    <>
      <main className="page-content">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />

        {/* Main app routes */}
        <Route path="/" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><AppLayout><MatchesPage /></AppLayout></ProtectedRoute>} />
        <Route path="/matches/:id" element={<ProtectedRoute><AppLayout><MatchDetailPage /></AppLayout></ProtectedRoute>} />
        <Route path="/predictions" element={<ProtectedRoute><AppLayout><PredictionsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><AppLayout><LeaderboardPage /></AppLayout></ProtectedRoute>} />
        <Route path="/fdp" element={<ProtectedRoute><AppLayout><FDPPage /></AppLayout></ProtectedRoute>} />
        <Route path="/career" element={<ProtectedRoute><AppLayout><CareerPage /></AppLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />

        {/* New routes */}
        <Route path="/trivia" element={<ProtectedRoute><AppLayout><TriviaPage /></AppLayout></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><AppLayout><StatsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><AppLayout><CommunityPage /></AppLayout></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><AppLayout><FriendsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>} />

        {/* Chat: hide bottom nav so the input bar sits at the very bottom */}
        <Route path="/chat/:uid" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  );
}
