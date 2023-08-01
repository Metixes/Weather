import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import i18n from './i18next/i18next'

console.log(i18n.language)
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/:lang' element={<App />} />
    </Routes>
  </Router>
)