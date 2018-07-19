class Membership < ApplicationRecord
  belongs_to :group
  belongs_to :user

  def self.addUserToGroup(userid, groupid)
    @membership = Membership.new({"user_id" => userid, "group_id" => groupid})
    if @membership.save
      logger.debug "ADDED TO MEMBERSHIP"
    end
  end
end
