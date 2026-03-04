/**
 * @module main
 * @description Application entry point. Mounts the React tree into the
 * `#root` DOM node defined in `index.html`, wrapped in `StrictMode`
 * for development-time checks.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
