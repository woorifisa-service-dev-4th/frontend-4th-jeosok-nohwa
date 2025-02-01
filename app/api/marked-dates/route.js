
import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabase";

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("chat_summaries")
            .select("chat_date");

        if (error) throw error;

        return NextResponse.json({ success: true, dates: data.map((item) => item.chat_date) });
    } catch (error) {
        console.error("Supabase Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}