// tabs.jsx — Inicio, Comunidad, Recursos, Calendario + Shell (TopHeader, BottomNav, SOS)

const { useState: useStateT, useEffect: useEffectT, useRef: useRefT } = React;

// ─────────────────────────────────────────────────────────────
// INICIO (Dashboard)
// ─────────────────────────────────────────────────────────────
function HomeTab({ mood, setMood, weekData }) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  return (
    <div style={{
      padding: '16px 18px 24px',
      display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      {/* Greeting */}
      <div>
        <div style={{ fontSize: 12, color: T.textSec, fontWeight: 500, letterSpacing: 0.2 }}>
          {greeting}, Mariana
        </div>
        <div style={{ fontSize: 22, color: T.text, fontWeight: 700, letterSpacing: -0.4, marginTop: 2, lineHeight: 1.2 }}>
          ¿Cómo te sientes hoy?
        </div>
      </div>

      {/* Mood check-in */}
      <div style={{
        background: T.surface, borderRadius: 22, padding: '14px 14px 12px',
        border: `1px solid ${T.border}`,
      }}>
        <MoodPicker selected={mood} onSelect={setMood}/>
        {mood && (
          <div style={{
            marginTop: 6, padding: '10px 12px', borderRadius: 14,
            background: T.accentSoft, fontSize: 13, color: T.text, lineHeight: 1.4,
            animation: 'bubble-in 460ms cubic-bezier(.22,1,.36,1) both',
          }}>
            Gracias por registrarte. ¿Quieres platicar con Serena? Ve a la pestaña Chat.
          </div>
        )}
      </div>

      {/* Weekly bar chart */}
      <div style={{
        background: T.surface, borderRadius: 22, padding: '16px 18px 18px',
        border: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, color: T.text, fontWeight: 600, letterSpacing: -0.2 }}>Tu semana</div>
            <div style={{ fontSize: 11.5, color: T.textSec, marginTop: 2 }}>Promedio · Bien</div>
          </div>
          <div style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>Ver detalle →</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 6, height: 110,
        }}>
          {weekData.map((d, i) => {
            const max = 5;
            const h = (d.mood / max) * 100;
            const hue = MOODS[d.mood - 1].hue;
            const isToday = i === weekData.length - 1;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%', height: `${h}%`, borderRadius: 8,
                    background: `linear-gradient(180deg, ${hue} 0%, rgba(110,91,255,0.25) 100%)`,
                    border: isToday ? `1.5px solid ${T.accent}` : '1px solid rgba(255,255,255,0.04)',
                    boxShadow: isToday ? '0 4px 14px rgba(110,91,255,0.30)' : 'none',
                    transition: 'all 460ms cubic-bezier(.22,1,.36,1)',
                  }}/>
                </div>
                <div style={{ fontSize: 10.5, color: isToday ? T.accent : T.textSec, fontWeight: isToday ? 600 : 500 }}>
                  {d.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next appointment */}
      <div>
        <div style={{ fontSize: 11, color: T.textSec, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4 }}>
          Próxima cita
        </div>
        <div style={{
          background: `linear-gradient(160deg, ${T.surfaceHi} 0%, ${T.surface} 100%)`,
          borderRadius: 22, padding: '16px 16px 16px',
          border: `1px solid ${T.borderHi}`,
          boxShadow: '0 8px 24px rgba(110,91,255,0.10)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 140, height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110,91,255,0.20), transparent 70%)',
            pointerEvents: 'none',
          }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(160deg, rgba(168,155,255,0.25), rgba(110,91,255,0.12))',
              border: `1px solid ${T.borderHi}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke={T.accent} strokeWidth="1.6"/>
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={T.accent} strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, color: T.text, fontWeight: 600, letterSpacing: -0.2 }}>
                Dr. Andrés Solís
              </div>
              <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>
                Psicología clínica · Sala 204
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginTop: 14,
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(0,0,0,0.25)',
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="2" stroke={T.accent} strokeWidth="1.4"/>
                <path d="M2 6h12" stroke={T.accent} strokeWidth="1.4"/>
              </svg>
              <span style={{ fontSize: 12.5, color: T.text, fontWeight: 500 }}>Jueves 14 mayo</span>
            </div>
            <div style={{ width: 1, height: 14, background: T.border }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke={T.accent} strokeWidth="1.4"/>
                <path d="M8 5v3l2 1.5" stroke={T.accent} strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 12.5, color: T.text, fontWeight: 500 }}>16:30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMUNIDAD
// ─────────────────────────────────────────────────────────────
const POSTS = [
  {
    id: 1,
    avatar: 'rgba(168,155,255,0.4)',
    handle: 'Anónimo · Ingeniería',
    time: 'hace 2 h',
    body: 'Llevo dos semanas sin poder dormir bien por finales. Hoy hablé con Serena y me sirvió para nombrar lo que sentía. Si alguien está igual, no están solos.',
    reacts: 47, replies: 12, mood: 2,
  },
  {
    id: 2,
    avatar: 'rgba(123,211,176,0.4)',
    handle: 'Anónimo · Psicología',
    time: 'hace 5 h',
    body: 'Recordatorio para alguien que lo necesite hoy: pedir ayuda no te hace débil. Yo agendé mi primera sesión el mes pasado y fue lo mejor que he hecho este semestre.',
    reacts: 132, replies: 28, mood: 4,
  },
  {
    id: 3,
    avatar: 'rgba(244,180,156,0.4)',
    handle: 'Anónimo · Arquitectura',
    time: 'ayer',
    body: 'Truco que me funciona antes de un examen: salir 10 minutos a caminar sin teléfono. Suena tonto pero baja la presión en el pecho.',
    reacts: 89, replies: 19, mood: 4,
  },
];

function CommunityTab() {
  const [reacted, setReacted] = useStateT({});
  return (
    <div style={{ padding: '12px 14px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        padding: '12px 14px', borderRadius: 16,
        background: T.accentSoft, border: `1px solid ${T.borderHi}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" stroke={T.accent} strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
        <div style={{ fontSize: 12, color: T.text, lineHeight: 1.35 }}>
          <span style={{ fontWeight: 600 }}>Espacio anónimo y moderado</span>
          <span style={{ color: T.textSec }}> · sin nombres, sin rastros.</span>
        </div>
      </div>

      {POSTS.map(p => {
        const liked = reacted[p.id];
        return (
          <div key={p.id} style={{
            background: T.surface, borderRadius: 20, padding: '14px 16px',
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 17,
                background: `radial-gradient(circle at 30% 30%, ${p.avatar}, rgba(255,255,255,0.04) 75%)`,
                border: '1px solid rgba(255,255,255,0.08)',
              }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: T.text, fontWeight: 600, letterSpacing: -0.1 }}>{p.handle}</div>
                <div style={{ fontSize: 11.5, color: T.textTer, marginTop: 1 }}>{p.time}</div>
              </div>
              <div style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MoodFace id={p.mood} size={22} color={T.textSec} stroke={1.6}/>
              </div>
            </div>
            <div style={{ fontSize: 14.5, color: T.text, lineHeight: 1.5, letterSpacing: -0.1, marginBottom: 12 }}>
              {p.body}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <button onClick={() => setReacted(r => ({...r, [p.id]: !r[p.id]}))} style={{
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', gap: 6,
                color: liked ? T.accent : T.textSec,
                transition: 'color 240ms',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? T.accent : 'none'}>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                    stroke={liked ? T.accent : T.textSec} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>{p.reacts + (liked ? 1 : 0)}</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.textSec }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                    stroke={T.textSec} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>{p.replies}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RECURSOS
// ─────────────────────────────────────────────────────────────
const RESOURCES = [
  { id: 1, title: 'Respiración 4-7-8', subtitle: 'Calma rápida', dur: '4 min', cat: 'Ansiedad',
    grad: 'linear-gradient(160deg, rgba(168,200,255,0.35), rgba(110,91,255,0.18))', accent: '#A8C8FF',
    icon: <path d="M12 3a4 4 0 014 4c0 2-1 3-1 5h-6c0-2-1-3-1-5a4 4 0 014-4zM9 14h6M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/> },
  { id: 2, title: 'Estrés en exámenes', subtitle: 'Guía paso a paso', dur: '7 min', cat: 'Académico',
    grad: 'linear-gradient(160deg, rgba(244,180,156,0.30), rgba(244,123,123,0.15))', accent: '#F4B49C',
    icon: <path d="M5 4h11l3 3v13H5V4zM9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/> },
  { id: 3, title: 'Higiene del sueño', subtitle: 'Para dormir mejor', dur: '5 min', cat: 'Sueño',
    grad: 'linear-gradient(160deg, rgba(110,91,255,0.30), rgba(40,30,90,0.18))', accent: '#A89BFF',
    icon: <path d="M20 14a8 8 0 11-9.5-9.5A6 6 0 0020 14z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none"/> },
  { id: 4, title: 'Diario de gratitud', subtitle: 'Plantilla guiada', dur: '3 min', cat: 'Hábitos',
    grad: 'linear-gradient(160deg, rgba(123,211,176,0.30), rgba(60,140,110,0.15))', accent: '#7BD3B0',
    icon: <path d="M12 4l2.5 5 5.5.5-4 3.8 1.2 5.7L12 16l-5.2 3 1.2-5.7L4 9.5 9.5 9 12 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none"/> },
  { id: 5, title: 'Aterrizaje 5-4-3-2-1', subtitle: 'Para crisis de pánico', dur: '6 min', cat: 'Crisis',
    grad: 'linear-gradient(160deg, rgba(244,123,123,0.28), rgba(180,80,80,0.15))', accent: '#F47B7B',
    icon: <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/> },
  { id: 6, title: 'Soledad universitaria', subtitle: 'Cápsula reflexiva', dur: '8 min', cat: 'Vínculos',
    grad: 'linear-gradient(160deg, rgba(168,155,255,0.30), rgba(110,91,255,0.15))', accent: '#A89BFF',
    icon: <path d="M9 11a3 3 0 100-6 3 3 0 000 6zM15 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 21c0-3.3 2.7-6 6-6s6 2.7 6 6M14 21c0-2 1.3-4 3.5-4S21 19 21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/> },
];

function ResourcesTab() {
  return (
    <div style={{ padding: '14px 14px 24px' }}>
      <div style={{ marginBottom: 14, paddingLeft: 4 }}>
        <div style={{ fontSize: 12, color: T.textSec, fontWeight: 500, letterSpacing: 0.2 }}>Para esta semana</div>
        <div style={{ fontSize: 18, color: T.text, fontWeight: 700, letterSpacing: -0.3, marginTop: 2 }}>Cápsulas y herramientas</div>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {RESOURCES.map(r => (
          <button key={r.id} style={{
            border: 'none', textAlign: 'left', cursor: 'pointer',
            background: T.surface, borderRadius: 18, padding: '14px 14px 14px',
            display: 'flex', flexDirection: 'column', gap: 10,
            position: 'relative', overflow: 'hidden',
            outline: `1px solid ${T.border}`,
            transition: 'transform 240ms cubic-bezier(.22,1,.36,1), outline 240ms',
            fontFamily: 'inherit',
          }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: r.grad,
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: r.accent,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24">{r.icon}</svg>
            </div>
            <div>
              <div style={{ fontSize: 10, color: r.accent, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>
                {r.cat}
              </div>
              <div style={{ fontSize: 14, color: T.text, fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.25 }}>
                {r.title}
              </div>
              <div style={{ fontSize: 11.5, color: T.textSec, marginTop: 3, lineHeight: 1.3 }}>
                {r.subtitle}
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              marginTop: 'auto', paddingTop: 4,
              fontSize: 11, color: T.textSec, fontWeight: 500,
            }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke={T.textSec} strokeWidth="1.4"/>
                <path d="M8 5v3l2 1.5" stroke={T.textSec} strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              {r.dur}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CALENDARIO
// ─────────────────────────────────────────────────────────────
function CalendarTab({ moodLog }) {
  // Simulated month: May 2026, starts on Friday (1 = Fri)
  const monthName = 'Mayo 2026';
  const daysInMonth = 31;
  const firstDayOffset = 4; // Friday start (Mon=0)
  const today = 8;

  const cells = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ padding: '14px 18px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button style={{ width: 32, height: 32, borderRadius: 16, border: `1px solid ${T.border}`, background: T.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="10" height="14" viewBox="0 0 12 18"><path d="M9 1L2 9l7 8" stroke={T.text} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ fontSize: 16, color: T.text, fontWeight: 700, letterSpacing: -0.2 }}>{monthName}</div>
        <button style={{ width: 32, height: 32, borderRadius: 16, border: `1px solid ${T.border}`, background: T.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="10" height="14" viewBox="0 0 12 18"><path d="M3 1l7 8-7 8" stroke={T.text} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {['L','M','M','J','V','S','D'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10.5, color: T.textTer, fontWeight: 600, letterSpacing: 0.4, padding: '6px 0' }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={'e'+i}/>;
          const m = moodLog[d];
          const isToday = d === today;
          return (
            <div key={d} style={{
              aspectRatio: '1 / 1.1',
              borderRadius: 12,
              background: isToday ? T.accentSoft : 'transparent',
              border: isToday ? `1px solid ${T.borderHi}` : '1px solid transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, position: 'relative',
              transition: 'background 240ms',
            }}>
              <div style={{
                fontSize: 13, color: isToday ? T.text : (m ? T.text : T.textTer),
                fontWeight: isToday ? 700 : 500,
              }}>{d}</div>
              {m ? (
                <div style={{
                  width: 6, height: 6, borderRadius: 3, background: MOODS[m-1].hue,
                  boxShadow: `0 0 6px ${MOODS[m-1].hue}`,
                }}/>
              ) : <div style={{ width: 6, height: 6 }}/>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: 22, padding: '14px 16px', borderRadius: 16,
        background: T.surface, border: `1px solid ${T.border}`,
      }}>
        <div style={{ fontSize: 11, color: T.textSec, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>
          Tu estado de ánimo
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
          {MOODS.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: m.hue, boxShadow: `0 0 6px ${m.hue}` }}/>
              <div style={{ fontSize: 9.5, color: T.textSec, fontWeight: 500, textAlign: 'center' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SOS Modal
// ─────────────────────────────────────────────────────────────
function SOSModal({ open, onClose }) {
  const [mounted, setMounted] = useStateT(open);
  const [visible, setVisible] = useStateT(false);
  useEffectT(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 360);
      return () => clearTimeout(t);
    }
  }, [open]);
  if (!mounted) return null;

  const contacts = [
    { name: 'Línea de la Vida', sub: 'Atención 24/7 · Nacional', tel: '800 290 0024' },
    { name: 'SAPTEL', sub: 'Apoyo emocional · Cruz Roja', tel: '55 5259 8121' },
    { name: 'Bienestar UNI', sub: 'Psicólogo de guardia', tel: 'Llamar ahora' },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      pointerEvents: open ? 'auto' : 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(40,5,5,0.70)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 320ms cubic-bezier(.22,1,.36,1)',
      }}/>
      <div style={{
        position: 'relative', width: '100%',
        background: '#1A0F14',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '14px 22px 28px',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 460ms cubic-bezier(.22,1,.36,1)',
        boxSizing: 'border-box',
        border: `1px solid ${T.danger}33`,
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)', margin: '4px auto 18px' }}/>

        <div style={{
          width: 56, height: 56, borderRadius: 18,
          background: `linear-gradient(160deg, ${T.danger} 0%, #B83838 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14, boxShadow: '0 12px 28px rgba(244,123,123,0.35)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 22h20L12 2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M12 9v5M12 17.5v.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, color: T.text, lineHeight: 1.2, marginBottom: 6, letterSpacing: -0.3 }}>
          ¿Necesitas ayuda urgente?
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: T.textSec, marginBottom: 18 }}>
          No estás sola. Estos contactos son confidenciales y gratuitos. Si estás en peligro, marca al 911.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {contacts.map(c => (
            <button key={c.name} style={{
              padding: '14px 14px', borderRadius: 14, cursor: 'pointer',
              background: 'rgba(244,123,123,0.08)',
              border: `1px solid rgba(244,123,123,0.20)`,
              display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: 'inherit', textAlign: 'left',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `linear-gradient(160deg, ${T.danger} 0%, #B83838 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0122 16.92z"
                    stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, color: T.text, fontWeight: 600, letterSpacing: -0.2 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: T.textSec, marginTop: 1 }}>{c.sub}</div>
              </div>
              <div style={{ fontSize: 13, color: T.danger, fontWeight: 600 }}>{c.tel}</div>
            </button>
          ))}
        </div>

        <button onClick={onClose} style={{
          width: '100%', padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
          background: 'transparent', border: `1px solid ${T.border}`,
          color: T.text, fontSize: 14.5, fontWeight: 500, fontFamily: 'inherit',
        }}>Cerrar</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top Header (fixed)
// ─────────────────────────────────────────────────────────────
const TAB_TITLES = {
  home: 'Inicio',
  chat: 'Serena',
  community: 'Comunidad',
  resources: 'Recursos',
  calendar: 'Calendario',
};

function TopHeader({ tab, onSOS }) {
  return (
    <div style={{
      flexShrink: 0,
      padding: '10px 18px 10px',
      background: 'rgba(10,11,20,0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'relative', zIndex: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', height: 36 }}>
        {Object.entries(TAB_TITLES).map(([k, label]) => (
          <div key={k} style={{
            position: 'absolute', left: 0, top: 0,
            display: 'flex', alignItems: 'center', height: 36,
            fontSize: 19, color: T.text, fontWeight: 700, letterSpacing: -0.3,
            opacity: tab === k ? 1 : 0,
            transform: `translateY(${tab === k ? 0 : 8}px)`,
            transition: 'opacity 320ms cubic-bezier(.22,1,.36,1), transform 360ms cubic-bezier(.22,1,.36,1)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>{label}</div>
        ))}
      </div>
      <button onClick={onSOS} style={{
        height: 34, padding: '0 14px', borderRadius: 18, cursor: 'pointer',
        background: `linear-gradient(135deg, ${T.danger} 0%, #B83838 100%)`,
        border: 'none', color: '#fff',
        fontSize: 12, fontWeight: 700, letterSpacing: 1,
        display: 'flex', alignItems: 'center', gap: 6,
        boxShadow: '0 6px 14px rgba(244,123,123,0.35), inset 0 1px 0 rgba(255,255,255,0.20)',
        fontFamily: 'inherit',
        animation: 'sos-pulse 2.4s ease-in-out infinite',
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 22h20L12 2z" fill="#fff"/>
          <path d="M12 10v4M12 17.5v.5" stroke={T.danger} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        SOS
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom Navigation
// ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { k: 'home',      label: 'Inicio',     icon: <path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none"/> },
  { k: 'chat',      label: 'Chat',       icon: <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none"/> },
  { k: 'community', label: 'Comunidad',  icon: <g><circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" fill="none"/><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M14 20c0-2.4 1.8-4 4-4s4 1.6 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/></g> },
  { k: 'resources', label: 'Recursos',   icon: <path d="M4 4h11l3 3v13H4V4zM4 4v16M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none"/> },
  { k: 'calendar',  label: 'Calendario', icon: <g><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></g> },
];

function BottomNav({ tab, setTab }) {
  return (
    <div style={{
      flexShrink: 0,
      padding: '8px 8px 12px',
      background: 'rgba(10,11,20,0.92)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid ${T.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      position: 'relative', zIndex: 5,
    }}>
      {NAV_ITEMS.map(it => {
        const active = tab === it.k;
        return (
          <button key={it.k} onClick={() => setTab(it.k)} style={{
            flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '8px 4px 6px', borderRadius: 14,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active ? T.accent : T.textTer,
            transition: 'color 280ms cubic-bezier(.22,1,.36,1)',
            position: 'relative',
            fontFamily: 'inherit',
          }}>
            <div style={{
              position: 'relative',
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: active ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'transform 360ms cubic-bezier(.22,1,.36,1)',
            }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 14,
                background: active ? T.accentSoft : 'transparent',
                transform: active ? 'scale(1)' : 'scale(0.6)',
                opacity: active ? 1 : 0,
                transition: 'all 360ms cubic-bezier(.22,1,.36,1)',
              }}/>
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ position: 'relative' }}>
                {it.icon}
              </svg>
            </div>
            <div style={{
              fontSize: 9.5, fontWeight: active ? 600 : 500, letterSpacing: 0.1,
            }}>{it.label}</div>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App Shell
// ─────────────────────────────────────────────────────────────
function App() {
  const [tab, setTab] = useStateT('home');
  const [sosOpen, setSosOpen] = useStateT(false);
  const [mood, setMood] = useStateT(4);

  const weekData = [
    { day: 'L', mood: 3 },
    { day: 'M', mood: 2 },
    { day: 'M', mood: 4 },
    { day: 'J', mood: 4 },
    { day: 'V', mood: 3 },
    { day: 'S', mood: 5 },
    { day: 'D', mood: mood || 4 },
  ];

  // Mood log for May 2026
  const moodLog = { 1: 3, 2: 4, 3: 5, 4: 3, 5: 2, 6: 3, 7: 4, 8: mood || 4 };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: T.bg, color: T.text,
      position: 'relative', overflow: 'hidden',
      fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
    }}>
      {/* ambient glows */}
      <div style={{
        position: 'absolute', top: -120, left: -80, width: 320, height: 320,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(110,91,255,0.18), transparent 70%)',
        filter: 'blur(8px)',
      }}/>
      <div style={{
        position: 'absolute', bottom: 80, right: -100, width: 280, height: 280,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(244,180,156,0.10), transparent 70%)',
        filter: 'blur(6px)',
      }}/>

      <TopHeader tab={tab} onSOS={() => setSosOpen(true)}/>

      {/* tab content */}
      <div style={{
        flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1,
      }}>
        {['home','chat','community','resources','calendar'].map(k => (
          <div key={k} style={{
            position: 'absolute', inset: 0,
            opacity: tab === k ? 1 : 0,
            transform: `translateX(${tab === k ? 0 : (k < tab ? -10 : 10)}px)`,
            transition: 'opacity 360ms cubic-bezier(.22,1,.36,1), transform 460ms cubic-bezier(.22,1,.36,1)',
            pointerEvents: tab === k ? 'auto' : 'none',
            overflow: k === 'chat' ? 'hidden' : 'auto',
            display: 'flex', flexDirection: 'column',
          }}>
            {k === 'home'      && <HomeTab mood={mood} setMood={setMood} weekData={weekData}/>}
            {k === 'chat'      && <ChatApp/>}
            {k === 'community' && <CommunityTab/>}
            {k === 'resources' && <ResourcesTab/>}
            {k === 'calendar'  && <CalendarTab moodLog={moodLog}/>}
          </div>
        ))}
      </div>

      <BottomNav tab={tab} setTab={setTab}/>

      <SOSModal open={sosOpen} onClose={() => setSosOpen(false)}/>
    </div>
  );
}

window.App = App;
