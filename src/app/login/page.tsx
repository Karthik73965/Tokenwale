"use client"
import LoginPage from '@/components/Login'
import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'


export default function Page() {
  const { data: session } = useSession()

  if (session && session.user) {
    redirect('/')
  }else{
    return  <main className='px-[5vw]'>
    <LoginPage/>
    </main>
  }
  
}
