import { GetServerSideProps } from "next";
import React from "react";
import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";

interface Article {
    id: number;
    title: string;
    slug: string;
    category: {
        name: string;
        slug: string;
    };
}

interface ArticlesProps {
    articles: Article[];
    currentPage: number;
    totalPages: number;
}

const ArticlesPage: React.FC<ArticlesProps> = ({
    articles,
    currentPage,
    totalPages,
}) => {
    return (
        <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">記事一覧</h1>
        {articles.length > 0 ? (
            articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
            ))
        ) : (
            <p>記事がありません。</p>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const page = context.query.page ? parseInt(context.query.page as string) : 1;
    const perPage = 10;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles?page=${page}&per_page=${perPage}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();
        console.log("Fetched Data1:", data);

        if (!data) {
            throw new Error("API response is empty");
        }

        // データが配列の場合
        if (Array.isArray(data)) {
            const totalPages = Math.ceil(data.length / perPage) || 1;
            return {
                props: {
                    articles: data,
                    currentPage: page,
                    totalPages: totalPages,
                },
            };
        }

        // データがオブジェクトで、articlesとmetaが存在する場合
        if (data.articles && data.meta) {
            return {
                props: {
                    articles: data.articles,
                    currentPage: data.meta.current_page,
                    totalPages: data.meta.total_pages,
                },
            };
        }

        throw new Error("API response structure is unexpected");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("記事の取得に失敗しました:", error.message);
        } else {
            console.error("未知のエラーが発生しました");
        }
        return {
            props: { articles: [], currentPage: 1, totalPages: 1 },
        };
    }
};

export default ArticlesPage;
