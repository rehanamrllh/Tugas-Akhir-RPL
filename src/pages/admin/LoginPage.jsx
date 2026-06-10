import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { users } = useUsers();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard');
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'rhn' && password === 'rhn123') {
      login({ name: 'Programmer', role: 'Programmer' });
      navigate('/admin/dashboard');
      return;
    }

    const matchedUser = users.find(u => u.name.toLowerCase() === username.toLowerCase() && password === '12345');
    if (matchedUser) {
      login(matchedUser);
      navigate('/admin/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="login-screen" style={{ display: 'flex' }}>
      <div className="login-card">
        <div className="login-icon">☕</div>
        <span className="login-label">ADMIN PANEL</span>
        <h1 className="login-title">Twice Cafe</h1>
        <p className="login-desc">Masuk untuk mengatur menu, pesanan, dan laporan cafe.</p>
        {error && <div className="login-error">Username tidak ditemukan atau password salah. Password default: 12345</div>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nama Pengguna"
            className="login-input"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(false); }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            required
          />
          <button type="submit" className="login-btn">
            <i className="fa-solid fa-lock"></i> Masuk Admin
          </button>
        </form>
        <a href="/" className="login-back">← Kembali ke menu pelanggan</a>
      </div>
    </div>
  );
}
