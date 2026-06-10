import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { defaultMenuItems } from '../lib/storage';

export function useMenu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const menuRef = ref(db, 'menu');
    const unsubscribe = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const menuArray = Array.isArray(data) ? data : Object.values(data);
        setMenuItems(menuArray.filter(m => m !== null));
      } else {
        // Seed default menu items if empty
        set(menuRef, defaultMenuItems);
      }
    });

    return () => unsubscribe();
  }, []);

  const addMenuItem = (item) => {
    const id = Date.now();
    const updated = [{ ...item, id }, ...menuItems];
    set(ref(db, 'menu'), updated);
  };

  const updateMenuItem = (id, data) => {
    const updated = menuItems.map(m => m.id === id ? { ...m, ...data } : m);
    set(ref(db, 'menu'), updated);
  };

  const deleteMenuItem = (id) => {
    const updated = menuItems.filter(m => m.id !== id);
    set(ref(db, 'menu'), updated);
  };

  return { menuItems, addMenuItem, updateMenuItem, deleteMenuItem };
}
