import React, { useState } from "react";

const SummarizeButton = ({ ownerId, chatDate, setMessages, messages, onSend }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [lastSummaryIndex, setLastSummaryIndex] = useState(null);


    const handleSummarize = async () => {
        setIsLoading(true);
        try {
            // ✅ 기존 요약 조회
            const response = await fetch(`/api/summaries?owner_id=${ownerId}&chat_date=${chatDate}`);
            const result = await response.json();

            let summaryText;

            if (!result.success || !result.summary) {
                console.log("✅ 기존 요약 없음 → 새로 생성");

                // ✅ 새 요약 요청
                const createResponse = await fetch("/api/chat/summarize", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ owner_id: ownerId, chat_date: chatDate }),
                });

                const createResult = await createResponse.json();
                if (!createResponse.ok || createResult.error) {
                    console.error("❌ 요약 생성 실패:", createResult.error);
                    setIsLoading(false);
                    return;
                }
                summaryText = createResult.summary;
            } else {
                console.log("✅ 기존 요약 있음 → 불러오기");
                summaryText = result.summary;
            }

            // ✅ UI에 즉시 반영
            const summaryMessage = {
                id: Date.now(),
                text: summaryText,
                is_user: false,
                owner_id: ownerId,
                chat_time: new Date().toISOString(),
                created_at: new Date().toISOString(),
                isSummary: true,
            };

            //setMessages((prevMessages) => [...prevMessages, summaryMessage]);
            //setLastSummaryIndex(messages.length);

            // ✅ 메시지 전송
            await onSend(summaryText, false);

            setIsCompleted(true);
        } catch (error) {
            console.error("❌ API 호출 에러:", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <button
            onClick={handleSummarize}
            className={`text-mainGray font-bold text-sm bg-white px-4 py-2 rounded-lg border border-gray-300
            transition-opacity duration-500 opacity-100 hover:bg-gray-100 self-center ${
                isLoading || isCompleted ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || isCompleted}
        >
            {isLoading ? "⏳ 요약 중..." : isCompleted ? "✔️ 요약 완료" : "✨ 저속노화 기록 ✨"}
        </button>
    );
};

export default SummarizeButton;