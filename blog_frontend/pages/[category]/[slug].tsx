import { GetServerSideProps } from "next";
import React from "react";

interface Article {
    id: number;
    title: string;
    content: string;
    slug: string;
    category: {
        name: string;
        slug: string;
    };
    supervisor?: {
        name: string;
    };
    tags: string[];
    created_at: string;
    updated_at: string;
}

interface ArticleProps {
    article: Article;
}

const ArticlePage: React.FC<ArticleProps> = ({ article }) => {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <p className="text-gray-600 mb-2">
            カテゴリー: {article.category.name}
            </p>
            <p className="text-gray-600 mb-4">
            監修者: {article.supervisor?.name || "なし"}
            </p>
            <div className="prose prose-lg">{article.content}</div>
            <div className="mt-4">
            <h3 className="text-xl font-semibold">タグ:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {article.tags.map((tag, index) => (
                <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                >
                    {tag}
                </span>
                ))}
            </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { category, slug } = context.params!;
    const publicToken = process.env.NEXT_PUBLIC_API_PUBLIC_TOKEN || "";

    try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${slug}`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            // 認証トークンは不要のため、Authorizationヘッダーは含めない
            },
        }
        );

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || "記事の取得に失敗しました");
        }

        const article: Article = await response.json();

        return {
        props: {
            article,
        },
        };
    } catch (error: any) {
        console.error("記事の取得に失敗しました:", error.message);
        return {
        notFound: true,
        };
    }
};

export default ArticlePage;
