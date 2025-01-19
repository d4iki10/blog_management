/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*", // バックエンドのURL
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost", // IPv4/IPv6どちらでもlocalhost扱いになる
        // ↑ ActiveStorageのURLパターンに合うようにワイルドカードを設定
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // 例: Cloudinaryのホスト
      },
      {
        protocol: "https",
        hostname: "blog-management-zlrw.onrender.com", // 例: バックエンドが画像を提供している場合
      },
    ],
  },
};

module.exports = nextConfig;
