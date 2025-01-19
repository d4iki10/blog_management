class Api::V1::MediaController < ApplicationController
  before_action :authorize_request
  include Rails.application.routes.url_helpers

  # GET /api/v1/media
  def index
    media = ActiveStorage::Blob.all.order(created_at: :desc)
    media_data = media.map do |blob|
      {
        id: blob.id,
        filename: blob.filename.to_s,
        content_type: blob.content_type,
        byte_size: blob.byte_size,
        url: url_for(blob) # 正しくフルURLが生成されます
      }
    end
    render json: media_data, status: :ok
  rescue => e
    Rails.logger.error "メディア取得エラー: #{e.class} - #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: 'メディアの取得に失敗しました。' }, status: :internal_server_error
  end

  # POST /api/v1/media/upload
  def upload
    if params[:file].present?
      image = ActiveStorage::Blob.create_and_upload!(
        io: params[:file].tempfile,
        filename: params[:file].original_filename,
        content_type: params[:file].content_type
      )
      media_data = {
        id: image.id,
        filename: image.filename.to_s,
        content_type: image.content_type,
        byte_size: image.byte_size,
        url: url_for(image) # 正しくフルURLが生成されます
      }
      render json: media_data, status: :ok
    else
      render json: { error: 'ファイルが提供されていません。' }, status: :bad_request
    end
  rescue => e
    Rails.logger.error "画像アップロードエラー: #{e.class} - #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
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
    Rails.logger.error "画像削除エラー: #{e.class} - #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: '画像の削除に失敗しました。' }, status: :internal_server_error
  end
end
