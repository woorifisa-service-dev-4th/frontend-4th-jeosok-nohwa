'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import '../styles/custom-calendar.css';

function MyCalendar({ onClickDay = () => {}, ...props }) {
  const [value, onChange] = useState(new Date());

  const handleClickDay = (date) => {
    onClickDay(date); // 부모 컴포넌트에 선택된 날짜 전달
    onChange(date);   // 캘린더 상태 업데이트
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={value}  
        locale="ko-KR"
        formatDay={(locale, date) => date.getDate().toString()}
        showNeighboringMonth={false} 
        onClickDay={handleClickDay} // handleClickDay 함수로 변경
        {...props}
        calendarType="gregory"
        minDetail="decade"
        maxDetail="month"
        tileClassName={({ date }) => {
          if (date.getDay() === 0) {
            return 'sunday';
          }
          return '';
        }}
      />
    </div>
  );
}

export default MyCalendar;
