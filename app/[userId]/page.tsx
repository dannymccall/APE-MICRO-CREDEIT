import React from 'react'

interface Props {
    params: Promise<{userId: string}>
}

const page:React.FC<Props> = async({params}) => {
    const userId = (await params).userId
  return (
    <div><p>{userId}</p></div>
  )
}

export default page