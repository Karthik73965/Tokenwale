"use server"
import prisma from "@/lib/prisma"

const currentDateTime = new Date().toISOString();

export const FetchUserInfo = async (id: string) => {
    try {
        const userinfo = await prisma.user.findFirst({
            where: { id }
        })
        return userinfo
    } catch (error) {
        return null
    }
}

export const TransferToken = async (FromId: string, ToId: string, tokens: number) => {
    try {
        const FromUser = await FetchUserInfo(FromId);
        const ToUser = await FetchUserInfo(ToId);

        if (FromUser && ToUser) {
            const UpdatedFromUserTokens = FromUser.tokens - tokens;
            const UpdatedToUserTokens = ToUser.tokens + tokens;

            // Update FromUser's tokens and create a token transaction
            const UpdateFromUser = await prisma.user.update({
                where: { id: FromId },
                data: {
                    tokens: UpdatedFromUserTokens,
                    tokenTxns: {
                        create: {
                            transaction: {
                                type: ToId,
                                amount: -tokens,
                                updatedAmount: UpdatedFromUserTokens,
                                timestamp: currentDateTime,
                            },
                        },
                    },
                },
            });

            // Update ToUser's tokens and create a token transaction
            const UpdatedToUser = await prisma.user.update({
                where: { id: ToId },
                data: {
                    tokens: UpdatedToUserTokens,
                    tokenTxns: {
                        create: {
                            transaction: {
                                type: FromId,
                                amount: tokens,
                                updatedAmount: UpdatedToUserTokens,
                                timestamp: currentDateTime,
                            },
                        },
                    },
                },
            });

            // Create a transaction record
            const PushTxns = await prisma.transaction.create({
                data: {
                    userId: FromId,
                    transaction: {
                        FromId,
                        FromUserName: FromUser.username,
                        ToUserName: ToUser.username,
                        ToId,
                        tokens,
                    },
                },
            });

            return {
                PushTxns,
                UpdatedToUser,
                UpdateFromUser,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const RecentlyTransferedWallets = async (id: string) => {
    try {
        const txns = await prisma.tokenTransaction.findMany({
            where: {
                userId: id,
            },
            orderBy: {
                createdAt: 'desc', // Order by most recent transactions
            },
        });
        return txns;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const AddFriend = async (fromId: string, toId: string, toName: string) => {
    try {
        const fromUserInfo = await FetchUserInfo(fromId);
        const toUserInfo = await FetchUserInfo(toId);

        if (fromUserInfo && toUserInfo) {
            await prisma.friend.create({
                data: {
                    userId: fromId,
                    friendId: toId,
                    name: toName,
                    createdAt: currentDateTime,
                },
            });

            await prisma.friend.create({
                data: {
                    userId: toId,
                    friendId: fromId,
                    name: fromUserInfo.username,
                    createdAt: currentDateTime,
                },
            });

            return true;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const fetchtxns = async (userId: string) => {
    try {
        const data = await prisma.tokenTransaction.findMany({
            where: { userId }
        })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}

export const fetchfrineds = async (userId:string)=>{
    try {
        const data = await prisma.friend.findMany({
            where:{userId}
        })
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}