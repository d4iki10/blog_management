class MediaSerializer < ActiveModel::Serializer
  attributes :id, :filename, :content_type, :byte_size, :url

  def url
    Rails.application.routes.url_helpers.url_for(object)
  end
end
