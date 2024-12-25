# api_backend/app/controllers/api/v1/media_controller.rb
class Api::V1::MediaController < ApplicationController
  before_action :authorize_request

  # GET /api/v1/media
  def index
    media = ActiveStorage::Blob.all.order(created_at: :desc)
    render json: media.map { |blob|
      {
        id: blob.id,
        filename: blob.filename.to_s,
        content_type: blob.content_type,
        byte_size: blob.byte_size,
        url: Rails.application.routes.url_helpers.url_for(blob)
      }
    }, status: :ok
  end

  # POST /api/v1/media/upload
  def upload
    if params[:file].present?
      image = ActiveStorage::Blob.create_and_upload!(
        io: params[:file].tempfile,
        filename: params[:file].original_filename,
        content_type: params[:file].content_type
      )
      render json: {
        id: image.id,
        filename: image.filename.to_s,
        content_type: image.content_type,
        byte_size: image.byte_size,
        url: Rails.application.routes.url_helpers.url_for(image)
      }, status: :ok
    else
      render json: { error: 'ファイルが提供されていません。' }, status: :bad_request
    end
  rescue => e
    Rails.logger.error "画像アップロードエラー: #{e.message}"
    render json: { error: '画像のアップロードに失敗しました。' }, status: :internal_server_error
  end

  # DELETE /api/v1/media/:id
  def destroy
    blob = ActiveStorage::Blob.find_by(id: params[:id])
    if blob
      blob.purge
      render json: { message: '画像が削除されました。' }, status: :ok
    else
      render json: { error: '画像が見つかりません。' }, status: :not_found
    end
  rescue => e
    Rails.logger.error "画像削除エラー: #{e.message}"
    render json: { error: '画像の削除に失敗しました。' }, status: :internal_server_error
  end
end
