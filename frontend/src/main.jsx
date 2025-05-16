import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import store,{persistor} from './store/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Loader } from 'lucide-react';
import { ThemeProvider, createTheme } from "@mui/material/styles"
const theme = createTheme()

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
    <PersistGate loading={<div className="flex items-center justify-center h-screen">
  <Loader className="animate-spin text-blue-600" size={48} />
</div>} persistor={persistor}>
<ThemeProvider theme={theme}>
     <Toaster position="top-right" reverseOrder={false} /> 
     <App />
     </ThemeProvider>
    </PersistGate>
    </Provider>

)
