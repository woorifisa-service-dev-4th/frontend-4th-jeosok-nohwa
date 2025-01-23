import { useEffect, useRef } from 'react';
import ProfileImage from "@/components/chat/ProfileImage";
import "@/components/chat/CustomScrollBar.css";


const MessageList = ({ messages }) => {
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]); // 메시지 목록이 변경될 때마다 실행

    return (
        <div className="mt-16 mb-20 px-4 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => {
                const currentDate = new Date();
                const msgDate = new Date();
                if (msg.time !== "now") {
                    const [hours, minutes] = msg.time.split(":");
                    msgDate.setHours(hours, minutes, 0, 0);
                }

                const previousDate = index > 0 && new Date();
                if (index > 0 && messages[index - 1].time !== "now") {
                    const [prevHours, prevMinutes] = messages[index - 1].time.split(":");
                    previousDate.setHours(prevHours, prevMinutes, 0, 0);
                }

                const isTimeGap = index === 0 || (previousDate && msgDate - previousDate >= 6 * 60 * 60 * 1000);

                return (
                    <div key={index}>
                        {/* 시간 표시 또는 6시간 기준 구분선 */}
                        {isTimeGap && (
                            <div className="flex items-center justify-center my-2">
                                <div className="border-t border-gray-300 w-full mx-4"></div>
                                <span className="text-gray-400 text-sm px-2">
                                    {msg.time === "now"
                                        ? "now"
                                        : msg.time || currentDate.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                                <div className="border-t border-gray-300 w-full mx-4"></div>
                            </div>
                        )}

                        {/* 메시지 표시 */}
                        <div
                            className={`flex items-center ${msg.isUser ? "justify-end" : "justify-start"}`}
                        >
                            {!msg.isUser && (
                                <ProfileImage
                                    className="px-18"
                                    src="/image/jeosok-nohwa-logo.png"
                                    alt="Profile"
                                />
                            )}
                            <div
                                className={`px-4 py-2 rounded-lg ${msg.isUser ? "bg-gray-100 ml-0.5" : "bg-green-100"} break-words`}
                                style={{
                                    maxWidth: "75%", // 화면의 70% 너비 제한
                                    wordBreak: "break-word", // 단어를 강제로 줄 바꿈
                                }}
                            >
                                <p className="text-sm text-gray-800">{msg.text}</p>
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
