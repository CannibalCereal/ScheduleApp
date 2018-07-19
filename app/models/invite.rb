class Invite < ApplicationRecord
  belongs_to :group
  belongs_to :sender, :class_name => 'User'
  belongs_to :recipient, :class_name => 'User', optional: true

  before_create :generate_token
  before_save :checkExistingUser

  def generate_token
    self.token = Digest::SHA1.hexdigest([self.group_id, Time.now, rand].join)
  end

  def checkExistingUser
    recipient = User.find_by_email(self.email)
    if(recipient)
      self.recipient_id = recipient.id
    end
  end
end
