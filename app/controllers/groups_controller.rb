class GroupsController < ApplicationController
  def new
    @group = Group.new
  end
  def create
    @group = Group.new(group_params)
    @group.save
  end

  private
  def group_params
    params.require(:group).permit(:name, :admin)
  end
end
