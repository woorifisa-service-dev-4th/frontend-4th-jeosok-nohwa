import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabase";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    const encoder = new TextEncoder();
    let fullResponse = ""; // Full response accumulator


    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.error("Invalid messages format:", messages);
            return new NextResponse(
                JSON.stringify({ error: "Invalid messages format" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        // ✅ messages 배열의 첫 번째 항목에서 owner_id와 chat_date 추출
        const { owner_id, chat_date: date } = messages[0];

        if (!owner_id || !date) {
            console.error("Missing owner_id or chat_date in messages");
            return new NextResponse(
                JSON.stringify({ error: "Missing owner_id or chat_date" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        // ✅ Supabase에서 기존 메시지 불러오기
        const { data: previousMessages, error } = await supabase
            .from("messages")
            .select("text")
            .eq("owner_id", owner_id)
            .filter("chat_time", "gte", `${date} 00:00:00`)
            .filter("chat_time", "lt", `${date} 23:59:59`)
            .order("chat_time", { ascending: true });

        if (error) {
            console.error("Supabase query error:", error);
            return new NextResponse(
                JSON.stringify({ error: "Error fetching data from Supabase" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // ✅ 이전 메시지를 배열로 변환
        const historyMessages = previousMessages?.map(msg => ({
            role: msg.is_user ? "user" : "assistant",  // ✅ is_user 값에 따라 역할 변경
            content: msg.text
        })) || [];

        // ✅ 새로운 메시지를 기존 기록과 병합
        const updatedMessages = [...historyMessages, ...messages];

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4",
                        messages: [
                            { role: "system", content: "당신은 저속노화 식단과 운동 전문가인 의사입니다.  \n" +
                                    "사용자의 질문이나 입력을 **최우선으로 이해하고 답변을 제공합니다.**  \n" +
                                    "이후 사용자의 식단과 운동 습관을 평가하여 피드백을 제공합니다.  \n" +
                                    "\n" +
                                    "---\n" +
                                    "\n" +
                                    "## 📌 **역할 및 대화 규칙**\n" +
                                    "1. **사용자의 질문을 먼저 이해하고 적절히 답변한 후 식단 및 운동 평가를 진행합니다.**  \n" +
                                    "   - 예: `\"오늘 운동하지 말까?\"` → `\"오늘 운동을 쉬고 싶으신가요? 특별한 이유가 있으신가요?\"`  \n" +
                                    "   - 예: `\"짜장면 먹었어요\"` → `짜장면(정제 탄수화물)으로 평가 진행`  \n" +
                                    "   \n" +
                                    "2. **유저가 입력한 음식명을 직접 분석하여 자동으로 평가합니다.**  \n" +
                                    "   - `\"샐러드, 연어 스테이크\"` → **샐러드(채소), 연어(단백질+건강한 지방)**  \n" +
                                    "   - `\"치킨버거\"` → **치킨(가금류), 빵(정제 탄수화물), 채소 포함 여부 판단**  \n" +
                                    "\n" +
                                    "3. **운동 평가 시 유저가 입력한 활동을 기반으로 점수를 부여합니다.**  \n" +
                                    "   - `\"오늘 30분 걸었어요\"` → **유산소 운동(✅ 1점)**  \n" +
                                    "   - `\"근력 운동 안 했어요\"` → **근력 운동(❌ 0점)**  \n" +
                                    "\n" +
                                    "4. **유저가 입력한 내용과 관련 없는 추가 질문을 하지 않습니다.**  \n" +
                                    "   - `\"짜장면 먹었어요\"` → **짜장면 평가만 진행, 추가 질문 금지**  \n" +
                                    "\n" +
                                    "---\n" +
                                    "\n" +
                                    "## 🕒 **시간대별 질문 방식**\n" +
                                    "1. **오전 11시 이전** → `\"아침은 어떤 메뉴를 드셨나요?\"`  \n" +
                                    "2. **오후 12시~4시** → `\"점심 메뉴는 무엇인가요?\"`  \n" +
                                    "3. **오후 6시~10시** → `\"오늘 하루 동안 어떤 음식을 드셨나요?\"`  \n" +
                                    "\n" +
                                    "✅ 위 시간대를 기준으로 해당 식사만 평가합니다.  \n" +
                                    "✅ **사용자가 입력한 내용을 자동 분석하여 평가**합니다.  \n" +
                                    "\n" +
                                    "---\n" +
                                    "\n" +
                                    "## 🍽️ **식단 평가 (자동 분석 & 점수 매기기)**\n" +
                                    "**✅ 음식명을 직접 분석하여 자동으로 카테고리화하고 점수를 매깁니다.**  \n" +
                                    "- 음식에서 **통곡물, 단백질, 채소, 건강한 지방** 포함 여부 판단  \n" +
                                    "- 정제 탄수화물(흰쌀밥, 밀가루) 및 가공식품(패스트푸드)은 감점  \n" +
                                    "\n" +
                                    "**🔹 예제 분석**  \n" +
                                    "- `\"볶음밥, 짜장면 먹었어요\"`  \n" +
                                    "  - **볶음밥** → 통곡물 가능 ✅ (+1점)  \n" +
                                    "  - **짜장면** → 정제 밀가루 ❌ (0점)  \n" +
                                    "  - **짜장면의 양파, 감자 포함** → 채소 ✅ (+1점)  \n" +
                                    "- `\"샐러드와 연어 스테이크 먹었어요\"`  \n" +
                                    "  - **샐러드** → 채소 ✅ (+1점)  \n" +
                                    "  - **연어 스테이크** → 단백질 ✅ (+1점), 건강한 지방 ✅ (+1점)  \n" +
                                    "\n" +
                                    "---\n" +
                                    "\n" +
                                    "## 🏋️‍♀️ **운동 평가 기준 (자동 분석 & 점수 매기기)**  \n" +
                                    "- **유산소 운동** (걷기, 달리기, 자전거, 수영 등):  \n" +
                                    "  - **하루 40분 이상** ✅ (+1점)  \n" +
                                    "  - **10~39분** ✅ (+0.5점)  \n" +
                                    "  - **10분 이하 또는 안 함** ❌ (0점)  \n" +
                                    "\n" +
                                    "- **근력 운동** (웨이트, 홈트레이닝, 플랭크 등):  \n" +
                                    "  - **하루 30분 이상** ✅ (+1점)  \n" +
                                    "  - **15~29분** ✅ (+0.5점)  \n" +
                                    "  - **거의 하지 않음** ❌ (0점)  \n" +
                                    "\n" +
                                    "- **유연성 운동** (요가, 스트레칭 등):  \n" +
                                    "  - **하루 20분 이상** ✅ (+1점)  \n" +
                                    "  - **10~19분** ✅ (+0.5점)  \n" +
                                    "  - **거의 하지 않음** ❌ (0점)  \n" +
                                    "\n" +
                                    "---\n" +
                                    "\n" +
                                    "## 📊 **최종 출력 예시**\n" +
                                    "```markdown\n" +
                                    "#### 🥗 **식단 평가**\n" +
                                    "- **볶음밥**: 통곡물 가능 → ✅ 1점 (좋은 선택입니다!)\n" +
                                    "- **짜장면**: 정제 밀가루 사용 → ❌ 0점 (통곡물 섭취를 늘리는 것이 좋습니다.)\n" +
                                    "- **채소 섭취**: 양파, 감자 포함 → ✅ 1점 (채소 섭취가 적절합니다!)\n" +
                                    "\n" +
                                    "#### 🏋️‍♀️ **운동 평가**\n" +
                                    "- **유산소 운동**: 하루 30분 이상 → ✅ 1점 (좋은 운동 습관입니다!)\n" +
                                    "- **근력 운동**: 주 1-2회 → ⚠️ 0.5점 (조금 더 자주 하시면 좋습니다.)\n" +
                                    "- **유연성 운동**: 주 3회 이상 → ✅ 1점 (훌륭합니다!)\n" +
                                    "\n" +
                                    "#### 📊 **총점**\n" +
                                    "- **식단 총점**: 2점  \n" +
                                    "- **운동 총점**: 2.5점  \n" +
                                    "\n" +
                                    "**해석:** 통곡물 섭취를 늘리고, 근력 운동 빈도를 조금 더 늘리면 더 좋은 점수를 받을 수 있습니다. 🎉\n" +
                                    "\n" +
                                    "#### 💬 **대화 유도 및 추천**\n" +
                                    "- `\"오늘 드신 음식 중에서 가장 맛있었던 것은 무엇인가요?\"`  \n" +
                                    "- `\"운동을 더 꾸준히 하시려면 어떤 방법이 도움이 될까요?\"`  \n" +
                                    "- `\"내일은 어떤 건강한 음식을 드실 계획인가요?\"`  \n" +
                                    "\n" +
                                    "#### 💡 **추천 및 응원**\n" +
                                    "현재 식단과 운동 습관이 저속노화에 매우 적합합니다.  \n" +
                                    "특히 근력 운동 빈도를 조금 더 늘리시면 더 높은 점수를 받을 수 있습니다.  \n" +
                                    "좋은 습관을 계속 유지하시길 응원합니다. 당신의 뇌와 몸이 행복해질 것입니다! 💪🎉\n"
                                    },
                            ...updatedMessages,
                        ],
                        stream: true, // 스트림을 사용한다.
                    });

                    for await (const chunk of completion) {
                        const content = chunk.choices[0].delta?.content || "";

                        // Append chunk to full response
                        fullResponse += content;

                        // Create SSE-compatible data
                        const sseData = JSON.stringify({
                            content: content,
                            isFinal: chunk.choices[0].finish_reason === "stop",
                        });

                        // Send chunk to client
                        controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));

                        // Exit if stream is complete
                        if (chunk.choices[0].finish_reason === "stop") {
                            break;
                        }
                    }

                    // Close the stream
                    controller.close();
                } catch (err) {
                    console.error("Error in OpenAI streaming:", err);
                    controller.error(err);
                }
            },
        });

        return new NextResponse(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*", // Allow CORS
            },
        });
    } catch (err) {
        console.error("Error handling request:", err);
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}


export async function GET(request) {
    try {
        const url = new URL(request.url);
        const dateParam = url.searchParams.get("date");
        const userId = 1; // 현재 유저 ID (동적으로 변경 필요)

        if (!dateParam) {
            return NextResponse.json({ error: "Invalid date parameter" }, { status: 400 });
        }

        const formattedDate = dateParam;

        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("owner_id", userId)
            .filter("chat_time", "gte", `${formattedDate} 00:00:00`)
            .filter("chat_time", "lt", `${formattedDate} 23:59:59`)
            .order("chat_time", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ success: true, messages: data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
