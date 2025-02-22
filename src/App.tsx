import React from 'react';
import { Sidebar } from '@components/layout/Sidebar';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="knowledge-deck-theme">
      <div className="app">
        <Sidebar />
      </div>
    </ThemeProvider>
  );
}

export default App; 