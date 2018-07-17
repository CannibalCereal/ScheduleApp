class Membership < ApplicationRecord
  belongs_to :group
  belongs_to :user

  def self.newgroup(userid, groupid)
    @membership = Membership.new({"user_id" => userid, "group_id" => groupid})
    @membership.save
    Rails.logger.debug @membership
  end
end
