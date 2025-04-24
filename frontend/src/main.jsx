import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {HelmetProvider} from "react-helmet-async"
import {Provider} from "react-redux"
import { store } from './store/store.js'
import { presistor } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={presistor}>
        <HelmetProvider>
          <CssBaseline />
          <div onContextMenu={e => e.preventDefault()} >
            <App />
          </div>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
