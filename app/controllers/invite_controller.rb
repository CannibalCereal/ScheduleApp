class InviteController < ApplicationController
  def show
  end
  def create
    @invite = Invite.new(invite_params) # Make a new Invite
    @invite.sender_id = current_user.id # set the sender to the current user
    if @invite.save
      if(@invite.recipient_id != nil)
        Membership.where('user_id = ?', @invite.recipient_id).select(:group_id).each do |m|
          if(m.group_id == @invite.group_id)
            #TODO FOR JOSH ONLY: render a modal to let the user know they fucked up
            redirect_to '/eventpage'
            return
          end
        end
        Membership.addUserToGroup(@invite.recipient_id, @invite.group_id)
        InviteMailer.inviteExistingUser(@invite).deliver
      else
        InviteMailer.inviteNewUser(@invite, '/landing?token='+ @invite.token).deliver #send the invite data to our mailer to deliver the email
      end
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
