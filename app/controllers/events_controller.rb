class EventsController < ApplicationController
  def new
  end

  def create
    @event = Event.new(event_params)
    if(@event.save)
      redirect_to '/eventpage'
    else
      redirect_to '/createevent'
    end
  end


  private
  def event_params
    params.require(:event).permit(:title, :host, :location, :description)
  end
end
