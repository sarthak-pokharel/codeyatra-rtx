import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './Dashboard'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProductionInfo from './Pages/ProductionInfo'
import BusinessDemands from './Pages/BusinessDemands'
import ProductionPost from './Pages/ProductionPost'
import BusinessDemandPost from './Pages/BusinessDemandCard'
import { QA } from './Pages/QA'
import { QAThread } from './Pages/QAThread'
import QANewPost from './Pages/QANewPost'
import Login from './Pages/Login'
import Registeration from './Pages/Registeration'
import { UserContext, UserProvider } from "./Pages/Contexts/UserContext.jsx";
import Profile from './Profile.jsx'
import Experts from './Pages/Experts.jsx'
import BusinessDemandPostForm from './Pages/BusinessDemandPostForm.jsx'

function App() {


  return (
    <>
      <UserProvider>
        <BrowserRouter>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registeration />} />

            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate to="production-posts" />} />
              <Route path="production-posts" element={<ProductionInfo />} />
              <Route path="production-posts/:id" element={<ProductionPost />} />
              <Route path="business-demands" element={<BusinessDemands />} />
              <Route path="business-demands/:id" element={<BusinessDemandPost />} />
              <Route path="qa" element={<QA />} />
              <Route path="qa/:id" element={<QAThread />} />
              <Route path="qa/new-post" element={<QANewPost />} />
              <Route path="profile" element={<Profile />} />
              <Route path="experts" element={<Navigate to="experts/profile" />} />
              <Route path="experts-list" element={<Experts />} />
              <Route path="create-new-businessdemand" element={<BusinessDemandPostForm />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
