class EventsController < ApplicationController



  def new
  end

  def cal
    session[:something] = params[:arr]
    JSON.parse(session[:something]).each do |e|
      logger.debug e['start']
      logger.debug e['end']
    end
  end

  def create
    @event = Event.new(event_params)
    if(@event.save)
      # Availability.foo(@event.id, current_user.id, e['start'], e['end'])
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
