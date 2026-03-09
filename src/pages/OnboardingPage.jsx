import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function OnboardingPage() {
    const { completeOnboarding, logout } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (username.trim().length < 3) {
            setError('Username must be at least 3 characters long.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await completeOnboarding(username.trim());
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to set username.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-bg">
            <div className="auth-hero" style={{ paddingTop: '15vh' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>👋</div>
                    <h1 className="gradient-text" style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>
                        Welcome to The Football Corner
                    </h1>
                    <p className="text-muted" style={{ fontSize: 14, maxWidth: 300, margin: '0 auto' }}>
                        We're glad you're here! Let's get started by picking a unique username so your friends can find you.
                    </p>
                </div>
            </div>

            <div className="auth-form-area" style={{ marginTop: 20 }}>
                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: 20 }}>
                        <label className="input-label" htmlFor="input-username">Pick a Unique Username</label>
                        <input
                            id="input-username"
                            className="input"
                            type="text"
                            placeholder="e.g. GoalGuru99"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            minLength={3}
                        />
                    </div>

                    {error && (
                        <div className="badge badge-red" style={{ display: 'block', padding: '10px 14px', borderRadius: 10, marginBottom: 14, fontSize: 13, fontWeight: 500, textTransform: 'none' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading || username.trim().length < 3}
                        style={{ marginBottom: 14, fontSize: 16, padding: '14px 20px' }}
                    >
                        {loading ? 'Checking...' : 'Save & Continue'}
                    </button>
                </form>

                <button
                    className="btn btn-outline btn-full btn-sm"
                    onClick={logout}
                    style={{ marginTop: 20, color: 'var(--text-muted)', border: 'none' }}
                >
                    Use a different account
                </button>
            </div>
        </div>
    );
}
