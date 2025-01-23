'use client';

import React from 'react';

const TimelineItem = ({ time, description }) => {
  return (
    <div
      style={{
        width: '358px', // 고정 너비
        height: '96px', // 고정 높이
        backgroundColor: '#D9F7F3', // 배경색
        borderRadius: '20px', // 둥근 모서리
        padding: '15px', // 내부 여백
        display: 'flex', // 내용 정렬
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: 'Noto Sans KR', // 폰트 적용
        marginBottom: '10px', // 항목 간 간격
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
        {time}
      </div>
      <div style={{ fontSize: '14px', color: '#333' }}>{description}</div>
    </div>
  );
};

export default TimelineItem;
