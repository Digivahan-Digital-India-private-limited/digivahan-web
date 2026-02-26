import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { Footer } from './Footer'

function Layout() {
  return (
    <main className='w-full h-full'>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </main>
  )
}

export default Layout