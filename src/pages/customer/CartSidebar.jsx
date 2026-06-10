import { useCart } from '../../hooks/useCart';
import { formatRp } from '../../lib/utils';
import './CartSidebar.css';

export default function CartSidebar({ isOpen, onClose, onCheckout }) {
  const { cart, updateQty, removeItem, cartTotal, cartCount } = useCart();

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3 className="cart-header-title">
            <i className="fa-solid fa-basket-shopping"></i> Pesanan
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
          </h3>
          <button className="cart-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="cart-items" id="cartItems">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <i className="fa-solid fa-cart-arrow-down cart-empty-icon"></i>
              <p className="cart-empty-text">Keranjang masih kosong</p>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Yuk, pilih menu kopi favoritmu!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.menuId} className="cart-item">
                <img 
                  src={item.gambar || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&h=150&fit=crop'} 
                  alt={item.nama} 
                  className="cart-item-img" 
                />
                <div className="cart-item-content">
                  <div className="cart-item-info">
                    <h4>{item.nama}</h4>
                    <div className="cart-item-price">{formatRp(item.harga)}</div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.menuId, -1)}>
                        <i className="fa-solid fa-minus" style={{ fontSize: '10px' }}></i>
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.menuId, 1)}>
                        <i className="fa-solid fa-plus" style={{ fontSize: '10px' }}></i>
                      </button>
                    </div>
                    <button className="btn-remove-item" onClick={() => removeItem(item.menuId)} title="Hapus Item">
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="cart-footer">
          <div className="cart-total-row">
            <span className="cart-total-label">Total Pembayaran</span>
            <span className="cart-total-value" id="cartTotal">{formatRp(cartTotal)}</span>
          </div>
          <button
            className="cart-btn-checkout"
            id="btnCheckout"
            disabled={cart.length === 0}
            style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
            onClick={() => {
              if (cart.length > 0) {
                onCheckout();
              }
            }}
          >
            Lanjut Checkout <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </aside>
    </>
  );
}
