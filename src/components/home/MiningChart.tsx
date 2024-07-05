"use client"
import { FetchUserInfo } from '@/actions/HomeActions'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


type Props = {}

export default function MiningChart({ }: Props) {
    const { data: session } = useSession()
    const [userinfo, setuserinfo] = useState<any>({})
    //@ts-ignore
    const userid = session?.user.id || ""

    useEffect(() => {
        const fetchinguser = async () => {
            const user = await FetchUserInfo(userid)
            //@ts-ignore
            setuserinfo(user.tokenTxns)
        }
        if (session?.user) {
            fetchinguser()
        }
    }, [userid, session?.user])
    console.log(userinfo)
    return (
        <>
            <main className='bg-[#28282899]  overflow-y-scroll no-scrollbar max-w-[1400px] mt-10 p-5 rounded-lg'>
                <section className=' justify-between'>
                    <h1 className='text-[40px] '>Mining History</h1><br />
                    <div>
                        <LineChart width={1000} height={300} data={userinfo}>
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) =>
                                    new Date(timestamp).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                } 

                            />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="updatedAmount"
                                stroke="#38F68F"
                                connectNulls
                            /> 
                        </LineChart>

                    </div>
                </section>
            </main>
            <div className='text-[#FF5454] underline'>see all </div>
        </>
    )
}