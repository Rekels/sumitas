import { useState } from 'react';
import { useStats } from '../context/StatsContext';
import confetti from 'canvas-confetti';
import { Shop } from './Shop';
import { Theater } from './Theater';
import { Store, Film } from 'lucide-react';
import { playPop } from '../utils/audio';
import { asset } from '../utils/assets';

export function VirtualPet() {
  const { stats, feedPet } = useStats();
  const [isEating, setIsEating] = useState(false);
  const [view, setView] = useState('pet'); // 'pet', 'shop', 'theater'

  if (view === 'shop') return <Shop onBack={() => { playPop(); setView('pet'); }} />;
  if (view === 'theater') return <Theater onBack={() => { playPop(); setView('pet'); }} />;

  const getPetInfo = () => {
    switch (stats.currentWorld) {
      case 'pooh': return { name: 'Winnie the Pooh', avatar: asset('/images/pooh_avatar.png'), currency: stats.miel, currencyName: 'Miel', coinIcon: asset('/images/honey_coin.png') };
      case 'alien': return { name: 'Marcianito', avatar: asset('/images/alien_avatar.png'), currency: stats.estrellas, currencyName: 'Estrellas', coinIcon: asset('/images/star_coin.png') };
      default: return { name: 'Dumbo', avatar: asset('/images/dumbo_avatar.png'), currency: stats.manies, currencyName: 'Maníes', coinIcon: asset('/images/peanut_coin.png') };
    }
  };

  const petInfo = getPetInfo();

  const handleFeed = () => {
    if (isEating) return;

    if (feedPet()) {
      setIsEating(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 },
        colors: ['#E74C3C', '#FF6B6B', '#2ECC71', '#F1C40F'],
        shapes: ['circle']
      });
      setTimeout(() => setIsEating(false), 2000);
    } else {
      const btn = document.getElementById('feed-btn');
      btn.classList.add('animate-shake');
      setTimeout(() => btn.classList.remove('animate-shake'), 400);
    }
  };

  const renderAccesories = () => {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10 }}>
        {stats.accesorios.includes('gorrito') && <img src={asset('/images/hat_accessory.png')} alt="gorro" style={{ position: 'absolute', top: '-15%', right: '0%', width: '40%', mixBlendMode: 'multiply' }} className="animate-pop-in" />}
        {stats.accesorios.includes('bufanda') && <img src={asset('/images/scarf_accessory.png')} alt="bufanda" style={{ position: 'absolute', bottom: '-10%', left: '10%', width: '80%', mixBlendMode: 'multiply' }} className="animate-pop-in" />}
        {stats.accesorios.includes('gafas') && <img src={asset('/images/glasses_accessory.png')} alt="gafas" style={{ position: 'absolute', top: '25%', left: '15%', width: '70%', mixBlendMode: 'multiply' }} className="animate-pop-in" />}
        {stats.accesorios.includes('pluma') && <img src={asset('/images/feather_accessory.png')} alt="pluma" style={{ position: 'absolute', top: '10%', left: '-10%', width: '30%', mixBlendMode: 'multiply' }} className="animate-pop-in" />}
      </div>
    );
  };

  return (
    <div className="home-container animate-pop-in" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button onClick={() => { playPop(); setView('shop'); }} className="btn-giant blue" style={{ padding: '0.8rem 1.5rem', fontSize: '1.2rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Store size={24} /> Tienda
        </button>
        <button onClick={() => { playPop(); setView('theater'); }} className="btn-giant red" style={{ padding: '0.8rem 1.5rem', fontSize: '1.2rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Film size={24} /> Cine
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', margin: 0 }}>
          ¡{petInfo.name}!
        </h2>
      </div>

      <div style={{ position: 'relative', display: 'inline-block', width: 'clamp(150px, 40vw, 250px)', height: 'clamp(150px, 40vw, 250px)' }}>
        <img 
          src={petInfo.avatar} 
          alt={petInfo.name}
          className={`animate-float ${isEating ? 'animate-bounce' : ''}`} 
          style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} 
        />
        {renderAccesories()}
      </div>

      <button 
        id="feed-btn"
        className={`btn-giant ${petInfo.currency === 0 ? 'red' : 'blue'}`}
        onClick={handleFeed}
        style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem' }}
      >
        {petInfo.currency > 0 ? '¡Alimentar!' : `Sin ${petInfo.currencyName}`}
        <img src={petInfo.coinIcon} alt="coin" style={{ width: '32px', mixBlendMode: 'multiply' }} />
      </button>
      
      {isEating && (
        <p className="animate-pop-in" style={{ color: 'var(--success)', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem', textShadow: '1px 1px 2px white' }}>
          ¡A {petInfo.name} le encantó!
        </p>
      )}
    </div>
  );
}
