import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCart, setCart, KEYS } from '../lib/storage';

export function useCart() {
  const [cart, setCartState] = useState([]);

  const load = useCallback(() => setCartState(getCart()), []);

  useEffect(() => {
    load();
    const handler = (e) => { if (e.type === 'cart_updated' || e.key === KEYS.CART) load(); };
    window.addEventListener('cart_updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('cart_updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, [load]);

  const addToCart = (menuItem) => {
    const existing = cart.find(i => i.menuId === menuItem.id);
    let updated;
    if (existing) {
      updated = cart.map(i => i.menuId === menuItem.id ? { ...i, qty: i.qty + 1 } : i);
    } else {
      updated = [...cart, { menuId: menuItem.id, nama: menuItem.nama, harga: menuItem.harga, qty: 1, gambar: menuItem.gambar }];
    }
    setCart(updated);
    setCartState(updated);
    window.dispatchEvent(new Event('cart_updated'));
  };

  const updateQty = (menuId, delta) => {
    let updated = cart.map(i => i.menuId === menuId ? { ...i, qty: i.qty + delta } : i);
    updated = updated.filter(i => i.qty > 0);
    setCart(updated);
    setCartState(updated);
    window.dispatchEvent(new Event('cart_updated'));
  };

  const removeItem = (menuId) => {
    const updated = cart.filter(i => i.menuId !== menuId);
    setCart(updated);
    setCartState(updated);
    window.dispatchEvent(new Event('cart_updated'));
  };

  const clearCart = () => {
    setCart([]);
    setCartState([]);
    window.dispatchEvent(new Event('cart_updated'));
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.harga * item.qty), 0), [cart]);

  return { cart, addToCart, updateQty, removeItem, clearCart, cartCount, cartTotal };
}
