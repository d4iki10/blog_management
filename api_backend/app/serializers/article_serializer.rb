class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :slug, :status, :created_at, :updated_at

  belongs_to :user
  belongs_to :category
  belongs_to :supervisor, if: -> { object.supervisor.present? }
  has_many :tags
end
