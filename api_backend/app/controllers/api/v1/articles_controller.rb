class Api::V1::ArticlesController < ApplicationController
  before_action :set_article, only: [:show, :update, :destroy]
  skip_before_action :authorize_request, only: [:index, :show]

  # GET /api/v1/articles
  def index
    articles = Article.page(params[:page]).per(params[:per_page])
    render json: articles, each_serializer: ArticleSerializer, meta: pagination_meta(articles)
  end

  # GET /api/v1/articles/:slug
  def show
    render json: @article, serializer: ArticleSerializer
  end

  # POST /api/v1/articles
  def create
    article = Article.new(article_params)
    if article.save
      render json: article, serializer: ArticleSerializer, status: :created
    else
      render json: { errors: article.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/articles/:slug
  def update
    if @article.update(article_params)
      render json: @article, serializer: ArticleSerializer
    else
      render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/articles/:slug
  def destroy
    @article.destroy
    head :no_content
  end

  private

  def set_article
    @article = Article.find_by!(slug: params[:slug])
  end

  def article_params
    params.require(:article).permit(:title, :content, :slug, :category_id, :supervisor_id, tag_ids: [])
  end

  def pagination_meta(collection)
    {
      current_page: collection.current_page,
      next_page: collection.next_page,
      prev_page: collection.prev_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count
    }
  end
end
