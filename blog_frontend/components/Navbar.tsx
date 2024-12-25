import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-900 text-white p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                {/* 左端のアイコン */}
                <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">My Blog</span>
                </div>

                {/* 右端のリンク */}
                <ul className="flex space-x-6">
                <li>
                    <Link href="/" className="text-white hover:text-gray-400 transition duration-200">
                        ホーム
                    </Link>
                </li>
                <li>
                    <Link href="/articles" className="text-white hover:text-gray-400 transition duration-200">
                        記事一覧
                    </Link>
                </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
