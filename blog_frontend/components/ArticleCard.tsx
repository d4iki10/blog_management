import React from "react";
import Link from "next/link";

interface Article {
    id: number;
    title: string;
    slug: string;
    category: {
        name: string;
        slug: string;
    };
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    return (
        <div style={cardStyle}>
        <h2>
            <Link href={`/${article.category.slug}/${article.slug}`}>
            {article.title}
            </Link>
        </h2>
            <p>カテゴリ: {article.category.name}</p>
        </div>
    );
};

const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "1rem",
    margin: "1rem 0",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const titleStyle: React.CSSProperties = {
    color: "#333",
    textDecoration: "none",
};

export default ArticleCard;
