class GroupsController < ApplicationController
  def new
    @group = Group.new
    @invite = Invite.new
  end
  def create
    @group = Group.new(group_params)
    if @group.save
      Membership.newgroup(current_user.id, @group.id)
      redirect_to '/'
    else
      redirect_to '/grouppage'
    end
  end

  private
  def group_params
    params.require(:group).permit(:name, :admin_id)
  end
end
