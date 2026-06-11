import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import { useCategories } from '../../hooks/useCategories';
import { formatRp } from '../../lib/utils';
import './MenuPage.css';

export default function MenuPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const { categories, addCategory, deleteCategory } = useCategories();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState('');
  const [newCat, setNewCat] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      openModal();
      navigate('/admin/dashboard/menu', { replace: true });
    }
  }, [location.search, navigate]);

  const [formData, setFormData] = useState({
    nama: '', kategori: categories[0] || 'Kopi', harga: '', deskripsi: '', badge: '', gambar: '', tersedia: true, stock: ''
  });

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ stock: '', ...item });
    } else {
      setEditingItem(null);
      setFormData({ nama: '', kategori: categories[0] || 'Kopi', harga: '', deskripsi: '', badge: '', gambar: '', tersedia: true, stock: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData, harga: parseInt(formData.harga) || 0, stock: parseInt(formData.stock) || 0 };
    if (dataToSave.stock <= 0) {
      dataToSave.tersedia = false;
    }
    if (editingItem) updateMenuItem(editingItem.id, dataToSave);
    else addMenuItem(dataToSave);
    setIsModalOpen(false);
  };

  const filteredMenu = menuItems.filter(m => m.nama.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="content-section">

      <div className="menupage-header">
        <div>
          <div className="menupage-header-label">MENU CRUD</div>
          <h2 className="menupage-header-title">Daftar Menu</h2>
          <p className="menupage-header-desc">Form tambah dan edit sekarang dipisah ke modal khusus, jadi list menu tetap rapi.</p>
        </div>
        <div className="menupage-header-actions">
          <input 
            type="text" 
            placeholder="Cari menu..." 
            className="form-control menupage-search-input" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-outline menupage-btn-kelola" onClick={() => setIsCategoryModalOpen(true)}>
            <i className="fa-solid fa-tags"></i> Kelola Kategori
          </button>
          <button className="btn-primary menupage-btn-tambah" onClick={() => openModal()}>
            <i className="fa-solid fa-plus"></i> Tambah Menu
          </button>
        </div>
      </div>

      <div className="menu-grid">
        {filteredMenu.map(item => (
          <div key={item.id} className={`menu-card menupage-card ${!item.tersedia ? 'unavailable' : ''}`}>
            <div className="menupage-card-img-wrapper">
              <span className="menupage-badge-category">{item.kategori}</span>
              <span className={`menupage-badge-status ${!item.tersedia ? 'unavailable' : ''}`}>{item.tersedia ? 'Tersedia' : 'Habis'}</span>
              <img src={item.gambar || 'https://via.placeholder.com/400x300?text=No+Image'} alt={item.nama} className={`card-img menupage-card-img ${!item.tersedia ? 'unavailable' : ''}`} />
            </div>
            <div className="menupage-card-content">
              <h3 className="menupage-card-title">{item.nama}</h3>
              <p className="menupage-card-desc">{item.deskripsi}</p>
              
              <div className="menupage-price-row">
                <div className="menupage-price">{formatRp(item.harga)}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {item.stock !== undefined && item.stock !== '' && <span className="menupage-item-stock" style={{fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)'}}>Sisa: {item.stock}</span>}
                  {item.badge && <span className="menupage-item-badge">{item.badge}</span>}
                </div>
              </div>
              
              <div className="menupage-action-grid">
                <button className="btn-primary menupage-btn-edit" onClick={() => openModal(item)}><i className="fa-solid fa-pen-to-square"></i> Edit</button>
                <button className="btn-outline menupage-btn-delete-photo" onClick={() => { setFormData({...item, gambar: ''}); updateMenuItem(item.id, {...item, gambar: ''}); }}><i className="fa-solid fa-trash"></i> Hapus Foto</button>
              </div>
              <button className="btn-outline menupage-btn-delete-menu" onClick={() => {
                if (window.confirm('Hapus menu ini?')) deleteMenuItem(item.id);
              }}><i className="fa-solid fa-trash"></i> Hapus Menu</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay show menupage-modal-overlay">
          <div className="menupage-cat-modal menupage-modal">
            <div className="menupage-cat-header">
              <div>
                <div className="menupage-cat-label"><i className="fa-solid fa-burger" style={{ marginRight: '6px' }}></i> Menu Form</div>
                <h2 className="menupage-cat-title">{editingItem ? 'Edit Menu' : 'Tambah Menu'}</h2>
              </div>
              <button className="menupage-cat-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body menupage-modal-body">
                <div className="split-left">
                  <div className="menupage-preview-wrapper">
                    <img src={formData.gambar || 'https://via.placeholder.com/400x300?text=Preview'} alt="Preview" className="menupage-preview-img" />
                  </div>
                  <div className="form-group">
                    <label>URL Gambar</label>
                    <input type="text" className="form-control" value={formData.gambar} onChange={e => setFormData({...formData, gambar: e.target.value})} placeholder="https://..." />
                  </div>
                  <div className="form-group menupage-checkbox-group">
                    <input type="checkbox" id="tersedia" checked={formData.tersedia} onChange={e => setFormData({...formData, tersedia: e.target.checked})} className="menupage-checkbox" />
                    <label htmlFor="tersedia" className="menupage-checkbox-label">Menu Tersedia</label>
                  </div>
                </div>
                <div className="split-right">
                  <div className="form-group">
                    <label>Nama Menu *</label>
                    <input type="text" className="form-control" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Kategori *</label>
                    <select className="form-control" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group menupage-price-stock-grid">
                    <div>
                      <label>Harga (Rp) *</label>
                      <input type="number" className="form-control" value={formData.harga} onChange={e => setFormData({...formData, harga: e.target.value})} required />
                    </div>
                    <div>
                      <label>Stok (opsional)</label>
                      <input type="number" className="form-control" value={formData.stock} onChange={e => {
                        const val = e.target.value;
                        setFormData({...formData, stock: val, tersedia: parseInt(val) <= 0 ? false : formData.tersedia});
                      }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea className="form-control" rows="3" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Badge (opsional)</label>
                    <input type="text" className="form-control" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="Misal: Best Seller" />
                  </div>
                </div>
              </div>
              <div className="modal-footer menupage-modal-footer">
                <button type="button" className="btn-outline menupage-btn-kelola" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary menupage-btn-tambah">Simpan Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isCategoryModalOpen && (
        <div className="modal-overlay show menupage-cat-modal-overlay">
          <div className="modal menupage-cat-modal">
            <div className="menupage-cat-header">
              <div>
                <div className="menupage-cat-label"><i className="fa-solid fa-tags" style={{ marginRight: '6px' }}></i> Label Menu</div>
                <h2 className="menupage-cat-title">Kategori</h2>
              </div>
              <button onClick={() => setIsCategoryModalOpen(false)} className="menupage-cat-close">&times;</button>
            </div>
            
            <div className="modal-body" style={{ padding: 0 }}>
              <div className="menupage-cat-input-wrapper">
                <div className="menupage-cat-input-inner">
                  <i className="fa-solid fa-layer-group menupage-cat-input-icon"></i>
                  <input type="text" placeholder="Tambah kategori baru..." value={newCat} onChange={e => setNewCat(e.target.value)} className="menupage-cat-input" onKeyDown={(e) => { if(e.key === 'Enter' && newCat.trim()) { addCategory(newCat.trim()); setNewCat(''); } }} />
                </div>
                <button className="btn-primary menupage-cat-btn-add" onClick={() => { if(newCat.trim()) { addCategory(newCat.trim()); setNewCat(''); } }}>Tambah</button>
              </div>

              <div className="menupage-cat-list">
                {categories.map(c => (
                  <div key={c} className="menupage-cat-item">
                    <div className="menupage-cat-item-left">
                      <div className="menupage-cat-item-icon-wrapper">
                        <i className="fa-solid fa-tag"></i>
                      </div>
                      <span className="menupage-cat-item-name">{c}</span>
                    </div>
                    <button className="menupage-cat-btn-delete" onClick={() => { if(window.confirm(`Hapus kategori "${c}"?`)) deleteCategory(c); }}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
