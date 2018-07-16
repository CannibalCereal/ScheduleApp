class GroupsController < ApplicationController
  def new
    @group = Group.new
  end
  def create
    @group = Group.new(group_params)
    if @group.save
      redirect_to '/'
    else
      redirect_to '/grouppage'
    end
  end

  private
  def group_params
    params.require(:group).permit(:name, :admin)
  end
end
