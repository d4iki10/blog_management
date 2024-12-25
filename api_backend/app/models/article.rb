class Article < ApplicationRecord
  belongs_to :user
  belongs_to :category, optional: true
  belongs_to :supervisor, optional: true
  has_many :article_tags, dependent: :destroy
  has_many :tags, through: :article_tags
  has_one_attached :featured_image  # アイキャッチ画像の添付

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :status, presence: true, inclusion: { in: %w[draft published] }
  validates :meta_title, length: { maximum: 60 }, allow_blank: true
  validates :meta_description, length: { maximum: 160 }, allow_blank: true
  validates :featured_image_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), message: "は有効なURLでなければなりません" }, allow_blank: true

  before_validation :generate_slug, on: :create
  before_save :set_default_seo_fields

  scope :published, -> { where(status: 'published') }
  scope :draft, -> { where(status: 'draft') }

  private

  def generate_slug
    return if slug.present?
    base_slug = title.presence || "article"
    base_slug = base_slug.to_s.downcase.strip.gsub(/\s+/, "-").gsub(/[^\w-]/, "")
    base_slug = base_slug.chomp("-")

    unique_slug = base_slug
    counter = 1
    while Article.exists?(slug: unique_slug)
      unique_slug = "#{base_slug}-#{counter}"
      counter += 1
    end

    Rails.logger.debug "Generated slug: #{unique_slug}"
    self.slug = unique_slug
  end

  def set_default_seo_fields
    self.meta_title ||= title
    self.meta_description ||= content.truncate(160)
  end
end
