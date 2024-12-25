import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MarkdownEditor from "../components/MarkdownEditor"; // 追加
import Media from "../components/Media"; // 追加

const ArticleForm = () => {
    const { slug } = useParams();
    const isEditing = Boolean(slug);
    const navigate = useNavigate();
    const { apiRequest } = useAuth();

    const [title, setTitle] = useState("");
    const [slugInput, setSlugInput] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [supervisorId, setSupervisorId] = useState("");
    const [categories, setCategories] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [status, setStatus] = useState("draft");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [featuredImageUrl, setFeaturedImageUrl] = useState(""); // アイキャッチ画像URL
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // loadingステートを追加

    const fetchCategories = useCallback(async () => {
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
    }, [apiRequest]);

    const fetchSupervisors = useCallback(async () => {
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
    }, [apiRequest]);

    const fetchTags = useCallback(async () => {
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
    }, [apiRequest]);

    const fetchArticle = useCallback(async () => {
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
        setSlugInput(data.slug || "");
        setContent(data.content);
        setCategoryId(data.category ? data.category.id : "");
        setSupervisorId(data.supervisor ? data.supervisor.id : "");
        setSelectedTagIds(data.tags.map((tag) => tag.id));
        setStatus(data.status || "draft");
        setMetaTitle(data.meta_title || data.title); // Meta Titleを設定
        setMetaDescription(
            data.meta_description ||
            (data.content ? data.content.split("\n")[0].slice(0, 160) : "")
        ); // Meta Descriptionを設定（序文の最初の行を使用）
        setFeaturedImageUrl(data.featured_image_url || ""); // アイキャッチ画像のURLを設定
        } catch (err) {
        setError(err.message);
        }
    }, [apiRequest, slug]);

    useEffect(() => {
        fetchCategories();
        fetchSupervisors();
        fetchTags();
        if (isEditing) {
        fetchArticle();
        // 5秒後にもう一度記事を再取得する
        const timerId = setTimeout(() => {
            fetchArticle();
        }, 5000);
        return () => clearTimeout(timerId);
        }
    }, [fetchCategories, fetchSupervisors, fetchTags, fetchArticle, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // ローディング開始
        setError("");

        try {
        const method = isEditing ? "PUT" : "POST";
        const endpoint = isEditing ? `/articles/${slug}` : "/articles";

        // 作成時と編集時で送信するデータを分ける
        const articleData = {
            title,
            slug: slugInput,
            content,
            status,
            category_id: categoryId || null,
            supervisor_id: supervisorId || null,
            tag_ids: selectedTagIds,
            meta_title: metaTitle,
            meta_description: metaDescription,
            featured_image_url: featuredImageUrl, // アイキャッチ画像のURLを送信
        };

        const response = await apiRequest(endpoint, {
            method,
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            article: articleData,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
            errorData.error && Array.isArray(errorData.error)
                ? errorData.error.join(", ")
                : errorData.error || "記事の保存に失敗しました"
            );
        }
        // 成功したらリダイレクト
        navigate("/articles");
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false); // ローディング終了
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

    const handleImageSelect = (image) => {
        // アイキャッチ画像として設定
        setFeaturedImageUrl(image.url);
    };

    const handleImageInsert = (url) => {
        // 記事内容に画像を挿入（Markdown形式）
        setContent((prevContent) => `${prevContent}\n\n![image](${url})\n\n`);
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
                <label className="block text-gray-700">スラッグ:</label>
                <input
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="記事のスラッグを入力"
                />
            </div>
            <div>
                <label className="block text-gray-700">内容 (Markdown):</label>
                <MarkdownEditor value={content} onChange={setContent} />
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
            {/* アイキャッチ画像の追加 */}
            <Media
                onImageSelect={handleImageSelect}
                onImageInsert={handleImageInsert}
            />
            {featuredImageUrl && (
                <div className="mb-4">
                <img
                    src={featuredImageUrl}
                    alt="アイキャッチ画像"
                    className="w-full h-auto rounded"
                />
                </div>
            )}
            {/* SEOメタデータの追加 */}
            <div>
                <label className="block text-gray-700">Meta Title:</label>
                <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Meta Titleを入力"
                />
            </div>
            <div>
                <label className="block text-gray-700">Meta Description:</label>
                <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Meta Descriptionを入力（160文字以内）"
                ></textarea>
            </div>
            <div className="flex space-x-4">
                <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                >
                {loading ? "保存中..." : isEditing ? "更新" : "作成"}
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
