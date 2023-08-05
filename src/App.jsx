import Weather from './pages/Weather'
import i18n from './i18next/i18next'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/:lang`} element={<Weather />} />
        <Route path="/" element={<Navigate to="/en/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
