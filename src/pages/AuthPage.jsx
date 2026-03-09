import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { loginWithGoogle, loginWithEmail, signupWithEmail, useDemoLogin } = useAuth();
  const navigate = useNavigate();

  async function handleGoogle() {
    setErr('');
    setLoading(true);
    try {
      await loginWithGoogle(mode === 'signup' ? username : null);
      navigate('/');
    } catch (e) {
      setErr(e.message || 'Authentication failed. Make sure Firebase is configured.');
    } finally { setLoading(false); }
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      if (mode === 'login') await loginWithEmail(email, password);
      else await signupWithEmail(email, password, username);
      navigate('/');
    } catch (e) {
      setErr(e.message || 'Authentication failed.');
    } finally { setLoading(false); }
  }

  function handleDemo() {
    useDemoLogin();
    navigate('/');
  }

  return (
    <div className="auth-bg">
      <div className="auth-hero">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>⚽</div>
          <h1 className="gradient-text" style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>The Football Corner</h1>
          <p className="text-muted" style={{ fontSize: 14, maxWidth: 260 }}>Live scores, predictions, and your Football DNA — all in one app.</p>
        </div>

        {/* Feature pills */}
        <div className="flex gap-8" style={{ flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 }}>
          {['⚡ Live Matches', '🎯 Predictions', '🧬 DNA Profile', '🏆 Leaderboard'].map(f => (
            <span key={f} className="badge badge-green" style={{ fontSize: 10 }}>{f}</span>
          ))}
        </div>
      </div>

      <div className="auth-form-area">
        {/* Tab toggle */}
        <div className="tab-bar" style={{ marginBottom: 24 }}>
          <button className={`tab-btn${mode === 'login' ? ' active' : ''}`} onClick={() => { setMode('login'); setErr(''); }} id="tab-login">Sign In</button>
          <button className={`tab-btn${mode === 'signup' ? ' active' : ''}`} onClick={() => { setMode('signup'); setErr(''); }} id="tab-signup">Create Account</button>
        </div>

        {mode === 'signup' && (
          <div className="input-group" style={{ marginBottom: 20 }}>
            <label className="input-label" htmlFor="input-username">Pick a Unique Username</label>
            <input
              id="input-username"
              className="input"
              type="text"
              placeholder="e.g. TacticMaster99"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            {mode === 'signup' && !username && (
              <p className="text-xs text-muted" style={{ marginTop: 4, color: 'var(--yellow)' }}>
                You must pick a username before creating an account.
              </p>
            )}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-8" style={{ marginBottom: 20 }}>
          <button
            className="btn btn-google btn-full"
            onClick={handleGoogle}
            id="btn-google-auth"
            disabled={loading || (mode === 'signup' && username.trim().length < 3)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.638-.057-1.252-.164-1.84H9v3.48h4.844c-.209 1.12-.843 2.072-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.614z" fill="#4285F4" /><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" /><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" /><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" /></svg>
            {mode === 'signup' ? 'Create Account with Google' : 'Sign In with Google'}
          </button>
        </div>

        <div className="flex items-center gap-12" style={{ marginBottom: 20 }}>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span className="text-muted text-xs" style={{ fontWeight: 600 }}>or email</span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailAuth}>
          <div className="input-group">
            <label className="input-label" htmlFor="input-email">Email</label>
            <input id="input-email" className="input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="input-password">Password</label>
            <input id="input-password" className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>

          {err && (
            <div className="badge badge-red" style={{ display: 'block', padding: '10px 14px', borderRadius: 10, marginBottom: 14, fontSize: 12, fontWeight: 500, textTransform: 'none' }}>
              ⚠️ {err}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="btn-email-auth"
            disabled={loading || (mode === 'signup' && username.trim().length < 3)}
            style={{ marginBottom: 14 }}
          >
            {loading ? '...' : mode === 'login' ? 'Sign In with Email' : 'Create Account with Email'}
          </button>
        </form>

        {/* Demo mode */}
        <button className="btn btn-secondary btn-full" onClick={handleDemo} id="btn-demo-login" style={{ fontSize: 13 }}>
          ⚡ Try Demo Mode (No account needed)
        </button>

        <p className="text-muted text-xs" style={{ textAlign: 'center', marginTop: 20, lineHeight: 1.8 }}>
          By continuing you agree to our Terms of Service. Firebase must be configured for full functionality.
        </p>
      </div>
    </div>
  );
}
