// admin-frontend/src/components/Media.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Media = ({ onImageSelect, onImageInsert }) => {
    const { token } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [selectedMedia, setSelectedMedia] = useState(null); // 詳細ポップアップ用

    // メディア一覧を取得
    const fetchMedia = async () => {
        setLoading(true);
        try {
        const response = await fetch("/api/v1/media", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 認証ヘッダーを追加
            },
        });
        if (response.ok) {
            const data = await response.json();
            setMediaList(data);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "メディアの取得に失敗しました。");
        }
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
        // トークンがある場合にのみフェッチ
        fetchMedia();
        }
    }, [token]);

    // ファイル選択ハンドラ
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // アップロードハンドラ
    const handleUpload = async () => {
        if (!selectedFile) {
        setError("ファイルを選択してください。");
        return;
        }

        setUploading(true);
        setError("");

        try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch("/api/v1/media/upload", {
            method: "POST",
            body: formData,
            headers: {
            Authorization: `Bearer ${token}`, // 認証ヘッダーを追加
            },
        });

        const data = await response.json();

        if (response.ok) {
            setMediaList([data, ...mediaList]); // 新しい画像をリストに追加
            setSelectedFile(null);
            if (onImageSelect) onImageSelect(data); // 親コンポーネントに選択を通知
        } else {
            setError(data.error || "アップロードに失敗しました。");
        }
        } catch (err) {
        setError("アップロード中にエラーが発生しました。");
        } finally {
        setUploading(false);
        }
    };

    // 画像削除ハンドラ
    const handleDelete = async (id) => {
        if (!window.confirm("この画像を削除してもよろしいですか？")) return;

        try {
        const response = await fetch(`/api/v1/media/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 認証ヘッダーを追加
            },
        });

        const data = await response.json();

        if (response.ok) {
            setMediaList(mediaList.filter((media) => media.id !== id));
        } else {
            throw new Error(data.error || "削除に失敗しました。");
        }
        } catch (err) {
        setError(err.message);
        }
    };

    // 画像選択ハンドラ
    const handleSelect = (media) => {
        if (onImageSelect) onImageSelect(media);
    };

    // 画像挿入ハンドラ
    const handleInsert = (media) => {
        if (onImageInsert) onImageInsert(media.url);
    };

    // 詳細表示ハンドラ
    const handleDetail = (media) => {
        setSelectedMedia(media);
    };

    // 詳細ポップアップを閉じる
    const closeDetail = () => {
        setSelectedMedia(null);
    };

    return (
        <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">画像管理</h3>

        {/* エラーメッセージ */}
        {error && (
            <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {/* 画像アップロードセクション */}
        <div className="mb-4">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className={`ml-2 px-4 py-2 bg-blue-600 text-white rounded ${
                uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            >
            {uploading ? "アップロード中..." : "アップロード"}
            </button>
        </div>

        {/* メディア一覧セクション */}
        <div>
            <h4 className="text-md font-semibold mb-2">既存の画像</h4>
            {loading ? (
            <div>読み込み中...</div>
            ) : mediaList.length === 0 ? (
            <div>アップロードされた画像はありません。</div>
            ) : (
            <div className="grid grid-cols-3 gap-4">
                {mediaList.map((media) => (
                <div key={media.id} className="border p-2 rounded relative">
                    <img
                    src={media.url}
                    alt={media.filename}
                    className="w-full h-32 object-cover rounded"
                    />
                    <div className="mt-2 text-sm">
                    <p>
                        <strong>名前:</strong> {media.filename}
                    </p>
                    <p>
                        <strong>サイズ:</strong>{" "}
                        {(media.byte_size / 1024).toFixed(2)} KB
                    </p>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                        onClick={() => handleSelect(media)}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        title="選択"
                    >
                        選択
                    </button>
                    <button
                        onClick={() => handleInsert(media)}
                        className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                        title="Markdownに挿入"
                    >
                        挿入
                    </button>
                    <button
                        onClick={() => handleDetail(media)}
                        className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                        title="詳細"
                    >
                        詳細
                    </button>
                    <button
                        onClick={() => handleDelete(media.id)}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        title="削除"
                    >
                        削除
                    </button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {/* 詳細ポップアップ */}
        {selectedMedia && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-md w-1/2">
                <h2 className="text-lg font-semibold mb-2">画像詳細</h2>
                <img
                src={selectedMedia.url}
                alt={selectedMedia.filename}
                className="w-full h-auto mb-4"
                />
                <p>
                <strong>名前:</strong> {selectedMedia.filename}
                </p>
                <p>
                <strong>サイズ:</strong>{" "}
                {(selectedMedia.byte_size / 1024).toFixed(2)} KB
                </p>
                <p>
                <strong>URL:</strong>{" "}
                </p>
                <p>
                <a
                    href={selectedMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    {selectedMedia.url}
                </a>
                </p>
                <button
                onClick={closeDetail}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                >
                閉じる
                </button>
            </div>
            </div>
        )}
        </div>
    );
};

export default Media;
