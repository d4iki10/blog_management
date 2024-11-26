class Api::V1::AuthenticationController < ApplicationController
  # POST /api/v1/auth/signup
  def signup
    user = User.new(user_params)
    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /api/v1/auth/login
  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = encode_token({ user_id: user.id, exp: (DateTime.now + 1000).to_i })
      render json: { token: token }, status: :ok
    else
      render json: { error: '認証に失敗しました' }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :role)
  end

  # JWTエンコードの実装（後述のセキュリティ対策で詳細を追加）
  def encode_token(payload)
    JWT.encode(payload, Rails.application.secrets.secret_key_base)
  end
end
