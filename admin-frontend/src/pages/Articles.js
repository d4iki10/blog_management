// admin-frontend/src/pages/Articles.js
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Articles = () => {
    const { apiRequest, currentUser } = useAuth();
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // 選択された記事のスラッグを管理する状態
    const [selectedSlugs, setSelectedSlugs] = useState([]);

    // 記事を取得する関数をuseCallbackでラップ
    const fetchArticles = useCallback(async () => {
        try {
        const response = await apiRequest(`/articles`, {
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
        setArticles(data);
        } catch (err) {
        console.error("Error fetching articles:", err);
        setError(err.message);
        }
    }, [apiRequest]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    // 単一の記事を削除する関数
    const handleDelete = async (slug) => {
        try {
        const response = await apiRequest(`/articles/${slug}`, {
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
        setArticles((prevArticles) =>
            prevArticles.filter((article) => article.slug !== slug)
        );
        setSelectedSlugs((prevSelected) =>
            prevSelected.filter((s) => s !== slug)
        );
        } catch (err) {
        console.error("Error deleting article:", err);
        setError(err.message);
        }
    };

    // 複数の記事を削除する関数
    const handleBulkDelete = async () => {
        if (selectedSlugs.length === 0) {
        alert("削除する記事を選択してください。");
        return;
        }

        if (!window.confirm("選択した記事を本当に削除しますか？")) return;

        try {
        // 逐一削除する場合
        for (const slug of selectedSlugs) {
            const response = await apiRequest(`/articles/${slug}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            });
            console.log(`Delete Response Status for ${slug}: ${response.status}`);
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.error || `記事 ${slug} の削除に失敗しました`
            );
            }
        }

        // 全削除後に記事一覧を更新
        setArticles((prevArticles) =>
            prevArticles.filter((article) => !selectedSlugs.includes(article.slug))
        );
        setSelectedSlugs([]); // 選択状態をリセット
        } catch (err) {
        console.error("Error deleting articles:", err);
        setError(err.message);
        }
    };

    // 自動生成ページに遷移する関数
    const handleAutoGenerate = () => {
        navigate("/articles/auto-generate");
    };

    // チェックボックスの変更を処理する関数
    const handleCheckboxChange = (e, slug) => {
        if (e.target.checked) {
        setSelectedSlugs((prev) => [...prev, slug]);
        } else {
        setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
        }
    };

    // 全選択チェックボックスの変更を処理する関数
    const handleSelectAllChange = (e) => {
        if (e.target.checked) {
        const allSlugs = articles.map((article) => article.slug);
        setSelectedSlugs(allSlugs);
        } else {
        setSelectedSlugs([]);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">記事一覧</h2>
        </div>
        {/* 「選択した記事を削除」ボタンの追加 */}
        <div className="mb-4 flex space-x-4">
            <button
            onClick={handleBulkDelete}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none ${
                selectedSlugs.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={selectedSlugs.length === 0}
            >
            選択した記事を削除
            </button>
            {/* 既存のボタンを再配置する場合は必要に応じて追加 */}
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
        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
            </div>
        )}
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
            <thead>
                <tr>
                {/* 全選択用のチェックボックス */}
                <th className="py-2 px-4 border-b text-center">
                    <input
                    type="checkbox"
                    onChange={handleSelectAllChange}
                    checked={
                        selectedSlugs.length === articles.length &&
                        articles.length > 0
                    }
                    />
                </th>
                <th className="py-2 px-4 border-b">タイトル</th>
                <th className="py-2 px-4 border-b">スラッグ</th>
                <th className="py-2 px-4 border-b">ステータス</th>
                <th className="py-2 px-4 border-b">カテゴリー</th>
                <th className="py-2 px-4 border-b">監修者</th>
                <th className="py-2 px-4 border-b">作成日</th>
                </tr>
            </thead>
            <tbody>
                {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-100">
                    {/* チェックボックス */}
                    <td className="py-2 px-4 border-b text-center">
                    <input
                        type="checkbox"
                        checked={selectedSlugs.includes(article.slug)}
                        onChange={(e) => handleCheckboxChange(e, article.slug)}
                    />
                    </td>
                    {/* タイトルをリンクに変更 */}
                    <td className="py-2 px-4 border-b">
                    <Link
                        to={`/articles/edit/${article.slug}`}
                        className="text-blue-600 hover:underline"
                    >
                        {article.title}
                    </Link>
                    </td>
                    <td className="py-2 px-4 border-b">{article.slug}</td>
                    <td className="py-2 px-4 border-b">{article.status}</td>
                    <td className="py-2 px-4 border-b">
                    {article.category ? article.category.name : "なし"}
                    </td>
                    <td className="py-2 px-4 border-b">
                    {article.supervisor ? article.supervisor.name : "なし"}
                    </td>
                    <td className="py-2 px-4 border-b">
                    {new Date(article.created_at).toLocaleDateString()}
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
