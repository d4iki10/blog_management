import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Articles = () => {
    const { apiRequest, currentUser } = useAuth();
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // useNavigateを追加

    // useCallbackでfetchArticlesをラップ
    const fetchArticles = useCallback(async () => {
        try {
            const response = await apiRequest(`/articles`, {
                // エンドポイントを修正
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(`Response Status: ${response.status}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "記事の取得に失敗しました");
            }
            const data = await response.json();
            console.log("Fetched articles data:", data);
            setArticles(data); // ActiveModelSerializers の場合、直接配列が返される
        } catch (err) {
            console.error("Error fetching articles:", err);
            setError(err.message);
        }
    }, [apiRequest]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]); // fetchArticlesを依存配列に追加

    const handleDelete = async (slug) => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
            const response = await apiRequest(`/articles/${slug}`, {
                // エンドポイントを修正
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(`Delete Response Status: ${response.status}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "記事の削除に失敗しました");
            }
            setArticles(articles.filter((article) => article.slug !== slug));
        } catch (err) {
            console.error("Error deleting article:", err); // 詳細なエラーログ
            setError(err.message);
        }
    };

    const handleAutoGenerate = () => {
        navigate("/articles/auto-generate"); // 自動生成ページに遷移
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">記事一覧</h2>
            <div className="flex space-x-4">
                <Link
                to="/articles/new"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                >
                新規作成
                </Link>
                <button
                onClick={handleAutoGenerate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                自動生成
                </button>
            </div>
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
                    <th className="py-2 px-4 border-b">スラッグ</th>
                    <th className="py-2 px-4 border-b">ステータス</th>
                    <th className="py-2 px-4 border-b">カテゴリー</th>
                    <th className="py-2 px-4 border-b">監修者</th>
                    <th className="py-2 px-4 border-b">作成日</th>
                    <th className="py-2 px-4 border-b">アクション</th>
                </tr>
                </thead>
                <tbody>
                {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">{article.title}</td>
                        <td className="py-2 px-4 border-b">{article.slug}</td>
                        <td className="py-2 px-4 border-b capitalize">
                            {article.status}
                        </td>
                        <td className="py-2 px-4 border-b">
                            {article.category ? article.category.name : "なし"}
                        </td>
                        <td className="py-2 px-4 border-b">
                            {article.supervisor ? article.supervisor.name : "なし"}
                        </td>
                        <td className="py-2 px-4 border-b">
                            {new Date(article.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border-b flex items-center justify-center">
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
                    <td colSpan="7" className="text-center py-4">
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
