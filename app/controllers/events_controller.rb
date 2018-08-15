class EventsController < ApplicationController

  def new
  end

  def show
    @individual = Event.find(params[:id])
    @groupName = Group.find_by_id(@individual.group_id).name
    session[:currEventID] = @individual.id

    hostID = Event.find_by_id(session[:currEventID]).host_id
    @hostName = User.find_by_id(hostID).name
    @hostAvails = Availability.where('event_id = ? AND user_id = ?', session[:currEventID], hostID)
  end

  def cal
    Availability.holdCalData(params[:arr])
  end

  def userAvail
    Availability.where('event_id = ? AND user_id = ?', session[:currEventID], current_user.id).destroy_all
    Availability.addAvails(current_user.id, session[:currEventID], params[:avails])
    redirect_to '/eventpage'
  end

  def getAvails
    hostID = Event.find_by_id(session[:currEventID]).host_id
    currHost = current_user.id == hostID
    oldAvails = []
    avails = []
    if currHost
      avails = Availability.where('event_id = ?', session[:currEventID])
    else
      oldAvails = Availability.where('event_id = ? AND user_id = ?', session[:currEventID], current_user.id)
      avails = Availability.where('event_id = ? AND user_id = ?', session[:currEventID], hostID)
    end
    respond_to do |format|
      format.html
      format.json { render :json => { :avails => avails, :oldAvails => oldAvails } }
    end
  end

  def deleteAvails
    Availability.where('event_id = ? AND user_id = ?', session[:currEventID], current_user.id).destroy_all
  end

  def deleteEvent
    Availability.where('event_id = ?', session[:currEventID]).destroy_all
    Event.find_by_id(session[:currEventID]).destroy
    session[:currEventID] = ''
    redirect_to '/eventpage'
  end

  def finalize
    FinalEvent.finalizeEvent(session[:currEventID], params[:time])
    Event.find_by_id(session[:currEventID]).update(isFinal: true)
    Availability.where('event_id = ?', session[:currEventID]).destroy_all
    session[:currEventID] = ''
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

  def showFinal
    @individual = Event.find(params[:id])
    @groupName = Group.find_by_id(@individual.group_id).name
    hostID = Event.find_by_id(session[:currEventID]).host_id
    @hostName = User.find_by_id(hostID).name
    @start  = FinalEvent.find(params[:id]).start.split('T')
  end

  private
  def event_params
    params.permit(:arr)
    params.require(:event).permit(:group_id, :title, :host_id, :location, :description, :isFinal)
  end
end
