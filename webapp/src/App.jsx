import { useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { VirtualPet } from './components/VirtualPet';
import { TutorDashboard } from './components/TutorDashboard';
import { WorldSelector } from './components/WorldSelector';
import { useStats } from './context/StatsContext';
import { playPop, toggleMute, isSoundMuted } from './utils/audio';
import { asset } from './utils/assets';
import { Gamepad2, Heart, BarChart3, Globe, Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [currentTab, setCurrentTab] = useState('world');
  const [muted, setMuted] = useState(isSoundMuted());
  const { stats } = useStats();

  const handleToggleSound = () => {
    const nextMuted = toggleMute();
    setMuted(nextMuted);
    if (!nextMuted) playPop();
  };

  const getCurrencyDisplay = () => {
    switch (stats.currentWorld) {
      case 'dumbo': return { val: stats.manies, icon: asset('/images/peanut_coin.png') };
      case 'pooh': return { val: stats.miel, icon: asset('/images/honey_coin.png') };
      case 'alien': return { val: stats.estrellas, icon: asset('/images/star_coin.png') };
      default: return { val: stats.manies, icon: asset('/images/peanut_coin.png') };
    }
  };

  const currency = getCurrencyDisplay();

  const renderTab = () => {
    switch (currentTab) {
      case 'world': return <WorldSelector key="world" onSelect={() => setCurrentTab('game')} />;
      case 'game': return <GameScreen key="game" />;
      case 'pet': return <VirtualPet key="pet" />;
      case 'tutor': return <TutorDashboard key="tutor" />;
      default: return <WorldSelector key="world" onSelect={() => setCurrentTab('game')} />;
    }
  };

  const bgColors = {
    dumbo: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    pooh: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    alien: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
  };

  return (
    <div className="app-container" style={{ background: bgColors[stats.currentWorld] || bgColors.dumbo, transition: 'background 0.5s ease' }}>
      {/* Top Bar */}
      <header className="top-bar" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
        <h1 title={`Las sumitas de ${stats.playerName}`}>Las sumas de {stats.playerName}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={handleToggleSound}
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '50%',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: muted ? '#ef4444' : 'var(--secondary)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
            title={muted ? "Activar sonido" : "Silenciar sonido"}
            aria-label={muted ? "Activar sonido" : "Silenciar sonido"}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <div className="peanut-counter animate-pop-in">
            <img src={currency.icon} alt="coin" style={{ width: '24px', height: '24px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            {currency.val}
          </div>
        </div>
      </header>

      {/* Main Content Area with Framer Motion transitions */}
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-btn ${currentTab === 'world' ? 'active' : ''}`}
          onClick={() => {
            playPop();
            setCurrentTab('world');
          }}
        >
          <Globe size={24} />
          <span>Mundos</span>
        </button>
        <button 
          className={`nav-btn ${currentTab === 'game' ? 'active' : ''}`}
          onClick={() => {
            playPop();
            setCurrentTab('game');
          }}
        >
          <Gamepad2 size={24} />
          <span>Jugar</span>
        </button>
        <button 
          className={`nav-btn ${currentTab === 'pet' ? 'active' : ''}`}
          onClick={() => {
            playPop();
            setCurrentTab('pet');
          }}
        >
          <Heart size={24} />
          <span>Mascota</span>
        </button>
        <button 
          className={`nav-btn ${currentTab === 'tutor' ? 'active' : ''}`}
          onClick={() => {
            playPop();
            setCurrentTab('tutor');
          }}
        >
          <BarChart3 size={24} />
          <span>Tutor</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
