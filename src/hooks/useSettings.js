import { useState, useEffect } from 'react';
import { getSettings, setSettingsObj } from '../lib/storage';

export function useSettings() {
  const [settings, setSettingsState] = useState(getSettings());

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'twicecafe_settings') {
        setSettingsState(getSettings());
      }
    };
    
    const handleCustomEvent = () => {
      setSettingsState(getSettings());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('settingsUpdated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('settingsUpdated', handleCustomEvent);
    };
  }, []);

  const updateSettings = (newSettings) => {
    setSettingsObj(newSettings);
    setSettingsState(newSettings);
    window.dispatchEvent(new Event('settingsUpdated'));
  };

  return { settings, updateSettings };
}
