const defaultMenuItems = [
  { id: 1, nama: 'Espresso', kategori: 'Kopi', harga: 18000, deskripsi: 'Espresso shot klasik dengan crema sempurna', badge: 'Klasik', gambar: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop' },
  { id: 2, nama: 'Cafe Latte', kategori: 'Kopi', harga: 25000, deskripsi: 'Espresso dengan steamed milk yang lembut dan creamy', badge: 'Populer', gambar: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
  { id: 3, nama: 'Cappuccino', kategori: 'Kopi', harga: 25000, deskripsi: 'Perpaduan espresso, steamed milk, dan foam yang sempurna', badge: "Barista's Pick", gambar: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
  { id: 4, nama: 'Kopi Susu Gula Aren', kategori: 'Kopi', harga: 22000, deskripsi: 'Es kopi susu dengan gula aren pilihan khas Nusantara', badge: 'Best Seller', gambar: 'https://images.unsplash.com/photo-1553909489-ec2175ef3f52?w=400&h=300&fit=crop' },
  { id: 5, nama: 'Affogato', kategori: 'Kopi', harga: 28000, deskripsi: 'Vanilla ice cream disiram espresso panas', badge: 'Wajib Coba', gambar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  { id: 6, nama: 'Matcha Latte', kategori: 'Non-Kopi', harga: 27000, deskripsi: 'Japanese matcha premium dengan susu segar', badge: 'Favorit', gambar: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop' },
  { id: 7, nama: 'Coklat Hangat', kategori: 'Non-Kopi', harga: 22000, deskripsi: 'Belgian chocolate dengan whipped cream', badge: 'Hangat', gambar: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop' },
  { id: 8, nama: 'Thai Tea', kategori: 'Non-Kopi', harga: 20000, deskripsi: 'Thai tea klasik dengan susu kental manis', badge: 'Segar', gambar: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop' },
  { id: 9, nama: 'Croissant Butter', kategori: 'Pastry & Roti', harga: 25000, deskripsi: 'French butter croissant yang renyah dan berlapis', badge: 'Fresh Baked', gambar: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop' },
  { id: 10, nama: 'Banana Bread', kategori: 'Pastry & Roti', harga: 20000, deskripsi: 'Banana bread homemade dengan walnut', badge: 'Homemade', gambar: 'https://images.unsplash.com/photo-1605090930601-29bf4dc91e02?w=400&h=300&fit=crop' },
  { id: 11, nama: 'Roti Bakar Coklat Keju', kategori: 'Pastry & Roti', harga: 18000, deskripsi: 'Roti bakar dengan coklat leleh dan keju mozarella', badge: 'Favorit', gambar: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop' },
  { id: 12, nama: 'Pasta Aglio Olio', kategori: 'Makanan', harga: 35000, deskripsi: 'Spaghetti dengan garlic, olive oil, dan chili flakes', badge: "Chef's Pick", gambar: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop' },
  { id: 13, nama: 'Chicken Sandwich', kategori: 'Makanan', harga: 30000, deskripsi: 'Grilled chicken breast dengan fresh vegetables', badge: 'New', gambar: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
  { id: 14, nama: 'Nasi Goreng Cafe', kategori: 'Makanan', harga: 28000, deskripsi: 'Nasi goreng spesial ala cafe dengan telur mata sapi', badge: 'Signature', gambar: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop' },
  { id: 15, nama: 'Tiramisu', kategori: 'Dessert', harga: 32000, deskripsi: 'Classic Italian tiramisu dengan mascarpone cream', badge: 'Premium', gambar: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop' },
  { id: 16, nama: 'Cheesecake Slice', kategori: 'Dessert', harga: 30000, deskripsi: 'New York cheesecake dengan strawberry compote', badge: 'Favorit', gambar: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop' },
];

let menuItems = [];
let cart = [];

function initApp() {
  const storedMenu = localStorage.getItem('kopinusantara_menu');
  if (storedMenu) {
    menuItems = JSON.parse(storedMenu);
  } else {
    menuItems = defaultMenuItems;
    localStorage.setItem('kopinusantara_menu', JSON.stringify(menuItems));
  }

  const storedCart = localStorage.getItem('kopinusantara_cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }

  updateHeroStats();
  renderMenuCards('Semua');
  renderRecommendations();
  setupFilterPills();
  renderCart();
  setupScrollAnimations();
  setupSmoothScroll();
  setupCartToggle();
}

function updateHeroStats() {
  const heroStats = document.getElementById('heroStats');
  if (!heroStats) return;
  const categories = new Set(menuItems.map(item => item.kategori)).size;
  heroStats.innerHTML = `
    <div class="stat-item">
      <div class="stat-value">${menuItems.length}</div>
      <div class="stat-label">Menu</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${categories}</div>
      <div class="stat-label">Kategori</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">20</div>
      <div class="stat-label">Meja</div>
    </div>
  `;
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function renderMenuCards(filter) {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  
  const filtered = filter === 'Semua' ? menuItems : menuItems.filter(item => item.kategori === filter);
  
  filtered.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.style.transitionDelay = `${index * 50}ms`;
    card.innerHTML = `
      <div class="card-img-wrapper">
        ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
        <img src="${item.gambar}" alt="${item.nama}" class="card-img">
      </div>
      <div class="card-content">
        <h3 class="card-title">${item.nama}</h3>
        <p class="card-desc">${item.deskripsi}</p>
        <div class="card-footer">
          <div>
            <div class="price-label">HARGA</div>
            <div class="price">${formatRupiah(item.harga)}</div>
          </div>
          <button class="btn-add" onclick="addToCart(${item.id})"><i class="fa-solid fa-plus"></i> Tambah</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  
  setTimeout(() => {
    document.querySelectorAll('.menu-card').forEach(el => el.classList.add('visible'));
  }, 50);
}

function renderRecommendations() {
  const container = document.getElementById('recContainer');
  if(!container) return;
  container.innerHTML = '';
  
  const recItems = menuItems.filter(i => {
    if (!i.badge) return false;
    const b = i.badge.toLowerCase();
    return b.includes('best seller') || b.includes('terlaris') || b.includes('pick') || b.includes('favorit') || b.includes('rekomendasi');
  }).slice(0, 3);
  const itemsToShow = recItems.length > 0 ? recItems : menuItems.slice(0,3);

  itemsToShow.forEach(item => {
    container.innerHTML += `
      <div class="rec-card">
        <img src="${item.gambar}" alt="${item.nama}" class="rec-img">
        <div class="rec-info">
          <div class="rec-title">${item.nama}</div>
          <div class="rec-price">${formatRupiah(item.harga)}</div>
        </div>
        <button class="btn-add" onclick="addToCart(${item.id})"><i class="fa-solid fa-plus"></i></button>
      </div>
    `;
  });
}

function setupFilterPills() {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      renderMenuCards(e.target.dataset.category);
    });
  });
}

function addToCart(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return;
  
  const existingItem = cart.find(i => i.menuId === itemId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ menuId: item.id, nama: item.nama, harga: item.harga, qty: 1 });
  }
  
  saveCart();
  renderCart();
  
  // Show visual feedback (optional toast or cart shake)
  const cartBtn = document.getElementById('cartBtn');
  cartBtn.style.transform = 'scale(1.1)';
  setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

function updateCartQty(menuId, delta) {
  const item = cart.find(i => i.menuId === menuId);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.menuId !== menuId);
    }
    saveCart();
    renderCart();
  }
}

function saveCart() {
  localStorage.setItem('kopinusantara_cart', JSON.stringify(cart));
}

function renderCart() {
  const itemsContainer = document.getElementById('cartItems');
  const countBadge = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  
  itemsContainer.innerHTML = '';
  
  let totalQty = 0;
  let totalPrice = 0;
  
  cart.forEach(item => {
    totalQty += item.qty;
    totalPrice += (item.harga * item.qty);
    
    itemsContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.nama}</h4>
          <div class="cart-item-price">${formatRupiah(item.harga)}</div>
        </div>
        <div class="cart-controls">
          <button class="qty-btn" onclick="updateCartQty(${item.menuId}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${item.menuId}, 1)">+</button>
        </div>
      </div>
    `;
  });
  
  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p style="text-align:center; color:var(--color-text-muted); margin-top:40px;">Keranjang kosong.</p>';
  }
  
  countBadge.textContent = totalQty;
  totalEl.textContent = formatRupiah(totalPrice);
}

function setupCartToggle() {
  const btn = document.getElementById('cartBtn');
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  const close = document.getElementById('closeCart');
  
  const toggle = () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  };
  
  btn.addEventListener('click', toggle);
  close.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Actually handled by renderMenuCards timeout for now, but keeping structure for future use
}

function setupSmoothScroll() {
  document.getElementById('btnLihatMenu').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('btnCheckoutHero').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cartBtn').click();
  });
  document.getElementById('btnCheckout').addEventListener('click', function() {
    if(cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }
    // Create new order
    const orders = JSON.parse(localStorage.getItem('kopinusantara_orders') || '[]');
    const newOrder = {
        id: 'ORD-' + Math.floor(Math.random()*10000),
        pelanggan: 'Tamu Meja 1',
        meja: 1,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.harga * item.qty), 0),
        status: 'Baru',
        waktu: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('kopinusantara_orders', JSON.stringify(orders));
    
    alert("Pesanan berhasil dibuat! Menunggu konfirmasi.");
    cart = [];
    saveCart();
    renderCart();
    document.getElementById('closeCart').click();
  });
}

document.addEventListener('DOMContentLoaded', initApp);
