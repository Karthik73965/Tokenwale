import { fetchtxns } from '@/actions/HomeActions';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Transaction = {
    createdAt: string;
    updatedAmount: number;
};

const MiningChart: React.FC = () => {
    const { data: session } = useSession();
    const [userTransactions, setUserTransactions] = useState<any[]>([]);
    const [transactionData, setTransactionData] = useState<any[]>([]);
    //@ts-ignore
    const userId = session?.user?.id || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userTxns = await fetchtxns(userId);
                setUserTransactions(userTxns || []);

                // Data validation (optional)
                const validTransactions = userTxns.map(
                    (tx) => tx.transaction
                );

                setTransactionData(validTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                // Handle error gracefully, e.g., display an error message to the user
            }
        };

        if (session?.user) {
            fetchData();
        }
    }, [userId, session?.user]);

    return (
        <main className='bg-[#28282899] overflow-y-scroll no-scrollbar max-w-[1400px] mt-10 p-5 rounded-lg'>
            <section className='justify-between'>
                <h1 className='text-[40px]'>Mining History</h1><br />
                <div>
                    <ResponsiveContainer width={900} height={300}>
                        <LineChart data={transactionData}>
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(createdAt) => new Date(createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                                type="category"
                            />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(value) => new Date(value).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            />
                            <Line type="monotone" dataKey="updatedAmount" stroke="#38F68F" connectNulls />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </main>
    );
};

export default MiningChart;
