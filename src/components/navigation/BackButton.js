import React from 'react';

const BackButton = ({ onClick, children = '뒤로가기' }) => {
  return (
    <button onClick={onClick} className="back-button">
      ← {children}
    </button>
  );
};

export default BackButton;