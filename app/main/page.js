import Image from "next/image";
import React from "react";
import RouterButton from "@/components/main/RouterButton";

export default function MainPage() {
  return (
    <div className="bg-[#66836f] min-h-screen flex flex-col items-center justify-start relative w-full">
      <div className="mt-40">
        <Image
          src="/image/jeosok-nohwa-logo.png"
          alt="Logo"
          width={120}
          height={120}
        />
      </div>
      <div className="text-[#3b3b3b] bg-[#fafafa] rounded-t-[50px] border border-[#fafafa] w-[390px] h-[496px] absolute left-0 top-[320px] shadow-md flex flex-col items-center px-6 py-5">
        <h1 className="text-[30px] font-[400]">저속노화</h1>
        <p className="text-[11px] ">
          더 나은 내일을 위한 대화, 오늘 시작하세요.
        </p>
        <RouterButton />
        <p className="text-gray-400 text-sm mt-6 underline">privacy policy</p>
      </div>
    </div>
  );
}
