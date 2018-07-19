class SignupsController < ApplicationController
  def new
    @user = User.new
  end
  def create
    @user = User.new(signup_params)
    if @user.save
      session[:user_id] = @user.id

      #if the user was invited to a group, handle that here
      @token = params[:user][:invite_token]
      if(@token != nil)
        group = Invite.find_by_token(@token).group_id
        Membership.addUserToGroup(current_user.id, group)
      end

      redirect_to root_path
    else
      redirect_to '/landing'
    end
  end

  private
  def signup_params
    params.permit(:invite_token)
    params.require(:user).permit(:email, :name, :password)
  end
end
