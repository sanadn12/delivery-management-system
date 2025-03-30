import Navbar from '@/components/navbar/Navbar'
import AddOrder from '@/components/orders/addOrder'
import Orders from '@/components/orders/orders'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <AddOrder/>
        <Orders/>
    </div>
  )
}

export default page