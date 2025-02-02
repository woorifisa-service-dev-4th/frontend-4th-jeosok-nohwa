
"use client";

import { BellIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function CommonHeader({ selectedDate }) {
    const router = useRouter();
    const pathname = usePathname();
    const getTodayDate = () => new Date().toLocaleDateString("en-CA");
    // 날짜 클릭 이벤트 핸들러
    const handleDateClick = () => {
        if (!selectedDate) {
            selectedDate = getTodayDate();
        }

        console.log("📌 Using selectedDate in handleDateClick:", selectedDate);
        const searchParams = new URLSearchParams({ date: selectedDate });
        router.push(`/chat?${searchParams.toString()}`);
    };

    return (
        <header className="fixed flex items-center justify-between top-0 w-full max-w-[390px] p-2 bg-white z-10">
            <Link href="/home">
                <Image
                    className="m-1 translate-y-[3px]"
                    src="/image/jeosok-nohwa-logo.png"
                    alt=""
                    width={40}
                    height={40}
                />
            </Link>

            <div className="flex items-center space-x-2 mt-2 ml-2 px-2">
                <div className="flex flex-col items-center justify-center group">
                    {pathname === "/chat" ? (
                        <ChatBubbleOvalLeftIcon
                            className="w-9 h-9 fill-[#D9F7F3] stroke-[#b1f1e8] stroke-[0.5] translate-y-[-1px]"
                        />
                    ) : (
                        <ChatBubbleOvalLeftIcon
                            className="w-9 h-9 stroke-gray-950 hover:stroke-[#b1f1e8] hover:fill-[#D9F7F3] stroke-[0.5] translate-y-[-1px] group-hover:fill-[#D9F7F3] group-hover:stroke-[#b1f1e8]"
                            onClick={handleDateClick}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}
