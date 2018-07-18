# Preview all emails at http://localhost:3000/rails/mailers/invite_mailer
class InviteMailerPreview < ActionMailer::Preview
  def invite_preview
    InviteMailer.new_user_invite(Invite.first, "aaa/aaa")
  end
end
