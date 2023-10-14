import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import "normalize.css";
createRoot(document.getElementById('root') as Element).render(
    <StrictMode>
        <App />
    </StrictMode>
    // <App />
)