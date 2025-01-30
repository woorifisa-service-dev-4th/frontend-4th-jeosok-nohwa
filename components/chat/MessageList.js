import { useEffect, useRef, useState } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProfileImage from "@/components/chat/ProfileImage";
import SummarizeButton from "@/components/chat/SummarizeButton";
import "@/components/chat/styles/CustomScrollBar.css";

const MessageList = ({ messages, setMessages, currentUserId, date, onSend }) => {
    const endOfMessagesRef = useRef(null);
    const [showSummarizeButton, setShowSummarizeButton] = useState(false);
    const [isGptResponding, setIsGptResponding] = useState(false);
    const [lastSummaryIndex, setLastSummaryIndex] = useState(null);
    const initialRender = useRef(true); // ✅ 첫 실행 여부 체크

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });

        console.log(`🟢 useEffect 실행됨! 현재 메시지 개수: ${messages.length}`);

        // ✅ 메시지가 4개 이상일 때 실행
        if (messages.length >= 4) {
            const lastMessage = messages[messages.length - 1];

            console.log(
                `✅ 마지막 메시지 - is_user: ${lastMessage.is_user}, isFinal: ${lastMessage.isFinal}`
            );

            // ✅ 마지막 메시지가 GPT 응답인데 isFinal이 undefined라면 true로 처리
            const isGptFinal = lastMessage.isFinal !== undefined ? lastMessage.isFinal : true;

            console.log(`🛠️ 수정된 isFinal 값: ${isGptFinal}`);

            // ✅ 첫 실행 시 버튼 조건 충족 여부 확인
            if (initialRender.current) {
                if (!lastMessage.is_user) {
                    console.log("✅ (첫 실행) GPT 응답 마지막 → 요약 버튼 표시");
                    setShowSummarizeButton(true);
                    setIsGptResponding(false);
                } else {
                    console.log("🚫 (첫 실행) 조건 미충족 → 버튼 숨김");
                    setShowSummarizeButton(false);
                }
                initialRender.current = false; // ✅ 첫 실행 여부 업데이트
                return;
            }

            // ✅ GPT 응답이 마지막인 경우 버튼 표시
            if (!lastMessage.is_user && isGptFinal) {
                console.log("✅ 버튼 조건 충족 → 요약 버튼 표시");
                setShowSummarizeButton(true);
                setIsGptResponding(false);
            } else if (!lastMessage.is_user) {
                console.log("🚫 GPT 응답 진행 중 → 버튼 숨김");
                setIsGptResponding(true);
                setShowSummarizeButton(false);
            } else {
                console.log("🚫 마지막 메시지가 사용자 메시지 → 버튼 숨김");
                setShowSummarizeButton(false);
            }
        } else {
            console.log("🚫 전체 메시지 개수가 부족하여 버튼 숨김");
            setShowSummarizeButton(false);
        }
    }, [messages]);

    if (!messages || !Array.isArray(messages)) {
        console.error("❌ Invalid messages:", messages);
        return null;
    }

    // ✅ "요약 요청" 버튼을 위한 임시 메시지 생성 (버튼 위에 텍스트 포함)
    const summaryPrompt =
        showSummarizeButton && !isGptResponding
            ? {
                id: "summary_prompt",
                text: "저속노화 기록을 원하시면 아래 버튼을 눌러주세요.",
                is_user: false,
                isSummaryButton: true
            }
            : null;

    // ✅ 버튼을 메시지 리스트에 추가
    const displayMessages = summaryPrompt ? [...messages, summaryPrompt] : messages;

    return (
        <div className="mt-16 mb-20 px-4 space-y-4 custom-scrollbar relative">
            {displayMessages.map((msg, index) => {
                const msgDate = new Date(msg.chat_time || new Date());
                const previousDate =
                    index > 0
                        ? new Date(displayMessages[index - 1]?.chat_time || new Date())
                        : null;

                const isTimeGap =
                    index === 0 ||
                    (previousDate && msgDate - previousDate >= 6 * 60 * 60 * 1000);

                return (
                    <div key={msg.id || index}>
                        {isTimeGap && (
                            <div className="flex items-center justify-center my-2">
                                <div className="border-t border-gray-300 w-full mx-4"></div>
                                <span className="text-gray-400 text-sm px-2">
                                    {msgDate.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </span>
                                <div className="border-t border-gray-300 w-full mx-4"></div>
                            </div>
                        )}

                        <div className={`flex items-end ${msg.is_user ? "justify-end" : "justify-start"}`}>
                            {!msg.is_user && (
                                <ProfileImage
                                    className="px-18"
                                    src="/image/jeosok-nohwa-logo.png"
                                    alt="Profile"
                                />
                            )}
                            <div className={`px-4 py-2 rounded-lg ${msg.is_user ? "bg-gray-100 ml-0.5" : "bg-mainGreen"} break-words`}
                                 style={{ maxWidth: "75%", wordBreak: "break-word" }}>
                                {msg.isSummaryButton ? (
                                    <div className="flex flex-col items-center space-y-2 w-full">
                                        <p className="text-sm text-mainGray text-center">{msg.text}</p>
                                        <SummarizeButton
                                            ownerId={currentUserId}
                                            chatDate={date}
                                            setMessages={setMessages}
                                            messages={messages}
                                            onSend={onSend}
                                            setLastSummaryIndex={setLastSummaryIndex} // ✅ 요약 시점 업데이트 함수 전달
                                        />
                                    </div>
                                ) : msg.isSummary ? (
                                    <ReactMarkdown
                                        className="text-sm text-mainGray"
                                        remarkPlugins={[remarkGfm]}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                ) : msg.is_user ? (
                                    <p className="text-sm text-mainGray">{msg.text}</p>
                                ) : (
                                    <ReactMarkdown
                                        className="text-sm text-mainGray"
                                        remarkPlugins={[remarkGfm]}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default MessageList;
