"use client"
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FetchUserInfo, TransferToken } from "@/actions/HomeActions";
import { useSession } from "next-auth/react";
import { AddFriend } from "@/actions/HomeActions";
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export function Addfrined({ }) {
    const { data: session } = useSession()
    const [id, setid] = useState("");
    const [friendinfo, setfriendinfo] = useState<any>(null)
    const [status, setstatus] = useState<any>(null)




    const notify = () => toast.success("Addeed succesfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });

    // @ts-ignore
    const fromid = session?.user.id || ""

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await FetchUserInfo(id);
        if (result) {
            setstatus("Friend Found")
            setfriendinfo(result)
        } else {
            setfriendinfo(null)
            setstatus("Invalid Id ")
        }
        // alert(result)
        // if (result) {
        //     setstatus("Transfer successful!");
        //     setTimeout(() => { window.location.reload() }, 2000)

        // } else {
        //     setstatus("Transfer failed. Please try again.");
        //     setTimeout(() => { window.location.reload() }, 2000)
        // }
    };
    const handleAddFriend = async (friendid: string, friendname: string) => {
        try {
            const update = await AddFriend(fromid, friendid, friendname)
            notify()
            setTimeout(() => { window.location.reload() }, 2000)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog>
            <ToastContainer />
            <DialogTrigger asChild>
                <button className='text-[#FF5454] underline'>Add Friend</button>
            </DialogTrigger>
            <DialogContent className="w-[1193px] opacity-[68%] bg-[#383737] h-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-[40px] text-white">Add Friend</DialogTitle>
                    <DialogDescription className="text-[#38F68F] text-xl">
                        Ask your friend their Id and enter below .
                    </DialogDescription>
                </DialogHeader>
                <center>
                    <form onSubmit={handleTransfer} >
                        <div className="grid items-center gap-4 py-4">
                            <center>
                                <div className=" text-xl text-[#FF5454] underline font-bold">
                                    Enter Your Friend Id here
                                </div>
                                <div className="flex justify-center mt-10">
                                    <input
                                        id="tokens"
                                        type="text"
                                        value={id}
                                        min={1}
                                        required
                                        onChange={(e) => setid(() => (e.target.value))}
                                        className="h-[100p]  outline-none border w-full border-gray-300 p-2 rounded-xl  bg-transparent text-[#FF5454] font-bold text-xxl"
                                    />
                                </div>
                            </center>
                        </div>
                        <button type="submit" onClick={() => handleTransfer} className="bg-[#38F68F] text-black font-bold w-[300px] h-[50px]  mt-7 px-4 py-2 rounded">
                            fetch
                        </button>
                    </form>
                </center>
                {friendinfo && status && friendinfo != null ? <div>
                    <p className="text-[#38F68F] text-xl "> Id: <span className="text-[#FF5454] ">{friendinfo.id || "invalid userid"}</span></p>
                    <p className="text-[#38F68F] text-xl "> Name :<span className="text-[#FF5454]">{friendinfo.username || "invalid userid"}</span></p>
                    <button type="button" onClick={() => handleAddFriend(friendinfo.id, friendinfo.username)} className="bg-[#38F68F] text-black font-bold w-[300px] h-[50px]  mt-7 px-4 py-2 rounded">
                        Add Friend Info
                    </button>
                </div> : <div>{status}</div>
                }
            </DialogContent>
        </Dialog>
    );
}
