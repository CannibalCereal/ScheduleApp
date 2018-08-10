class FinalEvent < ApplicationRecord
  belongs_to :event

  def self.finalizeEvent (eventid, start)
    newFinal = FinalEvent.new(:event_id=>eventid, :start=>start)
    newFinal.save!
  end
end
