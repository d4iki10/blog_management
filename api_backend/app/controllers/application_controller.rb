class ApplicationController < ActionController::API
  require 'jwt'

  private

  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      @decoded = jwt_decode(header)
      @current_user = User.find(@decoded[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: 'ユーザーが見つかりません' }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: '無効なトークンです' }, status: :unauthorized
    end
  end

  # optional_authorize_request を定義
  def optional_authorize_request
    header = request.headers['Authorization']
    if header
      header = header.split(' ').last
      begin
        @decoded = jwt_decode(header)
        @current_user = User.find(@decoded[:user_id])
      rescue ActiveRecord::RecordNotFound, JWT::DecodeError
        @current_user = nil
      end
    else
      @current_user = nil
    end
  end

  # current_userメソッドを追加
  def current_user
    @current_user
  end

  def jwt_encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    secret_key = Rails.application.credentials.secret_key_base
    JWT.encode(payload, secret_key)
  end

  def jwt_decode(token)
    secret_key = Rails.application.credentials.secret_key_base
    decoded = JWT.decode(token, secret_key)[0]
    HashWithIndifferentAccess.new decoded
  end
end
