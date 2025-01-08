class Api::V1::TagsController < ApplicationController
  before_action :authorize_request, only: [:create, :update, :destroy]
  before_action :set_tag, only: [:show, :update, :destroy]

  # GET /api/v1/tags
  def index
    if params[:slug].present?
      @tags = Tag.where(slug: params[:slug])
    else
      @tags = Tag.all
    end
    render json: @tags
  end

  # GET /api/v1/tags/:id
  def show
    render json: @tag
  end

  # POST /api/v1/tags
  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      render json: @tag, status: :created
    else
      render json: { errors: @tag.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/tags/:id
  def update
    if @tag.update(tag_params)
      render json: @tag
    else
      render json: { errors: @tag.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/tags/:id
  def destroy
    @tag.destroy
    head :no_content
  end

  private

  def set_tag
    @tag = Tag.find(params[:id])
  end

  def tag_params
    params.require(:tag).permit(:name, :slug)
  end
end
