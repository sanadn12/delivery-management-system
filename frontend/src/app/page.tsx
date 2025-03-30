import Assignments from '@/components/assignments/Assignments'
import Navbar from '@/components/navbar/Navbar'
import PartnersData from '@/components/Partners/PartnersData'
import React from 'react'

const page = () => {
  return (
    <div>

      <Navbar/>
      <PartnersData/>
      <Assignments/>
    </div>
  )
}

export default page