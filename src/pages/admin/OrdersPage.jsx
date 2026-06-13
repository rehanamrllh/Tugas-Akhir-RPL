import { useOrders } from '../../hooks/useOrders';
import { formatRp, formatDate } from '../../lib/utils';
import './OrdersPage.css';

export default function OrdersPage() {
  const { orders, updateOrderStatus, updatePaymentStatus, deleteOrder } = useOrders();

  const sortedOrders = [...orders].sort((a, b) => new Date(b.waktu) - new Date(a.waktu));

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

  return (
    <section className="content-section">
      <div className="orders-management-header">
        <div className="orders-mgmt-left">
          <div className="orders-mgmt-label">ORDER MANAGEMENT</div>
          <h2 className="orders-mgmt-title">Pesanan Masuk</h2>
        </div>
      </div>

      <div className="full-order-list">
        {sortedOrders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            Belum ada pesanan masuk.
          </div>
        ) : (
          sortedOrders.map(o => {
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

                <div className="oc-footer">
                  <div className="oc-total">Total {formatRp(o.total)}</div>
                  <button className="oc-hapus-btn" onClick={() => { if(window.confirm('Hapus pesanan ini?')) deleteOrder(o.id); }}>Hapus</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
