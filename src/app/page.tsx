"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { FetchUserInfo } from '@/actions/HomeActions'
import Transferlist from '@/components/home/Transferlist'
import MiningChart from '@/components/home/MiningChart'
import RecentlyTransfered from '@/components/home/RecentlyTransfered'

export default function Page() {
  const { data: session } = useSession()
  const [userinfo, setuserinfo] = useState<any>({})

  // @ts-ignore
  const id = session?.user.id ?? ""

  useEffect(() => {
    const effect = async () => {
      const things = await FetchUserInfo(id)
      setuserinfo(things)
    }
    if (session?.user) {
      effect()
    }
  }, [id , session?.user])

console.log(userinfo.tokenTxns)

  if (session?.user && userinfo) {
    return <main className='text-white px-[7vw] mt-10'>
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
        <Transferlist tokenTxns={userinfo.tokenTxns}/>
        <MiningChart/>
        <RecentlyTransfered />
      </section>
    </main>
  }else{
    return <div className='text-5xl font-bold'>Loggin to see the list</div>
  }


}
