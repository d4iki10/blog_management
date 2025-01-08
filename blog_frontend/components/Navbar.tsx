import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-900 text-white py-6 px-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Link href="/" className="text-xl font-semibold">
                    My Blog
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
