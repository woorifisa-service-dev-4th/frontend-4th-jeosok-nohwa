import { useEffect, useRef } from 'react';
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProfileImage from "@/components/chat/ProfileImage";
import "@/components/chat/styles/CustomScrollBar.css";

const MessageList = ({ messages }) => {
    const endOfMessagesRef = useRef(null);
    console.log("Messages:", messages); // 디버깅용 로그

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]); // 메시지 목록이 변경될 때마다 실행

    if (!messages || !Array.isArray(messages)) {
        console.error("Invalid messages:", messages);
        return null;
    }

    return (
        <div className="mt-16 mb-20 px-4 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => {
                const msgDate = new Date(msg.chat_time);
                const previousDate =
                    index > 0 ? new Date(messages[index - 1]?.chat_time) : null;

                // 6시간 이상의 시간 간격 여부 확인
                const isTimeGap =
                    index === 0 || // 첫 메시지인 경우
                    (previousDate && msgDate - previousDate >= 6 * 60 * 60 * 1000); // 6시간 이상 간격



                return (
                    <div key={index}>
                        {/* 시간 표시 또는 6시간 기준 구분선 */}
                        {isTimeGap && (
                            <div className="flex items-center justify-center my-2">
                                <div className="border-t border-gray-300 w-full mx-4"></div>
                                <span className="text-gray-400 text-sm px-2">
                                    {msgDate.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false, // 24시간 형식 사용
                                    })}
                                </span>
                                <div className="border-t border-gray-300 w-full mx-4"></div>
                            </div>
                        )}

                        {/* 메시지 표시 */}
                        <div
                            className={`flex items-end ${
                                msg.is_user ? "justify-end" : "justify-start"
                            }`}
                        >
                            {!msg.is_user && (
                                <ProfileImage
                                    className="px-18"
                                    src="/image/jeosok-nohwa-logo.png"
                                    alt="Profile"
                                />
                            )}
                            <div
                                className={`px-4 py-2 rounded-lg ${
                                    msg.is_user ? "bg-gray-100 ml-0.5" : "bg-mainGreen"
                                } break-words`}
                                style={{
                                    maxWidth: "75%", // 화면의 70% 너비 제한
                                    wordBreak: "break-word", // 단어를 강제로 줄 바꿈
                                }}
                            >
                                {msg.is_user ? (
                                    // 단순 텍스트 렌더링
                                    <p className="text-sm text-mainGray">{msg.text}</p>
                                ) : (
                                    // 마크다운 렌더링
                                    <ReactMarkdown
                                        className="text-sm text-mainGray"
                                        remarkPlugins={[remarkGfm]} // GitHub 스타일 마크다운 지원
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            {/* 스크롤을 맨 아래로 이동시키는 데 사용되는 빈 div */}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default MessageList;
