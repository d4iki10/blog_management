import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ArticlePage = () => {
    const { category, slug } = useParams();
    const { apiRequest } = useAuth();

    const [article, setArticle] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchArticle = async () => {
        try {
            const response = await apiRequest(`/articles/${slug}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });

            if (response.ok) {
            const data = await response.json();
            setArticle(data);
            } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "記事の取得に失敗しました");
            }
        } catch (err) {
            setError(err.message);
        }
        };

        fetchArticle();
    }, [apiRequest, slug]);

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    if (!article) {
        return <div className="text-center mt-10">読み込み中...</div>;
    }

    // カテゴリ名からURLのスラッグを取得する場合は追加の処理が必要です
    // ここでは記事のカテゴリー名を表示しています
    return (
        <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-600 mb-2">カテゴリー: {article.category.name}</p>
        <p className="text-gray-600 mb-2">
            監修者: {article.supervisor ? article.supervisor.name : "なし"}
        </p>
        <div className="mt-6">
            {/* コンテンツをHTMLとして安全に表示 */}
            <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
        </div>
        </div>
    );
};

export default ArticlePage;
