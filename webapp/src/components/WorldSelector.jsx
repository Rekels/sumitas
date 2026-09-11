import { useStats } from '../context/StatsContext';
import { playMagic } from '../utils/audio';
import { asset } from '../utils/assets';

export function WorldSelector({ onSelect }) {
  const { stats, setWorld } = useStats();

  const worlds = [
    {
      id: 'dumbo',
      name: 'Circo de Sumas',
      operation: 'Sumas',
      icon: asset('/images/dumbo_avatar.png'),
      coin: asset('/images/peanut_coin.png'),
      color: '#4A90E2',
      bgColor: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
    },
    {
      id: 'pooh',
      name: 'Bosque de Restas',
      operation: 'Restas',
      icon: asset('/images/pooh_avatar.png'),
      coin: asset('/images/honey_coin.png'),
      color: '#FFB100',
      bgColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
    },
    {
      id: 'alien',
      name: 'Planeta Combinado',
      operation: 'Sumas y Restas',
      icon: asset('/images/alien_avatar.png'),
      coin: asset('/images/star_coin.png'),
      color: '#2ECC71',
      bgColor: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
    }
  ];

  const handleSelect = (worldId) => {
    setWorld(worldId);
    playMagic();
    onSelect();
  };

  return (
    <div className="world-selector-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', overflowY: 'auto', alignItems: 'center' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', margin: 0, textAlign: 'center' }}>
        ¡Elige tu Mundo!
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
        {worlds.map((w) => (
          <button 
            key={w.id}
            onClick={() => handleSelect(w.id)}
            style={{
              background: w.bgColor,
              borderRadius: '20px',
              border: `4px solid ${w.id === stats.currentWorld ? 'white' : 'transparent'}`,
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              boxShadow: w.id === stats.currentWorld ? '0 0 20px rgba(255,255,255,0.5)' : '0 8px 16px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
              transform: w.id === stats.currentWorld ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <div style={{ flex: '0 0 80px', height: '80px', background: 'white', borderRadius: '50%', padding: '10px', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <img src={w.icon} alt={w.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
            <div style={{ flex: 1, textAlign: 'left', color: '#2C3E50' }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', fontWeight: 'bold' }}>{w.name}</h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontSize: '1rem' }}>{w.operation}</p>
            </div>
            <div style={{ width: '40px' }}>
              <img src={w.coin} alt="coin" style={{ width: '100%', objectFit: 'contain' }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
