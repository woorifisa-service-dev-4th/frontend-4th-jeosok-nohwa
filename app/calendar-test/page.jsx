"use client";

import React, { useState } from "react";
import CalendarModal from "@/app/components/CalendarModal";
import { useRouter } from 'next/navigation';

const CalendarPage = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const router = useRouter();

  const openModal = () => setIsModalOpen(true); // 모달 열기
  const closeModal = () => setIsModalOpen(false); // 모달 닫기

  const handleDateChange = (date) => {
    setSelectedDate(date); // 선택한 날짜 업데이트
    closeModal(); // 모달 닫기

    // 페이지 이동 (예: 날짜별 페이지로 이동)
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    router.push(`/chat/${formattedDate}`); // /date/2025-01-01 과 같은 경로로 이동
  };

  return (
    <div>
      <p>
        선택된 날짜: {selectedDate ? selectedDate.toDateString() : "없음"}
      </p>
      <button onClick={openModal}>날짜 선택</button>

      {/* CalendarModal 컴포넌트 */}
      <CalendarModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default CalendarPage;
