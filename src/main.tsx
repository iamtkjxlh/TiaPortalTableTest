import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import TableWithTree from './pages/TableWithTree.jsx'
import TableWithoutTree from './pages/TableWithoutTree.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/table-with-tree" element={<TableWithTree />} />
        <Route path="/table-without-tree" element={<TableWithoutTree />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
