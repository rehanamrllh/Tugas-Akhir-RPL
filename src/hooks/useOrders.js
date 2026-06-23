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

  const updatePaymentStatus = (id, statusPembayaran) => {
    update(ref(db, `orders/${id}`), { statusPembayaran, paymentStatus: statusPembayaran });
  };

  const deleteOrder = (id) => {
    remove(ref(db, `orders/${id}`));
  };

  return { orders, createOrder, updateOrderStatus, updatePaymentStatus, deleteOrder };
}
