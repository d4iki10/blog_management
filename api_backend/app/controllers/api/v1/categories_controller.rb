class Api::V1::CategoriesController < ApplicationController
  before_action :authorize_request
  before_action :set_category, only: [:show, :update, :destroy]

  # GET /api/v1/categories
  def index
    @categories = Category.all
    render json: @categories
  end

  # GET /api/v1/categories/:slug
  def show
    render json: @category
  end

  # POST /api/v1/categories
  def create
    @category = Category.new(category_params)
    if @category.save
      render json: @category, status: :created
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/categories/:slug
  def update
    if @category.update(category_params)
      render json: @category
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/categories/:slug
  def destroy
    @category.destroy
    head :no_content
  end

  private

  def set_category
    @category = Category.find_by!(slug: params[:slug])
  end

  def category_params
    params.require(:category).permit(:name, :slug)
  end
end
