class InviteMailer < ApplicationMailer
  default from: "no.reply.corral@gmail.com"

  def new_user_invite (invite, link)
    @sender = User.find_by_id(invite.sender)
    @link = link
    mail(to: invite.email, subject: 'You\'ve been invited to a Corral group!', template_name: 'invite')
  end
end
