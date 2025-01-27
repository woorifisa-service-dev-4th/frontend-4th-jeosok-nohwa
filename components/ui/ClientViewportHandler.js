"use client";

import { useEffect } from "react";

export default function ClientViewportHandler() {
    useEffect(() => {
        function setViewportHeight() {
            const viewportHeight = document.documentElement.clientHeight;
            document.documentElement.style.setProperty(
                "--vh",
                `${viewportHeight * 0.01}px`
            );
        }

        setViewportHeight(); // 초기 실행
        window.addEventListener("resize", setViewportHeight); // 리사이즈 감지

        return () => {
            window.removeEventListener("resize", setViewportHeight); // 이벤트 제거
        };
    }, []);

    return null; // UI를 렌더링하지 않음
}
