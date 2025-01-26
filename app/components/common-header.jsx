"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function CommonHeader() {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기

  // 날짜 클릭 이벤트 핸들러
  const handleDateClick = () => {
    const today = new Date();
    const formattedDate = today
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, "-")
        .replace(".", "")
        .trim(); // "yyyy.mm.dd" 형식을 "yyyy-mm-dd"로 변환
    const searchParams = new URLSearchParams({ date: formattedDate });

    router.push(`/chat?${searchParams.toString()}`);
  };

  return (
      <header className="fixed flex items-center justify-between top-0 w-full max-w-[390px] p-2 bg-white z-10">
        <Link href="/home">
          <Image
              className="m-1"
              src="/image/jeosok-nohwa-logo.png"
              alt=""
              width={40}
              height={40}
          />
        </Link>
        {/* 오른쪽 아이콘들 */}
        {pathname !== "/chat" && ( // 현재 경로가 "/chat"이 아닐 때만 렌더링
            <div className="flex items-center space-x-2 ml-4">
              {/* 알림 아이콘 */}
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600 transition-transform duration-300 ease-in-out hover:scale-110 hover:text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 22c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zM18.707 16.293A1 1 0 0018 16H6a1 1 0 00-.707.293l-1 1A1 1 0 006 18h12a1 1 0 001.707-.707l-1-1zM12 3a6 6 0 016 6v4c0 .552.224 1.048.586 1.414l1 1A1 1 0 0118 16H6a1 1 0 01-.586-1.586l1-1A2 2 0 006 13V9a6 6 0 016-6z"
                />
              </svg>

              {/* 새 SVG 아이콘 */}
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600 transition-transform duration-300 ease-in-out hover:scale-110 hover:text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  onClick={handleDateClick}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                />
              </svg>
            </div>
        )}
      </header>
  );
}
