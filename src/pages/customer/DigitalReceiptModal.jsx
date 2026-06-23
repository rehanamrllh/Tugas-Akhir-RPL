import { useState, useEffect } from 'react';
import { formatRp, formatDate } from '../../lib/utils';
import { useSettings } from '../../hooks/useSettings';
import { useOrders } from '../../hooks/useOrders';
import './DigitalReceiptModal.css';

export default function DigitalReceiptModal({ isOpen, order, onClose }) {
  const { settings } = useSettings();
  const { updatePaymentStatus } = useOrders();
  const [showAnim, setShowAnim] = useState(false);

  const handleLanjutkanPembayaran = () => {
    if (order.paymentToken) {
      window.snap.pay(order.paymentToken, {
        onSuccess: function(result) {
          updatePaymentStatus(order.id, 'lunas');
        },
        onPending: function(result) {
          // Tetap menunggu
        },
        onError: function(result) {
          updatePaymentStatus(order.id, 'batal');
        },
        onClose: function() {
          // Tetap menunggu
        }
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowAnim(true), 10);
    } else {
      setShowAnim(false);
    }
  }, [isOpen]);

  if (!isOpen && !showAnim) return null;
  if (!order) return null;

  return (
    <div className={`dr-overlay ${showAnim ? 'show' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="dr-modal">
        {/* Top Decorative edge */}
        <div className="dr-edge-top"></div>
        
        <div className="dr-content">
          <div className="dr-header">
            {order.paymentStatus === 'batal' || order.statusPembayaran === 'batal' ? (
              <>
                <div className="dr-icon-success" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <i className="fa-solid fa-circle-xmark"></i>
                </div>
                <h2 className="dr-title">Pembayaran Gagal</h2>
                <p className="dr-subtitle">Pesanan dibatalkan karena pembayaran tidak diselesaikan.</p>
              </>
            ) : (order.paymentStatus === 'menunggu' || order.statusPembayaran === 'menunggu') && order.paymentMethod === 'midtrans' ? (
              <>
                <div className="dr-icon-success" style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <i className="fa-solid fa-clock"></i>
                </div>
                <h2 className="dr-title">Menunggu Pembayaran</h2>
                <p className="dr-subtitle">Selesaikan pembayaran untuk memproses pesananmu.</p>
              </>
            ) : (
              <>
                <div className="dr-icon-success">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h2 className="dr-title">Pesanan Berhasil!</h2>
                <p className="dr-subtitle">Terima kasih telah memesan di {settings.namaToko || 'Twice Cafe'}</p>
              </>
            )}
          </div>

          <div className="dr-divider-dash"></div>

          <div className="dr-info-grid">
            <div>
              <div className="dr-label">No. Pesanan</div>
              <div className="dr-val">#ORD-{order.id.toString().padStart(3, '0')}</div>
            </div>
            <div>
              <div className="dr-label">Tanggal</div>
              <div className="dr-val">{formatDate(order.waktu).split(' ')[0]}</div>
            </div>
            <div>
              <div className="dr-label">{order.tipePesanan === 'Takeaway' ? 'Antrean' : 'Meja'}</div>
              <div className="dr-val dr-highlight">{order.tipePesanan === 'Takeaway' ? order.id.toString().padStart(3, '0') : order.meja}</div>
            </div>
            <div>
              <div className="dr-label">Pembayaran</div>
              <div className="dr-val">{order.metodePembayaran}</div>
            </div>
          </div>

          <div className="dr-divider-dash"></div>

          <div className="dr-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="dr-item-row">
                <div className="dr-item-left">
                  <span className="dr-item-qty">{item.qty}x</span>
                  <span className="dr-item-name">{item.nama}</span>
                </div>
                <div className="dr-item-price">{formatRp(item.harga * item.qty)}</div>
              </div>
            ))}
          </div>

          <div className="dr-divider-dash"></div>

          <div className="dr-total-row">
            <span>Total Pembayaran</span>
            <span className="dr-total-amount">{formatRp(order.total)}</span>
          </div>

          {order.paymentMethod === 'midtrans' || order.paymentMethod === 'va_bca' ? (
            <div className="dr-payment-note">
              <i className="fa-solid fa-bell"></i> Selesaikan pembayaran sesuai instruksi agar pesanan segera diproses dapur.
            </div>
          ) : (
            <div className="dr-payment-note dr-note-kasir">
              <i className="fa-solid fa-cash-register"></i> Silakan ke kasir untuk melakukan pembayaran.
            </div>
          )}

        </div>

        {/* Bottom Decorative edge */}
        <div className="dr-edge-bottom"></div>

        {order.paymentStatus === 'menunggu' && order.paymentMethod === 'midtrans' && order.paymentToken && (
          <button className="dr-btn-pay" onClick={handleLanjutkanPembayaran} style={{ backgroundColor: '#f59e0b', color: 'white', width: '100%', border: 'none', padding: '16px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <i className="fa-solid fa-wallet"></i> Lanjutkan Pembayaran
          </button>
        )}
        <button className="dr-btn-track" onClick={onClose} style={order.paymentStatus === 'menunggu' && order.paymentToken ? { borderTop: '1px solid #eee' } : {}}>
          Pantau Pesanan Saya <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
