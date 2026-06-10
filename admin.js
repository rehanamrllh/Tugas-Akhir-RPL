// Global States
let menuItems = [];
let orders = [];
let tables = [];
let deleteTarget = { type: '', id: null };

const defaultMenuItems = [
  { id: 1, nama: 'Espresso', kategori: 'Kopi', harga: 18000, deskripsi: 'Espresso shot klasik dengan crema sempurna', badge: 'Klasik', gambar: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop', tersedia: true },
  { id: 2, nama: 'Cafe Latte', kategori: 'Kopi', harga: 25000, deskripsi: 'Espresso dengan steamed milk yang lembut dan creamy', badge: 'Populer', gambar: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', tersedia: true },
  { id: 3, nama: 'Cappuccino', kategori: 'Kopi', harga: 25000, deskripsi: 'Perpaduan espresso, steamed milk, dan foam yang sempurna', badge: "Barista's Pick", gambar: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', tersedia: true },
  { id: 4, nama: 'Kopi Susu Gula Aren', kategori: 'Kopi', harga: 22000, deskripsi: 'Es kopi susu dengan gula aren pilihan khas Nusantara', badge: 'Best Seller', gambar: 'https://images.unsplash.com/photo-1553909489-ec2175ef3f52?w=400&h=300&fit=crop', tersedia: true },
  { id: 5, nama: 'Affogato', kategori: 'Kopi', harga: 28000, deskripsi: 'Vanilla ice cream disiram espresso panas', badge: 'Wajib Coba', gambar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', tersedia: true },
  { id: 6, nama: 'Matcha Latte', kategori: 'Non-Kopi', harga: 27000, deskripsi: 'Japanese matcha premium dengan susu segar', badge: 'Favorit', gambar: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop', tersedia: true },
  { id: 7, nama: 'Coklat Hangat', kategori: 'Non-Kopi', harga: 22000, deskripsi: 'Belgian chocolate dengan whipped cream', badge: 'Hangat', gambar: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop', tersedia: true },
  { id: 8, nama: 'Thai Tea', kategori: 'Non-Kopi', harga: 20000, deskripsi: 'Thai tea klasik dengan susu kental manis', badge: 'Segar', gambar: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop', tersedia: true },
  { id: 9, nama: 'Croissant Butter', kategori: 'Pastry & Roti', harga: 25000, deskripsi: 'French butter croissant yang renyah dan berlapis', badge: 'Fresh Baked', gambar: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop', tersedia: true },
  { id: 10, nama: 'Banana Bread', kategori: 'Pastry & Roti', harga: 20000, deskripsi: 'Banana bread homemade dengan walnut', badge: 'Homemade', gambar: 'https://images.unsplash.com/photo-1605090930601-29bf4dc91e02?w=400&h=300&fit=crop', tersedia: true },
  { id: 11, nama: 'Roti Bakar Coklat Keju', kategori: 'Pastry & Roti', harga: 18000, deskripsi: 'Roti bakar dengan coklat leleh dan keju mozarella', badge: 'Favorit', gambar: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop', tersedia: true },
  { id: 12, nama: 'Pasta Aglio Olio', kategori: 'Makanan', harga: 35000, deskripsi: 'Spaghetti dengan garlic, olive oil, dan chili flakes', badge: "Chef's Pick", gambar: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop', tersedia: true },
  { id: 13, nama: 'Chicken Sandwich', kategori: 'Makanan', harga: 30000, deskripsi: 'Grilled chicken breast dengan fresh vegetables', badge: 'New', gambar: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop', tersedia: true },
  { id: 14, nama: 'Nasi Goreng Cafe', kategori: 'Makanan', harga: 28000, deskripsi: 'Nasi goreng spesial ala cafe dengan telur mata sapi', badge: 'Signature', gambar: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', tersedia: true },
  { id: 15, nama: 'Tiramisu', kategori: 'Dessert', harga: 32000, deskripsi: 'Classic Italian tiramisu dengan mascarpone cream', badge: 'Premium', gambar: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', tersedia: true },
  { id: 16, nama: 'Cheesecake Slice', kategori: 'Dessert', harga: 30000, deskripsi: 'New York cheesecake dengan strawberry compote', badge: 'Favorit', gambar: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop', tersedia: true },
];

const sectionInfo = {
  dashboard: { label: 'DASHBOARD', desc: 'Kelola operasional kedai dari satu dashboard: pesanan realtime, menu, QR meja.' },
  orders: { label: 'PESANAN MASUK', desc: 'Monitoring dan update status pesanan pelanggan.' },
  menu: { label: 'DAFTAR MENU', desc: 'Kelola makanan, minuman, harga, dan ketersediaan.' },
  tables: { label: 'TABLES & QR', desc: 'Daftar kode QR untuk discan pelanggan dari meja.' },
  reports: { label: 'LAPORAN PENJUALAN', desc: 'Rekap pendapatan dan riwayat pesanan.' }
};

const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadData();
  setupNav();
  renderAll();
});

function checkAuth() {
  if (sessionStorage.getItem('kopinusantara_auth')) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'grid';
  } else {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
  }
}

document.getElementById('loginBtn').addEventListener('click', () => {
  if (document.getElementById('loginUsername').value === 'admin' && document.getElementById('loginPassword').value === 'admin123') {
    sessionStorage.setItem('kopinusantara_auth', 'true');
    location.reload();
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('kopinusantara_auth');
  location.reload();
});

// Data Loading
function loadData() {
  const sm = localStorage.getItem('kopinusantara_menu');
  if (sm) {
    menuItems = JSON.parse(sm);
  } else {
    // Inisialisasi menu default jika belum ada
    menuItems = defaultMenuItems;
    localStorage.setItem('kopinusantara_menu', JSON.stringify(menuItems));
  }
  
  const so = localStorage.getItem('kopinusantara_orders');
  if (so) orders = JSON.parse(so);

  const st = localStorage.getItem('kopinusantara_tables');
  if (st) {
    tables = JSON.parse(st);
  } else {
    // Generate default tables 1 to 20
    for(let i=1; i<=20; i++) tables.push({ id: i.toString(), desc: `Area Utama - Kapasitas 4` });
    localStorage.setItem('kopinusantara_tables', JSON.stringify(tables));
  }
}

function formatRp(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}
function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}, ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

// Navigation
function setupNav() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const sec = e.currentTarget.dataset.section;
      
      document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
      document.getElementById('section-' + sec).style.display = 'block';
      
      const info = sectionInfo[sec];
      document.getElementById('headerLabel').textContent = info.label;
      document.getElementById('headerDesc').textContent = info.desc;
      
      renderAll();
    });
  });
}

function renderAll() {
  updateSidebarStats();
  renderDashboard();
  renderOrders();
  renderMenu();
  renderTables();
  if(document.getElementById('section-reports').style.display === 'block') renderReports();
}

function updateSidebarStats() {
  document.getElementById('stMenu').textContent = menuItems.length;
  document.getElementById('stOrder').textContent = orders.filter(o => o.status === 'Baru' || o.status === 'Diproses').length;
  document.getElementById('stMeja').textContent = tables.length;
}

// DASHBOARD & ORDERS
function renderDashboard() {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.waktu).toDateString() === today);
  const revenue = todayOrders.filter(o => o.status === 'Selesai').reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter(o => o.status === 'Baru' || o.status === 'Diproses').length;

  document.getElementById('dashRevenue').textContent = formatRp(revenue);
  document.getElementById('dashOrderCount').textContent = `${todayOrders.length} order hari ini`;
  document.getElementById('dashPendingOrders').innerHTML = `${pending} <span>ord</span>`;
  document.getElementById('dashMenuCount').innerHTML = `${menuItems.length} <span>item</span>`;
  document.getElementById('dashTableCount').innerHTML = `${tables.length} <span>meja</span>`;

  // Render Order List (Max 4 for Dashboard)
  const dbList = document.getElementById('dashboardOrderList');
  dbList.innerHTML = '';
  orders.slice().reverse().slice(0, 4).forEach(o => {
    dbList.innerHTML += createOrderCard(o);
  });

  // Render Menu Terlaris
  const bestSellerList = document.getElementById('bestSellerList');
  if (bestSellerList) {
    const completedOrders = orders.filter(o => o.status === 'Selesai');
    if (completedOrders.length === 0) {
      bestSellerList.innerHTML = '<p style="color:var(--color-text-muted); font-weight:700;">Belum ada data pesanan selesai.</p>';
    } else {
      const itemCounts = {};
      completedOrders.forEach(o => {
        o.items.forEach(i => {
          if (!itemCounts[i.nama]) {
            itemCounts[i.nama] = { nama: i.nama, qty: 0, harga: i.harga };
          }
          itemCounts[i.nama].qty += i.qty;
        });
      });
      
      const sortedItems = Object.values(itemCounts).sort((a, b) => b.qty - a.qty).slice(0, 4);
      
      bestSellerList.innerHTML = '';
      sortedItems.forEach((item, index) => {
        bestSellerList.innerHTML += `
          <div style="display:flex; justify-content:space-between; align-items:center; padding: 12px 0; border-bottom: 1px solid var(--color-border);">
            <div style="display:flex; align-items:center; gap: 12px;">
              <div style="background:var(--color-primary-light); color:white; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px;">${index + 1}</div>
              <div>
                <div style="font-weight:800; color:var(--color-dark); font-size:15px;">${item.nama}</div>
                <div style="font-size:12px; color:var(--color-text-muted); font-weight:700;">${item.qty} terjual</div>
              </div>
            </div>
            <div style="font-weight:900; color:var(--color-primary);">${formatRp(item.harga * item.qty)}</div>
          </div>
        `;
      });
      
      // Remove border from the last item
      if (bestSellerList.lastElementChild) {
        bestSellerList.lastElementChild.style.borderBottom = 'none';
      }
    }
  }

  // Render Chart (Omzet 7 Hari Terakhir)
  renderChart();
}

let omzetChartInstance = null;
function renderChart() {
  const ctx = document.getElementById('omzetChart');
  if(!ctx) return;

  const dates = [];
  const revenues = [];
  let total7 = 0;
  let totalOrders7 = 0;
  let highestDay = { date: '-', rev: 0 };

  // Generate last 7 days
  for(let i=6; i>=0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('id-ID', { weekday: 'short' });
    const fullDateStr = d.toDateString();
    
    // Calculate revenue for this day
    const dayOrders = orders.filter(o => o.status === 'Selesai' && new Date(o.waktu).toDateString() === fullDateStr);
    const dayRev = dayOrders.reduce((s, o) => s + o.total, 0);
    
    dates.push(dateStr);
    revenues.push(dayRev);
    
    total7 += dayRev;
    totalOrders7 += dayOrders.length;
    
    if(dayRev > highestDay.rev) {
      highestDay = { date: dateStr, rev: dayRev };
    }
  }

  document.getElementById('chartTotal7').textContent = formatRp(total7);
  document.getElementById('statOmzet7').textContent = formatRp(total7);
  document.getElementById('statOrder7').textContent = totalOrders7 + ' order';
  document.getElementById('statHigh7').textContent = highestDay.rev > 0 ? `${highestDay.date}, ${formatRp(highestDay.rev)}` : '-';

  if(omzetChartInstance) omzetChartInstance.destroy();

  omzetChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Omzet',
        data: revenues,
        borderColor: '#9b111e',
        backgroundColor: 'rgba(246, 241, 232, 0.5)',
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#9b111e',
        pointRadius: 4,
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, display: false },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderOrders() {
  const fullList = document.getElementById('fullOrderList');
  fullList.innerHTML = '';
  orders.slice().reverse().forEach(o => {
    fullList.innerHTML += createOrderCard(o);
  });
}

function createOrderCard(o) {
  const itemsText = o.items.map(i => `${i.qty}x ${i.nama}`).join(', ');
  let act = '';
  if(o.status === 'Baru') act = `<button class="btn-hdr white" onclick="updateOrder('${o.id}', 'Diproses')">Proses</button>`;
  else if(o.status === 'Diproses') act = `<button class="btn-hdr green" onclick="updateOrder('${o.id}', 'Siap')">Siap</button>`;
  else if(o.status === 'Siap') act = `<button class="btn-hdr dark" onclick="updateOrder('${o.id}', 'Selesai')">Selesaikan</button>`;
  
  if(o.status !== 'Selesai' && o.status !== 'Dibatalkan') {
    act += `<button class="btn-hdr white" style="color:var(--color-danger)" onclick="updateOrder('${o.id}', 'Dibatalkan')">Batal</button>`;
  }

  return `
    <div class="order-card">
      <div class="order-left">
        <div class="order-id">#${o.id}</div>
        <div class="order-title">Meja ${o.meja} - ${o.pelanggan}</div>
        <div class="order-meta">
          <span>${formatDate(o.waktu)}</span>
          <span class="order-method kasir"><i class="fa-solid fa-money-bill-wave"></i> Kasir</span>
          <span>${itemsText}</span>
        </div>
      </div>
      <div class="order-right">
        <div class="order-status ${o.status.toLowerCase()}">${o.status}</div>
        <div class="order-price">${formatRp(o.total)}</div>
        <div style="display:flex;gap:8px;">${act}</div>
      </div>
    </div>
  `;
}

window.updateOrder = function(id, status) {
  const o = orders.find(x => x.id === id);
  if(o) {
    o.status = status;
    localStorage.setItem('kopinusantara_orders', JSON.stringify(orders));
    renderAll();
  }
}

// MENU CRUD
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  if(!grid) return;
  grid.innerHTML = '';
  menuItems.forEach(m => {
    grid.innerHTML += `
      <div class="menu-card">
        <div class="menu-card-img-wrap">
          <img src="${m.gambar}" class="menu-card-img" alt="${m.nama}">
          <div class="menu-badge-tl">${m.kategori}</div>
          <div class="menu-badge-tr" style="${m.tersedia === false ? 'background:var(--color-danger-bg);color:var(--color-danger);' : ''}">${m.tersedia === false ? 'Habis' : 'Tersedia'}</div>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-title">${m.nama}</div>
          <div class="menu-card-desc">${m.deskripsi || ''}</div>
          <div class="menu-card-price-row">
            <div class="menu-card-price">${formatRp(m.harga)}</div>
            ${m.badge ? `<div class="menu-card-tag">${m.badge}</div>` : ''}
          </div>
          <div class="menu-card-actions">
            <div class="menu-row-btns">
              <button class="btn-menu dark" onclick="openMenuModal(${m.id})"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
              <button class="btn-menu light" onclick="document.getElementById('menuGambar').value=''; saveMenuSilent(${m.id})"><i class="fa-solid fa-image"></i> Hapus Foto</button>
            </div>
            <button class="btn-menu light" style="width:100%; border-color:var(--color-danger-bg); background:var(--color-danger-bg);" onclick="reqDelete('menu', ${m.id})"><i class="fa-solid fa-trash"></i> Hapus Menu</button>
          </div>
        </div>
      </div>
    `;
  });
}

window.saveMenuSilent = function(id) {
  const idx = menuItems.findIndex(m => m.id === parseInt(id));
  if(idx > -1) {
    menuItems[idx].gambar = 'https://via.placeholder.com/300';
    localStorage.setItem('kopinusantara_menu', JSON.stringify(menuItems));
    renderAll();
  }
}

window.openMenuModal = function(id = null) {
  if (id) {
    const item = menuItems.find(m => m.id === id);
    document.getElementById('menuId').value = item.id;
    document.getElementById('menuNama').value = item.nama;
    document.getElementById('menuKategori').value = item.kategori;
    document.getElementById('menuHarga').value = item.harga;
    document.getElementById('menuDeskripsi').value = item.deskripsi;
    document.getElementById('menuGambar').value = item.gambar;
    document.getElementById('previewImg').src = item.gambar || 'https://via.placeholder.com/300';
    document.getElementById('menuBadge').value = item.badge || '';
    document.getElementById('menuTersedia').checked = item.tersedia !== false;
    document.getElementById('menuModalTitle').textContent = 'Edit Detail Menu';
  } else {
    document.getElementById('menuId').value = '';
    document.getElementById('menuNama').value = '';
    document.getElementById('menuKategori').value = 'Kopi';
    document.getElementById('menuHarga').value = '';
    document.getElementById('menuDeskripsi').value = '';
    document.getElementById('menuGambar').value = '';
    document.getElementById('previewImg').src = 'https://via.placeholder.com/300';
    document.getElementById('menuBadge').value = '';
    document.getElementById('menuTersedia').checked = true;
    document.getElementById('menuModalTitle').textContent = 'Tambah Menu Baru';
  }
  document.getElementById('menuModal').style.display = 'flex';
}

window.saveMenu = function() {
  const id = document.getElementById('menuId').value;
  let gambarVal = document.getElementById('menuGambar').value;
  if (!gambarVal && id) {
    // preserve old if empty or use placeholder
    const old = menuItems.find(m => m.id === parseInt(id));
    gambarVal = old.gambar;
  }
  if (!gambarVal) gambarVal = 'https://via.placeholder.com/300';

  const obj = {
    id: id ? parseInt(id) : Date.now(),
    nama: document.getElementById('menuNama').value,
    kategori: document.getElementById('menuKategori').value,
    harga: parseInt(document.getElementById('menuHarga').value) || 0,
    deskripsi: document.getElementById('menuDeskripsi').value,
    gambar: gambarVal,
    badge: document.getElementById('menuBadge').value,
    tersedia: document.getElementById('menuTersedia').checked
  };
  
  if(!obj.nama) return alert('Nama menu harus diisi');

  if(id) {
    const idx = menuItems.findIndex(m => m.id === parseInt(id));
    menuItems[idx] = obj;
  } else {
    menuItems.unshift(obj);
  }
  localStorage.setItem('kopinusantara_menu', JSON.stringify(menuItems));
  document.getElementById('menuModal').style.display = 'none';
  renderAll();
}

// TABLES & QR
function renderTables() {
  const grid = document.getElementById('qrGrid');
  grid.innerHTML = '';
  tables.forEach(t => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(baseUrl + '?meja=' + t.id)}`;
    grid.innerHTML += `
      <div class="qr-card">
        <img src="${qrUrl}" class="qr-img" alt="QR Meja ${t.id}">
        <div class="qr-title">Meja ${t.id}</div>
        <div class="qr-desc">${t.desc || 'Area Bebas'}</div>
        <div class="qr-actions">
          <button class="btn-qr edit" onclick="openTableModal('${t.id}')">Edit</button>
          <button class="btn-qr delete" onclick="reqDelete('table', '${t.id}')">Hapus</button>
        </div>
      </div>
    `;
  });
}

window.openTableModal = function(id = null) {
  if (id) {
    const item = tables.find(t => t.id === id);
    document.getElementById('tableOldId').value = item.id;
    document.getElementById('tableId').value = item.id;
    document.getElementById('tableDesc').value = item.desc || '';
  } else {
    document.getElementById('tableOldId').value = '';
    document.getElementById('tableId').value = '';
    document.getElementById('tableDesc').value = '';
  }
  document.getElementById('tableModal').style.display = 'flex';
}

window.saveTable = function() {
  const oldId = document.getElementById('tableOldId').value;
  const newId = document.getElementById('tableId').value.trim();
  const desc = document.getElementById('tableDesc').value.trim();
  
  if(!newId) return alert('Nomor Meja harus diisi');

  if (oldId && oldId !== newId) {
    tables = tables.filter(t => t.id !== oldId);
  }
  
  if(!oldId || oldId !== newId) {
    if(tables.find(t => t.id === newId)) return alert('Meja sudah ada!');
    tables.push({ id: newId, desc });
  } else {
    tables.find(t => t.id === oldId).desc = desc;
  }

  // Sort tables numerically if possible
  tables.sort((a,b) => {
    const numA = parseInt(a.id); const numB = parseInt(b.id);
    if(!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.id.localeCompare(b.id);
  });

  localStorage.setItem('kopinusantara_tables', JSON.stringify(tables));
  document.getElementById('tableModal').style.display = 'none';
  renderAll();
}

// DELETE FLOW
window.reqDelete = function(type, id) {
  deleteTarget = { type, id };
  document.getElementById('deleteModal').style.display = 'flex';
}
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
  if(deleteTarget.type === 'menu') {
    menuItems = menuItems.filter(m => m.id !== deleteTarget.id);
    localStorage.setItem('kopinusantara_menu', JSON.stringify(menuItems));
  } else if (deleteTarget.type === 'table') {
    tables = tables.filter(t => t.id !== deleteTarget.id);
    localStorage.setItem('kopinusantara_tables', JSON.stringify(tables));
  }
  document.getElementById('deleteModal').style.display = 'none';
  renderAll();
});

// REPORTS
document.getElementById('btnFilterReport').addEventListener('click', renderReports);

function renderReports() {
  const start = document.getElementById('reportStart').value;
  const end = document.getElementById('reportEnd').value;
  
  let filtered = orders.filter(o => o.status === 'Selesai');
  
  if(start && end) {
    const sTime = new Date(start).getTime();
    const eTime = new Date(end).getTime() + 86400000;
    filtered = filtered.filter(o => {
      const t = new Date(o.waktu).getTime();
      return t >= sTime && t <= eTime;
    });
  }

  const rev = filtered.reduce((s,o)=>s+o.total, 0);
  document.getElementById('repOmzet').textContent = formatRp(rev);
  document.getElementById('repPesanan').textContent = filtered.length;

  const tb = document.querySelector('#reportTable tbody');
  tb.innerHTML = '';
  filtered.forEach(o => {
    tb.innerHTML += `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${formatDate(o.waktu)}</td>
        <td>${o.pelanggan}</td>
        <td>Meja ${o.meja}</td>
        <td><strong>${formatRp(o.total)}</strong></td>
      </tr>
    `;
  });
}
