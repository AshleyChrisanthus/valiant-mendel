import React, { useEffect } from 'react';
import { CompanyCanvasView } from './components/canvas/CompanyCanvasView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initTheme } from './styles/theme';

export function App() {
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <ErrorBoundary>
      <CompanyCanvasView />
    </ErrorBoundary>
  );
}

export default App;
