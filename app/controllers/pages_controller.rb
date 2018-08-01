class PagesController < ApplicationController
  before_action :require_user, only: [:home, :eventpage, :grouppage]
  def landing
  end

  def home
    @groups = User.find_by_id(current_user.id).groups
  end

  def eventpage
    # LiSt OF ALL EVENTS YOU ARE A PART OF:
      # GET ALL YOUR GROUPS
      myGroups = User.find_by_id(current_user.id).groups
      # FOR EACH OF YOUR GROUPS, LIST ALL EVENTS
      @allMyEvents = []
      myGroups.each do |g|
        events = Event.where("group_id = ?", g.id)
        events.each do |e|
          @allMyEvents << e
        end
      end
  end

  def grouppage
    #@group = Group.find_by_id(1)
    #@members = @group.users

    @user = User.find_by_id(current_user.id)
    @groups = @user.groups
  end
  def addmember
    #Grabs group_id from clicking add member icon from group card
    group_id = params[:group]
    logger.debug "THIS IS GROUP ID LOOK AT IT " + group_id
    Group.holdGroup(group_id)
  end
end
