import { defaultMenuItems, defaultTables } from './utils';

const KEYS = {
  MENU: 'twicecafe_menu',
  ORDERS: 'twicecafe_orders',
  TABLES: 'twicecafe_tables',
  CART: 'twicecafe_cart',
  AUTH: 'twicecafe_auth',
  SETTINGS: 'twicecafe_settings',
  USERS: 'twicecafe_users',
};

export const defaultSettings = {
  namaToko: 'Twice Cafe',
  deskripsiToko: 'Cafe modern dengan sentuhan cita rasa Nusantara. Sajian kopi premium, pastry segar, dan makanan lezat untuk menemani harimu.',
  alamat: 'Jl. Saxophone, Tunggulwulung, Kec. Lowokwaru',
  kontak: '6283872391240',
  jamBuka: 'Setiap hari 09.00 - 03.00',
  logoUrl: '',
};

function get(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Menu
export function getMenu() {
  const m = get(KEYS.MENU);
  if (m) return m;
  set(KEYS.MENU, defaultMenuItems);
  return defaultMenuItems;
}
export function setMenu(items) { set(KEYS.MENU, items); }

// Orders
export function getOrders() { return get(KEYS.ORDERS, []); }
export function setOrders(items) { set(KEYS.ORDERS, items); }

// Tables
export function getTables() {
  const t = get(KEYS.TABLES);
  if (t) return t;
  set(KEYS.TABLES, defaultTables);
  return defaultTables;
}
export function setTables(items) { set(KEYS.TABLES, items); }

// Cart
export function getCart() { return get(KEYS.CART, []); }
export function setCart(items) { set(KEYS.CART, items); }

// Auth
export function getAuth() { return sessionStorage.getItem(KEYS.AUTH) === 'true'; }
export function setAuth(v) {
  if (v) sessionStorage.setItem(KEYS.AUTH, 'true');
  else sessionStorage.removeItem(KEYS.AUTH);
}

// Settings
export function getSettings() {
  const s = get(KEYS.SETTINGS);
  if (s) return s;
  set(KEYS.SETTINGS, defaultSettings);
  return defaultSettings;
}
export function setSettingsObj(items) { set(KEYS.SETTINGS, items); }

// Users
export const defaultUsers = [
  { id: 1, name: 'Asep', role: 'Pemilik Kafe', password: '123' },
  { id: 2, name: 'Budi', role: 'Kasir', password: '123' },
  { id: 3, name: 'Citra', role: 'Admin', password: '123' },
  { id: 4, name: 'Dodo', role: 'Staf Dapur', password: '123' }
];

export function getUsers() {
  const u = get(KEYS.USERS);
  if (u) return u;
  set(KEYS.USERS, defaultUsers);
  return defaultUsers;
}
export function setUsersList(items) { set(KEYS.USERS, items); }

export { KEYS };
