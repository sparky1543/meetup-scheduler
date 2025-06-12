import React from 'react';

const Header = ({ title, subtitle, user }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {user && (
        <div className="user-info">
          <span>환영합니다, {user.nickname}님! 👋</span>
          <span className="user-number">#{user.userNumber}</span>
        </div>
      )}
    </div>
  );
};

export default Header;