import { useEffect, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  className?: string;
  animateOnHover?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$@!%&*';

export function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  className = '',
  animateOnHover = false,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (sequential) {
              if (index < iteration) return text[index];
            } else {
              if (iteration >= maxIterations) return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      iteration += 1 / 3;

      if (iteration >= (sequential ? text.length : maxIterations)) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, sequential, isHovered]);

  return (
    <span
      className={className}
      onMouseEnter={() => animateOnHover && setIsHovered(prev => !prev)}
    >
      {displayText}
    </span>
  );
}
