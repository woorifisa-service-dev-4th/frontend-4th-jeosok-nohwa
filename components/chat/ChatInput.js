"use client";
import { useState, useRef } from "react";

const ChatInput = ({ onSend = () => Promise.resolve(), onStreamUpdate, currentUserId, date }) => {
    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const textareaRef = useRef(null);


    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setMessage(inputValue); // 상태 업데이트
        if (textareaRef.current) {
            const { scrollHeight, style } = textareaRef.current;
            style.height = "auto"; // 초기화 후
            style.height = `${scrollHeight}px`; // 새로운 높이 설정
        }
    };

    const handleSend = async () => {
        if (!message.trim() || isProcessing) return;

        setIsProcessing(true);
        const userMessage = { content: message.trim(), is_user: true, role: "user", owner_id : currentUserId, chat_date : date };

        try {
            // 사용자 메시지를 즉시 반영
            await onSend(message.trim(), true);

            // 메시지 전송 성공 시 입력창 초기화
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto"; // 높이 초기화
            }
            console.log("Sending request to /api/chat with body:", {
                messages: [userMessage],
            });

            // GPT 스트리밍 요청
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [userMessage] }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let accumulatedText = ""; // 누적된 텍스트를 저장할 변수
            const tempId = Date.now(); // DB에 저장하기 전 임시 ID 발급으로 GPT 답변 청크를 실시간으로 업데이트 가능하게 한다.
            onStreamUpdate("", false,false, tempId);
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // 데이터를 디코딩
                const chunk = decoder.decode(value);

                // SSE 형식에서 `data:` 접두사를 제거
                const lines = chunk.split("\n");
                for (const line of lines) {
                    if (line.startsWith("data:")) {
                        const jsonString = line.replace(/^data:\s*/, ""); // `data:` 제거
                        if (jsonString.trim() === "[DONE]") {
                            console.log("Stream finished");
                            break;
                        }
                        try {
                            const parsedData = JSON.parse(jsonString); // JSON 파싱
                            const content = parsedData.content || ""; // content만 추출

                            // 누적 텍스트 업데이트
                            accumulatedText += content;

                            // 스트리밍 데이터를 실시간 반영
                            onStreamUpdate(content, parsedData.isFinal,false, tempId);

                        } catch (err) {
                            console.error("Error parsing JSON:", err);
                        }
                    }
                }
            }

            // 최종 응답을 부모 함수에 전달
            onSend(accumulatedText);
        } catch (error) {
            console.error("Error fetching GPT response:", error);
        } finally {
            setIsProcessing(false);
            setMessage(""); // 입력창 초기화
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto"; // 높이 초기화
            }
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-center px-4 py-1 mb-8 bg-white w-[360px] mx-auto rounded-full border border-gray-300">
            <textarea
                ref={textareaRef}
                className="flex-1 bg-transparent border-none px-3 py-2 focus:outline-none focus:ring-0 resize-none overflow-hidden text-gray-600 placeholder-gray-400"
                placeholder="오늘도 저속노화 하셨나요?"
                value={message} // React 상태와 연결
                onChange={handleInputChange} // 입력 이벤트 핸들링
                onKeyDown={handleKeyDown} // Enter 키 처리
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
