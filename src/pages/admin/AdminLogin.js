import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <section className="login-page">
      <form className="login-card" onSubmit={submit} autoComplete="off">
        <div className="login-brand brand-logo" aria-label="BIG BHK">
          <span className="brand-logo-badge">BB</span>
          <span className="brand-logo-text">
            <span>BIG</span>
            <strong>BHK</strong>
          </span>
        </div>
        <p className="login-subtitle">Property Management Panel &mdash; Sign in to your account</p>

        <label htmlFor="admin-email">Email Address</label>
        <input
          id="admin-email"
          name="bigbhk-admin-email"
          required
          type="email"
          autoComplete="off"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          name="bigbhk-admin-passcode"
          required
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn btn-primary login-submit" type="submit">Sign In to Dashboard</button>
        {error && <p className="form-status error">{error}</p>}

        <Link className="login-back-link" to="/">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to BIGBHK.com
        </Link>
      </form>
    </section>
  );
}

export default AdminLogin;
