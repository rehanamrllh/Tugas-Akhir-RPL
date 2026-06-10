import { useState, useEffect, useCallback } from 'react';
import { getMenu, setMenu, KEYS } from '../lib/storage';

export function useMenu() {
  const [menuItems, setMenuItems] = useState([]);

  const load = useCallback(() => setMenuItems(getMenu()), []);

  useEffect(() => {
    load();
    const handler = (e) => { if (e.key === KEYS.MENU) load(); };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [load]);

  const addMenuItem = (item) => {
    const updated = [{ ...item, id: Date.now() }, ...menuItems];
    setMenu(updated);
    setMenuItems(updated);
  };

  const updateMenuItem = (id, data) => {
    const updated = menuItems.map(m => m.id === id ? { ...m, ...data } : m);
    setMenu(updated);
    setMenuItems(updated);
  };

  const deleteMenuItem = (id) => {
    const updated = menuItems.filter(m => m.id !== id);
    setMenu(updated);
    setMenuItems(updated);
  };

  return { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, reload: load };
}
