import { useStats } from '../context/StatsContext';
import { Store, ArrowLeft, CheckCircle } from 'lucide-react';
import { playPop, playSuccess, playError } from '../utils/audio';
import { asset } from '../utils/assets';
import confetti from 'canvas-confetti';

const ACCESORIOS = [
  { id: 'gorrito', name: 'Gorrito Mágico', icon: asset('/images/hat_accessory.png'), price: 15 },
  { id: 'bufanda', name: 'Bufanda Roja', icon: asset('/images/scarf_accessory.png'), price: 30 },
  { id: 'pluma', name: 'Pluma de la Suerte', icon: asset('/images/feather_accessory.png'), price: 50 },
  { id: 'gafas', name: 'Gafas Geniales', icon: asset('/images/glasses_accessory.png'), price: 80 }
];

export function Shop({ onBack }) {
  const { stats, buyItem } = useStats();

  const getCurrencyInfo = () => {
    switch (stats.currentWorld) {
      case 'pooh': return { val: stats.miel, icon: asset('/images/honey_coin.png') };
      case 'alien': return { val: stats.estrellas, icon: asset('/images/star_coin.png') };
      default: return { val: stats.manies, icon: asset('/images/peanut_coin.png') };
    }
  };

  const currency = getCurrencyInfo();

  const handleBuy = (item) => {
    if (currency.val >= item.price) {
      if (buyItem(item.price, 'accesorio', item.id)) {
        playSuccess();
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
        const btn = document.getElementById(`btn-${item.id}`);
        if(btn) {
          btn.classList.add('animate-pop-in');
          setTimeout(() => btn.classList.remove('animate-pop-in'), 500);
        }
      }
    } else {
      playError();
      const btn = document.getElementById(`btn-${item.id}`);
      if(btn) {
        btn.classList.add('animate-shake');
        setTimeout(() => btn.classList.remove('animate-shake'), 400);
      }
    }
  };

  return (
    <div className="home-container animate-pop-in" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => { playPop(); onBack(); }} style={{ background: 'rgba(255,255,255,0.5)', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}>
          <ArrowLeft size={32} />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', fontSize: '2rem', color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.3)', margin: 0, display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
          <Store /> Tienda
        </h2>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.8)', padding: '0.5rem 1rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
        Tienes {currency.val} <img src={currency.icon} style={{ width: '24px', mixBlendMode: 'multiply' }} alt="coin"/>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
        {ACCESORIOS.map(item => {
          const isOwned = stats.accesorios.includes(item.id);
          const canAfford = currency.val >= item.price;
          
          return (
            <div key={item.id} style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '1rem', 
              display: 'flex', 
              alignItems: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              opacity: isOwned ? 0.8 : 1,
              transform: isOwned ? 'scale(0.98)' : 'scale(1)'
            }}>
              <div style={{ width: '60px', height: '60px', marginRight: '1rem' }}>
                <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2C3E50' }}>{item.name}</div>
                <div style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {item.price} <img src={currency.icon} style={{ width: '16px', mixBlendMode: 'multiply' }} alt="coin"/>
                </div>
              </div>
              
              {isOwned ? (
                <div style={{ color: 'var(--success)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CheckCircle size={32} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Comprado</span>
                </div>
              ) : (
                <button 
                  id={`btn-${item.id}`}
                  onClick={() => handleBuy(item)}
                  className={`btn-giant ${canAfford ? 'blue' : 'red'}`}
                  style={{ fontSize: '1.1rem', padding: '0.5rem 1rem', borderRadius: '15px' }}
                >
                  Comprar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
