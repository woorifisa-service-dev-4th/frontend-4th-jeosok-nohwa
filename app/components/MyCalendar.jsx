'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { useRouter } from 'next/navigation';

function MyCalendar() {
  const [value, onChange] = useState(new Date());
  const [mark, setMark] = useState([]);
  const router = useRouter();

  // 날짜 클릭 이벤트 핸들러
  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // 날짜를 yyyy-mm-dd 형식으로 변환
    router.push('/chat'); // 채팅 페이지로 이동
  };


  return (
    <div>
      <Calendar
       onChange={onChange}
       value={value}  
       locale="ko-KR"
       formatDay={(locale, date) => date.getDate().toString()}
       onClickDay={handleDateClick}
       tileContent={({ date, view }) =>
        mark?.includes(date.toISOString().split('T')[0]) ? (
          <div style={{ backgroundColor: 'red', borderRadius: '50%' }}>
            {date.getDate()}
          </div>
        ) : null
      }
    />
  </div>
);
}


export default  MyCalendar;
