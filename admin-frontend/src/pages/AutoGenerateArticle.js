import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AutoGenerateArticle = () => {
  const { apiRequest } = useAuth();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      article: {
        topic: keyword,
        tag_ids: [],
        // 不要なフィールドは省略
      },
    };

    try {
      const response = await apiRequest("/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 202 || response.status === 201) {
        alert("記事生成を開始しました。下書きが作成されます。");
        navigate("/articles");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.errors || "記事の生成に失敗しました");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">記事自動生成</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">キーワード:</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="記事のキーワードを入力"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "生成中..." : "記事生成"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/articles")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
          >
            キャンセル
          </button>
        </div>
        {/* キーワード例の追加 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            各検索意図の詳細とキーワード例の解説
          </h3>
          <ul className="space-y-6">
            {/* 情報収集型（Informational） */}
            <li>
              <strong className="text-blue-600">
                情報収集型（Informational）
              </strong>
              :<br />
              ユーザーが特定の情報や知識を得るために検索。
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                <li>「Python データ分析 初心者」</li>
                <li>「Docker 基礎知識」</li>
                <li>「機械学習 アルゴリズム 種類」</li>
              </ul>
            </li>

            {/* ナビゲーショナル型（Navigational） */}
            <li>
              <strong className="text-blue-600">
                ナビゲーショナル型（Navigational）
              </strong>
              :<br />
              特定のウェブサイトやページにアクセスするための検索。
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                <li>「GitHub リポジトリ 作成方法」</li>
                <li>「Google Cloud ドキュメント」</li>
                <li>「Microsoft Azure ポータル ログイン」</li>
              </ul>
            </li>

            {/* トランザクショナル型（Transactional） */}
            <li>
              <strong className="text-blue-600">
                トランザクショナル型（Transactional）
              </strong>
              :<br />
              購入やサービス利用など、具体的な行動を目的とした検索。
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                <li>「AWS 認定資格 取得 方法」</li>
                <li>「Visual Studio Code プロ版 購入」</li>
                <li>「サーバー監視ツール 購入 比較」</li>
              </ul>
            </li>

            {/* 商業調査型（Commercial Investigation） */}
            <li>
              <strong className="text-blue-600">
                商業調査型（Commercial Investigation）
              </strong>
              :<br />
              購入前の比較や評価を行うための検索。
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                <li>「CI/CD ツール 比較 2024」</li>
                <li>「クラウドストレージ サービス 比較」</li>
                <li>「オープンソース ソフトウェア 商用ソフトウェア 比較」</li>
              </ul>
            </li>

            {/* 技術解説型 */}
            <li>
              <strong className="text-blue-600">技術解説型</strong>:<br />
              特定の技術やツールの使い方、設定方法を知りたいユーザー向け。
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                <li>「Kubernetes セットアップ 方法」</li>
                <li>「React Hooks 使用方法」</li>
                <li>「Node.js 非同期処理 実装」</li>
              </ul>
            </li>

            {/* ベストプラクティス型 */}
            <li>
              <strong className="text-blue-600">ベストプラクティス型</strong>:
              <br />
              効率的な開発手法やベストプラクティスを探しているユーザー向け。
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                <li>「セキュアなWebアプリ開発 ベストプラクティス」</li>
                <li>「アジャイル開発 効果的 実践方法」</li>
                <li>「コードレビュー ベストプラクティス」</li>
              </ul>
            </li>

            {/* 問題解決型 */}
            <li>
              <strong className="text-blue-600">問題解決型</strong>:<br />
              技術的な問題やエラーの解決方法を検索しているユーザー向け。
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                <li>「Python インデックスエラー 解決」</li>
                <li>「React アプリ ビルドできない 原因」</li>
                <li>「Docker コンテナ 起動しない 対処法」</li>
              </ul>
            </li>

            {/* レビュー型 */}
            <li>
              <strong className="text-blue-600">レビュー型</strong>:<br />
              新しい技術やツールのレビューを探しているユーザー向け。
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                <li>「最新 フロントエンドフレームワーク 比較 レビュー」</li>
                <li>「Visual Studio Code 拡張機能 レビュー」</li>
                <li>「AWS Lambda 評価」</li>
              </ul>
            </li>

            {/* 最新情報型 */}
            <li>
              <strong className="text-blue-600">最新情報型</strong>:<br />
              最新の技術動向やトレンドを追い求めているユーザー向け。
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                <li>「2024年 プログラミング言語 トレンド」</li>
                <li>「AI技術 最新動向」</li>
                <li>「最新 セキュリティ脅威 対策」</li>
              </ul>
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default AutoGenerateArticle;
