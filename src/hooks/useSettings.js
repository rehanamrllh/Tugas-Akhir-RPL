import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import { defaultSettings } from '../lib/storage';

export function useSettings() {
  const [settings, setSettingsState] = useState(defaultSettings);

  useEffect(() => {
    const settingsRef = ref(db, 'settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSettingsState(data);
      } else {
        // Seed default settings
        set(settingsRef, defaultSettings);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = (newSettings) => {
    set(ref(db, 'settings'), newSettings);
  };

  return { settings, updateSettings };
}
