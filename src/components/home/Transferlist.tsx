"use client"
import { useSession } from 'next-auth/react'
import React from 'react'
import { TransferNow } from './TransferNow'

type Props = {
    tokenTxns: Array<any>
}

export default function Transferlist({ tokenTxns }: Props) {
    const { data: session } = useSession()
    if (session?.user) {
        return (
            <>
                <main className='bg-[#28282899] overflow-y-scroll no-scrollbar max-w-[1400px] mt-10 p-5 rounded-lg'>
                    <section className='flex justify-between'>
                        <h1 className='text-[40px] '> Recent Transfer </h1>
                        <div className='underline text-[##FF5454]'>filter</div>
                    </section>
                    <section>
                        <div className='flex mb-5 justify-between mt-10'>
                            <div className='bg-[#414042] cursor-pointer  text-[#38F68F] rounded-lg text-center p-2 min-w-[400px]'>
                                UserId
                            </div>
                            <div className='bg-[#414042] cursor-pointer  text-[#38F68F] rounded-lg text-center p-2 min-w-[200px]'>
                                Amount
                            </div>
                            <div className='bg-[#414042]  cursor-pointer  text-[#38F68F] rounded-lg text-center p-2  min-w-[200px]' >
                                Date
                            </div>
                            <div className='bg-[#414042]  cursor-pointer  text-[#38F68F] rounded-lg text-center p-2  min-w-[200px]' >
                                Time
                            </div>
                        </div>

                        {
                            tokenTxns && tokenTxns.length > 0 ? (
                                tokenTxns.map((i, index) => (
                                    i.type !== "bonus" && (
                                    <div key={index}  className='flex mb-5 justify-between'>
                                        <div className='bg-[#414042] rounded-lg  cursor-pointer text-center p-2 min-w-[400px] text-white'>{i.type}</div>
                                        <div className='bg-[#414042] rounded-lg  cursor-pointer text-center p-2 min-w-[200px] text-white'>{i.amount}</div>
                                        <div className='bg-[#414042] rounded-lg  cursor-pointer text-center p-2  text-white min-w-[200px]'>{ new Date(i.timestamp).toLocaleDateString()}</div>
                                        <div className='bg-[#414042] rounded-lg  cursor-pointer text-center p-2  text-white min-w-[200px]'>{ new Date(i.timestamp).toLocaleTimeString()}</div>
                                    </div>
                                    )
                                ))
                            ) : (
                                <p className='text-white'>No transactions available</p>
                            )
                        }
                    </section>
                </main>
                <TransferNow/>
                            </>
        )
    }
    return null
}
