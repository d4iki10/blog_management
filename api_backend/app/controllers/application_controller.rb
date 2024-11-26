class ApplicationController < ActionController::API
  before_action :set_pagination_params

  private

  def set_pagination_params
    params[:page] ||= 1
    params[:per_page] ||= 10
  end
end
