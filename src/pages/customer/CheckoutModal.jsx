import { useState, useEffect } from 'react';
import { formatRp } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import { useMenu } from '../../hooks/useMenu';
import './CheckoutModal.css';

export default function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { menuItems, updateMenuItem } = useMenu();

  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [catatan, setCatatan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('kasir');
  const [orderType, setOrderType] = useState('dine_in');
  const [error, setError] = useState(false);
  const [showAnim, setShowAnim] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowAnim(true), 10);
    } else {
      setShowAnim(false);
    }
  }, [isOpen]);

  if (!isOpen && !showAnim) return null;

  const handleSubmit = () => {
    if (!nama.trim()) {
      setError(true);
      return;
    }
    
    const params = new URLSearchParams(window.location.search);
    const meja = params.get('meja') || '1';

    const orderData = {
      pelanggan: nama,
      noHp,
      catatan,
      meja: orderType === 'dine_in' ? meja : '-',
      tipePesanan: orderType === 'dine_in' ? 'Dine In' : 'Takeaway',
      items: cart,
      total: cartTotal,
      metodePembayaran: paymentMethod === 'kasir' ? 'Bayar di Kasir' : paymentMethod === 'va_bca' ? 'VA BCA' : 'Midtrans',
      paymentMethod,
      statusPembayaran: paymentMethod === 'kasir' ? 'belum_bayar' : 'menunggu',
      paymentStatus: paymentMethod === 'kasir' ? 'belum_bayar' : 'menunggu',
    };

    const newOrder = createOrder(orderData);

    // Decrease stock for each item
    cart.forEach(cartItem => {
      const menu = menuItems.find(m => m.id === cartItem.menuId);
      if (menu && typeof menu.stock === 'number') {
        const newStock = menu.stock - cartItem.qty;
        updateMenuItem(menu.id, { 
          ...menu, 
          stock: newStock,
          tersedia: newStock > 0
        });
      }
    });

    clearCart();
    setNama('');
    setNoHp('');
    setCatatan('');
    setPaymentMethod('kasir');
    onSuccess(newOrder);
  };

  return (
    <div 
      className={`co-overlay ${showAnim ? 'show' : ''} co-overlay-flex`} 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="co-modal">
        {/* Header */}
        <div className="co-header">
          <div>
            <div className="co-header-label">KONFIRMASI PESANAN</div>
            <h3 className="co-header-title">Checkout</h3>
          </div>
          <button className="co-close" onClick={onClose}>&times;</button>
        </div>

        {/* Body */}
        <div className="co-body">
          {/* Order Summary */}
          <div className="co-section">
            <div className="co-section-title"><i className="fa-solid fa-receipt"></i> Ringkasan Pesanan</div>
            <div className="co-items-list">
              {cart.map(item => (
                <div key={item.menuId} className="co-item-row">
                  <div className="co-item-left">
                    <span className="co-item-qty">{item.qty}&times;</span>
                    <span className="co-item-name">{item.nama}</span>
                  </div>
                  <span className="co-item-price">{formatRp(item.harga * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="co-subtotal">
              <span>Subtotal</span>
              <span>{formatRp(cartTotal)}</span>
            </div>
          </div>

          <div className="co-divider"></div>

          {/* Order Type */}
          <div className="co-section">
            <div className="co-section-title"><i className="fa-solid fa-utensils"></i> Tipe Pesanan</div>
            <div className="co-type-grid">
              <label className={`co-payment-card ${orderType === 'dine_in' ? 'selected' : ''}`} style={{ padding: '12px' }}>
                <input type="radio" name="orderType" value="dine_in" checked={orderType === 'dine_in'} onChange={(e) => setOrderType(e.target.value)} className="co-radio-hidden" />
                <div className="co-pay-icon co-type-icon-dine">
                  <i className="fa-solid fa-chair"></i>
                </div>
                <div className="co-pay-info">
                  <div className="co-pay-name" style={{ fontSize: '13px' }}>Dine In</div>
                </div>
                <div className="co-pay-check"><i className="fa-solid fa-circle-check"></i></div>
              </label>

              <label className={`co-payment-card ${orderType === 'takeaway' ? 'selected' : ''}`} style={{ padding: '12px' }}>
                <input type="radio" name="orderType" value="takeaway" checked={orderType === 'takeaway'} onChange={(e) => setOrderType(e.target.value)} className="co-radio-hidden" />
                <div className="co-pay-icon co-type-icon-take">
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>
                <div className="co-pay-info">
                  <div className="co-pay-name" style={{ fontSize: '13px' }}>Takeaway</div>
                </div>
                <div className="co-pay-check"><i className="fa-solid fa-circle-check"></i></div>
              </label>
            </div>
          </div>

          <div className="co-divider"></div>

          {/* Customer Info */}
          <div className="co-section">
            <div className="co-section-title"><i className="fa-solid fa-user"></i> Informasi Pemesan</div>
            <div className="co-form-row">
              <div className="co-form-group">
                <label className="co-label">Nama Pemesan <span className="co-required">*</span></label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => { setNama(e.target.value); setError(false); }}
                  className={`co-input ${error ? 'co-input-error' : ''}`}
                  placeholder={error ? "Nama wajib diisi!" : "Masukkan nama kamu..."}
                />
              </div>
              <div className="co-form-group">
                <label className="co-label">Nomor HP <span className="co-optional">(opsional)</span></label>
                <input type="tel" value={noHp} onChange={(e) => setNoHp(e.target.value)} className="co-input" placeholder="08xxxxxxxxxx" />
              </div>
            </div>
          </div>

          <div className="co-divider"></div>

          {/* Order Notes */}
          <div className="co-section">
            <div className="co-section-title"><i className="fa-solid fa-pen-to-square"></i> Catatan Pesanan</div>
            <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} className="co-textarea" rows="3" placeholder="Contoh: Kopi tanpa gula, es batu sedikit, tidak pakai bawang..."></textarea>
          </div>

          <div className="co-divider"></div>

          {/* Payment Method */}
          <div className="co-section">
            <div className="co-section-title"><i className="fa-solid fa-wallet"></i> Metode Pembayaran</div>
            <div className="co-payment-grid">
              <label className={`co-payment-card ${paymentMethod === 'kasir' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="kasir" checked={paymentMethod === 'kasir'} onChange={(e) => setPaymentMethod(e.target.value)} className="co-radio-hidden" />
                <div className="co-pay-icon co-pay-icon-kasir">
                  <i className="fa-solid fa-cash-register"></i>
                </div>
                <div className="co-pay-info">
                  <div className="co-pay-name">Bayar di Kasir</div>
                  <div className="co-pay-desc">Bayar langsung ke kasir</div>
                </div>
                <div className="co-pay-check"><i className="fa-solid fa-circle-check"></i></div>
              </label>

              <label className={`co-payment-card ${paymentMethod === 'va_bca' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="va_bca" checked={paymentMethod === 'va_bca'} onChange={(e) => setPaymentMethod(e.target.value)} className="co-radio-hidden" />
                <div className="co-pay-icon co-pay-icon-va">
                  <i className="fa-solid fa-building-columns"></i>
                </div>
                <div className="co-pay-info">
                  <div className="co-pay-name">Transfer VA BCA</div>
                  <div className="co-pay-desc">Virtual Account Bank BCA</div>
                </div>
                <div className="co-pay-check"><i className="fa-solid fa-circle-check"></i></div>
              </label>

              <label className={`co-payment-card ${paymentMethod === 'midtrans' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="midtrans" checked={paymentMethod === 'midtrans'} onChange={(e) => setPaymentMethod(e.target.value)} className="co-radio-hidden" />
                <div className="co-pay-icon co-pay-icon-midtrans">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <div className="co-pay-info">
                  <div className="co-pay-name">Midtrans</div>
                  <div className="co-pay-desc">Kartu kredit / e-wallet / QRIS</div>
                </div>
                <div className="co-pay-check"><i className="fa-solid fa-circle-check"></i></div>
              </label>
            </div>

            {/* VA BCA Detail */}
            {paymentMethod === 'va_bca' && (
              <div className="co-pay-detail co-pay-detail-block">
                <div className="co-pay-detail-inner">
                  <i className="fa-solid fa-circle-info co-pay-icon-color-va"></i>
                  <div>
                    <div className="co-pay-detail-title">Nomor Virtual Account BCA</div>
                    <div className="co-pay-detail-num">1234 5678 9012 3456</div>
                    <div className="co-pay-detail-sub">Transfer sesuai total pesanan. Bukti transfer akan diverifikasi kasir.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Midtrans Detail */}
            {paymentMethod === 'midtrans' && (
              <div className="co-pay-detail co-pay-detail-block">
                <div className="co-pay-detail-inner">
                  <i className="fa-solid fa-circle-info co-pay-icon-color-midtrans"></i>
                  <div>
                    <div className="co-pay-detail-title">Pembayaran via Midtrans</div>
                    <div className="co-pay-detail-sub">Setelah checkout, kamu akan mendapat link pembayaran via WhatsApp / email untuk menyelesaikan transaksi.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="co-footer">
          <div className="co-footer-total">
            <div className="co-footer-label">Total Pembayaran</div>
            <div className="co-footer-amount">{formatRp(cartTotal)}</div>
          </div>
          <button className="co-submit-btn" onClick={handleSubmit}>
            <i className="fa-solid fa-check"></i> Konfirmasi Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}
