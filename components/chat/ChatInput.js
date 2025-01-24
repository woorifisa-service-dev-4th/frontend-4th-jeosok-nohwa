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
        setIsProcessing(true); // 처리 중 상태 설정

        const currentMessage = message.trim(); // 현재 메시지를 별도 변수에 저장

        try {
            setMessage(""); // 상태를 미리 초기화
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
            await onSend(currentMessage); // 별도로 저장한 메시지를 전송
        } catch (error) {
            console.error("Message send failed:", error);
        } finally {
            setIsProcessing(false); // 처리 중 상태 해제
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // 기본 Enter 동작 방지
            if (!isProcessing) {
                handleSend(); // Enter 키로 전송
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
                        handleSend(); // 버튼 클릭으로 전송
                    }
                }}
                className={`ml-2 bg-transparent p-2 hover:opacity-80 ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
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
