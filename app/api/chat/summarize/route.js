import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        // ✅ 요청 데이터 파싱
        const { owner_id, chat_date } = await request.json();

        if (!owner_id || !chat_date) {
            return new NextResponse(
                JSON.stringify({ error: "Missing owner_id or chat_date" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // ✅ Supabase에서 해당 날짜의 대화 불러오기
        const { data: messages, error } = await supabase
            .from("messages")
            .select("text, is_user")
            .eq("owner_id", owner_id)
            .filter("chat_time", "gte", `${chat_date} 00:00:00`)
            .filter("chat_time", "lt", `${chat_date} 23:59:59`)
            .order("chat_time", { ascending: true });

        if (error) {
            console.error("Supabase query error:", error);
            return new NextResponse(
                JSON.stringify({ error: "Error fetching messages from Supabase" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!messages || messages.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: "No messages found for the given date" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // ✅ GPT API 요청을 위한 메시지 변환
        const historyMessages = messages.map(msg => ({
            role: msg.is_user ? "user" : "assistant",
            content: msg.text,
        }));

        // ✅ 한 줄 요약 요청
        let title = "";
        try {
            const shortSummaryCompletion = await openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    {
                        role: "system",
                        content:
                            "유저의 주요 활동과 건강 습관을 1줄로 요약해주세요. 명사형으로 끝내지마.  \n" +
                            "명확하게 핵심만 담아야 합니다.\n" +
                            "예: 건강한 샐러드와 산책을 했어요!" +
                            "- 예: 유산소 운동은 했지만 단백질 섭취가 부족했어요.\n"

        },
                    ...historyMessages,
                ],
                temperature: 0.7,
            });

            title = shortSummaryCompletion.choices[0]?.message?.content?.trim() || "";
        } catch (err) {
            console.error("❌ 한 줄 요약 생성 실패:", err);
        }

        // ✅ 전체 요약 요청
        let summary = "";
        try {
            const detailedSummaryCompletion = await openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    {
                        role: "system",
                        content:
                            "사용자의 하루 대화를 기반으로 **자세한 요약**을 작성하세요.\n" +
                            "\n" +
                            "### **요약 방식**\n" +
                            "1️⃣ **식단 분석**  \n" +
                            "   - 사용자가 섭취한 음식을 분석하고  평가하세요.  \n" +
                            "   - 건강한 음식(채소, 생선, 통곡물 등)과 제한해야 할 음식(정제 탄수화물, 가공식품 등)을 분류하여 요약하세요.  \n" +
                            "   - 섭취 빈도, 영양 균형, 개선할 점을 명확하게 정리하세요.\n" +
                            "\n" +
                            "2️⃣ **운동 분석**  \n" +
                            "   - 사용자의 운동 습관을 분석하고 **운동 평가 기준**에 따라 점수를 매기세요.  \n" +
                            "   - 유산소 운동, 근력 운동, 유연성 운동이 각각 얼마나 이루어졌는지 평가하세요.  \n" +
                            "   - 부족한 점과 개선 방안을 짧고 실용적으로 제안하세요.  \n" +
                            "\n" +
                            "3️⃣ **건강 전문가 피드백**  \n" +
                            "   - 저속노화 전문가로서 사용자가 개선할 수 있는 부분을 핵심적으로 정리하세요.  \n" +
                            "   - 지나치게 일반적인 조언이 아니라, **사용자의 실제 대화 내용에 기반한 맞춤형 피드백**을 제공하세요.  \n" +
                            "   - 마지막에는 **격려하는 멘트**를 포함하여 긍정적인 마무리를 하세요.\n" +
                            "\n" +
                            "### **출력 형식 (마크다운 적용)**\n" +
                            "```markdown\n" +
                            "### 📌 한 줄 요약  \n" +
                            "\"오늘은 건강한 샐러드와 산책을 했어요!\"  \n" +
                            "\n" +
                            "### 📝 전체 요약  \n" +
                            "- **🥗 식단 분석**: 유저는 샐러드, 연어, 통곡물을 섭취했습니다.  \n" +
                            "- **🏋️‍♀️ 운동 분석**: 유산소 운동 30분을 했으며, 근력 운동은 부족했습니다.  \n" +
                            "- **💡 전문가 피드백**: 단백질 섭취를 늘리고 근력 운동을 추가하면 더욱 좋을 것 같아요! 💪\n"

                    },
                    ...historyMessages,
                ],
                temperature: 0.7,
            });

            summary = detailedSummaryCompletion.choices[0]?.message?.content?.trim() || "";
        } catch (err) {
            console.error("❌ 전체 요약 생성 실패:", err);
        }

        // ✅ Supabase에 요약 저장
        const { error: insertError } = await supabase
            .from("chat_summaries")
            .upsert([{ owner_id, chat_date, title, summary }]);

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            return new NextResponse(
                JSON.stringify({ error: "Error saving summary to Supabase" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // ✅ 클라이언트에 JSON 응답 반환
        return new NextResponse(
            JSON.stringify({ title, summary }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("Error handling request:", err);
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
