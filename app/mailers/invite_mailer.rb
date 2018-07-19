class InviteMailer < ApplicationMailer
  default from: "no.reply.corral@gmail.com"

  def inviteNewUser (invite, link)
    @sender = User.find_by_id(invite.sender)
    @link = link
    @group_name = Group.find_by_id(invite.group_id).name
    mail(to: invite.email, subject: 'You\'ve been invited to a Corral group!', template_name: 'invite')
  end

  def inviteExistingUser (invite)
    @sender = User.find_by_id(invite.sender)
    @group_name = Group.find_by_id(invite.group_id).name
    mail(to: invite.email, subject: 'You\'ve been added to a Corral group!', template_name: 'exist')
  end
end
