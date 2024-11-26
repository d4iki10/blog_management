import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Articles = () => {
    const { apiRequest } = useAuth();
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
        const response = await apiRequest("/articles", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "記事の取得に失敗しました");
        }
        const data = await response.json();
        setArticles(data);
        } catch (err) {
        setError(err.message);
        }
    };

    const handleDelete = async (slug) => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
        const response = await apiRequest(`/articles/${slug}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "記事の削除に失敗しました");
        }
        setArticles(articles.filter((article) => article.slug !== slug));
        } catch (err) {
        setError(err.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">記事一覧</h2>
            <Link
                to="/articles/new"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
            >
                新規作成
            </Link>
            </div>
            {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                {error}
            </div>
            )}
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">タイトル</th>
                    <th className="py-2 px-4 border-b">カテゴリー</th>
                    <th className="py-2 px-4 border-b">監修者</th> {/* 追加 */}
                    <th className="py-2 px-4 border-b">作成日</th>
                    <th className="py-2 px-4 border-b">アクション</th>
                </tr>
                </thead>
                <tbody>
                {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{article.title}</td>
                    <td className="py-2 px-4 border-b">
                        {article.category?.name || "なし"}
                    </td>
                    <td className="py-2 px-4 border-b">
                        {article.supervisor?.name || "なし"}
                    </td>{" "}
                    {/* 追加 */}
                    <td className="py-2 px-4 border-b">
                        {new Date(article.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b flex item-center justify-center">
                        <Link
                        to={`/articles/edit/${article.slug}`}
                        className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                        >
                        編集
                        </Link>
                        <button
                        onClick={() => handleDelete(article.slug)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                        >
                        削除
                        </button>
                    </td>
                    </tr>
                ))}
                {articles.length === 0 && (
                    <tr>
                    <td colSpan="5" className="text-center py-4">
                        記事がありません。
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default Articles;
