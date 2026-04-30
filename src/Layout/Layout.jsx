import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { Footer } from './Footer'

function Layout() {
  return (
    <div className='w-full h-full'>
      <header>
        <Navbar/>
      </header>
      <main id='main-content' className='w-full h-full'>
        <section aria-label='Main page content'>
          <Outlet/>
        </section>
      </main>
      <Footer/>
    </div>
  )
}

export default Layout