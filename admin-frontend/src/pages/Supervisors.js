import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Supervisors = () => {
    const { apiRequest } = useAuth();
    const [supervisors, setSupervisors] = useState([]);
    const [name, setName] = useState("");
    const [editingSupervisor, setEditingSupervisor] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSupervisors();
    }, []);

    const fetchSupervisors = async () => {
        try {
        const response = await apiRequest("/supervisors", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "監修者の取得に失敗しました");
        }
        const data = await response.json();
        setSupervisors(data);
        } catch (err) {
        setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
        setError("監修者名を入力してください");
        return;
        }
        try {
        if (editingSupervisor) {
            // 編集
            const response = await apiRequest(
            `/supervisors/${editingSupervisor.id}`,
            {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ supervisor: { name } }),
            }
            );
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "監修者の更新に失敗しました");
            }
            const updatedSupervisor = await response.json();
            setSupervisors(
            supervisors.map((sup) =>
                sup.id === updatedSupervisor.id ? updatedSupervisor : sup
            )
            );
            setEditingSupervisor(null);
        } else {
            // 追加
            const response = await apiRequest("/supervisors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ supervisor: { name } }),
            });
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "監修者の追加に失敗しました");
            }
            const newSupervisor = await response.json();
            setSupervisors([...supervisors, newSupervisor]);
        }
        setName("");
        setError("");
        } catch (err) {
        setError(err.message);
        }
    };

    const handleEdit = (supervisor) => {
        setEditingSupervisor(supervisor);
        setName(supervisor.name);
        setError("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
        const response = await apiRequest(`/supervisors/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "監修者の削除に失敗しました");
        }
        setSupervisors(supervisors.filter((sup) => sup.id !== id));
        } catch (err) {
        setError(err.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingSupervisor(null);
        setName("");
        setError("");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-6">監修者管理</h2>
            {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                {error}
            </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
                <label className="block text-gray-700">監修者名:</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="監修者の名前を入力"
                />
            </div>
            <div>
                <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                {editingSupervisor ? "更新" : "追加"}
                </button>
                {editingSupervisor && (
                <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
                >
                    キャンセル
                </button>
                )}
            </div>
            </form>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">名前</th>
                    <th className="py-2 px-4 border-b">アクション</th>
                </tr>
                </thead>
                <tbody>
                {supervisors.map((sup) => (
                    <tr key={sup.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{sup.id}</td>
                    <td className="py-2 px-4 border-b">{sup.name}</td>
                    <td className="py-2 px-4 border-b flex item-center justify-center">
                        <button
                        onClick={() => handleEdit(sup)}
                        className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                        >
                        編集
                        </button>
                        <button
                        onClick={() => handleDelete(sup.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                        >
                        削除
                        </button>
                    </td>
                    </tr>
                ))}
                {supervisors.length === 0 && (
                    <tr>
                    <td colSpan="3" className="text-center py-4">
                        監修者が存在しません。
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default Supervisors;
