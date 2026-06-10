import { useState, useEffect } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { useCart } from '../../hooks/useCart';
import { useCategories } from '../../hooks/useCategories';
import { useSettings } from '../../hooks/useSettings';
import { formatRp } from '../../lib/utils';
import CartSidebar from './CartSidebar';
import CheckoutModal from './CheckoutModal';
import OrderTracker from './OrderTracker';
import DigitalReceiptModal from './DigitalReceiptModal';
import './HomePage.css';

export default function HomePage() {
  const { menuItems } = useMenu();
  const { cartCount, addToCart } = useCart();
  const { categories } = useCategories();
  const { settings } = useSettings();
  const displayCategories = ['Semua', ...categories];
  
  const [filter, setFilter] = useState('Semua');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [trackedOrderId, setTrackedOrderId] = useState(() => sessionStorage.getItem('trackedOrderId') || null);

  useEffect(() => {
    if (trackedOrderId) {
      sessionStorage.setItem('trackedOrderId', trackedOrderId);
    } else {
      sessionStorage.removeItem('trackedOrderId');
    }
  }, [trackedOrderId]);

  // Computed values
  const categoriesCount = new Set(menuItems.map(m => m.kategori)).size;
  const filteredMenu = filter === 'Semua' ? menuItems : menuItems.filter(m => m.kategori === filter);
  const recommendations = menuItems.filter(i => {
    if (!i.badge) return false;
    const b = i.badge.toLowerCase();
    return b.includes('best seller') || b.includes('terlaris') || b.includes('pick') || b.includes('favorit') || b.includes('rekomendasi');
  }).slice(0, 3);
  const itemsToShow = recommendations.length > 0 ? recommendations : menuItems.slice(0, 3);

  const handleCheckoutSuccess = (order) => {
    setIsCheckoutOpen(false);
    setReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  const handleReceiptClose = () => {
    setIsReceiptOpen(false);
    setTrackedOrderId(receiptOrder.id);
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="store-icon" style={{ overflow: 'hidden', padding: settings.logoUrl ? 0 : undefined }}>
            {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className="fa-solid fa-mug-hot"></i>}
          </div>
          <div>
            <h2 className="topbar-name">{settings.namaToko || 'Twice Cafe'}</h2>
            <p className="topbar-sub">QR Menu • Meja {new URLSearchParams(window.location.search).get('meja') || 1}</p>
          </div>
        </div>
        <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
          <i className="fa-solid fa-basket-shopping"></i> Keranjang <span className="cart-count">{cartCount}</span>
        </button>
      </header>

      <section className="homepage-hero">
        <div className="homepage-hero-content">
          <span className="homepage-label-small">QR MENU DIGITAL</span>
          
          <h1 className="homepage-hero-title">Nikmati Kopimu, Temukan Inspirasimu</h1>
          <p className="homepage-hero-desc">{settings.deskripsiToko}</p>
          
          <div className="homepage-category-chips">
            <div className="homepage-chip"><i className="fa-solid fa-mug-hot"></i> Kopi & Espresso</div>
            <div className="homepage-chip"><i className="fa-solid fa-croissant"></i> Pastry & Roti</div>
            <div className="homepage-chip"><i className="fa-solid fa-cake-candles"></i> Dessert</div>
          </div>
          
          <div className="homepage-hero-actions">
            <button className="btn-primary homepage-btn-primary" onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}>
              <i className="fa-solid fa-book-open"></i> Lihat Menu
            </button>
            <button className="btn-outline homepage-btn-outline" onClick={() => setIsCartOpen(true)}>
              <i className="fa-solid fa-basket-shopping"></i> Keranjang
            </button>
          </div>
        </div>
        
        <div className="homepage-hero-info">
          <div>
            <span className="homepage-info-label">RINGKASAN CAFE</span>
            <div className="homepage-info-stats-grid">
              <div className="homepage-info-stat-card">
                <div className="homepage-info-stat-value">{menuItems.length}</div>
                <div className="homepage-info-stat-label">Menu</div>
              </div>
              <div className="homepage-info-stat-card">
                <div className="homepage-info-stat-value">{categoriesCount}</div>
                <div className="homepage-info-stat-label">Kategori</div>
              </div>
              <div className="homepage-info-stat-card">
                <div className="homepage-info-stat-value">20</div>
                <div className="homepage-info-stat-label">Meja</div>
              </div>
            </div>
          </div>
          
          <div className="homepage-info-address-card">
            <span className="homepage-info-card-label">ALAMAT</span>
            <div className="homepage-info-card-content">
              <div className="homepage-info-icon-wrapper"><i className="fa-solid fa-location-dot"></i></div>
              <div className="homepage-info-text">{settings.alamat}</div>
            </div>
          </div>
          
          <div className="homepage-info-address-card flex-col">
            <span className="homepage-info-card-label">JAM BUKA</span>
            <div className="homepage-info-card-content">
              <div className="homepage-info-icon-wrapper"><i className="fa-solid fa-clock"></i></div>
              <div className="homepage-info-text">{settings.jamBuka}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-menu-filter" id="menu">
        <div>
          <span className="section-label">DAFTAR MENU</span>
          <h2 className="homepage-filter-title">Pilih makanan favoritmu</h2>
        </div>
        <div className="homepage-filter-pills filter-pills">
          {displayCategories.map(cat => (
            <button key={cat} className={`filter-pill ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
              {cat === 'Semua' && <i className="fa-solid fa-utensils"></i>}
              {cat === 'Kopi' && <i className="fa-solid fa-mug-hot"></i>}
              {cat === 'Non-Kopi' && <i className="fa-solid fa-glass-water"></i>}
              {cat === 'Pastry & Roti' && <i className="fa-solid fa-croissant"></i>}
              {cat === 'Makanan' && <i className="fa-solid fa-bowl-rice"></i>}
              {cat === 'Dessert' && <i className="fa-solid fa-cake-candles"></i>}
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* {filter === 'Semua' && itemsToShow.length > 0 && (
        <section className="homepage-recommendations">
          <div className="homepage-rec-header">
            <div>
              <span className="section-label">REKOMENDASI</span>
              <h3>Menu favorit hari ini</h3>
            </div>
            <i className="fa-solid fa-star homepage-rec-star"></i>
          </div>
          <div className="homepage-rec-container" id="recContainer">
            {itemsToShow.map(item => (
              item.tersedia !== false && (
                <div key={item.id} className="homepage-rec-card">
                  <img src={item.gambar} alt={item.nama} className="homepage-rec-img" />
                  <div className="homepage-rec-info">
                    <div className="homepage-rec-title">{item.nama}</div>
                    <div className="homepage-rec-price">{formatRp(item.harga)}</div>
                    <button className="homepage-rec-btn-add" onClick={() => addToCart(item)}>+ Tambah</button>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>
      )} */}

      <div className="menu-container">
        <div className="menu-grid" id="menuGrid">
          {filteredMenu.map(item => (
            <div key={item.id} className="menu-card visible">
              <div className="card-img-wrapper">
                {item.tersedia === false ? <span className="card-badge homepage-sold-out-badge">Habis</span> : item.badge ? <span className="card-badge">{item.badge}</span> : null}
                <img src={item.gambar} alt={item.nama} className={`card-img ${item.tersedia === false ? 'homepage-sold-out-img' : ''}`} />
              </div>
              <div className="card-content">
                <h3 className={`card-title ${item.tersedia === false ? 'homepage-sold-out-text' : ''}`}>{item.nama}</h3>
                <p className="card-desc">{item.deskripsi}</p>
                <div className="card-footer">
                  <div>
                    <div className="price-label">HARGA</div>
                    <div className={`price ${item.tersedia === false ? 'homepage-sold-out-text' : ''}`}>{formatRp(item.harga)}</div>
                  </div>
                  {item.tersedia === false ? (
                    <button className="btn-add homepage-btn-disabled" disabled>Habis</button>
                  ) : (
                    <button className="btn-add" onClick={() => addToCart(item)}><i className="fa-solid fa-plus"></i> Tambah</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onSuccess={handleCheckoutSuccess} />
      <DigitalReceiptModal isOpen={isReceiptOpen} order={receiptOrder} onClose={handleReceiptClose} />
      <OrderTracker orderId={trackedOrderId} onClose={() => setTrackedOrderId(null)} />
    </>
  );
}
