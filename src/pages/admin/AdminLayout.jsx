import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMenu } from '../../hooks/useMenu';
import { useOrders } from '../../hooks/useOrders';
import { useTables } from '../../hooks/useTables';
import { useSettings } from '../../hooks/useSettings';
import './AdminLayout.css';

const NAV_ITEMS = [
  { path: '/admin/dashboard', icon: 'fa-chart-line', label: 'Dashboard', desc: 'Ringkasan usaha' },
  { path: '/admin/dashboard/orders', icon: 'fa-receipt', label: 'Pesanan', desc: 'Order masuk' },
  { path: '/admin/dashboard/menu', icon: 'fa-utensils', label: 'Menu', desc: 'Makanan & minuman' },
  { path: '/admin/dashboard/tables', icon: 'fa-qrcode', label: 'Meja & QR', desc: 'QR tiap meja' },
  { path: '/admin/dashboard/reports', icon: 'fa-file-export', label: 'Laporan', desc: 'Rekap jualan' },
  { path: '/admin/dashboard/settings', icon: 'fa-gear', label: 'Setting', desc: 'Profil cafe' },
];

export default function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { menuItems } = useMenu();
  const { orders } = useOrders();
  const { tables } = useTables();
  const { settings } = useSettings();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.title = `Admin Page ${settings.namaToko || 'Twice Cafe'}`;
    return () => {
      document.title = settings.namaToko || 'Twice Cafe';
    };
  }, [settings.namaToko]);

  if (!isAuthenticated || !user) return null;

  // RBAC Navigation Filtering
  const role = user.role;
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (role === 'Programmer') return true;
    if (role === 'Pemilik Kafe') return item.path === '/admin/dashboard' || item.path === '/admin/dashboard/reports';
    if (role === 'Kasir') return item.path === '/admin/dashboard' || item.path === '/admin/dashboard/orders' || item.path === '/admin/dashboard/tables';
    if (role === 'Staf Dapur') return item.path === '/admin/dashboard/orders';
    if (role === 'Admin') return item.path === '/admin/dashboard/menu' || item.path === '/admin/dashboard/settings';
    return false;
  });

  // Redirect if user tries to access a page they don't have permission for
  useEffect(() => {
    if (filteredNavItems.length > 0) {
      const isAllowed = filteredNavItems.some(n => n.path === location.pathname);
      // Dashboard has an exact path match index issue sometimes, let's strictly check based on items
      // The dashboard route is '/admin/dashboard'
      if (!isAllowed) {
        navigate(filteredNavItems[0].path, { replace: true });
      }
    }
  }, [location.pathname, role, navigate]); // using role instead of filteredNavItems to avoid infinite loop

  const activeNav = filteredNavItems.find(n => n.path === location.pathname) || filteredNavItems[0];
  const pendingOrders = orders.filter(o => o.status === 'Baru' || o.status === 'Diproses').length;

  return (
    <div className="admin-panel">
      <aside className="sidebar" id="sidebar">
        <nav className="sidebar-nav">
          <div className="nav-item admin-layout-nav-item-header">
            <div className="nav-icon admin-layout-nav-icon-header">
              {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" className="admin-layout-logo-img" /> : <i className="fa-solid fa-mug-hot"></i>}
            </div>
            <div>
              <span className="nav-label admin-layout-nav-label-header">{settings.namaToko || 'NAMA TOKO'}</span>
              <span className="nav-desc admin-layout-nav-desc-header">{user.name} ({user.role})</span>
            </div>
          </div>
          {filteredNavItems.map(item => (
            <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''} admin-layout-link-no-decor`}>
              <div className="nav-icon"><i className={`fa-solid ${item.icon}`}></i></div>
              <div>
                <span className="nav-label">{item.label}</span>
                <span className="nav-desc">{item.desc}</span>
              </div>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-status aes-sidebar-status">
          <div className="aes-status-header">
            <div className="live-dot"></div>
            <span className="aes-status-title">Live Status</span>
          </div>
          <div className="aes-status-grid">
            <div className="aes-status-box">
              <span className="aes-status-val">{menuItems.length}</span>
              <span className="aes-status-label">Menu</span>
            </div>
            <div className="aes-status-box highlight">
              <span className="aes-status-val">{pendingOrders}</span>
              <span className="aes-status-label">Order</span>
            </div>
            <div className="aes-status-box">
              <span className="aes-status-val">{tables.length}</span>
              <span className="aes-status-label">Meja</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', marginTop: 'auto' }} className="admin-logout-container">
          <button onClick={logout} className="nav-item" style={{ width: '100%', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: 'none', cursor: 'pointer' }}>
            <div className="nav-icon"><i className="fa-solid fa-right-from-bracket"></i></div>
            <div>
              <span className="nav-label">Logout</span>
              <span className="nav-desc">Keluar dari admin</span>
            </div>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <main className="admin-content">
          <div className="content-header">
            <div className="header-icon"><i className={`fa-solid ${activeNav.icon}`}></i></div>
            <div className="header-text">
              <div className="header-label">{activeNav?.label?.toUpperCase()}</div>
              <h2 className="header-title"> {settings.namaToko || 'NAMA TOKO'}</h2>
              <p className="header-desc">Kelola operasional cafe dari satu dashboard: pesanan realtime, menu, QR meja.</p>
            </div>
            <div className="header-actions">
              <button className="btn-hdr white" onClick={handleRefresh} disabled={isRefreshing}>
                <i className={`fa-solid fa-rotate-right ${isRefreshing ? 'fa-spin' : ''}`}></i> {isRefreshing ? 'Menyegarkan...' : 'Refresh'}
              </button>
              <Link to="/" className="btn-hdr dark admin-layout-link-no-decor"><i className="fa-solid fa-eye"></i> Customer</Link>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
