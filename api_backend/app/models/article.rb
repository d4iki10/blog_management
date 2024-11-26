class Article < ApplicationRecord
  belongs_to :user
  belongs_to :category, optional: true
  belongs_to :supervisor, optional: true
  has_many :article_tags, dependent: :destroy
  has_many :tags, through: :article_tags

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true
end
