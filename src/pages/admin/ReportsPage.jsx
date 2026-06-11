import { useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import { formatRp, formatDate } from "../../lib/utils";
import "./ReportsPage.css";

export default function ReportsPage() {
  const { orders } = useOrders();

  const defaultReportDate = "2026-01-01";
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(defaultReportDate);
  const [endDate, setEndDate] = useState(today);

  // Get all orders within date range
  const filteredOrdersAllStatus = orders.filter((o) => {
    const date = o.waktu.split("T")[0];
    return date >= startDate && date <= endDate;
  });

  // Calculate Stats
  const omzetOrders = filteredOrdersAllStatus.filter(
    (o) =>
      o.status === "Selesai" ||
      o.paymentMethod === "Bayar di Kasir" ||
      o.metodePembayaran === "Bayar di Kasir",
  );
  const totalOmzet = omzetOrders.reduce((sum, o) => sum + o.total, 0);

  const totalOrder = filteredOrdersAllStatus.length;
  const orderTerbayar = filteredOrdersAllStatus.filter(
    (o) => o.status === "Selesai",
  ).length;

  const belumLunas = filteredOrdersAllStatus.filter(
    (o) => o.status !== "Selesai" && o.status !== "Dibatalkan",
  ).length;
  const dibatalkan = filteredOrdersAllStatus.filter(
    (o) => o.status === "Dibatalkan",
  ).length;

  // Calculate top selling products (excluding cancelled)
  const productCount = {};
  filteredOrdersAllStatus.forEach((o) => {
    if (o.status === "Dibatalkan") return;
    if (o.items && Array.isArray(o.items)) {
      o.items.forEach((item) => {
        const name = item.name || item.nama;
        const price = item.price || item.harga;
        const qty = item.quantity || item.qty || 1;

        if (!name) return;

        if (!productCount[name]) {
          productCount[name] = { count: 0, total: 0 };
        }
        productCount[name].count += qty;
        productCount[name].total += price * qty;
      });
    }
  });

  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "baru":
        return "badge-baru";
      case "diproses":
        return "badge-diproses";
      case "siap":
        return "badge-siap";
      case "selesai":
        return "badge-selesai";
      case "dibatalkan":
        return "badge-dibatalkan";
      default:
        return "badge-baru";
    }
  };

  const handleExportCSV = () => {
    if (filteredOrdersAllStatus.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const headers = [
      "ID Pesanan",
      "Waktu",
      "Pelanggan",
      "Meja",
      "Total",
      "Metode Pembayaran",
      "Status",
    ];
    const rows = filteredOrdersAllStatus.map((o) => [
      `ORD-${o.id}`,
      o.waktu,
      o.pelanggan || "Tanpa Nama",
      o.meja,
      o.total,
      o.paymentMethod || o.metodePembayaran || "Kasir",
      o.status,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.map((item) => `"${item}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Laporan_TwiceCafe_${startDate}_sd_${endDate}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (filteredOrdersAllStatus.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const printWindow = window.open("", "_blank");

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
            Total Omzet: <strong>${formatRp(totalOmzet)}</strong> | Total Pesanan: <strong>${totalOrder}</strong></p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Waktu</th>
                <th>Pelanggan</th>
                <th>Meja</th>
                <th>Metode</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredOrdersAllStatus.forEach((o) => {
      tableHtml += `
        <tr>
          <td><strong>#ORD-${o.id}</strong></td>
          <td>${formatDate(o.waktu)}</td>
          <td>${o.pelanggan || "Tanpa Nama"}</td>
          <td>${o.meja}</td>
          <td>${o.paymentMethod || o.metodePembayaran || "Kasir"}</td>
          <td>${o.status}</td>
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
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group reports-form-group">
          <label>Sampai Tanggal</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-red">
            <i className="fa-solid fa-filter"></i> Tampilkan
          </button>
          <button
            className="btn-red"
            onClick={handleExportCSV}
            style={{
              backgroundColor: "#059669",
              boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
            }}
          >
            <i className="fa-solid fa-file-excel"></i> Export CSV
          </button>
          <button
            className="btn-red"
            onClick={handleExportPDF}
            style={{
              backgroundColor: "#dc2626",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)",
            }}
          >
            <i className="fa-solid fa-file-pdf"></i> Export PDF
          </button>
        </div>
      </div>

      <div className="reports-stat-grid">
        <div className="reports-stat-card">
          <div className="reports-stat-top">
            <div>
              <div className="reports-stat-title">Omzet Periode</div>
              <div className="reports-stat-value">{formatRp(totalOmzet)}</div>
            </div>
            <div className="reports-stat-icon">
              <i className="fa-solid fa-coins"></i>
            </div>
          </div>
          <div className="reports-stat-bottom">Order lunas + bayar kasir</div>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-top">
            <div>
              <div className="reports-stat-title">Total Order</div>
              <div className="reports-stat-value">{totalOrder}</div>
            </div>
            <div className="reports-stat-icon">
              <i className="fa-solid fa-receipt"></i>
            </div>
          </div>
          <div className="reports-stat-bottom">
            {orderTerbayar} order terbayar
          </div>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-top">
            <div>
              <div className="reports-stat-title">Belum Lunas</div>
              <div className="reports-stat-value">{belumLunas}</div>
            </div>
            <div className="reports-stat-icon">
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
          </div>
          <div className="reports-stat-bottom">Menunggu pembayaran</div>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-top">
            <div>
              <div className="reports-stat-title">Dibatalkan</div>
              <div className="reports-stat-value">{dibatalkan}</div>
            </div>
            <div className="reports-stat-icon">
              <i className="fa-solid fa-ban"></i>
            </div>
          </div>
          <div className="reports-stat-bottom">Order batal periode ini</div>
        </div>
      </div>

      <div className="reports-bottom-grid">
        <div className="white-card reports-table-card">
          <div className="reports-table-header">
            <div>
              <h3>
                <i className="fa-solid fa-table-list"></i> Detail Order
              </h3>
              <p>Data ini yang ikut ke file PDF/Excel.</p>
            </div>
          </div>
          <div className="table-responsive">
            <table className="reports-table-custom">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Kode</th>
                  <th>Meja</th>
                  <th>Pelanggan</th>
                  <th>Metode</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrdersAllStatus.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="reports-empty-cell">
                      Tidak ada data pada periode ini.
                    </td>
                  </tr>
                ) : (
                  filteredOrdersAllStatus.map((order) => (
                    <tr key={order.id}>
                      <td>{formatDate(order.waktu)}</td>
                      <td>
                        <strong>
                          #KSB-{order.id.slice(0, 8).toUpperCase()}
                        </strong>
                      </td>
                      <td>{order.meja}</td>
                      <td>{order.pelanggan}</td>
                      <td>
                        <span
                          className={`order-method ${order.paymentMethod === "Bayar di Kasir" ? "kasir" : ""}`}
                        >
                          <i
                            className={`fa-solid ${order.paymentMethod === "Bayar di Kasir" ? "fa-money-bill" : "fa-building-columns"}`}
                          ></i>{" "}
                          {order.paymentMethod ||
                            order.metodePembayaran ||
                            "Kasir"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`oc-status-badge ${getStatusBadgeClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="reports-price-cell">
                        {formatRp(order.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="white-card reports-top-products">
          <div className="reports-products-header">
            <h3>
              <i className="fa-solid fa-trophy"></i> Produk Terjual
            </h3>
            <span className="reports-products-count">
              {topProducts.length} menu
            </span>
          </div>

          <div className="reports-products-list">
            {topProducts.length === 0 ? (
              <div className="reports-empty-cell">
                Belum ada produk terjual.
              </div>
            ) : (
              topProducts.map((product, index) => (
                <div key={index} className="reports-product-item">
                  <div className="reports-product-name">
                    #{index + 1} {product[0].toUpperCase()}
                  </div>
                  <div className="reports-product-stats">
                    <span className="reports-product-qty">
                      {product[1].count}x
                    </span>
                    <span className="reports-product-total">
                      {formatRp(product[1].total)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
