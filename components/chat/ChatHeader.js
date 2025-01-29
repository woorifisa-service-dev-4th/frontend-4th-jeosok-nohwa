'use client'
import Link from 'next/link';
import React, { useState } from "react";
import CalendarModal from "@/components/calendar/CalendarModal";
import { useRouter } from 'next/navigation';

const ChatHeader = ({ date }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const router = useRouter();
    
    const openModal = () => setIsModalOpen(true); 
    const closeModal = () => setIsModalOpen(false); 
    
    const handleDateChange = (date) => {
       setSelectedDate(date);
       closeModal(); 
    
        // 페이지 이동 (예: 날짜별 페이지로 이동)
        const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).replace(/\. /g, '-').replace('.', '').trim();
        const searchParams = new URLSearchParams({ date: formattedDate });

        router.push(`/chat?${searchParams.toString()}`);
     };

    console.log(date);
    return (

            <div className="flex items-center justify-between px-4 py-3 mt-14 bg-white w-[390px] mx-auto">
                <Link href="/home" className="text-mainGray hover:text-gray-900">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </Link>
                <button className="text-lg font-400 text-mainGray" onClick={openModal}>
                    {date}
                </button>
                <CalendarModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onDateChange={handleDateChange}
                />
                <div className="w-6"></div>
            </div>



    );
};

export default ChatHeader;
