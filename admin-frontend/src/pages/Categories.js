import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Categories = () => {
    const { apiRequest } = useAuth();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const response = await apiRequest("/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "カテゴリーの取得に失敗しました");
            }
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        }
        };

        fetchCategories();
    }, [apiRequest]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const method = editingCategory ? "PUT" : "POST";
        const endpoint = editingCategory
            ? `/categories/${editingCategory.slug}`
            : "/categories";
        const response = await apiRequest(endpoint, {
            method,
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            category: {
                name,
                slug,
            },
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "カテゴリーの保存に失敗しました");
        }
        const data = await response.json();
        if (editingCategory) {
            setCategories(
            categories.map((cat) =>
                cat.slug === editingCategory.slug ? data : cat
            )
            );
        } else {
            setCategories([...categories, data]);
        }
        setName("");
        setSlug("");
        setEditingCategory(null);
        } catch (err) {
        setError(err.message);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setName(category.name);
        setSlug(category.slug);
    };

    const handleDelete = async (slug) => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
        const response = await apiRequest(`/categories/${slug}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "カテゴリーの削除に失敗しました");
        }
        setCategories(categories.filter((cat) => cat.slug !== slug));
        } catch (err) {
        setError(err.message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4">カテゴリー管理</h2>
            {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                {error}
            </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
                <label className="block text-gray-700">カテゴリー名:</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <div>
                <label className="block text-gray-700">スラッグ:</label>
                <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <div>
                <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                {editingCategory ? "更新" : "追加"}
                </button>
                {editingCategory && (
                <button
                    type="button"
                    onClick={() => {
                    setEditingCategory(null);
                    setName("");
                    setSlug("");
                    }}
                    className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
                >
                    キャンセル
                </button>
                )}
            </div>
            </form>
            <table className="min-w-full bg-white">
            <thead>
                <tr>
                <th className="py-2 px-4 border-b">名前</th>
                <th className="py-2 px-4 border-b">スラッグ</th>
                <th className="py-2 px-4 border-b">アクション</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{category.name}</td>
                    <td className="py-2 px-4 border-b">{category.slug}</td>
                    <td className="py-2 px-4 border-b flex item-center justify-center">
                    <button
                        onClick={() => handleEdit(category)}
                        className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                    >
                        編集
                    </button>
                    <button
                        onClick={() => handleDelete(category.slug)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                    >
                        削除
                    </button>
                    </td>
                </tr>
                ))}
                {categories.length === 0 && (
                <tr>
                    <td colSpan="3" className="text-center py-4">
                    カテゴリーがありません。
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
    );
};

export default Categories;
