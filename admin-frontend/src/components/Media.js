import React, { useState, useEffect, useCallback } from "react";
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
    const fetchMedia = useCallback(async () => {
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
    }, [token]);

    useEffect(() => {
        if (token) {
        // トークンがある場合にのみフェッチ
        fetchMedia();
        }
    }, [token, fetchMedia]);

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

    // 詳細表示ハンドラ
    const handleDetail = (media) => {
        setSelectedMedia(media);
    };

    // 詳細ポップアップを閉じる
    const closeDetail = () => {
        setSelectedMedia(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-6">画像管理</h2>

            {/* エラーメッセージ */}
            {error && (
            <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
                {error}
            </div>
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
            <h3 className="text-md font-semibold mb-2">既存の画像:</h3>
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
                        type="button"
                        onClick={() => onImageSelect && onImageSelect(media)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        title="アイキャッチに追加"
                        >
                        追加
                        </button>
                        <button
                        type="button"
                        onClick={() => handleDetail(media)}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        title="詳細"
                        >
                        詳細
                        </button>
                        <button
                        type="button"
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
                <div className="mt-2">
                    <strong>名前:</strong> {selectedMedia.filename}
                </div>
                <div className="mt-2">
                    <strong>サイズ:</strong>{" "}
                    {(selectedMedia.byte_size / 1024).toFixed(2)} KB
                </div>
                <div className="flex items-center space-x-2 mt-2">
                    <strong>URL:</strong>

                    {/* 1行で省略表示する部分 */}
                    <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                    <a
                        href={selectedMedia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {selectedMedia.url}
                    </a>
                    </div>

                    {/* クリップボードコピー用ボタン + アイコン */}
                    <button
                    type="button"
                    onClick={() => {
                        navigator.clipboard
                        .writeText(selectedMedia.url)
                        .then(() => alert("URLをコピーしました"))
                        .catch(() => alert("コピーに失敗しました"));
                    }}
                    className="flex items-center px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                    {/* Heroicons のクリップボードアイコン例 */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                        fillRule="evenodd"
                        d="M8 2a2 2 0 00-2 2v1H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H8zm0 2h3a.5.5 0 01.5.5V5H7v-.5A.5.5 0 018 4zm2 5a.5.5 0 000 1h3a.5.5 0 000-1h-4z"
                        clipRule="evenodd"
                        />
                    </svg>
                    <span className="ml-1 text-sm text-gray-700">
                        URLをコピー
                    </span>
                    </button>
                </div>
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
