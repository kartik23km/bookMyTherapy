import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * Wraps children with a scroll-triggered reveal animation.
 * direction: 'up' | 'left' | 'right' | 'scale'
 * delay: CSS transition-delay string e.g. '0.1s'
 */
export default function RevealSection({
  children,
  direction = 'up',
  delay = '0s',
  className = '',
  threshold = 0.1,
  as: Tag = 'div',
}) {
  const [ref, isVisible] = useScrollReveal({ threshold });

  const classMap = {
    up:    'reveal',
    left:  'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  };

  const revealClass = classMap[direction] || 'reveal';

  return (
    <Tag
      ref={ref}
      className={`${revealClass} ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </Tag>
  );
}
