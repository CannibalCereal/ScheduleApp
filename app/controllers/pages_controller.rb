class PagesController < ApplicationController
  before_action :require_user, only: [:home, :eventpage, :grouppage]
  def landing
  end

  def home
  end

  def eventpage
  end

  def grouppage
    #@group = Group.find_by_id(1)
    #@members = @group.users 

    @user = User.find_by_id(current_user.id)
    @groups = @user.groups
  end
end
