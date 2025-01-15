import { GetServerSideProps } from "next";
import React from "react";
import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";

interface Article {
    id: number;
    title: string;
    slug: string;
    updated_at: string;
    category: {
        name: string;
        slug: string;
    };
}

interface HomeProps {
    articles: Article[];
    currentPage: number;
    totalPages: number;
}

const Home: React.FC<HomeProps> = ({ articles, currentPage, totalPages }) => {
    // デバッグ: propsの中身を確認
    console.log("Home Props - Articles:", articles);
    console.log("Home Props - Current Page:", currentPage);
    console.log("Home Props - Total Pages:", totalPages);

    return (
        <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">最新記事</h1>
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
        console.log("Fetched Data:", data);

        if (!data) {
            throw new Error("API response is empty");
        }

        // データが配列の場合
        if (Array.isArray(data)) {
            // updated_atで降順にソート
            const sortedData = data.sort(
            (a: Article, b: Article) =>
                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );

            const totalPages = Math.ceil(sortedData.length / perPage) || 1;
            return {
                props: {
                    articles: sortedData,
                    currentPage: page,
                    totalPages: totalPages,
                },
            };
        }

        // データがオブジェクトで、articlesとmetaが存在する場合
        if (data.articles && data.meta) {
            const sortedArticles = data.articles.sort(
            (a: Article, b: Article) =>
                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );

            return {
                props: {
                    articles: sortedArticles,
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

export default Home;
