"use client"
import { FetchUserInfo, RecentlyTransferedWallets } from '@/actions/HomeActions'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { FriendTransfer } from './FriendTransfer'
import { Addfrined } from './AddFriends'



export default function RecentlyTransfered({ }) {
    const { data: session } = useSession()
    const [wallets, setwallets] = useState<any>([])
    //@ts-ignore
    const userid = session?.user.id || ""
    useEffect(() => {
        const fetchwallets = async () => {
            let things = await FetchUserInfo(userid)
            //@ts-ignore
            setwallets(things.friendList)
        }
        if (session?.user) {
            fetchwallets()
        }
    }, [userid, session?.user])
    if (session?.user) {
        return (
            <>
                <main className='bg-[#28282899]  overflow-y-scroll no-scrollbar max-w-[1400px] mt-10 p-5 rounded-lg'>
                    <section className='flex justify-between  mb-5 sticky'>
                        <h1 className='text-[40px] '> Recently transferred wallets</h1>
                    </section>
                    <section>
                        <div className='flex mb-5 gap-x-10'>
                            <div className='bg-[#414042] cursor-pointer  text-[#38F68F] rounded-lg text-center p-2 min-w-[300px]'>
                                Name
                            </div>
                        </div>
                        {
                            wallets && wallets.length > 0 ? (
                                wallets.map((i: any, index: number) => (
                                    <div key={index} className='flex gap-x-10'>
                                        <div className='bg-[#414042] rounded-lg  mb-5 cursor-pointer text-center p-2 min-w-[300px] text-white'>{i.Name}</div>
                                        <div className='bg-[#38F68F] rounded-lg  mb-5 cursor-pointer text-center p-2 text-black'><FriendTransfer name={i.Name} ToId={i.FriendId} FromId={userid} /></div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-white'>No transactions available</p>
                            )
                        }
                    </section>
                </main>
                <div className=' underline'><Addfrined /></div>
            </>
        )
    }
    return null
}
