import React, { useEffect } from 'react';
import { CompanyCanvasView } from './components/canvas/CompanyCanvasView';
import { initTheme } from './styles/theme';

export function App() {
  useEffect(() => {
    initTheme();
  }, []);

  return <CompanyCanvasView />;
}

export default App;
