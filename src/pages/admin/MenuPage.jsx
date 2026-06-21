import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import { useCategories } from '../../hooks/useCategories';
import { formatRp } from '../../lib/utils';
import Button from '../../components/ui/Button';
import PopupModal from '../../components/ui/PopupModal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      openModal();
      navigate('/admin/dashboard/menu', { replace: true });
    }
  }, [location.search, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 800;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFormData(prev => ({ ...prev, gambar: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
          <Input 
            icon="fa-solid fa-magnifying-glass"
            placeholder="Cari menu..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            wrapperClassName="mb-0"
            style={{ marginBottom: 0 }}
          />
          <Button variant="outline" className="menupage-btn-kelola" onClick={() => setIsCategoryModalOpen(true)} icon="fa-solid fa-tags">
            Kelola Kategori
          </Button>
          <Button variant="primary" className="menupage-btn-tambah" onClick={() => openModal()} icon="fa-solid fa-plus">
            Tambah Menu
          </Button>
        </div>
      </div>

      <div className="menupage-grid">
        {filteredMenu.map(item => (
          <div key={item.id} className={`menu-card menupage-card ${!item.tersedia ? 'unavailable' : ''}`}>
            <div className="menupage-card-img-wrapper">
              <Badge className="menupage-badge-category" variant="neutral">{item.kategori}</Badge>
              <Badge className={`menupage-badge-status ${!item.tersedia ? 'unavailable' : ''}`} variant={item.tersedia ? 'success' : 'danger'}>
                {item.tersedia ? 'Tersedia' : 'Habis'}
              </Badge>
              <img src={item.gambar || 'https://via.placeholder.com/400x300?text=No+Image'} alt={item.nama} className={`card-img menupage-card-img ${!item.tersedia ? 'unavailable' : ''}`} />
            </div>
            <div className="menupage-card-content">
              <h3 className="menupage-card-title">{item.nama}</h3>
              <p className="menupage-card-desc">{item.deskripsi}</p>
              
              <div className="menupage-price-row">
                <div className="menupage-price">{formatRp(item.harga)}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {item.stock !== undefined && item.stock !== '' && <span className="menupage-item-stock" style={{fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)'}}>Sisa: {item.stock}</span>}
                  {item.badge && <Badge variant="warning">{item.badge}</Badge>}
                </div>
              </div>
              
              <div className="menupage-action-grid">
                <Button variant="primary" size="sm" className="menupage-btn-edit" onClick={() => openModal(item)} icon="fa-solid fa-pen-to-square">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="menupage-btn-delete-photo" onClick={() => { setFormData({...item, gambar: ''}); updateMenuItem(item.id, {...item, gambar: ''}); }} icon="fa-solid fa-trash">
                  Hapus Foto
                </Button>
              </div>
              <Button variant="outline" size="sm" className="menupage-btn-delete-menu" style={{ width: '100%', marginTop: '8px' }} onClick={() => {
                if (window.confirm('Hapus menu ini?')) deleteMenuItem(item.id);
              }} icon="fa-solid fa-trash">
                Hapus Menu
              </Button>
            </div>
          </div>
        ))}
      </div>

      <PopupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Edit Menu' : 'Tambah Menu'}
        label={<><i className="fa-solid fa-burger" style={{ marginRight: '6px' }}></i> Menu Form</>}
        width="800px"
      >
        <form onSubmit={handleSave}>
          <div className="modal-body menupage-modal-body" style={{ padding: 0 }}>
            <div className="split-left">
              <div className="menupage-preview-wrapper">
                <img src={formData.gambar || 'https://via.placeholder.com/400x300?text=Preview'} alt="Preview" className="menupage-preview-img" />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="ui-input-label">Upload Gambar Lokal</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="form-control ui-input" 
                  style={{ marginTop: '8px', padding: '8px', background: '#fff' }} 
                />
                <small style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                  Atau masukkan tautan URL di bawah:
                </small>
              </div>
              <Input 
                label="URL Gambar" 
                value={formData.gambar} 
                onChange={e => setFormData({...formData, gambar: e.target.value})} 
                placeholder="https://..." 
              />
              <div className="form-group menupage-checkbox-group">
                <input type="checkbox" id="tersedia" checked={formData.tersedia} onChange={e => setFormData({...formData, tersedia: e.target.checked})} className="menupage-checkbox" />
                <label htmlFor="tersedia" className="menupage-checkbox-label">Menu Tersedia</label>
              </div>
            </div>
            <div className="split-right">
              <Input 
                label="Nama Menu *" 
                value={formData.nama} 
                onChange={e => setFormData({...formData, nama: e.target.value})} 
                required 
              />
              <div className="form-group">
                <label className="ui-input-label">Kategori *</label>
                <select className="form-control ui-input" style={{ marginTop: '8px' }} value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group menupage-price-stock-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input 
                  label="Harga (Rp) *" 
                  type="number" 
                  value={formData.harga} 
                  onChange={e => setFormData({...formData, harga: e.target.value})} 
                  required 
                />
                <Input 
                  label="Stok (opsional)" 
                  type="number" 
                  value={formData.stock} 
                  onChange={e => {
                    const val = e.target.value;
                    setFormData({...formData, stock: val, tersedia: parseInt(val) <= 0 ? false : formData.tersedia});
                  }} 
                />
              </div>
              <div className="form-group">
                <label className="ui-input-label">Deskripsi</label>
                <textarea className="form-control ui-input" style={{ marginTop: '8px' }} rows="3" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})}></textarea>
              </div>
              <Input 
                label="Badge (opsional)" 
                value={formData.badge} 
                onChange={e => setFormData({...formData, badge: e.target.value})} 
                placeholder="Misal: Best Seller" 
              />
            </div>
          </div>
          <div className="modal-footer menupage-modal-footer" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button variant="primary" type="submit">Simpan Menu</Button>
          </div>
        </form>
      </PopupModal>

      <PopupModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        title="Kategori"
        label={<><i className="fa-solid fa-tags" style={{ marginRight: '6px' }}></i> Label Menu</>}
        width="450px"
      >
        <div style={{ padding: 0 }}>
          <div className="menupage-cat-input-wrapper" style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <Input 
                icon="fa-solid fa-layer-group"
                placeholder="Tambah kategori baru..." 
                value={newCat} 
                onChange={e => setNewCat(e.target.value)} 
                onKeyDown={(e) => { if(e.key === 'Enter' && newCat.trim()) { addCategory(newCat.trim()); setNewCat(''); } }} 
                wrapperClassName="mb-0"
                style={{ marginBottom: 0 }}
              />
            </div>
            <Button variant="primary" onClick={() => { if(newCat.trim()) { addCategory(newCat.trim()); setNewCat(''); } }}>
              Tambah
            </Button>
          </div>

          <div className="menupage-cat-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map(c => (
              <div key={c} className="menupage-cat-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8f9fa', borderRadius: '8px' }}>
                <div className="menupage-cat-item-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="menupage-cat-item-icon-wrapper" style={{ color: 'var(--color-primary)' }}>
                    <i className="fa-solid fa-tag"></i>
                  </div>
                  <span className="menupage-cat-item-name" style={{ fontWeight: 600 }}>{c}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { if(window.confirm(`Hapus kategori "${c}"?`)) deleteCategory(c); }} style={{ color: 'var(--color-danger)' }}>
                  <i className="fa-solid fa-trash-can"></i>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopupModal>
    </section>
  );
}
