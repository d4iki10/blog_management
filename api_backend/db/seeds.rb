# db/seeds.rb

# カテゴリのシードデータ
categories = [
  { name: 'テクノロジー', slug: 'technology' },
  { name: 'ライフスタイル', slug: 'lifestyle' },
  { name: 'ビジネス', slug: 'business' },
].map do |category_attrs|
  Category.find_or_create_by!(slug: category_attrs[:slug]) do |category|
    category.name = category_attrs[:name]
  end
end

# 監修者のシードデータ
supervisors = [
  { name: '佐藤 太郎' },
  { name: '鈴木 次郎' },
].map do |supervisor_attrs|
  Supervisor.find_or_create_by!(name: supervisor_attrs[:name])
end

# ユーザーのシードデータ（管理者）
admin_user = User.find_or_create_by!(email: 'admin@example.com') do |user|
  user.password = 'password'
  user.role = :admin
end

# 一般ユーザーのシードデータ
regular_user = User.find_or_create_by!(email: 'user@example.com') do |user|
  user.password = 'password'
  user.role = :user
end

# タグのシードデータ
tags = [
  { name: 'Ruby' },
  { name: 'Rails' },
  { name: 'JavaScript' },
  { name: 'Next.js' },
].map do |tag_attrs|
  Tag.find_or_create_by!(name: tag_attrs[:name])
end

# 記事のシードデータ
articles_data = [
  {
    title: 'Ruby on Railsの基礎',
    content: 'Ruby on Railsの基本的な使い方について解説します。',
    slug: 'ruby-on-rails-basics',
    category: categories[0],
    supervisor: supervisors[0],
    user: admin_user,
    tags: [tags[0], tags[1]]
  },
  {
    title: 'Next.jsでのSSRの実装',
    content: 'Next.jsを使用したサーバーサイドレンダリングの方法を紹介します。',
    slug: 'nextjs-ssr-implementation',
    category: categories[0],
    supervisor: supervisors[1],
    user: regular_user,
    tags: [tags[2], tags[3]]
  },
  {
    title: 'ビジネス戦略の立て方',
    content: '効果的なビジネス戦略の立て方について詳しく解説します。',
    slug: 'business-strategy-development',
    category: categories[2],
    supervisor: supervisors[0],
    user: admin_user,
    tags: [tags[1], tags[2]]
  },
]

articles_data.each do |article_attrs|
  Article.find_or_create_by!(slug: article_attrs[:slug]) do |article|
    article.title = article_attrs[:title]
    article.content = article_attrs[:content]
    article.category = article_attrs[:category]
    article.supervisor = article_attrs[:supervisor]
    article.user = article_attrs[:user]
    article.tags = article_attrs[:tags]
  end
end
