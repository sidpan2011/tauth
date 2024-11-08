import React from 'react';

const MagicalText = ({ text, as = 'div' }) => {
  const Element = as;

  return (
    <Element 
      className="inline-block font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-y bg-[length:200%_auto]"
      style={{
        backgroundSize: '200% 200%', // Changed to cover full height
        animation: 'gradient 3s linear infinite',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        padding: '0.05em 0',
        display: 'inline-block',
        lineHeight: '1.1',
      }}
    >
      {text}
    </Element>
  );
};

export default MagicalText;