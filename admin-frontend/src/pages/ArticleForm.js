import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ArticleForm = () => {
    const { slug } = useParams();
    const isEditing = Boolean(slug);
    const navigate = useNavigate();
    const { apiRequest } = useAuth();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [supervisorId, setSupervisorId] = useState(""); // 追加
    const [categories, setCategories] = useState([]);
    const [supervisors, setSupervisors] = useState([]); // 追加
    const [tags, setTags] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [status, setStatus] = useState("draft"); // 追加
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
        fetchSupervisors(); // 追加
        fetchTags();
        if (isEditing) {
        fetchArticle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiRequest, slug, isEditing]);

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

    const fetchSupervisors = async () => {
        // 追加
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

    const fetchArticle = async () => {
        try {
        const response = await apiRequest(`/articles/${slug}`, {
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
        setTitle(data.title);
        setContent(data.content);
        setCategoryId(data.category ? data.category.id : "");
        setSupervisorId(data.supervisor ? data.supervisor.id : ""); // 追加
        setSelectedTagIds(data.tags.map((tag) => tag.id));
        setStatus(data.status || "draft"); // 追加
        } catch (err) {
        setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const method = isEditing ? "PUT" : "POST";
        const endpoint = isEditing ? `/articles/${slug}` : "/articles";
        const response = await apiRequest(endpoint, {
            method,
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            article: {
                title,
                content,
                category_id: categoryId || null, // カテゴリが未選択の場合は null
                supervisor_id: supervisorId || null, // 監修者が未選択の場合は null
                tag_ids: selectedTagIds,
                slug: slugify(title),
                status, // 追加
            },
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
            errorData.errors.join(", ") || "記事の保存に失敗しました"
            );
        }
        // 成功したらリダイレクト
        navigate("/articles");
        } catch (err) {
        setError(err.message);
        }
    };

    const handleTagChange = (e) => {
        const id = parseInt(e.target.value, 10);
        if (e.target.checked) {
        setSelectedTagIds([...selectedTagIds, id]);
        } else {
        setSelectedTagIds(selectedTagIds.filter((tagId) => tagId !== id));
        }
    };

    const slugify = (text) => {
        return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "記事編集" : "記事作成"}
        </h2>
        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-gray-700">タイトル:</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="記事のタイトルを入力"
            />
            </div>
            <div>
            <label className="block text-gray-700">内容:</label>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="6"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="記事の内容を入力"
            ></textarea>
            </div>
            <div>
            <label className="block text-gray-700">カテゴリー:</label>
            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
                <option value="">選択しない</option>
                {categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {category.name}
                </option>
                ))}
            </select>
            </div>
            <div>
            <label className="block text-gray-700">監修者:</label> {/* 追加 */}
            <select
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
                <option value="">選択しない</option>
                {supervisors.map((sup) => (
                <option key={sup.id} value={sup.id}>
                    {sup.name}
                </option>
                ))}
            </select>
            </div>
            <div>
            <label className="block text-gray-700 mb-2">タグ:</label>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                <label key={tag.id} className="inline-flex items-center">
                    <input
                    type="checkbox"
                    value={tag.id}
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={handleTagChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{tag.name}</span>
                </label>
                ))}
            </div>
            </div>
            <div>
            <label className="block text-gray-700">ステータス:</label>{" "}
            {/* 追加 */}
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
                <option value="draft">下書き</option>
                <option value="published">公開</option>
            </select>
            </div>
            <div className="flex space-x-4">
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
                {isEditing ? "更新" : "作成"}
            </button>
            <button
                type="button"
                onClick={() => navigate("/articles")}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
            >
                キャンセル
            </button>
            </div>
        </form>
        </div>
    );
};

export default ArticleForm;
