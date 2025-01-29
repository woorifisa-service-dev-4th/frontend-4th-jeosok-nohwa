import { Geist, Geist_Mono } from "next/font/google";
import CommonHeader from "../components/common/CommonHeader";
import "./globals.css";
import React, {Suspense} from "react";
import ClientViewportHandler from "@/components/common/ClientViewportHandler";



const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "저속노화",
    description: "Healty LifeStyle",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {/* 뷰포트 핸들러 컴포넌트 */}
        <ClientViewportHandler />
        <CommonHeader />


        <div className="mt-16">{children}</div>

        </body>
        </html>
    );
}
