"use client"
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function SigInButton() {
    const { data: session } = useSession()
    if (session && session.user) {
        console.log(session, " ---------- session ")
        //@ts-ignore
        console.log(session.user.name || session.user?.username, " ---------- session user ")
        return (
            <>
                <button className='text-red-700 text-4xl' onClick={() => signOut({ callbackUrl: '/login' })}>
                    Signout
                </button>

            </>
        )
    }
    return <button onClick={() => signIn()}  >
        SignIn
    </button>


}
