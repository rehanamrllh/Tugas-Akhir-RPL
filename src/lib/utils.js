export function formatRp(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}

export function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}, ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export const defaultMenuItems = [
  { id: 1, nama: 'Espresso', kategori: 'Kopi', harga: 18000, deskripsi: 'Espresso shot klasik dengan crema sempurna', badge: 'Klasik', gambar: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop', tersedia: true },
  { id: 2, nama: 'Cafe Latte', kategori: 'Kopi', harga: 25000, deskripsi: 'Espresso dengan steamed milk yang lembut dan creamy', badge: 'Populer', gambar: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', tersedia: true },
  { id: 3, nama: 'Cappuccino', kategori: 'Kopi', harga: 25000, deskripsi: 'Perpaduan espresso, steamed milk, dan foam yang sempurna', badge: "Barista's Pick", gambar: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', tersedia: true },
  { id: 4, nama: 'Kopi Susu Gula Aren', kategori: 'Kopi', harga: 22000, deskripsi: 'Es kopi susu dengan gula aren pilihan khas Nusantara', badge: 'Best Seller', gambar: 'https://images.unsplash.com/photo-1553909489-ec2175ef3f52?w=400&h=300&fit=crop', tersedia: true },
  { id: 5, nama: 'Affogato', kategori: 'Kopi', harga: 28000, deskripsi: 'Vanilla ice cream disiram espresso panas', badge: 'Wajib Coba', gambar: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=400&h=300&fit=crop', tersedia: true },
  { id: 6, nama: 'Matcha Latte', kategori: 'Kopi', harga: 27000, deskripsi: 'Japanese matcha premium dengan susu segar', badge: 'Favorit', gambar: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop', tersedia: true },
  { id: 7, nama: 'Coklat Hangat', kategori: 'Non-Kopi', harga: 22000, deskripsi: 'Belgian chocolate dengan whipped cream', badge: 'Hangat', gambar: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop', tersedia: true },
  { id: 8, nama: 'Thai Tea', kategori: 'Non-Kopi', harga: 27000, deskripsi: 'Thai tea klasik dengan susu kental manis', badge: 'Segar', gambar: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop', tersedia: true },
  { id: 9, nama: 'Croissant Butter', kategori: 'Pastry & Roti', harga: 25000, deskripsi: 'French butter croissant yang renyah dan berlapis', badge: 'Fresh Baked', gambar: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=400&h=300&fit=crop', tersedia: true },
  { id: 10, nama: 'Banana Bread', kategori: 'Pastry & Roti', harga: 20000, deskripsi: 'Banana bread homemade dengan walnut', badge: 'Homemade', gambar: 'https://images.unsplash.com/photo-1600858140409-775b8e91ff90?w=400&h=300&fit=crop', tersedia: true },
  { id: 11, nama: 'Roti Bakar Coklat Keju', kategori: 'Pastry & Roti', harga: 18000, deskripsi: 'Roti bakar dengan coklat leleh dan keju mozarella', badge: 'Favorit', gambar: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop', tersedia: true },
  { id: 12, nama: 'Pasta Aglio Olio', kategori: 'Makanan', harga: 35000, deskripsi: 'Spaghetti dengan garlic, olive oil, dan chili flakes', badge: "Chef's Pick", gambar: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop', tersedia: true },
  { id: 13, nama: 'Chicken Sandwich', kategori: 'Makanan', harga: 30000, deskripsi: 'Grilled chicken breast dengan fresh vegetables', badge: 'New', gambar: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop', tersedia: true },
  { id: 14, nama: 'Nasi Goreng Cafe', kategori: 'Makanan', harga: 28000, deskripsi: 'Nasi goreng spesial ala cafe dengan telur mata sapi', badge: 'Signature', gambar: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', tersedia: true },
  { id: 15, nama: 'Tiramisu', kategori: 'Dessert', harga: 32000, deskripsi: 'Classic Italian tiramisu dengan mascarpone cream', badge: 'Premium', gambar: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', tersedia: true },
  { id: 16, nama: 'Cheesecake Slice', kategori: 'Dessert', harga: 30000, deskripsi: 'New York cheesecake dengan strawberry compote', badge: 'Favorit', gambar: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop', tersedia: true },
];

export const defaultTables = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  desc: 'Area Utama - Kapasitas 4'
}));

export const CATEGORIES = ['Semua', 'Kopi', 'Non-Kopi', 'Pastry & Roti', 'Makanan', 'Dessert'];

export const ADMIN_CATEGORIES = ['Kopi', 'Non-Kopi', 'Pastry & Roti', 'Makanan', 'Dessert'];
  