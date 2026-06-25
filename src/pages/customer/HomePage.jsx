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
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import './HomePage.css';
import twLogo from '../../assets/tw.jpg';

export default function HomePage() {
  const { menuItems } = useMenu();
  const { cartCount, addToCart } = useCart();
  const { categories } = useCategories();
  const { settings } = useSettings();
  const displayCategories = Array.from(new Set(['Semua', ...categories]));
  
  const [filter, setFilter] = useState('Semua');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [trackedOrderIds, setTrackedOrderIds] = useState(() => {
    try {
      const stored = localStorage.getItem('trackedOrderIds');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [addedItems, setAddedItems] = useState({});
  const [isCartBumping, setIsCartBumping] = useState(false);

  useEffect(() => {
    localStorage.setItem('trackedOrderIds', JSON.stringify(trackedOrderIds));
  }, [trackedOrderIds]);

  useEffect(() => {
    if (cartCount > 0) {
      setIsCartBumping(true);
      const timer = setTimeout(() => setIsCartBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  // Computed values
  const categoriesCount = new Set(menuItems.map(m => m.kategori)).size;
  const filteredMenu = filter === 'Semua' ? menuItems : menuItems.filter(m => m.kategori === filter);
  const recommendations = menuItems.filter(i => {
    if (!i.badge) return false;
    const b = i.badge.toLowerCase();
    return b.includes('favorit') || b.includes('favorite');
  });
  const itemsToShow = recommendations;

  const handleCheckoutSuccess = (order) => {
    setIsCheckoutOpen(false);
    setReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  const handleReceiptClose = () => {
    setIsReceiptOpen(false);
    if (receiptOrder && !trackedOrderIds.includes(receiptOrder.id)) {
      setTrackedOrderIds(prev => [...prev, receiptOrder.id]);
    }
  };

  const removeTracker = (id) => {
    setTrackedOrderIds(prev => prev.filter(orderId => orderId !== id));
  };

  const getValidImageUrl = (url) => {
    if (url && url.includes('1596647209376-717013824ee1')) {
      return 'https://images.unsplash.com/photo-1601314002592-b8734bca6604?w=400&h=300&fit=crop';
    }
    return url || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&h=150&fit=crop';
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="store-icon" style={{ overflow: 'hidden', padding: 0 }}>
            <img src={twLogo} alt="Logo Twice Cafe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 className="topbar-name">{settings.namaToko || 'Twice Cafe'}</h2>
            <p className="topbar-sub">Meja {new URLSearchParams(window.location.search).get('meja') || 1}</p>
          </div>
        </div>
        <Button variant="primary" className="cart-btn" onClick={() => setIsCartOpen(true)} style={{ borderRadius: '100px', fontWeight: '900', padding: '12px 24px', background: 'linear-gradient(135deg, var(--color-primary), #d81b2a)', border: 'none', color: 'white', boxShadow: '0 8px 24px rgba(155, 17, 30, 0.25)' }}>
          <i className="fa-solid fa-basket-shopping"></i> Keranjang <span style={{ display: 'inline-block', background: 'transparent', color: 'inherit', padding: 0, boxShadow: 'none', minWidth: 'auto', marginLeft: '6px', fontSize: 'inherit' }} className={`cart-count ${isCartBumping ? 'bump' : ''}`}>{cartCount}</span>
        </Button>
      </header>

      <section className="homepage-hero">
        <div className="homepage-hero-content">
          <span className="homepage-label-small">QR MENU DIGITAL</span>
          
          <h1 className="homepage-hero-title">Nikmati Kopimu, Temukan Inspirasimu</h1>
          <p className="homepage-hero-desc">{settings.deskripsiToko}</p>
          
          <div className="homepage-category-chips">
            <div className="homepage-chip"><i className="fa-solid fa-mug-hot"></i> Kopi & Espresso</div>
            <div className="homepage-chip"><i className="fa-solid fa-bread-slice"></i> Pastry & Roti</div>
            <div className="homepage-chip"><i className="fa-solid fa-cake-candles"></i> Dessert</div>
          </div>
          
          <div className="homepage-hero-actions">
            <Button variant="primary" className="homepage-btn-primary" onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })} icon="fa-solid fa-book-open">
              Lihat Menu
            </Button>
            <Button variant="outline" className="homepage-btn-outline" onClick={() => setIsCartOpen(true)} icon="fa-solid fa-basket-shopping">
              Keranjang
            </Button>
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
            <Badge 
              as="button"
              key={cat} 
              variant="neutral" 
              active={filter === cat} 
              className="filter-pill" 
              onClick={() => setFilter(cat)}
            >
              {cat === 'Semua' && <i className="fa-solid fa-utensils" style={{ marginRight: '6px' }}></i>}
              {cat === 'Kopi' && <i className="fa-solid fa-mug-hot" style={{ marginRight: '6px' }}></i>}
              {cat === 'Non-Kopi' && <i className="fa-solid fa-glass-water" style={{ marginRight: '6px' }}></i>}
              {cat === 'Pastry & Roti' && <i className="fa-solid fa-bread-slice" style={{ marginRight: '6px' }}></i>}
              {cat === 'Makanan' && <i className="fa-solid fa-bowl-rice" style={{ marginRight: '6px' }}></i>}
              {cat === 'Dessert' && <i className="fa-solid fa-cake-candles" style={{ marginRight: '6px' }}></i>}
              {cat}
            </Badge>
          ))}
        </div>
      </section>

      {filter === 'Semua' && itemsToShow.length > 0 && (
        <section className="homepage-recommendations">
          <div className="homepage-rec-header">
            <div>
              <span className="section-label">PILIHAN TERBAIK</span>
              <h3>Menu Favorit Hari Ini</h3>
            </div>
            <i className="fa-solid fa-fire homepage-rec-star"></i>
          </div>
          <div className="homepage-rec-container" id="recContainer">
            {itemsToShow.map(item => (
              item.tersedia !== false && (
                <div key={item.id} className="homepage-rec-card">
                  <img src={getValidImageUrl(item.gambar)} alt={item.nama} className="homepage-rec-img" />
                  <div className="homepage-rec-info">
                    <div className="homepage-rec-title">{item.nama}</div>
                    <div className="homepage-rec-price">{formatRp(item.harga)}</div>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className={`homepage-rec-btn-add ${addedItems[item.id] ? 'btn-added-feedback' : ''}`} 
                      onClick={() => handleAdd(item)} 
                      icon={addedItems[item.id] ? "fa-solid fa-check" : "fa-solid fa-plus"}
                    >
                      {addedItems[item.id] ? "Ditambahkan" : "Tambah"}
                    </Button>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>
      )}

      <div className="menu-container">
        <div className="menu-grid" id="menuGrid">
          {filteredMenu.map(item => (
            <div key={item.id} className="menu-card visible">
              <div className="card-img-wrapper">
                {item.tersedia === false ? <Badge variant="solid-danger" className="card-badge homepage-sold-out-badge">Habis</Badge> : item.badge ? <Badge variant="solid-warning" className="card-badge">{item.badge}</Badge> : null}
                <img src={getValidImageUrl(item.gambar)} alt={item.nama} className={`card-img ${item.tersedia === false ? 'homepage-sold-out-img' : ''}`} />
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
                    <Button variant="ghost" className="btn-add homepage-btn-disabled" disabled>Habis</Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      className={`btn-add ${addedItems[item.id] ? 'btn-added-feedback' : ''}`} 
                      onClick={() => handleAdd(item)} 
                      icon={addedItems[item.id] ? "fa-solid fa-check" : "fa-solid fa-plus"}
                    >
                      {addedItems[item.id] ? "Ditambahkan" : "Tambah"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="homepage-footer">
        <div className="homepage-footer-content">
          <div className="homepage-footer-brand">
            <div className="store-icon" style={{ overflow: 'hidden', padding: 0, width: '56px', height: '56px', borderRadius: '16px' }}>
              <img src={twLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3>{settings.namaToko || 'Twice Cafe'}</h3>
            <p>{settings.deskripsiToko || 'Nikmati sajian kopi terbaik dari kami.'}</p>
          </div>
          <div className="homepage-footer-links">
            <div className="footer-section">
              <h4>Kontak</h4>
              <p><i className="fa-brands fa-whatsapp"></i> {settings.whatsapp || '+62 812-3456-7890'}</p>
              <p><i className="fa-brands fa-instagram"></i> {settings.instagram || '@twice.cafe'}</p>
            </div>
            <div className="footer-section">
              <h4>Lokasi</h4>
              <p><i className="fa-solid fa-location-dot"></i> {settings.alamat || 'Jl. Contoh Alamat No. 123'}</p>
              <p><i className="fa-solid fa-clock"></i> {settings.jamBuka || '08:00 - 22:00'}</p>
            </div>
          </div>
        </div>
        <div className="homepage-footer-bottom">
          <p>&copy; {new Date().getFullYear()} {settings.namaToko || 'Twice Cafe'}. All rights reserved.</p>
        </div>
      </footer>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onSuccess={handleCheckoutSuccess} />
      <DigitalReceiptModal isOpen={isReceiptOpen} order={receiptOrder} onClose={handleReceiptClose} />
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 999 }}>
        {[...trackedOrderIds].reverse().map(id => (
          <OrderTracker key={id} orderId={id} onClose={() => removeTracker(id)} />
        ))}
      </div>
    </>
  );
}
