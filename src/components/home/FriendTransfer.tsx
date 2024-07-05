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
import { TransferToken } from "@/actions/HomeActions";
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface props {
    name: string,
    ToId: string,
    FromId: string
}

export function FriendTransfer({ name, ToId, FromId }: props) {
    const [tokens, setTokens] = useState(10);
    const [transferStatus, setTransferStatus] = useState("");



    const notify = (text: string) => toast.success(text, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await TransferToken(FromId, ToId, tokens);
        if (result) {
            setTransferStatus("Transfer successful!");
            notify("Transfered sucessfully ")

            setTimeout(() => {
                window.location.reload()
            }, 2000);
        } else {
            notify("Transfer failed. Please try again.");
            window.location.reload()
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className='text-black font-bold min-w-[300px]'>Transfer to <span className="underline">{name}</span></button>
            </DialogTrigger>
            <DialogContent className=" w-[80vw] opacity-[68%]  bg-[#383737] h-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-[40px] text-white">Transfer Tokens</DialogTitle>
                    <DialogDescription className="text-[#38F68F] text-xl">
                        Enter the details below to transfer tokens.
                    </DialogDescription>
                </DialogHeader>
                <center>
                    <form onSubmit={handleTransfer} >
                        <div className="grid items-center gap-4 py-4">
                            <center>
                                <div className="w-[177px] flex align-middle justify-center h-[177px] rounded-full bg-white"></div>
                                <h4 className="text-3xl text-[#38F68F] mt-5">Transfering to <span className="uppercase underline ">{name}</span></h4>
                                <h4 className="text-md text-white">Id :{ToId}</h4>
                                <div className="flex justify-center mt-10">
                                    <input
                                        id="tokens"
                                        type="number"
                                        value={tokens}
                                        min={1}
                                        required
                                        onChange={(e) => setTokens(Number(e.target.value))}
                                        className="h-[100p] w-[100px] outline-none  bg-transparent text-[#FF5454] font-bold text-3xl"
                                        inputMode="numeric"
                                    />
                                    <div className=" text-3xl text-[#FF5454] font-bold">
                                        Tokens
                                    </div>
                                </div>
                            </center>
                        </div>
                        <button type="submit" onClick={() => handleTransfer} className="bg-[#38F68F] text-black font-bold w-[300px] h-[50px]  mt-7 px-4 py-2 rounded">
                            Transfer
                        </button>
                    </form>
                </center>
            </DialogContent>
        </Dialog>
    );
}
