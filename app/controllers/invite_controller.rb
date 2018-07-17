class InviteController < ApplicationController
  def show
  end
  def create
    @invite = Invite.new(invite_params) # Make a new Invite
    @invite.sender_id = current_user.id # set the sender to the current user
    if @invite.save!
      InviteMailer.new_user_invite(@invite, '/signups?token='+ @invite.token).deliver #send the invite data to our mailer to deliver the email
    else
      redirect_to '/'
      # oh no, creating an new invitation failed
    end
  end
  private
  def invite_params
    params.require(:invite).permit(:group_id, :email)
  end
end
