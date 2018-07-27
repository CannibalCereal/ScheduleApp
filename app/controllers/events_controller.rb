class EventsController < ApplicationController

  def new
  end

  def cal
    Availability.holdData(params[:arr])
  end

  def create
    @event = Event.new(event_params)
    if @event.save
      Group.find_by_id(@event.group_id).users.each do |u|
        InviteMailer.sendPendingEvent(@event, u.email).deliver
      end
      Availability.createAvailabilities(current_user.id, @event.id)
      redirect_to '/eventpage'
    else
      redirect_to '/createevent'
    end
  end

  private
  def event_params
    params.permit(:arr)
    params.require(:event).permit(:group_id, :title, :host_id, :location, :description)
  end
end
