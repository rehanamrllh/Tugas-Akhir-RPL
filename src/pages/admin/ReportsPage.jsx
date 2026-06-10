import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { formatRp, formatDate } from '../../lib/utils';
import './ReportsPage.css';

export default function ReportsPage() {
  const { orders } = useOrders();
  
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  
  // Get completed orders within date range
  const filteredOrders = orders.filter(o => {
    if (o.status !== 'Selesai') return false;
    const date = o.waktu.split('T')[0];
    return date >= startDate && date <= endDate;
  });

  const totalPenjualan = filteredOrders.length;
  const totalPendapatan = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const rataRata = totalPenjualan > 0 ? totalPendapatan / totalPenjualan : 0;

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }
    
    const headers = ["ID Pesanan", "Waktu", "Pelanggan", "Meja", "Total", "Metode Pembayaran", "Status"];
    const rows = filteredOrders.map(o => [
      `ORD-${o.id}`,
      o.waktu,
      o.pelanggan || 'Tanpa Nama',
      o.meja,
      o.total,
      o.paymentMethod || o.metodePembayaran || 'Kasir',
      o.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.map(item => `"${item}"`).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_TwiceCafe_${startDate}_sd_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (filteredOrders.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }
    
    const printWindow = window.open('', '_blank');
    
    let tableHtml = `
      <html>
        <head>
          <title>Laporan Twice Cafe</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 20px; color: #333; }
            h2 { text-align: center; color: #9b111e; margin-bottom: 5px; }
            .header-info { text-align: center; margin-bottom: 20px; font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #eee; padding: 12px; text-align: left; }
            th { background-color: #fffaf1; color: #e67e22; text-transform: uppercase; font-size: 10px; }
            .total-cell { text-align: right; font-weight: bold; color: #9b111e; }
          </style>
        </head>
        <body>
          <h2>Laporan Penjualan Twice Cafe</h2>
          <div class="header-info">
            <p>Periode: <strong>${startDate}</strong> s/d <strong>${endDate}</strong><br>
            Total Omzet: <strong>${formatRp(totalPendapatan)}</strong> | Total Pesanan: <strong>${totalPenjualan}</strong></p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Waktu</th>
                <th>Pelanggan</th>
                <th>Meja</th>
                <th>Metode</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    filteredOrders.forEach(o => {
      tableHtml += `
        <tr>
          <td><strong>#ORD-${o.id}</strong></td>
          <td>${formatDate(o.waktu)}</td>
          <td>${o.pelanggan || 'Tanpa Nama'}</td>
          <td>${o.meja}</td>
          <td>${o.paymentMethod || o.metodePembayaran || 'Kasir'}</td>
          <td class="total-cell">${formatRp(o.total)}</td>
        </tr>
      `;
    });
    
    tableHtml += `
            </tbody>
          </table>
          <script>
            window.onload = function() { setTimeout(function() { window.print(); window.close(); }, 500); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(tableHtml);
    printWindow.document.close();
  };

  return (
    <section className="content-section">
      <div className="white-card reports-filter-card">
        <div className="form-group reports-form-group">
          <label>Dari Tanggal</label>
          <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="form-group reports-form-group">
          <label>Sampai Tanggal</label>
          <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-red"><i className="fa-solid fa-filter"></i> Tampilkan</button>
          <button className="btn-red" onClick={handleExportCSV} style={{ backgroundColor: '#059669', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}>
            <i className="fa-solid fa-file-excel"></i> Export CSV
          </button>
          <button className="btn-red" onClick={handleExportPDF} style={{ backgroundColor: '#dc2626', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)' }}>
            <i className="fa-solid fa-file-pdf"></i> Export PDF
          </button>
        </div>
      </div>

      <div className="stat-4-grid reports-stat-grid">
        <div className="mini-stat">
          <div className="mini-stat-left">
            <div className="mini-stat-label">Total Omzet</div>
            <div className="mini-stat-val">{formatRp(totalPendapatan)}</div>
          </div>
          <div className="mini-stat-icon"><i className="fa-solid fa-sack-dollar"></i></div>
        </div>
        <div className="mini-stat">
          <div className="mini-stat-left">
            <div className="mini-stat-label">Pesanan Selesai</div>
            <div className="mini-stat-val">{totalPenjualan}</div>
          </div>
          <div className="mini-stat-icon"><i className="fa-solid fa-check"></i></div>
        </div>
      </div>

      <div className="white-card reports-table-card">
        <table>
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Waktu</th>
              <th>Pelanggan</th>
              <th>Meja</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="reports-empty-cell">Tidak ada data pada periode ini.</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{formatDate(order.waktu)}</td>
                  <td>{order.pelanggan}</td>
                  <td>{order.meja}</td>
                  <td className="reports-price-cell">{formatRp(order.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
