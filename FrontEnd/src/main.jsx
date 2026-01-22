import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MediatorsProvider } from './context/MediatorsContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <MediatorsProvider>
      <App />
    </MediatorsProvider>
  // </StrictMode>,
)
