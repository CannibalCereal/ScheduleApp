class SessionsController < ApplicationController
  def new
  end
  def create
    @user = User.find_by_email(params[:session][:email])
    if @user && @user.authenticate(params[:session][:password])
      session[:user_id] = @user.id
      redirect_to '/landing'
    else
      flash[:notice] = "Incorrect login/password. 4 more failed attempts and this computer will explode."
      redirect_to '/login'
    end
  end
  def destroy
    session[:user_id] = nil
    redirect_to '/login'
  end
end
