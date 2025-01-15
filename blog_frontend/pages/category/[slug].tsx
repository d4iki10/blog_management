import { GetServerSideProps } from "next";
import React from "react";
import ArticleCard from "../../components/ArticleCard";
import Pagination from "../../components/Pagination";
import Link from "next/link";
import Head from "next/head";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    updated_at: string;
    category: Category;
    tags: Tag[];
    content: string;
    status: string;
    meta_title?: string;
    meta_description?: string;
    featured_image_url?: string;
}

interface Meta {
    current_page: number;
    total_pages: number;
    per_page: number;
    total_count: number;
}

interface CategoryPageProps {
    articles: Article[];
    currentPage: number;
    totalPages: number;
    categoryName: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
    articles,
    currentPage,
    totalPages,
    categoryName,
}) => {
    return (
        <>
        <Head>
            <title>{categoryName} の最新記事</title>
            <meta
            name="description"
            content={`${categoryName} に関連する最新の記事一覧です。`}
            />
        </Head>
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{categoryName} の最新記事</h1>
            {articles.length > 0 ? (
            articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))
            ) : (
            <p>該当する記事がありません。</p>
            )}
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/category/${encodeURIComponent(
                categoryName.toLowerCase()
            )}`}
            />
            <div className="mt-6">
            <Link href="/">
                <span className="text-blue-500 hover:underline cursor-pointer">
                &larr; ホームに戻る
                </span>
            </Link>
            </div>
        </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params!;
    const page = context.query.page ? parseInt(context.query.page as string) : 1;
    const perPage = 10;

    try {
        // 1. カテゴリ情報の取得（スラッグからカテゴリIDを取得）
        const categoryResponse = await fetch(
        `${
            process.env.NEXT_PUBLIC_API_BASE_URL
        }/categories?slug=${encodeURIComponent(slug as string)}`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        }
        );

        if (!categoryResponse.ok) {
        if (categoryResponse.status === 404) {
            return { notFound: true };
        }
        throw new Error(`HTTP error! status: ${categoryResponse.status}`);
        }

        const categories: Category[] = await categoryResponse.json();

        if (!categories || categories.length === 0) {
        return { notFound: true };
        }

        const category = categories[0];

        // 2. 記事情報の取得（カテゴリIDとステータスでフィルタリング）
        const articlesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles?category_id=${category.id}&status=published&page=${page}&per_page=${perPage}`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        }
        );

        if (!articlesResponse.ok) {
        if (articlesResponse.status === 404) {
            // カテゴリは存在するが記事が存在しない場合
            return {
            props: {
                articles: [],
                currentPage: 1,
                totalPages: 1,
                categoryName: category.name,
            },
            };
        }
        throw new Error(`HTTP error! status: ${articlesResponse.status}`);
        }

        const data = await articlesResponse.json();
        console.log("Fetched Category Articles Data:", data);

        let articles: Article[] = [];
        let meta: Meta = {
        current_page: 1,
        total_pages: 1,
        per_page: perPage,
        total_count: 0,
        };

        if (Array.isArray(data)) {
        // APIが配列を返す場合
        articles = data.sort(
            (a: Article, b: Article) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        meta.total_count = articles.length;
        meta.total_pages = Math.ceil(meta.total_count / perPage) || 1;
        articles = articles.slice((page - 1) * perPage, page * perPage);
        } else if (data.articles && data.meta) {
        // APIがオブジェクトを返す場合
        articles = data.articles.sort(
            (a: Article, b: Article) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        meta = data.meta;
        } else {
        throw new Error("API response structure is unexpected");
        }

        return {
        props: {
            articles,
            currentPage: meta.current_page,
            totalPages: meta.total_pages,
            categoryName: category.name,
        },
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("カテゴリ記事の取得に失敗しました:", error.message);
        } else {
            console.error("未知のエラーが発生しました");
        }
        return {
            props: {
                articles: [],
                currentPage: 1,
                totalPages: 1,
                categoryName: slug as string,
            },
        };
    }
};

export default CategoryPage;
