class Membership < ApplicationRecord
  belongs_to :group
  belongs_to :user

  def self.addUserToGroup(userid, groupid)
    @membership = Membership.new({"user_id" => userid, "group_id" => groupid})
    @membership.save
  end
end
