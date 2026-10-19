import React, { useEffect, useRef } from 'react';

export default function PageTransition({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('page-enter');
    const t = setTimeout(() => el.classList.remove('page-enter'), 500);
    return () => clearTimeout(t);
  }, []);
  return <div ref={ref}>{children}</div>;
}
