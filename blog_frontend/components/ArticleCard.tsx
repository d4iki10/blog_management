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
        <div className="bg-white p-6 mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        {/* 記事タイトル */}
        <h2 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-500 transition duration-200">
            <Link href={`/articles/${article.slug}`}>
            {article.title}
            </Link>
        </h2>
        {/* カテゴリ */}
        <p className="text-sm text-gray-600">
            カテゴリ:{" "}
            <Link
            href={`/category/${article.category.slug}`}
            className="text-blue-500 hover:underline"
            >
            {article.category.name}
            </Link>
        </p>
        </div>
    );
};

export default ArticleCard;
