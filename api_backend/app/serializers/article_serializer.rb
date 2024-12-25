class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :slug, :meta_title, :meta_description, :featured_image_url, :status, :created_at, :updated_at

  belongs_to :user
  belongs_to :category
  belongs_to :supervisor, if: -> { object.supervisor.present? }
  has_many :tags
end
