import { GetServerSideProps } from "next";
import Link from "next/link";
import Head from "next/head";
import React from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import remarkGfm from "remark-gfm"; // GitHub Flavored Markdownのサポート
import rehypeRaw from "rehype-raw"; // HTMLをレンダリング（必要に応じて）

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Supervisor {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  slug: string;
  category: Category;
  supervisor?: Supervisor;
  user: User;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  featured_image_url?: string;
}

interface ArticleProps {
  article: Article;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const ArticlePage: React.FC<ArticleProps> = ({ article }) => {
  return (
    <>
      <Head>
        <title>{article.meta_title || article.title}</title>
        <meta
          name="description"
          content={
            article.meta_description ||
            (article.content ? article.content.slice(0, 160) : "")
          }
        />

        {/* OGPタグの追加 */}
        <meta
          property="og:title"
          content={article.meta_title || article.title}
        />
        <meta
          property="og:description"
          content={
            article.meta_description ||
            (article.content ? article.content.slice(0, 160) : "")
          }
        />
        {article.featured_image_url && (
          <meta property="og:image" content={article.featured_image_url} />
        )}
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${article.category.slug}/${article.slug}`}
        />
        <meta property="og:site_name" content="Your Site Name" />

        {/* Twitterカードの追加（オプション） */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={article.meta_title || article.title}
        />
        <meta
          name="twitter:description"
          content={
            article.meta_description ||
            (article.content ? article.content.slice(0, 160) : "")
          }
        />
        {article.featured_image_url && (
          <meta name="twitter:image" content={article.featured_image_url} />
        )}
      </Head>
      <div className="max-w-4xl mx-auto">
        {/* ナビゲーション */}
        <nav className="text-sm mb-6" aria-label="Breadcrumb">
          <ol className="flex text-gray-700 space-x-2">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ホーム
              </Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <Link
                href={`/category/${article.category.slug}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {article.category.name}
              </Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li className="text-gray-500">{article.title}</li>
          </ol>
        </nav>

        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {article.title}
          </h1>
          {article.featured_image_url && (
            <div className="w-full h-auto mb-6 rounded">
              <Image
                src={article.featured_image_url || "/default-profile.png"} // デフォルト画像を設定
                alt={article.title}
                width={800}
                height={600}
                className="w-full h-auto rounded"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}
          <div className="flex items-center text-gray-600 space-x-2">
            <span>公開日: {formatDate(article.created_at)}</span>
            {article.supervisor && (
              <>
                <span>|</span>
                <span>監修者: {article.supervisor.name}</span>
              </>
            )}
          </div>
        </header>

        {/* コンテンツ */}
        <article className="prose prose-lg">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]} // HTMLをレンダリングする場合は追加
            components={{
              img: (props) => (
                <Image
                  src={props.src || ""}
                  alt={props.alt || ""}
                  width={800}
                  height={600}
                  className="rounded"
                />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </article>

        {/* タグ */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">タグ:</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.name.toLowerCase()}`}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </section>

        {/* ソーシャルシェアボタン */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">SNSに共有:</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/${article.category.slug}/${article.slug}`
              )}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
            >
              Twitterで共有
            </Link>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/${article.category.slug}/${article.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Facebookで共有
            </Link>
          </div>
        </section>

        {/* カテゴリリンク */}
        <div className="mt-12">
          <Link href={`/category/${article.category.slug}`}>
            <span className="text-blue-600 hover:text-blue-800">
              &larr; {article.category.name}に戻る
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 認証トークンは不要のため、Authorizationヘッダーは含めない
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors || "記事の取得に失敗しました");
    }

    const article: Article = await response.json();

    console.log(article);
    return {
      props: {
        article,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("記事の取得に失敗しました:", error.message);
    } else {
      console.error("未知のエラーが発生しました");
    }
    return {
      notFound: true,
    };
  }
};

export default ArticlePage;
