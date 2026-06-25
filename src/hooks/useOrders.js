import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue, set, update, remove } from 'firebase/database';

export function useOrders() {
  const [orders, setOrdersState] = useState([]);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.values(data);
        setOrdersState(ordersArray);
      } else {
        setOrdersState([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const createOrder = (orderData) => {
    let maxId = 0;
    orders.forEach(o => {
      const numId = parseInt(o.id, 10);
      // Hanya menghitung ID sequential yang kecil, abaikan timestamp ID lama
      if (!isNaN(numId) && numId < 10000000 && numId > maxId) {
        maxId = numId;
      }
    });
    const id = (maxId + 1).toString();
    const newOrder = {
      ...orderData,
      id,
      waktu: new Date().toISOString(),
      status: 'Baru',
    };
    set(ref(db, `orders/${id}`), newOrder);
    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    update(ref(db, `orders/${id}`), { status });
  };

  const updatePaymentStatus = async (id, statusPembayaran) => {
    update(ref(db, `orders/${id}`), { statusPembayaran, paymentStatus: statusPembayaran });
    
    if (statusPembayaran === 'lunas') {
      const order = orders.find(o => o.id === id);
      if (order && order.email) {
        try {
          // Ganti port jika server node jalan di port lain
          const serverUrl = `http://localhost:5000/api/send-receipt`;
          await fetch(serverUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: order.email,
              order_id: order.id,
              total: order.total,
              items: order.items,
              pelanggan: order.pelanggan
            })
          });
        } catch (error) {
          console.error('Gagal mengirim email nota:', error);
        }
      }
    }
  };

  const deleteOrder = (id) => {
    remove(ref(db, `orders/${id}`));
  };

  return { orders, createOrder, updateOrderStatus, updatePaymentStatus, deleteOrder };
}
