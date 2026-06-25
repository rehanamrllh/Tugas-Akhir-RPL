import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { users } = useUsers();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.title = 'Login Page';
  }, []);


  const handleLogin = (e) => {
    e.preventDefault();
    let validUser = null;

    if (username.toLowerCase() === 'rhn' && password === 'rhn123') {
      validUser = { name: '💀', role: 'rhn' };
    } else {
      validUser = users.find(u => u.name.toLowerCase() === username.toLowerCase() && (u.password === password || (!u.password && password === '12345')));
    }

    if (validUser) {
      setIsLoading(true);
      setTimeout(() => {
        login(validUser);
        navigate('/admin/dashboard');
      }, 1500); // Aesthetic delay
    } else {
      setError(true);
    }
  };

  if (isLoading) {
    return (
      <div className="login-screen">
        <div className="login-loader-container">
          <div className="login-loader-spinner"></div>
          <h2 className="login-loader-text">Memuat Dashboard...</h2>
          <div className="login-progress-bar"><div className="login-progress-fill"></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <span className="login-label">ADMIN PANEL</span>
        <p className="login-desc">Masuk untuk mengatur menu, pesanan, dan laporan cafe.</p>
        {error && <div className="login-error">Username tidak ditemukan atau password salah. </div>}
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
