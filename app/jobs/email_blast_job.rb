class EmailBlastJob < ApplicationJob
  queue_as :default

  def perform(event)
    Group.find_by_id(event.group_id).users.each do |u|
      InviteMailer.sendPendingEvent(event, u.email).deliver
    end
  end
end
