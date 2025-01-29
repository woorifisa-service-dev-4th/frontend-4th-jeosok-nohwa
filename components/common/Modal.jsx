'use client';

import React from "react";
import Image from "next/image"; // Next.js Image 컴포넌트 추가
import "./styles/modal.css"; // 추가 스타일 가져오기
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Modal = ({ isOpen, onClose, children, date }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* 헤더 */}
        <div className="modal-header">
          <div className="modal-logo-container">
            <Image
              src="/image/jeosok-nohwa-logo.png"
              alt="logo"
              width={40} // 버튼 크기와 동일한 너비
              height={40} // 버튼 크기와 동일한 높이
              className="rounded-full"
            />
          </div>
          <span className="modal-date">{date}</span>
          <button
            onClick={() => {
              onClose(); // 모달 닫기 실행
            }}
            className="modal-close"
          >
            ×
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="modal-content">
          <ReactMarkdown
            className="text-sm text-mainGray"
            remarkPlugins={[remarkGfm]}
          >
            {typeof children === 'string' ? children : JSON.stringify(children)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Modal;
