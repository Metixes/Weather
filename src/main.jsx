import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import i18n from './i18next/i18next'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path={`/:lang/`} element={<App />} />
      <Route path="*" element={<Navigate to="/en/" replace />} />
    </Routes>
  </Router>
)
=======

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
>>>>>>> 83bb1cc59c3434c544d63dbd890e7b43dfd5b559
