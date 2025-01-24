/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mainGreen: "#D9F7F3", // 사용자 정의 색상 추가
        mainGray : "#595959", // 텍스트 색깔 추가
      },
    },
  },
  plugins: [],
};
