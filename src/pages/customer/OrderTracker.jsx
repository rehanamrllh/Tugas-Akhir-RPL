import { useEffect, useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import './OrderTracker.css';

const ORDER_STEPS = [
  { key: 'Baru', icon: 'fa-clock', label: 'Diterima', desc: 'Pesanan kamu sudah diterima dapur' },
  { key: 'Diproses', icon: 'fa-fire-burner', label: 'Diproses', desc: 'Dapur sedang menyiapkan pesananmu' },
  { key: 'Siap', icon: 'fa-bell', label: 'Siap', desc: 'Pesanan siap diambil / diantar!' },
  { key: 'Selesai', icon: 'fa-circle-check', label: 'Selesai', desc: 'Selamat menikmati! 🎉' },
];

export default function OrderTracker({ orderId, onClose }) {
  const { orders } = useOrders();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const found = orders.find(o => o.id === orderId);
      setOrder(found);
    }
  }, [orders, orderId]);

  if (!orderId || !order) return null;

  const isCanceled = order.status === 'Dibatalkan';
  const statusIndex = ORDER_STEPS.findIndex(s => s.key === order.status);
  const currentStep = isCanceled ? { label: 'Dibatalkan', desc: 'Pesanan ini telah dibatalkan.' } : ORDER_STEPS[Math.max(statusIndex, 0)];
  const isDone = order.status === 'Selesai' || isCanceled;

  return (
    <div className={`order-tracker show ${isDone ? 'tracker-done' : ''} order-tracker-block`} id="orderTracker">
      <div className="ot-header">
        <div className="ot-header-left">
          <div className="ot-pulse-dot"></div>
          <div>
            <div className="ot-label">TRACKING {order.tipePesanan === 'Takeaway' || order.meja === '-' ? `ANTREAN ${order.id.toString().padStart(3, '0')}` : `MEJA ${order.meja}`}</div>
            <div className="ot-status">{currentStep.label}</div>
          </div>
        </div>
        <button className="ot-close" onClick={onClose}>&times;</button>
      </div>

      <div className="ot-desc">{currentStep.desc}</div>

      {!isCanceled && (
        <div className="ot-steps">
          {ORDER_STEPS.map((step, i) => (
            <div key={step.key} className={`tracker-step ${i <= statusIndex ? 'done' : ''} ${i === statusIndex ? 'active' : ''}`}>
              <div className="ts-dot"><i className={`fa-solid ${step.icon}`}></i></div>
              <div className="ts-label">{step.label.toUpperCase()}</div>
              <div className={`ts-line ${i === ORDER_STEPS.length - 1 ? 'ts-line-hidden' : ''}`}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
