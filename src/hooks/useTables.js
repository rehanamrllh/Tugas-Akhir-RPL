import { useState, useEffect, useCallback } from 'react';
import { getTables, setTables, KEYS } from '../lib/storage';

export function useTables() {
  const [tables, setTablesState] = useState([]);

  const load = useCallback(() => setTablesState(getTables()), []);

  useEffect(() => {
    load();
    const handler = (e) => { if (e.key === KEYS.TABLES) load(); };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [load]);

  const addTable = (tableData) => {
    if (tables.find(t => t.id === tableData.id)) return false; // duplicate
    const updated = [...tables, tableData].sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.id.localeCompare(b.id);
    });
    setTables(updated);
    setTablesState(updated);
    return true;
  };

  const updateTable = (oldId, newData) => {
    if (oldId !== newData.id && tables.find(t => t.id === newData.id)) return false; // new id is duplicate
    const filtered = tables.filter(t => t.id !== oldId);
    const updated = [...filtered, newData].sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.id.localeCompare(b.id);
    });
    setTables(updated);
    setTablesState(updated);
    return true;
  };

  const deleteTable = (id) => {
    const updated = tables.filter(t => t.id !== id);
    setTables(updated);
    setTablesState(updated);
  };

  return { tables, addTable, updateTable, deleteTable, reload: load };
}
