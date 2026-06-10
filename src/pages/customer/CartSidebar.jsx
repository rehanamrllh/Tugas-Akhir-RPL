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
          <h3>Keranjang ({cartCount})</h3>
          <button className="cart-close" onClick={onClose}>&times;</button>
        </div>
        <div className="cart-items" id="cartItems">
          {cart.length === 0 ? (
            <p className="cart-empty-text">Keranjang kosong.</p>
          ) : (
            cart.map(item => (
              <div key={item.menuId} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.nama}</h4>
                  <div className="cart-item-price">{formatRp(item.harga)}</div>
                </div>
                <div className="cart-controls">
                  <button className="qty-btn" onClick={() => updateQty(item.menuId, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.menuId, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Subtotal</span>
            <strong id="cartTotal">{formatRp(cartTotal)}</strong>
          </div>
          <button
            className="btn-primary cart-btn-checkout"
            id="btnCheckout"
            onClick={() => {
              if (cart.length > 0) {
                onCheckout();
              }
            }}
          >
            Checkout Pesanan
          </button>
        </div>
      </aside>
    </>
  );
}
