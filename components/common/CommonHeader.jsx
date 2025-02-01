"use client";

import { BellIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function CommonHeader() {
    const router = useRouter();
    const pathname = usePathname(); // 현재 경로 가져오기
    const [active, setActive] = useState("/"); // 기본 선택 상태를 "/"로 설정
    const getTodayDate = () => new Date().toLocaleDateString("en-CA");
    const [selectedDate, setSelectedDate] = useState(() => {
        if (typeof window !== "undefined") {
            const storedDate = localStorage.getItem("selectedDate");
            const todayDate = getTodayDate();
            if (!storedDate || storedDate < todayDate){
                localStorage.setItem("selectedDate", todayDate);
                return todayDate;
            }
            return todayDate;
        }
        return new Date().toLocaleDateString("en-CA");
    });

    // 날짜 클릭 이벤트 핸들러
    const handleDateClick = () => {
        const today = new Date();
        const formattedDate = today
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "")
            .trim(); // "yyyy.mm.dd" 형식을 "yyyy-mm-dd"로 변환
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
            {/* 오른쪽 아이콘들 pathname !== "/chat" && */}
            { ( // 현재 경로가 "/chat"이 아닐 때만 렌더링
                <div className="flex items-center space-x-2 mt-2 ml-2 px-2">
                    {/* 알림 아이콘
                                         <Link href="/notifications">
                        <div className="flex flex-col items-center justify-center mt-1">
                            {pathname === "/notifications" || active === "/notifications" ? (
                                <BellIcon className="w-8 h-8 fill-[#D9F7F3] stroke-[#b1f1e8] stroke-[0.5]" />
                            ) : (
                                <BellIcon className="w-8 h-8 stroke-gray-950 hover:stroke-gray-900 stroke-[0.5] translate-y-0" />
                            )}
                        </div>
                    </Link>*/}


                    {/* 채팅 아이콘 */}
                    <div className="flex flex-col items-center justify-center group">
                        {pathname === "/chat" || active === "/chat" ? (
                            <ChatBubbleOvalLeftIcon
                                className="w-9 h-9 fill-[#D9F7F3] stroke-[#b1f1e8] stroke-[0.5] translate-y-[-1px]"/>
                        ) : (
                            <ChatBubbleOvalLeftIcon
                                className="w-9 h-9 stroke-gray-950 hover:stroke-[#b1f1e8] hover:fill-[#D9F7F3] stroke-[0.5] translate-y-[-1px] group-hover:fill-[#D9F7F3] group-hover:stroke-[#b1f1e8]"
                                onClick={handleDateClick}
                            />
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
