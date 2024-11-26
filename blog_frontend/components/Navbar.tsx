import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
    return (
        <nav style={navStyle}>
            <ul style={ulStyle}>
            <li>
                <Link href="/">ホーム</Link>
            </li>
            <li>
                <Link href="/articles">記事一覧</Link>
            </li>
            {/* 他のナビゲーションリンクを追加可能 */}
            </ul>
        </nav>
    );
};

const navStyle: React.CSSProperties = {
    backgroundColor: "#333",
    padding: "1rem",
};

const ulStyle: React.CSSProperties = {
    listStyle: "none",
    display: "flex",
    gap: "1rem",
    margin: 0,
    padding: 0,
};

const linkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
};

export default Navbar;
