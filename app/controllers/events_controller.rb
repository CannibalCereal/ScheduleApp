class EventsController < ApplicationController



  def new
  end

  def cal
    Availability.holdData(params[:arr])
  end

  def create
    @event = Event.new(event_params)
    if(@event.save)
      Availability.createAvailabilities(@event.id, current_user.id)
      redirect_to '/eventpage'
    else
      redirect_to '/createevent'
    end
  end

  private
  def event_params
    params.permit(:arr)
    params.require(:event).permit(:title, :host, :location, :description)
  end
end
