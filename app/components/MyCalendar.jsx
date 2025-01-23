'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 스타일 파일 import

function MyCalendar() {
  const [value, onChange] = useState(new Date());

  return (
    <div>
      <Calendar
       onChange={onChange}
       value={value}  
       locale="ko-KR"
       formatDay={(locale, date) => date.getDate().toString()}/>
    </div>
  );
}

export default  MyCalendar;
