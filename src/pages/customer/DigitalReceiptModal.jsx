import { useState, useEffect } from 'react';
import { formatRp, formatDate } from '../../lib/utils';
import { useSettings } from '../../hooks/useSettings';
import './DigitalReceiptModal.css';

export default function DigitalReceiptModal({ isOpen, order, onClose }) {
  const { settings } = useSettings();
  const [showAnim, setShowAnim] = useState(false);

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
            <div className="dr-icon-success">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2 className="dr-title">Pesanan Berhasil!</h2>
            <p className="dr-subtitle">Terima kasih telah memesan di {settings.namaToko || 'Twice Cafe'}</p>
          </div>

          <div className="dr-divider-dash"></div>

          <div className="dr-info-grid">
            <div>
              <div className="dr-label">No. Pesanan</div>
              <div className="dr-val">#ORD-{order.id.toString().slice(-6)}</div>
            </div>
            <div>
              <div className="dr-label">Tanggal</div>
              <div className="dr-val">{formatDate(order.waktu).split(' ')[0]}</div>
            </div>
            <div>
              <div className="dr-label">{order.tipePesanan === 'Takeaway' ? 'Antrean' : 'Meja'}</div>
              <div className="dr-val dr-highlight">{order.tipePesanan === 'Takeaway' ? order.id.toString().slice(-3) : order.meja}</div>
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

        <button className="dr-btn-track" onClick={onClose}>
          Pantau Pesanan Saya <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
