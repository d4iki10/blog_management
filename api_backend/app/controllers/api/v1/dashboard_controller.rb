class Api::V1::DashboardController < ApplicationController
  before_action :authorize_request

  # GET /api/v1/dashboard
  def index
    articles_count = Article.count
    users_count = User.count
    categories_count = Category.count
    tags_count = Tag.count

    render json: {
      articles_count: articles_count,
      users_count: users_count,
      categories_count: categories_count,
      tags_count: tags_count
    }
  end
end
