import { useState, useRef } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useUsers } from '../../hooks/useUsers';
import './SettingsPage.css';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [formData, setFormData] = useState({ ...settings });
  const fileInputRef = useRef(null);
  
  const [newUser, setNewUser] = useState({ id: null, name: '', role: 'Kasir', password: '123' });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const handleSave = () => {
    updateSettings(formData);
    alert('Setting Toko berhasil disimpan!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, logoUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (newUser.name.trim()) {
      if (newUser.id) {
        updateUser(newUser.id, { name: newUser.name, role: newUser.role });
      } else {
        addUser({ name: newUser.name, role: newUser.role, password: '123' });
      }
      setNewUser({ id: null, name: '', role: 'Kasir', password: '123' });
      setIsRoleModalOpen(false);
    }
  };

  const openEditModal = (user) => {
    setNewUser({ ...user });
    setIsRoleModalOpen(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Hapus pengguna ini?')) {
      deleteUser(id);
    }
  };

  const openAddModal = () => {
    setNewUser({ id: null, name: '', role: 'Kasir', password: '123' });
    setIsRoleModalOpen(true);
  };

  return (
    <section className="content-section">
      <div className="settings-container">
        
        {/* Left Column: Preview & Upload */}
        <div className="settings-left-col">
          
          <div className="white-card settings-preview-card">
            <div className="settings-preview-logo-wrapper">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Store Logo" />
              ) : (
                <i className="fa-solid fa-mug-hot"></i>
              )}
            </div>
            <div className="settings-label">PREVIEW PROFIL CUSTOMER</div>
            <h2 className="settings-title">{formData.namaToko || 'NAMA TOKO'}</h2>
            <p className="settings-desc">{formData.deskripsiToko || 'Deskripsi toko...'}</p>
          </div>

          <div className="white-card settings-upload-card">
            <h3 className="settings-upload-title">Upload Logo / Profile Toko</h3>
            <p className="settings-upload-desc">Fitur banner dihapus. Sekarang tampilan customer memakai logo/profile toko saja.</p>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
            <button className="btn-outline settings-btn-upload" onClick={() => fileInputRef.current.click()}>
              <i className="fa-solid fa-upload"></i> Upload Logo/Profile dari File
            </button>
            <div className="settings-url-wrapper">
              <div className="settings-url-label">Atau gunakan URL Logo</div>
              <input type="text" className="form-control settings-url-input" placeholder="https://..." value={formData.logoUrl || ''} onChange={e => setFormData({...formData, logoUrl: e.target.value})} />
            </div>
          </div>

        </div>

        {/* Right Column: Settings Form */}
        <div className="white-card settings-form-card">
          <div className="settings-form-label">STORE SETTINGS</div>
          <h2 className="settings-form-title">Setting Toko</h2>
          <p className="settings-form-desc">Bisa isi URL logo manual atau upload logo lewat file.</p>

          <div className="settings-form-wrapper">
            <input type="text" className="form-control settings-input" placeholder="Nama Toko" value={formData.namaToko} onChange={e => setFormData({...formData, namaToko: e.target.value})} />
            
            <textarea className="form-control settings-input settings-textarea-desc" placeholder="Deskripsi Toko" value={formData.deskripsiToko} onChange={e => setFormData({...formData, deskripsiToko: e.target.value})}></textarea>
            
            <textarea className="form-control settings-input settings-textarea-address" placeholder="Alamat Lengkap" value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})}></textarea>
            
            <div className="settings-grid-2">
              <input type="text" className="form-control settings-input" placeholder="Nomor WhatsApp (628...)" value={formData.kontak} onChange={e => setFormData({...formData, kontak: e.target.value})} />
              <input type="text" className="form-control settings-input" placeholder="Jam Buka" value={formData.jamBuka} onChange={e => setFormData({...formData, jamBuka: e.target.value})} />
            </div>

            <button className="btn-primary settings-btn-save" onClick={handleSave}>
              <i className="fa-solid fa-floppy-disk" style={{ marginRight: '8px' }}></i> Simpan Setting Toko
            </button>
          </div>
        </div>

      </div>

      {/* Role Management Section */}
      <div className="white-card settings-role-card">
        <div className="settings-role-header">
          <div>
            <div className="settings-form-label">USER MANAGEMENT</div>
            <h2 className="settings-form-title">Pengaturan Akses & Role</h2>
            <p className="settings-form-desc" style={{ marginBottom: 0 }}>Kelola siapa saja yang bisa mengakses sistem kasir dan admin. (Password default: 12345)</p>
          </div>
          <button className="settings-btn-add" onClick={openAddModal}>
            <i className="fa-solid fa-plus"></i> Tambah Pengguna
          </button>
        </div>

        <div className="settings-role-list">
          {users.map(user => (
            <div key={user.id} className="settings-role-item">
              <div className="settings-role-info">
                <div className="settings-role-avatar">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div>
                  <div className="settings-role-name">{user.name}</div>
                  <span className={`settings-role-badge role-${user.role.toLowerCase().replace(/ /g, '-')}`}>{user.role}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="aes-btn-icon edit" onClick={() => openEditModal(user)} title="Edit Pengguna">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button className="aes-btn-icon delete" onClick={() => handleDeleteUser(user.id)} title="Hapus Pengguna">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isRoleModalOpen && (
        <div className="modal-overlay show">
          <div className="modal aes-modal-content" style={{ maxWidth: '400px' }}>
            <div className="aes-modal-header">
              <h3>{newUser.id ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
              <button className="aes-modal-close" onClick={() => setIsRoleModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nama Pengguna</label>
                  <input type="text" className="form-control" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required placeholder="Contoh: Budi (Shift Pagi)" />
                </div>
                <div className="form-group">
                  <label>Pilih Role</label>
                  <select className="form-control" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                    <option value="Pemilik Kafe">Pemilik Kafe</option>
                    <option value="Admin">Admin</option>
                    <option value="Kasir">Kasir</option>
                    <option value="Staf Dapur">Staf Dapur</option>
                  </select>
                </div>
              </div>
              <div className="aes-modal-footer">
                <button type="button" className="aes-btn-cancel" onClick={() => setIsRoleModalOpen(false)}>Batal</button>
                <button type="submit" className="aes-btn-save"><i className="fa-solid fa-check"></i> Simpan Pengguna</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
