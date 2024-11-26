import { GetServerSideProps } from "next";
import axios from "axios";
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

interface HomeProps {
    articles: Article[];
    currentPage: number;
    totalPages: number;
}

const Home: React.FC<HomeProps> = ({ articles, currentPage, totalPages }) => {
    return (
        <div>
            <h1>ブログ記事一覧</h1>
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const page = context.query.page ? parseInt(context.query.page as string) : 1;
    const perPage = 10;

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`,
            {
                // ポート番号を変更
                params: { page, per_page: perPage },
            }
        );

        const articles: Article[] = response.data;
        const meta = response.data.meta;
        // console.log(meta)

        // const currentPage = meta.current_page;
        // const totalPages = meta.total_pages;

    console.log(articles)
        return {
            props: { articles },
        };
    } catch (error: any) {
        console.error(
            "記事の取得に失敗しました:",
            error.response?.data || error.message
        );
        return {
            props: { articles: [], currentPage: 1, totalPages: 1 },
        };
    }
};

export default Home;
