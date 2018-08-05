class Availability < ApplicationRecord
  belongs_to :event
  belongs_to :user, optional: true

  def self.holdCalData (data)
    @data = data
  end

  def self.createAvailsHeldData(userid, eventid)
    JSON.parse(@data).each do |e|
      @avail = Availability.new(:user_id=>userid, :event_id=>eventid, :start=>e['start'], :end=>e['end'])
      @avail.save!
    end
  end

  def self.addAvails(userid, eventid, avails)
    JSON.parse(avails).each do |e|
      @avail = Availability.new(:user_id=>userid, :event_id=>eventid, :start=>e['start'], :end=>e['end'])
      @avail.save!
    end
  end
end
