import MyCalendar from '../components/MyCalendar';
import NavBar from "../components/nav-bar";
import Timeline from '../components/timeline/Timeline';

export default function Page() {
  const exampleEvents = [
    { time: '10:00-13:00', title:"Design new UX flow" ,imageSrc: '/image/random1.png' },
    { time: '14:00-15:00', title:"Design new UX flow",imageSrc: '/image/random2.png' },
    { time: '19:00-20:00',title:"Design new UX flow", imageSrc: '/image/random3.png' },
    { time: '09:00-10:00', title:"Design new UX flow", imageSrc: '/image/random2.png'},
    { time: '11:00-12:00',title:"Design new UX flow",imageSrc: '/image/random1.png' },
  ];
  
  return (
    <div>
      <MyCalendar/>
      <Timeline events={exampleEvents} /> {/* 예시 데이터 전달 */}
      <NavBar />
    </div>
  );
}

