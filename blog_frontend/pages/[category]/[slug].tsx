import axios from "axios";
import { GetServerSideProps } from "next";
import React from "react";

interface Article {
    id: number;
    title: string;
    content: string;
    slug: string;
    category: string;
    supervisor: string;
    tags: string[];
    created_at: string;
    updated_at: string;
}

interface ArticleProps {
    article: Article;
}

const ArticlePage = ({ article }: ArticleProps) => {
    return (
        <div>
        <h1>{article.title}</h1>
        <p>{article.content}</p>
        {/* その他のコンテンツ */}
        </div>
    );
    };

    export const getServerSideProps: GetServerSideProps = async (context) => {
    const { category, slug } = context.params!;

    try {
        const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${slug}`
        );
        const article: Article = response.data;

        return {
        props: {
            article,
        },
        };
    } catch (error) {
        console.error("Error fetching article:", error);
        return {
        notFound: true,
        };
    }
};

export default ArticlePage;
