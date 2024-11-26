class Api::V1::AuthenticationController < ApplicationController
  skip_before_action :authorize_request, only: [:login]

  # POST /api/v1/auth/login
  def login
    @user = User.find_by(email: params[:email])
    if @user&.authenticate(params[:password])
      token = jwt_encode(user_id: @user.id)
      render json: { token: token, user: UserSerializer.new(@user) }, status: :ok
    else
      render json: { error: '無効なメールアドレスまたはパスワードです' }, status: :unauthorized
    end
  end

  private

  def login_params
    params.permit(:email, :password)
  end
end
