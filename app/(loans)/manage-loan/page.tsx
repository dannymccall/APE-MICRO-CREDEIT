import React from 'react'
// import AllLoans from '@/app/ui/loans/users'
import dynamic from 'next/dynamic'

const AllLoans = dynamic(() => import( '@/app/ui/loans/Loans'))
const page = () => {
  return (
    <AllLoans />
  )
}

export default page