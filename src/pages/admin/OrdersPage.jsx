import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { formatRp, formatDate } from '../../lib/utils';
import PopupModal from '../../components/ui/PopupModal';
import Button from '../../components/ui/Button';
import './OrdersPage.css';

export default function OrdersPage() {
  const { orders, updateOrderStatus, updatePaymentStatus, deleteOrder } = useOrders();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('Terbaru');
  const [isCompact, setIsCompact] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  let displayOrders = [...orders];

  if (search.trim()) {
    const query = search.toLowerCase();
    displayOrders = displayOrders.filter(o => 
      (o.pelanggan && o.pelanggan.toLowerCase().includes(query)) || 
      (`#ORD-${o.id}`).toLowerCase().includes(query)
    );
  }

  if (filterStatus !== 'Semua') {
    displayOrders = displayOrders.filter(o => o.status === filterStatus);
  }

  displayOrders.sort((a, b) => {
    if (sortOrder === 'Terbaru') return new Date(b.waktu) - new Date(a.waktu);
    if (sortOrder === 'Terlama') return new Date(a.waktu) - new Date(b.waktu);
    if (sortOrder === 'Total Tertinggi') return b.total - a.total;
    if (sortOrder === 'Total Terendah') return a.total - b.total;
    return 0;
  });

  const getPaymentMethodLabel = (o) => {
    const pm = o.metodePembayaran || o.paymentMethod || 'kasir';
    if (pm === 'kasir') return 'Bayar di Kasir';
    if (pm === 'midtrans') return 'QRIS / E-Wallet (Midtrans)';
    return pm;
  };

  const getPaymentMethodIcon = (o) => {
    const pm = o.metodePembayaran || o.paymentMethod || 'kasir';
    if (pm === 'kasir') return 'fa-solid fa-cash-register';
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

  return (
    <section className="content-section">
      <div className="orders-management-header">
        <div className="orders-mgmt-left">
          <div className="orders-mgmt-label">ORDER MANAGEMENT</div>
          <h2 className="orders-mgmt-title">Pesanan Masuk</h2>
        </div>
      </div>

      <div className="orders-toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid var(--color-border)' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
          <input 
            type="text" 
            placeholder="Cari nama pelanggan atau #ORD..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '14px', outline: 'none', transition: 'all 0.2s', fontWeight: 500 }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        
        <div style={{ position: 'relative', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <i className="fa-solid fa-filter" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', fontSize: '12px' }}></i>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '12px 36px 12px 36px', borderRadius: '12px', border: '1px solid #e5e7eb', background: 'white', fontSize: '14px', outline: 'none', cursor: 'pointer', appearance: 'none', fontWeight: 600, color: '#374151' }}
            >
              <option value="Semua">Semua Status</option>
              <option value="Baru">Baru</option>
              <option value="Diproses">Diproses</option>
              <option value="Siap">Siap</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
            <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '12px', pointerEvents: 'none' }}></i>
          </div>

          <div style={{ position: 'relative' }}>
            <i className="fa-solid fa-arrow-down-wide-short" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', fontSize: '12px' }}></i>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: '12px 36px 12px 36px', borderRadius: '12px', border: '1px solid #e5e7eb', background: 'white', fontSize: '14px', outline: 'none', cursor: 'pointer', appearance: 'none', fontWeight: 600, color: '#374151' }}
            >
              <option value="Terbaru">Terbaru</option>
              <option value="Terlama">Terlama</option>
              <option value="Total Tertinggi">Total Tertinggi</option>
              <option value="Total Terendah">Total Terendah</option>
            </select>
            <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '12px', pointerEvents: 'none' }}></i>
          </div>

          <button 
            onClick={() => setIsCompact(!isCompact)}
            style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', background: isCompact ? 'var(--color-primary)' : 'white', color: isCompact ? 'white' : '#374151', fontSize: '14px', outline: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
          >
            <i className={isCompact ? "fa-solid fa-expand" : "fa-solid fa-compress"}></i>
            {isCompact ? "Perbesar Pesanan" : "Perkecil Pesanan"}
          </button>
        </div>
      </div>

      <div className="full-order-list">
        {displayOrders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            Tidak ada pesanan yang sesuai.
          </div>
        ) : (
          displayOrders.map(o => {
            const payStatusRaw = o.paymentStatus || o.statusPembayaran || 'belum_bayar';
            return (
              <div key={o.id} className="oc-card">
                <div className="oc-top-row">
                  <div className="oc-top-left">
                    <span className="oc-order-id">#ORD-{o.id}</span>
                    <span className={`oc-status-badge ${getOrderStatusBadgeClass(o.status)}`}>{o.status}</span>
                    <span className={`oc-status-badge ${getPaymentBadgeClass(payStatusRaw)}`}>{getPaymentStatusDisplay(payStatusRaw)}</span>
                  </div>
                  <div className="oc-top-right">
                    <select className="oc-select" value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
                      <option value="Baru">Baru</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Siap">Siap</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                    <select className="oc-select" value={payStatusRaw} onChange={(e) => updatePaymentStatus(o.id, e.target.value)}>
                      <option value="belum_bayar">Belum Bayar</option>
                      <option value="menunggu">Menunggu</option>
                      <option value="lunas">Lunas</option>
                    </select>
                  </div>
                </div>

                <div className="oc-title">
                  {o.tipePesanan === 'Takeaway' || o.meja === '-' ? `Antrean ${o.id.toString().slice(-3)}` : `Meja ${o.meja}`} <span className="oc-dot">•</span> {o.pelanggan}
                </div>
                <div className="oc-date">{formatDate(o.waktu)}{o.noHp ? ` • ${o.noHp}` : ''}</div>

                {!isCompact && (
                  <>
                    <div className="oc-info-row">
                      <div className="oc-info-box">
                    <div className="oc-info-icon"><i className={getPaymentMethodIcon(o)}></i></div>
                    <div>
                      <div className="oc-info-label">METODE PEMBAYARAN</div>
                      <div className="oc-info-val">{getPaymentMethodLabel(o)}</div>
                      <div className="oc-info-sub">
                        {o.paymentRef ? `Ref: ${o.paymentRef}` : 
                         (o.paymentMethod === 'Bayar di Kasir' || o.metodePembayaran === 'Bayar di Kasir') ? 'Transaksi langsung di kasir' :
                         (o.paymentMethod || o.metodePembayaran) ? 'Menunggu pembayaran' : 'Menunggu pilihan pelanggan'}
                      </div>
                    </div>
                  </div>
                  <div className="oc-info-box">
                    <div className="oc-info-icon status-icon"><i className="fa-solid fa-circle-dot"></i></div>
                    <div>
                      <div className="oc-info-label">STATUS PEMBAYARAN</div>
                      <div className="oc-info-val">{getPaymentStatusDisplay(payStatusRaw)}</div>
                      <div className="oc-info-sub">
                        {payStatusRaw === 'lunas' ? 'Pembayaran telah diterima' : 
                         payStatusRaw === 'menunggu' ? 'Menunggu verifikasi admin' : 
                         'Tagihan belum dibayar'}
                      </div>
                    </div>
                  </div>
                  <div className="oc-info-box">
                    <div className="oc-info-icon table-icon">
                      <i className={o.tipePesanan === 'Takeaway' || o.meja === '-' ? "fa-solid fa-bag-shopping" : "fa-solid fa-chair"}></i>
                    </div>
                    <div>
                      <div className="oc-info-label">{o.tipePesanan === 'Takeaway' || o.meja === '-' ? 'ANTREAN' : 'MEJA'}</div>
                      <div className="oc-info-val">{o.tipePesanan === 'Takeaway' || o.meja === '-' ? o.id.toString().slice(-3) : o.meja}</div>
                      <div className="oc-info-sub">{o.tipePesanan === 'Takeaway' || o.meja === '-' ? 'Bawa Pulang (Takeaway)' : 'Di Tempat (Dine-in)'}</div>
                    </div>
                  </div>
                </div>

                <div className="oc-note-box">
                  <span className="oc-note-label"><i className="fa-solid fa-comment-dots"></i> Catatan Pelanggan:</span>
                  {o.catatan || 'Tidak ada catatan tambahan.'}
                </div>

                <div className="oc-items-section">
                  {o.items.map((i, idx) => (
                    <div key={idx} className="oc-item-row">
                      <span className="oc-item-name">{i.qty}x {i.nama}</span>
                      <span className="oc-item-price">{formatRp(i.harga * i.qty)}</span>
                    </div>
                  ))}
                </div>
                </>
                )}

                <div className="oc-footer">
                  <div className="oc-total">Total {formatRp(o.total)}</div>
                  <button className="oc-hapus-btn" onClick={() => setOrderToDelete(o.id)}>Hapus</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PopupModal
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        title="Hapus Pesanan?"
        label="KONFIRMASI"
        width="400px"
      >
        <p style={{ marginBottom: '24px', color: '#6b7280', lineHeight: 1.6 }}>
          Apakah Anda yakin ingin menghapus pesanan <strong>#ORD-{orderToDelete}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => setOrderToDelete(null)}>Batal</Button>
          <Button variant="danger" onClick={() => {
            deleteOrder(orderToDelete);
            setOrderToDelete(null);
          }}>
            <i className="fa-solid fa-trash" style={{ marginRight: '8px' }}></i>
            Ya, Hapus
          </Button>
        </div>
      </PopupModal>
    </section>
  );
}
