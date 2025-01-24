import Link from 'next/link';

const ChatHeader = ({ date }) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 mt-12 bg-white w-[390px] mx-auto">
            <Link href="/home" className="text-gray-600 hover:text-gray-900">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">{date}</h1>
            <div className="w-6"></div> {/* Placeholder for balanced layout */}
        </div>
    );
};

export default ChatHeader;
