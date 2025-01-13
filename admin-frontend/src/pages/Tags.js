import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Tags = () => {
    const { apiRequest } = useAuth();
    const [tags, setTags] = useState([]);
    const [name, setName] = useState("");
    const [editingTag, setEditingTag] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
        const response = await apiRequest("/tags", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "タグの取得に失敗しました");
        }
        const data = await response.json();
        setTags(data);
        } catch (err) {
        setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
        setError("タグ名を入力してください");
        return;
        }
        try {
        if (editingTag) {
            // 編集
            const response = await apiRequest(`/tags/${editingTag.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tag: { name } }),
            });
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "タグの更新に失敗しました");
            }
            const updatedTag = await response.json();
            setTags(
            tags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
            );
            setEditingTag(null);
        } else {
            // 追加
            const response = await apiRequest("/tags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tag: { name } }),
            });
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "タグの追加に失敗しました");
            }
            const newTag = await response.json();
            setTags([...tags, newTag]);
        }
        setName("");
        setError("");
        } catch (err) {
        setError(err.message);
        }
    };

    const handleEdit = (tag) => {
        setEditingTag(tag);
        setName(tag.name);
        setError("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
        const response = await apiRequest(`/tags/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "タグの削除に失敗しました");
        }
        setTags(tags.filter((tag) => tag.id !== id));
        } catch (err) {
        setError(err.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingTag(null);
        setName("");
        setError("");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-6">タグ管理</h2>
            {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                {error}
            </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
                <label className="block text-gray-700">タグ名:</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="タグの名前を入力"
                />
            </div>
            <div>
                <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                {editingTag ? "更新" : "追加"}
                </button>
                {editingTag && (
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
                {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{tag.id}</td>
                    <td className="py-2 px-4 border-b">{tag.name}</td>
                    <td className="py-2 px-4 border-b flex item-center justify-center">
                        <button
                        onClick={() => handleEdit(tag)}
                        className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                        >
                        編集
                        </button>
                        <button
                        onClick={() => handleDelete(tag.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                        >
                        削除
                        </button>
                    </td>
                    </tr>
                ))}
                {tags.length === 0 && (
                    <tr>
                    <td colSpan="3" className="text-center py-4">
                        タグが存在しません。
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default Tags;
