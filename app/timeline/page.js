import React from 'react';
import NavBar from "@/components/common/NavBar";

function Page() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-between w-full">
            <div className="flex flex-col items-center justify-center h-screen">
                <img
                    src="/image/giphy.gif"
                    alt="No events available"
                    className="w-60 h-50 mb-4 py-6"
                />
                <p className="text-gray-500 text-lg font-medium">열심히 개발하고 있습니다!</p>
                <p className="text-gray-500 text-lg font-medium">Coming Soon!</p>
            </div>
            <NavBar className="w-full"/>
        </div>
    );
}

export default Page;