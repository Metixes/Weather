import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
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