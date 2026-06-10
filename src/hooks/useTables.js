import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import { defaultTables } from '../lib/storage';

export function useTables() {
  const [tables, setTablesState] = useState([]);

  useEffect(() => {
    const tablesRef = ref(db, 'tables');
    const unsubscribe = onValue(tablesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tablesArray = Array.isArray(data) ? data : Object.values(data);
        setTablesState(tablesArray.filter(t => t !== null));
      } else {
        // Seed default tables
        set(tablesRef, defaultTables);
      }
    });

    return () => unsubscribe();
  }, []);

  const addTable = (tableData) => {
    if (tables.find(t => t.id === tableData.id)) return false; // duplicate
    const updated = [...tables, tableData].sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.id.localeCompare(b.id);
    });
    set(ref(db, 'tables'), updated);
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
    set(ref(db, 'tables'), updated);
    return true;
  };

  const deleteTable = (id) => {
    const updated = tables.filter(t => t.id !== id);
    set(ref(db, 'tables'), updated);
  };

  return { tables, addTable, updateTable, deleteTable };
}
