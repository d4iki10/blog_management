import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
    const { apiRequest } = useAuth();
    const [stats, setStats] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
        try {
            const response = await apiRequest("/dashboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "統計情報の取得に失敗しました");
            }
            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError(err.message);
        }
        };

        fetchStats();
    }, [apiRequest]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-6">ダッシュボード</h2>
            {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                {error}
            </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-blue-100 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">記事数</h3>
                    <p className="text-3xl">{stats.articles_count || 0}</p>
                </div>
                <div className="p-6 bg-green-100 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">ユーザー数</h3>
                    <p className="text-3xl">{stats.users_count || 0}</p>
                </div>
                <div className="p-6 bg-yellow-100 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">カテゴリー数</h3>
                    <p className="text-3xl">{stats.categories_count || 0}</p>
                </div>
                <div className="p-6 bg-purple-100 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">タグ数</h3>
                    <p className="text-3xl">{stats.tags_count || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
