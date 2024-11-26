import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [stats, setStats] = useState({ articles: 0, users: 0 });

    useEffect(() => {
        const fetchStats = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/dashboard`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        setStats(response.data);
        };
        fetchStats();
    }, []);

    return (
        <div>
        <h2>ダッシュボード</h2>
        <p>記事数: {stats.articles}</p>
        <p>ユーザー数: {stats.users}</p>
        </div>
    );
};

export default Dashboard;
