import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/rootReducer.js'
import { DndProvider } from 'react-dnd';
import toast, { Toaster } from 'react-hot-toast';

import { HTML5Backend } from 'react-dnd-html5-backend';
const store = configureStore({
  reducer: rootReducer,
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <App />
        <Toaster/>
      </DndProvider>
    </Provider>
  </StrictMode>,
)
