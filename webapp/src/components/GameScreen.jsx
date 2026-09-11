import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useStats } from '../context/StatsContext';
import { playSuccess, playError, playMagic, playPop } from '../utils/audio';
import { asset } from '../utils/assets';

function createProblemData(nivelActual, currentWorld) {
  let maxNum = 10;
  if (nivelActual === 2) maxNum = 20;
  if (nivelActual === 3) maxNum = 50;
  if (nivelActual === 4) maxNum = 99;

  let n1 = Math.floor(Math.random() * maxNum) + 1;
  let n2 = Math.floor(Math.random() * maxNum) + 1;
  let currentOp = '+';

  if (currentWorld === 'pooh') {
    currentOp = '-';
  } else if (currentWorld === 'alien') {
    currentOp = Math.random() > 0.5 ? '+' : '-';
  }

  // Asegurar que no hay números negativos en restas
  if (currentOp === '-' && n1 < n2) {
    const temp = n1;
    n1 = n2;
    n2 = temp;
  }

  const correctAnswer = currentOp === '+' ? n1 + n2 : n1 - n2;
  const newOptions = [correctAnswer];
  while (newOptions.length < 4) {
    const randomOffset = Math.floor(Math.random() * 5) + 1;
    const isPositive = Math.random() > 0.5;
    const wrongAnswer = isPositive ? correctAnswer + randomOffset : Math.max(0, correctAnswer - randomOffset);
    if (!newOptions.includes(wrongAnswer)) {
      newOptions.push(wrongAnswer);
    }
  }

  return {
    num1: n1,
    num2: n2,
    operation: currentOp,
    correctAnswer,
    options: newOptions.sort(() => Math.random() - 0.5)
  };
}

export function GameScreen() {
  const { addCorrecta, addIncorrecta, stats } = useStats();
  const [problem, setProblem] = useState(() => createProblemData(stats.nivelActual, stats.currentWorld));
  const [prevParams, setPrevParams] = useState({ world: stats.currentWorld, level: stats.nivelActual });
  const [animating, setAnimating] = useState(false);
  const [shakeIndex, setShakeIndex] = useState(-1);
  const [preguntasRonda, setPreguntasRonda] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState([]);

  // Sincronizar nuevo problema si cambia de mundo o nivel desde el tutor
  if (prevParams.world !== stats.currentWorld || prevParams.level !== stats.nivelActual) {
    setPrevParams({ world: stats.currentWorld, level: stats.nivelActual });
    setProblem(createProblemData(stats.nivelActual, stats.currentWorld));
    setDisabledOptions([]);
  }

  const generateProblem = useCallback(() => {
    setDisabledOptions([]);
    setProblem(createProblemData(stats.nivelActual, stats.currentWorld));
  }, [stats.nivelActual, stats.currentWorld]);

  const triggerCombo = useCallback(() => {
    setShowCombo(true);
    playMagic();
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFB100', '#E74C3C']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4A90E2', '#2ECC71']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setTimeout(() => {
      setShowCombo(false);
      setPreguntasRonda(p => p + 1);
      setAnimating(false);
      generateProblem();
    }, 2200);
  }, [generateProblem]);

  const handleOptionClick = (option, index) => {
    if (animating || disabledOptions.includes(index)) return;

    if (option === problem.correctAnswer) {
      setAnimating(true);
      addCorrecta(stats.currentWorld);
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      if (newStreak === 3 || newStreak === 5) {
        triggerCombo();
      } else {
        playSuccess();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFB100', '#4A90E2', '#E74C3C', '#2ECC71']
        });

        setTimeout(() => {
          setPreguntasRonda(p => p + 1);
          setAnimating(false);
          generateProblem();
        }, 1300);
      }

    } else {
      // Mecánica amigable: vibra y deshabilita la opción errónea para que el niño pueda volver a intentar
      playError();
      addIncorrecta(stats.currentWorld);
      setStreak(0);
      setShakeIndex(index);
      setDisabledOptions(prev => [...prev, index]);
      setTimeout(() => {
        setShakeIndex(-1);
      }, 450);
    }
  };

  const getCoinImage = () => {
    if (stats.currentWorld === 'pooh') return asset('/images/honey_coin.png');
    if (stats.currentWorld === 'alien') return asset('/images/star_coin.png');
    return asset('/images/peanut_coin.png');
  };

  if (preguntasRonda >= 10) {
    return (
      <div className="game-container animate-pop-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', color: 'var(--secondary)', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          ¡Ronda Completada! 🎉
        </h2>
        <div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={getCoinImage()} 
            className="animate-bounce" 
            style={{ width: '130px', height: '130px', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }} 
            alt="coin" 
          />
        </div>
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text)', marginBottom: '2rem' }}>
          ¡Increíble trabajo, {stats.playerName}! Sigue así.
        </p>
        <button 
          className="btn-giant blue animate-pop-in" 
          onClick={() => {
            playPop();
            setPreguntasRonda(0);
            setStreak(0);
            generateProblem();
          }}
          style={{ minWidth: '220px' }}
        >
          ¡Jugar Otra Ronda!
        </button>
      </div>
    );
  }

  const progressPercentage = (preguntasRonda / 10) * 100;

  return (
    <div style={{ display: 'flex', height: '100%', padding: '1.5rem', position: 'relative' }}>
      
      {showCombo && (
        <div className="combo-overlay">
          <div className="animate-combo-text">
            ¡IMPRESIONANTE <br/> {stats.playerName.toUpperCase()}! 🔥
          </div>
          <div style={{ fontSize: '2rem', marginTop: '1rem', color: 'white', fontWeight: 'bold' }}>
            {streak} seguidas x{stats.nivelActual}
          </div>
        </div>
      )}

      {/* Barra Vertical de Progreso */}
      <div className="peanut-path-container">
        <div className="peanut-path-line"></div>
        <div 
          className="peanut-indicator"
          style={{ bottom: `${progressPercentage}%`, width: '40px', height: '40px' }}
        >
          <img src={getCoinImage()} alt="coin" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>
      </div>

      {/* Contenido del Juego */}
      <div className="game-container animate-pop-in" style={{ padding: 0, flex: 1 }}>
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '800' }}>
          Operación {preguntasRonda + 1} de 10
        </div>
        
        <div className="sum-display" style={{ fontSize: 'clamp(3.5rem, 14vw, 6.5rem)' }}>
          {problem.num1} {problem.operation} {problem.num2}
        </div>
        
        <div className="options-grid">
          {problem.options.map((opt, i) => {
            const isWrong = disabledOptions.includes(i);
            const isShaking = shakeIndex === i;
            const colorClass = i % 2 === 0 ? '' : 'blue';
            return (
              <button 
                key={i}
                className={`btn-giant ${colorClass} ${isShaking ? 'animate-shake' : ''}`}
                onClick={() => handleOptionClick(opt, i)}
                disabled={animating || isWrong}
                style={isWrong ? {
                  opacity: 0.35,
                  transform: 'scale(0.92)',
                  filter: 'grayscale(0.8)',
                  boxShadow: 'none',
                  cursor: 'not-allowed'
                } : {}}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
