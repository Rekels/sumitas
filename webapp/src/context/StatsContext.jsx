/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const StatsContext = createContext();

const STATS_KEY = 'sumitas_stats';

const DEFAULT_STATS = {
  correctasTotales: 0,
  incorrectasTotales: 0,
  manies: 10,
  miel: 10,
  estrellas: 10,
  nivelActual: 1,
  currentWorld: 'dumbo',
  accesorios: [],
  fragmentos: [],
  playerName: 'Víctor'
};

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STATS,
          ...parsed,
          // Migración o compatibilidad si venía de versión previa con nombres alternativos
          correctasTotales: parsed.correctasTotales ?? parsed.correctas ?? 0,
          incorrectasTotales: parsed.incorrectasTotales ?? parsed.incorrectas ?? 0
        };
      } catch (e) {
        console.error("Error parsing stats", e);
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  const addCorrecta = (worldId) => {
    setStats(prev => {
      let rewardKey = 'manies';
      if (worldId === 'pooh') rewardKey = 'miel';
      if (worldId === 'alien') rewardKey = 'estrellas';
      
      return {
        ...prev,
        correctasTotales: prev.correctasTotales + 1,
        [rewardKey]: prev[rewardKey] + (1 * prev.nivelActual)
      };
    });
  };

  const addIncorrecta = (worldId) => {
    setStats(prev => {
      let rewardKey = 'manies';
      if (worldId === 'pooh') rewardKey = 'miel';
      if (worldId === 'alien') rewardKey = 'estrellas';
      
      return {
        ...prev,
        incorrectasTotales: prev.incorrectasTotales + 1,
        [rewardKey]: Math.max(0, prev[rewardKey] - (1 * prev.nivelActual))
      };
    });
  };

  const feedPet = () => {
    let currencyKey = 'manies';
    if (stats.currentWorld === 'pooh') currencyKey = 'miel';
    if (stats.currentWorld === 'alien') currencyKey = 'estrellas';

    if (stats[currencyKey] > 0) {
      setStats(prev => ({
        ...prev,
        [currencyKey]: prev[currencyKey] - 1
      }));
      return true;
    }
    return false;
  };

  const buyItem = (cost, type, itemId) => {
    let currencyKey = 'manies';
    if (stats.currentWorld === 'pooh') currencyKey = 'miel';
    if (stats.currentWorld === 'alien') currencyKey = 'estrellas';

    if (stats[currencyKey] >= cost) {
      setStats(prev => {
        if (type === 'accesorio' && !prev.accesorios.includes(itemId)) {
          return { ...prev, [currencyKey]: prev[currencyKey] - cost, accesorios: [...prev.accesorios, itemId] };
        }
        if (type === 'fragmento' && !prev.fragmentos.includes(itemId)) {
          return { ...prev, [currencyKey]: prev[currencyKey] - cost, fragmentos: [...prev.fragmentos, itemId] };
        }
        return prev;
      });
      return true;
    }
    return false;
  };

  const resetStats = () => {
    setStats(DEFAULT_STATS);
  };

  const updateNivel = (nuevoNivel) => {
    setStats(prev => ({
      ...prev,
      nivelActual: nuevoNivel
    }));
  };

  const updatePlayerName = (newName) => {
    setStats(prev => ({ ...prev, playerName: newName }));
  };

  const setWorld = (worldId) => {
    setStats(prev => ({ ...prev, currentWorld: worldId }));
  };

  const addCoins = (amount = 50) => {
    let key = 'manies';
    if (stats.currentWorld === 'pooh') key = 'miel';
    if (stats.currentWorld === 'alien') key = 'estrellas';
    setStats(prev => ({
      ...prev,
      [key]: prev[key] + amount
    }));
  };

  return (
    <StatsContext.Provider value={{
      stats,
      addCorrecta,
      addIncorrecta,
      feedPet,
      buyItem,
      resetStats,
      updateNivel,
      updatePlayerName,
      setWorld,
      addCoins
    }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  return useContext(StatsContext);
}
