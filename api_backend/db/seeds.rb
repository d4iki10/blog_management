# カテゴリのシードデータ
categories_data = [
  { name: 'テクノロジー', slug: 'technology' },
  { name: 'ライフスタイル', slug: 'lifestyle' },
  { name: 'ビジネス', slug: 'business' },
]

categories = categories_data.map do |attrs|
  Category.find_or_create_by!(slug: attrs[:slug]) do |category|
    category.name = attrs[:name]
  end
end

puts "Categories created: #{categories.map(&:name).join(', ')}"

# 監修者のシードデータ
supervisors_data = [
  { name: '佐藤 太郎' },
  { name: '鈴木 次郎' },
]

supervisors = supervisors_data.map do |attrs|
  Supervisor.find_or_create_by!(name: attrs[:name])
end

puts "Supervisors created: #{supervisors.map(&:name).join(', ')}"

# ユーザーのシードデータ
admin_user = User.find_or_create_by!(email: 'admin@example.com') do |user|
  user.password = 'password'
  user.role = :admin
end

regular_user = User.find_or_create_by!(email: 'user@example.com') do |user|
  user.password = 'password'
  user.role = :user
end

puts "Users created: Admin - #{admin_user.email}, Regular - #{regular_user.email}"

# タグのシードデータ
tags_data = [
  { name: 'Ruby' },
  { name: 'Rails' },
  { name: 'JavaScript' },
  { name: 'Next.js' },
]

tags = tags_data.map do |attrs|
  Tag.find_or_create_by!(name: attrs[:name])
end

puts "Tags created: #{tags.map(&:name).join(', ')}"

# 記事のシードデータ
articles_data = [
  {
    title: 'Ruby on Railsの基礎',
    content: 'Ruby on Railsの基本的な使い方について解説します。',
    slug: 'ruby-on-rails-basics',
    category: categories.find { |c| c.slug == 'technology' },
    supervisor: supervisors.first,
    user: admin_user,
    tags: tags.select { |t| ['Ruby', 'Rails'].include?(t.name) },
    status: 'published'
  },
  {
    title: 'Next.jsでのSSRの実装',
    content: 'Next.jsを使用したサーバーサイドレンダリングの方法を紹介します。',
    slug: 'nextjs-ssr-implementation',
    category: categories.find { |c| c.slug == 'technology' },
    supervisor: supervisors.last,
    user: regular_user,
    tags: tags.select { |t| ['JavaScript', 'Next.js'].include?(t.name) },
    status: 'published'
  },
  {
    title: 'ビジネス戦略の立て方',
    content: '効果的なビジネス戦略の立て方について詳しく解説します。',
    slug: 'business-strategy-development',
    category: categories.find { |c| c.slug == 'business' },
    supervisor: supervisors.first,
    user: admin_user,
    tags: tags.select { |t| ['Rails', 'JavaScript'].include?(t.name) },
    status: 'draft'
  },
]

articles = articles_data.map do |attrs|
  Article.find_or_create_by!(slug: attrs[:slug]) do |article|
    article.title = attrs[:title]
    article.content = attrs[:content]
    article.category = attrs[:category]
    article.supervisor = attrs[:supervisor]
    article.user = attrs[:user]
    article.tags = attrs[:tags]
    article.status = attrs[:status]
  end
end

puts "Articles created: #{articles.map(&:title).join(', ')}"
