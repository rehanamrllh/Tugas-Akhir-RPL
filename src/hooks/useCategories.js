import { useState, useEffect, useCallback } from 'react';
import { ADMIN_CATEGORIES } from '../lib/utils';

export function useCategories() {
  const [categories, setCategoriesState] = useState([]);

  const load = useCallback(() => {
    try {
      const v = localStorage.getItem('twicecafe_categories');
      if (v) setCategoriesState(JSON.parse(v));
      else {
        setCategoriesState(ADMIN_CATEGORIES);
        localStorage.setItem('twicecafe_categories', JSON.stringify(ADMIN_CATEGORIES));
      }
    } catch {
      setCategoriesState(ADMIN_CATEGORIES);
    }
  }, []);

  useEffect(() => {
    load();
    const handler = (e) => { if (e.key === 'twicecafe_categories') load(); };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [load]);

  const addCategory = (cat) => {
    if (!categories.includes(cat)) {
      const updated = [...categories, cat];
      localStorage.setItem('twicecafe_categories', JSON.stringify(updated));
      setCategoriesState(updated);
      window.dispatchEvent(new Event('categories_updated'));
    }
  };

  const deleteCategory = (cat) => {
    const updated = categories.filter(c => c !== cat);
    localStorage.setItem('twicecafe_categories', JSON.stringify(updated));
    setCategoriesState(updated);
    window.dispatchEvent(new Event('categories_updated'));
  };

  return { categories, addCategory, deleteCategory };
}
