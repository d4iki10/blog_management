class Article < ApplicationRecord
  belongs_to :user
  belongs_to :category, optional: true
  belongs_to :supervisor, optional: true
  has_many :article_tags, dependent: :destroy
  has_many :tags, through: :article_tags

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :status, presence: true, inclusion: { in: %w[draft published] }

  # コールバックの追加
  before_validation :generate_slug, on: :create

  scope :published, -> { where(status: 'published') }
  scope :draft, -> { where(status: 'draft') }

  private

  def generate_slug
    return if slug.present?
    # タイトルまたはトピックからスラッグを生成
    base_slug = title.presence || topic.presence || "article"
    base_slug = base_slug.to_s.downcase.strip.gsub(/\s+/, "-").gsub(/[^\w-]/, "")
    base_slug = base_slug.chomp("-") # 末尾のハイフンを削除

    unique_slug = base_slug
    counter = 1
    while Article.exists?(slug: unique_slug)
      unique_slug = "#{base_slug}-#{counter}"
      counter += 1
    end

    Rails.logger.debug "Generated slug: #{unique_slug}"
    self.slug = unique_slug
  end
end
