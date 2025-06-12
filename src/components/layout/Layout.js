import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="container">
      <div className="mobile-wrapper">
        {children}
      </div>
    </div>
  );
};

export default Layout;