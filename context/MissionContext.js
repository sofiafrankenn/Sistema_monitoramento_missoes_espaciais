import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MissionContext = createContext(null);

const STORAGE_KEY = '@space_mission_data';
const ALERTS_KEY = '@space_mission_alerts';

const generateSensorData = () => ({
  energy: Math.floor(Math.random() * 100),
  communication: Math.floor(Math.random() * 100),
  orbitalStability: Math.floor(Math.random() * 100),
  temperature: (Math.random() * 100 - 20).toFixed(1),
  fuelLevel: Math.floor(Math.random() * 100),
  oxygenLevel: Math.floor(Math.random() * 100),
  radiation: (Math.random() * 10).toFixed(2),
  speed: (Math.random() * 30000 + 7000).toFixed(0),
});

export function MissionProvider({ children }) {
  const [mission, setMission] = useState({
    name: 'Apollo X-2026',
    crew: 4,
    daysInOrbit: 12,
    status: 'ACTIVE',
    destination: 'Estação Orbital L2',
    launchDate: '2026-03-15',
  });

  const [sensors, setSensors] = useState(generateSensorData());
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load persisted data on startup
  useEffect(() => {
    loadPersistedData();
    const interval = setInterval(updateSensors, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadPersistedData = async () => {
    try {
      const [missionData, alertsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(ALERTS_KEY),
      ]);
      if (missionData) setMission(JSON.parse(missionData));
      if (alertsData) setAlerts(JSON.parse(alertsData));
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateSensors = useCallback(() => {
    setSensors(prev => {
      const newSensors = {
        energy: Math.max(0, Math.min(100, prev.energy + (Math.random() * 6 - 3))).toFixed(0) * 1,
        communication: Math.max(0, Math.min(100, prev.communication + (Math.random() * 4 - 2))).toFixed(0) * 1,
        orbitalStability: Math.max(0, Math.min(100, prev.orbitalStability + (Math.random() * 4 - 2))).toFixed(0) * 1,
        temperature: (parseFloat(prev.temperature) + (Math.random() * 2 - 1)).toFixed(1) * 1,
        fuelLevel: Math.max(0, Math.min(100, prev.fuelLevel - 0.1)).toFixed(1) * 1,
        oxygenLevel: Math.max(0, Math.min(100, prev.oxygenLevel + (Math.random() * 2 - 1))).toFixed(0) * 1,
        radiation: Math.max(0, (parseFloat(prev.radiation) + (Math.random() * 0.4 - 0.2))).toFixed(2) * 1,
        speed: (parseFloat(prev.speed) + (Math.random() * 200 - 100)).toFixed(0) * 1,
      };

      // Auto-generate alerts for critical values
      checkForAlerts(newSensors);
      return newSensors;
    });
  }, []);

  const checkForAlerts = (data) => {
    const newAlerts = [];
    if (data.energy < 20) newAlerts.push({ id: Date.now() + 1, type: 'CRÍTICO', message: `Nível de energia crítico: ${data.energy}%`, time: new Date().toISOString() });
    if (data.oxygenLevel < 25) newAlerts.push({ id: Date.now() + 2, type: 'CRÍTICO', message: `Oxigênio baixo: ${data.oxygenLevel}%`, time: new Date().toISOString() });
    if (data.radiation > 8) newAlerts.push({ id: Date.now() + 3, type: 'AVISO', message: `Radiação elevada: ${data.radiation} Sv`, time: new Date().toISOString() });
    if (data.communication < 30) newAlerts.push({ id: Date.now() + 4, type: 'AVISO', message: `Comunicação instável: ${data.communication}%`, time: new Date().toISOString() });
    if (data.orbitalStability < 25) newAlerts.push({ id: Date.now() + 5, type: 'CRÍTICO', message: `Estabilidade orbital comprometida: ${data.orbitalStability}%`, time: new Date().toISOString() });

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const updated = [...newAlerts, ...prev].slice(0, 50);
        AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updated)).catch(console.error);
        return updated;
      });
    }
  };

  const updateMission = async (newData) => {
    const updated = { ...mission, ...newData };
    setMission(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erro ao salvar missão:', e);
    }
  };

  const clearAlerts = async () => {
    setAlerts([]);
    await AsyncStorage.removeItem(ALERTS_KEY);
  };

  const addManualAlert = async (message, type = 'INFO') => {
    const alert = { id: Date.now(), type, message, time: new Date().toISOString() };
    const updated = [alert, ...alerts].slice(0, 50);
    setAlerts(updated);
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  };

  return (
    <MissionContext.Provider value={{
      mission, sensors, alerts, loading,
      updateMission, clearAlerts, addManualAlert,
    }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMission deve ser usado dentro de MissionProvider');
  return ctx;
}
