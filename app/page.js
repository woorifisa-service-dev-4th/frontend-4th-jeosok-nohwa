import Image from "next/image";
import React from "react";
import RouterButton from "@/components/main/RouterButton";

export default function MainPage() {
    return (
        <div className="bg-mainGreen min-h-screen flex flex-col items-center justify-start relative w-full">
            <div className="mt-40">
                <Image
                    src="/image/jeosok-nohwa-logo.png"
                    alt="Logo"
                    width={160}
                    height={160}
                />
            </div>

            {/* 하단 여백 없이 꽉 차게 설정 + 가운데 정렬 */}
            <div className="text-[#3b3b3b] bg-[#fafafa] rounded-t-[50px] border border-[#fafafa]
                      w-[390px] h-auto absolute left-1/2 transform -translate-x-1/2
                      top-[320px] bottom-0 shadow-md flex flex-col items-center
                      px-6 py-5 flex-grow">
                <h1 className="text-[30px] font-[400]">저속노화</h1>
                <p className="text-[11px] ">더 나은 내일을 위한 대화, 오늘 시작하세요.</p>
                <RouterButton />
                <p className="text-gray-400 text-sm mt-6 underline">privacy policy</p>
            </div>
        </div>
    );
}
