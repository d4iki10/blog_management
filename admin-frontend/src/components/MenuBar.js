// MenuBar.js (修正例)
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MenuBar = ({ isMenuOpen, setIsMenuOpen }) => {
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    const navItems = [
        { name: "ダッシュボード", path: "/dashboard" },
        { name: "記事管理", path: "/articles" },
        { name: "カテゴリ管理", path: "/categories" },
        { name: "タグ管理", path: "/tags" },
        { name: "画像管理", path: "/media" },
    ];

    const adminNavItems = [
        { name: "監修者管理", path: "/supervisors" },
        { name: "ユーザー管理", path: "/users" },
    ];

    return (
        <aside
        // relative + z-50 でメインコンテンツより前面に
        className={`
            relative
            z-50
            bg-gray-500 text-white
            min-h-screen
            fixed top-0 left-0
            transition-all duration-300
            ${isMenuOpen ? "w-64" : "w-16"}
        `}
        >
        {/* ロゴ・タイトル部分 */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-8 h-8 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5zM7.5 9.75h3.75M7.5 12.75h3.75m-3.75 3h3.75M14.25 9.75h3.75m-3.75 3h3.75"
            />
            </svg>
            {/* メニュー開時のみ「BLOG+」テキストを表示 */}
            {isMenuOpen && (
            <Link to="/dashboard" className="text-2xl font-bold">
                BLOG+
            </Link>
            )}
        </div>

        {/* ナビゲーションリンク */}
        <nav className="mt-10">
            {navItems.map((item) => (
            <Link
                key={item.name}
                to={item.path}
                className={`flex items-center py-2 px-4 hover:bg-gray-700 transition-colors ${
                location.pathname === item.path ? "bg-gray-700" : ""
                }`}
            >
                {isMenuOpen && <span className="ml-2">{item.name}</span>}
                {/* 閉じている時はテキスト非表示にする等、必要に応じてカスタム */}
            </Link>
            ))}

            {/* 管理者のみ表示 */}
            {currentUser &&
            currentUser.role === "admin" &&
            adminNavItems.map((item) => (
                <Link
                key={item.name}
                to={item.path}
                className={`flex items-center py-2 px-4 hover:bg-gray-700 transition-colors ${
                    location.pathname === item.path ? "bg-gray-700" : ""
                }`}
                >
                {isMenuOpen && <span className="ml-2">{item.name}</span>}
                </Link>
            ))}
        </nav>

        {/* ログアウトボタン (フル幅) */}
        {isMenuOpen && (
            <div className="absolute bottom-0 w-full mb-4 px-2">
            <button
                onClick={logout}
                className="bg-rose-500 w-full py-2 font-semibold hover:bg-rose-700 focus:outline-none"
            >
                ログアウト
            </button>
            </div>
        )}

        {/* 「＞」ボタン（はみ出し配置） */}
        <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute bottom-4 bg-gray-500 font-semibold text-white
                    hover:bg-gray-700 focus:outline-none px-4 py-2
                    right-[-32px] rounded-r"
            style={{ minWidth: "24px" }} // 必要に応じて調整
        >
            {isMenuOpen ? ">" : "<"}
        </button>
        </aside>
    );
};

export default MenuBar;
