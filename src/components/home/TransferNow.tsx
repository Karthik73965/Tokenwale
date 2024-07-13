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
import { useSession } from "next-auth/react";

export function TransferNow() {
    const { data: session } = useSession();

    //@ts-ignore
    const fromId = session?.user.id;
    const [toId, setToId] = useState("");
    const [tokens, setTokens] = useState(10);
    const [transferStatus, setTransferStatus] = useState("");

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fromId) {
            setTransferStatus("Error: User not logged in.");
            return;
        }

        if (!toId || tokens <= 0) {
            setTransferStatus("Error: Please fill in all fields correctly.");
            return;
        }

        const result = await TransferToken(fromId, toId, tokens);

        if (result) {
            setTransferStatus("Transfer successful!");
            // Reload the page or update state as necessary
        } else {
            setTransferStatus("Transfer failed. Please try again.");
            // Reload the page or update state as necessary
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className='text-[#FF5454] underline'>Transfer Now</button>
            </DialogTrigger>
            <DialogContent className="w-[1193px] bg-[#383737] h-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-[40px] text-white">Transfer Tokens</DialogTitle>
                    <DialogDescription className="text-[#38F68F] text-xl">
                        Enter the details below to transfer tokens.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleTransfer}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="toId" className="text-right text-xl text-white">
                                To ID
                            </label>
                            <input
                                id="toId"
                                type="text"
                                value={toId}
                                onChange={(e) => setToId(e.target.value)}
                                className="col-span-3 outline-none bg-transparent text-xl p-2 border-slate-300 border-2 rounded-lg text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="tokens" className="text-right text-xl text-white">
                                Tokens
                            </label>
                            <input
                                id="tokens"
                                type="number"
                                value={tokens}
                                onChange={(e) => setTokens(Number(e.target.value))}
                                className="col-span-3 outline-none p-2 border-slate-300 border-2 rounded-lg text-white bg-transparent"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Transfer Now
                        </button>
                    </DialogFooter>
                </form>
                {transferStatus && <p className="text-white mt-4">{transferStatus}</p>}
            </DialogContent>
        </Dialog>
    );
}
