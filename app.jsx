// app.jsx — Serena: companion app for student wellbeing

const { useState, useEffect, useRef, useLayoutEffect } = React;

// ─────────────────────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────────────────────
const T = {
  bg: '#0A0B14',
  bgSoft: '#11132080',
  surface: '#171A2A',
  surfaceHi: '#1F2238',
  border: 'rgba(255,255,255,0.06)',
  borderHi: 'rgba(255,255,255,0.10)',
  text: '#ECEDF6',
  textSec: 'rgba(236,237,246,0.62)',
  textTer: 'rgba(236,237,246,0.38)',
  accent: '#A89BFF',         // soft lavender
  accentDeep: '#6E5BFF',
  accentSoft: 'rgba(168,155,255,0.14)',
  warm: '#F4B49C',
  ok: '#7BD3B0',
  danger: '#F47B7B',
};

// ─────────────────────────────────────────────────────────────
// Emotion check-in
// ─────────────────────────────────────────────────────────────
const MOODS = [
  { id: 1, label: 'Muy mal',  hue: 'rgba(244,123,123,0.85)' },
  { id: 2, label: 'Bajo',     hue: 'rgba(244,180,156,0.85)' },
  { id: 3, label: 'Neutral',  hue: 'rgba(225,225,235,0.85)' },
  { id: 4, label: 'Bien',     hue: 'rgba(168,200,255,0.85)' },
  { id: 5, label: 'Excelente',hue: 'rgba(123,211,176,0.85)' },
];

function MoodFace({ id, size = 30, color = T.text, stroke = 1.8 }) {
  // A simple original line-drawn face that morphs by mood id (1..5)
  // Eyes: small arcs/dots; mouth: arc whose curvature scales with id
  const cx = 24, cy = 24;
  const eyeY = 19;
  // mouth control points
  const mouthY = 30;
  // curvature: id 1 -> -6 (frown), 3 -> 0 (flat), 5 -> +8 (smile)
  const curve = (id - 3) * 3.2;
  const mouth = `M 14 ${mouthY} Q 24 ${mouthY + curve} 34 ${mouthY}`;
  // eye style: id 1 closed-droop, id 5 happy-arch
  const eye = (x) => {
    if (id <= 2) return <path d={`M ${x-3.2} ${eyeY+1} Q ${x} ${eyeY-1.5} ${x+3.2} ${eyeY+1}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>;
    if (id >= 4) return <path d={`M ${x-3.2} ${eyeY+1} Q ${x} ${eyeY-2.5} ${x+3.2} ${eyeY+1}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>;
    return <circle cx={x} cy={eyeY} r={1.4} fill={color}/>;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block' }}>
      {eye(17.5)}
      {eye(30.5)}
      <path d={mouth} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

function MoodPicker({ selected, onSelect }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'stretch',
      gap: 8, padding: '6px 2px',
    }}>
      {MOODS.map(m => {
        const active = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              flex: 1, border: 'none', cursor: 'pointer',
              padding: '12px 6px 8px',
              background: active ? T.accentSoft : 'transparent',
              borderRadius: 18,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'background 320ms cubic-bezier(.22,1,.36,1), transform 280ms cubic-bezier(.22,1,.36,1)',
              transform: active ? 'translateY(-2px)' : 'translateY(0)',
              outline: active ? `1px solid ${T.borderHi}` : '1px solid transparent',
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 22,
              background: active ? `radial-gradient(circle at 30% 30%, ${m.hue}, rgba(255,255,255,0.04) 75%)` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 320ms cubic-bezier(.22,1,.36,1)',
            }}>
              <MoodFace id={m.id} size={26} color={active ? '#0A0B14' : T.text} stroke={2}/>
            </div>
            <div style={{
              fontSize: 10.5, letterSpacing: 0.1,
              color: active ? T.text : T.textSec,
              fontWeight: active ? 600 : 500,
              transition: 'color 240ms',
            }}>{m.label}</div>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chat
// ─────────────────────────────────────────────────────────────
function Bubble({ from, children, delay = 0 }) {
  const isUser = from === 'user';
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      animation: `bubble-in 520ms ${delay}ms cubic-bezier(.22,1,.36,1) both`,
    }}>
      <div style={{
        maxWidth: '78%',
        padding: '10px 14px',
        borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
        background: isUser
          ? 'linear-gradient(135deg, #7B6CFF 0%, #5B49E8 100%)'
          : T.surface,
        color: isUser ? '#fff' : T.text,
        fontSize: 15, lineHeight: 1.42, letterSpacing: -0.1,
        boxShadow: isUser
          ? '0 6px 16px rgba(91,73,232,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
          : `inset 0 0 0 1px ${T.border}`,
      }}>
        {children}
      </div>
    </div>
  );
}

function Typing({ delay = 0 }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-start',
      animation: `bubble-in 360ms ${delay}ms cubic-bezier(.22,1,.36,1) both`,
    }}>
      <div style={{
        padding: '12px 16px', borderRadius: '20px 20px 20px 6px',
        background: T.surface, display: 'flex', gap: 5, alignItems: 'center',
        boxShadow: `inset 0 0 0 1px ${T.border}`,
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: 3, background: T.textSec,
            animation: `dot-pulse 1100ms ${i * 140}ms cubic-bezier(.4,0,.6,1) infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
}

function ReferralCard({ onYes, onNo }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      animation: 'bubble-in 540ms 80ms cubic-bezier(.22,1,.36,1) both',
    }}>
      <div style={{
        alignSelf: 'flex-start', maxWidth: '88%',
        padding: '14px 16px', borderRadius: '20px 20px 20px 6px',
        background: `linear-gradient(160deg, ${T.surfaceHi} 0%, ${T.surface} 100%)`,
        boxShadow: `inset 0 0 0 1px ${T.borderHi}, 0 8px 24px rgba(110,91,255,0.10)`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
          fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase',
          color: T.accent, fontWeight: 600,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke={T.accent} strokeWidth="1.4"/><path d="M6 3v3l2 1.5" stroke={T.accent} strokeWidth="1.4" strokeLinecap="round" fill="none"/></svg>
          Sugerencia
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.45, color: T.text, marginBottom: 4 }}>
          He notado algunas cosas en lo que me cuentas que podrían beneficiarse de hablar con alguien con más experiencia. ¿Te gustaría agendar una sesión con un psicólogo de la universidad? Es gratis y confidencial.
        </div>
      </div>

      <div style={{
        alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 8,
        marginLeft: 6, width: '88%',
      }}>
        <button onClick={onYes} style={{
          padding: '12px 16px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #7B6CFF 0%, #5B49E8 100%)',
          color: '#fff', fontSize: 14, fontWeight: 600, letterSpacing: -0.1,
          boxShadow: '0 6px 16px rgba(91,73,232,0.30), inset 0 1px 0 rgba(255,255,255,0.20)',
          transition: 'transform 240ms cubic-bezier(.22,1,.36,1), box-shadow 240ms',
          fontFamily: 'inherit',
        }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >Me interesa</button>
        <button onClick={onNo} style={{
          padding: '12px 16px', borderRadius: 14, cursor: 'pointer',
          background: 'transparent', border: `1px solid ${T.borderHi}`,
          color: T.textSec, fontSize: 14, fontWeight: 500, letterSpacing: -0.1,
          transition: 'background 200ms, color 200ms',
          fontFamily: 'inherit',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = T.text; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textSec; }}
        >No, gracias — prefiero seguir platicando</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Privacy modal
// ─────────────────────────────────────────────────────────────
function PrivacyModal({ open, onAccept, onCancel }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
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
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      pointerEvents: open ? 'auto' : 'none',
    }}>
      {/* scrim */}
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(4,5,12,0.65)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 320ms cubic-bezier(.22,1,.36,1)',
      }}/>
      {/* sheet */}
      <div style={{
        position: 'relative', width: '100%',
        background: '#15172A',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '14px 22px 28px',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 460ms cubic-bezier(.22,1,.36,1)',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'rgba(255,255,255,0.18)', margin: '4px auto 18px',
        }}/>

        <div style={{
          width: 56, height: 56, borderRadius: 18,
          background: `linear-gradient(160deg, ${T.accent} 0%, ${T.accentDeep} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 0 16px', boxShadow: '0 12px 28px rgba(110,91,255,0.32)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, color: T.text, lineHeight: 1.2, marginBottom: 8, letterSpacing: -0.3 }}>
          Tu privacidad, tu decisión
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.5, color: T.textSec, marginBottom: 18 }}>
          Tu historial está cifrado y solo tú decides quién lo ve. Para preparar tu primera sesión, necesitamos tu consentimiento explícito para compartir un resumen reciente con el psicólogo asignado.
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)', borderRadius: 14,
          border: `1px solid ${T.border}`, padding: 14, marginBottom: 22,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {[
            { t: 'Solo los últimos 7 días', d: 'Resumen y patrones, no mensajes literales.' },
            { t: 'Únicamente tu psicólogo', d: 'Nadie más en la universidad puede acceder.' },
            { t: 'Revocable en cualquier momento', d: 'Puedes retirar el consentimiento desde Ajustes.' },
          ].map(item => (
            <div key={item.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 9, marginTop: 1,
                background: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke={T.accent} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13.5, color: T.text, fontWeight: 600, lineHeight: 1.3 }}>{item.t}</div>
                <div style={{ fontSize: 12.5, color: T.textSec, lineHeight: 1.4, marginTop: 1 }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onAccept} style={{
            padding: '14px 16px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #7B6CFF 0%, #5B49E8 100%)',
            color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: -0.1,
            boxShadow: '0 8px 20px rgba(91,73,232,0.32), inset 0 1px 0 rgba(255,255,255,0.18)',
            transition: 'transform 200ms cubic-bezier(.22,1,.36,1)',
            fontFamily: 'inherit',
          }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >Aceptar y compartir datos</button>
          <button onClick={onCancel} style={{
            padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
            background: 'transparent', border: 'none',
            color: T.textSec, fontSize: 14.5, fontWeight: 500, fontFamily: 'inherit',
          }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Confirmation toast (after consent)
// ─────────────────────────────────────────────────────────────
function ConfirmCard({ visible }) {
  return (
    <div style={{
      display: visible ? 'flex' : 'none',
      flexDirection: 'column', gap: 6,
      padding: '14px 16px', borderRadius: '20px 20px 20px 6px',
      background: `linear-gradient(160deg, rgba(123,211,176,0.18), rgba(123,211,176,0.06))`,
      border: '1px solid rgba(123,211,176,0.25)', alignSelf: 'flex-start', maxWidth: '88%',
      animation: visible ? 'bubble-in 540ms cubic-bezier(.22,1,.36,1) both' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 11, background: 'rgba(123,211,176,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="11" height="11" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke={T.ok} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 13, color: T.ok, fontWeight: 600 }}>Cita preparada</div>
      </div>
      <div style={{ fontSize: 14.5, color: T.text, lineHeight: 1.4 }}>
        Listo. Te llegará un correo con horarios disponibles esta semana. Mientras tanto, sigo aquí si necesitas algo.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Composer
// ─────────────────────────────────────────────────────────────
function Composer({ onSend, disabled }) {
  const [val, setVal] = useState('');
  const ref = useRef(null);
  const submit = () => {
    const t = val.trim();
    if (!t) return;
    onSend(t);
    setVal('');
    if (ref.current) ref.current.style.height = '24px';
  };
  return (
    <div style={{
      padding: '10px 12px 12px',
      background: `linear-gradient(180deg, rgba(10,11,20,0) 0%, ${T.bg} 30%)`,
      display: 'flex', alignItems: 'flex-end', gap: 8,
    }}>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-end', gap: 8,
        background: T.surface, borderRadius: 22,
        padding: '8px 8px 8px 16px',
        border: `1px solid ${T.border}`,
        transition: 'border 240ms',
      }}>
        <textarea
          ref={ref}
          rows={1}
          value={val}
          disabled={disabled}
          placeholder="Escríbele a Serena…"
          onChange={e => {
            setVal(e.target.value);
            const el = e.target;
            el.style.height = '24px';
            el.style.height = Math.min(el.scrollHeight, 96) + 'px';
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
          }}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: T.text, fontSize: 15, lineHeight: '24px',
            resize: 'none', padding: '4px 0', height: 24,
            fontFamily: 'inherit', letterSpacing: -0.1,
          }}
        />
        <button onClick={submit} disabled={!val.trim() || disabled} style={{
          width: 36, height: 36, borderRadius: 18, border: 'none', cursor: val.trim() ? 'pointer' : 'default',
          background: val.trim() ? 'linear-gradient(135deg, #7B6CFF, #5B49E8)' : 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 280ms, transform 220ms cubic-bezier(.22,1,.36,1)',
          transform: val.trim() ? 'scale(1)' : 'scale(0.92)',
          boxShadow: val.trim() ? '0 4px 12px rgba(91,73,232,0.35)' : 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" fill="none"
              stroke={val.trim() ? '#fff' : T.textTer}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chat sub-header — small, sits below the global TopHeader
// ─────────────────────────────────────────────────────────────
function ChatSubHeader() {
  return (
    <div style={{
      padding: '10px 18px 12px',
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 18,
        background: `linear-gradient(160deg, ${T.accent} 0%, ${T.accentDeep} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 14px rgba(110,91,255,0.30)',
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M9 2C5 2 2 5 2 9c4 0 7-3 7-7zM9 2c0 4 3 7 7 7 0-4-3-7-7-7zM9 16c-4 0-7-3-7-7 4 0 7 3 7 7zM9 16c0-4 3-7 7-7 0 4-3 7-7 7z"
            fill="#fff" opacity="0.95"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, color: T.text, fontWeight: 600, letterSpacing: -0.2 }}>Serena</div>
        <div style={{ fontSize: 11.5, color: T.ok, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: T.ok, boxShadow: '0 0 6px rgba(123,211,176,0.6)' }}/>
          En línea · Confidencial
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AI replies — light heuristic
// ─────────────────────────────────────────────────────────────
function aiReplyFor(text, msgIdx) {
  const t = text.toLowerCase();
  if (msgIdx === 0) {
    if (/triste|mal|llor|solo|sola|ansie|estres|estrés|nervios/.test(t)) {
      return 'Gracias por contarme — sé que abrir esto no es fácil. ¿Hay algo en particular que esté pesándote más esta semana?';
    }
    if (/bien|tranquila|tranquilo|content|alegr/.test(t)) {
      return 'Me alegra escucharlo. ¿Qué crees que está ayudando hoy? A veces vale la pena nombrarlo.';
    }
    return 'Te escucho. Cuéntame un poco más sobre lo que tienes en mente — vamos a tu ritmo.';
  }
  return 'Eso suena pesado. ¿Cómo te has estado cuidando entre tanto? Aunque sea cosas pequeñas.';
}

// ─────────────────────────────────────────────────────────────
// Main app
// ─────────────────────────────────────────────────────────────
function ChatApp() {
  const [messages, setMessages] = useState([
    { id: 'm0', from: 'ai', text: 'Hola, soy Serena. Estoy aquí para escucharte sin juicios. Cuéntame, ¿qué traes hoy?' },
  ]);
  const [typing, setTyping] = useState(false);
  const [referralShown, setReferralShown] = useState(false);
  const [referralResolved, setReferralResolved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);

  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, typing, referralShown, accepted]);

  const addMsg = (m) => setMessages(prev => [...prev, { ...m, id: 'm' + Date.now() + Math.random() }]);

  const onSend = (text) => {
    addMsg({ from: 'user', text });
    const newCount = userMsgCount + 1;
    setUserMsgCount(newCount);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      if (newCount >= 2 && !referralShown) {
        addMsg({ from: 'ai', text: aiReplyFor(text, newCount - 1) });
        setTimeout(() => {
          setTyping(true);
          setTimeout(() => {
            setTyping(false);
            setReferralShown(true);
          }, 1100);
        }, 700);
      } else {
        addMsg({ from: 'ai', text: aiReplyFor(text, newCount - 1) });
      }
    }, 1000);
  };

  const onReferralYes = () => {
    setReferralResolved(true);
    setModalOpen(true);
  };
  const onReferralNo = () => {
    setReferralResolved(true);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMsg({ from: 'ai', text: 'Entendido, aquí sigo para escucharte. ¿Por dónde quieres seguir?' });
    }, 700);
  };
  const onAccept = () => {
    setModalOpen(false);
    setAccepted(true);
    setTimeout(() => {
      addMsg({ from: 'system', text: 'consent' });
    }, 320);
  };
  const onCancel = () => {
    setModalOpen(false);
    // Revert resolution so user can pick again
    setTimeout(() => setReferralResolved(false), 360);
  };

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: T.bg, color: T.text,
      position: 'relative', overflow: 'hidden',
      fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
    }}>
      {/* ambient glow */}
      <div style={{
        position: 'absolute', top: -120, left: -80, width: 320, height: 320,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(110,91,255,0.18), transparent 70%)',
        filter: 'blur(8px)',
      }}/>
      <div style={{
        position: 'absolute', top: 220, right: -100, width: 280, height: 280,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(244,180,156,0.10), transparent 70%)',
        filter: 'blur(6px)',
      }}/>

      <ChatSubHeader/>

      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto', padding: '16px 14px 8px',
        display: 'flex', flexDirection: 'column', gap: 10,
        position: 'relative', zIndex: 1,
      }}>
        {messages.map((m, i) => {
          if (m.from === 'system' && m.text === 'consent') {
            return <ConfirmCard key={m.id} visible/>;
          }
          return <Bubble key={m.id} from={m.from}>{m.text}</Bubble>;
        })}
        {typing && <Typing/>}
        {referralShown && !referralResolved && (
          <ReferralCard onYes={onReferralYes} onNo={onReferralNo}/>
        )}
        <div style={{ height: 4 }}/>
      </div>

      <Composer onSend={onSend}/>

      <PrivacyModal open={modalOpen} onAccept={onAccept} onCancel={onCancel}/>
    </div>
  );
}

Object.assign(window, {
  ChatApp, T, MOODS, MoodFace, MoodPicker,
});
