import { GetServerSideProps } from "next";
import React from "react";
import ArticleCard from "../../components/ArticleCard";
import Pagination from "../../components/Pagination";
import Link from "next/link";
import Head from "next/head";

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface Category {
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

interface TagPageProps {
    articles: Article[];
    currentPage: number;
    totalPages: number;
    tagName: string;
}

const TagPage: React.FC<TagPageProps> = ({
    articles,
    currentPage,
    totalPages,
    tagName,
}) => {
    return (
        <>
        <Head>
            <title>{tagName} タグの最新記事</title>
            <meta
            name="description"
            content={`${tagName} に関連する最新の記事一覧です。`}
            />
        </Head>
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{tagName} タグの最新記事</h1>
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
            basePath={`/tags/${encodeURIComponent(tagName.toLowerCase())}`}
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
        // 1. タグ情報の取得
        const tagResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags?slug=${encodeURIComponent(
            slug as string
            )}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!tagResponse.ok) {
            if (tagResponse.status === 404) {
                return { notFound: true };
            }
            throw new Error(`HTTP error! status: ${tagResponse.status}`);
        }

        const tags: Tag[] = await tagResponse.json();

        if (!tags || tags.length === 0) {
            return { notFound: true };
        }

        const tag = tags[0];

        // 2. 記事情報の取得
        const articlesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles?tag_id=${tag.id}&status=published&page=${page}&per_page=${perPage}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!articlesResponse.ok) {
            if (articlesResponse.status === 404) {
                // タグは存在するが記事が存在しない場合
                return {
                    props: {
                    articles: [],
                    currentPage: 1,
                    totalPages: 1,
                    tagName: tag.name,
                    },
                };
            }
            throw new Error(`HTTP error! status: ${articlesResponse.status}`);
        }

        const data = await articlesResponse.json();
        console.log("Fetched Tag Articles Data:", data);

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
            tagName: tag.name,
            },
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("タグ記事の取得に失敗しました:", error.message);
        } else {
            console.error("未知のエラーが発生しました");
        }
        return {
            props: {
                articles: [],
                currentPage: 1,
                totalPages: 1,
                tagName: slug as string,
            },
        };
    }
};

export default TagPage;
