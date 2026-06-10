import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import { defaultUsers } from '../lib/storage';

export function useUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Array.isArray(data) ? data : Object.values(data);
        setUsers(usersArray.filter(u => u !== null));
      } else {
        // Seed default users
        set(usersRef, defaultUsers);
      }
    });

    return () => unsubscribe();
  }, []);

  const addUser = (userData) => {
    const newUsers = [...users, { ...userData, id: Date.now() }];
    set(ref(db, 'users'), newUsers);
  };

  const updateUser = (id, newUserData) => {
    const newUsers = users.map(u => u.id === id ? { ...u, ...newUserData } : u);
    set(ref(db, 'users'), newUsers);
  };

  const deleteUser = (id) => {
    const newUsers = users.filter(u => u.id !== id);
    set(ref(db, 'users'), newUsers);
  };

  return { users, addUser, updateUser, deleteUser };
}
