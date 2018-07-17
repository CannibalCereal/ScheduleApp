class InviteMailer < ApplicationMailer

  def new_user_invite (invite, link)
    logger.debug link
  end
end
