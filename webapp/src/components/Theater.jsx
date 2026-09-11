import { useState } from 'react';
import { useStats } from '../context/StatsContext';
import { Film, ArrowLeft, PlayCircle, Lock, X, Sparkles } from 'lucide-react';
import { playPop, playSuccess, playError, playMagic } from '../utils/audio';
import { asset } from '../utils/assets';
import confetti from 'canvas-confetti';

const VIDEOS = [
  { id: 'v1', title: 'El Gran Despegue', desc: '¡Dumbo y sus amigos vuelan alto sobre las nubes!', price: 30 },
  { id: 'v2', title: 'El Árbol de la Miel', desc: '¡Una deliciosa fiesta en el bosque con Pooh!', price: 60 },
  { id: 'v3', title: 'Viaje Intergaláctico', desc: '¡Marcianito visita nuevos planetas llenos de números!', price: 90 },
  { id: 'v4', title: 'Super Show Matemático', desc: '¡El gran festival de campeones de Víctor José!', price: 150 }
];

export function Theater({ onBack }) {
  const { stats, buyItem } = useStats();
  const [activeVideo, setActiveVideo] = useState(null);

  const getCurrencyInfo = () => {
    switch (stats.currentWorld) {
      case 'pooh': return { val: stats.miel, icon: asset('/images/honey_coin.png'), avatar: asset('/images/pooh_avatar.png'), name: 'Winnie' };
      case 'alien': return { val: stats.estrellas, icon: asset('/images/star_coin.png'), avatar: asset('/images/alien_avatar.png'), name: 'Marcianito' };
      default: return { val: stats.manies, icon: asset('/images/peanut_coin.png'), avatar: asset('/images/dumbo_avatar.png'), name: 'Dumbo' };
    }
  };

  const currency = getCurrencyInfo();

  const handleBuy = (item) => {
    if (currency.val >= item.price) {
      if (buyItem(item.price, 'fragmento', item.id)) {
        playSuccess();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      playError();
      const btn = document.getElementById(`btn-${item.id}`);
      if (btn) {
        btn.classList.add('animate-shake');
        setTimeout(() => btn.classList.remove('animate-shake'), 400);
      }
    }
  };

  const playVideo = (video) => {
    playMagic();
    setActiveVideo(video);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="home-container animate-pop-in" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => { playPop(); onBack(); }} style={{ background: 'rgba(255,255,255,0.5)', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}>
          <ArrowLeft size={32} />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', fontSize: '2rem', color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.3)', margin: 0, display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
          <Film /> Cine de Aventuras
        </h2>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.85)', padding: '0.5rem 1.2rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        Tienes {currency.val} <img src={currency.icon} style={{ width: '24px', mixBlendMode: 'multiply' }} alt="coin"/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
        {VIDEOS.map(item => {
          const isOwned = stats.fragmentos.includes(item.id);
          const canAfford = currency.val >= item.price;
          
          return (
            <div key={item.id} style={{ 
              background: '#1e293b', 
              borderRadius: '16px', 
              padding: '0.8rem',
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ background: '#334155', height: '90px', borderRadius: '12px', marginBottom: '0.6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}>
                <Film size={36} color={isOwned ? 'var(--primary)' : 'rgba(255,255,255,0.4)'} />
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1', textAlign: 'center', marginTop: '0.3rem' }}>{item.desc}</span>
              </div>
              
              <div style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '0.6rem' }}>
                {item.title}
              </div>
              
              {isOwned ? (
                <button 
                  onClick={() => playVideo(item)}
                  className="btn-giant blue animate-pop-in" 
                  style={{ fontSize: '1rem', padding: '0.6rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%' }}
                >
                  <PlayCircle size={20} /> Ver Cine
                </button>
              ) : (
                <button 
                  id={`btn-${item.id}`}
                  onClick={() => handleBuy(item)}
                  className={`btn-giant ${canAfford ? 'red' : ''}`}
                  style={{ 
                    fontSize: '1rem', 
                    padding: '0.6rem', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    width: '100%',
                    background: canAfford ? 'var(--accent)' : '#64748b', 
                    borderColor: canAfford ? '#C0392B' : '#475569', 
                    boxShadow: `0 4px 0 ${canAfford ? '#C0392B' : '#334155'}` 
                  }}
                  disabled={!canAfford}
                >
                  <Lock size={16} /> {item.price} <img src={currency.icon} style={{ width: '16px', mixBlendMode: 'multiply' }} alt="coin"/>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Reproductor de Cine */}
      {activeVideo && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }} className="animate-pop-in">
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            border: '4px solid #f59e0b',
            borderRadius: '24px',
            padding: '2rem 1.5rem',
            maxWidth: '420px',
            width: '100%',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)'
          }}>
            <button 
              onClick={() => { playPop(); setActiveVideo(null); }}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                color: 'white',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              <Sparkles size={20} /> CINE DE RECOMPENSA
            </div>
            
            <h3 style={{ fontSize: '1.8rem', margin: '0 0 1rem 0', color: '#fef08a' }}>
              🎬 {activeVideo.title}
            </h3>

            <div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={currency.avatar} 
                alt="character" 
                className="animate-bounce" 
                style={{ width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' }} 
              />
            </div>

            <p style={{ fontSize: '1.2rem', lineHeight: '1.5', margin: '1rem 0', color: '#f1f5f9' }}>
              ¡Felicidades, {stats.playerName}! {currency.name} celebra contigo por resolver tantas operaciones matemáticas.
            </p>

            <button 
              className="btn-giant blue"
              onClick={() => {
                playMagic();
                confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
              }}
              style={{ fontSize: '1.1rem', padding: '0.7rem 1.5rem', borderRadius: '15px', marginTop: '1rem' }}
            >
              ¡Celebrar otra vez! ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

