"use client"

import React, { useState } from 'react'
import Navbar from '@/app/ui/navbar/Navbar'
const NavbarComponent = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  return (
    <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
  )
}

export default NavbarComponent