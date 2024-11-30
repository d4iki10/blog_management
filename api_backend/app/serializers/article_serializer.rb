class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :slug, :category, :supervisor, :tags, :status, :created_at, :updated_at

  belongs_to :user
  belongs_to :category
  belongs_to :supervisor
  has_many :tags

  def category
    object.category.name
  end

  def supervisor
    object.supervisor&.name
  end

  def tags
    object.tags.map(&:name)
  end
end
