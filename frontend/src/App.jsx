import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import {BrowserRouter} from 'react-router-dom'
import Hero from './Components/Hero'
import Features from './Components/Features'
import HowitWorks from './Components/HowitWorks'
import Testimonials from './Components/Testimonials'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Hero />
      <Features />
      <HowitWorks />
      <Testimonials />
    </BrowserRouter>
  )
}

export default App
