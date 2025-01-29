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

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });

        if (messages.length >= 4) {
            const lastMessage = messages[messages.length - 1];

            if (!lastMessage.is_user && lastMessage.isFinal && lastSummaryIndex === null) {
                setShowSummarizeButton(true);
                setIsGptResponding(false);
            } else if (lastSummaryIndex !== null && messages.length >= lastSummaryIndex + 4) {
                setShowSummarizeButton(true);
                setIsGptResponding(false);
            } else if (!lastMessage.is_user) {
                setIsGptResponding(true);
                setShowSummarizeButton(false);
            } else {
                setShowSummarizeButton(false);
            }
        } else {
            setShowSummarizeButton(false);
        }
    }, [messages]);

    if (!messages || !Array.isArray(messages)) {
        console.error("Invalid messages:", messages);
        return null;
    }

    const summaryPrompt = showSummarizeButton && !isGptResponding
        ? { id: "summary_prompt", text: "저속노화 기록을 원하시면 아래 버튼을 눌러주세요.", is_user: false, isSummaryButton: true }
        : null;

    const displayMessages = summaryPrompt ? [...messages, summaryPrompt] : messages;

    return (
        <div className="mt-16 mb-20 px-4 space-y-4 custom-scrollbar relative">
            {displayMessages.map((msg, index) => {
                const msgDate = new Date(msg.chat_time || new Date());
                const previousDate =
                    index > 0 ? new Date(displayMessages[index - 1]?.chat_time || new Date()) : null;

                const isTimeGap =
                    index === 0 || (previousDate && msgDate - previousDate >= 6 * 60 * 60 * 1000);

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
