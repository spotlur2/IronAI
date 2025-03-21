// app/layout.tsx

import React from 'react';
import './styles/globals.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI Gym Assistant</title>
      </head>
      <body>
        <header>
          <h1>IronAI</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
