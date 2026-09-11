import { useStats } from '../context/StatsContext';
import { RefreshCw, TrendingUp, XCircle, CheckCircle, User, Coins, Check } from 'lucide-react';
import { useState } from 'react';
import { playPop, playSuccess } from '../utils/audio';
import { asset } from '../utils/assets';

export function TutorDashboard() {
  const { stats, resetStats, updateNivel, updatePlayerName, addCoins } = useStats();
  const [nameInput, setNameInput] = useState(stats.playerName);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const correctas = stats.correctasTotales ?? stats.correctas ?? 0;
  const incorrectas = stats.incorrectasTotales ?? stats.incorrectas ?? 0;
  const total = correctas + incorrectas;
  const percentage = total === 0 ? 0 : Math.round((correctas / total) * 100);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const handleLevelChange = () => {
    playPop();
    let nextLevel = stats.nivelActual + 1;
    if (nextLevel > 4) nextLevel = 1;
    updateNivel(nextLevel);
    showToast(`Nivel cambiado a: Nivel ${nextLevel}`);
  };

  const saveName = () => {
    if (nameInput.trim()) {
      playSuccess();
      updatePlayerName(nameInput.trim());
      showToast('¡Nombre guardado correctamente!');
    }
  };

  const handleAddCoins = () => {
    playSuccess();
    addCoins(50);
    showToast('¡+50 monedas añadidas al mundo actual!');
  };

  return (
    <div className="home-container animate-pop-in" style={{ padding: '1rem', overflowY: 'auto' }}>
      <h2 style={{ fontSize: '2rem', color: 'var(--text)', marginBottom: '1rem' }}>Panel de Tutor</h2>

      {feedbackMsg && (
        <div style={{
          background: 'var(--success)',
          color: 'white',
          padding: '0.6rem 1.2rem',
          borderRadius: '20px',
          fontWeight: 'bold',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        }} className="animate-pop-in">
          <Check size={18} /> {feedbackMsg}
        </div>
      )}
      
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '20px',
        width: '100%',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        textAlign: 'left',
        marginBottom: '1rem'
      }}>
        {/* Ajustes del Jugador */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <label style={{ color: '#7f8c8d', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} /> Nombre del Jugador
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '1.1rem', fontFamily: 'inherit' }}
            />
            <button 
              onClick={saveName}
              style={{ padding: '0.6rem 1.2rem', background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
            >
              Guardar
            </button>
          </div>
        </div>

        {/* Nivel Actual */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', background: '#f8fafc', padding: '0.8rem 1rem', borderRadius: '12px' }}>
          <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600' }}>Nivel de Dificultad:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary)' }}>
            Nivel {stats.nivelActual} {stats.nivelActual === 1 ? '(1 dígito)' : stats.nivelActual === 2 ? '(hasta 20)' : stats.nivelActual === 3 ? '(hasta 50)' : '(hasta 99)'}
          </span>
        </div>

        {/* Métricas de Aciertos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', padding: '1rem', borderRadius: '15px', textAlign: 'center' }}>
            <CheckCircle color="var(--success)" size={32} style={{ margin: '0 auto' }} />
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#065f46' }}>{correctas}</div>
            <div style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 'bold' }}>Correctas</div>
          </div>
          
          <div style={{ background: '#fef2f2', border: '2px solid #fecaca', padding: '1rem', borderRadius: '15px', textAlign: 'center' }}>
            <XCircle color="var(--error)" size={32} style={{ margin: '0 auto' }} />
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#991b1b' }}>{incorrectas}</div>
            <div style={{ fontSize: '0.9rem', color: '#b91c1c', fontWeight: 'bold' }}>Incorrectas</div>
          </div>
        </div>

        {/* Precisión */}
        <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>
            <span>Precisión Global</span>
            <span style={{ color: percentage >= 70 ? 'var(--success)' : 'var(--accent)' }}>{percentage}%</span>
          </div>
          <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
            <div style={{ width: `${percentage}%`, background: percentage >= 70 ? 'var(--success)' : 'var(--primary)', height: '100%', transition: 'width 0.5s ease' }}></div>
          </div>
        </div>

        {/* Resumen de Monedas Actuales */}
        <div style={{ marginBottom: '1.5rem', background: '#fffbeb', border: '2px solid #fde68a', padding: '1rem', borderRadius: '15px' }}>
          <div style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bolsa de Recompensas:</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <img src={asset('/images/peanut_coin.png')} alt="manies" style={{ width: '24px', height: '24px', mixBlendMode: 'multiply' }} />
              <div style={{ fontWeight: '800', color: '#b45309' }}>{stats.manies}</div>
              <div style={{ fontSize: '0.75rem', color: '#78350f' }}>Maníes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src={asset('/images/honey_coin.png')} alt="miel" style={{ width: '24px', height: '24px', mixBlendMode: 'multiply' }} />
              <div style={{ fontWeight: '800', color: '#b45309' }}>{stats.miel}</div>
              <div style={{ fontSize: '0.75rem', color: '#78350f' }}>Miel</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src={asset('/images/star_coin.png')} alt="estrellas" style={{ width: '24px', height: '24px', mixBlendMode: 'multiply' }} />
              <div style={{ fontWeight: '800', color: '#b45309' }}>{stats.estrellas}</div>
              <div style={{ fontSize: '0.75rem', color: '#78350f' }}>Estrellas</div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button 
            onClick={handleLevelChange}
            style={{
              padding: '0.9rem',
              borderRadius: '12px',
              border: '2px solid var(--secondary)',
              background: 'white',
              color: 'var(--secondary)',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <TrendingUp size={20} />
            Cambiar al Nivel {stats.nivelActual === 4 ? 1 : stats.nivelActual + 1}
          </button>

          <button 
            onClick={handleAddCoins}
            style={{
              padding: '0.9rem',
              borderRadius: '12px',
              border: 'none',
              background: '#e0f2fe',
              color: '#0369a1',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Coins size={20} />
            +50 Monedas para pruebas
          </button>

          <button 
            onClick={() => {
              if (window.confirm('¿Seguro que quieres reiniciar las estadísticas a 0?')) {
                resetStats();
                showToast('Estadísticas reiniciadas.');
              }
            }}
            style={{
              padding: '0.9rem',
              borderRadius: '12px',
              border: 'none',
              background: '#fee2e2',
              color: '#dc2626',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}
          >
            <RefreshCw size={18} />
            Reiniciar Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
}

