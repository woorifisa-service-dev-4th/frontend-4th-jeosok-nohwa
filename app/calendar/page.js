'use client';

import MyCalendar from '../components/MyCalendar';
import NavBar from '../components/nav-bar';
import Timeline from '../components/timeline/Timeline';

const CalendarPage = () => {
  // 예시 데이터
  const exampleEvents = [
    { time: '10:00-13:00', description: 'Design new UX flow' },
    { time: '14:00-15:00', description: 'Brainstorm with the team' },
    { time: '19:00-20:00', description: 'Workout with Ella' },
    { time: '09:00-10:00', description: 'Team Sync Meeting' },
    { time: '11:00-12:00', description: 'Client Call' },
  ];
  

  return (
    <div >
      <h1>Calendar Page</h1>
      <MyCalendar />
      <Timeline events={exampleEvents} /> {/* 예시 데이터 전달 */}
      <NavBar/>
    </div>
  );
};

export default CalendarPage;
