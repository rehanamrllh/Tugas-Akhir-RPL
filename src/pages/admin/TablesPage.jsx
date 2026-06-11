import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTables } from '../../hooks/useTables';
import { useOrders } from '../../hooks/useOrders';
import './TablesPage.css';

export default function TablesPage() {
  const { tables, addTable, updateTable, deleteTable } = useTables();
  const { orders } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({ id: '', desc: '' });
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const baseUrl = window.location.origin; // e.g. http://localhost:5173

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      openModal();
      navigate('/admin/dashboard/tables', { replace: true });
    }
  }, [location.search, navigate]);

  const getTableStatus = (tableId) => {
    const activeOrders = orders.filter(o => o.meja === tableId && (o.status === 'Baru' || o.status === 'Diproses' || o.status === 'Siap'));
    return activeOrders.length > 0 ? 'Terisi' : 'Kosong';
  };

  const openModal = (table = null) => {
    setError('');
    if (table) {
      setEditingTable(table);
      setFormData({ ...table });
    } else {
      setEditingTable(null);
      setFormData({ id: '', desc: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.id.trim()) {
      setError('Nomor meja tidak boleh kosong');
      return;
    }

    if (editingTable) {
      const success = updateTable(editingTable.id, formData);
      if (!success) {
        setError('Nomor meja sudah digunakan!');
        return;
      }
    } else {
      const success = addTable(formData);
      if (!success) {
        setError('Nomor meja sudah digunakan!');
        return;
      }
    }
    setIsModalOpen(false);
  };

  const downloadQR = (tableId) => {
    const url = `${baseUrl}/?meja=${tableId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}`;
    
    fetch(qrUrl)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `QR_Meja_${tableId}.png`;
        link.click();
      });
  };

  return (
    <section className="content-section">
      <div className="tables-header-actions">
        <button className="btn-add-table" onClick={() => openModal()}><i className="fa-solid fa-plus"></i> Tambah Meja</button>
      </div>

      <div className="aes-tables-grid">
        {tables.map(table => {
          const tableUrl = `${baseUrl}/?meja=${table.id}`;
          const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableUrl)}`;
          const status = getTableStatus(table.id);
          const statusClass = status === 'Terisi' ? 'aes-status-terisi' : 'aes-status-kosong';
          
          return (
            <div key={table.id} className="aes-table-card">
              <div className="aes-table-card-top">
                <div className="aes-table-badge">Meja {table.id}</div>
                <div className="aes-table-actions-top">
                  <button className="aes-btn-icon edit" onClick={() => openModal(table)} title="Edit">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="aes-btn-icon delete" onClick={() => {
                    if (window.confirm(`Hapus meja ${table.id}?`)) deleteTable(table.id);
                  }} title="Hapus">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="aes-qr-wrapper">
                <div className="aes-qr-bg"></div>
                <img src={qrSrc} alt={`QR Meja ${table.id}`} className="aes-qr-img" />
              </div>
              <div className="aes-table-status-container">
                <span className={`aes-table-status-badge ${statusClass}`}>
                  {status === 'Terisi' ? <i className="fa-solid fa-user-group"></i> : <i className="fa-solid fa-check"></i>} {status}
                </span>
              </div>
              <div className="aes-table-info">
                <p className="aes-table-desc">{table.desc || 'Tidak ada deskripsi'}</p>
                <button className="aes-btn-download" onClick={() => downloadQR(table.id)}>
                  <i className="fa-solid fa-download"></i> Download QR
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-overlay show tables-modal-overlay">
          <div className="modal tables-modal-content aes-modal-content">
            <div className="aes-modal-header">
              <h3>{editingTable ? 'Edit Meja' : 'Tambah Meja Baru'}</h3>
              <button className="aes-modal-close" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {error && <div className="login-error tables-error-msg">{error}</div>}
                <div className="form-group">
                  <label>Nomor / Nama Meja *</label>
                  <input type="text" className="form-control" value={formData.id} onChange={e => { setFormData({...formData, id: e.target.value}); setError(''); }} required placeholder="Contoh: 1 atau VIP-A" />
                </div>
                <div className="form-group">
                  <label>Deskripsi (opsional)</label>
                  <input type="text" className="form-control" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="Contoh: Dekat jendela" />
                </div>
              </div>
              <div className="aes-modal-footer">
                <button type="button" className="aes-btn-cancel" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="aes-btn-save"><i className="fa-solid fa-check"></i> Simpan Meja</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
