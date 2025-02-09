import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductionInfo from './Pages/ProductionInfo'
import BusinessDemands from './Pages/BusinessDemands'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} >
            <Route path="production-posts" element={<ProductionInfo />} />
            <Route path="business-demands" element={<BusinessDemands />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
