// app/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import './styles/globals.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head />
      <body>
        {/* Wrap children with SessionProvider to handle authentication */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
