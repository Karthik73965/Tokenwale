import React from 'react'

export default function page() {
  return (
    <>
    <div>page</div>
    {process.env.NEXTAUTH_URL}<div>----next auth url</div>
    <div>{process.env.NEXTAUTH_SECRET}----next secret</div>
   <div> {process.env.GOOGLE_CLIENT_ID}---client id </div>
   <div>{process.env.GOOGLE_CLIENT_SECRET} ----------Secret</div>
    </>
  )
}
