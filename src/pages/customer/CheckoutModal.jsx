import { useState, useRef } from 'react';
import { formatRp } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import { useMenu } from '../../hooks/useMenu';
import PopupModal from '../../components/ui/PopupModal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import './CheckoutModal.css';

export default function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { menuItems, updateMenuItem } = useMenu();

  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [catatan, setCatatan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('kasir');
  const [orderType, setOrderType] = useState('dine_in');
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const namaRef = useRef(null);

  const processCheckout = (orderData) => {
    const newOrder = createOrder(orderData);

    // Decrease stock for each item only if not cancelled
    if (orderData.paymentStatus !== 'batal' && orderData.statusPembayaran !== 'batal') {
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
    }

    clearCart();
    setNama('');
    setNoHp('');
    setEmail('');
    setCatatan('');
    setPaymentMethod('kasir');
    setIsProcessing(false);
    onSuccess(newOrder);
  };

  const handleSubmit = async () => {
    if (!nama.trim()) {
      setError(true);
      if (namaRef.current) {
        namaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        namaRef.current.focus();
      }
      return;
    }
    
    const params = new URLSearchParams(window.location.search);
    const meja = params.get('meja') || '1';

    const orderData = {
      pelanggan: nama,
      noHp,
      email,
      catatan,
      meja: orderType === 'dine_in' ? meja : '-',
      tipePesanan: orderType === 'dine_in' ? 'Dine In' : 'Takeaway',
      items: cart,
      total: cartTotal,
      metodePembayaran: paymentMethod === 'kasir' ? 'Bayar di Kasir' : 'Midtrans',
      paymentMethod,
      statusPembayaran: paymentMethod === 'kasir' ? 'belum_bayar' : 'menunggu',
      paymentStatus: paymentMethod === 'kasir' ? 'belum_bayar' : 'menunggu',
    };

    if (paymentMethod === 'midtrans') {
      setIsProcessing(true);
      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: `ORDER-${Date.now()}`,
            gross_amount: cartTotal,
            customer_details: {
              first_name: nama,
              phone: noHp
            },
            item_details: cart.map(item => ({
              id: item.menuId,
              price: item.harga,
              quantity: item.qty,
              name: item.nama
            }))
          })
        });

        const data = await response.json();
        
        if (data.token) {
          orderData.paymentToken = data.token;
          window.snap.pay(data.token, {
            onSuccess: function(result) {
              orderData.statusPembayaran = 'lunas';
              orderData.paymentStatus = 'lunas';
              processCheckout(orderData);
            },
            onPending: function(result) {
              orderData.statusPembayaran = 'menunggu';
              orderData.paymentStatus = 'menunggu';
              processCheckout(orderData);
            },
            onError: function(result) {
              orderData.statusPembayaran = 'batal';
              orderData.paymentStatus = 'batal';
              processCheckout(orderData);
            },
            onClose: function() {
              orderData.statusPembayaran = 'menunggu';
              orderData.paymentStatus = 'menunggu';
              processCheckout(orderData);
            }
          });
        } else {
          alert("Gagal mendapatkan token pembayaran");
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Error calling Midtrans API:", error);
        alert("Terjadi kesalahan koneksi ke server pembayaran.");
        setIsProcessing(false);
      }
    } else {
      processCheckout(orderData);
    }
  };
  return (
    <PopupModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Checkout"
      label={<>Konfirmasi Pesanan</>}
      width="600px"
      className="checkout-modal"
    >
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
        <div className="co-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <Input 
            ref={namaRef}
            label={<>Nama Pemesan <span className="co-required">*</span></>}
            value={nama}
            onChange={(e) => { setNama(e.target.value); setError(false); }}
            error={error ? "Nama wajib diisi!" : null}
            placeholder="Masukkan nama kamu..."
          />
          <Input 
            label={<>Nomor HP <span className="co-optional">(opsional)</span></>}
            type="tel"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <Input 
          label={<>Email Pengiriman Nota <span className="co-optional">(opsional)</span></>}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contoh@email.com"
        />
      </div>

      <div className="co-divider"></div>

      {/* Order Notes */}
      <div className="co-section">
        <div className="co-section-title"><i className="fa-solid fa-pen-to-square"></i> Catatan Pesanan</div>
        <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} className="ui-input" rows="3" placeholder="Contoh: Kopi tanpa gula, es batu sedikit, tidak pakai bawang..."></textarea>
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

        {/* Midtrans Detail */}
        {paymentMethod === 'midtrans' && (
          <div className="co-pay-detail co-pay-detail-block">
            <div className="co-pay-detail-inner">
              <i className="fa-solid fa-circle-info co-pay-icon-color-midtrans"></i>
              <div>
                <div className="co-pay-detail-title">Pembayaran via Midtrans</div>
                <div className="co-pay-detail-sub">Setelah checkout, halaman pembayaran (QRIS, E-Wallet, atau Virtual Account) akan otomatis terbuka di layar untuk segera Anda bayar.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>Total Pembayaran</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{formatRp(cartTotal)}</div>
        </div>
        <Button variant="primary" size="lg" onClick={handleSubmit} icon="fa-solid fa-check" disabled={isProcessing}>
          {isProcessing ? 'Memproses...' : 'Konfirmasi Pesanan'}
        </Button>
      </div>

    </PopupModal>
  );
}
