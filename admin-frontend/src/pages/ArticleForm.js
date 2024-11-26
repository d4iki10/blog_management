import React, { useState, useEffect } from "react";

const ArticleForm = ({ match, history }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    const isEdit = Boolean(match.params.id);

    useEffect(() => {
        const fetchData = async () => {
        const token = localStorage.getItem("token");
        const [categoriesRes, tagsRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/tags`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ]);
        setCategories(categoriesRes.data);
        setTags(tagsRes.data);

        if (isEdit) {
            const articleRes = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/articles/${match.params.id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
            );
            setTitle(articleRes.data.title);
            setContent(articleRes.data.content);
            setSelectedCategory(articleRes.data.category_id);
            setSelectedTags(articleRes.data.tag_ids);
        }
        };
        fetchData();
    }, [isEdit, match.params.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const payload = {
        title,
        content,
        category_id: selectedCategory,
        tag_ids: selectedTags,
        };
        try {
        if (isEdit) {
            await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/articles/${match.params.id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } else {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/articles`, payload, {
            headers: { Authorization: `Bearer ${token}` },
            });
        }
        history.push("/articles");
        } catch (error) {
        console.error("Error saving article:", error);
        alert("記事の保存に失敗しました。");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>{isEdit ? "記事編集" : "記事作成"}</h2>
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトル"
            required
        />
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="コンテンツ"
            required
        />
        <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
        >
            <option value="">カテゴリーを選択</option>
            {categories.map((category) => (
            <option key={category.id} value={category.id}>
                {category.name}
            </option>
            ))}
        </select>
        <div>
            {tags.map((tag) => (
            <label key={tag.id}>
                <input
                type="checkbox"
                value={tag.id}
                checked={selectedTags.includes(tag.id)}
                onChange={(e) => {
                    if (e.target.checked) {
                    setSelectedTags([...selectedTags, tag.id]);
                    } else {
                    setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                    }
                }}
                />
                {tag.name}
            </label>
            ))}
        </div>
        <button type="submit">{isEdit ? "更新" : "作成"}</button>
        </form>
    );
};

export default ArticleForm;
