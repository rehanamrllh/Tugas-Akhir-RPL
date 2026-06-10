import { useState, useEffect } from 'react';
import { getUsers, setUsersList, KEYS } from '../lib/storage';

export function useUsers() {
  const [users, setUsers] = useState(() => getUsers());

  useEffect(() => {
    setUsers(getUsers());
    const handler = (e) => {
      if (e.key === KEYS.USERS) setUsers(getUsers());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addUser = (userData) => {
    const newUsers = [...users, { ...userData, id: Date.now() }];
    setUsersList(newUsers);
    setUsers(newUsers);
  };

  const updateUser = (id, newUserData) => {
    const newUsers = users.map(u => u.id === id ? { ...u, ...newUserData } : u);
    setUsersList(newUsers);
    setUsers(newUsers);
  };

  const deleteUser = (id) => {
    const newUsers = users.filter(u => u.id !== id);
    setUsersList(newUsers);
    setUsers(newUsers);
  };

  return { users, addUser, updateUser, deleteUser };
}
