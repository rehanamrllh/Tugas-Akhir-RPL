import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useMenu } from '../../hooks/useMenu';
import { useTables } from '../../hooks/useTables';
import { formatRp, formatDate } from '../../lib/utils';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './DashboardPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function DashboardPage() {
  const { orders, updateOrderStatus, updatePaymentStatus, deleteOrder } = useOrders();
  const { menuItems } = useMenu();
  const { tables } = useTables();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.waktu.startsWith(today));
  const completedToday = todayOrders.filter(o => o.status === 'Selesai');
  const revenueToday = completedToday.reduce((sum, o) => sum + o.total, 0);
  
  const currentMonth = today.substring(0, 7); // YYYY-MM
  const monthOrders = orders.filter(o => o.waktu.startsWith(currentMonth));
  const completedMonth = monthOrders.filter(o => o.status === 'Selesai');
  const revenueMonth = completedMonth.reduce((sum, o) => sum + o.total, 0);

  const completedTotal = orders.filter(o => o.status === 'Selesai');
  const revenueTotal = completedTotal.reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'belum_bayar' || o.statusPembayaran === 'belum_bayar' || !o.paymentStatus).length;

  const chartDataObj = useMemo(() => {
    const labels = [];
    const data = [];
    let omzet7 = 0;
    let order7 = 0;
    let high7 = 0;

    let high7Day = '';

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short' });
      labels.push(dayLabel);
      
      const dayOrders = orders.filter(o => o.waktu.startsWith(dateStr) && o.status === 'Selesai');
      const dayRev = dayOrders.reduce((sum, o) => sum + o.total, 0);
      data.push(dayRev);
      
      omzet7 += dayRev;
      order7 += dayOrders.length;
      if (dayRev >= high7) {
        high7 = dayRev;
        high7Day = dayLabel;
      }
    }
    if (high7 === 0) high7Day = '-';
    
    return {
      labels,
      data,
      omzet7,
      order7,
      high7,
      high7Day,
      chartProps: {
        labels,
        datasets: [{
          label: 'Omzet',
          data,
          borderColor: '#9b111e',
          backgroundColor: 'rgba(155, 17, 30, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0,
          pointBackgroundColor: '#9b111e',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      }
    };
  }, [orders]);

  // Order cards logic
  const recentOrders = [...orders].reverse().slice(0, 4);

  const getPaymentMethodLabel = (o) => {
    const pm = o.metodePembayaran || o.paymentMethod || 'kasir';
    if (pm === 'kasir') return 'Bayar di Kasir';
    if (pm === 'va_bca') return 'Transfer VA BCA';
    if (pm === 'midtrans') return 'Midtrans';
    return pm;
  };

  const getPaymentMethodIcon = (o) => {
    const pm = o.metodePembayaran || o.paymentMethod || 'kasir';
    if (pm === 'kasir') return 'fa-solid fa-cash-register';
    if (pm === 'va_bca') return 'fa-solid fa-building-columns';
    if (pm === 'midtrans') return 'fa-solid fa-bolt';
    return 'fa-solid fa-wallet';
  };

  const getPaymentStatusDisplay = (statusRaw) => {
    if (statusRaw === 'menunggu') return 'Menunggu';
    if (statusRaw === 'lunas') return 'Lunas';
    return 'Belum Bayar';
  };

  const getPaymentBadgeClass = (statusRaw) => {
    if (statusRaw === 'lunas') return 'badge-selesai';
    if (statusRaw === 'menunggu') return 'badge-diproses';
    return 'badge-dibatalkan';
  };

  const getOrderStatusBadgeClass = (status) => {
    if (status === 'Selesai') return 'badge-selesai';
    if (status === 'Baru') return 'badge-baru';
    if (status === 'Diproses') return 'badge-diproses';
    if (status === 'Dibatalkan') return 'badge-dibatalkan';
    return '';
  };

  // Best seller logic
  const bestSellers = useMemo(() => {
    const completed = orders.filter(o => o.status === 'Selesai');
    if (completed.length === 0) return [];
    const itemCounts = {};
    completed.forEach(o => {
      o.items.forEach(i => {
        if (!itemCounts[i.nama]) {
          itemCounts[i.nama] = { nama: i.nama, qty: 0, harga: i.harga };
        }
        itemCounts[i.nama].qty += i.qty;
      });
    });
    return Object.values(itemCounts).sort((a, b) => b.qty - a.qty).slice(0, 4);
  }, [orders]);

  const statusOrderStats = useMemo(() => {
    const stats = { Baru: 0, Diproses: 0, Siap: 0, Selesai: 0, Batal: 0 };
    orders.forEach(o => {
       if (stats[o.status] !== undefined) stats[o.status]++;
       else if (o.status === 'Dibatalkan') stats.Batal++;
    });
    const total = orders.length || 1;
    return [
      { label: 'Baru', icon: 'fa-bell', count: stats.Baru, pct: Math.round(stats.Baru/total * 100) },
      { label: 'Diproses', icon: 'fa-fire-burner', count: stats.Diproses, pct: Math.round(stats.Diproses/total * 100) },
      { label: 'Siap', icon: 'fa-box', count: stats.Siap, pct: Math.round(stats.Siap/total * 100) },
      { label: 'Selesai', icon: 'fa-circle-check', count: stats.Selesai, pct: Math.round(stats.Selesai/total * 100) },
      { label: 'Batal', icon: 'fa-ban', count: stats.Batal, pct: Math.round(stats.Batal/total * 100) },
    ];
  }, [orders]);

  const paymentMethodStats = useMemo(() => {
    const stats = { Kasir: 0, Midtrans: 0, QRIS: 0, VA: 0 };
    orders.forEach(o => {
      const pm = o.paymentMethod || (o.metodePembayaran === 'Bayar di Kasir' ? 'kasir' : o.metodePembayaran === 'VA BCA' ? 'va_bca' : o.metodePembayaran === 'Midtrans' ? 'midtrans' : 'kasir');
      if (pm === 'kasir') stats.Kasir++;
      else if (pm === 'midtrans') stats.Midtrans++;
      else if (pm === 'qris') stats.QRIS++;
      else if (pm === 'va_bca') stats.VA++;
    });
    const total = orders.length || 1;
    return [
      { label: 'Kasir', icon: 'fa-cash-register', count: stats.Kasir, pct: Math.round(stats.Kasir/total * 100) },
      { label: 'Midtrans', icon: 'fa-credit-card', count: stats.Midtrans, pct: Math.round(stats.Midtrans/total * 100) },
      { label: 'QRIS', icon: 'fa-qrcode', count: stats.QRIS, pct: Math.round(stats.QRIS/total * 100) },
      { label: 'VA', icon: 'fa-building-columns', count: stats.VA, pct: Math.round(stats.VA/total * 100) },
    ];
  }, [orders]);

  return (
    <section className="content-section">
      <div className="dash-grid">
        <div className="summary-card">
          <div className="summary-title">Ringkasan Hari Ini</div>
          <div className="summary-main">
            <div>
              <h2>{formatRp(revenueToday)}</h2>
              <p>{todayOrders.length} order hari ini</p>
            </div>
            <div className="summary-icon"><i className="fa-solid fa-cash-register"></i></div>
          </div>
          <div className="summary-bottom">
            <div className="sub-stat">
              <div className="sub-stat-label">Bulan Ini</div>
              <div className="sub-stat-val">{formatRp(revenueMonth)}</div>
            </div>
            <div className="sub-stat">
              <div className="sub-stat-label">Total</div>
              <div className="sub-stat-val">{formatRp(revenueTotal)}</div>
            </div>
          </div>
        </div>
        
        <div className="stat-4-grid">
          <div className="mini-stat">
            <div className="mini-stat-left">
              <div className="mini-stat-label">Order bulan ini</div>
              <div className="mini-stat-val">{monthOrders.length} <span>order</span></div>
            </div>
            <div className="mini-stat-icon"><i className="fa-solid fa-calendar-days"></i></div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-left">
              <div className="mini-stat-label">Belum lunas</div>
              <div className="mini-stat-val">{pendingOrdersCount} <span>ord</span></div>
            </div>
            <div className="mini-stat-icon"><i className="fa-solid fa-hourglass-half"></i></div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-left">
              <div className="mini-stat-label">Menu aktif</div>
              <div className="mini-stat-val">{menuItems.length} <span>item</span></div>
            </div>
            <div className="mini-stat-icon"><i className="fa-solid fa-utensils"></i></div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-left">
              <div className="mini-stat-label">Meja QR</div>
              <div className="mini-stat-val">{tables.length} <span>meja</span></div>
            </div>
            <div className="mini-stat-icon"><i className="fa-solid fa-qrcode"></i></div>
          </div>
        </div>
      </div>

      <div className="white-card dashboard-chart-card">
        <div className="header-label">GRAFIK OMZET</div>
        <div className="dashboard-chart-header">
          <div>
            <h3 className="dashboard-chart-title">Tren 7 hari terakhir</h3>
            <p className="dashboard-chart-subtitle">Omzet dihitung dari order lunas dan selesai.</p>
          </div>
        </div>
        
        <div className="chart-wrapper">
          <Line 
            data={chartDataObj.chartProps} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false, 
              plugins: { legend: { display: false } }, 
              scales: { 
                y: { beginAtZero: true, grid: { borderDash: [5, 5] }, ticks: { callback: v => 'Rp ' + (v/1000) + 'k' } }, 
                x: { grid: { display: false } } 
              } 
            }} 
          />
        </div>

        <div className="stat-4-grid dashboard-stat-grid-3">
          <div className="mini-stat dashboard-stat-item">
            <div className="mini-stat-left">
              <div className="mini-stat-label dashboard-stat-label-wrap"><i className="fa-solid fa-sack-dollar dashboard-stat-icon"></i> OMZET 7 HARI</div>
              <div className="mini-stat-val dashboard-stat-val">{formatRp(chartDataObj.omzet7)}</div>
            </div>
          </div>
          <div className="mini-stat dashboard-stat-item">
            <div className="mini-stat-left">
              <div className="mini-stat-label dashboard-stat-label-wrap"><i className="fa-solid fa-receipt dashboard-stat-icon"></i> TOTAL ORDER</div>
              <div className="mini-stat-val dashboard-stat-val">{chartDataObj.order7} order</div>
            </div>
          </div>
          <div className="mini-stat dashboard-stat-item">
            <div className="mini-stat-left">
              <div className="mini-stat-label dashboard-stat-label-wrap"><i className="fa-solid fa-arrow-trend-up dashboard-stat-icon"></i> HARI TERTINGGI</div>
              <div className="mini-stat-val dashboard-stat-val">{chartDataObj.high7Day}, {formatRp(chartDataObj.high7)}</div>
            </div>
          </div>
        </div>
      </div>

      

      <div className="section-head">MONITORING</div>
      <div className="white-card">
        <div className="dashboard-section-header">
          <h3 className="dashboard-section-title">Pesanan terbaru</h3>
          <button className="btn-hdr white" onClick={() => navigate('/admin/dashboard/orders')}>Lihat semua</button>
        </div>
        <div className="order-list compact-order-list">
          {recentOrders.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Belum ada pesanan masuk.</div>
          ) : (
            recentOrders.map(o => (
              <div key={o.id} className="compact-order-row" onClick={() => navigate('/admin/dashboard/orders')} style={{ cursor: 'pointer' }}>
                <div className="compact-order-left">
                  <div className="compact-order-header">
                    <span className="compact-order-id">#ORD-{o.id}</span>
                    <span className={`oc-status-badge ${getOrderStatusBadgeClass(o.status)}`}>{o.status}</span>
                  </div>
                  <div className="compact-order-info">
                    <i className="fa-solid fa-clock"></i> {formatDate(o.waktu).split(' ')[1]} • 
                    <i className="fa-solid fa-user" style={{ marginLeft: '8px' }}></i> {o.pelanggan || 'Tanpa Nama'} • 
                    <i className={o.tipePesanan === 'Takeaway' || o.meja === '-' ? "fa-solid fa-bag-shopping" : "fa-solid fa-chair"} style={{ marginLeft: '8px' }}></i> {o.tipePesanan === 'Takeaway' || o.meja === '-' ? `Antrean ${o.id.toString().slice(-3)}` : `Meja ${o.meja}`}
                  </div>
                </div>
                <div className="compact-order-right">
                  <span className="compact-order-total">{formatRp(o.total)}</span>
                  <i className="fa-solid fa-chevron-right compact-order-arrow"></i>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dash-grid dashboard-row">
        <div className="white-card dashboard-chart-card">
          <div className="dashboard-mini-header">
            <div className="header-label">CHART</div>
            <div className="dashboard-mini-icon-wrapper"><i className="fa-solid fa-chart-simple"></i></div>
          </div>
          <h3 className="dashboard-mini-title">Status Order</h3>
          <p className="hero-desc dashboard-mini-desc">Status pesanan saat ini.</p>
          
          {statusOrderStats.map(s => (
            <div key={s.label} className="dashboard-progress-wrapper">
              <div className="dashboard-progress-label-row">
                <span><i className={`fa-solid ${s.icon}`}></i> {s.label}</span>
                <span>{s.count} <span className="dashboard-progress-pct">({s.pct}%)</span></span>
              </div>
              <div className="dashboard-progress-track">
                <div className="dashboard-progress-fill" style={{ width: `${s.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="white-card dashboard-chart-card">
          <div className="dashboard-mini-header">
            <div className="header-label">CHART</div>
            <div className="dashboard-mini-icon-wrapper"><i className="fa-solid fa-chart-simple"></i></div>
          </div>
          <h3 className="dashboard-mini-title">Metode Bayar</h3>
          <p className="hero-desc dashboard-mini-desc">Kasir, Midtrans, QRIS, dan VA.</p>
          
          {paymentMethodStats.map(s => (
            <div key={s.label} className="dashboard-progress-wrapper">
              <div className="dashboard-progress-label-row">
                <span><i className={`fa-solid ${s.icon}`}></i> {s.label}</span>
                <span>{s.count} <span className="dashboard-progress-pct">({s.pct}%)</span></span>
              </div>
              <div className="dashboard-progress-track">
                <div className="dashboard-progress-fill" style={{ width: `${s.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-grid">
        <div className="red-card">
          <div className="red-card-title">Kelola cepat</div>
          <button className="red-btn" onClick={() => navigate('/admin/dashboard/menu?action=add')}><i className="fa-solid fa-plus"></i> Tambah Menu</button>
          <button className="red-btn" onClick={() => navigate('/admin/dashboard/tables?action=add')}><i className="fa-solid fa-plus"></i> Tambah Meja QR</button>
          <button className="red-btn dark" onClick={() => navigate('/admin/dashboard/reports')}><i className="fa-solid fa-file-export"></i> Lihat Laporan</button>
        </div>
        
        <div className="white-card">
          <h3>Menu Terlaris</h3>
          <div>
            {bestSellers.length === 0 ? (
              <p className="dashboard-bestseller-empty">Belum ada data pesanan selesai.</p>
            ) : (
              bestSellers.map((item, index) => (
                <div key={index} className="dashboard-bestseller-item">
                  <div className="dashboard-bestseller-left">
                    <div className="dashboard-bestseller-rank">{index + 1}</div>
                    <div>
                      <div className="dashboard-bestseller-name">{item.nama}</div>
                      <div className="dashboard-bestseller-qty">{item.qty} terjual</div>
                    </div>
                  </div>
                  <div className="dashboard-bestseller-price">{formatRp(item.harga * item.qty)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
