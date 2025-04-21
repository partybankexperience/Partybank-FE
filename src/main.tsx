import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './Pages/onboarding/Login.tsx';
import Signup from './Pages/onboarding/Signup.tsx';
import PrivateRoute from './utils/Privateroute.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/signup" element={<PrivateRoute><Signup />
        </PrivateRoute>} />
    </Routes>    
    </BrowserRouter>
  </StrictMode>,
)
