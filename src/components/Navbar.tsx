"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const state = session?.user
  return (
    <header className='flex flex-col sm:flex-row justify-between px-4 sm:px-[3vw] bg-[#282828] py-2 w-full'>
      <h1 className='flex gap-x-5 '>
        <div className='h-[50px] w-[50px] rounded-full bg-white'></div>
        <div className='text-[36px] text-white'>TOKENWALE</div>
      </h1>
      <section className='flex gap-x-5'>
        <div className='border rounded-md border-[#414042] h-[31px] grid my-2 bg-black text-center items-center w-[95px]'>
          Rules
        </div>
        <div className='border rounded-md border-[#414042] h-[31px] grid my-2 bg-black text-center items-center w-[95px]'>
          Rewards
        </div>
        {
          state ? <button className='text-red-700 text-xl' onClick={() => signOut({ callbackUrl: '/login' })}>
            Signout
          </button> : <Link href={'/login'} className='flex justify-between gap-x-5' >
            <div className='border rounded-md border-[#414042] h-[31px] grid my-2 bg-[#38F68F] text-black text-center items-center w-[95px]'>
              SignUp
            </div>
            <div className='border rounded-md border-[#414042] h-[31px] grid my-2 bg-black  text-[#38F68F] text-center items-center w-[95px]'>
              Login
            </div>
          </Link>
        }
      </section>
    </header>
  )
}
