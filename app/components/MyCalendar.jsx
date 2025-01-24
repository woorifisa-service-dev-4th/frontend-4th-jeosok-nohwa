'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { useRouter } from 'next/navigation';
import '../styles/custom-calendar.css';

function MyCalendar({ onClickDay = () => {}, ...props }) {
  const [value, onChange] = useState(new Date());
  const [mark, setMark] = useState([]);
  const router = useRouter();

  

  return (
    <div>
      <Calendar
       onChange={onChange}
       value={value}  
       locale="ko-KR"
       formatDay={(locale, date) => date.getDate().toString()}
       showNeighboringMonth={false} 
       onClickDay={onClickDay}
       {...props}
       calendarType="gregory"
       minDetail="decade" // 세기 뷰를 비활성화
       maxDetail="month"
       tileClassName={({ date }) => { // 일요일이면 'sunday' 클래스 추가
        if (date.getDay() === 0) {
          return 'sunday';
        }
        return '';
      }}
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
