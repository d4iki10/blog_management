import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Articles = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/articles`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        setArticles(response.data);
        };
        fetchArticles();
    }, []);

    return (
        <div>
        <h2>記事管理</h2>
        <Link to="/articles/new">新規作成</Link>
        <ul>
            {articles.map((article) => (
            <li key={article.id}>
                {article.title}
                <Link to={`/articles/edit/${article.id}`}>編集</Link>
                <button
                onClick={async () => {
                    const token = localStorage.getItem("token");
                    await axios.delete(
                    `${process.env.REACT_APP_API_BASE_URL}/articles/${article.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                    );
                    setArticles(articles.filter((a) => a.id !== article.id));
                }}
                >
                削除
                </button>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default Articles;
