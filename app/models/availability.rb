class Availability < ApplicationRecord
  belongs_to :event
  belongs_to :user, optional: true

  def self.holdData (data)
    @data = data
  end

  def self.createAvailabilities(userid, eventid)
    JSON.parse(@data).each do |e|
      @avail = Availability.new(:user_id=>userid, :event_id=>eventid, :start=>e['start'], :end=>e['end'])
      @avail.save!
    end
  end
end
