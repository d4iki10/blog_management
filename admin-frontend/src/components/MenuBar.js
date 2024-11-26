import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MenuBar = () => {
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    const navItems = [
        { name: "ダッシュボード", path: "/dashboard" },
        { name: "記事管理", path: "/articles" },
        { name: "カテゴリー管理", path: "/categories" },
        { name: "タグ管理", path: "/tags" },
    ];

    // 管理者のみ表示するメニュー項目
    const adminNavItems = [
        { name: "監修者管理", path: "/supervisors" },
        { name: "ユーザー管理", path: "/users" },
    ];

    return (
        <aside className="w-64 bg-blue-600 text-white min-h-screen fixed">
        {/* ロゴまたはタイトル */}
        <div className="flex items-center justify-center h-16 border-b border-blue-700">
            <Link to="/dashboard" className="text-2xl font-bold">
            記事管理ツール
            </Link>
        </div>

        {/* ナビゲーションリンク */}
        <nav className="mt-10">
            {navItems.map((item) => (
            <Link
                key={item.name}
                to={item.path}
                className={`flex items-center py-2 px-8 hover:bg-blue-700 ${
                location.pathname === item.path ? "bg-blue-700" : ""
                }`}
            >
                {item.name}
            </Link>
            ))}

            {/* 管理者のみ表示 */}
            {currentUser &&
            currentUser.role === "admin" &&
            adminNavItems.map((item) => (
                <Link
                key={item.name}
                to={item.path}
                className={`flex items-center py-2 px-8 hover:bg-blue-700 ${
                    location.pathname === item.path ? "bg-blue-700" : ""
                }`}
                >
                {item.name}
                </Link>
            ))}
        </nav>

        {/* Logoutボタン */}
        <div className="absolute bottom-0 w-full mb-4">
            <button
            onClick={logout}
            className="flex items-center w-full py-2 px-8 bg-red-600 hover:bg-red-700 focus:outline-none"
            >
            ログアウト
            </button>
        </div>
        </aside>
    );
};

export default MenuBar;
