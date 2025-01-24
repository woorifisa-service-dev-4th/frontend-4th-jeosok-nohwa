import React from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import { useRouter } from 'next/navigation';
import '../styles/custom-calendar.css';
import "../components/ui/modal/modal.css"; 
import '../styles/custom-calendar-modal.css';
import MyCalendar from "./MyCalendar";

// React-Calendar를 동적으로 로드 (SSR 방지)
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

const CalendarModal = ({ isOpen, onClose, selectedDate, onDateChange }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose(); // 모달 닫기 함수 호출
    }
  };

  const router = useRouter();
  
  // 날짜 클릭 이벤트 핸들러
  const handleDateClick = (date) => {
  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '-').replace('.', '').trim(); // "yyyy.mm.dd" 형식을 "yyyy-mm-dd"로 변환

  const searchParams = new URLSearchParams({ date: formattedDate });

  router.push(`/chat?${searchParams.toString()}`);
};

  

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {/* React Calendar */}
        <div className="modal-content">
          <MyCalendar 
          view="days" 
          minDetail="month" // 세기 뷰를 비활성화
          maxDetail="month"
          onClickDay={handleDateClick}
          onChange={onDateChange} 
          value={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
