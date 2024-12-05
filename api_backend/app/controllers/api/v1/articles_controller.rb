class Api::V1::ArticlesController < ApplicationController
  # 管理者用アクションには認証を必須
  before_action :authorize_request, only: [:create, :update, :destroy, :publish]
  # index と show アクションでは認証をオプション
  before_action :optional_authorize_request, only: [:index, :show]
  # 記事の取得
  before_action :set_article, only: [:show, :update, :destroy, :publish]

  # GET /api/v1/articles
  def index
    if @current_user
      # 管理者リクエスト: すべての記事を取得
      articles = Article.includes(:category, :tags, :supervisor, :user).order(created_at: :desc)
    else
      # 公開リクエスト: 'published' のみ取得
      articles = Article.where(status: 'published').includes(:category, :tags, :supervisor, :user).order(created_at: :desc)
    end
    render json: articles, status: :ok
  end

  # GET /api/v1/articles/:slug
  def show
    if @current_user || @article.status == 'published'
      render json: @article, status: :ok
    else
      render json: { error: '記事が見つかりません' }, status: :not_found
    end
  end

  # POST /api/v1/articles
  def create
    Rails.logger.info "Creating a new article with params: #{article_params.to_h}"
    # タイトルが空の場合、キーワードからタイトルを生成
    generated_title = article_params[:title].blank? ? "#{article_params[:topic]}に関する記事" : article_params[:title]
    # スラッグが空の場合、タイトルからスラッグを生成
    generated_slug = article_params[:slug].blank? ? slugify(generated_title) : article_params[:slug]
    # Articleの新規作成
    article = @current_user.articles.new(
      title: generated_title,
      content: article_params[:content] || "",
      category_id: article_params[:category_id] || 2,
      supervisor_id: article_params[:supervisor_id],
      tag_ids: article_params[:tag_ids],
      slug: generated_slug,
      status: 'draft' # 下書きとして設定
    )

    if article.save
      Rails.logger.info "Article created with ID #{article.id}"
      # バックグラウンドジョブをキューに追加
      ArticleGenerationJob.perform_later(article.id, article_params.to_h)
      render json: { message: '記事生成を開始しました。下書きが作成されます。', article: ArticleSerializer.new(article) }, status: :accepted
    else
      Rails.logger.error "Article creation failed: #{article.errors.full_messages}"
      render json: { errors: article.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/articles/:slug
  def update
    if @article.update(article_update_params)
      render json: { message: '記事が更新されました。', article: ArticleSerializer.new(@article) }, status: :ok
    else
      render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/articles/:slug
  def destroy
    @article.destroy
    render json: { message: '記事が削除されました。' }, status: :ok
  end

  # POST /api/v1/articles/:slug/publish
  def publish
    if @article.update(status: 'published')
      Rails.logger.info "Article ID #{@article.id} published successfully"
      render json: { message: '記事が公開されました。', article: ArticleSerializer.new(@article) }, status: :ok
    else
      Rails.logger.error "Article publish failed for ID #{@article.id}: #{@article.errors.full_messages}"
      render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_article
    @article = Article.find_by(slug: params[:slug])
    unless @article
      render json: { error: '記事が見つかりません' }, status: :not_found
    end
  end

  def article_params
    params.require(:article).permit(:title, :slug, :category_id, :supervisor_id, :topic, :content, tag_ids: [])
  end

  def article_update_params
    params.require(:article).permit(:title, :slug, :category_id, :supervisor_id, :status, :content, tag_ids: [])
  end

  def slugify(text)
    # 日本語の文字もスラッグに含めるため、Unicode対応の正規表現を使用
    base_slug = text.to_s.downcase.strip.gsub(/\s+/, "-").gsub(/[^\p{L}\p{N}-]/u, "")
    base_slug = base_slug.chomp("-")
    base_slug = "article" if base_slug.empty?

    unique_slug = base_slug
    counter = 1
    while Article.exists?(slug: unique_slug)
      unique_slug = "#{base_slug}-#{counter}"
      counter += 1
    end
    unique_slug
  end
end
