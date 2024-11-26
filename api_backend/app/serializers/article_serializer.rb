class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :slug, :category, :supervisor, :tags, :created_at, :updated_at

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
