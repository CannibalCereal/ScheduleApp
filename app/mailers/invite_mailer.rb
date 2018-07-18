class InviteMailer < ApplicationMailer

  def new_user_invite (invite, link)
    @sender = User.find_by_id(invite.sender)
    @link = link
  end
end
