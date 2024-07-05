"use server"
import prisma from "@/lib/prisma"

const currentDateTime = new Date().toISOString();

export const FetchUserInfo = async (id: string) => {
    try {
        const userinfo = await prisma.user.findFirst({
            where: { id }
        })
        console.log(userinfo)
        return userinfo
    } catch (error) {
        return null
    }
}

export const TransferToken = async (FromId: string, ToId: string, tokens: number) => {

    try {
        const FromUser = await FetchUserInfo(FromId)
        const ToUser = await FetchUserInfo(ToId)

        if (FromUser && ToUser) {
            const FromUserTokens = FromUser?.tokens || 0
            const FromUserTxns = FromUser?.tokenTxns
            const UpdatedFromUserTokens = FromUserTokens - tokens
            const UpdateFromUser = await prisma.user.update({
                where: { id: FromId },
                data: {
                    tokens: UpdatedFromUserTokens,
                    //@ts-ignore
                    tokenTxns: [...FromUserTxns, {
                        type: ToId,
                        amount: -tokens,
                        updatedAmount: UpdatedFromUserTokens,
                        timestamp: currentDateTime
                    }]
                }
            })
            console.log(UpdateFromUser, " updaring From user ...............")

            const ToUserTokens = ToUser?.tokens || 0
            const ToUserTxns = ToUser?.tokenTxns
            const UpdatedToUserTokens = ToUserTokens + tokens
            console.log(UpdatedFromUserTokens)
            const date = new Date().toISOString();

            const UpdatedToUser = await prisma.user.update({
                where: { id: ToId },
                data: {
                    tokens: UpdatedToUserTokens,
                    //@ts-ignore
                    tokenTxns: [...ToUserTxns, {
                        type: FromId,
                        amount: tokens,
                        updatedAmount: UpdatedToUserTokens,
                        timestamp: date
                    }]
                }
            })
            console.log(UpdatedToUser, " updaring to user ...............")
            const PushTxns = await prisma.txns.create({
                data: {
                    userId: FromId,
                    transaction: {
                        FromId,
                        FromUserName: FromUser?.username,
                        ToUserName: ToUser?.username,
                        ToId,
                        tokens
                    }
                }
            })
            console.log(PushTxns, "updating txns ")

            return {
                PushTxns,
                UpdatedToUser,
                UpdateFromUser
            }
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

export const RecentlyTransferedWallets = async (id: string) => {
    try {
        const txns = await prisma.txns.findMany({
            where: { userId: id }
        })
        return txns
    } catch (error) {
        console.log(error)
        return null
    }
}

export const AddFriend = async (fromid: string, toid: string, toname: string) => {
    try {
        const fromuserinfo = await FetchUserInfo(fromid)
        const touserinfo = await FetchUserInfo(toid)

        if (fromuserinfo && touserinfo) {
            const ToUserFriendList = touserinfo?.friendList
            const Friendlist = fromuserinfo?.friendList

            const Fromupdatedfriendlist = [{
                FriendId: toid,
                Name: toname,
                timestamp: currentDateTime
                //@ts-ignore
            }, ...Friendlist,]
            const ToUpdatedFriendlist = [{
                FriendId: fromid,
                Name: fromuserinfo?.username,
                timestamp: currentDateTime
                //@ts-ignore
            }, ...ToUserFriendList]
            const FromupdatedFriendlist = await prisma.user.update({
                where: { id: fromid },
                data: {
                    friendList: Fromupdatedfriendlist
                }
            })
            const TouserUpdate = await prisma.user.update({
                where: { id: toid },
                data: {
                    friendList: ToUpdatedFriendlist
                }
            })
            return true
        } else {
            return null
        }
    }
    catch (error) {
        console.log(error)
        return null
    }
}