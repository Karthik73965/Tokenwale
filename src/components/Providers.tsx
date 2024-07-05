"use client"
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

interface props {
    children:ReactNode
}
export default function Providers(props:props) {
  return (
    <SessionProvider>
        {props.children}
    </SessionProvider>
  )
}
