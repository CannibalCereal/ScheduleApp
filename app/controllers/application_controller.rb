class ApplicationController < ActionController::Base
  helper_method :current_user
  before_action :handle_token

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def require_user
    redirect_to '/landing' unless current_user
  end

  def handle_token
    @token = params[:token]
  end

end
