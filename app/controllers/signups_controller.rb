class SignupsController < ApplicationController
  def new
    @user = User.new
  end
  def create
    @user = User.new(signup_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path
    else
      redirect_to '/landing'
    end
  end

  private
  def signup_params
    params.require(:user).permit(:email, :name, :password)
  end
end
