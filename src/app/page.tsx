"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { FetchUserInfo } from '@/actions/HomeActions'
import Transferlist from '@/components/home/Transferlist'
import MiningChart from '@/components/home/MiningChart'
import RecentlyTransfered from '@/components/home/RecentlyTransfered'

export default function Page() {
  const { data: session } = useSession()
  const [userinfo, setUserInfo] = useState<any>({})
  
  //@ts-ignore
  const id = session?.user.id

  useEffect(() => {
    const effect = async () => {
      if (session?.user) {
        const userData = await FetchUserInfo(id)
        setUserInfo(userData)
      }
    }
   
    effect()
    
  }, [session?.user])

  console.log(userinfo.tokenTxns)

  if (session?.user && userinfo?.id) {
    return (
      <main className='text-white px-[7vw] mt-10'>
        <section className='flex justify-between'>
          <div>
            <div className='text-5xl'>Wallet</div>
            <div className='text-3xl text-[#EF1818]'>
              {userinfo.tokens} tokens
            </div>
          </div>
          <div className='text-right'>
            <div className='text-[20px] text-[#38F68F]'>{userinfo.id}</div>
            <div className='text-[20px] text-[#38F68F]'>{userinfo.username}</div>
            <div>Show QR</div>
          </div>
        </section>
        <section>
          <Transferlist tokenTxns={userinfo.tokenTxns} />
          <MiningChart />
          <RecentlyTransfered />
        </section>
      </main>
    )
  } else {
    return <div className='text-5xl font-bold'>Log in to see the list</div>
  }
}
