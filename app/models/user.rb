class User < ApplicationRecord
  has_secure_password
  has_many :memberships
  has_many :groups, through: :memberships
  has_many :invitations, :class_name => "Invite", :foreign_key => 'recipient_id'
  has_many :sent_invites, :class_name => "Invite", :foreign_key => 'sender_id'
end
