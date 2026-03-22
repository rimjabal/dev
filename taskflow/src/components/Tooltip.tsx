import { useState, useLayoutEffect, useEffect, useRef } from 'react';

export default function Tooltip() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [useLayout, setUseLayout] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // useEffect version: flash can be visible because paint already happened.
  useEffect(() => {
    if (useLayout) return;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [useLayout]);

  // useLayoutEffect version: measure/update before paint.
  useLayoutEffect(() => {
    if (!useLayout) return;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [useLayout]);

  return (
    <div style={{ padding: '1rem 2rem', borderBottom: '1px solid #e8e8e8', background: '#fafafa' }}>
      <button
        onClick={() => {
          setPosition({ top: 0, left: 0 });
          setUseLayout((prev) => !prev);
        }}
      >
        Basculer : {useLayout ? 'useLayoutEffect' : 'useEffect'}
      </button>
      <br />
      <br />
      <button ref={buttonRef}>Survolez-moi</button>
      <div
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          background: position.top === 0 ? 'red' : '#333',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          transition: 'none',
          zIndex: 1000,
        }}
      >
        {position.top === 0 ? 'FLASH (0,0)' : 'Info-bulle positionnee !'}
      </div>
    </div>
  );
}