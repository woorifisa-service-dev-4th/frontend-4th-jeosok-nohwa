import React from 'react';
import NavBar from "@/components/common/NavBar";

function Page(props) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-between w-full">
            <NavBar className="w-full"/>
        </div>
    );
}

export default Page;