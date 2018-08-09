class EventsController < ApplicationController

  def new
  end

  def show
    @individual = Event.find(params[:id])
    @groupName = Group.find_by_id(@individual.group_id).name
    session[:currEventID] = @individual.id

    hostID = Event.find_by_id(session[:currEventID]).host_id
    @hostAvails = Availability.where('event_id = ? AND user_id = ?', session[:currEventID], hostID)


  end

  def cal
    Availability.holdCalData(params[:arr])
  end

  def userAvail
    Availability.addAvails(current_user.id, session[:currEventID], params[:avails])
  end

  def hostAvails
    hostID = Event.find_by_id(session[:currEventID]).host_id
    hostAvails = Availability.where('event_id = ? AND user_id = ?', session[:currEventID], hostID)
    respond_to do |format|
      format.html
      format.json { render json: hostAvails }
    end
  end

  def create
    @event = Event.new(event_params)
    if @event.save
      Group.find_by_id(@event.group_id).users.each do |u|
        InviteMailer.sendPendingEvent(@event, u.email).deliver
      end
      Availability.createAvailsHeldData(current_user.id, @event.id)
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
