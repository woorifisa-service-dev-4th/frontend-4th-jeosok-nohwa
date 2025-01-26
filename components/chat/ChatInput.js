"use client";
import { useState, useRef } from "react";

const ChatInput = ({ onSend = () => Promise.resolve() }) => {
    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const textareaRef = useRef(null);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        if (textareaRef.current) {
            const { scrollHeight, style } = textareaRef.current;
            if (style.height !== `${scrollHeight}px`) {
                style.height = "auto";
                style.height = `${scrollHeight}px`;
            }
        }
    };


    const handleSend = async () => {
        if (!message.trim() || isProcessing) {
            console.log("handleSend skipped: either empty message or already processing.");
            return;
        }

        console.log("handleSend executed");
        setIsProcessing(true);

        const currentMessage = message.trim();

        // 입력창과 높이 즉시 초기화
        setMessage(""); // 입력창 내용 초기화
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // 높이 초기화
        }

        try {
            await onSend(currentMessage); // 메시지 전송 (비동기)
        } catch (error) {
            console.error("Message send failed:", error);
        } finally {
            setIsProcessing(false); // 전송 상태 초기화
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isProcessing && message.trim()) {
                handleSend();
            }
        }
    };

    return (
        <div className="flex items-center px-4 py-1 mb-8 bg-white w-[360px] mx-auto rounded-full border border-gray-300">
            <textarea
                ref={textareaRef}
                className="flex-1 bg-transparent border-none px-3 py-2 focus:outline-none focus:ring-0 resize-none overflow-hidden text-gray-600 placeholder-gray-400"
                placeholder="오늘도 저속노화 하셨나요?"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{ height: "auto" }}
            />
            <button
                onClick={() => {
                    if (!isProcessing) {
                        handleSend();
                    }
                }}
                className={`ml-2 bg-transparent p-2 hover:opacity-80 ${
                    isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="animate-spin h-5 w-5 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ChatInput;
