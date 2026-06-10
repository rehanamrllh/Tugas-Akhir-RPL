import { useState, useEffect, useCallback } from 'react';
import { getOrders, setOrders, KEYS } from '../lib/storage';

export function useOrders() {
  const [orders, setOrdersState] = useState([]);

  const load = useCallback(() => setOrdersState(getOrders()), []);

  useEffect(() => {
    load();
    const handler = (e) => {
      if (e.key === KEYS.ORDERS || e.key === 'twicecafe_lastStatusUpdate') load();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [load]);

  const createOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      waktu: new Date().toISOString(),
      status: 'Baru',
    };
    const updated = [...orders, newOrder];
    setOrders(updated);
    setOrdersState(updated);
    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    setOrdersState(updated);
    localStorage.setItem('twicecafe_lastStatusUpdate', JSON.stringify({ orderId: id, status, ts: Date.now() }));
  };

  const updatePaymentStatus = (id, statusPembayaran) => {
    const updated = orders.map(o => o.id === id ? { ...o, statusPembayaran, paymentStatus: statusPembayaran } : o);
    setOrders(updated);
    setOrdersState(updated);
  };

  const deleteOrder = (id) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    setOrdersState(updated);
  };

  return { orders, createOrder, updateOrderStatus, updatePaymentStatus, deleteOrder, reload: load };
}
