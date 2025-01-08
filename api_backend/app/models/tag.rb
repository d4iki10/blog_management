class Tag < ApplicationRecord
  has_many :article_tags, dependent: :destroy
  has_many :articles, through: :article_tags
  
  before_validation :generate_slug, on: :create

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true

  private

  def generate_slug
    base_slug = name.to_s.downcase.strip.gsub(/\s+/, "-").gsub(/[^\p{L}\p{N}-]/u, "")
    base_slug = base_slug.chomp("-")
    base_slug = "tag" if base_slug.empty?

    unique_slug = base_slug
    counter = 1
    while Tag.exists?(slug: unique_slug)
      unique_slug = "#{base_slug}-#{counter}"
      counter += 1
    end
    self.slug = unique_slug
  end
end
